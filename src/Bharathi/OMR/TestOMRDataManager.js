// Centralized Test Series, Question Papers, Master Answer Keys and OMR Validation Engine
// Supports TNPSC (Group 1, 2, 2A, 4) and TNUSRB (SI, PC) examination standards
import { omrApi } from '../Api/Api';

export const DEFAULT_OMR_TESTS = [
  {
    id: 'tnpsc-grp4-mock-01',
    title: 'TNPSC Group IV & VAO Full Mock Exam - 01',
    category: 'TNPSC',
    department: 'Group IV & VAO Services',
    subject: 'General Studies, General Tamil & Aptitude',
    date: '2026-03-29',
    durationMinutes: 180,
    durationText: '3 Hours (10:00 AM - 01:00 PM)',
    totalQuestions: 25, // Scaled 25 high-yield sample questions for instant interactive test & evaluation
    displayTotalQuestions: '200 Questions (300 Marks)',
    positiveMark: 1.5,
    negativeMark: 0,
    maxMarks: 37.5,
    questionPaperFilename: 'SUNDAY GRP 4 SCHEDULE -2025.pdf',
    questionPaperUrl: '/SUNDAY GRP 4 SCHEDULE -2025.pdf',
    omrSheetPdf: '/Tnpsc - OMR Sheet-1.pdf',
    instructions: 'Each question carries 1.5 marks. There are no negative marks. Option E is "Answer Not Known" (விடை தெரியவில்லை) as per official TNPSC standards.',
    questions: [
      {
        qNo: 1,
        question: 'Which Article of the Indian Constitution is described by Dr. B.R. Ambedkar as the "Heart and Soul" of the Constitution? / இந்திய அரசியலமைப்பின் "இதயம் மற்றும் ஆன்மா" என டாக்டர் அம்பேத்கர் அவர்களால் வர்ணிக்கப்பட்ட சட்டப்பிரிவு எது?',
        options: {
          A: 'Article 14 (சட்டத்தின் முன் அனைவரும் சமம்)',
          B: 'Article 19 (சுதந்திர உரிமை)',
          C: 'Article 32 (அரசியலமைப்புக்குட்பட்டு தீர்வு காணும் உரிமை)',
          D: 'Article 226 (உயர்நீதிமன்ற நீதிப்பேராணை உரிமை)',
          E: 'Answer Not Known (விடை தெரியவில்லை)'
        },
        correctKey: 'C',
        explanation: 'Article 32 confers the right to move the Supreme Court by appropriate proceedings for the enforcement of the Fundamental Rights. Dr. Ambedkar termed it as the heart and soul of the Constitution.',
        topic: 'Indian Polity'
      },
      {
        qNo: 2,
        question: '"யாதும் ஊரே யாவரும் கேளிர்" என்ற புகழ்பெற்ற பாடல் வரியை இயற்றிய சங்ககாலப் புலவர் யார்? / Who composed the famous Sangam poem "Yaathum Oore Yaavarum Kaelir"?',
        options: {
          A: 'கபிலர் (Kapilar)',
          B: 'கணியன் பூங்குன்றனார் (Kaniyan Poongundranar)',
          C: 'ஒளவையார் (Avvaiyar)',
          D: 'பரணர் (Paranar)',
          E: 'Answer Not Known (விடை தெரியவில்லை)'
        },
        correctKey: 'B',
        explanation: 'கணியன் பூங்குன்றனார் புறநானூற்றில் (பாடல் 192) "யாதும் ஊரே யாவரும் கேளிர், தீதும் நன்றும் பிறர்தர வாரா" என்று பாடியுள்ளார்.',
        topic: 'General Tamil'
      },
      {
        qNo: 3,
        question: 'In which year was the historic Battle of Talikota fought, leading to the decline of the Vijayanagara Empire? / விஜயநகரப் பேரரசின் வீழ்ச்சிக்குக் காரணமான தலைக்கோட்டைப் போர் நடைபெற்ற ஆண்டு எது?',
        options: {
          A: '1526',
          B: '1556',
          C: '1565',
          D: '1576',
          E: 'Answer Not Known (விடை தெரியவில்லை)'
        },
        correctKey: 'C',
        explanation: 'The Battle of Talikota was fought on 23 January 1565 between the Vijayanagara Empire and the Deccan Sultanates.',
        topic: 'Indian History'
      },
      {
        qNo: 4,
        question: 'What is the full form of PSTM certificate used in Tamil Nadu government recruitments? / தமிழக அரசு தேர்வுகளில் பயன்படும் PSTM என்பதன் விரிவாக்கம் யாது?',
        options: {
          A: 'Public Service Training Metric',
          B: 'Persons Studied in Tamil Medium',
          C: 'Post Secondary Technical Matriculation',
          D: 'Police Special Task Mission',
          E: 'Answer Not Known (விடை தெரியவில்லை)'
        },
        correctKey: 'B',
        explanation: 'PSTM stands for Persons Studied in Tamil Medium, which provides a 20% reservation quota in direct recruitment to state government posts.',
        topic: 'TN Administration'
      },
      {
        qNo: 5,
        question: 'Find the next term in the alphanumeric series: A2C, D4F, G8I, J16L, ? / தொடரின் அடுத்த உறுப்பைக் காண்க: A2C, D4F, G8I, J16L, ?',
        options: {
          A: 'M32O',
          B: 'M32N',
          C: 'N32P',
          D: 'L32O',
          E: 'Answer Not Known (விடை தெரியவில்லை)'
        },
        correctKey: 'A',
        explanation: 'First letters: A(+3)=D, D(+3)=G, G(+3)=J, J(+3)=M. Numbers double: 2, 4, 8, 16, 32. Third letters: C(+3)=F, F(+3)=I, I(+3)=L, L(+3)=O. Hence M32O.',
        topic: 'Aptitude & Mental Ability'
      },
      {
        qNo: 6,
        question: 'Who is regarded as the Father of Self-Respect Movement in Tamil Nadu? / தமிழ்நாட்டில் சுயமரியாதை இயக்கத்தின் தந்தை என அழைக்கப்படுபவர் யார்?',
        options: {
          A: 'பாரதியார் (Bharathiyar)',
          B: 'தந்தை பெரியார் ஈ.வே.ரா (Thanthai Periyar E.V.R)',
          C: 'சி.என். அண்ணாதுரை (C.N. Annadurai)',
          D: 'அயோத்திதாச பண்டிதர் (Iyothee Thass)',
          E: 'Answer Not Known (விடை தெரியவில்லை)'
        },
        correctKey: 'B',
        explanation: 'Thanthai Periyar founded the Self-Respect Movement (சுயமரியாதை இயக்கம்) in 1925 to establish equal rights and rationalism.',
        topic: 'TN History & Culture'
      },
      {
        qNo: 7,
        question: 'The Kazhuveli Bird Sanctuary, the 16th bird sanctuary of Tamil Nadu, is located in which district? / தமிழ்நாட்டின் 16-வது பறவைகள் சரணாலயமான கழுவேலி பறவைகள் சரணாலயம் எந்த மாவட்டத்தில் அமைந்துள்ளது?',
        options: {
          A: 'Villupuram (விழுப்புரம்)',
          B: 'Chengalpattu (செங்கல்பட்டு)',
          C: 'Thanjavur (தஞ்சாவூர்)',
          D: 'Ramanathapuram (இராமநாதபுரம்)',
          E: 'Answer Not Known (விடை தெரியவில்லை)'
        },
        correctKey: 'A',
        explanation: 'Kazhuveli wetland situated in Vanur and Marakkanam taluks of Villupuram district was notified as a bird sanctuary in 2021.',
        topic: 'Current Affairs & Geography'
      },
      {
        qNo: 8,
        question: 'Which enzyme present in human saliva converts starch into maltose? / மனித உமிழ்நீரில் உள்ள எந்த நொதி ஸ்டார்ச்சை மால்டோஸாக மாற்றுகிறது?',
        options: {
          A: 'Pepsin (பெப்சின்)',
          B: 'Ptyalin / Salivary Amylase (தயலின் / உமிழ்நீர் அமைலேஸ்)',
          C: 'Trypsin (டிரிப்சின்)',
          D: 'Lipase (லைபேஸ்)',
          E: 'Answer Not Known (விடை தெரியவில்லை)'
        },
        correctKey: 'B',
        explanation: 'Ptyalin (salivary amylase) breaks down complex carbohydrates (starch) into simpler disaccharides such as maltose.',
        topic: 'General Science'
      },
      {
        qNo: 9,
        question: '"திருக்குறளில்" உள்ள மொத்த அதிகாரங்கள் மற்றும் பாடல்களின் எண்ணிக்கை யாது? / What is the total number of chapters and couplets in Thirukkural?',
        options: {
          A: '130 அதிகாரங்கள், 1300 குறள்கள்',
          B: '133 அதிகாரங்கள், 1330 குறள்கள்',
          C: '135 அதிகாரங்கள், 1350 குறள்கள்',
          D: '120 அதிகாரங்கள், 1200 குறள்கள்',
          E: 'Answer Not Known (விடை தெரியவில்லை)'
        },
        correctKey: 'B',
        explanation: 'திருக்குறள் 3 பால்கள் (அறத்துப்பால், பொருட்பால், காமத்துப்பால்), 133 அதிகாரங்கள் மற்றும் 1330 அருங்குறட்பாக்களைக் கொண்டது.',
        topic: 'General Tamil'
      },
      {
        qNo: 10,
        question: 'If a sum of ₹8,000 earns ₹1,200 as simple interest in 3 years, what is the annual rate of interest? / ₹8,000 அசலுக்கு 3 ஆண்டுகளில் கிடைக்கும் தனிவட்டி ₹1,200 எனில் ஆண்டு வட்டி வீதம் என்ன?',
        options: {
          A: '4%',
          B: '5%',
          C: '6%',
          D: '7.5%',
          E: 'Answer Not Known (விடை தெரியவில்லை)'
        },
        correctKey: 'B',
        explanation: 'SI = (P * N * R) / 100 => 1200 = (8000 * 3 * R) / 100 => 1200 = 240 * R => R = 1200 / 240 = 5%.',
        topic: 'Aptitude & Mental Ability'
      },
      {
        qNo: 11,
        question: 'The fundamental duties of Indian citizens were incorporated in the Constitution through which Constitutional Amendment? / எந்த அரசியலமைப்பு திருத்தச் சட்டத்தின் மூலம் அடிப்படைக் கடமைகள் இந்திய அரசியலமைப்பில் சேர்க்கப்பட்டன?',
        options: {
          A: '42nd Amendment Act, 1976',
          B: '44th Amendment Act, 1978',
          C: '52nd Amendment Act, 1985',
          D: '86th Amendment Act, 2002',
          E: 'Answer Not Known (விடை தெரியவில்லை)'
        },
        correctKey: 'A',
        explanation: 'Fundamental Duties were added to Part IV-A (Article 51A) on the recommendation of the Swaran Singh Committee via the 42nd Amendment 1976.',
        topic: 'Indian Polity'
      },
      {
        qNo: 12,
        question: 'Where is the headquarters of the Tamil Nadu Uniformed Services Recruitment Board (TNUSRB) located? / தமிழ்நாடு சீருடைப் பணியாளர் தேர்வு வாரியத்தின் (TNUSRB) தலைமையகம் எங்கு அமைந்துள்ளது?',
        options: {
          A: 'Madurai (மதுரை)',
          B: 'Chennai, Egmore (சென்னை, எழும்பூர்)',
          C: 'Coimbatore (கோயம்புத்தூர்)',
          D: 'Trichy (திருச்சி)',
          E: 'Answer Not Known (விடை தெரியவில்லை)'
        },
        correctKey: 'B',
        explanation: 'TNUSRB is headquartered at Old COP Office Building, Pantheon Road, Egmore, Chennai.',
        topic: 'Police Administration'
      },
      {
        qNo: 13,
        question: '"உழவர் திருநாள்" எனப்படும் பொங்கல் பண்டிகையை வரவேற்று "தைத்திங்கள் கொண்டாடி மகிழ்வோம்" எனப் பாடிய கவிஞர் யார்? / Which poet praised Thai Pongal festival extensively?',
        options: {
          A: 'பாரதிதாசன் (Bharathidasan)',
          B: 'கவிமணி தேசிக விநாயகம் பிள்ளை (Kavimani)',
          C: 'நாமக்கல் கவிஞர் வெ. இராமலிங்கம் பிள்ளை (Namakkal Kavignar)',
          D: 'வாணிதாசன் (Vanidasan)',
          E: 'Answer Not Known (விடை தெரியவில்லை)'
        },
        correctKey: 'A',
        explanation: 'புரட்சிக் கவிஞர் பாரதிதாசன் தமிழர்களின் பாரம்பரிய உழவர் விழாவைப் போற்றி பல கவிதைகளை இயற்றியுள்ளார்.',
        topic: 'General Tamil'
      },
      {
        qNo: 14,
        question: 'What is the pH value of pure distilled water at 25°C? / 25°C வெப்பநிலையில் தூய காய்ச்சி வடிகட்டிய நீரின் pH மதிப்பு என்ன?',
        options: {
          A: '0',
          B: '5.5',
          C: '7.0',
          D: '8.5',
          E: 'Answer Not Known (விடை தெரியவில்லை)'
        },
        correctKey: 'C',
        explanation: 'Pure water has an equal concentration of hydrogen and hydroxide ions, resulting in a neutral pH of exactly 7.0 at 25°C.',
        topic: 'General Science'
      },
      {
        qNo: 15,
        question: 'In how many days can 12 men complete a work which 8 men can complete in 18 days? / 8 மனிதர்கள் ஒரு வேலையை 18 நாட்களில் முடிக்கின்றனர் எனில், அதே வேலையை 12 மனிதர்கள் எத்தனை நாட்களில் முடிப்பார்கள்?',
        options: {
          A: '10 days',
          B: '12 days',
          C: '14 days',
          D: '16 days',
          E: 'Answer Not Known (விடை தெரியவில்லை)'
        },
        correctKey: 'B',
        explanation: 'M1 * D1 = M2 * D2 => 8 * 18 = 12 * D2 => 144 = 12 * D2 => D2 = 12 days.',
        topic: 'Aptitude & Mental Ability'
      },
      {
        qNo: 16,
        question: 'Which plateau separates the drainage basin of the Bay of Bengal from that of the Arabian Sea? / வங்காள விரிகுடா மற்றும் அரபிக்கடல் வடிகால் படுகைகளைப் பிரிக்கும் பீடபூமி எது?',
        options: {
          A: 'Malwa Plateau (மால்வா பீடபூமி)',
          B: 'Chota Nagpur Plateau (சோட்டா நாக்பூர் பீடபூமி)',
          C: 'Deccan Plateau (தக்காண பீடபூமி)',
          D: 'Meghalaya Plateau (மேகாலயா பீடபூமி)',
          E: 'Answer Not Known (விடை தெரியவில்லை)'
        },
        correctKey: 'C',
        explanation: 'The Deccan Plateau sloping gently towards the east forms the chief water divide between rivers draining into the Bay of Bengal and the Arabian Sea.',
        topic: 'Indian Geography'
      },
      {
        qNo: 17,
        question: '"வீரமாமுனிவர்" தொகுத்த முதல் தமிழ் அகராதி எது? / Which was the first Tamil dictionary compiled by Veeramamunivar (Father Beschi)?',
        options: {
          A: 'அகரமுதலி (Agaramuthali)',
          B: 'சதுரகராதி (Chathurakarathi)',
          C: 'திவாகர நிகண்டு (Thivakara Nigandu)',
          D: 'பிங்கல நிகண்டு (Pingala Nigandu)',
          E: 'Answer Not Known (விடை தெரியவில்லை)'
        },
        correctKey: 'B',
        explanation: 'வீரமாமுனிவர் 1732-ல் தொகுத்த "சதுரகராதி" (பெயரகராதி, பொருளகராதி, தொகையகராதி, தொடையகராதி) முதல் தமிழ் அகராதியாக விளங்குகிறது.',
        topic: 'General Tamil'
      },
      {
        qNo: 18,
        question: 'Who was the Governor-General of India during the Revolt of 1857? / 1857-ஆம் ஆண்டு பெரும் புரட்சியின் போது இந்தியாவின் தலைமை ஆளுநராக இருந்தவர் யார்?',
        options: {
          A: 'Lord Dalhousie (டல்ஹௌசி பிரபு)',
          B: 'Lord Canning (கானிங் பிரபு)',
          C: 'Lord Wellesley (வெல்லெஸ்லி பிரபு)',
          D: 'Lord Curzon (கர்சன் பிரபு)',
          E: 'Answer Not Known (விடை தெரியவில்லை)'
        },
        correctKey: 'B',
        explanation: 'Lord Canning served as Governor-General during the 1857 revolt and later became the first Viceroy of India under the Government of India Act 1858.',
        topic: 'Indian History'
      },
      {
        qNo: 19,
        question: 'Which scheme was launched by the Tamil Nadu Government to provide financial assistance of ₹1000 per month to girl students pursuing higher education? / உயர்கல்வி பயிலும் மாணவிகளுக்கு மாதம் ₹1000 வழங்கும் தமிழக அரசின் திட்டம் எது?',
        options: {
          A: 'கலைஞர் மகளிர் உரிமைத் திட்டம்',
          B: 'புதுமைப் பெண் திட்டம் (Moovalur Ramamirtham Ammaiyar Scheme)',
          C: 'முதலமைச்சரின் காலை உணவுத் திட்டம்',
          D: 'இல்லம் தேடிக் கல்வித் திட்டம்',
          E: 'Answer Not Known (விடை தெரியவில்லை)'
        },
        correctKey: 'B',
        explanation: 'புதுமைப் பெண் திட்டம் (Pudhumai Penn Scheme) provides ₹1,000/month to girls who studied from 6th to 12th standard in state government schools.',
        topic: 'TN Schemes & Governance'
      },
      {
        qNo: 20,
        question: 'The difference between Compound Interest and Simple Interest on a principal of ₹5,000 at 10% per annum for 2 years is: / ₹5,000 அசலுக்கு 10% ஆண்டு வட்டியில் 2 ஆண்டுகளில் கிடைக்கும் கூட்டு வட்டிக்கும் தனிவட்டிக்கும் இடையேயான வித்தியாசம்:',
        options: {
          A: '₹50',
          B: '₹75',
          C: '₹100',
          D: '₹125',
          E: 'Answer Not Known (விடை தெரியவில்லை)'
        },
        correctKey: 'A',
        explanation: 'Difference for 2 years = P * (R / 100)^2 = 5000 * (10 / 100)^2 = 5000 * (1/100) = ₹50.',
        topic: 'Aptitude & Mental Ability'
      },
      {
        qNo: 21,
        question: 'Which instrument is used to measure atmospheric pressure? / வளிமண்டல அழுத்தத்தை அளவிடப் பயன்படும் கருவி எது?',
        options: {
          A: 'Hydrometer (ஹைட்ரோமீட்டர்)',
          B: 'Barometer (பாரோமீட்டர்)',
          C: 'Anemometer (அனிமோமீட்டர்)',
          D: 'Hygrometer (ஹைக்ரோமீட்டர்)',
          E: 'Answer Not Known (விடை தெரியவில்லை)'
        },
        correctKey: 'B',
        explanation: 'A barometer, invented by Evangelista Torricelli, measures atmospheric pressure in units such as millibars or mmHg.',
        topic: 'General Science'
      },
      {
        qNo: 22,
        question: '"ஜி.யு. போப்" திருக்குறளை எந்த மொழியில் மொழிபெயர்த்தார்? / Into which language did Rev. G.U. Pope translate Thirukkural?',
        options: {
          A: 'French (பிரெஞ்சு)',
          B: 'German (ஜெர்மன்)',
          C: 'English (ஆங்கிலம்)',
          D: 'Latin (லத்தீன்)',
          E: 'Answer Not Known (விடை தெரியவில்லை)'
        },
        correctKey: 'C',
        explanation: 'ஜி.யு. போப் 1886-ஆம் ஆண்டு திருக்குறளை முழுமையாக ஆங்கில மொழியில் மொழிபெயர்த்து வெளியிட்டார்.',
        topic: 'General Tamil'
      },
      {
        qNo: 23,
        question: 'The Kudavolai system of local body elections was a distinguished feature of which ancient Tamil dynasty? / கிராம சுயாட்சித் தேர்தலுக்கான "குடவோலை முறை" எந்த தமிழ் மன்னர்களின் தனிச்சிறப்பாக இருந்தது?',
        options: {
          A: 'Cheras (சேரர்கள்)',
          B: 'Imperial Cholas (பிற்காலச் சோழர்கள்)',
          C: 'Pandyas (பாண்டியர்கள்)',
          D: 'Pallavas (பல்லவர்கள்)',
          E: 'Answer Not Known (விடை தெரியவில்லை)'
        },
        correctKey: 'B',
        explanation: 'The famous Uttaramerur Inscriptions of Parantaka Chola I (919 and 921 CE) outline the Village Assembly and Kudavolai election rules.',
        topic: 'TN History'
      },
      {
        qNo: 24,
        question: 'Under the Indian Penal Code, what is the definition of "Culpable Homicide"? / இந்திய தண்டனைச் சட்டத்தின்படி குற்றமுறு மனிதக் கொலை விவரிக்கப்படும் பிரிவு எது?',
        options: {
          A: 'Section 299',
          B: 'Section 300',
          C: 'Section 302',
          D: 'Section 307',
          E: 'Answer Not Known (விடை தெரியவில்லை)'
        },
        correctKey: 'A',
        explanation: 'Section 299 defines Culpable Homicide. Section 300 defines Murder, while Section 302 prescribes the punishment for murder.',
        topic: 'Police & Legal Studies'
      },
      {
        qNo: 25,
        question: 'Which river is known as the "Dakshin Ganga" or Ganges of the South? / "தென்னகத்துக் கங்கை" அல்லது "தட்சிண கங்கை" என்று அழைக்கப்படும் நதி எது?',
        options: {
          A: 'Cauvery (காவிரி)',
          B: 'Godavari (கோதாவரி)',
          C: 'Krishna (கிருஷ்ணா)',
          D: 'Vaigai (வைகை)',
          E: 'Answer Not Known (விடை தெரியவில்லை)'
        },
        correctKey: 'B',
        explanation: 'Godavari is termed Dakshin Ganga due to its length and sacred status in peninsular India (Cauvery is sometimes culturally hailed as Dakshin Ganga in Tamil traditions, but officially Godavari holds this title in geography).',
        topic: 'Indian Geography'
      }
    ]
  },
  {
    id: 'tnusrb-si-mock-01',
    title: 'TNUSRB Sub-Inspector (Taluk & AR) Joint Recruitment Mock 01',
    category: 'TNUSRB',
    department: 'Police Sub-Inspector Cadre',
    subject: 'General Knowledge & Police Psychological Test',
    date: '2026-04-05',
    durationMinutes: 150,
    durationText: '2.5 Hours (10:00 AM - 12:30 PM)',
    totalQuestions: 20,
    displayTotalQuestions: '140 Questions (70 Marks)',
    positiveMark: 0.5,
    negativeMark: 0,
    maxMarks: 10.0,
    questionPaperFilename: 'SATURDAY TIME TABLE-1.pdf',
    questionPaperUrl: '/SATURDAY TIME TABLE-1.pdf',
    omrSheetPdf: '/Tnpsc - OMR Sheet-1.pdf',
    instructions: 'TNUSRB SI Written Test format. 0.5 marks per question. Shading must be strictly marked in the bubble grid.',
    questions: [
      {
        qNo: 1,
        question: 'The Indian Police Service (IPS) is constituted under which Article of the Constitution as an All India Service? / அகில இந்திய சேவையாக இந்திய காவல் பணி (IPS) எந்த சட்டப்பிரிவின் கீழ் உருவாக்கப்பட்டுள்ளது?',
        options: {
          A: 'Article 310',
          B: 'Article 312',
          C: 'Article 315',
          D: 'Article 324',
          E: 'Answer Not Known'
        },
        correctKey: 'B',
        explanation: 'Article 312 empowers Parliament to create one or more All India Services common to the Union and the States.',
        topic: 'Polity & Police Administration'
      },
      {
        qNo: 2,
        question: 'What is the full form of FIR in criminal proceedings? / குற்றவியல் நடவடிக்கைகளில் FIR என்பதன் விரிவாக்கம் என்ன?',
        options: {
          A: 'First Information Report',
          B: 'Formal Investigation Record',
          C: 'Fast Incident Register',
          D: 'Forensic Identification Report',
          E: 'Answer Not Known'
        },
        correctKey: 'A',
        explanation: 'FIR stands for First Information Report, prepared by police under Section 154 of CrPC upon receiving information about a cognizable offence.',
        topic: 'Police Administration'
      },
      {
        qNo: 3,
        question: 'If POLICE is coded as QPMJDF, then how will COP be coded in the same pattern? / POLICE என்பது QPMJDF எனில், அதே விதியில் COP என்பது எவ்வாறு எழுதப்படும்?',
        options: {
          A: 'DPQ',
          B: 'DQQ',
          C: 'DPR',
          D: 'BNO',
          E: 'Answer Not Known'
        },
        correctKey: 'A',
        explanation: 'Each letter is shifted by +1: C->D, O->P, P->Q => DPQ.',
        topic: 'Psychology & Logical Reasoning'
      },
      {
        qNo: 4,
        question: 'In which year was the Central Reserve Police Force (CRPF) originally established as the Crown Representative Police? / சி.ஆர்.பி.எஃப் (CRPF) படை எந்த ஆண்டு தொடங்கப்பட்டது?',
        options: {
          A: '1939',
          B: '1947',
          C: '1950',
          D: '1965',
          E: 'Answer Not Known'
        },
        correctKey: 'A',
        explanation: 'CRPF was raised as Crown Representative Police on 27th July 1939 and renamed Central Reserve Police Force in 1949.',
        topic: 'Police History'
      },
      {
        qNo: 5,
        question: 'Which of the following blood groups is known as the "Universal Donor"? / மனிதர்களில் "அனைவருக்கும் கொடுப்பவர்" (Universal Donor) எனப்படும் இரத்த வகை எது?',
        options: {
          A: 'AB Positive',
          B: 'O Negative',
          C: 'A Positive',
          D: 'B Negative',
          E: 'Answer Not Known'
        },
        correctKey: 'B',
        explanation: 'O negative blood lacks A, B, and Rh antigens, making it safe for transfusion to nearly all recipients.',
        topic: 'General Science'
      }
    ]
  }
];

