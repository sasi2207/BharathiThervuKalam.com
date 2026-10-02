import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import {
  getMasterTests,
  saveMasterTest,
  getAllSubmissions,
  evaluateOMRSubmission,
  parseAnswerKeyString,
} from '../../OMR/TestOMRDataManager';
import '../../Admin/AdminDashboard.css';
import '../../OMR/OMRSheet.css';

const AdminOMRMaster = () => {
  const [tests, setTests] = useState([]);
  const [selectedTestId, setSelectedTestId] = useState('');
  const [selectedTest, setSelectedTest] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [activeTab, setActiveTab] = useState('answerKeys'); // 'answerKeys' | 'submissions' | 'liveEvaluator'
  
  // Key builder state
  const [keyMap, setKeyMap] = useState({});
  const [batchString, setBatchString] = useState('');
  const [editingExplanations, setEditingExplanations] = useState({});
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [searchSubmission, setSearchSubmission] = useState('');

  // Inspection modal state
  const [inspectSubmission, setInspectSubmission] = useState(null);

  // Live Evaluator state
  const [testerCandidate, setTesterCandidate] = useState({
    name: 'R. Soundararajan',
    rollNo: 'BTK2026-0912',
    series: 'A',
  });
  const [testerAnswers, setTesterAnswers] = useState({});
  const [evaluationResult, setEvaluationResult] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const list = getMasterTests();
    setTests(list);
    if (list.length > 0) {
      const active = list[0];
      setSelectedTestId(active.id);
      setSelectedTest(active);
      initKeyMap(active);
    }
    const subs = getAllSubmissions();
    setSubmissions(subs);
  };

  const initKeyMap = (test) => {
    const map = {};
    const explMap = {};
    (test.questions || []).forEach((q) => {
      map[q.qNo] = q.correctKey || 'A';
      explMap[q.qNo] = q.explanation || '';
    });
    setKeyMap(map);
    setEditingExplanations(explMap);
  };

  const handleSelectTest = (testId) => {
    setSelectedTestId(testId);
    const test = tests.find((t) => String(t.id) === String(testId));
    if (test) {
      setSelectedTest(test);
      initKeyMap(test);
      setEvaluationResult(null);
      setTesterAnswers({});
    }
  };

  const handleKeySelect = (qNo, option) => {
    setKeyMap((prev) => ({
      ...prev,
      [qNo]: option,
    }));
  };

  const handleExplanationChange = (qNo, text) => {
    setEditingExplanations((prev) => ({
      ...prev,
      [qNo]: text,
    }));
  };

  // Apply Batch Key String (e.g. 1:A, 2:B or A,B,C,D...)
  const handleApplyBatchString = () => {
    if (!batchString.trim()) {
      Swal.fire('Empty String', 'Please enter or paste an answer key pattern.', 'warning');
      return;
    }
    const total = selectedTest?.questions?.length || 25;
    const parsed = parseAnswerKeyString(batchString, total);
    setKeyMap((prev) => ({
      ...prev,
      ...parsed,
    }));
    setShowBatchModal(false);
    Swal.fire({
      icon: 'success',
      title: 'Answer Key Parsed',
      text: `Updated ${Object.keys(parsed).length} question keys. Click "Save Master Answer Key" to confirm.`,
      timer: 1600,
      showConfirmButton: false,
    });
  };

  // Quick Auto-fill for convenience
  const handleAutoFillKeys = (pattern = 'alternate') => {
    const questions = selectedTest?.questions || [];
    const newMap = {};
    const keys = ['A', 'B', 'C', 'D'];
    questions.forEach((q, idx) => {
      if (pattern === 'allA') newMap[q.qNo] = 'A';
      else if (pattern === 'allB') newMap[q.qNo] = 'B';
      else if (pattern === 'allC') newMap[q.qNo] = 'C';
      else if (pattern === 'allD') newMap[q.qNo] = 'D';
      else newMap[q.qNo] = keys[idx % 4];
    });
    setKeyMap(newMap);
    Swal.fire({
      icon: 'info',
      title: 'Pattern Applied',
      text: 'Visual master key populated. Review and click "Save Master Key".',
      timer: 1200,
      showConfirmButton: false,
    });
  };

  // Save Answer Key to Master Test
  const handleSaveMasterKey = () => {
    if (!selectedTest) return;

    const updatedQuestions = (selectedTest.questions || []).map((q) => ({
      ...q,
      correctKey: keyMap[q.qNo] || q.correctKey || 'A',
      explanation: editingExplanations[q.qNo] || q.explanation || '',
    }));

    const updatedTest = {
      ...selectedTest,
      questions: updatedQuestions,
    };

    saveMasterTest(updatedTest);
    setSelectedTest(updatedTest);
    setTests(getMasterTests());

    Swal.fire({
      icon: 'success',
      title: 'Master OMR Answer Key Saved!',
      text: `Successfully synced official key and explanations for ${selectedTest.title}. Students can now validate their OMR sheets against this key.`,
      confirmButtonColor: '#0f172a',
    });
  };

  // Live Evaluator Bubbling
  const handleTesterBubble = (qNo, opt) => {
    setTesterAnswers((prev) => {
      if (prev[qNo] === opt) {
        const next = { ...prev };
        delete next[qNo];
        return next;
      }
      return { ...prev, [qNo]: opt };
    });
  };

  const handleRunEvaluation = () => {
    if (!selectedTest) return;

    const res = evaluateOMRSubmission({
      testId: selectedTest.id,
      rollNo: testerCandidate.rollNo,
      studentName: testerCandidate.name,
      bookletSeries: testerCandidate.series,
      candidateAnswers: testerAnswers,
      timeSpentSeconds: 3240,
    });

    setEvaluationResult(res);
    setSubmissions(getAllSubmissions());

    Swal.fire({
      icon: 'success',
      title: 'OMR Sheet Validated!',
      html: `
        <div class="text-start">
          <p class="mb-1"><strong>Candidate:</strong> ${res.studentName} (${res.rollNo})</p>
          <p class="mb-1"><strong>Score:</strong> ${res.rawScore} / ${res.maxPossibleMarks} (${res.percentage}%)</p>
          <p class="mb-1"><strong>Correct Answers:</strong> <span class="text-success fw-bold">${res.correctCount}</span></p>
          <p class="mb-1"><strong>Incorrect:</strong> <span class="text-danger fw-bold">${res.incorrectCount}</span></p>
          <p class="mb-0"><strong>Statewide Rank:</strong> Top ${res.simulatedRank}</p>
        </div>
      `,
      confirmButtonColor: '#0f172a',
    });
  };

  // Filter Submissions
  const filteredSubmissions = submissions.filter((s) => {
    const q = searchSubmission.toLowerCase();
    return (
      (s.studentName || '').toLowerCase().includes(q) ||
      (s.rollNo || '').toLowerCase().includes(q) ||
      (s.testTitle || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="admin-shell">
      <div className="admin-workspace">
        {/* Breadcrumb */}
        <nav className="admin-breadcrumb" aria-label="breadcrumb">
          <Link to="/Adm">Admin</Link>
          <span className="separator">/</span>
          <span>Examination Wing</span>
          <span className="separator">/</span>
          <span className="current">OMR Master Answer Keys & Evaluation</span>
        </nav>

        {/* Page Header */}
        <div className="admin-page-header">
          <div className="admin-title-wrap">
            <span className="admin-meta-badge" style={{ color: '#0d9488' }}>
              <i className="bi bi-ui-checks-grid"></i> Official OMR Answer Section
            </span>
            <h1>OMR Sheet Answer Keys & Automated Evaluator</h1>
            <p>Configure master answer keys, publish question paper solutions, and validate candidate OMR bubble responses.</p>
          </div>
          <div className="admin-header-actions">
            <Link to="/Test-Add" className="btn btn-outline-primary py-2 px-3 fw-semibold">
              <i className="bi bi-plus-circle me-1"></i> Add New Test
            </Link>
            <Link to="/student-dashboard" className="btn btn-primary-custom py-2 px-3">
              <i className="bi bi-mortarboard me-1"></i> Open Student Portal
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="d-flex flex-wrap gap-2 border-bottom pb-3 mb-4">
          <button
            type="button"
            className={`btn ${activeTab === 'answerKeys' ? 'btn-dark' : 'btn-light border'} fw-semibold px-4`}
            onClick={() => setActiveTab('answerKeys')}
          >
            <i className="bi bi-key-fill me-2"></i> Master OMR Answer Keys
          </button>
          <button
            type="button"
            className={`btn ${activeTab === 'submissions' ? 'btn-dark' : 'btn-light border'} fw-semibold px-4 position-relative`}
            onClick={() => setActiveTab('submissions')}
          >
            <i className="bi bi-card-checklist me-2"></i> Student OMR Submissions
            {submissions.length > 0 && (
              <span className="badge bg-danger ms-2">{submissions.length}</span>
            )}
          </button>
          <button
            type="button"
            className={`btn ${activeTab === 'liveEvaluator' ? 'btn-dark' : 'btn-light border'} fw-semibold px-4`}
            onClick={() => setActiveTab('liveEvaluator')}
          >
            <i className="bi bi-cpu me-2"></i> Live OMR Evaluator Tool
          </button>
        </div>

        {/* TAB 1: MASTER ANSWER KEY BUILDER */}
        {activeTab === 'answerKeys' && (
          <div>
            {/* Top Selector Bar */}
            <div className="admin-card mb-4">
              <div className="admin-card-body p-4">
                <div className="row g-3 align-items-center">
                  <div className="col-12 col-md-6">
                    <label className="admin-form-label mb-1">Select Test Series to Manage Answer Key:</label>
                    <select
                      className="admin-form-select"
                      value={selectedTestId}
                      onChange={(e) => handleSelectTest(e.target.value)}
                    >
                      {tests.map((t) => (
                        <option key={t.id} value={t.id}>
                          [{t.category}] {t.title} ({t.questions?.length || t.totalQuestions || 25} Qs)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12 col-md-6 text-md-end pt-md-4">
                    <div className="d-flex gap-2 justify-content-md-end flex-wrap">
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm px-3"
                        onClick={() => setShowBatchModal(true)}
                      >
                        <i className="bi bi-code-slash me-1"></i> Paste Key String
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm px-3"
                        onClick={() => handleAutoFillKeys('alternate')}
                      >
                        <i className="bi bi-magic me-1"></i> Quick Fill ABCD
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary-custom px-4 py-2"
                        onClick={handleSaveMasterKey}
                      >
                        <i className="bi bi-check-circle-fill me-1"></i> Save Master Answer Key
                      </button>
                    </div>
                  </div>
                </div>

                {selectedTest && (
                  <div className="mt-3 pt-3 border-top d-flex flex-wrap gap-3 small text-muted">
                    <span><strong>Exam Category:</strong> {selectedTest.category}</span>
                    <span><strong>Stream:</strong> {selectedTest.department}</span>
                    <span><strong>Marking:</strong> +{selectedTest.positiveMark || 1.5} per correct</span>
                    <span><strong>Negative:</strong> -{selectedTest.negativeMark || 0}</span>
                    <span><strong>Duration:</strong> {selectedTest.durationText || '3 Hours'}</span>
                    {selectedTest.questionPaperUrl && (
                      <a
                        href={selectedTest.questionPaperUrl}
                        download
                        className="text-decoration-none text-primary fw-semibold"
                      >
                        <i className="bi bi-file-earmark-pdf me-1"></i> Download Question Paper PDF
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Answer Key Grid */}
            <div className="admin-card">
              <div className="admin-card-header d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="fw-bold mb-0 text-dark">
                    <i className="bi bi-ui-radios-grid text-primary me-2"></i>
                    Official Bubble Key Matrix ({selectedTest?.questions?.length || 0} Questions)
                  </h5>
                  <p className="text-muted small mb-0">
                    Click any bubble (A, B, C, D) to set the correct answer. You can also customize question explanation notes.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-primary-custom px-3"
                  onClick={handleSaveMasterKey}
                >
                  <i className="bi bi-save me-1"></i> Save Keys
                </button>
              </div>

              <div className="admin-card-body p-4">
                <div className="row g-4">
                  {(selectedTest?.questions || []).map((q) => {
                    const activeKey = keyMap[q.qNo] || q.correctKey || 'A';
                    return (
                      <div className="col-12 col-md-6 col-lg-4" key={q.qNo}>
                        <div className="p-3 border rounded-3 bg-white h-100 shadow-sm">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="badge bg-dark fw-bold">Q.{q.qNo}</span>
                            <span className="small text-muted fw-semibold">{q.topic || 'General'}</span>
                          </div>

                          <div className="small text-dark mb-3" style={{ fontSize: '0.82rem', lineHeight: '1.35', maxHeight: '56px', overflow: 'hidden' }}>
                            {q.question}
                          </div>

                          {/* OMR Shading Bubble Buttons */}
                          <div className="d-flex align-items-center justify-content-between bg-light p-2 rounded border mb-2">
                            <span className="small fw-bold text-muted">Correct Key:</span>
                            <div className="d-flex gap-2">
                              {['A', 'B', 'C', 'D'].map((opt) => (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => handleKeySelect(q.qNo, opt)}
                                  className={`omr-bubble ${activeKey === opt ? 'shaded' : ''}`}
                                  style={{ width: '30px', height: '30px', fontSize: '0.8rem' }}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Quick Explanation Note */}
                          <div>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Explanation note for students..."
                              value={editingExplanations[q.qNo] || ''}
                              onChange={(e) => handleExplanationChange(q.qNo, e.target.value)}
                              style={{ fontSize: '0.78rem' }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="text-center pt-4 border-top mt-4">
                  <button
                    type="button"
                    className="btn btn-primary-custom px-5 py-2 fw-bold"
                    onClick={handleSaveMasterKey}
                  >
                    <i className="bi bi-check2-circle me-1"></i> Save Official Master Answer Key
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STUDENT OMR SUBMISSIONS ROSTER */}
        {activeTab === 'submissions' && (
          <div className="admin-card">
            <div className="admin-card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <h5 className="fw-bold mb-0 text-dark">
                  <i className="bi bi-file-earmark-check-fill text-success me-2"></i>
                  Validated Student OMR Submissions
                </h5>
                <span className="admin-counter-text">
                  Total <b>{filteredSubmissions.length}</b> verified OMR evaluations recorded
                </span>
              </div>
              <div className="admin-search-wrap">
                <i className="bi bi-search"></i>
                <input
                  type="text"
                  className="admin-search-input"
                  placeholder="Search by student, roll no, or test..."
                  value={searchSubmission}
                  onChange={(e) => setSearchSubmission(e.target.value)}
                />
              </div>
            </div>

            <div className="admin-table-responsive">
              {filteredSubmissions.length > 0 ? (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Roll Number</th>
                      <th>Candidate Name</th>
                      <th>Test Title</th>
                      <th>Score / Max</th>
                      <th>Accuracy</th>
                      <th>Correct / Wrong</th>
                      <th>Status Zone</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubmissions.map((sub, idx) => (
                      <tr key={sub.submissionId || idx}>
                        <td className="admin-id-col">#{idx + 1}</td>
                        <td className="fw-bold text-dark font-monospace">{sub.rollNo}</td>
                        <td>
                          <span className="fw-semibold text-dark">{sub.studentName}</span>
                          <span className="d-block small text-muted">Series: {sub.bookletSeries || 'A'}</span>
                        </td>
                        <td>
                          <span className="admin-item-title">{sub.testTitle}</span>
                          <span className="admin-item-sub">
                            {new Date(sub.submittedAt).toLocaleDateString()} {new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </td>
                        <td>
                          <span className="fw-bold text-primary fs-6">{sub.rawScore}</span>
                          <span className="text-muted small"> / {sub.maxPossibleMarks}</span>
                          <span className="d-block small fw-semibold text-dark">({sub.percentage}%)</span>
                        </td>
                        <td>
                          <span className="fw-bold text-success">{sub.accuracy}%</span>
                        </td>
                        <td>
                          <span className="badge bg-success me-1">{sub.correctCount} Correct</span>
                          <span className="badge bg-danger">{sub.incorrectCount} Wrong</span>
                        </td>
                        <td>
                          <span className="badge bg-light text-dark border">
                            {sub.cutoffZone?.split('(')[0] || 'Evaluated'}
                          </span>
                        </td>
                        <td className="text-end">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary px-2 py-1"
                            onClick={() => setInspectSubmission(sub)}
                          >
                            <i className="bi bi-eye me-1"></i> Inspect OMR
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="admin-empty-state">
                  <div className="admin-empty-icon text-muted">
                    <i className="bi bi-inbox"></i>
                  </div>
                  <h5 className="admin-empty-title">No OMR Submissions Yet</h5>
                  <p className="admin-empty-desc">
                    When students take tests via the Student Portal and validate their OMR sheets, their verified scores and bubbled sheets will appear here.
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary-custom"
                    onClick={() => setActiveTab('liveEvaluator')}
                  >
                    <i className="bi bi-lightning-charge me-1"></i> Test Live Evaluator
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: LIVE OMR EVALUATOR SIMULATOR TOOL */}
        {activeTab === 'liveEvaluator' && (
          <div>
            <div className="admin-card mb-4">
              <div className="admin-card-header">
                <h5 className="fw-bold mb-0 text-dark">
                  <i className="bi bi-calculator-fill text-warning me-2"></i>
                  Real-time Candidate OMR Shading & Score Validation Tool
                </h5>
                <p className="text-muted small mb-0">
                  Simulate or manually grade a student's answer sheet to verify marking rules and calculate official scores.
                </p>
              </div>

              <div className="admin-card-body p-4">
                <div className="row g-3 mb-4">
                  <div className="col-12 col-md-4">
                    <label className="admin-form-label">Candidate Name</label>
                    <input
                      type="text"
                      className="admin-form-control"
                      value={testerCandidate.name}
                      onChange={(e) => setTesterCandidate({ ...testerCandidate, name: e.target.value })}
                    />
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="admin-form-label">Roll Number</label>
                    <input
                      type="text"
                      className="admin-form-control"
                      value={testerCandidate.rollNo}
                      onChange={(e) => setTesterCandidate({ ...testerCandidate, rollNo: e.target.value })}
                    />
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="admin-form-label">Booklet Series</label>
                    <select
                      className="admin-form-select"
                      value={testerCandidate.series}
                      onChange={(e) => setTesterCandidate({ ...testerCandidate, series: e.target.value })}
                    >
                      <option value="A">Series A</option>
                      <option value="B">Series B</option>
                      <option value="C">Series C</option>
                      <option value="D">Series D</option>
                    </select>
                  </div>
                </div>

                {/* Candidate Bubbling Grid */}
                <div className="p-3 bg-light border rounded-3 mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="fw-bold text-dark">
                      Bubble Candidate's Marked Answers ({Object.keys(testerAnswers).length} Shaded)
                    </span>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => setTesterAnswers({})}
                    >
                      Clear All Bubbles
                    </button>
                  </div>

                  <div className="row g-2">
                    {(selectedTest?.questions || []).map((q) => {
                      const marked = testerAnswers[q.qNo];
                      return (
                        <div className="col-6 col-md-4 col-lg-3" key={q.qNo}>
                          <div className="d-flex align-items-center justify-content-between p-2 bg-white border rounded">
                            <span className="fw-bold small font-monospace">Q.{q.qNo}</span>
                            <div className="d-flex gap-1">
                              {['A', 'B', 'C', 'D', 'E'].map((opt) => (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => handleTesterBubble(q.qNo, opt)}
                                  className={`omr-bubble ${opt === 'E' ? 'option-e' : ''} ${
                                    marked === opt ? 'shaded' : ''
                                  }`}
                                  style={{ width: '24px', height: '24px', fontSize: '0.7rem' }}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    className="btn btn-primary-custom px-5 py-2 fw-bold"
                    onClick={handleRunEvaluation}
                  >
                    <i className="bi bi-shield-check me-2"></i> Validate OMR Sheet & Calculate Score
                  </button>
                </div>
              </div>
            </div>

            {/* Evaluation Result Presentation */}
            {evaluationResult && (
              <div className="omr-scorecard-hero">
                <div className="row align-items-center g-4">
                  <div className="col-12 col-md-4 text-center">
                    <div className="omr-score-circle">
                      <span className="omr-score-num">{evaluationResult.rawScore}</span>
                      <span className="omr-score-total">/ {evaluationResult.maxPossibleMarks}</span>
                    </div>
                    <div className="mt-2 text-warning fw-bold small">
                      {evaluationResult.percentage}% Overall Score
                    </div>
                  </div>

                  <div className="col-12 col-md-8">
                    <h3 className="fw-bold mb-1">{evaluationResult.studentName}</h3>
                    <p className="text-light opacity-75 small mb-3">
                      Roll: {evaluationResult.rollNo} · {evaluationResult.testTitle}
                    </p>

                    <div className="omr-metrics-row mt-0">
                      <div className="omr-metric-pill correct">
                        <div className="label">Correct</div>
                        <div className="val">{evaluationResult.correctCount}</div>
                      </div>
                      <div className="omr-metric-pill incorrect">
                        <div className="label">Incorrect</div>
                        <div className="val">{evaluationResult.incorrectCount}</div>
                      </div>
                      <div className="omr-metric-pill unattempted">
                        <div className="label">Unshaded</div>
                        <div className="val">{evaluationResult.unshadedCount}</div>
                      </div>
                      <div className="omr-metric-pill">
                        <div className="label">Accuracy</div>
                        <div className="val">{evaluationResult.accuracy}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Batch String Parser Modal */}
      <Modal show={showBatchModal} onHide={() => setShowBatchModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold fs-6">
            <i className="bi bi-code-slash text-primary me-2"></i> Batch Import Answer Key
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="small text-muted mb-2">
            Paste answer key pattern. Supported formats:
            <br />
            <code>1:A, 2:C, 3:B, 4:D</code> or comma-separated <code>A, B, C, D, A, C...</code>
          </p>
          <textarea
            className="form-control font-monospace"
            rows={5}
            placeholder="e.g. 1:C, 2:B, 3:C, 4:B, 5:A, 6:B, 7:A, 8:B, 9:B, 10:B..."
            value={batchString}
            onChange={(e) => setBatchString(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setShowBatchModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" className="btn-primary-custom" onClick={handleApplyBatchString}>
            Apply to Matrix
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Inspect Candidate OMR Modal */}
      {inspectSubmission && (
        <Modal show={true} onHide={() => setInspectSubmission(null)} size="lg" centered>
          <Modal.Header closeButton className="border-bottom">
            <Modal.Title className="fw-bold fs-6">
              <i className="bi bi-file-earmark-person text-primary me-2"></i>
              Candidate OMR Record: {inspectSubmission.studentName} ({inspectSubmission.rollNo})
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
            <div className="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded border">
              <div>
                <span className="fw-bold text-dark d-block">{inspectSubmission.testTitle}</span>
                <span className="small text-muted">
                  Submitted: {new Date(inspectSubmission.submittedAt).toLocaleString()}
                </span>
              </div>
              <div className="text-end">
                <span className="badge bg-primary fs-6 px-3 py-2">
                  {inspectSubmission.rawScore} / {inspectSubmission.maxPossibleMarks} ({inspectSubmission.percentage}%)
                </span>
              </div>
            </div>

            <h6 className="fw-bold text-dark mb-2">Question-by-Question Evaluation Breakdown:</h6>
            <div className="table-responsive">
              <table className="table table-bordered table-sm align-middle small">
                <thead className="table-dark">
                  <tr>
                    <th>Q#</th>
                    <th>Candidate Answer</th>
                    <th>Master Key</th>
                    <th>Result</th>
                    <th>Topic</th>
                  </tr>
                </thead>
                <tbody>
                  {(inspectSubmission.breakdown || []).map((b) => (
                    <tr key={b.qNo} className={b.isCorrect ? 'table-success' : b.studentChoice ? 'table-danger' : ''}>
                      <td className="fw-bold">Q.{b.qNo}</td>
                      <td className="fw-bold text-center">
                        {b.studentChoice ? (
                          <span className={`badge ${b.isCorrect ? 'bg-success' : 'bg-danger'}`}>
                            {b.studentChoice}
                          </span>
                        ) : (
                          <span className="text-muted">Unshaded</span>
                        )}
                      </td>
                      <td className="fw-bold text-center text-primary">{b.correctKey}</td>
                      <td>
                        {b.isCorrect ? (
                          <span className="text-success fw-bold"><i className="bi bi-check-circle-fill me-1"></i> Correct</span>
                        ) : b.studentChoice === 'E' ? (
                          <span className="text-secondary"><i className="bi bi-dash-circle me-1"></i> Not Known</span>
                        ) : b.studentChoice ? (
                          <span className="text-danger fw-bold"><i className="bi bi-x-circle-fill me-1"></i> Incorrect</span>
                        ) : (
                          <span className="text-muted"><i className="bi bi-circle me-1"></i> Blank</span>
                        )}
                      </td>
                      <td className="text-muted">{b.topic}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setInspectSubmission(null)}>
              Close Inspection
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default AdminOMRMaster;
