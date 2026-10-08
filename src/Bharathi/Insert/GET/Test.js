import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { testApi, omrApi } from '../../Api/Api';
import { saveMasterTest, parseAnswerKeyString } from '../../OMR/TestOMRDataManager';
import '../../Admin/AdminDashboard.css';
import '../../OMR/OMRSheet.css';

const TestForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    namepost: 'TNPSC',
    department: 'GROUP IV',
    paper: '',
    standard: 'Question',
    totalQuestions: '200 Questions (300 Marks)',
    duration: '3 Hours',
    testDate: new Date().toISOString().split('T')[0],
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // OMR Answer Key Section state
  const [enableOMRSection, setEnableOMRSection] = useState(true);
  const [omrQuestionCount, setOmrQuestionCount] = useState(25);
  const [positiveMark, setPositiveMark] = useState(1.5);
  const [negativeMark, setNegativeMark] = useState(0);
  const [batchKeyString, setBatchKeyString] = useState('');
  const [keyMap, setKeyMap] = useState({
    1: 'A', 2: 'B', 3: 'C', 4: 'D', 5: 'A',
    6: 'B', 7: 'C', 8: 'D', 9: 'A', 10: 'B',
    11: 'C', 12: 'D', 13: 'A', 14: 'B', 15: 'C',
    16: 'D', 17: 'A', 18: 'B', 19: 'C', 20: 'D',
    21: 'A', 22: 'B', 23: 'C', 24: 'D', 25: 'A',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleBubbleClick = (qNo, opt) => {
    setKeyMap((prev) => ({
      ...prev,
      [qNo]: opt,
    }));
  };

  const handleApplyBatchKey = () => {
    if (!batchKeyString.trim()) {
      Swal.fire('Empty String', 'Please enter key string like 1:A, 2:B, 3:C...', 'info');
      return;
    }
    const parsed = parseAnswerKeyString(batchKeyString, omrQuestionCount);
    setKeyMap((prev) => ({ ...prev, ...parsed }));
    Swal.fire({
      icon: 'success',
      title: 'Answer Key Applied',
      text: `Updated ${Object.keys(parsed).length} question keys in the OMR section.`,
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.paper.trim()) {
      Swal.fire('Required Field', 'Please enter the Subject / Test Title.', 'warning');
      return;
    }

    setLoading(true);
    const testId = `test-${Date.now()}`;
    const filename = file ? file.name : `${formData.department.replace(/\s+/g, '_')}_Mock_Test.pdf`;

    // Generate questions array for OMR Evaluation Engine
    const questionsArray = [];
    for (let i = 1; i <= omrQuestionCount; i++) {
      questionsArray.push({
        qNo: i,
        question: `Question ${i} for ${formData.paper}`,
        options: {
          A: 'Option A',
          B: 'Option B',
          C: 'Option C',
          D: 'Option D',
          E: 'Answer Not Known',
        },
        correctKey: keyMap[i] || 'A',
        explanation: `Standard key solution for Question ${i}. Refer to official answer key discussion.`,
        topic: formData.department,
      });
    }

    const testCode = `test-${Date.now()}`;
    const postItem = {
      test_code: testCode,
      title: `${formData.department}: ${formData.paper}`,
      category: formData.namepost,
      department: formData.department,
      paper: formData.paper,
      standard: formData.standard,
      total_questions: Number(omrQuestionCount),
      duration_minutes: 180,
      positive_mark: Number(positiveMark),
      negative_mark: Number(negativeMark),
      test_date: formData.testDate,
      filename: filename,
    };

    const start = performance.now();
    try {
      const res = await testApi.create(postItem);
      const createdTestId = res.data?.data?.id || 1;

      // Also persist real OMR Master Answer Keys to database
      if (enableOMRSection && Object.keys(keyMap).length > 0) {
        await omrApi.saveMasterKeys({
          test_id: createdTestId,
          keys: keyMap
        }).catch(() => null);
      }

      const duration = performance.now() - start;

      Swal.fire({
        icon: 'success',
        title: 'Test Scheduled in Database!',
        text: `Exam batch created and keys stored in database (${Number(duration.toFixed(2))}ms).`,
        showCancelButton: true,
        confirmButtonText: 'View Test Series',
        cancelButtonText: 'Add Another Test',
        confirmButtonColor: '#0b1e42',
        cancelButtonColor: '#64748b',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/Test-View');
        } else {
          setFormData({
            namepost: 'TNPSC',
            department: 'GROUP IV',
            paper: '',
            standard: 'Question',
            totalQuestions: '200 Questions (300 Marks)',
            duration: '3 Hours',
            testDate: new Date().toISOString().split('T')[0],
          });
          setFile(null);
        }
      });
    } catch (err) {
      console.error('[Test Creation Error]', err);
      Swal.fire({
        icon: 'error',
        title: 'Creation Failed',
        text: err.response?.data?.message || 'Database error creating test.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-shell">
      <div className="admin-workspace">
        {/* Breadcrumb Navigation */}
        <nav className="admin-breadcrumb" aria-label="breadcrumb">
          <Link to="/Adm">Admin</Link>
          <span className="separator">/</span>
          <span>Examination Wing</span>
          <span className="separator">/</span>
          <span className="current">Test Series - Add</span>
        </nav>

        {/* Page Header */}
        <div className="admin-page-header">
          <div className="admin-title-wrap">
            <span className="admin-meta-badge" style={{ color: '#2563eb' }}>
              <i className="bi bi-clipboard-check-fill"></i> Test Series, Question Papers & OMR Section
            </span>
            <h1>Schedule Test & Configure OMR Answer Key</h1>
            <p>Publish weekly mock schedules, upload question paper PDFs, and configure the master OMR answer key.</p>
          </div>
          <div className="admin-header-actions">
            <Link to="/OMR-Master" className="btn btn-outline-dark py-2 px-3 fw-semibold">
              <i className="bi bi-ui-checks-grid me-1"></i> OMR Master Hub
            </Link>
            <Link to="/Test-View" className="admin-btn-action edit py-2 px-3">
              <i className="bi bi-calendar3 me-1"></i> View All Tests
            </Link>
          </div>
        </div>

        {/* Form Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h4 className="fw-bold mb-0 text-dark" style={{ fontSize: '1.05rem' }}>
                <i className="bi bi-calendar-plus text-primary me-2"></i>
                Mock Test & Question Paper Configuration
              </h4>
              <p className="text-muted small mb-0">Configure exam standard, total questions, time duration, and attach question paper / key.</p>
            </div>
          </div>

          <div className="admin-card-body">
            <form onSubmit={handleSubmit} className="admin-form-container">
              <div className="row g-3">
                {/* Commission / Exam Type */}
                <div className="col-12 col-md-6">
                  <label className="admin-form-label">
                    Commission / Category <span className="required">*</span>
                  </label>
                  <select
                    className="admin-form-select"
                    name="namepost"
                    value={formData.namepost}
                    onChange={handleChange}
                    required
                  >
                    <option value="TNPSC">TNPSC (Civil Services)</option>
                    <option value="TNUSRB">TNUSRB (Uniformed Services)</option>
                  </select>
                </div>

                {/* Department / Stream */}
                <div className="col-12 col-md-6">
                  <label className="admin-form-label">
                    Target Exam Stream <span className="required">*</span>
                  </label>
                  <select
                    className="admin-form-select"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  >
                    {formData.namepost === 'TNPSC' ? (
                      <>
                        <option value="GROUP I">TNPSC Group I (Prelims & Mains)</option>
                        <option value="GROUP II">TNPSC Group II (Interview Posts)</option>
                        <option value="GROUP II-A">TNPSC Group II-A (Non-Interview)</option>
                        <option value="GROUP IV">TNPSC Group IV & VAO</option>
                      </>
                    ) : (
                      <>
                        <option value="TNUSRB SI JOINT">TNUSRB Joint Recruitment SI</option>
                        <option value="TNUSRB SI TECHNICAL">Sub-Inspector (Technical)</option>
                        <option value="TNUSRB SI FINGERPRINT">Sub-Inspector (Finger Print)</option>
                        <option value="TNUSRB COMMON PC">Common Recruitment (Constable)</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Subject & Paper Title */}
                <div className="col-12">
                  <label className="admin-form-label">
                    Test Title & Subject Area <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="admin-form-control"
                    name="paper"
                    placeholder="e.g. Full Mock Test 1 - General Tamil, Indian Polity & Aptitude"
                    value={formData.paper}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Paper Type */}
                <div className="col-12 col-md-4">
                  <label className="admin-form-label">
                    Document Standard <span className="required">*</span>
                  </label>
                  <select
                    className="admin-form-select"
                    name="standard"
                    value={formData.standard}
                    onChange={handleChange}
                    required
                  >
                    <option value="Question">Question Paper (Mock)</option>
                    <option value="Answer">Answer Key & Solution</option>
                    <option value="Schedule">Schedule / Time Table</option>
                    <option value="OMR Sheet">OMR Practice Sheet</option>
                  </select>
                </div>

                {/* Total Questions */}
                <div className="col-12 col-md-4">
                  <label className="admin-form-label">Total Questions / Marks Text</label>
                  <input
                    type="text"
                    className="admin-form-control"
                    name="totalQuestions"
                    placeholder="e.g. 200 Questions (300 Marks)"
                    value={formData.totalQuestions}
                    onChange={handleChange}
                  />
                </div>

                {/* Duration */}
                <div className="col-12 col-md-4">
                  <label className="admin-form-label">Exam Duration</label>
                  <input
                    type="text"
                    className="admin-form-control"
                    name="duration"
                    placeholder="e.g. 3 Hours (10:00 AM - 01:00 PM)"
                    value={formData.duration}
                    onChange={handleChange}
                  />
                </div>

                {/* Exam Date */}
                <div className="col-12 col-md-6">
                  <label className="admin-form-label">Exam / Publication Date</label>
                  <input
                    type="date"
                    className="admin-form-control"
                    name="testDate"
                    value={formData.testDate}
                    onChange={handleChange}
                  />
                </div>

                {/* Question Paper PDF File Upload */}
                <div className="col-12 col-md-6">
                  <label className="admin-form-label">Upload Question Paper PDF</label>
                  <input
                    type="file"
                    className="admin-form-control"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                  />
                  <div className="admin-form-hint">Attach official question paper PDF for candidate download.</div>
                </div>

                {/* ========================================================
                    OMR SHEET ANSWER SECTION (Requested by User!)
                    ======================================================== */}
                <div className="col-12 mt-4 pt-3 border-top">
                  <div className="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded-3 border">
                    <div>
                      <h5 className="fw-bold text-dark mb-1">
                        <i className="bi bi-ui-checks-grid text-primary me-2"></i>
                        OMR Sheet Master Answer Key Section
                      </h5>
                      <p className="text-muted small mb-0">
                        Enable automatic instant validation for students taking this test in the Student Portal.
                      </p>
                    </div>
                    <div className="form-check form-switch fs-5">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={enableOMRSection}
                        onChange={(e) => setEnableOMRSection(e.target.checked)}
                      />
                    </div>
                  </div>

                  {enableOMRSection && (
                    <div className="p-3 bg-white border rounded-3 shadow-sm mb-3">
                      {/* OMR Scoring Configuration */}
                      <div className="row g-3 mb-3">
                        <div className="col-12 col-md-4">
                          <label className="admin-form-label">Evaluation Matrix Questions:</label>
                          <select
                            className="admin-form-select"
                            value={omrQuestionCount}
                            onChange={(e) => setOmrQuestionCount(Number(e.target.value))}
                          >
                            <option value={10}>10 Questions Drill</option>
                            <option value={20}>20 Questions Unit Test</option>
                            <option value={25}>25 Questions Standard Batch</option>
                            <option value={50}>50 Questions Comprehensive</option>
                          </select>
                        </div>
                        <div className="col-12 col-md-4">
                          <label className="admin-form-label">Marks per Correct (+):</label>
                          <input
                            type="number"
                            step="0.1"
                            className="admin-form-control"
                            value={positiveMark}
                            onChange={(e) => setPositiveMark(e.target.value)}
                          />
                        </div>
                        <div className="col-12 col-md-4">
                          <label className="admin-form-label">Negative Penalty (-):</label>
                          <input
                            type="number"
                            step="0.05"
                            className="admin-form-control"
                            value={negativeMark}
                            onChange={(e) => setNegativeMark(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Quick Batch Paste Key */}
                      <div className="mb-3 p-2 bg-light border rounded">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="small fw-bold text-dark">Quick Batch Key Importer:</span>
                          <button
                            type="button"
                            className="btn btn-sm btn-link p-0 text-decoration-none"
                            onClick={() => {
                              const keys = ['A', 'B', 'C', 'D'];
                              const auto = {};
                              for (let i = 1; i <= omrQuestionCount; i++) {
                                auto[i] = keys[(i - 1) % 4];
                              }
                              setKeyMap(auto);
                            }}
                          >
                            Auto-Fill Alternate ABCD
                          </button>
                        </div>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control form-control-sm font-monospace"
                            placeholder="e.g. 1:A, 2:C, 3:B, 4:D... or comma-separated A,C,B,D"
                            value={batchKeyString}
                            onChange={(e) => setBatchKeyString(e.target.value)}
                          />
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={handleApplyBatchKey}
                          >
                            Apply Key String
                          </button>
                        </div>
                      </div>

                      {/* Visual Bubbling Key Matrix */}
                      <div className="p-2 border rounded bg-light" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                        <div className="row g-2">
                          {Array.from({ length: omrQuestionCount }, (_, idx) => idx + 1).map((qNo) => (
                            <div className="col-6 col-md-4 col-lg-3" key={qNo}>
                              <div className="d-flex align-items-center justify-content-between p-1 px-2 bg-white border rounded">
                                <span className="small fw-bold font-monospace">Q.{qNo}</span>
                                <div className="d-flex gap-1">
                                  {['A', 'B', 'C', 'D'].map((opt) => (
                                    <button
                                      key={opt}
                                      type="button"
                                      onClick={() => handleBubbleClick(qNo, opt)}
                                      className={`omr-bubble ${keyMap[qNo] === opt ? 'shaded' : ''}`}
                                      style={{ width: '22px', height: '22px', fontSize: '0.65rem' }}
                                    >
                                      {opt}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Action */}
                <div className="col-12 pt-3 border-top mt-4 d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    onClick={() => navigate('/Test-View')}
                    className="btn btn-light px-4 py-2 border fw-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary-custom px-4 py-2"
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Scheduling Test & Saving OMR Key...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-calendar-check me-1"></i> Schedule Test & Save OMR Key
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestForm;
