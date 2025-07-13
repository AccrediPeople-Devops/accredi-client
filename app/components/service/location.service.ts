interface Country {
  code: string;
  name: string;
  states: State[];
}

interface State {
  code: string;
  name: string;
  cities: string[];
}

interface LocationData {
  countries: Country[];
}

class LocationService {
  private locationData: LocationData = {
    countries: [
      {
        code: "US",
        name: "United States",
        states: [
          {
            code: "CA",
            name: "California",
            cities: ["Los Angeles", "San Francisco", "San Diego", "Sacramento", "San Jose", "Fresno", "Long Beach", "Oakland", "Bakersfield", "Anaheim"]
          },
          {
            code: "NY",
            name: "New York",
            cities: ["New York City", "Buffalo", "Rochester", "Yonkers", "Syracuse", "Albany", "New Rochelle", "Mount Vernon", "Schenectady", "Utica"]
          },
          {
            code: "TX",
            name: "Texas",
            cities: ["Houston", "San Antonio", "Dallas", "Austin", "Fort Worth", "El Paso", "Arlington", "Corpus Christi", "Plano", "Lubbock"]
          },
          {
            code: "FL",
            name: "Florida",
            cities: ["Jacksonville", "Miami", "Tampa", "Orlando", "St. Petersburg", "Hialeah", "Tallahassee", "Fort Lauderdale", "Port St. Lucie", "Cape Coral"]
          },
          {
            code: "IL",
            name: "Illinois",
            cities: ["Chicago", "Aurora", "Rockford", "Joliet", "Naperville", "Springfield", "Peoria", "Elgin", "Waukegan", "Cicero"]
          }
        ]
      },
      {
        code: "IN",
        name: "India",
        states: [
          {
            code: "KA",
            name: "Karnataka",
            cities: ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum", "Gulbarga", "Davanagere", "Bellary", "Bijapur", "Shimoga", "Tumkur", "Raichur", "Bidar", "Hospet", "Hassan", "Gadag", "Udupi", "Robertsonpet", "Bhadravati", "Chitradurga"]
          },
          {
            code: "MH",
            name: "Maharashtra",
            cities: ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Amravati", "Kolhapur", "Sangli", "Malegaon", "Akola", "Latur", "Dhule", "Ahmednagar", "Chandrapur", "Parbhani", "Ichalkaranji", "Jalgaon", "Bhiwandi"]
          },
          {
            code: "TN",
            name: "Tamil Nadu",
            cities: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Tiruppur", "Vellore", "Erode", "Thoothukkudi", "Dindigul", "Thanjavur", "Ranipet", "Sivakasi", "Karur", "Udhagamandalam", "Hosur", "Nagercoil", "Kanchipuram", "Kumarakonam"]
          },
          {
            code: "DL",
            name: "Delhi",
            cities: ["New Delhi", "Delhi Cantonment", "Narela", "Alipur", "Bawana", "Mundka", "Kanjhawala", "Rohini", "Sultanpur Majra", "Nangloi Jat"]
          },
          {
            code: "WB",
            name: "West Bengal",
            cities: ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Malda", "Bardhaman", "Baharampur", "Habra", "Kharagpur", "Shantipur", "Dankuni", "Dhulian", "Ranaghat", "Haldia", "Raiganj", "Krishnanagar", "Nabadwip", "Medinipur", "Jalpaiguri"]
          },
          {
            code: "UP",
            name: "Uttar Pradesh",
            cities: ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Meerut", "Allahabad", "Bareilly", "Aligarh", "Moradabad", "Saharanpur", "Gorakhpur", "Noida", "Firozabad", "Jhansi", "Muzaffarnagar", "Mathura", "Rampur", "Shahjahanpur", "Farrukhabad"]
          },
          {
            code: "GJ",
            name: "Gujarat",
            cities: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagdh", "Gandhinagar", "Akola", "Anand", "Navsari", "Morbi", "Mahesana", "Bharuch", "Vapi", "Ankleshwar", "Godhra", "Veraval", "Porbandar", "Palanpur"]
          },
          {
            code: "RJ",
            name: "Rajasthan",
            cities: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner", "Alwar", "Bharatpur", "Sikar", "Bhilwara", "Sri Ganganagar", "Pali", "Kishangarh", "Baran", "Dhaulpur", "Tonk", "Beawar", "Hanumangarh", "Gangapur City", "Banswara"]
          },
          {
            code: "PB",
            name: "Punjab",
            cities: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Firozpur", "Batala", "Pathankot", "Moga", "Abohar", "Malerkotla", "Khanna", "Phagwara", "Muktsar", "Barnala", "Rajpura", "Hoshiarpur", "Kapurthala", "Faridkot"]
          },
          {
            code: "HR",
            name: "Haryana",
            cities: ["Faridabad", "Gurgaon", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal", "Sonipat", "Kaithal", "Sirsa", "Bahadurgarh", "Jind", "Thanesar", "Kaithal", "Rewari", "Narnaul", "Pundri", "Kosli", "Palwal"]
          }
        ]
      },
      {
        code: "GB",
        name: "United Kingdom",
        states: [
          {
            code: "ENG",
            name: "England",
            cities: ["London", "Birmingham", "Manchester", "Leeds", "Liverpool", "Sheffield", "Bristol", "Newcastle", "Nottingham", "Leicester"]
          },
          {
            code: "SCT",
            name: "Scotland",
            cities: ["Edinburgh", "Glasgow", "Aberdeen", "Dundee", "Stirling", "Perth", "Inverness", "Paisley", "East Kilbride", "Livingston"]
          },
          {
            code: "WLS",
            name: "Wales",
            cities: ["Cardiff", "Swansea", "Newport", "Wrexham", "Merthyr Tydfil", "Barry", "Caerphilly", "Neath", "Port Talbot", "Cwmbran"]
          },
          {
            code: "NIR",
            name: "Northern Ireland",
            cities: ["Belfast", "Derry", "Lisburn", "Newtownabbey", "Bangor", "Craigavon", "Castlereagh", "Ballymena", "Newtownards", "Carrickfergus"]
          }
        ]
      },
      {
        code: "CA",
        name: "Canada",
        states: [
          {
            code: "ON",
            name: "Ontario",
            cities: ["Toronto", "Ottawa", "Hamilton", "London", "Kitchener", "Windsor", "Oshawa", "Barrie", "Guelph", "Kingston"]
          },
          {
            code: "QC",
            name: "Quebec",
            cities: ["Montreal", "Quebec City", "Laval", "Gatineau", "Longueuil", "Sherbrooke", "Saguenay", "Levis", "Trois-Rivieres", "Terrebonne"]
          },
          {
            code: "BC",
            name: "British Columbia",
            cities: ["Vancouver", "Surrey", "Burnaby", "Richmond", "Abbotsford", "Coquitlam", "Kelowna", "Saanich", "Delta", "Langley"]
          },
          {
            code: "AB",
            name: "Alberta",
            cities: ["Calgary", "Edmonton", "Red Deer", "Lethbridge", "St. Albert", "Medicine Hat", "Grande Prairie", "Airdrie", "Spruce Grove", "Okotoks"]
          }
        ]
      },
      {
        code: "AU",
        name: "Australia",
        states: [
          {
            code: "NSW",
            name: "New South Wales",
            cities: ["Sydney", "Newcastle", "Wollongong", "Maitland", "Albury", "Wagga Wagga", "Port Macquarie", "Tamworth", "Orange", "Dubbo"]
          },
          {
            code: "VIC",
            name: "Victoria",
            cities: ["Melbourne", "Geelong", "Ballarat", "Bendigo", "Shepparton", "Melton", "Latrobe", "Horsham", "Warrnambool", "Wodonga"]
          },
          {
            code: "QLD",
            name: "Queensland",
            cities: ["Brisbane", "Gold Coast", "Sunshine Coast", "Townsville", "Cairns", "Toowoomba", "Rockhampton", "Mackay", "Bundaberg", "Hervey Bay"]
          },
          {
            code: "WA",
            name: "Western Australia",
            cities: ["Perth", "Fremantle", "Rockingham", "Mandurah", "Bunbury", "Kalgoorlie", "Geraldton", "Albany", "Kwinana", "Broome"]
          }
        ]
      },
      {
        code: "DE",
        name: "Germany",
        states: [
          {
            code: "BY",
            name: "Bavaria",
            cities: ["Munich", "Nuremberg", "Augsburg", "Regensburg", "Ingolstadt", "Wurzburg", "Fürth", "Erlangen", "Bayreuth", "Bamberg"]
          },
          {
            code: "NW",
            name: "North Rhine-Westphalia",
            cities: ["Cologne", "Düsseldorf", "Dortmund", "Essen", "Duisburg", "Bochum", "Wuppertal", "Bielefeld", "Bonn", "Münster"]
          },
          {
            code: "BW",
            name: "Baden-Württemberg",
            cities: ["Stuttgart", "Mannheim", "Karlsruhe", "Freiburg", "Heidelberg", "Ulm", "Heilbronn", "Pforzheim", "Reutlingen", "Esslingen"]
          }
        ]
      },
      {
        code: "FR",
        name: "France",
        states: [
          {
            code: "IDF",
            name: "Île-de-France",
            cities: ["Paris", "Boulogne-Billancourt", "Saint-Denis", "Argenteuil", "Montreuil", "Créteil", "Nanterre", "Colombes", "Aulnay-sous-Bois", "Rueil-Malmaison"]
          },
          {
            code: "ARA",
            name: "Auvergne-Rhône-Alpes",
            cities: ["Lyon", "Saint-Étienne", "Grenoble", "Villeurbanne", "Clermont-Ferrand", "Valence", "Chambéry", "Annecy", "Bourg-en-Bresse", "Roanne"]
          },
          {
            code: "PACA",
            name: "Provence-Alpes-Côte d'Azur",
            cities: ["Marseille", "Nice", "Toulon", "Aix-en-Provence", "Avignon", "Antibes", "Cannes", "La Seyne-sur-Mer", "Hyères", "Arles"]
          }
        ]
      },
      {
        code: "JP",
        name: "Japan",
        states: [
          {
            code: "13",
            name: "Tokyo",
            cities: ["Tokyo", "Shibuya", "Shinjuku", "Harajuku", "Ginza", "Roppongi", "Akihabara", "Ueno", "Asakusa", "Ikebukuro"]
          },
          {
            code: "27",
            name: "Osaka",
            cities: ["Osaka", "Sakai", "Higashiosaka", "Hirakata", "Toyonaka", "Suita", "Takatsuki", "Yao", "Neyagawa", "Kadoma"]
          },
          {
            code: "14",
            name: "Kanagawa",
            cities: ["Yokohama", "Kawasaki", "Sagamihara", "Fujisawa", "Chigasaki", "Hiratsuka", "Zushi", "Kamakura", "Yamato", "Atsugi"]
          }
        ]
      },
      {
        code: "BR",
        name: "Brazil",
        states: [
          {
            code: "SP",
            name: "São Paulo",
            cities: ["São Paulo", "Guarulhos", "Campinas", "São Bernardo do Campo", "Santo André", "Osasco", "Ribeirão Preto", "Sorocaba", "Mauá", "São José dos Campos"]
          },
          {
            code: "RJ",
            name: "Rio de Janeiro",
            cities: ["Rio de Janeiro", "São Gonçalo", "Duque de Caxias", "Nova Iguaçu", "Niterói", "Belford Roxo", "São João de Meriti", "Campos dos Goytacazes", "Petrópolis", "Volta Redonda"]
          },
          {
            code: "MG",
            name: "Minas Gerais",
            cities: ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim", "Montes Claros", "Ribeirão das Neves", "Uberaba", "Governador Valadares", "Ipatinga"]
          }
        ]
      },
      {
        code: "CN",
        name: "China",
        states: [
          {
            code: "BJ",
            name: "Beijing",
            cities: ["Beijing", "Chaoyang", "Haidian", "Dongcheng", "Xicheng", "Fengtai", "Shijingshan", "Mentougou", "Fangshan", "Tongzhou"]
          },
          {
            code: "SH",
            name: "Shanghai",
            cities: ["Shanghai", "Pudong", "Huangpu", "Xuhui", "Changning", "Jing'an", "Putuo", "Hongkou", "Yangpu", "Minhang"]
          },
          {
            code: "GD",
            name: "Guangdong",
            cities: ["Guangzhou", "Shenzhen", "Dongguan", "Foshan", "Zhongshan", "Zhuhai", "Jiangmen", "Huizhou", "Zhaoqing", "Shantou"]
          }
        ]
      },
      {
        code: "MX",
        name: "Mexico",
        states: [
          {
            code: "CDMX",
            name: "Mexico City",
            cities: ["Mexico City", "Iztapalapa", "Gustavo A. Madero", "Álvaro Obregón", "Tlalpan", "Coyoacán", "Venustiano Carranza", "Azcapotzalco", "Xochimilco", "Benito Juárez"]
          },
          {
            code: "JAL",
            name: "Jalisco",
            cities: ["Guadalajara", "Zapopan", "Tlaquepaque", "Tonalá", "Puerto Vallarta", "Tlajomulco", "El Salto", "Chapala", "Ocotlán", "Lagos de Moreno"]
          },
          {
            code: "NL",
            name: "Nuevo León",
            cities: ["Monterrey", "Guadalupe", "San Nicolás de los Garza", "Apodaca", "General Escobedo", "Santa Catarina", "San Pedro Garza García", "Juárez", "Cadereyta Jiménez", "García"]
          }
        ]
      },
      {
        code: "RU",
        name: "Russia",
        states: [
          {
            code: "MOW",
            name: "Moscow",
            cities: ["Moscow", "Zelenograd", "Troitsk", "Shcherbinka", "Moskovsky", "Vnukovo", "Sosenskoye", "Kokoshkino", "Kommunarka", "Marushkinskoye"]
          },
          {
            code: "SPE",
            name: "Saint Petersburg",
            cities: ["Saint Petersburg", "Kronstadt", "Zelenogorsk", "Pavlovsk", "Pushkin", "Petergof", "Lomonosov", "Sestroretsk", "Kolpino", "Krasnoye Selo"]
          },
          {
            code: "MOS",
            name: "Moscow Oblast",
            cities: ["Balashikha", "Khimki", "Podolsk", "Mytishchi", "Korolyov", "Lyubertsy", "Elektrostal", "Kolomna", "Zhukovsky", "Orekhovo-Zuyevo"]
          }
        ]
      },
      {
        code: "ZA",
        name: "South Africa",
        states: [
          {
            code: "GP",
            name: "Gauteng",
            cities: ["Johannesburg", "Pretoria", "Soweto", "Benoni", "Kempton Park", "Alberton", "Germiston", "Randburg", "Roodepoort", "Springs"]
          },
          {
            code: "WC",
            name: "Western Cape",
            cities: ["Cape Town", "Bellville", "Mitchells Plain", "Khayelitsha", "Somerset West", "Paarl", "George", "Stellenbosch", "Worcester", "Malmesbury"]
          },
          {
            code: "KZN",
            name: "KwaZulu-Natal",
            cities: ["Durban", "Pietermaritzburg", "Pinetown", "Chatsworth", "Umlazi", "Port Shepstone", "Newcastle", "Dundee", "Ladysmith", "Estcourt"]
          }
        ]
      },
      {
        code: "NG",
        name: "Nigeria",
        states: [
          {
            code: "LA",
            name: "Lagos",
            cities: ["Lagos", "Ikeja", "Ikorodu", "Epe", "Badagry", "Mushin", "Alimosho", "Kosofe", "Oshodi-Isolo", "Shomolu"]
          },
          {
            code: "KN",
            name: "Kano",
            cities: ["Kano", "Wudil", "Gwarzo", "Dawakin Kudu", "Garko", "Madobi", "Sumaila", "Tudun Wada", "Ungogo", "Fagge"]
          },
          {
            code: "RI",
            name: "Rivers",
            cities: ["Port Harcourt", "Obio-Akpor", "Okrika", "Eleme", "Tai", "Oyigbo", "Ogu–Bolo", "Andoni", "Bonny", "Degema"]
          }
        ]
      },
      {
        code: "IT",
        name: "Italy",
        states: [
          {
            code: "LZ",
            name: "Lazio",
            cities: ["Rome", "Latina", "Guidonia Montecelio", "Fiumicino", "Aprilia", "Tivoli", "Anzio", "Pomezia", "Nettuno", "Albano Laziale"]
          },
          {
            code: "LM",
            name: "Lombardy",
            cities: ["Milan", "Brescia", "Monza", "Bergamo", "Como", "Varese", "Cremona", "Mantova", "Pavia", "Lecco"]
          },
          {
            code: "CM",
            name: "Campania",
            cities: ["Naples", "Salerno", "Giugliano in Campania", "Torre del Greco", "Pozzuoli", "Casoria", "Marano di Napoli", "Afragola", "Acerra", "Portici"]
          }
        ]
      },
      {
        code: "ES",
        name: "Spain",
        states: [
          {
            code: "MD",
            name: "Madrid",
            cities: ["Madrid", "Móstoles", "Alcalá de Henares", "Fuenlabrada", "Leganés", "Getafe", "Alcorcón", "Torrejón de Ardoz", "Parla", "Alcobendas"]
          },
          {
            code: "CT",
            name: "Catalonia",
            cities: ["Barcelona", "Hospitalet de Llobregat", "Badalona", "Terrassa", "Sabadell", "Lleida", "Tarragona", "Mataró", "Santa Coloma de Gramenet", "Reus"]
          },
          {
            code: "AN",
            name: "Andalusia",
            cities: ["Seville", "Málaga", "Córdoba", "Granada", "Jerez de la Frontera", "Almería", "Huelva", "Marbella", "Dos Hermanas", "Algeciras"]
          }
        ]
      },
      {
        code: "AR",
        name: "Argentina",
        states: [
          {
            code: "BA",
            name: "Buenos Aires",
            cities: ["Buenos Aires", "La Plata", "Mar del Plata", "Bahía Blanca", "San Nicolás", "Tandil", "Zárate", "Pergamino", "Olavarría", "Junín"]
          },
          {
            code: "CB",
            name: "Córdoba",
            cities: ["Córdoba", "Villa Carlos Paz", "Río Cuarto", "San Francisco", "Villa María", "Jesús María", "Marcos Juárez", "Bell Ville", "Alta Gracia", "Dean Funes"]
          },
          {
            code: "SF",
            name: "Santa Fe",
            cities: ["Rosario", "Santa Fe", "Rafaela", "Reconquista", "Venado Tuerto", "Santo Tomé", "Esperanza", "San Lorenzo", "Casilda", "Gálvez"]
          }
        ]
      },
      {
        code: "KR",
        name: "South Korea",
        states: [
          {
            code: "11",
            name: "Seoul",
            cities: ["Seoul", "Gangnam", "Gangdong", "Gangbuk", "Gangseo", "Gwanak", "Gwangjin", "Guro", "Geumcheon", "Nowon"]
          },
          {
            code: "26",
            name: "Busan",
            cities: ["Busan", "Haeundae", "Saha", "Buk", "Sasang", "Yeonje", "Suyeong", "Gangseo", "Geumjeong", "Jung"]
          },
          {
            code: "28",
            name: "Incheon",
            cities: ["Incheon", "Namdong", "Bupyeong", "Seo", "Yeonsu", "Michuhol", "Gyeyang", "Jung", "Dong", "Ganghwa"]
          }
        ]
      },
      {
        code: "TH",
        name: "Thailand",
        states: [
          {
            code: "10",
            name: "Bangkok",
            cities: ["Bangkok", "Chatuchak", "Bang Kapi", "Huai Khwang", "Din Daeng", "Bueng Kum", "Sai Mai", "Phaya Thai", "Ratchathewi", "Lat Phrao"]
          },
          {
            code: "77",
            name: "Chiang Mai",
            cities: ["Chiang Mai", "Mueang Chiang Mai", "Hang Dong", "San Kamphaeng", "San Pa Tong", "Doi Saket", "Mae Rim", "Saraphi", "Chom Thong", "San Sai"]
          },
          {
            code: "83",
            name: "Phuket",
            cities: ["Phuket", "Mueang Phuket", "Kathu", "Thalang", "Patong", "Karon", "Kata", "Rawai", "Chalong", "Kamala"]
          }
        ]
      },
      {
        code: "ID",
        name: "Indonesia",
        states: [
          {
            code: "JK",
            name: "Jakarta",
            cities: ["Jakarta", "Central Jakarta", "North Jakarta", "West Jakarta", "South Jakarta", "East Jakarta", "Thousand Islands", "Bogor", "Depok", "Tangerang"]
          },
          {
            code: "JB",
            name: "West Java",
            cities: ["Bandung", "Bekasi", "Depok", "Cimahi", "Tasikmalaya", "Banjar", "Sukabumi", "Cirebon", "Bogor", "Garut"]
          },
          {
            code: "JT",
            name: "Central Java",
            cities: ["Semarang", "Surakarta", "Salatiga", "Pekalongan", "Tegal", "Magelang", "Sukoharjo", "Klaten", "Boyolali", "Wonogiri"]
          }
        ]
      },
      {
        code: "PH",
        name: "Philippines",
        states: [
          {
            code: "NCR",
            name: "National Capital Region",
            cities: ["Manila", "Quezon City", "Caloocan", "Las Piñas", "Makati", "Malabon", "Mandaluyong", "Marikina", "Muntinlupa", "Navotas"]
          },
          {
            code: "R4A",
            name: "Calabarzon",
            cities: ["Antipolo", "Dasmariñas", "Bacoor", "General Trias", "Imus", "Biñan", "Santa Rosa", "San Pedro", "Cabuyao", "Calamba"]
          },
          {
            code: "R7",
            name: "Central Visayas",
            cities: ["Cebu City", "Mandaue", "Lapu-Lapu", "Talisay", "Toledo", "Danao", "Carcar", "Bogo", "Naga", "Minglanilla"]
          }
        ]
      },
      {
        code: "VN",
        name: "Vietnam",
        states: [
          {
            code: "HN",
            name: "Hanoi",
            cities: ["Hanoi", "Ba Đình", "Hoàn Kiếm", "Tây Hồ", "Long Biên", "Cầu Giấy", "Đống Đa", "Hai Bà Trưng", "Hoàng Mai", "Thanh Xuân"]
          },
          {
            code: "SG",
            name: "Ho Chi Minh City",
            cities: ["Ho Chi Minh City", "District 1", "District 3", "District 4", "District 5", "District 6", "District 7", "District 8", "District 10", "District 11"]
          },
          {
            code: "DN",
            name: "Da Nang",
            cities: ["Da Nang", "Hải Châu", "Thanh Khê", "Sơn Trà", "Ngũ Hành Sơn", "Liên Chiểu", "Cẩm Lệ", "Hòa Vang", "Hoàng Sa", "Ba Na Hills"]
          }
        ]
      },
      {
        code: "MY",
        name: "Malaysia",
        states: [
          {
            code: "14",
            name: "Kuala Lumpur",
            cities: ["Kuala Lumpur", "Cheras", "Kepong", "Setapak", "Wangsa Maju", "Segambut", "Seputeh", "Lembah Pantai", "Bandar Tun Razak", "Bukit Bintang"]
          },
          {
            code: "10",
            name: "Selangor",
            cities: ["Shah Alam", "Petaling Jaya", "Subang Jaya", "Klang", "Ampang", "Selayang", "Kajang", "Seri Kembangan", "Puchong", "Rawang"]
          },
          {
            code: "07",
            name: "Penang",
            cities: ["George Town", "Seberang Perai", "Butterworth", "Bukit Mertajam", "Nibong Tebal", "Permatang Pauh", "Kepala Batas", "Tanjung Tokong", "Air Itam", "Bayan Lepas"]
          }
        ]
      },
      {
        code: "SG",
        name: "Singapore",
        states: [
          {
            code: "SG",
            name: "Singapore",
            cities: ["Singapore", "Jurong", "Woodlands", "Tampines", "Sengkang", "Hougang", "Yishun", "Bedok", "Punggol", "Ang Mo Kio"]
          }
        ]
      },
      {
        code: "NZ",
        name: "New Zealand",
        states: [
          {
            code: "AUK",
            name: "Auckland",
            cities: ["Auckland", "Manukau", "North Shore", "Waitakere", "Papakura", "Franklin", "Rodney", "Henderson", "Takapuna", "Botany Downs"]
          },
          {
            code: "WGN",
            name: "Wellington",
            cities: ["Wellington", "Lower Hutt", "Upper Hutt", "Porirua", "Kapiti Coast", "Masterton", "Carterton", "South Wairarapa", "Featherston", "Greytown"]
          },
          {
            code: "CAN",
            name: "Canterbury",
            cities: ["Christchurch", "Timaru", "Ashburton", "Rangiora", "Rolleston", "Lincoln", "Kaiapoi", "Prebbleton", "Oxford", "Darfield"]
          }
        ]
      },
      {
        code: "AE",
        name: "United Arab Emirates",
        states: [
          {
            code: "DU",
            name: "Dubai",
            cities: ["Dubai", "Deira", "Bur Dubai", "Jumeirah", "Downtown Dubai", "Dubai Marina", "Jebel Ali", "Al Barsha", "Business Bay", "DIFC"]
          },
          {
            code: "AZ",
            name: "Abu Dhabi",
            cities: ["Abu Dhabi", "Al Ain", "Madinat Zayed", "Liwa Oasis", "Ruwais", "Mirfa", "Ghayathi", "Sila", "Delma Island", "Zirku Island"]
          },
          {
            code: "SH",
            name: "Sharjah",
            cities: ["Sharjah", "Khorfakkan", "Kalba", "Dibba Al-Hisn", "Dhaid", "Mleiha", "Al Madam", "Al Hamriyah", "Al Batayeh", "Al Suyoh"]
          }
        ]
      },
      {
        code: "SA",
        name: "Saudi Arabia",
        states: [
          {
            code: "01",
            name: "Riyadh",
            cities: ["Riyadh", "Diriyah", "Al Kharj", "Al Majmaah", "Al Quwayiyah", "Afif", "As Sulayyil", "Ad Dawadimi", "Rumah", "Shaqra"]
          },
          {
            code: "02",
            name: "Makkah",
            cities: ["Mecca", "Jeddah", "Taif", "Medina", "Yanbu", "Rabigh", "Al Jumum", "Al Kamil", "Bahra", "Thuwal"]
          },
          {
            code: "03",
            name: "Eastern Province",
            cities: ["Dammam", "Dhahran", "Al Khobar", "Jubail", "Al Ahsa", "Qatif", "Hafr Al-Batin", "Ras Tanura", "Khafji", "Al Nairyah"]
          }
        ]
      },
      {
        code: "IL",
        name: "Israel",
        states: [
          {
            code: "JM",
            name: "Jerusalem",
            cities: ["Jerusalem", "Bethlehem", "Beit Shemesh", "Mevaseret Zion", "Abu Ghosh", "Ein Karem", "Motza", "Har Adar", "Givat Zeev", "Ma'ale Adumim"]
          },
          {
            code: "TA",
            name: "Tel Aviv",
            cities: ["Tel Aviv", "Ramat Gan", "Petah Tikva", "Holon", "Bnei Brak", "Bat Yam", "Herzliya", "Kfar Saba", "Ra'anana", "Givatayim"]
          },
          {
            code: "HF",
            name: "Haifa",
            cities: ["Haifa", "Nazareth", "Akko", "Tiberias", "Safed", "Nahariya", "Afula", "Migdal HaEmek", "Nesher", "Tirat Carmel"]
          }
        ]
      },
      {
        code: "TR",
        name: "Turkey",
        states: [
          {
            code: "34",
            name: "Istanbul",
            cities: ["Istanbul", "Kadıköy", "Üsküdar", "Beşiktaş", "Şişli", "Beyoğlu", "Fatih", "Bakırköy", "Zeytinburnu", "Bayrampaşa"]
          },
          {
            code: "06",
            name: "Ankara",
            cities: ["Ankara", "Çankaya", "Keçiören", "Yenimahalle", "Mamak", "Sincan", "Etimesgut", "Altındağ", "Pursaklar", "Elmadağ"]
          },
          {
            code: "35",
            name: "Izmir",
            cities: ["Izmir", "Konak", "Bornova", "Karşıyaka", "Buca", "Bayraklı", "Gaziemir", "Alsancak", "Çiğli", "Balçova"]
          }
        ]
      },
      {
        code: "EG",
        name: "Egypt",
        states: [
          {
            code: "C",
            name: "Cairo",
            cities: ["Cairo", "Giza", "Shubra El Kheima", "Port Said", "Suez", "Luxor", "al-Mahallah al-Kubra", "Tanta", "Asyut", "Ismailia"]
          },
          {
            code: "ALX",
            name: "Alexandria",
            cities: ["Alexandria", "Damanhur", "Kafr el-Dawwar", "Rosetta", "Edko", "Abu Qir", "Idku", "Rashid", "Kafr el-Sheikh", "Desouk"]
          },
          {
            code: "GZ",
            name: "Giza",
            cities: ["Giza", "6th of October City", "Sheikh Zayed City", "Al Haram", "Faisal", "Dokki", "Agouza", "Mohandessin", "Imbaba", "Kit Kat"]
          }
        ]
      },
      {
        code: "MA",
        name: "Morocco",
        states: [
          {
            code: "06",
            name: "Casablanca-Settat",
            cities: ["Casablanca", "Rabat", "Salé", "Temara", "Mohammedia", "El Jadida", "Settat", "Berrechid", "Khouribga", "Benslimane"]
          },
          {
            code: "03",
            name: "Fès-Meknès",
            cities: ["Fès", "Meknès", "Taza", "Sefrou", "Khenifra", "Errachidia", "Ifrane", "Imouzzer Kandar", "Ribate El Kheir", "Agouraï"]
          },
          {
            code: "10",
            name: "Souss-Massa",
            cities: ["Agadir", "Inezgane", "Taroudant", "Tiznit", "Ouarzazate", "Zagora", "Tinghir", "Sidi Ifni", "Tafraout", "Ait Baha"]
          }
        ]
      },
      {
        code: "KE",
        name: "Kenya",
        states: [
          {
            code: "30",
            name: "Nairobi",
            cities: ["Nairobi", "Karen", "Westlands", "Kasarani", "Embakasi", "Dagoretti", "Langata", "Makadara", "Kamukunji", "Starehe"]
          },
          {
            code: "01",
            name: "Mombasa",
            cities: ["Mombasa", "Kilifi", "Malindi", "Watamu", "Lamu", "Kwale", "Diani Beach", "Ukunda", "Msambweni", "Shimoni"]
          },
          {
            code: "32",
            name: "Nakuru",
            cities: ["Nakuru", "Eldoret", "Kitale", "Kericho", "Bomet", "Narok", "Nyahururu", "Gilgil", "Molo", "Njoro"]
          }
        ]
      },
      {
        code: "GH",
        name: "Ghana",
        states: [
          {
            code: "AA",
            name: "Greater Accra",
            cities: ["Accra", "Tema", "Madina", "Adenta", "Kasoa", "Ga", "Teshie", "Nungua", "La", "Osu"]
          },
          {
            code: "AH",
            name: "Ashanti",
            cities: ["Kumasi", "Obuasi", "Ejisu", "Mampong", "Konongo", "Agogo", "Bekwai", "Offinso", "Tepa", "Juaso"]
          },
          {
            code: "WP",
            name: "Western",
            cities: ["Sekondi-Takoradi", "Tarkwa", "Prestea", "Axim", "Elubo", "Half Assini", "Bogoso", "Dunkwa", "Asankrangwa", "Enchi"]
          }
        ]
      },
      {
        code: "ET",
        name: "Ethiopia",
        states: [
          {
            code: "AA",
            name: "Addis Ababa",
            cities: ["Addis Ababa", "Bole", "Kirkos", "Yeka", "Nifas Silk-Lafto", "Kolfe Keranio", "Gulele", "Arada", "Addis Ketema", "Akaky Kaliti"]
          },
          {
            code: "OR",
            name: "Oromia",
            cities: ["Adama", "Jimma", "Bishoftu", "Shashamane", "Nekemte", "Harar", "Dire Dawa", "Asella", "Robe", "Goba"]
          },
          {
            code: "AM",
            name: "Amhara",
            cities: ["Bahir Dar", "Gondar", "Dessie", "Debre Markos", "Kombolcha", "Debre Birhan", "Lalibela", "Woldiya", "Debre Tabor", "Finote Selam"]
          }
        ]
      },
      {
        code: "BD",
        name: "Bangladesh",
        states: [
          {
            code: "C",
            name: "Dhaka",
            cities: ["Dhaka", "Gazipur", "Narayanganj", "Savar", "Tongi", "Keraniganj", "Dohar", "Nawabganj", "Dhamrai", "Manikganj"]
          },
          {
            code: "B",
            name: "Chittagong",
            cities: ["Chittagong", "Cox's Bazar", "Comilla", "Brahmanbaria", "Noakhali", "Feni", "Lakshmipur", "Chandpur", "Rangamati", "Bandarban"]
          },
          {
            code: "A",
            name: "Rajshahi",
            cities: ["Rajshahi", "Rangpur", "Bogra", "Pabna", "Sirajganj", "Natore", "Naogaon", "Chapainawabganj", "Joypurhat", "Kurigram"]
          }
        ]
      },
      {
        code: "PK",
        name: "Pakistan",
        states: [
          {
            code: "PB",
            name: "Punjab",
            cities: ["Lahore", "Faisalabad", "Rawalpindi", "Multan", "Gujranwala", "Sialkot", "Bahawalpur", "Sargodha", "Sheikhupura", "Jhang"]
          },
          {
            code: "SD",
            name: "Sindh",
            cities: ["Karachi", "Hyderabad", "Sukkur", "Larkana", "Nawabshah", "Mirpurkhas", "Jacobabad", "Shikarpur", "Khairpur", "Dadu"]
          },
          {
            code: "KP",
            name: "Khyber Pakhtunkhwa",
            cities: ["Peshawar", "Mardan", "Mingora", "Kohat", "Dera Ismail Khan", "Bannu", "Swabi", "Charsadda", "Nowshera", "Abbottabad"]
          }
        ]
      },
      {
        code: "LK",
        name: "Sri Lanka",
        states: [
          {
            code: "1",
            name: "Western",
            cities: ["Colombo", "Gampaha", "Kalutara", "Moratuwa", "Sri Jayewardenepura Kotte", "Negombo", "Panadura", "Horana", "Wattala", "Kesbewa"]
          },
          {
            code: "2",
            name: "Central",
            cities: ["Kandy", "Matale", "Nuwara Eliya", "Gampola", "Hatton", "Nawalapitiya", "Wattegama", "Akurana", "Kadugannawa", "Peradeniya"]
          },
          {
            code: "3",
            name: "Southern",
            cities: ["Galle", "Matara", "Hambantota", "Ambalangoda", "Tangalle", "Weligama", "Tissamaharama", "Beliatta", "Kamburupitiya", "Akuressa"]
          }
        ]
      },
      {
        code: "MM",
        name: "Myanmar",
        states: [
          {
            code: "11",
            name: "Yangon",
            cities: ["Yangon", "Thanlyin", "Twante", "Kawhmu", "Kungyangon", "Hlegu", "Hmawbi", "Htantabin", "Shwepyitha", "Mingaladon"]
          },
          {
            code: "04",
            name: "Mandalay",
            cities: ["Mandalay", "Monywa", "Meiktila", "Nyaung-U", "Pyinoolwin", "Sagaing", "Shwebo", "Myingyan", "Kyaukse", "Amarapura"]
          },
          {
            code: "07",
            name: "Bago",
            cities: ["Bago", "Pyay", "Taungoo", "Tharyarwady", "Letpadan", "Monyo", "Okpho", "Daik-U", "Shwegyin", "Waw"]
          }
        ]
      },
      {
        code: "NP",
        name: "Nepal",
        states: [
          {
            code: "3",
            name: "Bagmati",
            cities: ["Kathmandu", "Lalitpur", "Bhaktapur", "Kirtipur", "Madhyapur Thimi", "Budhanilkantha", "Tarakeshwar", "Kageshwari Manohara", "Shankarapur", "Nagarjun"]
          },
          {
            code: "4",
            name: "Gandaki",
            cities: ["Pokhara", "Gorkha", "Lamjung", "Tanahu", "Syangja", "Kaski", "Manang", "Mustang", "Myagdi", "Baglung"]
          },
          {
            code: "1",
            name: "Province No. 1",
            cities: ["Biratnagar", "Dharan", "Itahari", "Damak", "Birtamodh", "Mechinagar", "Urlabari", "Letang", "Sundar Haraicha", "Barahachhetra"]
          }
        ]
      },
      {
        code: "UZ",
        name: "Uzbekistan",
        states: [
          {
            code: "TK",
            name: "Tashkent",
            cities: ["Tashkent", "Chirchiq", "Angren", "Almaliq", "Bekabad", "Yangiyul", "Parkent", "Piskent", "Buka", "Qibray"]
          },
          {
            code: "SA",
            name: "Samarkand",
            cities: ["Samarkand", "Kattakurgan", "Urgut", "Jomboy", "Payariq", "Bulungur", "Ishtixon", "Koshrabot", "Narpay", "Pakhtachi"]
          },
          {
            code: "BU",
            name: "Bukhara",
            cities: ["Bukhara", "Kogon", "Gijduvan", "Vobkent", "Galaosiyo", "Jondor", "Kagan", "Olot", "Peshku", "Romitan"]
          }
        ]
      },
      {
        code: "KZ",
        name: "Kazakhstan",
        states: [
          {
            code: "ALA",
            name: "Almaty",
            cities: ["Almaty", "Kapchagay", "Talgar", "Issyk", "Zharkent", "Sarkand", "Ushtobe", "Kerbulak", "Balkhash", "Bakanas"]
          },
          {
            code: "AST",
            name: "Nur-Sultan",
            cities: ["Nur-Sultan", "Kosshy", "Arshaly", "Atbasar", "Yesil", "Tselinograd", "Shortandy", "Makinsk", "Stepnogorsk", "Kokshetau"]
          },
          {
            code: "ALM",
            name: "Almaty Region",
            cities: ["Taldykorgan", "Tekeli", "Sarkand", "Kapchagay", "Zharkent", "Kerbulak", "Ushtobe", "Alakol", "Bakanas", "Lepsy"]
          }
        ]
      },
      {
        code: "PL",
        name: "Poland",
        states: [
          {
            code: "MZ",
            name: "Mazowieckie",
            cities: ["Warsaw", "Radom", "Płock", "Siedlce", "Ostrołęka", "Ciechanów", "Mińsk Mazowiecki", "Sochaczew", "Żyrardów", "Nowy Dwór Mazowiecki"]
          },
          {
            code: "SL",
            name: "Śląskie",
            cities: ["Katowice", "Częstochowa", "Sosnowiec", "Gliwice", "Zabrze", "Bytom", "Bielsko-Biała", "Ruda Śląska", "Rybnik", "Tychy"]
          },
          {
            code: "MP",
            name: "Małopolskie",
            cities: ["Kraków", "Tarnów", "Nowy Sącz", "Oświęcim", "Chrzanów", "Olkusz", "Zakopane", "Gorlice", "Wadowice", "Bochnia"]
          }
        ]
      },
      {
        code: "NL",
        name: "Netherlands",
        states: [
          {
            code: "NH",
            name: "North Holland",
            cities: ["Amsterdam", "Haarlem", "Zaanstad", "Haarlemmermeer", "Alkmaar", "Amstelveen", "Hilversum", "Hoorn", "Purmerend", "Heerhugowaard"]
          },
          {
            code: "ZH",
            name: "South Holland",
            cities: ["The Hague", "Rotterdam", "Leiden", "Dordrecht", "Zoetermeer", "Delft", "Alphen aan den Rijn", "Westland", "Gouda", "Spijkenisse"]
          },
          {
            code: "NB",
            name: "North Brabant",
            cities: ["Eindhoven", "Tilburg", "Breda", "'s-Hertogenbosch", "Almere", "Groningen", "Apeldoorn", "Nijmegen", "Haarlem", "Enschede"]
          }
        ]
      },
      {
        code: "BE",
        name: "Belgium",
        states: [
          {
            code: "BRU",
            name: "Brussels",
            cities: ["Brussels", "Schaerbeek", "Anderlecht", "Ixelles", "Woluwe-Saint-Lambert", "Uccle", "Forest", "Molenbeek-Saint-Jean", "Etterbeek", "Berchem-Sainte-Agathe"]
          },
          {
            code: "VLG",
            name: "Flanders",
            cities: ["Antwerp", "Ghent", "Bruges", "Leuven", "Aalst", "Kortrijk", "Hasselt", "Sint-Niklaas", "Ostend", "Genk"]
          },
          {
            code: "WAL",
            name: "Wallonia",
            cities: ["Charleroi", "Liège", "Namur", "Mons", "La Louvière", "Tournai", "Verviers", "Seraing", "Mouscron", "Arlon"]
          }
        ]
      },
      {
        code: "SE",
        name: "Sweden",
        states: [
          {
            code: "AB",
            name: "Stockholm",
            cities: ["Stockholm", "Huddinge", "Järfälla", "Ekerö", "Haninge", "Botkyrka", "Salem", "Sollentuna", "Tyresö", "Upplands Väsby"]
          },
          {
            code: "O",
            name: "Västra Götaland",
            cities: ["Gothenburg", "Borås", "Trollhättan", "Uddevalla", "Lidköping", "Skövde", "Mariestad", "Vänersborg", "Falköping", "Alingsås"]
          },
          {
            code: "M",
            name: "Skåne",
            cities: ["Malmö", "Helsingborg", "Lund", "Kristianstad", "Landskrona", "Trelleborg", "Ängelholm", "Hässleholm", "Ystad", "Eslöv"]
          }
        ]
      },
      {
        code: "NO",
        name: "Norway",
        states: [
          {
            code: "03",
            name: "Oslo",
            cities: ["Oslo", "Bærum", "Asker", "Lørenskog", "Drammen", "Sandvika", "Ski", "Ås", "Oppegård", "Nesodden"]
          },
          {
            code: "46",
            name: "Vestland",
            cities: ["Bergen", "Stavanger", "Kristiansand", "Fredrikstad", "Sandnes", "Tromsø", "Sarpsborg", "Skien", "Ålesund", "Sandefjord"]
          },
          {
            code: "50",
            name: "Trøndelag",
            cities: ["Trondheim", "Steinkjer", "Namsos", "Levanger", "Verdal", "Stjørdal", "Orkdal", "Røros", "Frøya", "Ørland"]
          }
        ]
      },
      {
        code: "DK",
        name: "Denmark",
        states: [
          {
            code: "84",
            name: "Capital Region",
            cities: ["Copenhagen", "Frederiksberg", "Gentofte", "Gladsaxe", "Lyngby-Taarbæk", "Herlev", "Rødovre", "Albertslund", "Hvidovre", "Ballerup"]
          },
          {
            code: "82",
            name: "Central Jutland",
            cities: ["Aarhus", "Randers", "Horsens", "Vejle", "Silkeborg", "Herning", "Holstebro", "Viborg", "Skanderborg", "Ringkøbing-Skjern"]
          },
          {
            code: "83",
            name: "Southern Denmark",
            cities: ["Odense", "Esbjerg", "Kolding", "Fredericia", "Haderslev", "Sønderborg", "Aabenraa", "Varde", "Middelfart", "Nyborg"]
          }
        ]
      },
      {
        code: "FI",
        name: "Finland",
        states: [
          {
            code: "01",
            name: "Uusimaa",
            cities: ["Helsinki", "Espoo", "Vantaa", "Kauniainen", "Hyvinkää", "Järvenpää", "Kerava", "Kirkkonummi", "Nurmijärvi", "Sipoo"]
          },
          {
            code: "04",
            name: "Pirkanmaa",
            cities: ["Tampere", "Nokia", "Ylöjärvi", "Kangasala", "Lempäälä", "Orivesi", "Pirkkala", "Sastamala", "Valkeakoski", "Mänttä-Vilppula"]
          },
          {
            code: "19",
            name: "Varsinais-Suomi",
            cities: ["Turku", "Kaarina", "Raisio", "Naantali", "Salo", "Loimaa", "Uusikaupunki", "Paimio", "Somero", "Mynämäki"]
          }
        ]
      },
      {
        code: "CH",
        name: "Switzerland",
        states: [
          {
            code: "ZH",
            name: "Zurich",
            cities: ["Zurich", "Winterthur", "Uster", "Dübendorf", "Dietikon", "Wetzikon", "Kloten", "Schlieren", "Volketswil", "Regensdorf"]
          },
          {
            code: "BE",
            name: "Bern",
            cities: ["Bern", "Biel/Bienne", "Thun", "Köniz", "Burgdorf", "Steffisburg", "Langenthal", "Spiez", "Münsingen", "Ittigen"]
          },
          {
            code: "GE",
            name: "Geneva",
            cities: ["Geneva", "Vernier", "Lancy", "Meyrin", "Carouge", "Onex", "Thônex", "Versoix", "Chêne-Bougeries", "Le Grand-Saconnex"]
          }
        ]
      },
      {
        code: "AT",
        name: "Austria",
        states: [
          {
            code: "9",
            name: "Vienna",
            cities: ["Vienna", "Döbling", "Hietzing", "Penzing", "Rudolfsheim-Fünfhaus", "Ottakring", "Hernals", "Währing", "Alsergrund", "Josefstadt"]
          },
          {
            code: "4",
            name: "Upper Austria",
            cities: ["Linz", "Wels", "Steyr", "Traun", "Leonding", "Ansfelden", "Enns", "Marchtrenk", "Vöcklabruck", "Gmunden"]
          },
          {
            code: "6",
            name: "Styria",
            cities: ["Graz", "Leoben", "Kapfenberg", "Bruck an der Mur", "Feldkirchen", "Köflach", "Voitsberg", "Judenburg", "Knittelfeld", "Mürzzuschlag"]
          }
        ]
      }
    ]
  };

  /**
   * Get all countries
   */
  getCountries(): Country[] {
    return this.locationData.countries;
  }

  /**
   * Get states for a specific country
   */
  getStatesByCountry(countryCode: string): State[] {
    const country = this.locationData.countries.find(c => c.code === countryCode);
    return country ? country.states : [];
  }

  /**
   * Get cities for a specific state
   */
  getCitiesByState(countryCode: string, stateCode: string): string[] {
    const country = this.locationData.countries.find(c => c.code === countryCode);
    if (!country) return [];
    
    const state = country.states.find(s => s.code === stateCode);
    return state ? state.cities : [];
  }

  /**
   * Search countries by name
   */
  searchCountries(query: string): Country[] {
    if (!query.trim()) return this.getCountries();
    
    const searchTerm = query.toLowerCase();
    return this.locationData.countries.filter(country =>
      country.name.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Search states by name within a country
   */
  searchStates(countryCode: string, query: string): State[] {
    const states = this.getStatesByCountry(countryCode);
    if (!query.trim()) return states;
    
    const searchTerm = query.toLowerCase();
    return states.filter(state =>
      state.name.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Search cities by name within a state
   */
  searchCities(countryCode: string, stateCode: string, query: string): string[] {
    const cities = this.getCitiesByState(countryCode, stateCode);
    if (!query.trim()) return cities;
    
    const searchTerm = query.toLowerCase();
    return cities.filter(city =>
      city.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Get country by code
   */
  getCountryByCode(countryCode: string): Country | null {
    return this.locationData.countries.find(c => c.code === countryCode) || null;
  }

  /**
   * Get state by code
   */
  getStateByCode(countryCode: string, stateCode: string): State | null {
    const country = this.getCountryByCode(countryCode);
    if (!country) return null;
    
    return country.states.find(s => s.code === stateCode) || null;
  }
}

export default new LocationService(); 