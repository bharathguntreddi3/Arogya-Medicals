// All fixed text on the site, in English and Telugu.
// Lists (services, reasons) follow the same order in both languages.
// Offer text has two versions: D(withDiscount, withoutDiscount). LanguageProvider picks one —
// "{discount}% OFF" once the admin sets a discount, "Best Discounts" until then.
// Phone numbers, address, timings and payment methods come from the admin settings instead.

const D = (withDiscount, withoutDiscount) => ({ withDiscount, withoutDiscount })

const en = {
  brand: {
    name: 'Arogya Medicals',
    tagline: 'Your Health, Our Priority',
  },
  ribbon: {
    offer: D('{discount}% OFF on All Medicines', 'Best Discounts on All Medicines'),
  },
  nav: {
    services: 'Services',
    why: 'Why Us',
    location: 'Location',
    contact: 'Contact',
    callNow: 'Call Now',
    callNumber: (n) => `Call ${n}`,
    menu: 'Menu',
    switchLanguage: 'తెలుగులో చూడండి',
    darkMode: 'Dark mode',
    lightMode: 'Light mode',
    backToTop: 'Back to top',
    closeNotice: 'Close notice',
    closeRibbon: 'Close offers strip',
  },
  status: {
    open: 'Open now',
    closesAt: (t) => `Closes at ${t}`,
    closed: 'Closed now',
    opensAt: (t) => `Opens at ${t}`,
    opensTomorrow: (t) => `Opens tomorrow at ${t}`,
    opensOn: (day, t) => `Opens ${day} at ${t}`,
    temporarilyClosed: 'Temporarily closed',
    temporarilyClosedDetail: 'Call or WhatsApp us for help',
  },
  days: {
    long: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    short: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    closed: 'Closed',
  },
  hero: {
    badge: D('{discount}% OFF ON ALL MEDICINES', 'BEST DISCOUNTS ON ALL MEDICINES'),
    title: 'Arogya Medicals',
    subtitle: 'Genuine Medicines, Trusted Care, Better Living',
    description:
      'Your trusted neighborhood medical store offering quality medicines with care and affordability. Call or WhatsApp us to check availability — then visit the store to collect.',
    call: 'Call Now',
    whatsapp: 'WhatsApp',
    visit: 'Visit Store',
    imageAlt: 'Smiling pharmacist holding a medicine strip inside Arogya Medicals store',
    pharmacist: 'I am the Pharmacist',
    pharmacistNote: 'Here to guide you',
    genuine: '100% Genuine',
    licensed: 'Licensed pharmacy',
    visitStore: 'Visit Our Store',
    prescription: 'Have a prescription? Send it on WhatsApp',
  },
  prescription: {
    button: 'Send prescription',
    message:
      "Hi Arogya Medicals, I'd like to send my prescription. Please check if these medicines are available.",
  },
  payments: {
    label: 'We accept',
  },
  trust: ['Licensed & Certified', 'Caring Pharmacists', 'Visit Our Store', 'Authentic Products'],
  services: {
    badge: 'Our Services',
    title: 'Everything you need under one roof',
    subtitle: 'From prescription refills to wellness essentials — we’ve got your family covered.',
    items: [
      {
        title: 'All Medicines Under One Roof',
        text: 'A wide stock of medicines and healthcare products in one place.',
      },
      {
        title: 'Branded & Generic Medicines',
        text: 'Choose from trusted brands or affordable generic alternatives.',
      },
      {
        title: 'Visit Our Store',
        text: 'Drop by our Sundar Nagar shop to pick up your medicines in person.',
      },
      {
        title: 'Prescription Assistance',
        text: "Send your prescription on WhatsApp — we'll confirm availability before you visit.",
      },
      {
        title: 'Health & Wellness Products',
        text: 'Vitamins, supplements, ayurveda, baby care and personal care.',
      },
      {
        title: 'Fast & Friendly Service',
        text: 'Warm, helpful staff and quick service every time you visit.',
      },
      {
        title: 'Trusted Quality',
        text: 'Properly stored, authentic medicines from licensed sources.',
      },
      {
        title: 'Affordable Prices',
        text: D(
          'Honest pricing with a flat {discount}% off on all medicines.',
          'Honest pricing with the best discounts on all medicines.',
        ),
      },
    ],
  },
  why: {
    badge: 'Why Choose Us',
    title: 'Care you can count on',
    subtitle: 'Six reasons families across Sundar Nagar choose Arogya Medicals.',
    items: [
      { title: 'Genuine Medicines', text: 'Sourced from licensed distributors and stored with care.' },
      {
        title: 'Best Prices',
        text: D(
          'Flat {discount}% off on all medicines, every single day.',
          'Best discounts on all medicines, every single day.',
        ),
      },
      { title: 'Customer Trust', text: 'Thousands of families in Visakhapatnam rely on us.' },
      {
        title: 'Friendly In-Store Service',
        text: 'Visit us in Sundar Nagar for personal care and quick service.',
      },
      { title: 'Professional Guidance', text: 'Expert pharmacists ready to guide you patiently.' },
      { title: 'Reliable Stock', text: 'Wide range of medicines always available in stock.' },
    ],
    rateTitle: 'Happy with our service?',
    rateText: 'Your review helps other families find a pharmacy they can trust.',
    rateButton: 'Rate us on Google',
  },
  hours: {
    title: 'Working Hours',
    subtitle: 'We’re here when you need us',
    note: 'Need a medicine outside hours? Send us a WhatsApp — we’ll get back as soon as we open.',
    offerTitle: D('Save {discount}% on every medicine', 'Best discounts on every medicine'),
    offerText: D(
      'Show this offer at the counter or mention it on WhatsApp — flat {discount}% off on all medicines, every visit.',
      'Ask at the counter or on WhatsApp — best discounts on all medicines, every visit.',
    ),
    enquire: 'Enquire on WhatsApp',
    reserve: 'Call to reserve',
  },
  featured: {
    badge: 'Featured Offer',
    title: 'Good Health, Made Easy',
    textBefore: D(
      'Genuine medicines, prescription assistance and a flat',
      'Genuine medicines, prescription assistance and the',
    ),
    highlight: D(' {discount}% off ', ' best discounts '),
    textAfter:
      ' on all medicines — every single day at Arogya Medicals. Call or WhatsApp to check stock, then visit our store.',
    enquire: 'Enquire on WhatsApp',
    posterAlt: D(
      'Arogya Medicals promotional poster — {discount}% off on all medicines',
      'Arogya Medicals promotional poster — best discounts on all medicines',
    ),
  },
  gallery: {
    badge: 'Our Store',
    title: 'Take a look inside',
    subtitle: 'A clean, well-stocked pharmacy right in Sundar Nagar.',
    open: (n) => `Open photo ${n}`,
    close: 'Close photo',
    previous: 'Previous photo',
    next: 'Next photo',
  },
  location: {
    badge: 'Our Location',
    title: 'Find us in Sundar Nagar',
    openMaps: 'Open in Google Maps',
    loadMap: 'Load map',
    mapHint: 'Tap to load the interactive map',
    call: 'Call Now',
    whatsapp: 'WhatsApp',
  },
  contact: {
    badge: 'Get in Touch',
    title: 'We’d love to hear from you',
    description:
      'Reach out on call or WhatsApp for medicine availability, prescriptions or any health questions — then visit the store to collect.',
    phone: 'Phone',
    whatsapp: 'WhatsApp',
    chat: 'Chat with us',
    address: 'Address',
    payment: 'Payment',
    timings: 'Timings',
    formTitle: 'Send us a message',
    formSubtitle: 'We’ll reply on WhatsApp shortly.',
    name: 'Name',
    namePlaceholder: 'Your full name',
    message: 'Message',
    messagePlaceholder: 'How can we help you?',
    submit: 'Send via WhatsApp',
    sent: 'Opening WhatsApp… thank you!',
    sentButton: 'Sent',
    errors: {
      name: 'Please enter your name',
      nameLong: 'Name is too long',
      phone: 'Enter a valid phone number',
      messageShort: 'Message is too short',
      messageLong: 'Message is too long',
    },
  },
  footer: {
    about:
      'Genuine medicines and trusted care for every family in Visakhapatnam. Visit us at Sundar Nagar or reach us on call and WhatsApp.',
    quickLinks: 'Quick Links',
    links: ['Services', 'Why Choose Us', 'Location', 'Contact'],
    contact: 'Contact',
    rights: 'Arogya Medicals · Visakhapatnam · All rights reserved.',
    admin: 'Admin',
  },
  bubble: {
    text: 'Need a medicine? Chat with us on WhatsApp',
    close: 'Close',
  },
  mobile: {
    call: 'Call',
    whatsapp: 'WhatsApp',
    directions: 'Directions',
    chatAria: 'Chat on WhatsApp',
  },
}

