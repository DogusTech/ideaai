/**
 * Mock hub seed data — NOT live user data.
 * All check-in samples are illustrative. Labels clearly mark demo status.
 *
 * placeId values below are placeholder strings.
 * Replace with real Google Places place_id values before going live.
 */
import type { TogetlinkHub } from "./types"

export const MOCK_HUBS: TogetlinkHub[] = [
  // ─────────────────────────────── TURKEY — ISTANBUL ───────────────────────────
  {
    id: "kolektif-levent",
    placeId: "ChIJ_placeholder_kolektif_levent",
    slug: "kolektif-house-levent",
    name: "Kolektif House Levent",
    city: "Istanbul",
    country: "TR",
    category: "coworking",
    formattedAddress: "Büyükdere Cd. No:185, 34394 Şişli/İstanbul, Turkey",
    googleMapsUri: "https://maps.google.com/?cid=placeholder",
    location: { lat: 41.0788, lng: 29.0151 },
    rating: 4.7,
    userRatingCount: 312,
    currentIntentSummary: "Founders shipping MVPs and designers reviewing flows",
    checkedInCount: 14,
    broadAreas: ["Main coworking floor", "Phone booths", "Lounge terrace"],
    isDemo: true,
    description:
      "A flagship coworking space in Levent's financial district. Kolektif House attracts Istanbul's startup and tech community for focused work, community events, and impromptu founder meetings.",
    guide: {
      title: "Networking at Kolektif House Levent",
      body: "Kolektif House Levent sits at the heart of Istanbul's tech corridor. The main floor hums with engineers and product managers from startups and scale-ups. The lounge terrace is the informal meeting point after 15:00. Morning hours before 10:00 are quieter — ideal for deep work. Community events happen weekly; check the bulletin boards near the reception.",
      publishedAt: "2026-06-01",
    },
    demoPresence: [
      {
        displayName: "Emre K.",
        role: "Founder",
        broadArea: "Main coworking floor",
        workIntent: "Working on Firebase schema design",
        collaborationInterest: "Open to discussing backend architecture",
        visualClue: "Navy hoodie, silver laptop",
        availability: "Available until 18:00",
        isLive: false,
      },
      {
        displayName: "Selin A.",
        role: "Product Designer",
        broadArea: "Lounge terrace",
        workIntent: "Reviewing onboarding flows for a SaaS product",
        collaborationInterest: "Happy to chat about UX research methods",
        availability: "Available until 17:30",
        isLive: false,
      },
    ],
  },
  {
    id: "workinton-levent",
    placeId: "ChIJ_placeholder_workinton_levent",
    slug: "workinton-levent",
    name: "Workinton Levent",
    city: "Istanbul",
    country: "TR",
    category: "coworking",
    formattedAddress: "Büyükdere Cd. No:237, 34398 Sarıyer/İstanbul, Turkey",
    googleMapsUri: "https://maps.google.com/?cid=placeholder",
    location: { lat: 41.0855, lng: 29.0127 },
    rating: 4.5,
    userRatingCount: 189,
    currentIntentSummary: "Remote teams and solo freelancers in focused sprint mode",
    checkedInCount: 9,
    broadAreas: ["Open desks", "Meeting rooms corridor", "Café corner"],
    isDemo: true,
    description:
      "Workinton Levent is a flexible coworking space offering hot desks, private offices, and meeting rooms for Istanbul's growing remote and freelance community.",
    guide: {
      title: "Working from Workinton Levent",
      body: "Workinton's Levent location is popular with remote employees of international companies and local freelancers who want a professional address. The café corner is a natural conversation starter. Meeting rooms are bookable by the hour and well-equipped for client calls.",
      publishedAt: "2026-05-15",
    },
    demoPresence: [
      {
        displayName: "Ahmet D.",
        role: "Software Engineer",
        broadArea: "Open desks",
        workIntent: "Open to discussing Next.js architecture patterns",
        collaborationInterest: "Looking to connect with other engineers",
        availability: "Available until 17:00",
        isLive: false,
      },
    ],
  },
  {
    id: "atolye-istanbul",
    placeId: "ChIJ_placeholder_atolye_istanbul",
    slug: "atolye-istanbul",
    name: "Atölye Istanbul",
    city: "Istanbul",
    country: "TR",
    category: "startup_hub",
    formattedAddress: "Bomontiada, Birahane Sk. No:1, 34373 Şişli/İstanbul, Turkey",
    location: { lat: 41.0614, lng: 28.9894 },
    rating: 4.8,
    userRatingCount: 224,
    currentIntentSummary: "Creative technologists, researchers, and makers at work",
    checkedInCount: 11,
    broadAreas: ["Maker studio", "Research lab", "Collaboration lounge"],
    isDemo: true,
    description:
      "Atölye Istanbul is a pioneering innovation hub focused on responsible innovation. Set inside the historic Bomontiada complex, it brings together technologists, designers, and researchers.",
    demoPresence: [
      {
        displayName: "Zeynep M.",
        role: "Design Researcher",
        broadArea: "Research lab",
        workIntent: "Conducting user interviews for a civic tech project",
        collaborationInterest: "Interested in design ethics discussions",
        availability: "Available until 16:00",
        isLive: false,
      },
    ],
  },
  {
    id: "salt-galata",
    placeId: "ChIJ_placeholder_salt_galata",
    slug: "salt-galata",
    name: "SALT Galata",
    city: "Istanbul",
    country: "TR",
    category: "library",
    formattedAddress: "Bankalar Cd. No:11, 34420 Beyoğlu/İstanbul, Turkey",
    location: { lat: 41.0255, lng: 28.9742 },
    rating: 4.6,
    userRatingCount: 415,
    currentIntentSummary: "Researchers and creatives in a historic banking hall",
    checkedInCount: 6,
    broadAreas: ["Reading room", "Exhibition floor", "Research centre"],
    isDemo: true,
    description:
      "SALT Galata is a cultural institution housed in a landmark Ottoman-era bank building. Its research library and reading rooms attract architects, academics, and curious creatives.",
    demoPresence: [
      {
        displayName: "Can T.",
        role: "Architect",
        broadArea: "Reading room",
        workIntent: "Researching Ottoman architectural heritage",
        collaborationInterest: "Open to meeting other creatives",
        availability: "Available until 17:30",
        isLive: false,
      },
    ],
  },
  {
    id: "macka-demokrasi-parki",
    placeId: "ChIJ_placeholder_macka_park",
    slug: "macka-demokrasi-parki",
    name: "Maçka Demokrasi Parkı",
    city: "Istanbul",
    country: "TR",
    category: "park",
    formattedAddress: "Teşvikiye, 34367 Şişli/İstanbul, Turkey",
    location: { lat: 41.0476, lng: 28.9978 },
    currentIntentSummary: "Outdoor work sessions and casual professional catch-ups",
    checkedInCount: 4,
    broadAreas: ["Upper terrace", "Shaded benches", "Café kiosk area"],
    isDemo: true,
    description:
      "A beloved green space in the heart of Şişli. On warm days, professionals from the nearby financial district use the park benches and café kiosk for outdoor work and informal meetings.",
    demoPresence: [
      {
        displayName: "Lale B.",
        role: "Student Founder",
        broadArea: "Upper terrace",
        workIntent: "Preparing a pitch deck",
        collaborationInterest: "Looking for feedback on startup ideas",
        availability: "Available until 15:00",
        isLive: false,
      },
    ],
  },
  // ─────────────────────────────── TURKEY — ANKARA ────────────────────────────
  {
    id: "cozone-ankara",
    placeId: "ChIJ_placeholder_cozone_ankara",
    slug: "cozone-ankara",
    name: "CoZone",
    city: "Ankara",
    country: "TR",
    category: "coworking",
    formattedAddress: "Çankaya, Ankara, Turkey",
    location: { lat: 39.9205, lng: 32.8544 },
    rating: 4.4,
    userRatingCount: 98,
    currentIntentSummary: "Government-adjacent professionals and policy researchers",
    checkedInCount: 7,
    broadAreas: ["Open floor", "Quiet booths", "Events space"],
    isDemo: true,
    description:
      "CoZone is Ankara's community-driven coworking space, popular with policy researchers, NGO workers, and young entrepreneurs operating near the capital's administrative center.",
    demoPresence: [
      {
        displayName: "Mert Y.",
        role: "Policy Researcher",
        broadArea: "Quiet booths",
        workIntent: "Drafting a policy brief on digital governance",
        collaborationInterest: "Open to research collaboration",
        availability: "Available until 18:00",
        isLive: false,
      },
    ],
  },
  {
    id: "odtu-teknokent-ankara",
    placeId: "ChIJ_placeholder_odtu_teknokent",
    slug: "odtu-teknokent",
    name: "ODTÜ Teknokent",
    city: "Ankara",
    country: "TR",
    category: "university_hub",
    formattedAddress: "ODTÜ Yerleşkesi, 06800 Çankaya/Ankara, Turkey",
    location: { lat: 39.8869, lng: 32.7775 },
    rating: 4.7,
    userRatingCount: 276,
    currentIntentSummary: "Deep-tech founders and R&D engineers at one of Turkey's top technoparks",
    checkedInCount: 22,
    broadAreas: ["Incubation zone", "Lab corridor", "Outdoor meeting plaza"],
    isDemo: true,
    description:
      "ODTÜ Teknokent is Turkey's leading university technopark, hosting over 1,000 R&D companies and startups on the METU campus. It is the epicenter of deep-tech innovation in Ankara.",
    guide: {
      title: "Networking at ODTÜ Teknokent",
      body: "ODTÜ Teknokent attracts hardware engineers, AI researchers, and defense-tech founders. The outdoor meeting plaza near the main gate is a popular informal networking spot. Many resident companies welcome unplanned coffee meetings during lunch hours.",
      publishedAt: "2026-04-20",
    },
    demoPresence: [
      {
        displayName: "Furkan A.",
        role: "ML Engineer",
        broadArea: "Lab corridor",
        workIntent: "Training a computer vision model",
        collaborationInterest: "Interested in discussing edge ML deployment",
        availability: "Available until 17:00",
        isLive: false,
      },
      {
        displayName: "Buse K.",
        role: "Startup Founder",
        broadArea: "Incubation zone",
        workIntent: "Meeting with mentors about Series A preparation",
        collaborationInterest: "Looking for a technical co-founder",
        availability: "Available from 14:00",
        isLive: false,
      },
    ],
  },
  {
    id: "kugulu-park-ankara",
    placeId: "ChIJ_placeholder_kugulu_park",
    slug: "kugulu-parki",
    name: "Kuğulu Parkı",
    city: "Ankara",
    country: "TR",
    category: "park",
    formattedAddress: "Kavaklıdere, Ankara, Turkey",
    location: { lat: 39.9055, lng: 32.8621 },
    currentIntentSummary: "Casual outdoor meetings and after-work catch-ups",
    checkedInCount: 3,
    broadAreas: ["Lake benches", "Café pavilion", "East garden"],
    isDemo: true,
    description:
      "Kuğulu Parkı is a beloved Ankara landmark. Professionals from the nearby embassy district and financial firms meet here for informal outdoor conversations.",
  },
  // ─────────────────────────────── TURKEY — IZMIR ─────────────────────────────
  {
    id: "originn-izmir",
    placeId: "ChIJ_placeholder_originn_izmir",
    slug: "originn-coworking",
    name: "Originn Coworking",
    city: "Izmir",
    country: "TR",
    category: "coworking",
    formattedAddress: "Alsancak, 35220 Konak/İzmir, Turkey",
    location: { lat: 38.4368, lng: 27.1431 },
    rating: 4.5,
    userRatingCount: 87,
    currentIntentSummary: "Izmir's tech founders and digital nomads",
    checkedInCount: 8,
    broadAreas: ["Open desks", "Phone zone", "Rooftop terrace"],
    isDemo: true,
    description:
      "Originn is Izmir's community coworking space, connecting the city's growing startup ecosystem. The rooftop terrace offers views of the Aegean coast.",
    demoPresence: [
      {
        displayName: "Taylan S.",
        role: "Full-Stack Developer",
        broadArea: "Open desks",
        workIntent: "Building a SaaS MVP",
        collaborationInterest: "Looking for a business co-founder",
        availability: "Available until 18:30",
        isLive: false,
      },
    ],
  },
  {
    id: "kulturpark-izmir",
    placeId: "ChIJ_placeholder_kulturpark_izmir",
    slug: "kulturpark-izmir",
    name: "Kültürpark",
    city: "Izmir",
    country: "TR",
    category: "park",
    formattedAddress: "Alsancak, 35220 Konak/İzmir, Turkey",
    location: { lat: 38.4405, lng: 27.1329 },
    currentIntentSummary: "Outdoor work and creative professionals enjoying the park",
    checkedInCount: 5,
    broadAreas: ["Central plaza", "Shaded walkway", "Open-air café"],
    isDemo: true,
    description:
      "Kültürpark is Izmir's historic exhibition park and green lung. It hosts trade fairs and is a popular spot for professionals who mix outdoor time with light work.",
  },
  // ─────────────────────────────── TURKEY — ANTALYA ───────────────────────────
  {
    id: "coworking-antalya",
    placeId: "ChIJ_placeholder_coworking_antalya",
    slug: "antalya-coworking-hub",
    name: "Antalya Coworking Hub",
    city: "Antalya",
    country: "TR",
    category: "coworking",
    formattedAddress: "Muratpaşa, Antalya, Turkey",
    location: { lat: 36.8969, lng: 30.7133 },
    currentIntentSummary: "Tourism-tech startups and remote workers by the coast",
    checkedInCount: 5,
    broadAreas: ["Main floor", "Terrace desks", "Meeting room"],
    isDemo: true,
    description:
      "A coworking placeholder for Antalya's growing digital nomad and tourism-tech community.",
  },
  // ─────────────────────────────── USA — SAN FRANCISCO ────────────────────────
  {
    id: "canopy-jackson-square",
    placeId: "ChIJ_placeholder_canopy_sf",
    slug: "canopy-jackson-square",
    name: "Canopy Jackson Square",
    city: "San Francisco",
    country: "US",
    category: "coworking",
    formattedAddress: "732 Montgomery St, San Francisco, CA 94111",
    location: { lat: 37.7976, lng: -122.4028 },
    rating: 4.8,
    userRatingCount: 203,
    currentIntentSummary: "Seed-stage founders and angels in an intimate setting",
    checkedInCount: 12,
    broadAreas: ["Main floor", "Library lounge", "Private offices corridor"],
    isDemo: true,
    description:
      "Canopy Jackson Square is an intimate members-only coworking space in the heart of San Francisco's historic Jackson Square. It attracts seed-stage founders, VCs, and early-stage teams.",
    guide: {
      title: "Building at Canopy Jackson Square",
      body: "Canopy has a curated membership that skews heavily toward pre-Series A founders and their early hires. The library lounge is a natural spot for investor updates and informal co-founder conversations. The space runs a regular founders' dinner that is well worth attending.",
      publishedAt: "2026-05-10",
    },
    demoPresence: [
      {
        displayName: "Priya N.",
        role: "Founder",
        broadArea: "Library lounge",
        workIntent: "Preparing investor deck for Series A",
        collaborationInterest: "Open to introductions to growth advisors",
        availability: "Available until 17:00",
        isLive: false,
      },
      {
        displayName: "Marcus L.",
        role: "Software Engineer",
        broadArea: "Main floor",
        workIntent: "Open to discussing Next.js architecture",
        collaborationInterest: "Interested in infrastructure conversations",
        availability: "Available until 18:00",
        isLive: false,
      },
    ],
  },
  {
    id: "salesforce-park-sf",
    placeId: "ChIJ_placeholder_salesforce_park",
    slug: "salesforce-park",
    name: "Salesforce Park",
    city: "San Francisco",
    country: "US",
    category: "park",
    formattedAddress: "425 Mission St, San Francisco, CA 94105",
    location: { lat: 37.7893, lng: -122.3963 },
    rating: 4.6,
    userRatingCount: 1820,
    currentIntentSummary: "SoMa professionals taking rooftop outdoor work breaks",
    checkedInCount: 18,
    broadAreas: ["East lawn", "Amphitheater steps", "West grove"],
    isDemo: true,
    description:
      "An elevated rooftop park above the Transbay Transit Center. A favourite lunch and outdoor-work destination for SoMa's dense concentration of tech and finance professionals.",
    demoPresence: [
      {
        displayName: "Jordan T.",
        role: "Product Manager",
        broadArea: "East lawn",
        workIntent: "Reading product strategy documents",
        collaborationInterest: "Open to casual networking",
        availability: "Available until 13:30",
        isLive: false,
      },
    ],
  },
  // ─────────────────────────────── USA — NEW YORK ──────────────────────────────
  {
    id: "the-farm-soho",
    placeId: "ChIJ_placeholder_farm_soho",
    slug: "the-farm-soho",
    name: "The Farm SoHo",
    city: "New York",
    country: "US",
    category: "coworking",
    formattedAddress: "447 Broadway, 2nd Floor, New York, NY 10013",
    location: { lat: 40.7195, lng: -74.0017 },
    rating: 4.6,
    userRatingCount: 342,
    currentIntentSummary: "NYC creators, marketers, and early-stage founders",
    checkedInCount: 15,
    broadAreas: ["Open coworking", "Phone booths", "Event loft"],
    isDemo: true,
    description:
      "The Farm SoHo is a creative coworking space in the heart of SoHo. It attracts a diverse mix of designers, marketers, consultants, and tech founders.",
    guide: {
      title: "Networking at The Farm SoHo",
      body: "The Farm SoHo has a lively community energy. The event loft hosts regular networking nights, workshops, and pitch events. The open coworking floor is a natural place to start a conversation — just look for someone working on something interesting.",
      publishedAt: "2026-03-22",
    },
    demoPresence: [
      {
        displayName: "Aaliyah W.",
        role: "UX Designer",
        broadArea: "Open coworking",
        workIntent: "Reviewing onboarding flows",
        collaborationInterest: "Looking to discuss design systems",
        visualClue: "Red tote bag, large monitor",
        availability: "Available until 17:00",
        isLive: false,
      },
    ],
  },
  {
    id: "bryant-park-ny",
    placeId: "ChIJ_placeholder_bryant_park",
    slug: "bryant-park",
    name: "Bryant Park",
    city: "New York",
    country: "US",
    category: "park",
    formattedAddress: "42nd St & 6th Ave, New York, NY 10036",
    location: { lat: 40.7536, lng: -73.9832 },
    rating: 4.8,
    userRatingCount: 12400,
    currentIntentSummary: "Midtown professionals enjoying outdoor work and lunch meetings",
    checkedInCount: 30,
    broadAreas: ["Main lawn", "Reading room terrace", "Southwest café"],
    isDemo: true,
    description:
      "Bryant Park is Midtown Manhattan's beloved outdoor room. Its lawn, tables, and café terraces are year-round meeting spots for professionals from the surrounding media, tech, and finance district.",
    demoPresence: [
      {
        displayName: "Sam R.",
        role: "Journalist",
        broadArea: "Main lawn",
        workIntent: "Writing a feature on urban professional culture",
        collaborationInterest: "Happy to talk about media and tech",
        availability: "Available until 14:00",
        isLive: false,
      },
    ],
  },
  // ─────────────────────────────── USA — BOSTON/CAMBRIDGE ─────────────────────
  {
    id: "cic-cambridge",
    placeId: "ChIJ_placeholder_cic_cambridge",
    slug: "cic-cambridge",
    name: "CIC Cambridge",
    city: "Cambridge",
    country: "US",
    category: "startup_hub",
    formattedAddress: "1 Broadway, Cambridge, MA 02142",
    location: { lat: 42.3627, lng: -71.0818 },
    rating: 4.7,
    userRatingCount: 418,
    currentIntentSummary: "MIT and Harvard spinout founders shipping hard-tech products",
    checkedInCount: 19,
    broadAreas: ["Startup floor", "Biotech corridor", "Rooftop terrace"],
    isDemo: true,
    description:
      "CIC Cambridge is one of the world's largest startup campuses, home to hundreds of startups ranging from biotech to climate-tech to AI. It sits at the gateway of Kendall Square.",
    guide: {
      title: "Connecting at CIC Cambridge",
      body: "CIC's open-floor philosophy makes chance encounters with founders and researchers a regular occurrence. The biotech corridor is particularly active mid-morning. The rooftop terrace is quieter and good for focused calls. Monthly community events draw the wider Kendall Square ecosystem.",
      publishedAt: "2026-04-01",
    },
    demoPresence: [
      {
        displayName: "Isabelle F.",
        role: "Climate-Tech Founder",
        broadArea: "Startup floor",
        workIntent: "Preparing a pitch deck",
        collaborationInterest: "Looking to meet sustainability-focused investors",
        availability: "Available until 16:30",
        isLive: false,
      },
    ],
  },
  // ─────────────────────────────── USA — AUSTIN ────────────────────────────────
  {
    id: "capital-factory-austin",
    placeId: "ChIJ_placeholder_capital_factory",
    slug: "capital-factory",
    name: "Capital Factory",
    city: "Austin",
    country: "US",
    category: "startup_hub",
    formattedAddress: "701 Brazos St, Austin, TX 78701",
    location: { lat: 30.2688, lng: -97.7404 },
    rating: 4.8,
    userRatingCount: 567,
    currentIntentSummary: "Texas startup community in full stride",
    checkedInCount: 24,
    broadAreas: ["Main coworking", "Pitch room corridor", "Rooftop"],
    isDemo: true,
    description:
      "Capital Factory is the center of gravity for the Texas startup ecosystem. It serves as the meeting place for founders, investors, and the state's growing tech community.",
    guide: {
      title: "Startup Networking at Capital Factory",
      body: "Capital Factory has one of the most active event schedules of any accelerator in the country. The main coworking floor sees heavy traffic between 09:00 and 18:00. The rooftop is a popular spot for informal investor conversations. A warm introduction is less important here than at coastal hubs — show up, be curious, and start a conversation.",
      publishedAt: "2026-05-05",
    },
    demoPresence: [
      {
        displayName: "Tyler M.",
        role: "Startup Founder",
        broadArea: "Main coworking",
        workIntent: "Working on customer discovery",
        collaborationInterest: "Open to meeting other founders",
        availability: "Available until 17:30",
        isLive: false,
      },
    ],
  },
  {
    id: "zilker-park-austin",
    placeId: "ChIJ_placeholder_zilker_park",
    slug: "zilker-park",
    name: "Zilker Park",
    city: "Austin",
    country: "US",
    category: "park",
    formattedAddress: "2100 Barton Springs Rd, Austin, TX 78746",
    location: { lat: 30.2669, lng: -97.7726 },
    currentIntentSummary: "Outdoor work sessions and casual professional catch-ups by the river",
    checkedInCount: 9,
    broadAreas: ["Great Lawn", "Barton Springs area", "Shaded grove"],
    isDemo: true,
    description:
      "Zilker Park is Austin's beloved outdoor gathering space on the Colorado River. Popular with the tech community for outdoor meetings and post-work socializing.",
  },
  // ─────────────────────────────── USA — SEATTLE ───────────────────────────────
  {
    id: "coworking-seattle",
    placeId: "ChIJ_placeholder_coworking_seattle",
    slug: "seattle-coworking-hub",
    name: "Seattle Coworking Hub",
    city: "Seattle",
    country: "US",
    category: "coworking",
    formattedAddress: "South Lake Union, Seattle, WA 98109",
    location: { lat: 47.6233, lng: -122.3362 },
    currentIntentSummary: "Cloud and AI engineers from the South Lake Union corridor",
    checkedInCount: 11,
    broadAreas: ["Open floor", "Focus rooms", "Kitchen lounge"],
    isDemo: true,
    description:
      "A coworking placeholder for Seattle's South Lake Union tech district, home to Amazon, Microsoft, and hundreds of startups.",
  },
  // ─────────────────────────────── USA — LOS ANGELES ───────────────────────────
  {
    id: "coworking-la",
    placeId: "ChIJ_placeholder_coworking_la",
    slug: "la-coworking-hub",
    name: "LA Coworking Hub",
    city: "Los Angeles",
    country: "US",
    category: "coworking",
    formattedAddress: "Venice, Los Angeles, CA 90291",
    location: { lat: 33.9907, lng: -118.4679 },
    currentIntentSummary: "Media, entertainment, and consumer-tech founders",
    checkedInCount: 8,
    broadAreas: ["Open desks", "Creator studio", "Rooftop lounge"],
    isDemo: true,
    description:
      "A coworking placeholder for LA's Venice and Silicon Beach creative and tech community.",
  },
  // ─────────────────────────────── USA — CHICAGO ───────────────────────────────
  {
    id: "coworking-chicago",
    placeId: "ChIJ_placeholder_coworking_chicago",
    slug: "chicago-coworking-hub",
    name: "Chicago Coworking Hub",
    city: "Chicago",
    country: "US",
    category: "coworking",
    formattedAddress: "West Loop, Chicago, IL 60661",
    location: { lat: 41.8819, lng: -87.6434 },
    currentIntentSummary: "Fintech and enterprise startup founders in the West Loop",
    checkedInCount: 10,
    broadAreas: ["Hot desks", "Quiet zone", "Meeting suite"],
    isDemo: true,
    description:
      "A coworking placeholder for Chicago's West Loop, a growing hub for fintech and enterprise startups.",
  },
  {
    id: "millennium-park-chicago",
    placeId: "ChIJ_placeholder_millennium_park",
    slug: "millennium-park",
    name: "Millennium Park",
    city: "Chicago",
    country: "US",
    category: "park",
    formattedAddress: "201 E Randolph St, Chicago, IL 60602",
    location: { lat: 41.8827, lng: -87.6233 },
    rating: 4.8,
    userRatingCount: 32100,
    currentIntentSummary: "Downtown professionals and outdoor lunch meetings",
    checkedInCount: 14,
    broadAreas: ["Great Lawn", "Lurie Garden", "Cloud Gate plaza"],
    isDemo: true,
    description:
      "Millennium Park is Chicago's iconic outdoor cultural campus. Its central location makes it a natural meeting spot for professionals from the Loop.",
  },
  // ─────────────────────────────── USA — MIAMI ─────────────────────────────────
  {
    id: "coworking-miami",
    placeId: "ChIJ_placeholder_coworking_miami",
    slug: "miami-coworking-hub",
    name: "Miami Coworking Hub",
    city: "Miami",
    country: "US",
    category: "coworking",
    formattedAddress: "Wynwood, Miami, FL 33127",
    location: { lat: 25.8007, lng: -80.1985 },
    currentIntentSummary: "Crypto, Web3, and global remote founders in Wynwood",
    checkedInCount: 13,
    broadAreas: ["Open coworking", "Event room", "Garden terrace"],
    isDemo: true,
    description:
      "A coworking placeholder for Miami's Wynwood arts and tech district, a magnet for Web3 and remote-first founders.",
  },
  {
    id: "bayside-marketplace-miami",
    placeId: "ChIJ_placeholder_bayside_miami",
    slug: "bayside-marketplace",
    name: "Bayside Marketplace Waterfront",
    city: "Miami",
    country: "US",
    category: "event",
    formattedAddress: "401 Biscayne Blvd, Miami, FL 33132",
    location: { lat: 25.7751, lng: -80.1868 },
    currentIntentSummary: "Networking events and open-air professional meetups",
    checkedInCount: 7,
    broadAreas: ["Waterfront plaza", "Event pavilion", "Outdoor tables"],
    isDemo: true,
    description:
      "A waterfront event and gathering space in downtown Miami. Popular for startup networking events and casual professional meetups.",
  },
]

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------

export function getHubBySlug(slug: string): TogetlinkHub | undefined {
  return MOCK_HUBS.find((h) => h.slug === slug)
}

export function getHubsByCountry(country: "TR" | "US"): TogetlinkHub[] {
  return MOCK_HUBS.filter((h) => h.country === country)
}

export function getHubsByCategory(
  category: TogetlinkHub["category"],
): TogetlinkHub[] {
  return MOCK_HUBS.filter((h) => h.category === category)
}

export function searchHubs(
  query: string,
  regionBias?: ("TR" | "US")[],
): TogetlinkHub[] {
  const q = query.toLowerCase().trim()
  if (!q) return MOCK_HUBS

  const matched = MOCK_HUBS.filter(
    (h) =>
      h.name.toLowerCase().includes(q) ||
      h.city.toLowerCase().includes(q) ||
      h.category.toLowerCase().includes(q) ||
      h.description?.toLowerCase().includes(q),
  )

  if (!regionBias || regionBias.length === 0) return matched

  // Sort by region bias — preferred country first, but all results included
  return [
    ...matched.filter((h) => h.country === regionBias[0]),
    ...matched.filter((h) => h.country !== regionBias[0]),
  ]
}
