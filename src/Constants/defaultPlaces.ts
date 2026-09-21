/**
 * Curated list of 100% verified, official Google Street View car-mapped street roads.
 * Each location has been explicitly tested against the Google Maps StreetViewService API:
 * - Verified status: OK
 * - Official Google Car imagery: (data.copyright includes 'Google')
 * - Navigable road coverage: (data.links.length > 0)
 * - Pano ID pre-indexed to eliminate third-party user photospheres and black screens
 * - 36 distinct countries worldwide to guarantee rich and varied gameplay
 */
export const DEFAULT_PLACES: Place[] = [
  {
    // Avenue des Champs-Élysées / Grand Palais, Paris, France
    location: { lat: 48.86693, lng: 2.31274 },
    country: "France",
    pano: "A6YVYTxyEXoAAAQqh3F00A",
  },
  {
    // 5th Ave / 42nd St, New York, United States
    location: { lat: 40.75359, lng: -73.98346 },
    country: "United States",
    pano: "on1mUqUyKe_C2Zd5_U-ciw",
  },
  {
    // Ginza / Chuo Dori, Tokyo, Japan
    location: { lat: 35.67176, lng: 139.76212 },
    country: "Japan",
    pano: "-WeKFIWKY4PTt5YU1Az71w",
  },
  {
    // The Mall / Buckingham Palace approach, London, United Kingdom
    location: { lat: 51.50273, lng: -0.14030 },
    country: "United Kingdom",
    pano: "_LC4N0M0lR5G4UKh-mCpXw",
  },
  {
    // Via dei Fori Imperiali / Colosseum approach, Rome, Italy
    location: { lat: 41.89973, lng: 12.48710 },
    country: "Italy",
    pano: "HeWBiFSuSN8AAARJXuKFdw",
  },
  {
    // Flinders St / Exhibition St, Melbourne, Australia
    location: { lat: -37.81780, lng: 144.97320 },
    country: "Australia",
    pano: "LcS54vrGjwoOQC94q9oyjg",
  },
  {
    // CST / Kurla Arterial, Mumbai, India
    location: { lat: 19.07713, lng: 72.88188 },
    country: "India",
    pano: "UvAHtz-eImcY6GWhZMtzmA",
  },
  {
    // Parque Ibirapuera / Av. Pedro Álvares Cabral, São Paulo, Brazil
    location: { lat: -23.58829, lng: -46.65418 },
    country: "Brazil",
    pano: "eMDcpo-UFUl-XYqgJs7xbg",
  },
  {
    // Speicherstadt / Am Sandtorkai, Hamburg, Germany
    location: { lat: 53.54383, lng: 9.98873 },
    country: "Germany",
    pano: "Xzrtbw5K9c0AAAQvOY4t7A",
  },
  {
    // Paseo de la Castellana, Madrid, Spain
    location: { lat: 40.45186, lng: -3.69200 },
    country: "Spain",
    pano: "i6UmjDdqJWR8rJDIjnKdDw",
  },
  {
    // Gardiner Expressway / Lake Shore Blvd, Toronto, Canada
    location: { lat: 43.63815, lng: -79.38848 },
    country: "Canada",
    pano: "tvAnfvONOvOSFl1RRMx4Mw",
  },
  {
    // Buitengracht St / Bo-Kaap route, Cape Town, South Africa
    location: { lat: -33.92609, lng: 18.42659 },
    country: "South Africa",
    pano: "5oiquoxegk_oxQQgxyOHIA",
  },
  {
    // Raffles Avenue / Marina Bay, Singapore
    location: { lat: 1.29030, lng: 103.85870 },
    country: "Singapore",
    pano: "FKHBf5WnBr88K24aPHkx0A",
  },
  {
    // Sejong-daero, Seoul, South Korea
    location: { lat: 37.57180, lng: 126.97690 },
    country: "South Korea",
    pano: "peDA6sAczyEAAAQINlCqMw",
  },
  {
    // Av. Niños Héroes / Calz. Independencia, Guadalajara, Mexico
    location: { lat: 20.66216, lng: -103.35343 },
    country: "Mexico",
    pano: "7en79Udmke0bAxK3l0Sp5g",
  },
  {
    // Damrak / Canal Ring, Amsterdam, Netherlands
    location: { lat: 52.37520, lng: 4.89760 },
    country: "Netherlands",
    pano: "09_EIYg_Pyr36iHLiP9xxg",
  },
  {
    // Avenida 9 de Julio / Obelisco, Buenos Aires, Argentina
    location: { lat: -34.60370, lng: -58.38160 },
    country: "Argentina",
    pano: "0n4IGy6Bd7zcVNEJP5xY7A",
  },
  {
    // Al Khaleej St / Deira Waterfront, Dubai, United Arab Emirates
    location: { lat: 25.27680, lng: 55.29882 },
    country: "United Arab Emirates",
    pano: "MkZU4dHjQHXM4dw9EWCBXg",
  },
  {
    // Karl Johans gate, Oslo, Norway
    location: { lat: 59.91390, lng: 10.73880 },
    country: "Norway",
    pano: "UNgZBgJZc_7u4HH1qynJYQ",
  },
  {
    // A1 National Thoroughfare, Switzerland
    location: { lat: 47.28579, lng: 7.74858 },
    country: "Switzerland",
    pano: "pV376NR_vdal0eBKlO8SRA",
  },
  {
    // Avenida da Liberdade, Lisbon, Portugal
    location: { lat: 38.72050, lng: -9.14650 },
    country: "Portugal",
    pano: "2OYaNp-dkIERvMJjbtT2hw",
  },
  {
    // Kungsgatan, Stockholm, Sweden
    location: { lat: 59.33610, lng: 18.06830 },
    country: "Sweden",
    pano: "nJvlV5W1JQuYnwkSBowh7Q",
  },
  {
    // Aleje Jerozolimskie, Warsaw, Poland (Official Google Car coverage, replacing user photospheres)
    location: { lat: 52.23050, lng: 21.00248 },
    country: "Poland",
    pano: "JC8D1seLsE80DRZokIDWKw",
  },
  {
    // O'Connell Street, Dublin, Ireland
    location: { lat: 53.34980, lng: -6.26030 },
    country: "Ireland",
    pano: "ME2Ig9_jQG8XdDTkK2_f5Q",
  },
  {
    // Nádražní, Brno, Czech Republic
    location: { lat: 49.19408, lng: 16.59879 },
    country: "Czech Republic",
    pano: "oVpnxH9Q-nEY7E-jjETk7Q",
  },
  {
    // Wiener Außenring / Airport Arterial, Vienna, Austria
    location: { lat: 48.10343, lng: 16.56949 },
    country: "Austria",
    pano: "oT5zMnSM8hfcuKIeJksBeg",
  },
  {
    // Binnensingel, Antwerp, Belgium
    location: { lat: 51.19647, lng: 4.43701 },
    country: "Belgium",
    pano: "etmBbVKHitJjJwOUHPfLFg",
  },
  {
    // Marselis Boulevard, Aarhus, Denmark
    location: { lat: 56.15451, lng: 10.20682 },
    country: "Denmark",
    pano: "bFqNIVTLnhN-7ZrwjHYaJg",
  },
  {
    // Uudenmaantie, Turku, Finland
    location: { lat: 60.44748, lng: 22.26711 },
    country: "Finland",
    pano: "DJjpP3FeSTfzZBZMBwqc7w",
  },
  {
    // Bajcsy-Zsilinszky út, Budapest, Hungary
    location: { lat: 47.50079, lng: 19.05219 },
    country: "Hungary",
    pano: "bV8lGpIwn2bp5xCeIGZsVA",
  },
  {
    // Customhouse Quay / Jervois Quay, Wellington, New Zealand
    location: { lat: -41.28931, lng: 174.77924 },
    country: "New Zealand",
    pano: "h7T0VaIMJCgkyYihnXHDIg",
  },
  {
    // Taiwan Boulevard, Taichung, Taiwan
    location: { lat: 24.14894, lng: 120.66465 },
    country: "Taiwan",
    pano: "vlZE6fTpKpOx6z3sloCWLg",
  },
  {
    // Jalan Tun Sambanthan, Kuala Lumpur, Malaysia
    location: { lat: 3.13934, lng: 101.68912 },
    country: "Malaysia",
    pano: "7aaUpjF8sleY8mu8R5cNCA",
  },
  {
    // Avenida Libertador Bernardo O'Higgins, Santiago, Chile
    location: { lat: -33.44394, lng: -70.65424 },
    country: "Chile",
    pano: "pOCucZ60fYZNj1w4G_zIFg",
  },
  {
    // Carrera 10 / Av. Jiménez, Bogotá, Colombia
    location: { lat: 4.60967, lng: -74.08342 },
    country: "Colombia",
    pano: "jyVa73WUPoVthDQA4hYXVw",
  },
  {
    // Konyaaltı Caddesi, Antalya, Turkey
    location: { lat: 36.88935, lng: 30.70792 },
    country: "Turkey",
    pano: "POIV2pZGwkfl8hAec3IF4g",
  },
];

export interface LeaderboardEntry {
  username: string;
  highScore: number;
}

/**
 * Default leaderboard entries start clean and empty.
 * Populated dynamically with verified gameplay scores.
 */
export const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [];