const te = {
  brand: {
    name: 'Arogya Medicals',
    tagline: 'మీ ఆరోగ్యమే మా ప్రాధాన్యత',
  },
  ribbon: {
    offer: D('అన్ని మందులపై {discount}% తగ్గింపు', 'అన్ని మందులపై ఉత్తమ తగ్గింపులు'),
  },
  nav: {
    services: 'సేవలు',
    why: 'మా ప్రత్యేకత',
    location: 'చిరునామా',
    contact: 'సంప్రదించండి',
    callNow: 'కాల్ చేయండి',
    callNumber: (n) => `${n} కి కాల్ చేయండి`,
    menu: 'మెనూ',
    switchLanguage: 'View in English',
    darkMode: 'డార్క్ మోడ్',
    lightMode: 'లైట్ మోడ్',
    backToTop: 'పైకి వెళ్ళండి',
    closeNotice: 'నోటీసు మూసివేయండి',
    closeRibbon: 'ఆఫర్ల పట్టీ మూసివేయండి',
  },
  status: {
    open: 'ఇప్పుడు తెరిచి ఉంది',
    closesAt: (t) => `${t} కి మూసివేస్తాం`,
    closed: 'ప్రస్తుతం మూసి ఉంది',
    opensAt: (t) => `${t} కి తెరుస్తాం`,
    opensTomorrow: (t) => `రేపు ${t} కి తెరుస్తాం`,
    opensOn: (day, t) => `${day} ${t} కి తెరుస్తాం`,
    temporarilyClosed: 'తాత్కాలికంగా మూసి ఉంది',
    temporarilyClosedDetail: 'సహాయం కోసం కాల్ లేదా వాట్సాప్ చేయండి',
  },
  days: {
    long: ['ఆదివారం', 'సోమవారం', 'మంగళవారం', 'బుధవారం', 'గురువారం', 'శుక్రవారం', 'శనివారం'],
    short: ['ఆది', 'సోమ', 'మంగళ', 'బుధ', 'గురు', 'శుక్ర', 'శని'],
    closed: 'మూసి ఉంటుంది',
  },
  hero: {
    badge: D('అన్ని మందులపై {discount}% తగ్గింపు', 'అన్ని మందులపై ఉత్తమ తగ్గింపులు'),
    title: 'ఆరోగ్య మెడికల్స్',
    subtitle: 'నాణ్యమైన మందులు, నమ్మకమైన సేవ, మెరుగైన జీవితం',
    description:
      'మీ ఇంటి దగ్గర నమ్మకమైన మెడికల్ స్టోర్ — నాణ్యమైన మందులు, శ్రద్ధగల సేవ, సరసమైన ధరలు. మందులు అందుబాటులో ఉన్నాయో తెలుసుకోవడానికి కాల్ లేదా వాట్సాప్ చేయండి — తర్వాత స్టోర్‌కు వచ్చి తీసుకెళ్లండి.',
    call: 'కాల్ చేయండి',
    whatsapp: 'వాట్సాప్',
    visit: 'స్టోర్‌కు రండి',
    imageAlt: 'ఆరోగ్య మెడికల్స్ స్టోర్‌లో మందుల స్ట్రిప్ పట్టుకున్న ఫార్మసిస్ట్',
    pharmacist: 'నేనే ఫార్మసిస్ట్',
    pharmacistNote: 'మీకు సలహా ఇవ్వడానికి',
    genuine: '100% నాణ్యమైనవి',
    licensed: 'లైసెన్స్ పొందిన ఫార్మసీ',
    visitStore: 'మా స్టోర్‌కు రండి',
    prescription: 'ప్రిస్క్రిప్షన్ ఉందా? వాట్సాప్‌లో పంపండి',
  },
  prescription: {
    button: 'ప్రిస్క్రిప్షన్ పంపండి',
    message:
      'నమస్కారం ఆరోగ్య మెడికల్స్, నా ప్రిస్క్రిప్షన్ పంపాలనుకుంటున్నాను. ఈ మందులు అందుబాటులో ఉన్నాయో తెలియజేయండి.',
  },
  payments: {
    label: 'మేము స్వీకరిస్తాం',
  },
  trust: ['లైసెన్స్ & ధృవీకరణ', 'శ్రద్ధగల ఫార్మసిస్టులు', 'మా స్టోర్‌కు రండి', 'అసలైన ఉత్పత్తులు'],
  services: {
    badge: 'మా సేవలు',
    title: 'మీకు కావలసినవన్నీ ఒకే చోట',
    subtitle: 'ప్రిస్క్రిప్షన్ మందుల నుండి ఆరోగ్య ఉత్పత్తుల వరకు — మీ కుటుంబానికి కావలసినవన్నీ మా దగ్గర ఉన్నాయి.',
    items: [
      {
        title: 'అన్ని మందులు ఒకే చోట',
        text: 'మందులు మరియు ఆరోగ్య ఉత్పత్తుల విస్తృత నిల్వ ఒకే చోట.',
      },
      {
        title: 'బ్రాండెడ్ & జనరిక్ మందులు',
        text: 'నమ్మకమైన బ్రాండ్లు లేదా తక్కువ ధర జనరిక్ ప్రత్యామ్నాయాలను ఎంచుకోండి.',
      },
      {
        title: 'మా స్టోర్‌కు రండి',
        text: 'మీ మందులను స్వయంగా తీసుకెళ్లడానికి సుందర్ నగర్‌లోని మా షాప్‌కు రండి.',
      },
      {
        title: 'ప్రిస్క్రిప్షన్ సహాయం',
        text: 'మీ ప్రిస్క్రిప్షన్‌ను వాట్సాప్‌లో పంపండి — మీరు రాకముందే మందులు ఉన్నాయో లేదో తెలియజేస్తాం.',
      },
      {
        title: 'ఆరోగ్య & వెల్‌నెస్ ఉత్పత్తులు',
        text: 'విటమిన్లు, సప్లిమెంట్లు, ఆయుర్వేదం, బేబీ కేర్ మరియు పర్సనల్ కేర్.',
      },
      {
        title: 'వేగవంతమైన & స్నేహపూర్వక సేవ',
        text: 'మీరు వచ్చిన ప్రతిసారీ ఆప్యాయంగా సహాయం చేసే సిబ్బంది, త్వరిత సేవ.',
      },
      {
        title: 'నమ్మకమైన నాణ్యత',
        text: 'లైసెన్స్ పొందిన సరఫరాదారుల నుండి, సరిగ్గా నిల్వ చేసిన అసలైన మందులు.',
      },
      {
        title: 'సరసమైన ధరలు',
        text: D(
          'అన్ని మందులపై {discount}% ఫ్లాట్ తగ్గింపుతో నిజాయితీ ధరలు.',
          'అన్ని మందులపై ఉత్తమ తగ్గింపులతో నిజాయితీ ధరలు.',
        ),
      },
    ],
  },
  why: {
    badge: 'మమ్మల్నే ఎందుకు ఎంచుకోవాలి',
    title: 'మీరు నమ్మగలిగే సేవ',
    subtitle: 'సుందర్ నగర్‌లోని కుటుంబాలు ఆరోగ్య మెడికల్స్‌ను ఎంచుకోవడానికి ఆరు కారణాలు.',
    items: [
      { title: 'నాణ్యమైన మందులు', text: 'లైసెన్స్ పొందిన డిస్ట్రిబ్యూటర్ల నుండి సేకరించి, జాగ్రత్తగా నిల్వ చేస్తాం.' },
      {
        title: 'ఉత్తమ ధరలు',
        text: D(
          'ప్రతిరోజూ అన్ని మందులపై {discount}% ఫ్లాట్ తగ్గింపు.',
          'ప్రతిరోజూ అన్ని మందులపై ఉత్తమ తగ్గింపులు.',
        ),
      },
      { title: 'కస్టమర్ల నమ్మకం', text: 'విశాఖపట్నంలో వేలాది కుటుంబాలు మాపై ఆధారపడుతున్నాయి.' },
      {
        title: 'స్టోర్‌లో స్నేహపూర్వక సేవ',
        text: 'వ్యక్తిగత శ్రద్ధ మరియు త్వరిత సేవ కోసం సుందర్ నగర్‌లో మమ్మల్ని సందర్శించండి.',
      },
      { title: 'నిపుణుల సలహా', text: 'ఓపికగా మార్గనిర్దేశం చేయడానికి అనుభవజ్ఞులైన ఫార్మసిస్టులు సిద్ధంగా ఉన్నారు.' },
      { title: 'నమ్మకమైన స్టాక్', text: 'విస్తృత శ్రేణి మందులు ఎల్లప్పుడూ అందుబాటులో ఉంటాయి.' },
    ],
    rateTitle: 'మా సేవ నచ్చిందా?',
    rateText: 'మీ రివ్యూ ఇతర కుటుంబాలకు నమ్మకమైన ఫార్మసీని కనుగొనడంలో సహాయపడుతుంది.',
    rateButton: 'గూగుల్‌లో రేటింగ్ ఇవ్వండి',
  },
  hours: {
    title: 'పని వేళలు',
    subtitle: 'మీకు అవసరమైనప్పుడు మేము ఇక్కడ ఉన్నాం',
    note: 'పని వేళల తర్వాత మందు కావాలా? వాట్సాప్ చేయండి — స్టోర్ తెరవగానే మీకు సమాధానం ఇస్తాం.',
    offerTitle: D('ప్రతి మందుపై {discount}% ఆదా చేయండి', 'ప్రతి మందుపై ఉత్తమ తగ్గింపులు'),
    offerText: D(
      'కౌంటర్ వద్ద ఈ ఆఫర్ చూపించండి లేదా వాట్సాప్‌లో చెప్పండి — ప్రతిసారీ అన్ని మందులపై {discount}% ఫ్లాట్ తగ్గింపు.',
      'కౌంటర్ వద్ద లేదా వాట్సాప్‌లో అడగండి — ప్రతిసారీ అన్ని మందులపై ఉత్తమ తగ్గింపులు.',
    ),
    enquire: 'వాట్సాప్‌లో అడగండి',
    reserve: 'కాల్ చేసి రిజర్వ్ చేయండి',
  },
  featured: {
    badge: 'ప్రత్యేక ఆఫర్',
    title: 'మంచి ఆరోగ్యం, ఇప్పుడు సులభం',
    textBefore: 'ఆరోగ్య మెడికల్స్‌లో ప్రతిరోజూ నాణ్యమైన మందులు, ప్రిస్క్రిప్షన్ సహాయం మరియు అన్ని మందులపై',
    highlight: D(' {discount}% ఫ్లాట్ తగ్గింపు', ' ఉత్తమ తగ్గింపులు'),
    textAfter: '. స్టాక్ తెలుసుకోవడానికి కాల్ లేదా వాట్సాప్ చేయండి, తర్వాత మా స్టోర్‌కు రండి.',
    enquire: 'వాట్సాప్‌లో అడగండి',
    posterAlt: D(
      'ఆరోగ్య మెడికల్స్ ప్రచార పోస్టర్ — అన్ని మందులపై {discount}% తగ్గింపు',
      'ఆరోగ్య మెడికల్స్ ప్రచార పోస్టర్ — అన్ని మందులపై ఉత్తమ తగ్గింపులు',
    ),
  },
  gallery: {
    badge: 'మా స్టోర్',
    title: 'మా స్టోర్ లోపల ఒకసారి చూడండి',
    subtitle: 'సుందర్ నగర్‌లో శుభ్రమైన, అన్ని మందులతో నిండిన ఫార్మసీ.',
    open: (n) => `ఫోటో ${n} తెరవండి`,
    close: 'ఫోటో మూసివేయండి',
    previous: 'మునుపటి ఫోటో',
    next: 'తదుపరి ఫోటో',
  },
  location: {
    badge: 'మా చిరునామా',
    title: 'సుందర్ నగర్‌లో మమ్మల్ని కనుగొనండి',
    openMaps: 'గూగుల్ మ్యాప్స్‌లో చూడండి',
    loadMap: 'మ్యాప్ చూపించు',
    mapHint: 'మ్యాప్ చూడటానికి ట్యాప్ చేయండి',
    call: 'కాల్ చేయండి',
    whatsapp: 'వాట్సాప్',
  },
  contact: {
    badge: 'మమ్మల్ని సంప్రదించండి',
    title: 'మీ నుండి వినడానికి ఎదురుచూస్తున్నాం',
    description:
      'మందుల లభ్యత, ప్రిస్క్రిప్షన్లు లేదా ఏవైనా ఆరోగ్య సందేహాల కోసం కాల్ లేదా వాట్సాప్ చేయండి — తర్వాత స్టోర్‌కు వచ్చి తీసుకెళ్లండి.',
    phone: 'ఫోన్',
    whatsapp: 'వాట్సాప్',
    chat: 'మాతో చాట్ చేయండి',
    address: 'చిరునామా',
    payment: 'చెల్లింపు',
    timings: 'సమయాలు',
    formTitle: 'మాకు సందేశం పంపండి',
    formSubtitle: 'వాట్సాప్‌లో త్వరలో సమాధానం ఇస్తాం.',
    name: 'పేరు',
    namePlaceholder: 'మీ పూర్తి పేరు',
    message: 'సందేశం',
    messagePlaceholder: 'మేము మీకు ఎలా సహాయం చేయగలం?',
    submit: 'వాట్సాప్ ద్వారా పంపండి',
    sent: 'వాట్సాప్ తెరుస్తున్నాం… ధన్యవాదాలు!',
    sentButton: 'పంపబడింది',
    errors: {
      name: 'దయచేసి మీ పేరు నమోదు చేయండి',
      nameLong: 'పేరు చాలా పెద్దదిగా ఉంది',
      phone: 'సరైన ఫోన్ నంబర్ నమోదు చేయండి',
      messageShort: 'సందేశం చాలా చిన్నదిగా ఉంది',
      messageLong: 'సందేశం చాలా పెద్దదిగా ఉంది',
    },
  },
  footer: {
    about:
      'విశాఖపట్నంలోని ప్రతి కుటుంబానికి నాణ్యమైన మందులు మరియు నమ్మకమైన సంరక్షణ. సుందర్ నగర్‌లో మమ్మల్ని సందర్శించండి లేదా కాల్ మరియు వాట్సాప్ ద్వారా సంప్రదించండి.',
    quickLinks: 'త్వరిత లింకులు',
    links: ['సేవలు', 'మా ప్రత్యేకత', 'చిరునామా', 'సంప్రదించండి'],
    contact: 'సంప్రదించండి',
    rights: 'ఆరోగ్య మెడికల్స్ · విశాఖపట్నం · సర్వ హక్కులు ప్రత్యేకించబడ్డాయి.',
    admin: 'అడ్మిన్',
  },
  bubble: {
    text: 'మందు కావాలా? వాట్సాప్‌లో మాతో చాట్ చేయండి',
    close: 'మూసివేయండి',
  },
  mobile: {
    call: 'కాల్',
    whatsapp: 'వాట్సాప్',
    directions: 'దారి చూపు',
    chatAria: 'వాట్సాప్‌లో చాట్ చేయండి',
  },
}

export const translations = { en, te }
