// World Location Database - All Countries with Currency Information
export interface CountryData {
  name: string;
  code: string;
  currencyCode: string;
  currencySymbol: string;
  flag: string;
}

// All 195 countries with their currency information
export const WORLD_COUNTRIES: CountryData[] = [
  // A
  { name: "Afghanistan", code: "AF", currencyCode: "AFN", currencySymbol: "؋", flag: "🇦🇫" },
  { name: "Albania", code: "AL", currencyCode: "ALL", currencySymbol: "L", flag: "🇦🇱" },
  { name: "Algeria", code: "DZ", currencyCode: "DZD", currencySymbol: "د.ج", flag: "🇩🇿" },
  { name: "Andorra", code: "AD", currencyCode: "EUR", currencySymbol: "€", flag: "🇦🇩" },
  { name: "Angola", code: "AO", currencyCode: "AOA", currencySymbol: "Kz", flag: "🇦🇴" },
  { name: "Antigua and Barbuda", code: "AG", currencyCode: "XCD", currencySymbol: "$", flag: "🇦🇬" },
  { name: "Argentina", code: "AR", currencyCode: "ARS", currencySymbol: "$", flag: "🇦🇷" },
  { name: "Armenia", code: "AM", currencyCode: "AMD", currencySymbol: "֏", flag: "🇦🇲" },
  { name: "Australia", code: "AU", currencyCode: "AUD", currencySymbol: "$", flag: "🇦🇺" },
  { name: "Austria", code: "AT", currencyCode: "EUR", currencySymbol: "€", flag: "🇦🇹" },
  { name: "Azerbaijan", code: "AZ", currencyCode: "AZN", currencySymbol: "₼", flag: "🇦🇿" },

  // B
  { name: "Bahamas", code: "BS", currencyCode: "BSD", currencySymbol: "$", flag: "🇧🇸" },
  { name: "Bahrain", code: "BH", currencyCode: "BHD", currencySymbol: ".د.ب", flag: "🇧🇭" },
  { name: "Bangladesh", code: "BD", currencyCode: "BDT", currencySymbol: "৳", flag: "🇧🇩" },
  { name: "Barbados", code: "BB", currencyCode: "BBD", currencySymbol: "$", flag: "🇧🇧" },
  { name: "Belarus", code: "BY", currencyCode: "BYN", currencySymbol: "Br", flag: "🇧🇾" },
  { name: "Belgium", code: "BE", currencyCode: "EUR", currencySymbol: "€", flag: "🇧🇪" },
  { name: "Belize", code: "BZ", currencyCode: "BZD", currencySymbol: "$", flag: "🇧🇿" },
  { name: "Benin", code: "BJ", currencyCode: "XOF", currencySymbol: "Fr", flag: "🇧🇯" },
  { name: "Bhutan", code: "BT", currencyCode: "BTN", currencySymbol: "Nu.", flag: "🇧🇹" },
  { name: "Bolivia", code: "BO", currencyCode: "BOB", currencySymbol: "Bs.", flag: "🇧🇴" },
  { name: "Bosnia and Herzegovina", code: "BA", currencyCode: "BAM", currencySymbol: "КМ", flag: "🇧🇦" },
  { name: "Botswana", code: "BW", currencyCode: "BWP", currencySymbol: "P", flag: "🇧🇼" },
  { name: "Brazil", code: "BR", currencyCode: "BRL", currencySymbol: "R$", flag: "🇧🇷" },
  { name: "Brunei", code: "BN", currencyCode: "BND", currencySymbol: "$", flag: "🇧🇳" },
  { name: "Bulgaria", code: "BG", currencyCode: "BGN", currencySymbol: "лв", flag: "🇧🇬" },
  { name: "Burkina Faso", code: "BF", currencyCode: "XOF", currencySymbol: "Fr", flag: "🇧🇫" },
  { name: "Burundi", code: "BI", currencyCode: "BIF", currencySymbol: "Fr", flag: "🇧🇮" },

  // C
  { name: "Cambodia", code: "KH", currencyCode: "KHR", currencySymbol: "៛", flag: "🇰🇭" },
  { name: "Cameroon", code: "CM", currencyCode: "XAF", currencySymbol: "Fr", flag: "🇨🇲" },
  { name: "Canada", code: "CA", currencyCode: "CAD", currencySymbol: "$", flag: "🇨🇦" },
  { name: "Cape Verde", code: "CV", currencyCode: "CVE", currencySymbol: "$", flag: "🇨🇻" },
  { name: "Central African Republic", code: "CF", currencyCode: "XAF", currencySymbol: "Fr", flag: "🇨🇫" },
  { name: "Chad", code: "TD", currencyCode: "XAF", currencySymbol: "Fr", flag: "🇹🇩" },
  { name: "Chile", code: "CL", currencyCode: "CLP", currencySymbol: "$", flag: "🇨🇱" },
  { name: "China", code: "CN", currencyCode: "CNY", currencySymbol: "¥", flag: "🇨🇳" },
  { name: "Colombia", code: "CO", currencyCode: "COP", currencySymbol: "$", flag: "🇨🇴" },
  { name: "Comoros", code: "KM", currencyCode: "KMF", currencySymbol: "Fr", flag: "🇰🇲" },
  { name: "Congo", code: "CG", currencyCode: "XAF", currencySymbol: "Fr", flag: "🇨🇬" },
  { name: "Costa Rica", code: "CR", currencyCode: "CRC", currencySymbol: "₡", flag: "🇨🇷" },
  { name: "Croatia", code: "HR", currencyCode: "EUR", currencySymbol: "€", flag: "🇭🇷" },
  { name: "Cuba", code: "CU", currencyCode: "CUP", currencySymbol: "$", flag: "🇨🇺" },
  { name: "Cyprus", code: "CY", currencyCode: "EUR", currencySymbol: "€", flag: "🇨🇾" },
  { name: "Czech Republic", code: "CZ", currencyCode: "CZK", currencySymbol: "Kč", flag: "🇨🇿" },

  // D
  { name: "Democratic Republic of the Congo", code: "CD", currencyCode: "CDF", currencySymbol: "Fr", flag: "🇨🇩" },
  { name: "Denmark", code: "DK", currencyCode: "DKK", currencySymbol: "kr", flag: "🇩🇰" },
  { name: "Djibouti", code: "DJ", currencyCode: "DJF", currencySymbol: "Fr", flag: "🇩🇯" },
  { name: "Dominica", code: "DM", currencyCode: "XCD", currencySymbol: "$", flag: "🇩🇲" },
  { name: "Dominican Republic", code: "DO", currencyCode: "DOP", currencySymbol: "$", flag: "🇩🇴" },

  // E
  { name: "Ecuador", code: "EC", currencyCode: "USD", currencySymbol: "$", flag: "🇪🇨" },
  { name: "Egypt", code: "EG", currencyCode: "EGP", currencySymbol: "£", flag: "🇪🇬" },
  { name: "El Salvador", code: "SV", currencyCode: "USD", currencySymbol: "$", flag: "🇸🇻" },
  { name: "Equatorial Guinea", code: "GQ", currencyCode: "XAF", currencySymbol: "Fr", flag: "🇬🇶" },
  { name: "Eritrea", code: "ER", currencyCode: "ERN", currencySymbol: "Nfk", flag: "🇪🇷" },
  { name: "Estonia", code: "EE", currencyCode: "EUR", currencySymbol: "€", flag: "🇪🇪" },
  { name: "Eswatini", code: "SZ", currencyCode: "SZL", currencySymbol: "L", flag: "🇸🇿" },
  { name: "Ethiopia", code: "ET", currencyCode: "ETB", currencySymbol: "Br", flag: "🇪🇹" },

  // F
  { name: "Fiji", code: "FJ", currencyCode: "FJD", currencySymbol: "$", flag: "🇫🇯" },
  { name: "Finland", code: "FI", currencyCode: "EUR", currencySymbol: "€", flag: "🇫🇮" },
  { name: "France", code: "FR", currencyCode: "EUR", currencySymbol: "€", flag: "🇫🇷" },

  // G
  { name: "Gabon", code: "GA", currencyCode: "XAF", currencySymbol: "Fr", flag: "🇬🇦" },
  { name: "Gambia", code: "GM", currencyCode: "GMD", currencySymbol: "D", flag: "🇬🇲" },
  { name: "Georgia", code: "GE", currencyCode: "GEL", currencySymbol: "₾", flag: "🇬🇪" },
  { name: "Germany", code: "DE", currencyCode: "EUR", currencySymbol: "€", flag: "🇩🇪" },
  { name: "Ghana", code: "GH", currencyCode: "GHS", currencySymbol: "₵", flag: "🇬🇭" },
  { name: "Greece", code: "GR", currencyCode: "EUR", currencySymbol: "€", flag: "🇬🇷" },
  { name: "Grenada", code: "GD", currencyCode: "XCD", currencySymbol: "$", flag: "🇬🇩" },
  { name: "Guatemala", code: "GT", currencyCode: "GTQ", currencySymbol: "Q", flag: "🇬🇹" },
  { name: "Guinea", code: "GN", currencyCode: "GNF", currencySymbol: "Fr", flag: "🇬🇳" },
  { name: "Guinea-Bissau", code: "GW", currencyCode: "XOF", currencySymbol: "Fr", flag: "🇬🇼" },
  { name: "Guyana", code: "GY", currencyCode: "GYD", currencySymbol: "$", flag: "🇬🇾" },

  // H
  { name: "Haiti", code: "HT", currencyCode: "HTG", currencySymbol: "G", flag: "🇭🇹" },
  { name: "Honduras", code: "HN", currencyCode: "HNL", currencySymbol: "L", flag: "🇭🇳" },
  { name: "Hong Kong", code: "HK", currencyCode: "HKD", currencySymbol: "$", flag: "🇭🇰" },
  { name: "Hungary", code: "HU", currencyCode: "HUF", currencySymbol: "Ft", flag: "🇭🇺" },

  // I
  { name: "Iceland", code: "IS", currencyCode: "ISK", currencySymbol: "kr", flag: "🇮🇸" },
  { name: "India", code: "IN", currencyCode: "INR", currencySymbol: "₹", flag: "🇮🇳" },
  { name: "Indonesia", code: "ID", currencyCode: "IDR", currencySymbol: "Rp", flag: "🇮🇩" },
  { name: "Iran", code: "IR", currencyCode: "IRR", currencySymbol: "﷼", flag: "🇮🇷" },
  { name: "Iraq", code: "IQ", currencyCode: "IQD", currencySymbol: "ع.د", flag: "🇮🇶" },
  { name: "Ireland", code: "IE", currencyCode: "EUR", currencySymbol: "€", flag: "🇮🇪" },
  { name: "Israel", code: "IL", currencyCode: "ILS", currencySymbol: "₪", flag: "🇮🇱" },
  { name: "Italy", code: "IT", currencyCode: "EUR", currencySymbol: "€", flag: "🇮🇹" },
  { name: "Ivory Coast", code: "CI", currencyCode: "XOF", currencySymbol: "Fr", flag: "🇨🇮" },

  // J
  { name: "Jamaica", code: "JM", currencyCode: "JMD", currencySymbol: "$", flag: "🇯🇲" },
  { name: "Japan", code: "JP", currencyCode: "JPY", currencySymbol: "¥", flag: "🇯🇵" },
  { name: "Jordan", code: "JO", currencyCode: "JOD", currencySymbol: "د.ا", flag: "🇯🇴" },

  // K
  { name: "Kazakhstan", code: "KZ", currencyCode: "KZT", currencySymbol: "₸", flag: "🇰🇿" },
  { name: "Kenya", code: "KE", currencyCode: "KES", currencySymbol: "KSh", flag: "🇰🇪" },
  { name: "Kiribati", code: "KI", currencyCode: "AUD", currencySymbol: "$", flag: "🇰🇮" },
  { name: "Kuwait", code: "KW", currencyCode: "KWD", currencySymbol: "د.ك", flag: "🇰🇼" },
  { name: "Kyrgyzstan", code: "KG", currencyCode: "KGS", currencySymbol: "с", flag: "🇰🇬" },

  // L
  { name: "Laos", code: "LA", currencyCode: "LAK", currencySymbol: "₭", flag: "🇱🇦" },
  { name: "Latvia", code: "LV", currencyCode: "EUR", currencySymbol: "€", flag: "🇱🇻" },
  { name: "Lebanon", code: "LB", currencyCode: "LBP", currencySymbol: "ل.ل", flag: "🇱🇧" },
  { name: "Lesotho", code: "LS", currencyCode: "LSL", currencySymbol: "L", flag: "🇱🇸" },
  { name: "Liberia", code: "LR", currencyCode: "LRD", currencySymbol: "$", flag: "🇱🇷" },
  { name: "Libya", code: "LY", currencyCode: "LYD", currencySymbol: "ل.د", flag: "🇱🇾" },
  { name: "Liechtenstein", code: "LI", currencyCode: "CHF", currencySymbol: "Fr", flag: "🇱🇮" },
  { name: "Lithuania", code: "LT", currencyCode: "EUR", currencySymbol: "€", flag: "🇱🇹" },
  { name: "Luxembourg", code: "LU", currencyCode: "EUR", currencySymbol: "€", flag: "🇱🇺" },

  // M
  { name: "Madagascar", code: "MG", currencyCode: "MGA", currencySymbol: "Ar", flag: "🇲🇬" },
  { name: "Malawi", code: "MW", currencyCode: "MWK", currencySymbol: "MK", flag: "🇲🇼" },
  { name: "Malaysia", code: "MY", currencyCode: "MYR", currencySymbol: "RM", flag: "🇲🇾" },
  { name: "Maldives", code: "MV", currencyCode: "MVR", currencySymbol: ".ރ", flag: "🇲🇻" },
  { name: "Mali", code: "ML", currencyCode: "XOF", currencySymbol: "Fr", flag: "🇲🇱" },
  { name: "Malta", code: "MT", currencyCode: "EUR", currencySymbol: "€", flag: "🇲🇹" },
  { name: "Marshall Islands", code: "MH", currencyCode: "USD", currencySymbol: "$", flag: "🇲🇭" },
  { name: "Mauritania", code: "MR", currencyCode: "MRU", currencySymbol: "UM", flag: "🇲🇷" },
  { name: "Mauritius", code: "MU", currencyCode: "MUR", currencySymbol: "₨", flag: "🇲🇺" },
  { name: "Mexico", code: "MX", currencyCode: "MXN", currencySymbol: "$", flag: "🇲🇽" },
  { name: "Micronesia", code: "FM", currencyCode: "USD", currencySymbol: "$", flag: "🇫🇲" },
  { name: "Moldova", code: "MD", currencyCode: "MDL", currencySymbol: "L", flag: "🇲🇩" },
  { name: "Monaco", code: "MC", currencyCode: "EUR", currencySymbol: "€", flag: "🇲🇨" },
  { name: "Mongolia", code: "MN", currencyCode: "MNT", currencySymbol: "₮", flag: "🇲🇳" },
  { name: "Montenegro", code: "ME", currencyCode: "EUR", currencySymbol: "€", flag: "🇲🇪" },
  { name: "Morocco", code: "MA", currencyCode: "MAD", currencySymbol: "د.م.", flag: "🇲🇦" },
  { name: "Mozambique", code: "MZ", currencyCode: "MZN", currencySymbol: "MT", flag: "🇲🇿" },
  { name: "Myanmar", code: "MM", currencyCode: "MMK", currencySymbol: "Ks", flag: "🇲🇲" },

  // N
  { name: "Namibia", code: "NA", currencyCode: "NAD", currencySymbol: "$", flag: "🇳🇦" },
  { name: "Nauru", code: "NR", currencyCode: "AUD", currencySymbol: "$", flag: "🇳🇷" },
  { name: "Nepal", code: "NP", currencyCode: "NPR", currencySymbol: "₨", flag: "🇳🇵" },
  { name: "Netherlands", code: "NL", currencyCode: "EUR", currencySymbol: "€", flag: "🇳🇱" },
  { name: "New Zealand", code: "NZ", currencyCode: "NZD", currencySymbol: "$", flag: "🇳🇿" },
  { name: "Nicaragua", code: "NI", currencyCode: "NIO", currencySymbol: "C$", flag: "🇳🇮" },
  { name: "Niger", code: "NE", currencyCode: "XOF", currencySymbol: "Fr", flag: "🇳🇪" },
  { name: "Nigeria", code: "NG", currencyCode: "NGN", currencySymbol: "₦", flag: "🇳🇬" },
  { name: "North Korea", code: "KP", currencyCode: "KPW", currencySymbol: "₩", flag: "🇰🇵" },
  { name: "North Macedonia", code: "MK", currencyCode: "MKD", currencySymbol: "ден", flag: "🇲🇰" },
  { name: "Norway", code: "NO", currencyCode: "NOK", currencySymbol: "kr", flag: "🇳🇴" },

  // O
  { name: "Oman", code: "OM", currencyCode: "OMR", currencySymbol: "ر.ع.", flag: "🇴🇲" },

  // P
  { name: "Pakistan", code: "PK", currencyCode: "PKR", currencySymbol: "₨", flag: "🇵🇰" },
  { name: "Palau", code: "PW", currencyCode: "USD", currencySymbol: "$", flag: "🇵🇼" },
  { name: "Panama", code: "PA", currencyCode: "PAB", currencySymbol: "B/.", flag: "🇵🇦" },
  { name: "Papua New Guinea", code: "PG", currencyCode: "PGK", currencySymbol: "K", flag: "🇵🇬" },
  { name: "Paraguay", code: "PY", currencyCode: "PYG", currencySymbol: "₲", flag: "🇵🇾" },
  { name: "Peru", code: "PE", currencyCode: "PEN", currencySymbol: "S/", flag: "🇵🇪" },
  { name: "Philippines", code: "PH", currencyCode: "PHP", currencySymbol: "₱", flag: "🇵🇭" },
  { name: "Poland", code: "PL", currencyCode: "PLN", currencySymbol: "zł", flag: "🇵🇱" },
  { name: "Portugal", code: "PT", currencyCode: "EUR", currencySymbol: "€", flag: "🇵🇹" },

  // Q
  { name: "Qatar", code: "QA", currencyCode: "QAR", currencySymbol: "ر.ق", flag: "🇶🇦" },

  // R
  { name: "Romania", code: "RO", currencyCode: "RON", currencySymbol: "lei", flag: "🇷🇴" },
  { name: "Russia", code: "RU", currencyCode: "RUB", currencySymbol: "₽", flag: "🇷🇺" },
  { name: "Rwanda", code: "RW", currencyCode: "RWF", currencySymbol: "Fr", flag: "🇷🇼" },

  // S
  { name: "Saint Kitts and Nevis", code: "KN", currencyCode: "XCD", currencySymbol: "$", flag: "🇰🇳" },
  { name: "Saint Lucia", code: "LC", currencyCode: "XCD", currencySymbol: "$", flag: "🇱🇨" },
  { name: "Saint Vincent and the Grenadines", code: "VC", currencyCode: "XCD", currencySymbol: "$", flag: "🇻🇨" },
  { name: "Samoa", code: "WS", currencyCode: "WST", currencySymbol: "$", flag: "🇼🇸" },
  { name: "San Marino", code: "SM", currencyCode: "EUR", currencySymbol: "€", flag: "🇸🇲" },
  { name: "Sao Tome and Principe", code: "ST", currencyCode: "STN", currencySymbol: "Db", flag: "🇸🇹" },
  { name: "Saudi Arabia", code: "SA", currencyCode: "SAR", currencySymbol: "ر.س", flag: "🇸🇦" },
  { name: "Senegal", code: "SN", currencyCode: "XOF", currencySymbol: "Fr", flag: "🇸🇳" },
  { name: "Serbia", code: "RS", currencyCode: "RSD", currencySymbol: "дин", flag: "🇷🇸" },
  { name: "Seychelles", code: "SC", currencyCode: "SCR", currencySymbol: "₨", flag: "🇸🇨" },
  { name: "Sierra Leone", code: "SL", currencyCode: "SLL", currencySymbol: "Le", flag: "🇸🇱" },
  { name: "Singapore", code: "SG", currencyCode: "SGD", currencySymbol: "$", flag: "🇸🇬" },
  { name: "Slovakia", code: "SK", currencyCode: "EUR", currencySymbol: "€", flag: "🇸🇰" },
  { name: "Slovenia", code: "SI", currencyCode: "EUR", currencySymbol: "€", flag: "🇸🇮" },
  { name: "Solomon Islands", code: "SB", currencyCode: "SBD", currencySymbol: "$", flag: "🇸🇧" },
  { name: "Somalia", code: "SO", currencyCode: "SOS", currencySymbol: "Sh", flag: "🇸🇴" },
  { name: "South Africa", code: "ZA", currencyCode: "ZAR", currencySymbol: "R", flag: "🇿🇦" },
  { name: "South Korea", code: "KR", currencyCode: "KRW", currencySymbol: "₩", flag: "🇰🇷" },
  { name: "South Sudan", code: "SS", currencyCode: "SSP", currencySymbol: "£", flag: "🇸🇸" },
  { name: "Spain", code: "ES", currencyCode: "EUR", currencySymbol: "€", flag: "🇪🇸" },
  { name: "Sri Lanka", code: "LK", currencyCode: "LKR", currencySymbol: "Rs", flag: "🇱🇰" },
  { name: "Sudan", code: "SD", currencyCode: "SDG", currencySymbol: "ج.س.", flag: "🇸🇩" },
  { name: "Suriname", code: "SR", currencyCode: "SRD", currencySymbol: "$", flag: "🇸🇷" },
  { name: "Sweden", code: "SE", currencyCode: "SEK", currencySymbol: "kr", flag: "🇸🇪" },
  { name: "Switzerland", code: "CH", currencyCode: "CHF", currencySymbol: "Fr", flag: "🇨🇭" },
  { name: "Syria", code: "SY", currencyCode: "SYP", currencySymbol: "£", flag: "🇸🇾" },

  // T
  { name: "Taiwan", code: "TW", currencyCode: "TWD", currencySymbol: "$", flag: "🇹🇼" },
  { name: "Tajikistan", code: "TJ", currencyCode: "TJS", currencySymbol: "ЅМ", flag: "🇹🇯" },
  { name: "Tanzania", code: "TZ", currencyCode: "TZS", currencySymbol: "Sh", flag: "🇹🇿" },
  { name: "Thailand", code: "TH", currencyCode: "THB", currencySymbol: "฿", flag: "🇹🇭" },
  { name: "Timor-Leste", code: "TL", currencyCode: "USD", currencySymbol: "$", flag: "🇹🇱" },
  { name: "Togo", code: "TG", currencyCode: "XOF", currencySymbol: "Fr", flag: "🇹🇬" },
  { name: "Tonga", code: "TO", currencyCode: "TOP", currencySymbol: "T$", flag: "🇹🇴" },
  { name: "Trinidad and Tobago", code: "TT", currencyCode: "TTD", currencySymbol: "$", flag: "🇹🇹" },
  { name: "Tunisia", code: "TN", currencyCode: "TND", currencySymbol: "د.ت", flag: "🇹🇳" },
  { name: "Turkey", code: "TR", currencyCode: "TRY", currencySymbol: "₺", flag: "🇹🇷" },
  { name: "Turkmenistan", code: "TM", currencyCode: "TMT", currencySymbol: "m", flag: "🇹🇲" },
  { name: "Tuvalu", code: "TV", currencyCode: "AUD", currencySymbol: "$", flag: "🇹🇻" },

  // U
  { name: "Uganda", code: "UG", currencyCode: "UGX", currencySymbol: "Sh", flag: "🇺🇬" },
  { name: "Ukraine", code: "UA", currencyCode: "UAH", currencySymbol: "₴", flag: "🇺🇦" },
  { name: "United Arab Emirates", code: "AE", currencyCode: "AED", currencySymbol: "د.إ", flag: "🇦🇪" },
  { name: "United Kingdom", code: "GB", currencyCode: "GBP", currencySymbol: "£", flag: "🇬🇧" },
  { name: "United States", code: "US", currencyCode: "USD", currencySymbol: "$", flag: "🇺🇸" },
  { name: "Uruguay", code: "UY", currencyCode: "UYU", currencySymbol: "$", flag: "🇺🇾" },
  { name: "Uzbekistan", code: "UZ", currencyCode: "UZS", currencySymbol: "so'm", flag: "🇺🇿" },

  // V
  { name: "Vanuatu", code: "VU", currencyCode: "VUV", currencySymbol: "Vt", flag: "🇻🇺" },
  { name: "Vatican City", code: "VA", currencyCode: "EUR", currencySymbol: "€", flag: "🇻🇦" },
  { name: "Venezuela", code: "VE", currencyCode: "VES", currencySymbol: "Bs.S", flag: "🇻🇪" },
  { name: "Vietnam", code: "VN", currencyCode: "VND", currencySymbol: "₫", flag: "🇻🇳" },

  // Y
  { name: "Yemen", code: "YE", currencyCode: "YER", currencySymbol: "﷼", flag: "🇾🇪" },

  // Z
  { name: "Zambia", code: "ZM", currencyCode: "ZMW", currencySymbol: "ZK", flag: "🇿🇲" },
  { name: "Zimbabwe", code: "ZW", currencyCode: "ZWL", currencySymbol: "$", flag: "🇿🇼" },
];

// Popular countries for quick access (same as before but using WORLD_COUNTRIES)
export const POPULAR_COUNTRIES = [
  "US", "CA", "GB", "IN", "AU", "SG", "MY", "NZ", "IE", "AE", 
  "ZA", "FR", "DE", "ES", "IT", "NL", "JP", "KR", "CN", "HK"
].map(code => WORLD_COUNTRIES.find(c => c.code === code)!).filter(Boolean); 