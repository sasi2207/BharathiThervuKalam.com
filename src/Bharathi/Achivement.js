import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { achieversApi } from './Api/Api';

export default function Achivement() {
  const [achieversList, setAchieversList] = useState([]);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [selectedAchiever, setSelectedAchiever] = useState(null);

  const defaultAchievers = [
    {
      id: 1,
      name: 'R. Vignesh, M.E.',
      posting: 'Deputy Superintendent of Police (DSP)',
      cadre: 'State Civil Police Service',
      exam: 'TNPSC Group I',
      category: 'group1',
      year: '2023',
      department: 'Tamil Nadu Police Service (TNPS)',
      hometown: 'Erode',
      rank: 'State Rank 4',
      badgeColor: '#fbbf24',
      badgeLabel: 'Group 1 Gazetted',
      story: 'Cracked in first attempt with guidance from Bharathi Academy mentors. Attended Saturday mock test series without missing a single week.',
      advice: 'Master the school textbooks and practice answer writing under timed conditions. Bharathi test keys give pinpoint clarity.'
    },
    {
      id: 2,
      name: 'S. Divya, B.Sc.',
      posting: 'Sub-Registrar (Grade II)',
      cadre: 'Registration Executive Cadre',
      exam: 'TNPSC Group II',
      category: 'group2',
      year: '2022',
      department: 'Registration Department',
      hometown: 'Coimbatore',
      rank: 'Top 15 Overall',
      badgeColor: '#60a5fa',
      badgeLabel: 'Group 2 Executive',
      story: 'Overcame rural background through 100% free mentorship and intensive interview coaching by serving Joint Sub-Registrar mentors.',
      advice: 'General Tamil syllabus is the biggest game-changer. Never ignore daily current affairs revisions.'
    },
    {
      id: 3,
      name: 'P. Arulselvan, B.Com.',
      posting: 'Sub-Inspector of Police (Taluk)',
      cadre: 'Uniformed Services Executive',
      exam: 'TNUSRB Joint Recruitment',
      category: 'police',
      year: '2023',
      department: 'Law & Order Wing, Coimbatore City',
      hometown: 'Salem',
      rank: 'State Physical & Written Top Rank',
      badgeColor: '#34d399',
      badgeLabel: 'Police Sub-Inspector',
      story: 'Balanced physical endurance drills alongside 50+ Bharathi Academy full-length police mock tests.',
      advice: 'Maintain equal dedication between physical fitness test and GS aptitude papers. Consistency beats brilliance.'
    },
    {
      id: 4,
      name: 'K. Manikandan, M.A.',
      posting: 'Assistant Section Officer (ASO)',
      cadre: 'Secretariat Ministerial Cadre',
      exam: 'TNPSC Group II',
      category: 'group2',
      year: '2023',
      department: 'Secretariat, Fort St. George, Chennai',
      hometown: 'Namakkal',
      rank: 'Merit Selection',
      badgeColor: '#60a5fa',
      badgeLabel: 'Group 2 Secretariat',
      story: 'Prepared while working a day job. The weekend test batches and online PDF materials made self-study feasible and structured.',
      advice: 'Analyze every error in your weekly OMR sheet. Improving 5 weak areas every test guarantees selection.'
    },
    {
      id: 5,
      name: 'M. Kavitha, B.A.',
      posting: 'Village Administrative Officer (VAO)',
      cadre: 'Revenue Administration Cadre',
      exam: 'TNPSC Group IV & VAO',
      category: 'group4',
      year: '2024',
      department: 'Revenue Administration, Erode Taluk',
      hometown: 'Erode',
      rank: 'District 1st in PSTM Quota',
      badgeColor: '#f472b6',
      badgeLabel: 'Group 4 & VAO',
      story: 'Tamil medium candidate who maximized the 20% PSTM reservation quota with scoring 98/100 in General Tamil.',
      advice: 'Samacheer Kalvi books from 6th to 12th standard are your holy scripture for Group 4 exams.'
    },
    {
      id: 6,
      name: 'A. Sathish Kumar, B.E.',
      posting: 'Sub-Inspector of Police (Technical)',
      cadre: 'Police Technical Wing',
      exam: 'TNUSRB SI Technical',
      category: 'police',
      year: '2023',
      department: 'Police Telecommunication Directorate',
      hometown: 'Tiruppur',
      rank: 'State Rank 7',
      badgeColor: '#34d399',
      badgeLabel: 'SI Technical',
      story: 'Utilized engineering background with Bharathi specialized electronics guidance sessions.',
      advice: 'Focus heavily on core technical fundamentals and daily Tamil eligibility mock tests.'
    },
    {
      id: 7,
      name: 'T. Gokul, B.Sc.',
      posting: 'Junior Assistant (Judicial)',
      cadre: 'Judicial Ministerial Service',
      exam: 'TNPSC Group IV',
      category: 'group4',
      year: '2024',
      department: 'Judicial Ministerial Service',
      hometown: 'Erode',
      rank: 'State Merit Rank',
      badgeColor: '#f472b6',
      badgeLabel: 'Judicial Service',
      story: 'Dedicated student who spent 10 hours daily at the Bharathi study library and cleared in his 2nd attempt.',
      advice: 'Never skip mock OMR shading practice. Time management in the 3-hour hall is 50% of the battle.'
    },
    {
      id: 8,
      name: 'R. Soundarya, M.Com.',
      posting: 'Revenue Assistant',
      cadre: 'Revenue Subordinate Service',
      exam: 'TNPSC Group II-A',
      category: 'group2',
      year: '2023',
      department: 'District Collectorate, Erode',
      hometown: 'Gobichettipalayam',
      rank: 'Top 30 Merit',
      badgeColor: '#60a5fa',
      badgeLabel: 'Revenue Assistant',
      story: 'Mother of one who managed family and study with unwavering discipline and supportive faculty mentoring.',
      advice: 'Believe in yourself. Age or marital status is never a barrier to serving the public in Tamil Nadu government.'
    },
    {
      id: 9,
      name: 'G. Karthikeyan, B.Sc.',
      posting: 'Sub-Inspector of Police (Finger Print)',
      cadre: 'Forensic Investigation Cadre',
      exam: 'TNUSRB SI Finger Print',
      category: 'police',
      year: '2022',
      department: 'Forensic Science & Crime Bureau',
      hometown: 'Bhavani',
      rank: 'State Rank 3',
      badgeColor: '#34d399',
      badgeLabel: 'SI Finger Print',
      story: 'Trained under serving police mentors at Bharathi Academy who provided hands-on interview orientation.',
      advice: 'Physics and Chemistry fundamentals must be rock-solid along with high mental ability scores.'
    },
    {
      id: 10,
      name: 'N. Priya, B.A. (Tamil)',
      posting: 'Executive Officer (Grade IV)',
      cadre: 'HR&CE Administrative Wing',
      exam: 'TNPSC HR&CE Services',
      category: 'group4',
      year: '2023',
      department: 'Hindu Religious & Charitable Endowments',
      hometown: 'Dharapuram',
      rank: 'State Merit Selection',
      badgeColor: '#f472b6',
      badgeLabel: 'HR&CE Officer',
      story: 'Leveraged deep knowledge of Tamil literature and Saivism/Vaishnavism taught by academy guest scholars.',
      advice: 'Specific departmental act papers require dedicated notes. Academy handouts were invaluable.'
    },
    {
      id: 11,
      name: 'S. Rajesh, 12th Pass',
      posting: 'Police Constable (Grade II)',
      cadre: 'Armed Reserve Police',
      exam: 'TNUSRB Common Recruitment',
      category: 'police',
      year: '2024',
      department: 'Armed Reserve (AR), Salem',
      hometown: 'Mettur',
      rank: 'Physical Full Marks (15/15)',
      badgeColor: '#34d399',
      badgeLabel: 'Police Constable',
      story: 'Achieved dream uniform directly after school with free coaching and ground physical coaching provided at Erode.',
      advice: 'Start rope climbing and 1500m running 4 months before notification. Don’t wait until the last month.'
    },
    {
      id: 12,
      name: 'V. Bharathi, B.Com.',
      posting: 'Typist (Secretariat)',
      cadre: 'Secretariat Clerical Service',
      exam: 'TNPSC Group IV & Typist',
      category: 'group4',
      year: '2024',
      department: 'Personnel & Administrative Reforms',
      hometown: 'Perundurai',
      rank: 'Top Rank in Typing Quota',
      badgeColor: '#f472b6',
      badgeLabel: 'Secretariat Typist',
      story: 'Holding Tamil & English Both Higher technical certificate gave immediate edge in Group 4 Typist counselling.',
      advice: 'Technical typewriter qualification guarantees you a posting even with a moderate GS score.'
    }
  ];

  useEffect(() => {
    const fetchAchievers = async () => {
      try {
        const response = await achieversApi.getAll();
        if (Array.isArray(response.data) && response.data.length > 0) {
          const merged = response.data.map((item, index) => ({
            id: item.id || `api-${index}`,
            name: item.name || item.candidateName || item.username || 'Officer Candidate',
            posting: item.posting || item.namepost || item.designation || 'State Govt. Officer',
            cadre: item.cadre || item.department || 'State Administrative Service',
            exam: item.exam || item.syllabus || 'TNPSC Examination',
            category: (item.exam || '').toLowerCase().includes('police') || (item.namepost || '').toLowerCase().includes('si') ? 'police' : 'group2',
            year: item.year || item.batch || '2023',
            department: item.department || 'Government of Tamil Nadu',
            hometown: item.hometown || item.district || 'Tamil Nadu',
            rank: item.rank || 'Merit Selection',
            badgeColor: '#fbbf24',
            badgeLabel: item.exam || 'Civil Cadre',
            story: item.story || 'Trained and mentored at Bharathi Academy with weekly OMR test batches.',
            advice: item.advice || 'Consistent revision of school books and weekly mock test evaluation is key.'
          }));
          setAchieversList(merged);
        } else {
          setAchieversList(defaultAchievers);
        }
      } catch (error) {
        setAchieversList(defaultAchievers);
      }
    };

    fetchAchievers();
  }, []);

  const dataList = achieversList.length > 0 ? achieversList : defaultAchievers;

  // Filter & Search Logic
  const filteredAchievers = dataList.filter(item => {
    const categoryMatch = 
      filterCategory === 'all' ? true :
      filterCategory === 'group1' ? (item.exam || '').includes('Group I') || (item.category === 'group1') :
      filterCategory === 'group2' ? (item.exam || '').includes('Group II') || (item.category === 'group2') :
      filterCategory === 'group4' ? (item.exam || '').includes('Group IV') || (item.exam || '').includes('VAO') || (item.category === 'group4') :
      filterCategory === 'police' ? (item.exam || '').toLowerCase().includes('police') || (item.exam || '').toLowerCase().includes('si') || (item.exam || '').toLowerCase().includes('tnusrb') || (item.category === 'police') :
      true;

    const yearMatch = filterYear === 'all' || (item.year && item.year.toString() === filterYear);

    const query = searchQuery.toLowerCase().trim();
    const searchMatch = !query || 
      (item.name && item.name.toLowerCase().includes(query)) ||
      (item.posting && item.posting.toLowerCase().includes(query)) ||
      (item.department && item.department.toLowerCase().includes(query)) ||
      (item.hometown && item.hometown.toLowerCase().includes(query)) ||
      (item.exam && item.exam.toLowerCase().includes(query));

    return categoryMatch && yearMatch && searchMatch;
  });

  const spotlightAchievers = dataList.slice(0, 3);

  return (
    <div 
      className="achievements-page pb-5"
      style={{
        backgroundColor: 'var(--canvas-bg)',
        color: 'var(--text-main)',
        minHeight: '100vh',
        transition: 'background-color 0.25s ease, color 0.25s ease'
      }}
    >
      {/* 1. Grand Hero Banner */}
      <section 
        className="course-hero position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #061126 0%, #0b1e42 60%, #173b75 100%)',
          padding: '3.5rem 0 3rem',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        <div className="site-container">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {/* Breadcrumb Navigation */}
            <div className="d-flex align-items-center gap-2 text-warning small fw-bold text-uppercase mb-2">
              <Link to="/" className="text-warning text-decoration-none">Home</Link>
              <span className="opacity-50">/</span>
              <span className="text-light">Hall of Fame</span>
            </div>

            {/* Tamil Calligraphy Motto */}
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3" style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.35)' }}>
              <i className="bi bi-award-fill text-warning"></i>
              <span className="tamil-text text-warning fw-bold small">"வெற்றியின் முதல் படி !" · 130+ Officer Selections Since 2017</span>
            </div>

            <h1 className="text-white mb-2 fw-bold" style={{ letterSpacing: '-0.02em' }}>
              Results & Achievers Hall of Fame
            </h1>
            <p className="text-light opacity-75 mb-4" style={{ maxWidth: '780px', fontSize: '1.05rem', lineHeight: '1.6' }}>
              Saluting the relentless dedication of candidates who trained under 100% free classroom guidance in Erode and now proudly lead Tamil Nadu's civil administration and uniformed police ranks.
            </p>

            {/* Key Selection Metrics Bar */}
            <div className="row g-3 pt-2">
              {[
                { count: '130+', label: 'Serving Officers', color: '#fbbf24', icon: 'bi-trophy' },
                { count: '35+', label: 'Police Sub-Inspectors', color: '#34d399', icon: 'bi-shield-shaded' },
                { count: '20+', label: 'Group 1 & 2 Cadres', color: '#60a5fa', icon: 'bi-briefcase-fill' },
                { count: '75+', label: 'VAO & Ministerial', color: '#f472b6', icon: 'bi-building' }
              ].map((metric, i) => (
                <div className="col-6 col-md-3" key={i}>
                  <div 
                    className="p-3 rounded-3 h-100"
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.05)', 
                      backdropFilter: 'blur(8px)', 
                      border: '1px solid rgba(255, 255, 255, 0.1)' 
                    }}
                  >
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <i className={`bi ${metric.icon}`} style={{ color: metric.color }}></i>
                      <div className="h3 fw-bold mb-0 text-white" style={{ letterSpacing: '-0.02em' }}>
                        {metric.count}
                      </div>
                    </div>
                    <div className="small text-light opacity-75 fw-medium">{metric.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="site-container py-5">
        {/* 2. Spotlight Laureates Podium (Top 3 Ranks) */}
        <div className="mb-5">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
            <div>
              <div className="text-uppercase small fw-bold tracking-wider" style={{ color: 'var(--amber-500)', letterSpacing: '0.08em' }}>
                Premier Honors
              </div>
              <h2 className="fw-bold mb-0" style={{ color: 'var(--text-main)', fontSize: '1.65rem' }}>
                Featured Officer Laureates
              </h2>
            </div>
            <div className="d-flex align-items-center gap-2 small px-3 py-1 rounded-pill" style={{ background: 'var(--canvas-subtle)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
              <i className="bi bi-patch-check-fill text-warning"></i>
              <span>State Rank Selections</span>
            </div>
          </div>

          <div className="row g-4">
            {spotlightAchievers.map((star, idx) => (
              <div className="col-12 col-md-4" key={`spotlight-${star.id}`}>
                <motion.div 
                  whileHover={{ y: -6, boxShadow: '0 18px 36px rgba(0, 0, 0, 0.16)' }}
                  className="rounded-4 overflow-hidden h-100 d-flex flex-column"
                  style={{
                    background: 'var(--canvas-surface)',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: 'var(--shadow-md)',
                    transition: 'all 0.25s ease'
                  }}
                >
                  {/* Card Header Strip */}
                  <div 
                    className="p-3 text-white text-center position-relative"
                    style={{
                      background: idx === 0 
                        ? 'linear-gradient(135deg, #091325 0%, #14284d 100%)'
                        : idx === 1
                        ? 'linear-gradient(135deg, #0d1e3a 0%, #1a3666 100%)'
                        : 'linear-gradient(135deg, #081a2f 0%, #153257 100%)',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="badge px-2 py-1 rounded text-dark fw-bold small" style={{ background: '#fbbf24' }}>
                        <i className="bi bi-award-fill me-1"></i>{star.rank}
                      </span>
                      <span className="small text-light opacity-75">Selection Year: {star.year}</span>
                    </div>

                    <div 
                      className="rounded-circle mx-auto d-flex align-items-center justify-content-center shadow"
                      style={{ 
                        width: '70px', 
                        height: '70px', 
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        color: '#ffffff',
                        fontSize: '1.65rem',
                        fontWeight: '800',
                        border: '3px solid #ffffff'
                      }}
                    >
                      {star.name.charAt(0)}
                    </div>

                    <h5 className="fw-bold mt-2 mb-0 text-white">{star.name}</h5>
                    <div className="small fw-semibold mt-1" style={{ color: '#fbbf24' }}>
                      {star.posting}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-3 p-lg-4 d-flex flex-column flex-grow-1">
                    <div className="d-flex align-items-center gap-2 small mb-2" style={{ color: 'var(--text-muted)' }}>
                      <i className="bi bi-building text-secondary"></i>
                      <span className="text-truncate">{star.department}</span>
                    </div>

                    <div className="d-flex align-items-center gap-2 small mb-3" style={{ color: 'var(--text-muted)' }}>
                      <i className="bi bi-geo-alt text-danger"></i>
                      <span>Native District: <strong style={{ color: 'var(--text-main)' }}>{star.hometown}</strong></span>
                    </div>

                    <p 
                      className="small fst-italic mb-3 flex-grow-1 p-2 rounded-3"
                      style={{
                        background: 'var(--canvas-subtle)',
                        color: 'var(--text-muted)',
                        border: '1px solid var(--border-subtle)',
                        lineHeight: '1.5'
                      }}
                    >
                      "{star.story}"
                    </p>

                    <button 
                      onClick={() => setSelectedAchiever(star)}
                      className="btn btn-sm w-100 fw-semibold rounded-3 mt-auto d-flex align-items-center justify-content-center gap-2"
                      style={{
                        background: 'var(--canvas-subtle)',
                        border: '1px solid var(--border-strong)',
                        color: 'var(--text-main)',
                        padding: '0.5rem 0.8rem'
                      }}
                    >
                      <i className="bi bi-card-text text-warning"></i>
                      <span>Read Success Story & Advice</span>
                    </button>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Interactive Filter Bar */}
        <div 
          className="p-3 p-md-4 rounded-4 mb-4"
          style={{
            background: 'var(--canvas-surface)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div className="row g-3 align-items-center justify-content-between">
            {/* Search Input */}
            <div className="col-12 col-md-5">
              <div className="input-group">
                <span className="input-group-text border-end-0" style={{ background: 'var(--canvas-subtle)', borderColor: 'var(--border-strong)' }}>
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, posting, department, or district..."
                  className="form-control border-start-0"
                  style={{
                    background: 'var(--canvas-subtle)',
                    borderColor: 'var(--border-strong)',
                    color: 'var(--text-main)'
                  }}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="btn btn-outline-secondary border-start-0" 
                    type="button"
                  >
                    <i className="bi bi-x"></i>
                  </button>
                )}
              </div>
            </div>

            {/* Batch Year Select */}
            <div className="col-6 col-md-3">
              <select 
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="form-select"
                style={{
                  background: 'var(--canvas-subtle)',
                  borderColor: 'var(--border-strong)',
                  color: 'var(--text-main)'
                }}
              >
                <option value="all">All Selection Batches</option>
                <option value="2024">2024 Officers</option>
                <option value="2023">2023 Officers</option>
                <option value="2022">2022 Officers</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="col-6 col-md-4 text-end">
              <div className="btn-group" role="group">
                <button 
                  type="button" 
                  onClick={() => setViewMode('grid')}
                  className={`btn btn-sm px-3 ${viewMode === 'grid' ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary'}`}
                  title="Card Grid View"
                >
                  <i className="bi bi-grid-fill me-1"></i>Cards
                </button>
                <button 
                  type="button" 
                  onClick={() => setViewMode('table')}
                  className={`btn btn-sm px-3 ${viewMode === 'table' ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary'}`}
                  title="Directory Table View"
                >
                  <i className="bi bi-table me-1"></i>Directory
                </button>
              </div>
            </div>

            {/* Clean Category Selector Tabs */}
            <div className="col-12 pt-2 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="d-flex flex-wrap gap-2">
                {[
                  { id: 'all', label: 'All Cadres' },
                  { id: 'group1', label: 'Group 1 (DSP / DC)' },
                  { id: 'group2', label: 'Group 2 / 2A (Sub-Registrar & ASO)' },
                  { id: 'group4', label: 'Group 4 & VAO' },
                  { id: 'police', label: 'Police TNUSRB (SI & Constables)' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setFilterCategory(cat.id)}
                    className={`btn btn-sm px-3 rounded-3 transition-all ${
                      filterCategory === cat.id 
                        ? 'btn-warning text-dark fw-bold shadow-sm' 
                        : 'btn-outline-secondary'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Counter Summary */}
        <div className="d-flex justify-content-between align-items-center mb-3 small" style={{ color: 'var(--text-muted)' }}>
          <div>
            Showing <strong style={{ color: 'var(--text-main)' }}>{filteredAchievers.length}</strong> of <strong>{dataList.length}</strong> verified academy selections
            {searchQuery && <span> matching "<em>{searchQuery}</em>"</span>}
          </div>
          {(filterCategory !== 'all' || filterYear !== 'all' || searchQuery) && (
            <button 
              onClick={() => { setFilterCategory('all'); setFilterYear('all'); setSearchQuery(''); }}
              className="btn btn-link btn-sm text-decoration-none p-0 text-danger"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* 4. Display Content: Cards Grid OR Directory Table */}
        {filteredAchievers.length === 0 ? (
          <div 
            className="p-5 text-center rounded-4 my-4"
            style={{
              background: 'var(--canvas-surface)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <i className="bi bi-search fs-1 text-muted mb-3 d-block"></i>
            <h5 className="fw-bold" style={{ color: 'var(--text-main)' }}>No Achievers Found</h5>
            <p className="text-muted">No candidates matched your search criteria.</p>
            <button 
              onClick={() => { setFilterCategory('all'); setFilterYear('all'); setSearchQuery(''); }}
              className="btn btn-warning btn-sm rounded-3 px-4 fw-semibold"
            >
              Clear Search Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <motion.div layout className="row g-4">
            <AnimatePresence>
              {filteredAchievers.map((officer, index) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="col-12 col-md-6 col-lg-4 col-xl-3" 
                  key={officer.id || index}
                >
                  <motion.div 
                    whileHover={{ y: -6, boxShadow: '0 16px 32px rgba(0, 0, 0, 0.18)' }}
                    className="rounded-4 h-100 overflow-hidden d-flex flex-column"
                    style={{ 
                      background: 'var(--canvas-surface)',
                      border: '1px solid var(--border-subtle)',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {/* Top Cadre Strip */}
                    <div 
                      className="p-2 px-3 d-flex justify-content-between align-items-center"
                      style={{ 
                        background: 'var(--canvas-subtle)',
                        borderBottom: '1px solid var(--border-subtle)'
                      }}
                    >
                      <span className="small fw-semibold" style={{ color: 'var(--amber-500)', fontSize: '0.75rem' }}>
                        {officer.exam}
                      </span>
                      <span className="small" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                        Batch {officer.year}
                      </span>
                    </div>

                    <div className="p-3 d-flex flex-column flex-grow-1">
                      {/* Monogram + Officer Name */}
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <div 
                          className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
                          style={{ 
                            width: '48px', 
                            height: '48px', 
                            minWidth: '48px',
                            background: 'linear-gradient(135deg, #0b1e42 0%, #1b4588 100%)',
                            border: '2px solid var(--border-subtle)',
                            fontSize: '1.2rem'
                          }}
                        >
                          {officer.name.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                          <h6 className="fw-bold mb-0 text-truncate" style={{ color: 'var(--text-main)' }} title={officer.name}>
                            {officer.name}
                          </h6>
                          <div className="small fw-semibold text-truncate" style={{ color: 'var(--amber-500)', fontSize: '0.8rem' }}>
                            {officer.posting}
                          </div>
                        </div>
                      </div>

                      {/* Department, Hometown, Rank Details */}
                      <div className="d-flex flex-column gap-1 small mb-3 flex-grow-1" style={{ color: 'var(--text-muted)' }}>
                        <div className="d-flex align-items-center gap-2">
                          <i className="bi bi-building text-secondary" style={{ fontSize: '0.75rem' }}></i>
                          <span className="text-truncate">{officer.department}</span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <i className="bi bi-geo-alt text-danger" style={{ fontSize: '0.75rem' }}></i>
                          <span>Native: <strong style={{ color: 'var(--text-main)' }}>{officer.hometown}</strong></span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <i className="bi bi-patch-check-fill text-success" style={{ fontSize: '0.75rem' }}></i>
                          <span>Rank: <strong style={{ color: 'var(--text-main)' }}>{officer.rank}</strong></span>
                        </div>
                      </div>

                      {/* Modal CTA */}
                      <button 
                        onClick={() => setSelectedAchiever(officer)}
                        className="btn btn-sm w-100 text-center py-2 mt-auto rounded-3 fw-medium"
                        style={{
                          background: 'var(--canvas-subtle)',
                          border: '1px solid var(--border-strong)',
                          color: 'var(--text-main)',
                          fontSize: '0.8rem'
                        }}
                      >
                        <i className="bi bi-card-text me-1 text-warning"></i>
                        <span>View Profile & Advice</span>
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Directory Table View */
          <div 
            className="rounded-4 overflow-hidden"
            style={{
              background: 'var(--canvas-surface)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div className="table-responsive">
              <table className="table mb-0 align-middle">
                <thead>
                  <tr style={{ background: 'var(--canvas-subtle)', borderBottom: '1px solid var(--border-strong)' }}>
                    <th style={{ color: 'var(--text-main)', padding: '12px 16px' }}>Candidate Name</th>
                    <th style={{ color: 'var(--text-main)', padding: '12px 16px' }}>Official Posting</th>
                    <th style={{ color: 'var(--text-main)', padding: '12px 16px' }}>Exam Scheme</th>
                    <th style={{ color: 'var(--text-main)', padding: '12px 16px' }}>Department</th>
                    <th style={{ color: 'var(--text-main)', padding: '12px 16px' }}>Hometown</th>
                    <th style={{ color: 'var(--text-main)', padding: '12px 16px' }}>Batch</th>
                    <th className="text-end" style={{ color: 'var(--text-main)', padding: '12px 16px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAchievers.map((officer, index) => (
                    <tr 
                      key={`table-${officer.id || index}`}
                      style={{ borderBottom: '1px solid var(--border-subtle)' }}
                    >
                      <td style={{ padding: '12px 16px' }}>
                        <div className="d-flex align-items-center gap-2">
                          <div 
                            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                            style={{ width: '32px', height: '32px', minWidth: '32px', background: '#0b1e42', fontSize: '0.8rem' }}
                          >
                            {officer.name.charAt(0)}
                          </div>
                          <strong style={{ color: 'var(--text-main)' }}>{officer.name}</strong>
                        </div>
                      </td>
                      <td style={{ color: 'var(--amber-500)', fontWeight: '600', padding: '12px 16px' }}>
                        {officer.posting}
                      </td>
                      <td style={{ color: 'var(--text-muted)', padding: '12px 16px' }}>
                        {officer.exam}
                      </td>
                      <td className="small" style={{ color: 'var(--text-muted)', padding: '12px 16px' }}>
                        {officer.department}
                      </td>
                      <td style={{ color: 'var(--text-main)', padding: '12px 16px' }}>
                        {officer.hometown}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span className="badge" style={{ background: 'var(--canvas-subtle)', color: 'var(--text-main)', border: '1px solid var(--border-subtle)' }}>
                          {officer.year}
                        </span>
                      </td>
                      <td className="text-end" style={{ padding: '12px 16px' }}>
                        <button 
                          onClick={() => setSelectedAchiever(officer)}
                          className="btn btn-sm py-1 px-3 rounded-2"
                          style={{
                            background: 'var(--canvas-subtle)',
                            border: '1px solid var(--border-strong)',
                            color: 'var(--text-main)',
                            fontSize: '0.78rem'
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. Detailed Success Interview Modal */}
        <AnimatePresence>
          {selectedAchiever && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedAchiever(null)}
                className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-70"
                style={{ zIndex: 999998, backdropFilter: 'blur(4px)' }}
              />

              <div 
                className="position-fixed top-50 start-50 translate-middle w-100 p-3" 
                style={{ maxWidth: '600px', zIndex: 999999 }}
              >
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  className="rounded-4 shadow-2xl overflow-hidden"
                  style={{
                    background: 'var(--canvas-surface)',
                    border: '1px solid var(--border-strong)',
                    color: 'var(--text-main)'
                  }}
                >
                  {/* Modal Header */}
                  <div 
                    className="p-4 text-white position-relative"
                    style={{ 
                      background: 'linear-gradient(135deg, #061126 0%, #0b1e42 60%, #173b75 100%)',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)' 
                    }}
                  >
                    <button 
                      onClick={() => setSelectedAchiever(null)}
                      className="btn btn-sm btn-outline-light rounded-circle position-absolute top-0 end-0 m-3 p-1"
                      aria-label="Close Modal"
                    >
                      <i className="bi bi-x-lg"></i>
                    </button>

                    <div className="d-flex align-items-center gap-3">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow"
                        style={{ width: '62px', height: '62px', background: '#f59e0b', fontSize: '1.6rem', border: '2px solid #ffffff' }}
                      >
                        {selectedAchiever.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="fw-bold mb-0 text-white">{selectedAchiever.name}</h4>
                        <div className="text-warning fw-semibold">{selectedAchiever.posting}</div>
                        <small className="text-light opacity-75">{selectedAchiever.department}</small>
                      </div>
                    </div>
                  </div>

                  {/* Modal Body */}
                  <div className="p-4">
                    <div 
                      className="row g-2 mb-3 small p-3 rounded-3"
                      style={{ 
                        background: 'var(--canvas-subtle)',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      <div className="col-6">
                        <span className="text-muted d-block">Competitive Examination:</span>
                        <strong style={{ color: 'var(--text-main)' }}>{selectedAchiever.exam}</strong>
                      </div>
                      <div className="col-6">
                        <span className="text-muted d-block">Selection Batch:</span>
                        <strong style={{ color: 'var(--text-main)' }}>{selectedAchiever.year}</strong>
                      </div>
                      <div className="col-6">
                        <span className="text-muted d-block">Native District:</span>
                        <strong style={{ color: 'var(--text-main)' }}>{selectedAchiever.hometown}</strong>
                      </div>
                      <div className="col-6">
                        <span className="text-muted d-block">Merit Standing:</span>
                        <strong className="text-success">{selectedAchiever.rank}</strong>
                      </div>
                    </div>

                    <div className="mb-3">
                      <h6 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>
                        <i className="bi bi-journal-check text-warning me-2"></i>Preparation Journey at Bharathi
                      </h6>
                      <p className="small mb-0" style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                        {selectedAchiever.story}
                      </p>
                    </div>

                    <div 
                      className="p-3 rounded-3 mb-4"
                      style={{ 
                        background: 'var(--canvas-subtle)',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      <h6 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>
                        <i className="bi bi-lightbulb-fill text-warning me-2"></i>Advice to Fellow Aspirants
                      </h6>
                      <p className="small mb-0 fst-italic" style={{ color: 'var(--text-muted)' }}>
                        "{selectedAchiever.advice}"
                      </p>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <span className="small tamil-text" style={{ color: 'var(--text-muted)' }}>
                        பாரதி தேர்வுக்களம் · ஈரோடு
                      </span>
                      <button 
                        onClick={() => setSelectedAchiever(null)}
                        className="btn btn-warning btn-sm px-4 rounded-3 fw-semibold text-dark"
                      >
                        Close Profile
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>

        {/* 6. Motivational Callout Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-5 p-4 p-md-5 rounded-4 text-center text-white position-relative overflow-hidden"
          style={{ 
            background: 'linear-gradient(135deg, #051024 0%, #0b1e42 60%, #102d61 100%)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-xl)' 
          }}
        >
          <div className="position-relative" style={{ zIndex: 2 }}>
            <span 
              className="badge px-3 py-1 rounded-pill fw-bold mb-3 text-dark"
              style={{ background: '#fbbf24' }}
            >
              YOUR FUTURE CALLING
            </span>
            <h2 className="text-white fw-bold mb-2">Your Name Deserves to Be Here Next</h2>
            <p className="text-light opacity-75 mx-auto mb-4" style={{ maxWidth: '640px', fontSize: '1rem', lineHeight: '1.6' }}>
              Whether your aspiration is DSP, Sub-Registrar, Sub-Inspector of Police, or Village Administrative Officer (VAO), our 100% free classroom guidance, study library, and weekly OMR test series will empower your path.
            </p>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Link to="/Student-Register" className="btn-gold-custom">
                <i className="bi bi-pencil-square"></i>
                <span>Join 2026 Free Admission Batch</span>
              </Link>
              <Link to="/Test-Series" className="btn-outline-custom text-white border-light">
                <i className="bi bi-file-earmark-pdf"></i>
                <span>Download Test Schedules</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
