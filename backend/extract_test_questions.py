#!/usr/bin/env python3
"""
Test Series PDF Question & Highlighted Answer Extractor
Author: Bharathi Thervukalam Engine
Supports: PyMuPDF (fitz) text and annotation scanning, RGB font color detection,
highlight annotation extraction, multi-lingual Tamil & English question parsing.
"""

import sys
import os
import json
import re
from typing import Dict, List, Any, Optional

try:
    import fitz  # PyMuPDF
except ImportError:
    print("Error: PyMuPDF is not installed. Please install using `pip install PyMuPDF`.", file=sys.stderr)
    sys.exit(1)


def is_color_highlighted(color_int: int) -> bool:
    """
    Check if a text color represents a highlight or answer marker
    (e.g., Red, Crimson, Dark Red, Orange-Red, Green).
    In PyMuPDF, color is an integer in sRGB format (0xRRGGBB).
    """
    if color_int == 0:
        return False  # Standard Black

    r = (color_int >> 16) & 255
    g = (color_int >> 8) & 255
    b = color_int & 255

    # Check for Red/Reddish color (R dominates G and B)
    if r > 140 and g < 100 and b < 100:
        return True
    # Check for Dark Red/Maroon
    if r > 120 and g < 60 and b < 60:
        return True
    # Check for Green (sometimes used for correct answer)
    if g > 140 and r < 90 and b < 90:
        return True
    # Check for Bright Blue or Purple highlight
    if (r > 150 and b > 150 and g < 100):
        return True

    return False


def extract_questions_from_pdf(pdf_path: str) -> Dict[str, Any]:
    """
    Extracts questions and highlighted answers from a given PDF file.
    """
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"PDF file not found at: {pdf_path}")

    doc = fitz.open(pdf_path)
    extracted_questions = []
    question_counter = 0

    option_pattern = re.compile(r'^\s*[\(\[]?([A-Ea-e])[\)\]\.\-]\s*(.*)$')
    q_start_pattern = re.compile(r'^\s*(?:Question|Q|வினா)?\s*(\d+)[\.\)\-\:]\s*(.*)$', re.IGNORECASE)

    current_q: Optional[Dict[str, Any]] = None
    all_raw_spans = []

    for page_num in range(len(doc)):
        page = doc[page_num]

        # 1. Gather all highlight annotations on the page
        highlight_rects = []
        for annot in page.annots():
            if annot.type[0] == 8:  # 8 is Highlight annotation in fitz
                highlight_rects.append(annot.rect)

        # 2. Extract detailed text spans with font and color information
        page_dict = page.get_text("dict")
        blocks = page_dict.get("blocks", [])

        for b in blocks:
            if b.get("type") == 0:  # Text block
                for line in b.get("lines", []):
                    line_text = ""
                    is_line_colored = False
                    is_line_highlighted = False
                    spans_info = []

                    for span in line.get("spans", []):
                        text = span.get("text", "")
                        if not text.strip():
                            continue
                        color = span.get("color", 0)
                        bbox = fitz.Rect(span.get("bbox"))
                        flags = span.get("flags", 0)

                        # Check if colored
                        colored = is_color_highlighted(color)
                        # Check if inside highlight annotation rect
                        annot_hl = any(bbox.intersects(r) for r in highlight_rects)

                        if colored or annot_hl:
                            is_line_colored = True
                        if annot_hl:
                            is_line_highlighted = True

                        spans_info.append({
                            "text": text,
                            "color": color,
                            "colored": colored,
                            "annot_highlighted": annot_hl,
                            "bold": bool(flags & 2 ** 4)
                        })
                        line_text += text

                    clean_line = line_text.strip()
                    if clean_line:
                        all_raw_spans.append({
                            "line_text": clean_line,
                            "page": page_num + 1,
                            "is_colored": is_line_colored,
                            "is_highlighted": is_line_highlighted,
                            "spans": spans_info
                        })

    # Now parse spans sequentially into structured questions and options
    for item in all_raw_spans:
        line_text = item["line_text"]
        page = item["page"]
        is_highlighted = item["is_colored"] or item["is_highlighted"]

        # Check for Question Start
        q_match = q_start_pattern.match(line_text)
        # Avoid matching numbered lists that are short or within an option
        if q_match and len(line_text) > 4:
            # Save previous question if exists
            if current_q and (current_q["options"] or current_q["question_text"]):
                extracted_questions.append(current_q)

            question_counter += 1
            q_num_str = q_match.group(1)
            q_text_rest = q_match.group(2).strip()

            current_q = {
                "question_no": int(q_num_str) if q_num_str.isdigit() else question_counter,
                "question_text": q_text_rest,
                "options": {},
                "highlighted_answer_key": None,
                "highlighted_answer_text": None,
                "highlight_detection_type": None,
                "explanation": "",
                "page": page
            }
            continue

        # Check for Option Line (A, B, C, D, E)
        opt_match = option_pattern.match(line_text)
        if opt_match and current_q:
            opt_key = opt_match.group(1).upper()
            opt_text = opt_match.group(2).strip()

            current_q["options"][opt_key] = opt_text

            # Check if this option text or key has highlighted color or annot
            highlighted_span_texts = [
                s["text"] for s in item["spans"] if (s["colored"] or s["annot_highlighted"])
            ]

            if is_highlighted or highlighted_span_texts:
                current_q["highlighted_answer_key"] = opt_key
                current_q["highlighted_answer_text"] = opt_text or " ".join(highlighted_span_texts)
                current_q["highlight_detection_type"] = "Annotation Highlight" if item["is_highlighted"] else "Color Highlight (Red/Color Font)"
            continue

        # Check for Answer / Explanation labels
        ans_label_match = re.search(r'(?:Ans(?:wer)?|விடை|Key)\s*[:\-]\s*([A-Ea-e])\b', line_text, re.IGNORECASE)
        if ans_label_match and current_q:
            detected_key = ans_label_match.group(1).upper()
            current_q["highlighted_answer_key"] = detected_key
            if detected_key in current_q["options"]:
                current_q["highlighted_answer_text"] = current_q["options"][detected_key]
            current_q["highlight_detection_type"] = "Explicit Answer Key Tag"
            continue

        exp_match = re.search(r'(?:Explanation|விளக்கம்)\s*[:\-]\s*(.*)$', line_text, re.IGNORECASE)
        if exp_match and current_q:
            current_q["explanation"] = exp_match.group(1).strip()
            continue

        # If question is ongoing and no options started yet, append to question text
        if current_q:
            if not current_q["options"]:
                current_q["question_text"] = (current_q["question_text"] + " " + line_text).strip()
            else:
                # If options already started, might be multi-line option or explanation
                last_opt_key = list(current_q["options"].keys())[-1] if current_q["options"] else None
                if last_opt_key and not current_q["explanation"]:
                    current_q["options"][last_opt_key] = (current_q["options"][last_opt_key] + " " + line_text).strip()
                elif current_q["explanation"]:
                    current_q["explanation"] = (current_q["explanation"] + " " + line_text).strip()

    if current_q and (current_q["options"] or current_q["question_text"]):
        extracted_questions.append(current_q)

    # Format result output
    result = {
        "status": "success",
        "pdf_name": os.path.basename(pdf_path),
        "total_pages": len(doc),
        "total_questions_extracted": len(extracted_questions),
        "questions_with_detected_answers": sum(1 for q in extracted_questions if q["highlighted_answer_key"]),
        "questions": extracted_questions
    }
    return result


