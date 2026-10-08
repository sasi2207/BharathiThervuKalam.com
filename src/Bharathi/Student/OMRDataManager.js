// Master OMR Sheet, Answer Key, and Test Evaluation Engine

export const DEFAULT_MOCK_TESTS = [
  {
    id: 'test-grp4-01',
    title: 'TNPSC Group IV & VAO Full Mock Test 1',
    stream: 'TNPSC',
    department: 'Group IV & VAO',
    totalQuestions: 20, // 20 comprehensive questions in online interactive sheet
    durationMinutes: 30,
    marksPerQuestion: 1.5,
    negativeMark: 0,
    maxMarks: 30,
    date: '2026-03-25',
    pdfUrl: '/SUNDAY GRP 4 SCHEDULE -2026.pdf',
    instructions:
      'Shade one bubble (A, B, C, D) for each question. Question paper follows TNPSC SSLC standard covering General Tamil, Indian Polity, History, and Mental Ability.',
    questions: [
      { id: 1, topic: 'General Tamil', text: 'செம்மொழித் தமிழ் மாநாடு நடைபெற்ற இடம் எது?', options: ['A) மதுரை', 'B) கோயம்புத்தூர்', 'C) சென்னை', 'D) திருச்சி'], correct: 'B', explanation: 'உலகத் தமிழ்ச் செம்மொழி மாநாடு 2010-ல் கோயம்புத்தூரில் நடைபெற்றது.' },
      { id: 2, topic: 'Indian Polity', text: 'இந்திய அரசியலமைப்பு சட்டத்தை உருவாக்கிய வரைவுக் குழுவின் தலைவர் யார்?', options: ['A) டாக்டர் பி.ஆர். அம்பேத்கர்', 'B) ஜவஹர்லால் நேரு', 'C) ராஜேந்திர பிரசாத்', 'D) சர்தார் வல்லபாய் படேல்'], correct: 'A', explanation: 'டாக்டர் பி.ஆர். அம்பேத்கர் வரைவுக் குழுவின் தலைவராகப் பணியாற்றினார்.' },
      { id: 3, topic: 'General Tamil', text: 'திருக்குறளில் உள்ள மொத்த அதிகாரங்களின் எண்ணிக்கை எத்தனை?', options: ['A) 130', 'B) 133', 'C) 1330', 'D) 100'], correct: 'B', explanation: 'திருக்குறளில் 133 அதிகாரங்களும் 1330 குறட்பாக்களும் உள்ளன.' },
      { id: 4, topic: 'Indian History', text: 'சிந்து சமவெளி நாகரிகத்தில் கப்பல் கட்டும் தளம் எங்கு கண்டறியப்பட்டது?', options: ['A) ஹரப்பா', 'B) மொகஞ்சதாரோ', 'C) லோத்தல்', 'D) காலிபங்கன்'], correct: 'C', explanation: 'குஜராத்தில் உள்ள லோத்தலில் பழங்கால துறைமுகத் தளம் கண்டறியப்பட்டது.' },
      { id: 5, topic: 'Mental Ability', text: 'தொடரில் அடுத்த எண்ணைக் காண்க: 2, 6, 12, 20, 30, ?', options: ['A) 40', 'B) 42', 'C) 44', 'D) 46'], correct: 'B', explanation: '+4, +6, +8, +10, +12 முறையே கூட்டுவதால் 30 + 12 = 42.' },
      { id: 6, topic: 'Tamil Nadu Administration', text: 'தமிழ்நாட்டின் தற்போதைய மாவட்டங்களின் மொத்த எண்ணிக்கை எத்தனை?', options: ['A) 32', 'B) 35', 'C) 38', 'D) 40'], correct: 'C', explanation: 'தமிழ்நாட்டில் தற்போது 38 வருவாய் மாவட்டங்கள் உள்ளன.' },
      { id: 7, topic: 'Geography', text: 'தென்னிந்தியாவின் மிக உயரமான சிகரம் எது?', options: ['A) ஆனைமுடி', 'B) தொட்டபெட்டா', 'C) மகேந்திரகிரி', 'D) அகத்தியர்மலை'], correct: 'A', explanation: 'ஆனைமுடி (2695 மீ) மேற்குத் தொடர்ச்சி மலையின் மிக உயரமான சிகரமாகும்.' },
      { id: 8, topic: 'General Tamil', text: 'சிலப்பதிகாரத்தை இயற்றியவர் யார்?', options: ['A) சீத்தலைச் சாத்தனார்', 'B) இளங்கோவடிகள்', 'C) கம்பர்', 'D) கபிலர்'], correct: 'B', explanation: 'சேர மன்னர் மரபில் வந்த இளங்கோவடிகள் சிலப்பதிகாரத்தை இயற்றினார்.' },
      { id: 9, topic: 'Science', text: 'மனித உடலின் இயல்பான வெப்பநிலை என்ன?', options: ['A) 35°C', 'B) 37°C (98.6°F)', 'C) 40°C', 'D) 32°C'], correct: 'B', explanation: 'மனித உடலின் சாதாரண வெப்பநிலை சுமார் 37°C அல்லது 98.6°F.' },
      { id: 10, topic: 'Economy', text: 'இந்திய ரிசர்வ் வங்கியின் (RBI) தலைமையகம் எங்கு அமைந்துள்ளது?', options: ['A) புது தில்லி', 'B) சென்னை', 'C) மும்பை', 'D) கொல்கத்தா'], correct: 'C', explanation: 'ரிசர்வ் வங்கியின் மத்திய தலைமையகம் மும்பையில் அமைந்துள்ளது.' },
      { id: 11, topic: 'General Tamil', text: 'பதினெண்கீழ்க்கணக்கு நூல்களில் அறநூல்கள் எத்தனை?', options: ['A) 11', 'B) 6', 'C) 1', 'D) 18'], correct: 'A', explanation: 'பதினெண்கீழ்க்கணக்கில் 11 அறநூல்கள், 6 அகநூல்கள், 1 புறநூல் உள்ளன.' },
      { id: 12, topic: 'Indian National Movement', text: 'சுயராஜ்ஜியம் எனது பிறப்புரிமை என்று முழங்கியவர் யார்?', options: ['A) நேதாஜி', 'B) திலகர்', 'C) காந்தியடிகள்', 'D) பகத்சிங்'], correct: 'B', explanation: 'பாலகங்காதர திலகர் சுயராஜ்ஜியம் எனது பிறப்புரிமை என்றார்.' },
      { id: 13, topic: 'Aptitude', text: 'ஒரு கடிகாரம் 12 மணி அடிக்க 11 நொடிகள் எடுத்துக் கொண்டால், 6 மணி அடிக்க எத்தனை நொடிகள் ஆகும்?', options: ['A) 5 நொடிகள்', 'B) 5.5 நொடிகள்', 'C) 6 நொடிகள்', 'D) 4.5 நொடிகள்'], correct: 'A', explanation: '11 இடைவெளிகளுக்கு 11 நொடிகள் எனில், 5 இடைவெளிகளுக்கு 5 நொடிகள்.' },
      { id: 14, topic: 'Polity', text: 'குடியரசுத் தலைவர் தேர்தலில் பங்கு பெறுபவர்கள் யார்?', options: ['A) பாராளுமன்ற இரு அவைகள் மற்றும் மாநில சட்டமன்றங்களின் தேர்ந்தெடுக்கப்பட்ட உறுப்பினர்கள்', 'B) மக்கள் நேரடியாக', 'C) லோக்சபா மட்டும்', 'D) ஆளுநர்கள்'], correct: 'A', explanation: 'பாராளுமன்ற மற்றும் மாநில சட்டப்பேரவை தேர்ந்தெடுக்கப்பட்ட உறுப்பினர்கள்.' },
      { id: 15, topic: 'General Tamil', text: 'உவமைக் கவிஞர் என்று அழைக்கப்படுபவர் யார்?', options: ['A) பாரதிதாசன்', 'B) சுரதா', 'C) வாணிதாசன்', 'D) கண்ணதாசன்'], correct: 'B', explanation: 'சுப்புரத்தினதாசன் (சுரதா) உவமைக் கவிஞர் என போற்றப்படுகிறார்.' },
      { id: 16, topic: 'Current Affairs', text: 'பாரதி தேர்வுக்களம் தொடங்கப்பட்ட ஆண்டு எது?', options: ['A) 2015', 'B) 2017', 'C) 2019', 'D) 2021'], correct: 'B', explanation: 'பாரதி தேர்வுக்களம் 2017-ஆம் ஆண்டு ஆகஸ்ட் 12-ல் ஈரோட்டில் தொடங்கப்பட்டது.' },
      { id: 17, topic: 'Environment', text: 'உலக சுற்றுச்சூழல் தினம் எப்போது கொண்டாடப்படுகிறது?', options: ['A) ஜூன் 5', 'B) ஏப்ரல் 22', 'C) மார்ச் 21', 'D) ஜூலை 11'], correct: 'A', explanation: 'ஒவ்வொரு ஆண்டும் ஜூன் 5-ஆம் நாள் உலக சுற்றுச்சூழல் தினமாக அனுசரிக்கப்படுகிறது.' },
      { id: 18, topic: 'Science', text: 'ஒளிச்சேர்க்கைக்கு மிகவும் அவசியமான நிறமி எது?', options: ['A) சாந்தோபில்', 'B) பச்சையம் (குளோரோபில்)', 'C) கரோட்டின்', 'D) ஆந்தோசயனின்'], correct: 'B', explanation: 'பச்சையம் (Chlorophyll) தாவரங்களில் ஒளி ஆற்றலை உறிஞ்சுகிறது.' },
      { id: 19, topic: 'General Tamil', text: 'வீரமாமுனிவர் இயற்றிய காப்பியம் எது?', options: ['A) தேம்பாவணி', 'B) சீறாப்புராணம்', 'C) இயேசு காவியம்', 'D) இரட்சணிய யாத்திரிகம்'], correct: 'A', explanation: 'கான்ஸ்டன்டைன் ஜோசப் பெஸ்கி (வீரமாமுனிவர்) தேம்பாவணியை இயற்றினார்.' },
      { id: 20, topic: 'Aptitude', text: '1 முதல் 100 வரையிலான இயல் எண்களின் கூடுதல் என்ன?', options: ['A) 5000', 'B) 5050', 'C) 5500', 'D) 5150'], correct: 'B', explanation: 'n(n+1)/2 = 100 * 101 / 2 = 5050.' },
    ],
  },
  {
    id: 'test-tnusrb-si-01',
    title: 'TNUSRB Sub-Inspector Joint Recruitment Model 1',
    stream: 'TNUSRB',
    department: 'Police SI (Taluk & AR)',
    totalQuestions: 20,
    durationMinutes: 30,
    marksPerQuestion: 1,
    negativeMark: 0,
    maxMarks: 20,
    date: '2026-03-28',
    pdfUrl: '/SATURDAY TIME TABLE-1.pdf',
    instructions:
      'TNUSRB SI Joint Recruitment written exam simulator. Section A: General Knowledge (10 Qs), Section B: Psychology & Logical Ability (10 Qs).',
    questions: [
      { id: 1, topic: 'Police Administration', text: 'தமிழ்நாடு காவல்துறையின் தலைவர் (DGP/HoPF) தலைமையகம் எங்குள்ளது?', options: ['A) எழும்பூர்', 'B) மைலாப்பூர் (காமராஜர் சாலை)', 'C) கிண்டி', 'D) தாம்பரம்'], correct: 'B', explanation: 'தமிழ்நாடு டி.ஜி.பி அலுவலகம் சென்னை மெரினா கடற்கரை காமராஜர் சாலையில் உள்ளது.' },
      { id: 2, topic: 'Indian Penal Code', text: 'சட்டவிரோதமாக கூடுதல் (Unlawful Assembly) பற்றி கூறும் இந்திய தண்டனைச் சட்டப் பிரிவு எது?', options: ['A) பிரிவு 141', 'B) பிரிவு 302', 'C) பிரிவு 420', 'D) பிரிவு 376'], correct: 'A', explanation: 'பிரிவு 141 ஐந்து அல்லது அதற்கு மேற்பட்ட நபர்கள் கூடுவதை வரையறுக்கிறது.' },
      { id: 3, topic: 'Psychology', text: 'திசை சார்ந்த வினா: ஒருவர் வடக்கு நோக்கி 5 கி.மீ சென்று, வலதுபுறம் திரும்பி 3 கி.மீ நடந்தால் அவர் தற்போது எந்த திசையை நோக்கி நிற்கிறார்?', options: ['A) வடக்கு', 'B) கிழக்கு', 'C) தெற்கு', 'D) மேற்கு'], correct: 'B', explanation: 'வடக்கு நோக்கி சென்று வலதுபுறம் திரும்பினால் கிழக்கு திசையாகும்.' },
      { id: 4, topic: 'General Science', text: 'துப்பாக்கி சுடும்போது நியூட்டனின் எந்த விதி செயல்படுகிறது?', options: ['A) முதல் விதி', 'B) இரண்டாம் விதி', 'C) மூன்றாம் விதி', 'D) ஈர்ப்பு விதி'], correct: 'C', explanation: 'ஒவ்வொரு விசைக்கும் சமமான எதிர்விசை உண்டு (Newton 3rd Law).' },
      { id: 5, topic: 'Logical Ability', text: 'Doctor : Hospital :: Teacher : ?', options: ['A) Court', 'B) School', 'C) Field', 'D) Office'], correct: 'B', explanation: 'மருத்துவர் மருத்துவமனையில் பணிபுரிவது போல, ஆசிரியர் பள்ளியில் பணிபுரிகிறார்.' },
      { id: 6, topic: 'Tamil Eligibility', text: 'காவல்துறை என்ற சொல்லின் வேர்ச்சொல் எது?', options: ['A) காவல்', 'B) துறை', 'C) கா', 'D) காப்பகம்'], correct: 'A', explanation: 'காவல் என்பது தொழிற்பெயரின் வேர்ச்சொல் ஆகும்.' },
      { id: 7, topic: 'Constitution', text: 'அடிப்படை உரிமைகள் இந்திய அரசியலமைப்பின் எந்த பகுதியில் குறிப்பிடப்பட்டுள்ளன?', options: ['A) பகுதி II', 'B) பகுதி III', 'C) பகுதி IV', 'D) பகுதி IV-A'], correct: 'B', explanation: 'பகுதி III சரத்துகள் 12 முதல் 35 வரை அடிப்படை உரிமைகளைத் தருகிறது.' },
      { id: 8, topic: 'Numerical Ability', text: '25-ன் 20% எவ்வளவு?', options: ['A) 4', 'B) 5', 'C) 6', 'D) 10'], correct: 'B', explanation: '25 * (20/100) = 5.' },
      { id: 9, topic: 'Forensic Science', text: 'கைரேகைகளை அடையாளம் காணும் அறிவியல் துறை எது?', options: ['A) டாக்டிலோஸ்கோபி', 'B) டாக்சிகாலஜி', 'C) பாலிஸ்டிக்ஸ்', 'D) செராலஜி'], correct: 'A', explanation: 'Dactyloscopy என்பது மனித கைரேகைகளை ஆராயும் அறிவியல் பிரிவாகும்.' },
      { id: 10, topic: 'Tamil Nadu History', text: 'வீரபாண்டிய கட்டபொம்மன் தூக்கிலிடப்பட்ட இடம் எது?', options: ['A) பாஞ்சாலங்குறிச்சி', 'B) கயத்தாறு', 'C) திருப்பத்தூர்', 'D) நாகலாபுரம்'], correct: 'B', explanation: '1799 அக்டோபர் 16 அன்று கயத்தாறில் தூக்கிலிடப்பட்டார்.' },
      { id: 11, topic: 'Psychology - Coding', text: 'POLICE என்பது QPMJDF எனில், TNUSRB என்பது எவ்வாறு எழுதப்படும்?', options: ['A) UOVTSC', 'B) SMTRQA', 'C) VOWUTD', 'D) UOVTRC'], correct: 'A', explanation: 'ஒவ்வொரு எழுத்துக்கும் அடுத்த எழுத்து (+1): T->U, N->O, U->V, S->T, R->S, B->C.' },
      { id: 12, topic: 'Geography', text: 'மேட்டூர் அணை எந்த ஆற்றின் குறுக்கே கட்டப்பட்டுள்ளது?', options: ['A) வைகை', 'B) காவிரி', 'C) பவானி', 'D) அமராவதி'], correct: 'B', explanation: 'மேட்டூர் அணை (ஸ்டான்லி நீர்த்தேக்கம்) காவிரி ஆற்றின் மீது கட்டப்பட்டுள்ளது.' },
      { id: 13, topic: 'Current Affairs', text: 'தமிழ்நாட்டின் மாநில விலங்கு எது?', options: ['A) வரையாடு', 'B) புலி', 'C) யானை', 'D) மான்'], correct: 'A', explanation: 'நீலகிரி வரையாடு (Nilgiri Tahr) தமிழ்நாட்டின் மாநில விலங்காகும்.' },
      { id: 14, topic: 'Aptitude', text: 'ஒரு வேலையை A என்பவர் 10 நாட்களிலும், B என்பவர் 15 நாட்களிலும் முடித்தால் இருவரும் சேர்ந்து எத்தனை நாட்களில் முடிப்பர்?', options: ['A) 5 நாட்கள்', 'B) 6 நாட்கள்', 'C) 8 நாட்கள்', 'D) 12 நாட்கள்'], correct: 'B', explanation: '(10 * 15) / (10 + 15) = 150 / 25 = 6 நாட்கள்.' },
      { id: 15, topic: 'Constitution', text: 'ஆட்கொணர்வு நீதிப்பேராணை (Habeas Corpus) எதற்காக வழங்கப்படுகிறது?', options: ['A) சட்டவிரோத காவலில் இருந்து நபரை விடுவிக்க', 'B) அரசு ஊழியரை பணியமர்த்த', 'C) சொத்து பரிமாற்றம் செய்ய', 'D) வரி வசூலிக்க'], correct: 'A', explanation: 'சட்டவிரோதமாக தடுத்து வைக்கப்பட்ட நபரை நீதிமன்றத்தில் ஆஜர்படுத்தப் பயன்படுகிறது.' },
      { id: 16, topic: 'Mental Ability', text: 'விடுபட்ட எண்ணைக் காண்க: 5, 10, 20, 40, ?', options: ['A) 60', 'B) 80', 'C) 100', 'D) 50'], correct: 'B', explanation: 'முந்தைய எண் இரண்டால் பெருக்கப்படுகிறது (x2): 40 * 2 = 80.' },
      { id: 17, topic: 'Science', text: 'வெள்ளியில் ஒளிபுகும் பண்பு மற்றும் மின்கடத்தும் திறன் எதனால் அதிகம்?', options: ['A) அதிக அடர்த்தி', 'B) கட்டற்ற எலக்ட்ரான்கள் இருப்பு', 'C) குறைந்த எடை', 'D) கடினத்தன்மை'], correct: 'B', explanation: 'வெள்ளி சிறந்த மின்கடத்தியாக செயல்பட கட்டற்ற எலக்ட்ரான்கள் காரணம்.' },
      { id: 18, topic: 'Tamil Literature', text: 'பாரதியாரின் இயற்பெயர் என்ன?', options: ['A) சுப்பிரமணியன்', 'B) சுப்புரத்தினம்', 'C) துரைராசு', 'D) முத்தையா'], correct: 'A', explanation: 'மகாகவி பாரதியாரின் இயற்பெயர் சுப்பிரமணியன் ஆகும்.' },
      { id: 19, topic: 'Blood Relations', text: 'ஒரு புகைப்படத்தைக் காட்டி, "இவர் என் தந்தையின் ஒரே மகனின் மகள்" என்று சுரேஷ் கூறுகிறார் எனில் சுரேஷுக்கு அந்தப் பெண் என்ன உறவு?', options: ['A) தங்கை', 'B) மகள்', 'C) மருமகள்', 'D) தாய்'], correct: 'B', explanation: 'தந்தையின் ஒரே மகன் சுரேஷே ஆவார்; எனவே அவர் சுரேஷின் மகள்.' },
      { id: 20, topic: 'General Knowledge', text: 'தமிழ்நாட்டின் காவல்துறை மோட்டோ / குறிக்கோள் என்ன?', options: ['A) வாய்மையே வெல்லும் (Truth Alone Triumphs)', 'B) கடமை, கண்ணியம், கட்டுப்பாடு', 'C) சேவை மனப்பான்மை', 'D) அறம் காப்பதே அறம்'], correct: 'A', explanation: 'தமிழ்நாடு காவல் சின்னத்தில் வாய்மையே வெல்லும் என்று பொறிக்கப்பட்டுள்ளது.' },
    ],
  },
];