// Local Storage Keys
const STORAGE_KEY_TESTS = 'bharathi_omr_master_tests';
const STORAGE_KEY_SUBMISSIONS = 'bharathi_student_omr_submissions';

// Helper: Seed or Load All Tests
export const getMasterTests = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TESTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error loading tests from localStorage:', err);
  }
  // Initialize with defaults if empty
  try {
    localStorage.setItem(STORAGE_KEY_TESTS, JSON.stringify(DEFAULT_OMR_TESTS));
  } catch (e) {}
  return DEFAULT_OMR_TESTS;
};

// Helper: Get Single Test by ID
export const getMasterTestById = (id) => {
  const tests = getMasterTests();
  return tests.find((t) => String(t.id) === String(id)) || tests[0];
};

// Helper: Save or Update Master Test (Admin action)
export const saveMasterTest = (testData) => {
  const tests = getMasterTests();
  const existingIdx = tests.findIndex((t) => String(t.id) === String(testData.id));

  let updatedList;
  if (existingIdx >= 0) {
    updatedList = [...tests];
    updatedList[existingIdx] = { ...updatedList[existingIdx], ...testData };
  } else {
    const newTest = {
      id: testData.id || `test-${Date.now()}`,
      ...testData,
    };
    updatedList = [newTest, ...tests];
  }

  try {
    localStorage.setItem(STORAGE_KEY_TESTS, JSON.stringify(updatedList));
  } catch (e) {
    console.error('Failed to save test in storage', e);
  }

  // Dispatch sync to Python MySQL backend
  try {
    const keysMap = {};
    (testData.questions || []).forEach((q) => {
      if (q && q.qNo) keysMap[q.qNo] = q.correctKey;
    });
    if (Object.keys(keysMap).length > 0) {
      omrApi.saveMasterKeys({
        test_id: testData.id,
        keys: keysMap,
      }).catch(() => null);
    }
  } catch (err) {}

  return updatedList;
};

