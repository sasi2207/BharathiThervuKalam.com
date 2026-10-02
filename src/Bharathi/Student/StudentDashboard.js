import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import {
  getMasterTests,
  evaluateOMRSubmission,
  getStudentSubmissions,
} from '../OMR/TestOMRDataManager';
import Logo from '../img1/Logo.png';
import AcademicCardCheckmark from '../Common/AcademicCardCheckmark';
import '../OMR/OMRSheet.css';
import '../Admin/AdminDashboard.css';

const StudentDashboard = () => {
  const navigate = useNavigate();

  // Student Profile
  const [student, setStudent] = useState({
    name: 'S. Kabilan',
    rollNo: 'BTK2026-0428',
    target: 'TNPSC Group IV & TNUSRB SI Police',
    batch: 'Regular Saturday & Sunday Test Batch',
    center: 'Erode Center',
    phone: '+91 7338757194',
  });

  // Task & Quiz Completion States (with subtle CSS transition check-marks)
  const [completedTasks, setCompletedTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('student_completed_tasks');
      return saved ? JSON.parse(saved) : { quiz1: true, task3: true };
    } catch {
      return { quiz1: true, task3: true };
    }
  });

  const [quizAnswers, setQuizAnswers] = useState({ quiz1: 'A' });

  const handleSelectQuizOption = (quizId, optionKey) => {
    setQuizAnswers((prev) => ({ ...prev, [quizId]: optionKey }));
  };

  const handleCompleteQuiz = (quizId) => {
    setCompletedTasks((prev) => {
      const next = { ...prev, [quizId]: true };
      try {
        localStorage.setItem('student_completed_tasks', JSON.stringify(next));
      } catch (e) {}
      return next;
    });

    Swal.fire({
      icon: 'success',
      title: 'Quiz Verified & Completed',
      text: 'Academic card awarded with animated completion check-mark.',
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleToggleTask = (taskId, title) => {
    setCompletedTasks((prev) => {
      const nextStatus = !prev[taskId];
      const next = { ...prev, [taskId]: nextStatus };
      try {
        localStorage.setItem('student_completed_tasks', JSON.stringify(next));
      } catch (e) {}
      if (nextStatus) {
        Swal.fire({
          icon: 'success',
          title: 'Task Completed',
          text: `"${title}" completed. Check-mark verified.`,
          timer: 1300,
          showConfirmButton: false,
        });
      }
      return next;
    });
  };

  // Navigation Tabs: 'overview' | 'tests' | 'omrSheet' | 'history' | 'materials'
  const [activeTab, setActiveTab] = useState('overview');

  // Test Series Data
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);

  // OMR Sheet Exam Taker State
  const [bookletSeries, setBookletSeries] = useState('A');
  const [candidateAnswers, setCandidateAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(10800); // 3 Hours (10800s)
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showQuestionPaperPreview, setShowQuestionPaperPreview] = useState(true);

  // Validation Scorecard State
  const [validationResult, setValidationResult] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);

  // Submissions History
  const [mySubmissions, setMySubmissions] = useState([]);

  // Selected Answer Key for review
  const [viewingAnswerKeyTest, setViewingAnswerKeyTest] = useState(null);

  useEffect(() => {
    const list = getMasterTests();
    setTests(list);
    if (list.length > 0) {
      setSelectedTest(list[0]);
    }
    const history = getStudentSubmissions(student.rollNo);
    setMySubmissions(history);
  }, [student.rollNo]);

  // Timer countdown hook
  useEffect(() => {
    let timer = null;
    if (isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsTimerRunning(false);
            handleAutoSubmitOMR();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft]);

  const formatTimer = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Launch Test in OMR Simulator Mode
  const handleStartOMRTest = (test) => {
    setSelectedTest(test);
    setCandidateAnswers({});
    setTimeLeft((test.durationMinutes || 180) * 60);
    setIsTimerRunning(true);
    setActiveTab('omrSheet');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    Swal.fire({
      icon: 'info',
      title: 'Digital OMR Sheet Loaded',
      html: `
        <div class="text-start small">
          <p class="mb-1"><strong>Exam:</strong> ${test.title}</p>
          <p class="mb-1"><strong>Duration:</strong> ${test.durationMinutes || 180} Minutes</p>
          <p class="mb-1"><strong>Total Questions:</strong> ${test.questions?.length || 25}</p>
          <p class="mb-0 text-muted">Click bubbles A, B, C, D (or E if answer not known). When completed, click "Validate OMR Sheet" to receive your official score.</p>
        </div>
      `,
      confirmButtonText: 'Begin Exam',
      confirmButtonColor: '#0b1a30',
    });
  };

  // Shading a bubble in OMR Sheet
  const handleBubbleClick = (qNo, option) => {
    setCandidateAnswers((prev) => {
      // Toggle off if already selected, or switch to new option
      if (prev[qNo] === option) {
        const next = { ...prev };
        delete next[qNo];
        return next;
      }
      return { ...prev, [qNo]: option };
    });
  };

  // Clear single question row
  const handleClearRow = (qNo) => {
    setCandidateAnswers((prev) => {
      const next = { ...prev };
      delete next[qNo];
      return next;
    });
  };

  // Calculate TNPSC OMR counts
  const countOption = (opt) => {
    return Object.values(candidateAnswers).filter((val) => val === opt).length;
  };
  const countShaded = Object.keys(candidateAnswers).length;
  const totalQuestionsCount = selectedTest?.questions?.length || 25;
  const countUnshaded = Math.max(0, totalQuestionsCount - countShaded);

  // Auto submit when time runs out
  const handleAutoSubmitOMR = () => {
    Swal.fire('Time Expired', 'Exam time has ended. Your OMR sheet is being automatically validated.', 'warning');
    processOMRValidation();
  };

  // Manual Submit & Validate OMR Sheet
  const handleConfirmSubmit = async () => {
    const unshaded = countUnshaded;
    const result = await Swal.fire({
      title: 'Submit & Validate OMR Sheet?',
      html: `
        <div class="text-start">
          <p class="mb-1"><strong>Exam:</strong> ${selectedTest?.title}</p>
          <p class="mb-1"><strong>Shaded Questions:</strong> ${countShaded} of ${totalQuestionsCount}</p>
          <p class="mb-1"><strong>Unshaded Questions:</strong> ${unshaded}</p>
          <p class="mb-0 text-danger small">Once validated, your score and detailed answer key review will be generated instantly.</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0f172a',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Validate My Sheet',
      cancelButtonText: 'Continue Answering',
    });

    if (result.isConfirmed) {
      processOMRValidation();
    }
  };

  const processOMRValidation = () => {
    setIsTimerRunning(false);

    const testTime = (selectedTest?.durationMinutes || 180) * 60;
    const timeSpent = Math.max(60, testTime - timeLeft);

    const res = evaluateOMRSubmission({
      testId: selectedTest.id,
      rollNo: student.rollNo,
      studentName: student.name,
      bookletSeries,
      candidateAnswers,
      timeSpentSeconds: timeSpent,
    });

    setValidationResult(res);
    setShowResultModal(true);

    // Refresh history
    setMySubmissions(getStudentSubmissions(student.rollNo));
  };

  // Download PDF helper
  const handleDownloadPDF = (filename, label) => {
    const link = document.createElement('a');
    link.href = `/${encodeURIComponent(filename)}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Swal.fire({
      icon: 'success',
      title: 'Download Started',
      text: `${label} has been downloaded successfully.`,
      timer: 2000,
      showConfirmButton: false,
    });
  };

  // Profile sign out
  const handleSignOut = () => {
    Swal.fire({
      title: 'Leave Student Portal?',
      text: 'Your answered test records remain safely saved.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Log Out',
      confirmButtonColor: '#0f172a',
    }).then((res) => {
      if (res.isConfirmed) {
        navigate('/Student-Login');
      }
    });
  };

  return (
    <div className="admin-shell" style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '4rem' }}>
      <div className="admin-workspace">
        {/* Top Student Header Bar */}
        <div className="card shadow-sm border-0 mb-4 overflow-hidden" style={{ borderRadius: '12px' }}>
          <div
            className="p-4 text-white d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3"
            style={{ background: 'linear-gradient(135deg, #0b1a30 0%, #17325c 100%)' }}
          >
            <div className="d-flex align-items-center gap-3">
              <img src={Logo} alt="Logo" style={{ height: '48px', width: 'auto' }} />
              <div>
                <div className="d-flex align-items-center gap-2">
                  <h3 className="fw-bold mb-0 text-white fs-4">{student.name}</h3>
                  <span className="badge bg-warning text-dark fw-bold">ACTIVE CADET</span>
                </div>
                <div className="d-flex flex-wrap gap-2 gap-md-3 small text-light opacity-75 mt-1">
                  <span><i className="bi bi-person-badge me-1"></i> Roll: <b>{student.rollNo}</b></span>
                  <span><i className="bi bi-bullseye me-1"></i> Target: <b>{student.target}</b></span>
                  <span><i className="bi bi-geo-alt me-1"></i> {student.center}</span>
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn btn-outline-light btn-sm fw-semibold"
                onClick={() => handleDownloadPDF('Tnpsc - OMR Sheet-1.pdf', 'Official OMR Sheet')}
              >
                <i className="bi bi-download me-1"></i> OMR Sheet PDF
              </button>
              <button
                type="button"
                className="btn btn-danger btn-sm fw-semibold"
                onClick={handleSignOut}
              >
                <i className="bi bi-box-arrow-right me-1"></i> Exit Portal
              </button>
            </div>
          </div>

          {/* Student Portal Navigation Pills */}
          <div className="bg-white border-top px-3 py-2 d-flex flex-wrap gap-2 overflow-x-auto">
            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'overview' ? 'btn-dark' : 'btn-light border'} fw-semibold px-3`}
              onClick={() => setActiveTab('overview')}
            >
              <i className="bi bi-speedometer2 me-1"></i> Dashboard Overview
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'tests' ? 'btn-dark' : 'btn-light border'} fw-semibold px-3`}
              onClick={() => setActiveTab('tests')}
            >
              <i className="bi bi-file-earmark-text me-1"></i> Test Question Papers & Answer Keys
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'omrSheet' ? 'btn-primary-custom text-white' : 'btn-light border'} fw-semibold px-3 position-relative`}
              onClick={() => {
                if (!selectedTest && tests.length > 0) setSelectedTest(tests[0]);
                setActiveTab('omrSheet');
              }}
            >
              <i className="bi bi-ui-checks-grid me-1"></i> Digital OMR Sheet Simulator
              {isTimerRunning && (
                <span className="badge bg-danger ms-1" style={{ fontSize: '0.65rem' }}>LIVE</span>
              )}
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'history' ? 'btn-dark' : 'btn-light border'} fw-semibold px-3`}
              onClick={() => setActiveTab('history')}
            >
              <i className="bi bi-clock-history me-1"></i> My Validated Scores ({mySubmissions.length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'materials' ? 'btn-dark' : 'btn-light border'} fw-semibold px-3`}
              onClick={() => setActiveTab('materials')}
            >
              <i className="bi bi-folder2-open me-1"></i> Timetables & Schedules
            </button>
          </div>
        </div>

        {/* =========================================================================
            TAB 1: DASHBOARD OVERVIEW
            ========================================================================= */}
        {activeTab === 'overview' && (
          <div>
            {/* Stat Cards */}
            <div className="row g-3 mb-4">
              <div className="col-6 col-md-3">
                <div className="card border-0 shadow-sm p-3 rounded-3 bg-white h-100">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="text-muted small fw-bold text-uppercase">Tests Completed</span>
                    <span className="admin-stat-icon blue" style={{ width: '32px', height: '32px' }}>
                      <i className="bi bi-check-all"></i>
                    </span>
                  </div>
                  <h3 className="fw-bold mb-0 text-dark">{mySubmissions.length || 3}</h3>
                  <small className="text-success fw-semibold"><i className="bi bi-arrow-up"></i> Weekly mock drill</small>
                </div>
              </div>

              <div className="col-6 col-md-3">
                <div className="card border-0 shadow-sm p-3 rounded-3 bg-white h-100">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="text-muted small fw-bold text-uppercase">Average Score</span>
                    <span className="admin-stat-icon green" style={{ width: '32px', height: '32px' }}>
                      <i className="bi bi-award-fill"></i>
                    </span>
                  </div>
                  <h3 className="fw-bold mb-0 text-dark">
                    {mySubmissions.length > 0
                      ? `${(mySubmissions.reduce((a, b) => a + (b.percentage || 0), 0) / mySubmissions.length).toFixed(1)}%`
                      : '84.5%'}
                  </h3>
                  <small className="text-muted">Above cut-off benchmark</small>
                </div>
              </div>

              <div className="col-6 col-md-3">
                <div className="card border-0 shadow-sm p-3 rounded-3 bg-white h-100">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="text-muted small fw-bold text-uppercase">OMR Accuracy</span>
                    <span className="admin-stat-icon purple" style={{ width: '32px', height: '32px' }}>
                      <i className="bi bi-bullseye"></i>
                    </span>
                  </div>
                  <h3 className="fw-bold mb-0 text-dark">88.0%</h3>
                  <small className="text-muted">Zero negative marking errors</small>
                </div>
              </div>

              <div className="col-6 col-md-3">
                <div className="card border-0 shadow-sm p-3 rounded-3 bg-white h-100">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="text-muted small fw-bold text-uppercase">Statewide Rank</span>
                    <span className="admin-stat-icon orange" style={{ width: '32px', height: '32px' }}>
                      <i className="bi bi-trophy-fill"></i>
                    </span>
                  </div>
                  <h3 className="fw-bold mb-0 text-dark">Top 18</h3>
                  <small className="text-warning fw-semibold">Statewide Merit Tier 1</small>
                </div>
              </div>
            </div>

            {/* Quick Test Callout Banner */}
            <div
              className="card border-0 text-white p-4 rounded-3 mb-4 shadow"
              style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}
            >
              <div className="row align-items-center g-3">
                <div className="col-12 col-lg-8">
                  <span className="badge bg-warning text-dark fw-bold mb-2">ACTIVE WEEKLY MOCK TEST</span>
                  <h3 className="fw-bold text-white mb-2">
                    {tests[0]?.title || 'TNPSC Group IV & VAO Full Mock Exam 01'}
                  </h3>
                  <p className="text-light opacity-75 small mb-0">
                    Authentic 25-Question model test covering General Tamil, Indian Polity, History, Science, and Mental Ability. Practice real bubbling with the official digital OMR sheet simulator.
                  </p>
                </div>
                <div className="col-12 col-lg-4 text-lg-end">
                  <button
                    type="button"
                    className="btn btn-warning btn-lg fw-bold px-4 py-3 shadow"
                    onClick={() => handleStartOMRTest(tests[0] || null)}
                  >
                    <i className="bi bi-pencil-square me-2"></i> Take Test & Fill OMR
                  </button>
                </div>
              </div>
            </div>

            {/* Daily Practice Tasks & Subject Quizzes with Smooth Check-mark Animation */}
            <div className="mb-5">
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                <div>
                  <h5 className="fw-bold mb-0 text-dark fs-6 d-flex align-items-center gap-2">
                    <i className="bi bi-patch-check-fill text-success"></i>
                    Daily Practice Tasks & Subject Quizzes
                  </h5>
                  <p className="text-muted small mb-0">
                    Complete syllabus modules and quick quizzes to earn your verified check-mark with smooth CSS animations.
                  </p>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-success-subtle text-success border border-success fw-bold px-3 py-1">
                    {Object.values(completedTasks).filter(Boolean).length} of 4 Completed
                  </span>
                </div>
              </div>

              <div className="row g-4">
                {/* Quiz Card 1: General Tamil */}
                <div className="col-12 col-md-6">
                  <div className={`academic-card ${completedTasks.quiz1 ? 'completed' : ''}`}>
                    <AcademicCardCheckmark label="General Tamil Quiz Completed" />
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="card-kicker text-warning">TNPSC Part A · General Tamil</span>
                      {completedTasks.quiz1 && (
                        <span className="academic-card-status-badge me-4">
                          <i className="bi bi-check2-circle"></i> Passed · Verified
                        </span>
                      )}
                    </div>
                    <h5 className="fw-bold text-dark mb-1">Thirukkural Grammar & Sandhi Split</h5>
                    <p className="small text-muted mb-3">
                      Identify the correct split of the sandhi compound: <strong>'கற்கக்கசடறக்'</strong>
                    </p>
                    <div className="d-flex flex-column gap-2 mb-3">
                      {[
                        { key: 'A', text: 'கற்க + கசடற' },
                        { key: 'B', text: 'கற்கக் + கசடற' },
                        { key: 'C', text: 'கற்க + கசடு + அற' },
                      ].map((opt) => (
                        <button
                          key={opt.key}
                          type="button"
                          disabled={completedTasks.quiz1}
                          onClick={() => handleSelectQuizOption('quiz1', opt.key)}
                          className={`btn btn-sm text-start py-2 px-3 border ${
                            quizAnswers.quiz1 === opt.key || (completedTasks.quiz1 && opt.key === 'A')
                              ? 'btn-success text-white fw-bold border-success'
                              : 'btn-light'
                          }`}
                        >
                          <strong>{opt.key}.</strong> {opt.text}
                        </button>
                      ))}
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
                      <small className="text-muted">Topic: 6th–10th Samacheer Kalvi</small>
                      {completedTasks.quiz1 ? (
                        <button
                          type="button"
                          onClick={() => handleToggleTask('quiz1', 'General Tamil Quiz')}
                          className="btn btn-sm btn-link text-muted p-0 text-decoration-none"
                        >
                          Reset Quiz
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleCompleteQuiz('quiz1')}
                          className="btn btn-sm btn-primary-custom text-white fw-bold px-3"
                        >
                          Submit Quiz Answer
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quiz Card 2: Indian Polity */}
                <div className="col-12 col-md-6">
                  <div className={`academic-card ${completedTasks.quiz2 ? 'completed' : ''}`}>
                    <AcademicCardCheckmark label="Indian Polity Quiz Completed" />
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="card-kicker text-primary">Indian Polity · Constitution</span>
                      {completedTasks.quiz2 && (
                        <span className="academic-card-status-badge me-4">
                          <i className="bi bi-check2-circle"></i> Passed · Verified
                        </span>
                      )}
                    </div>
                    <h5 className="fw-bold text-dark mb-1">Fundamental Rights & Writs</h5>
                    <p className="small text-muted mb-3">
                      Which Constitutional Article provides for the Right to Constitutional Remedies (Writs)?
                    </p>
                    <div className="d-flex flex-column gap-2 mb-3">
                      {[
                        { key: 'A', text: 'Article 21 (Right to Life)' },
                        { key: 'B', text: 'Article 32 (Supreme Court Writs)' },
                        { key: 'C', text: 'Article 14 (Equality Before Law)' },
                      ].map((opt) => (
                        <button
                          key={opt.key}
                          type="button"
                          disabled={completedTasks.quiz2}
                          onClick={() => handleSelectQuizOption('quiz2', opt.key)}
                          className={`btn btn-sm text-start py-2 px-3 border ${
                            quizAnswers.quiz2 === opt.key || (completedTasks.quiz2 && opt.key === 'B')
                              ? 'btn-success text-white fw-bold border-success'
                              : 'btn-light'
                          }`}
                        >
                          <strong>{opt.key}.</strong> {opt.text}
                        </button>
                      ))}
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
                      <small className="text-muted">Unit V: Indian Constitution</small>
                      {completedTasks.quiz2 ? (
                        <button
                          type="button"
                          onClick={() => handleToggleTask('quiz2', 'Indian Polity Quiz')}
                          className="btn btn-sm btn-link text-muted p-0 text-decoration-none"
                        >
                          Reset Quiz
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleCompleteQuiz('quiz2')}
                          className="btn btn-sm btn-primary-custom text-white fw-bold px-3"
                        >
                          Submit Quiz Answer
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Task Card 3: Mental Ability Practice */}
                <div className="col-12 col-md-6">
                  <div className={`academic-card ${completedTasks.task3 ? 'completed' : ''}`}>
                    <AcademicCardCheckmark label="Aptitude Task Completed" />
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="card-kicker text-success">Unit X · Aptitude & Mental Ability</span>
                      {completedTasks.task3 && (
                        <span className="academic-card-status-badge me-4">
                          <i className="bi bi-check2-circle"></i> Task Completed
                        </span>
                      )}
                    </div>
                    <h5 className="fw-bold text-dark mb-1">Time, Work & Efficiency Drill</h5>
                    <p className="small text-muted mb-3">
                      Solve 10 problems on LCM, HCF, and Pipes & Cisterns from the 8th Standard Term-1 Mathematics textbook.
                    </p>
                    <div className="p-3 bg-light rounded-2 border mb-3 small">
                      <div className="d-flex justify-content-between py-1">
                        <span className="text-muted">Target Questions:</span>
                        <span className="fw-bold">10 Textbook Problems</span>
                      </div>
                      <div className="d-flex justify-content-between py-1">
                        <span className="text-muted">Expected Time:</span>
                        <span className="fw-bold">25 Minutes</span>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
                      <small className="text-muted">Samacheer Book Problem Set</small>
                      <button
                        type="button"
                        onClick={() => handleToggleTask('task3', 'Time & Work Drill')}
                        className={`btn btn-sm fw-bold px-3 ${
                          completedTasks.task3 ? 'btn-outline-success' : 'btn-dark'
                        }`}
                      >
                        {completedTasks.task3 ? (
                          <>
                            <i className="bi bi-check-lg me-1"></i> Completed (Click to Toggle)
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-circle me-1"></i> Mark as Completed
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Task Card 4: TNUSRB Police Drill */}
                <div className="col-12 col-md-6">
                  <div className={`academic-card ${completedTasks.task4 ? 'completed' : ''}`}>
                    <AcademicCardCheckmark label="TNUSRB Task Completed" />
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="card-kicker text-danger">TNUSRB Uniformed Services</span>
                      {completedTasks.task4 && (
                        <span className="academic-card-status-badge me-4">
                          <i className="bi bi-check2-circle"></i> Task Completed
                        </span>
                      )}
                    </div>
                    <h5 className="fw-bold text-dark mb-1">Psychology & Spatial Reasoning Practice</h5>
                    <p className="small text-muted mb-3">
                      Revise coding-decoding, blood relations, and syllogisms from the SI Police examination guidebook.
                    </p>
                    <div className="p-3 bg-light rounded-2 border mb-3 small">
                      <div className="d-flex justify-content-between py-1">
                        <span className="text-muted">Exam Wing:</span>
                        <span className="fw-bold">SI & Constable Part B</span>
                      </div>
                      <div className="d-flex justify-content-between py-1">
                        <span className="text-muted">Target Accuracy:</span>
                        <span className="fw-bold text-success">90%+ Required</span>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
                      <small className="text-muted">Police Psychology Syllabus</small>
                      <button
                        type="button"
                        onClick={() => handleToggleTask('task4', 'Police Psychology Practice')}
                        className={`btn btn-sm fw-bold px-3 ${
                          completedTasks.task4 ? 'btn-outline-success' : 'btn-dark'
                        }`}
                      >
                        {completedTasks.task4 ? (
                          <>
                            <i className="bi bi-check-lg me-1"></i> Completed (Click to Toggle)
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-circle me-1"></i> Mark as Completed
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Validated Results Table */}
            <div className="card border-0 shadow-sm rounded-3">
              <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0 text-dark fs-6">
                  <i className="bi bi-card-checklist text-primary me-2"></i>
                  Recent Validated OMR Test Results
                </h5>
                <button
                  type="button"
                  className="btn btn-sm btn-link text-decoration-none"
                  onClick={() => setActiveTab('history')}
                >
                  View All History →
                </button>
              </div>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0 small">
                  <thead className="table-light">
                    <tr>
                      <th>Test Series</th>
                      <th>Category</th>
                      <th>Score Obtained</th>
                      <th>Accuracy</th>
                      <th>Status Zone</th>
                      <th>Date</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mySubmissions.length > 0 ? (
                      mySubmissions.slice(0, 5).map((sub, idx) => (
                        <tr key={sub.submissionId || idx}>
                          <td className="fw-bold text-dark">{sub.testTitle}</td>
                          <td><span className="badge bg-secondary">{sub.category}</span></td>
                          <td>
                            <span className="fw-bold text-primary">{sub.rawScore} / {sub.maxPossibleMarks}</span>
                            <span className="text-muted ms-1">({sub.percentage}%)</span>
                          </td>
                          <td className="fw-bold text-success">{sub.accuracy}%</td>
                          <td>
                            <span className="badge bg-success-subtle text-success border border-success">
                              {sub.cutoffZone?.split('(')[0] || 'Qualified'}
                            </span>
                          </td>
                          <td className="text-muted">{new Date(sub.submittedAt).toLocaleDateString()}</td>
                          <td className="text-end">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => {
                                setValidationResult(sub);
                                setShowResultModal(true);
                              }}
                            >
                              View Scorecard
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center py-4 text-muted">
                          No tests attempted yet. Click "Take Test & Fill OMR" above to start your first mock examination!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: TEST QUESTION PAPERS & OFFICIAL ANSWER KEYS
            ========================================================================= */}
        {activeTab === 'tests' && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h4 className="fw-bold text-dark mb-0">Scheduled Tests, Question Papers & Official Keys</h4>
                <p className="text-muted small mb-0">
                  Download authentic question booklets, view official answer keys with explanations, or take online OMR practice.
                </p>
              </div>
            </div>

            <div className="row g-4">
              {tests.map((test) => {
                const isCompleted = mySubmissions.some((sub) => sub.testId === test.id);
                return (
                  <div className="col-12 col-lg-6" key={test.id}>
                    <div className={`academic-card h-100 ${isCompleted ? 'completed' : ''}`}>
                      <AcademicCardCheckmark label="Mock Test Completed & Evaluated" />
                      <div>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <span className="card-kicker text-warning mb-0">
                            {test.category} · {test.department || 'Examination'}
                          </span>
                          {isCompleted ? (
                            <span className="academic-card-status-badge me-4">
                              <i className="bi bi-check2-circle"></i> OMR Evaluated
                            </span>
                          ) : (
                            <span className="small text-muted fw-semibold">
                              <i className="bi bi-clock me-1"></i> {test.durationText || '3 Hours'}
                            </span>
                          )}
                        </div>

                        <h5 className="fw-bold text-dark mb-2">{test.title}</h5>
                        <p className="small text-muted mb-3">{test.subject || test.instructions}</p>

                        <div className="p-3 bg-light rounded-2 border mb-3 small">
                          <div className="d-flex justify-content-between py-1 border-bottom">
                            <span className="text-muted">Questions:</span>
                            <span className="fw-bold text-dark">{test.questions?.length || test.totalQuestions || 25} Questions</span>
                          </div>
                          <div className="d-flex justify-content-between py-1 border-bottom">
                            <span className="text-muted">Marking Scheme:</span>
                            <span className="fw-bold text-success">+{test.positiveMark || 1.5} per correct (No negative)</span>
                          </div>
                          <div className="d-flex justify-content-between py-1">
                            <span className="text-muted">Exam Format:</span>
                            <span className="fw-semibold text-dark">TNPSC OMR Bubble Sheet</span>
                          </div>
                        </div>
                      </div>

                      <div className="d-flex flex-wrap gap-2 pt-2 border-top mt-auto">
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm flex-grow-1"
                          onClick={() => handleDownloadPDF(test.questionPaperFilename || 'SUNDAY GRP 4 SCHEDULE -2025.pdf', 'Question Paper')}
                        >
                          <i className="bi bi-file-earmark-pdf text-danger me-1"></i> Question Paper
                        </button>

                        <button
                          type="button"
                          className="btn btn-outline-info btn-sm flex-grow-1"
                          onClick={() => setViewingAnswerKeyTest(test)}
                        >
                          <i className="bi bi-key me-1"></i> Answer Key & Solutions
                        </button>

                        <button
                          type="button"
                          className={`btn btn-sm flex-grow-1 fw-bold ${
                            isCompleted ? 'btn-outline-success' : 'btn-primary-custom text-white'
                          }`}
                          onClick={() => handleStartOMRTest(test)}
                        >
                          <i className="bi bi-ui-checks-grid me-1"></i> {isCompleted ? 'Re-take OMR Test' : 'Fill OMR Sheet'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: DIGITAL OMR SHEET SIMULATOR & TEST TAKER
            ========================================================================= */}
        {activeTab === 'omrSheet' && selectedTest && (
          <div>
            <div className="omr-sheet-wrapper">
              {/* Official Header Ribbon */}
              <div className="omr-header-ribbon d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
                <div>
                  <div className="omr-exam-title">
                    <i className="bi bi-shield-check text-warning me-2"></i>
                    {selectedTest.title}
                  </div>
                  <div className="omr-exam-sub">
                    <span><b>Commission:</b> {selectedTest.category}</span>
                    <span><b>Cadre:</b> {selectedTest.department}</span>
                    <span><b>Total Questions:</b> {totalQuestionsCount}</span>
                    <span><b>Marking:</b> +{selectedTest.positiveMark || 1.5} per correct answer</span>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light"
                    onClick={() => setShowQuestionPaperPreview(!showQuestionPaperPreview)}
                  >
                    <i className="bi bi-book me-1"></i>
                    {showQuestionPaperPreview ? 'Hide Questions' : 'Show Questions'}
                  </button>
                </div>
              </div>

              {/* Candidate Info Strip */}
              <div className="omr-meta-grid">
                <div className="omr-meta-item">
                  <label>Candidate Name</label>
                  <div className="val">{student.name}</div>
                </div>

                <div className="omr-meta-item">
                  <label>Registration Number</label>
                  <div className="val">{student.rollNo}</div>
                </div>

                <div className="omr-meta-item">
                  <label>Question Booklet Series</label>
                  <div className="omr-series-pill">
                    {['A', 'B', 'C', 'D'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setBookletSeries(s)}
                        className={`omr-series-btn ${bookletSeries === s ? 'selected' : ''}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="omr-meta-item">
                  <label>Subject Code</label>
                  <div className="val">003-GS-TAM</div>
                </div>
              </div>

              {/* Sticky Action & Timer Bar */}
              <div className="omr-action-bar">
                <div className="d-flex align-items-center gap-2">
                  <div className={`omr-timer-badge ${timeLeft < 600 ? 'warning' : ''}`}>
                    <i className="bi bi-stopwatch text-danger"></i>
                    <span>{formatTimer(timeLeft)}</span>
                  </div>

                  <button
                    type="button"
                    className={`btn btn-sm ${isTimerRunning ? 'btn-outline-warning' : 'btn-outline-success'}`}
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                  >
                    <i className={`bi ${isTimerRunning ? 'bi-pause-fill' : 'bi-play-fill'}`}></i>
                    {isTimerRunning ? 'Pause' : 'Resume'}
                  </button>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <span className="small text-muted d-none d-sm-inline">
                    Shaded: <b>{countShaded}</b> / {totalQuestionsCount}
                  </span>

                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => setCandidateAnswers({})}
                  >
                    Clear All
                  </button>

                  <button
                    type="button"
                    className="btn btn-success btn-sm px-3 fw-bold shadow-sm"
                    onClick={handleConfirmSubmit}
                  >
                    <i className="bi bi-check-circle-fill me-1"></i> Submit & Validate OMR Sheet
                  </button>
                </div>
              </div>

              {/* Layout: Question Paper View + OMR Grid */}
              <div className="p-3 bg-light">
                <div className="row g-4">
                  {/* Left Column: Questions Preview */}
                  {showQuestionPaperPreview && (
                    <div className="col-12 col-lg-7">
                      <div className="bg-white p-3 border rounded-3 shadow-sm h-100" style={{ maxHeight: '680px', overflowY: 'auto' }}>
                        <div className="d-flex justify-content-between align-items-center pb-2 mb-3 border-bottom">
                          <h6 className="fw-bold text-dark mb-0">
                            <i className="bi bi-file-earmark-text text-primary me-2"></i>
                            Question Booklet Series - [{bookletSeries}]
                          </h6>
                          <span className="small text-muted">Scroll to read questions</span>
                        </div>

                        {(selectedTest.questions || []).map((q) => (
                          <div key={q.qNo} className="mb-4 pb-3 border-bottom">
                            <div className="d-flex gap-2">
                              <span className="badge bg-dark fw-bold" style={{ minWidth: '32px', height: '24px' }}>
                                Q.{q.qNo}
                              </span>
                              <div className="flex-grow-1">
                                <p className="fw-semibold text-dark mb-2 small">{q.question}</p>
                                <div className="row g-2 small">
                                  {Object.entries(q.options || {}).map(([key, text]) => (
                                    <div className="col-12 col-sm-6" key={key}>
                                      <div
                                        onClick={() => handleBubbleClick(q.qNo, key)}
                                        className={`p-2 border rounded cursor-pointer transition-all ${
                                          candidateAnswers[q.qNo] === key
                                            ? 'bg-primary text-white border-primary fw-bold'
                                            : 'bg-light hover:bg-white text-dark'
                                        }`}
                                        style={{ cursor: 'pointer' }}
                                      >
                                        <span className="me-2 fw-bold">({key})</span>
                                        <span>{text}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Right Column: Digital OMR Bubble Sheet */}
                  <div className={`col-12 ${showQuestionPaperPreview ? 'col-lg-5' : 'col-12'}`}>
                    <div className="bg-white p-3 border rounded-3 shadow-sm">
                      <div className="d-flex justify-content-between align-items-center pb-2 mb-2 border-bottom">
                        <span className="fw-bold text-dark small">
                          <i className="bi bi-circle-fill text-dark me-1" style={{ fontSize: '0.65rem' }}></i>
                          OMR Bubble Matrix
                        </span>
                        <span className="small text-muted">Shade with dark ink (Click)</span>
                      </div>

                      <div style={{ maxHeight: '680px', overflowY: 'auto', paddingRight: '4px' }}>
                        <div className="row g-2">
                          {(selectedTest.questions || []).map((q) => {
                            const marked = candidateAnswers[q.qNo];
                            return (
                              <div className={showQuestionPaperPreview ? 'col-12' : 'col-6 col-md-4 col-lg-3'} key={q.qNo}>
                                <div className={`omr-row ${marked ? 'active' : ''}`}>
                                  <span className="omr-q-num">Q.{q.qNo}</span>

                                  <div className="omr-bubbles-group">
                                    {['A', 'B', 'C', 'D', 'E'].map((opt) => (
                                      <button
                                        key={opt}
                                        type="button"
                                        title={`Mark Option ${opt} for Q.${q.qNo}`}
                                        onClick={() => handleBubbleClick(q.qNo, opt)}
                                        className={`omr-bubble ${opt === 'E' ? 'option-e' : ''} ${
                                          marked === opt ? 'shaded' : ''
                                        }`}
                                      >
                                        {opt}
                                      </button>
                                    ))}
                                  </div>

                                  {marked && (
                                    <button
                                      type="button"
                                      className="omr-clear-row-btn"
                                      onClick={() => handleClearRow(q.qNo)}
                                      title="Clear marked answer"
                                    >
                                      <i className="bi bi-x"></i>
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Official TNPSC Shading Summary Box */}
              <div className="omr-tnpsc-summary-box">
                <div className="omr-tnpsc-summary-header">
                  <span>
                    <i className="bi bi-calculator me-1"></i> Official TNPSC OMR Shading Counts Summary
                  </span>
                  <span>Rule: Total Answered + Unanswered = {totalQuestionsCount}</span>
                </div>

                <div className="omr-counts-grid">
                  <div className="omr-count-card">
                    <div className="omr-count-label">Option (A)</div>
                    <div className="omr-count-value">{countOption('A')}</div>
                  </div>

                  <div className="omr-count-card">
                    <div className="omr-count-label">Option (B)</div>
                    <div className="omr-count-value">{countOption('B')}</div>
                  </div>

                  <div className="omr-count-card">
                    <div className="omr-count-label">Option (C)</div>
                    <div className="omr-count-value">{countOption('C')}</div>
                  </div>

                  <div className="omr-count-card">
                    <div className="omr-count-label">Option (D)</div>
                    <div className="omr-count-value">{countOption('D')}</div>
                  </div>

                  <div className="omr-count-card">
                    <div className="omr-count-label">Option (E)*</div>
                    <div className="omr-count-value">{countOption('E')}</div>
                  </div>

                  <div className="omr-count-card" style={{ borderColor: '#22c55e' }}>
                    <div className="omr-count-label" style={{ color: '#4ade80' }}>Total Shaded</div>
                    <div className="omr-count-value" style={{ color: '#4ade80' }}>{countShaded}</div>
                  </div>

                  <div className="omr-count-card" style={{ borderColor: '#f87171' }}>
                    <div className="omr-count-label" style={{ color: '#fca5a5' }}>Unshaded</div>
                    <div className="omr-count-value" style={{ color: '#fca5a5' }}>{countUnshaded}</div>
                  </div>
                </div>

                <div className="text-center pt-3 mt-3 border-top border-secondary">
                  <button
                    type="button"
                    className="btn btn-warning btn-lg fw-bold px-5 py-2 shadow"
                    onClick={handleConfirmSubmit}
                  >
                    <i className="bi bi-shield-check me-2"></i> Validate My OMR Sheet & View Official Result
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: MY VALIDATED TEST HISTORY
            ========================================================================= */}
        {activeTab === 'history' && (
          <div className="card border-0 shadow-sm rounded-3 p-4 bg-white">
            <h4 className="fw-bold text-dark mb-1">
              <i className="bi bi-clock-history text-primary me-2"></i>
              My Validated OMR Test History
            </h4>
            <p className="text-muted small mb-4">
              All OMR test submissions evaluated by the automated validation engine with scorecards and solution reviews.
            </p>

            {mySubmissions.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-bordered align-middle small">
                  <thead className="table-dark">
                    <tr>
                      <th>#</th>
                      <th>Test Series Title</th>
                      <th>Date Attempted</th>
                      <th>Score</th>
                      <th>Percentage</th>
                      <th>Correct / Wrong</th>
                      <th>Accuracy</th>
                      <th>Statewide Rank</th>
                      <th className="text-end">Scorecard</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mySubmissions.map((sub, idx) => (
                      <tr key={sub.submissionId || idx}>
                        <td className="fw-bold">#{idx + 1}</td>
                        <td className="fw-bold text-dark">{sub.testTitle}</td>
                        <td className="text-muted">{new Date(sub.submittedAt).toLocaleDateString()}</td>
                        <td className="fw-bold text-primary fs-6">
                          {sub.rawScore} / {sub.maxPossibleMarks}
                        </td>
                        <td className="fw-bold">{sub.percentage}%</td>
                        <td>
                          <span className="badge bg-success me-1">{sub.correctCount} Correct</span>
                          <span className="badge bg-danger">{sub.incorrectCount} Wrong</span>
                        </td>
                        <td className="text-success fw-bold">{sub.accuracy}%</td>
                        <td><span className="badge bg-dark">Top {sub.simulatedRank}</span></td>
                        <td className="text-end">
                          <button
                            type="button"
                            className="btn btn-sm btn-primary-custom"
                            onClick={() => {
                              setValidationResult(sub);
                              setShowResultModal(true);
                            }}
                          >
                            <i className="bi bi-eye me-1"></i> Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-5 text-muted">
                <i className="bi bi-journal-x fs-1 d-block mb-2"></i>
                <p>No tests submitted yet. Go to the "Digital OMR Sheet" tab to start your first mock exam!</p>
                <button
                  type="button"
                  className="btn btn-primary-custom"
                  onClick={() => setActiveTab('tests')}
                >
                  Browse Available Tests
                </button>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 5: TIMETABLES & SCHEDULES
            ========================================================================= */}
        {activeTab === 'materials' && (
          <div className="row g-4">
            <div className="col-12 col-md-4">
              <div className="card border-0 shadow-sm p-4 rounded-3 h-100 bg-white text-center">
                <span className="admin-stat-icon blue mx-auto mb-3" style={{ width: '48px', height: '48px', fontSize: '1.5rem' }}>
                  <i className="bi bi-file-earmark-pdf"></i>
                </span>
                <h5 className="fw-bold text-dark mb-2">Saturday Mock Test Schedule</h5>
                <p className="small text-muted flex-grow-1">
                  Covers weekly progression for TNPSC Group 1, Group 2, 2A and TNUSRB Sub-Inspector offline tests.
                </p>
                <button
                  type="button"
                  className="btn btn-primary-custom w-100"
                  onClick={() => handleDownloadPDF('SATURDAY TIME TABLE-1.pdf', 'Saturday Timetable')}
                >
                  <i className="bi bi-download me-1"></i> Download Timetable
                </button>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="card border-0 shadow-sm p-4 rounded-3 h-100 bg-white text-center">
                <span className="admin-stat-icon orange mx-auto mb-3" style={{ width: '48px', height: '48px', fontSize: '1.5rem' }}>
                  <i className="bi bi-file-earmark-pdf"></i>
                </span>
                <h5 className="fw-bold text-dark mb-2">Sunday Group 4 Schedule 2025-2026</h5>
                <p className="small text-muted flex-grow-1">
                  Full syllabus breakdown for General Tamil, General Studies, and Aptitude tests for VAO candidates.
                </p>
                <button
                  type="button"
                  className="btn btn-warning w-100 fw-bold"
                  onClick={() => handleDownloadPDF('SUNDAY GRP 4 SCHEDULE -2025.pdf', 'Sunday Group 4 Schedule')}
                >
                  <i className="bi bi-download me-1"></i> Download Group 4 Schedule
                </button>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="card border-0 shadow-sm p-4 rounded-3 h-100 bg-white text-center">
                <span className="admin-stat-icon green mx-auto mb-3" style={{ width: '48px', height: '48px', fontSize: '1.5rem' }}>
                  <i className="bi bi-ui-checks-grid"></i>
                </span>
                <h5 className="fw-bold text-dark mb-2">Printable TNPSC OMR Sheet PDF</h5>
                <p className="small text-muted flex-grow-1">
                  Official 200-question high resolution printable OMR sheet for physical pen and paper practice.
                </p>
                <button
                  type="button"
                  className="btn btn-success w-100 fw-bold"
                  onClick={() => handleDownloadPDF('Tnpsc - OMR Sheet-1.pdf', 'Official OMR Sheet')}
                >
                  <i className="bi bi-printer me-1"></i> Download OMR PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          VALIDATION SCORECARD MODAL (Instant OMR Validation Report!)
          ========================================================================= */}
      {validationResult && (
        <Modal show={showResultModal} onHide={() => setShowResultModal(false)} size="xl" centered>
          <Modal.Header closeButton className="border-0 bg-dark text-white">
            <Modal.Title className="fw-bold fs-6">
              <i className="bi bi-award-fill text-warning me-2"></i>
              Official OMR Evaluation Scorecard · {validationResult.studentName} ({validationResult.rollNo})
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="p-0" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            {/* Hero Result Banner */}
            <div className="omr-scorecard-hero rounded-0 mb-0">
              <div className="row align-items-center g-4">
                <div className="col-12 col-md-4 text-center">
                  <div className="omr-score-circle">
                    <span className="omr-score-num">{validationResult.rawScore}</span>
                    <span className="omr-score-total">/ {validationResult.maxPossibleMarks}</span>
                  </div>
                  <div className="mt-2 text-warning fw-bold fs-6">
                    {validationResult.percentage}% Score Achieved
                  </div>
                  <span className="badge bg-light text-dark fw-bold mt-1">
                    Statewide Rank ~ Top {validationResult.simulatedRank}
                  </span>
                </div>

                <div className="col-12 col-md-8">
                  <h4 className="fw-bold mb-1">{validationResult.testTitle}</h4>
                  <p className="text-light opacity-75 small mb-3">
                    Evaluation completed on {new Date(validationResult.submittedAt).toLocaleString()} · Booklet Series [{validationResult.bookletSeries}]
                  </p>

                  <div className="omr-metrics-row mt-0">
                    <div className="omr-metric-pill correct">
                      <div className="label">Correct Answers</div>
                      <div className="val">{validationResult.correctCount}</div>
                    </div>
                    <div className="omr-metric-pill incorrect">
                      <div className="label">Wrong Answers</div>
                      <div className="val">{validationResult.incorrectCount}</div>
                    </div>
                    <div className="omr-metric-pill unattempted">
                      <div className="label">Unshaded / Blank</div>
                      <div className="val">{validationResult.unshadedCount}</div>
                    </div>
                    <div className="omr-metric-pill">
                      <div className="label">Accuracy Rate</div>
                      <div className="val">{validationResult.accuracy}%</div>
                    </div>
                  </div>

                  <div className="mt-3 p-2 bg-white-10 rounded small text-light">
                    <i className="bi bi-info-circle text-warning me-1"></i>
                    <b>Status:</b> {validationResult.cutoffZone}
                  </div>
                </div>
              </div>
            </div>

            {/* Question-by-Question Detailed Review with Solutions */}
            <div className="p-4 bg-light">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold text-dark mb-0">
                  <i className="bi bi-card-checklist text-primary me-2"></i>
                  Question-by-Question Detailed Analysis & Official Solutions
                </h5>
                <span className="small text-muted">Compare your choices against the verified key</span>
              </div>

              <div className="row g-3">
                {(validationResult.breakdown || []).map((b) => (
                  <div className="col-12" key={b.qNo}>
                    <div className={`omr-review-card ${b.isCorrect ? 'correct' : b.studentChoice ? 'incorrect' : 'unattempted'}`}>
                      <div className="omr-review-header">
                        <div className="d-flex align-items-center gap-2">
                          <span className="badge bg-dark fw-bold">Q.{b.qNo}</span>
                          <span className="small text-muted fw-semibold">[{b.topic}]</span>
                        </div>

                        <div className="d-flex align-items-center gap-2">
                          <span className="small text-muted">
                            Your Choice: <b className={`fs-6 ${b.isCorrect ? 'text-success' : 'text-danger'}`}>{b.studentChoice || 'BLANK'}</b>
                          </span>
                          <span className="small text-muted">|</span>
                          <span className="small text-muted">
                            Official Key: <b className="fs-6 text-primary">{b.correctKey}</b>
                          </span>

                          <span className={`omr-status-badge ${b.isCorrect ? 'correct' : b.studentChoice ? 'incorrect' : 'unattempted'}`}>
                            {b.isCorrect ? '✓ Correct' : b.studentChoice === 'E' ? 'Option E' : b.studentChoice ? '✗ Wrong' : 'Skipped'}
                          </span>
                        </div>
                      </div>

                      <div className="fw-semibold text-dark small mb-2">{b.question}</div>

                      {/* Explanation Box */}
                      <div className="omr-explanation-box">
                        <div className="fw-bold text-primary small mb-1">
                          <i className="bi bi-lightbulb-fill text-warning me-1"></i> Solution & Mentor Notes:
                        </div>
                        <div>{b.explanation}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer className="border-top bg-white">
            <Button variant="secondary" onClick={() => setShowResultModal(false)}>
              Close Review
            </Button>
            <Button
              variant="primary"
              className="btn-primary-custom"
              onClick={() => {
                setShowResultModal(false);
                setActiveTab('history');
              }}
            >
              <i className="bi bi-clock-history me-1"></i> View in My Test History
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* =========================================================================
          VIEW ANSWER KEY & SOLUTIONS MODAL
          ========================================================================= */}
      {viewingAnswerKeyTest && (
        <Modal show={true} onHide={() => setViewingAnswerKeyTest(null)} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold fs-6">
              <i className="bi bi-key-fill text-warning me-2"></i>
              Official Answer Key & Solutions · {viewingAnswerKeyTest.title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
            <div className="table-responsive">
              <table className="table table-bordered align-middle small">
                <thead className="table-dark">
                  <tr>
                    <th style={{ width: '60px' }}>Q#</th>
                    <th style={{ width: '80px' }}>Key</th>
                    <th>Question & Solution Note</th>
                  </tr>
                </thead>
                <tbody>
                  {(viewingAnswerKeyTest.questions || []).map((q) => (
                    <tr key={q.qNo}>
                      <td className="fw-bold text-center">Q.{q.qNo}</td>
                      <td className="fw-bold text-center fs-6 text-primary bg-light">{q.correctKey}</td>
                      <td>
                        <div className="fw-semibold text-dark mb-1">{q.question}</div>
                        <div className="text-muted small">
                          <b className="text-secondary">Explanation:</b> {q.explanation}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setViewingAnswerKeyTest(null)}>
              Close
            </Button>
            <Button
              variant="primary"
              className="btn-primary-custom"
              onClick={() => {
                const target = viewingAnswerKeyTest;
                setViewingAnswerKeyTest(null);
                handleStartOMRTest(target);
              }}
            >
              Take This Test Now
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default StudentDashboard;