// Helper to get all tests (default + custom from admin)
export const getAllMockTests = () => {
  try {
    const custom = JSON.parse(localStorage.getItem('bharathi_custom_mock_tests') || '[]');
    if (Array.isArray(custom) && custom.length > 0) {
      return [...custom, ...DEFAULT_MOCK_TESTS];
    }
  } catch (e) {}
  return DEFAULT_MOCK_TESTS;
};

// Validate OMR Sheet Shaded Answers
export const evaluateOMRSubmission = (testId, candidateAnswers = {}, studentInfo = {}) => {
  const allTests = getAllMockTests();
  const test = allTests.find((t) => t.id === testId) || DEFAULT_MOCK_TESTS[0];

  let correctCount = 0;
  let wrongCount = 0;
  let skippedCount = 0;
  const questionBreakdown = [];

  test.questions.forEach((q) => {
    const selected = candidateAnswers[q.id];
    const isAnswered = selected !== undefined && selected !== null && selected !== '';
    const isCorrect = isAnswered && selected.toUpperCase() === q.correct.toUpperCase();

    if (!isAnswered) {
      skippedCount += 1;
    } else if (isCorrect) {
      correctCount += 1;
    } else {
      wrongCount += 1;
    }

    questionBreakdown.push({
      questionId: q.id,
      topic: q.topic || 'General',
      questionText: q.text,
      options: q.options,
      candidateOption: selected || 'Not Answered',
      correctOption: q.correct,
      isCorrect: isCorrect,
      isSkipped: !isAnswered,
      explanation: q.explanation || 'Refer textbook curriculum.',
    });
  });

  const rawMarks = correctCount * (test.marksPerQuestion || 1.5) - wrongCount * (test.negativeMark || 0);
  const totalMarks = Math.max(0, parseFloat(rawMarks.toFixed(2)));
  const percentage = parseFloat(((correctCount / test.questions.length) * 100).toFixed(1));

  const submissionResult = {
    submissionId: `OMR-${Date.now().toString().slice(-6)}`,
    testId: test.id,
    testTitle: test.title,
    stream: test.stream,
    department: test.department,
    candidateName: studentInfo.username || 'Student Aspirant',
    registerNo: studentInfo.registerNo || 'TN2026-REG',
    submittedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    totalQuestions: test.questions.length,
    attemptedCount: correctCount + wrongCount,
    correctCount,
    wrongCount,
    skippedCount,
    totalMarks,
    maxMarks: test.maxMarks || test.questions.length * 1.5,
    percentage,
    accuracy: correctCount + wrongCount > 0 ? parseFloat(((correctCount / (correctCount + wrongCount)) * 100).toFixed(1)) : 0,
    questionBreakdown,
  };

  // Save to student submission history in localStorage
  try {
    const history = JSON.parse(localStorage.getItem('bharathi_student_omr_submissions') || '[]');
    localStorage.setItem(
      'bharathi_student_omr_submissions',
      JSON.stringify([submissionResult, ...history.slice(0, 50)])
    );
  } catch (e) {}

  return submissionResult;
};