// Helper: Delete Test
export const deleteMasterTest = (id) => {
  const tests = getMasterTests();
  const filtered = tests.filter((t) => String(t.id) !== String(id));
  try {
    localStorage.setItem(STORAGE_KEY_TESTS, JSON.stringify(filtered));
  } catch (e) {}
  return filtered;
};

// Helper: Evaluate & Validate Student OMR Sheet
export const evaluateOMRSubmission = ({
  testId,
  rollNo = 'BTK2026-0428',
  studentName = 'S. Kabilan',
  bookletSeries = 'A',
  candidateAnswers = {}, // map of { [qNo]: 'A' | 'B' | 'C' | 'D' | 'E' }
  timeSpentSeconds = 3600,
}) => {
  const test = getMasterTestById(testId);
  const questions = test.questions || [];
  const totalQuestions = questions.length || test.totalQuestions || 25;
  const positiveMark = test.positiveMark || 1.5;
  const negativeMark = test.negativeMark || 0;

  let correctCount = 0;
  let incorrectCount = 0;
  let unshadedCount = 0;
  let notKnownCount = 0; // marked 'E'
  const breakdown = [];

  questions.forEach((q) => {
    const qNo = q.qNo;
    const studentChoice = candidateAnswers[qNo] || null;
    const correctKey = q.correctKey || 'A';

    let status = 'unattempted';
    let isCorrect = false;

    if (!studentChoice) {
      unshadedCount++;
      status = 'unattempted';
    } else if (studentChoice === 'E') {
      notKnownCount++;
      status = 'not_known';
    } else if (studentChoice === correctKey) {
      correctCount++;
      isCorrect = true;
      status = 'correct';
    } else {
      incorrectCount++;
      status = 'incorrect';
    }

    breakdown.push({
      qNo,
      question: q.question,
      options: q.options,
      studentChoice,
      correctKey,
      status,
      isCorrect,
      explanation: q.explanation || 'Refer to classroom materials for detailed solution.',
      topic: q.topic || 'General Studies',
    });
  });

  const totalAttempted = correctCount + incorrectCount + notKnownCount;
  const rawScore = Math.max(0, correctCount * positiveMark - incorrectCount * negativeMark);
  const maxPossibleMarks = totalQuestions * positiveMark;
  const percentage = maxPossibleMarks > 0 ? (rawScore / maxPossibleMarks) * 100 : 0;
  const accuracy = totalAttempted > 0 ? (correctCount / totalAttempted) * 100 : 0;

  // Expected Statewide Performance simulation
  let simulatedRank = Math.max(1, Math.round(1800 * (1 - percentage / 105)));
  if (percentage >= 90) simulatedRank = Math.floor(Math.random() * 8) + 1;
  else if (percentage >= 75) simulatedRank = Math.floor(Math.random() * 45) + 10;
  else if (percentage >= 60) simulatedRank = Math.floor(Math.random() * 150) + 50;

  let cutoffZone = 'Qualifying Merit Zone (Above Expected Cutoff)';
  if (percentage < 55) cutoffZone = 'Needs Intensive Practice Batch';
  else if (percentage < 70) cutoffZone = 'Borderline Competitive Zone';

  const submissionResult = {
    submissionId: `OMR-SUB-${Date.now()}`,
    testId: test.id,
    testTitle: test.title,
    category: test.category,
    department: test.department,
    rollNo,
    studentName,
    bookletSeries,
    submittedAt: new Date().toISOString(),
    timeSpentSeconds,
    totalQuestions,
    totalAttempted,
    unshadedCount,
    notKnownCount,
    correctCount,
    incorrectCount,
    positiveMark,
    negativeMark,
    rawScore: Number(rawScore.toFixed(2)),
    maxPossibleMarks: Number(maxPossibleMarks.toFixed(2)),
    percentage: Number(percentage.toFixed(1)),
    accuracy: Number(accuracy.toFixed(1)),
    simulatedRank,
    cutoffZone,
    breakdown,
    candidateAnswers,
  };

  // Save to persistence
  try {
    const existingRaw = localStorage.getItem(STORAGE_KEY_SUBMISSIONS);
    const existing = existingRaw ? JSON.parse(existingRaw) : [];
    const updated = [submissionResult, ...existing.filter((s) => s.submissionId !== submissionResult.submissionId)];
    localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save OMR submission', err);
  }

  // Dispatch asynchronous sync to Python MySQL backend API
  try {
    omrApi.submitOMR({
      testId: test.id,
      rollNo,
      studentName,
      bookletSeries,
      candidateAnswers,
      timeSpentSeconds,
    }).then((res) => {
      if (res?.data?.submissionId) {
        console.log('[OMR Engine] Synced submission to MySQL backend:', res.data.submissionId);
      }
    }).catch(() => {
      // Offline fallback silent
    });
  } catch (backendErr) {}

  return submissionResult;
};