def format_as_clean_text(data: Dict[str, Any]) -> str:
    """
    Formats the extracted data cleanly into readable human text.
    """
    lines = []
    lines.append("=" * 70)
    lines.append(f"BHARATHI THERVUKALAM - TEST QUESTION & ANSWER EXTRACTOR")
    lines.append(f"Source PDF: {data.get('pdf_name')}")
    lines.append(f"Total Pages: {data.get('total_pages')}")
    lines.append(f"Total Questions: {data.get('total_questions_extracted')}")
    lines.append(f"Answers Identified: {data.get('questions_with_detected_answers')}")
    lines.append("=" * 70)
    lines.append("")

    for q in data.get("questions", []):
        q_no = q.get("question_no")
        q_text = q.get("question_text", "No text")
        page = q.get("page", 1)
        lines.append(f"Q{q_no} (Page {page}): {q_text}")

        options = q.get("options", {})
        correct_key = q.get("highlighted_answer_key")
        for k in sorted(options.keys()):
            opt_val = options[k]
            is_correct = (k == correct_key)
            mark = " [CORRECT / HIGHLIGHTED ANSWER]" if is_correct else ""
            lines.append(f"   ({k}) {opt_val}{mark}")

        if correct_key:
            lines.append(f"   ==> Correct Option: {correct_key}")
            if q.get("highlighted_answer_text"):
                lines.append(f"   ==> Answer Text: {q.get('highlighted_answer_text')}")
            if q.get("highlight_detection_type"):
                lines.append(f"   ==> Detection Method: {q.get('highlight_detection_type')}")

        if q.get("explanation"):
            lines.append(f"   ==> Explanation: {q.get('explanation')}")

        lines.append("-" * 60)

    return "\n".join(lines)


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 extract_test_questions.py <path_to_pdf> [--output json|txt|all] [--save-dir <dir>]")
        sys.exit(1)

    pdf_file = sys.argv[1]
    output_mode = "all"
    save_dir = "."

    if "--output" in sys.argv:
        idx = sys.argv.index("--output")
        if idx + 1 < len(sys.argv):
            output_mode = sys.argv[idx + 1].lower()

    if "--save-dir" in sys.argv:
        idx = sys.argv.index("--save-dir")
        if idx + 1 < len(sys.argv):
            save_dir = sys.argv[idx + 1]

    os.makedirs(save_dir, exist_ok=True)

    try:
        data = extract_questions_from_pdf(pdf_file)
        base_name = os.path.splitext(os.path.basename(pdf_file))[0]

        json_path = os.path.join(save_dir, f"{base_name}_extracted.json")
        txt_path = os.path.join(save_dir, f"{base_name}_extracted.txt")

        if output_mode in ("json", "all"):
            with open(json_path, "w", encoding="utf-8") as jf:
                json.dump(data, jf, ensure_ascii=False, indent=2)
            print(f"JSON Output Saved: {json_path}")

        if output_mode in ("txt", "all"):
            text_content = format_as_clean_text(data)
            with open(txt_path, "w", encoding="utf-8") as tf:
                tf.write(text_content)
            print(f"Text Output Saved: {txt_path}")

        # Also print JSON summary to stdout
        summary = {
            "status": "success",
            "pdf_name": data["pdf_name"],
            "total_questions_extracted": data["total_questions_extracted"],
            "questions_with_detected_answers": data["questions_with_detected_answers"],
            "json_path": json_path,
            "txt_path": txt_path
        }
        print(json.dumps(summary, indent=2))

    except Exception as e:
        print(json.dumps({"status": "error", "message": str(e)}), file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