// Retrieve all student submissions (for Admin Evaluation View)
export const getAdminAllSubmissions = () => {
  try {
    const raw = localStorage.getItem('bharathi_student_omr_submissions');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}

  // Fallback demo submissions for admin viewing
  return [
    {
      submissionId: 'OMR-892104',
      testId: 'test-grp4-01',
      testTitle: 'TNPSC Group IV & VAO Full Mock Test 1',
      stream: 'TNPSC',
      department: 'Group IV & VAO',
      candidateName: 'S. Vigneshwaran',
      registerNo: 'TN2026-0184',
      submittedAt: 'Today, 10:45 AM',
      totalQuestions: 20,
      attemptedCount: 20,
      correctCount: 18,
      wrongCount: 2,
      skippedCount: 0,
      totalMarks: 27.0,
      maxMarks: 30,
      percentage: 90.0,
      accuracy: 90.0,
    },
    {
      submissionId: 'OMR-892105',
      testId: 'test-tnusrb-si-01',
      testTitle: 'TNUSRB Sub-Inspector Joint Recruitment Model 1',
      stream: 'TNUSRB',
      department: 'Police SI (Taluk & AR)',
      candidateName: 'P. Arunkumar',
      registerNo: 'TN2026-0186',
      submittedAt: 'Yesterday, 04:30 PM',
      totalQuestions: 20,
      attemptedCount: 19,
      correctCount: 16,
      wrongCount: 3,
      skippedCount: 1,
      totalMarks: 16.0,
      maxMarks: 20,
      percentage: 80.0,
      accuracy: 84.2,
    },
    {
      submissionId: 'OMR-892106',
      testId: 'test-grp4-01',
      testTitle: 'TNPSC Group IV & VAO Full Mock Test 1',
      stream: 'TNPSC',
      department: 'Group IV & VAO',
      candidateName: 'K. Meenakshi',
      registerNo: 'TN2026-0185',
      submittedAt: 'Yesterday, 11:15 AM',
      totalQuestions: 20,
      attemptedCount: 20,
      correctCount: 19,
      wrongCount: 1,
      skippedCount: 0,
      totalMarks: 28.5,
      maxMarks: 30,
      percentage: 95.0,
      accuracy: 95.0,
    },
  ];
};