// Helper: Get Student Submissions
export const getStudentSubmissions = (rollNo) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SUBMISSIONS);
    if (!raw) return [];
    const list = JSON.parse(raw);
    if (!rollNo) return list;
    return list.filter((item) => !item.rollNo || item.rollNo === rollNo);
  } catch (e) {
    return [];
  }
};

// Helper: Get All Admin Submissions
export const getAllSubmissions = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SUBMISSIONS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

// Quick Master Key Batch String Parser (e.g., "1:A 2:C 3:B" or "A,B,C,D...")
export const parseAnswerKeyString = (str, totalCount = 25) => {
  const result = {};
  if (!str) return result;

  // If format "1:A, 2:B"
  if (str.includes(':') || str.includes('-')) {
    const pairs = str.split(/[,\s]+/);
    pairs.forEach((pair) => {
      const match = pair.match(/(\d+)[:\-=]([A-Ea-e])/);
      if (match) {
        const qNum = parseInt(match[1], 10);
        result[qNum] = match[2].toUpperCase();
      }
    });
    return result;
  }

  // If comma separated "A, B, C, D..."
  const tokens = str.replace(/[^A-Ea-e,]/g, '').split(',');
  tokens.forEach((val, idx) => {
    if (val && idx < totalCount) {
      result[idx + 1] = val.trim().toUpperCase();
    }
  });

  return result;
};
