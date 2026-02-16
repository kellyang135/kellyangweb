export interface Experience {
  id: string;
  title: string;
  organization: string;
  location: string;
  duration: string;
  description: string[];
  atomId?: string; // Links to crystal atom
  featured?: boolean;
}

export interface Project {
  id: string;
  title: string;
  tech: string[];
  description: string[];
  atomId?: string;
  featured?: boolean;
}

export const about = {
  degree: "Joint B.S. in Materials Science & Engineering / EECS",
  school: "UC Berkeley",
  gradYear: "May 2028",
  bio: "I'm interested in the experimental characterization of electronic materials and computationally guided materials design for device applications.",
  interests: ["Topological quantum materials", "Electronic skin sensors", "Thermal management", "Brain-computer interfaces"],
};

export const research: Experience[] = [
  {
    id: "khan-lab",
    title: "Research Intern",
    organization: "UC Berkeley EECS — Khan Lab",
    location: "Berkeley, CA",
    duration: "January 2026 – Present",
    description: ["Researching topological quantum materials for nanoelectronics"],
    atomId: "khan-lab",
    featured: true,
  },
  {
    id: "northeastern",
    title: "Research Assistant",
    organization: "Northeastern University",
    location: "Boston, MA",
    duration: "February – March 2025",
    description: ["Developed machine learning models for brain-computer interfaces"],
    atomId: "northeastern",
  },
  {
    id: "xiao-lab",
    title: "Design Engineer",
    organization: "CU Boulder — Xiao Lab",
    location: "Boulder, CO",
    duration: "October 2022 – August 2024",
    description: [
      "2021-2022: Under Pressure — Piezoresistive pressure sensors for electronic skin",
      "2022-2023: Skin PT — Pressure and temperature sensors for electronic skin",
      "Engineered polymer-based piezoresistive sensors by optimizing material composition and microstructure",
      "Improved signal sensitivity for prosthetics users",
    ],
    atomId: "xiao-lab",
    featured: true,
  },
  {
    id: "lee-lab",
    title: "Design Engineer",
    organization: "CU Boulder — Lee Lab",
    location: "Boulder, CO",
    duration: "2023 – 2024",
    description: [
      "Enhancing Dry Cooling in Power Plants — Novel application of high-conductivity thermal ground planes",
      "Designed dry-cooling system for thermoelectric plants to reduce fuel consumption and CO2 emissions in drought regions",
      "Analyzed thermal performance data (NumPy/Pandas) across multiple cooling configurations",
    ],
    atomId: "lee-lab",
    featured: true,
  },
];

export const industry: Experience[] = [
  {
    id: "kelvin",
    title: "Thermal Ground Plane Engineering & Manufacturing Intern",
    organization: "Kelvin Thermal Technologies",
    location: "Longmont, CO",
    duration: "June – August 2024",
    description: [
      "Manufactured thermal ground planes (TGPs) for satellite and VR cooling applications",
      "Produced 100+ units for clients",
      "Automated thermal performance analysis using Python, reducing data processing time by 60%",
    ],
    atomId: "kelvin",
  },
  {
    id: "bvsd",
    title: "Information Technology Intern",
    organization: "Boulder Valley School District",
    location: "Boulder, CO",
    duration: "June – August 2024",
    description: [
      "Conducted IT system upgrades and database migrations for 30,000+ students and staff",
      "Automated system maintenance tasks using Python, reducing manual workload",
    ],
    atomId: "bvsd",
  },
  {
    id: "build-a-better-book",
    title: "Engineering & Design Intern",
    organization: "CU Science Discovery / Build a Better Book",
    location: "Boulder, CO",
    duration: "June 2022 – March 2025",
    description: [
      "Summer 2022 intern, Spring 2025 extension program intern",
      "CVI Storytelling System (Apr–Jun 2025): Developed an interactive storytelling system for a child with cortical visual impairment (CVI)",
      "Programmed Arduino-driven sensor, audio, and lighting interactions to enhance engagement",
    ],
  },
];

export const extracurricular: Experience[] = [
  {
    id: "calhacks",
    title: "Tech Director",
    organization: "Cal Hacks",
    location: "Berkeley, CA",
    duration: "September 2025 – Present",
    description: [
      "Developed live event website using TypeScript and Effect",
      "Supporting world's largest collegiate hackathon with 3,300+ hackers",
    ],
    atomId: "calhacks",
  },
  {
    id: "bohua",
    title: "Elementary School Math Olympiad Teacher",
    organization: "Bohua Chinese School",
    location: "Boulder, CO",
    duration: "August 2020 – February 2025",
    description: [
      "Taught math olympiad preparation to elementary school students for 4+ years",
    ],
  },
];

export const projects: Project[] = [
  {
    id: "matexplorer",
    title: "MatExplorer",
    tech: ["React", "Three.js", "FastAPI", "PostgreSQL", "Redis", "pymatgen"],
    description: [
      "Built web platform for exploring computational materials with 3D crystal structure visualization",
      "Implemented similarity search using PostgreSQL/pgvector",
      "Integrated Materials Project API data with pymatgen analysis and ML property predictions",
    ],
    atomId: "matexplorer",
    featured: true,
  },
  {
    id: "eeg",
    title: "EEG Motor Imagery Classification",
    tech: ["PyTorch", "MNE", "scikit-learn", "NumPy/SciPy"],
    description: [
      "Developed deep learning models for motor imagery classification from EEG signals",
      "Implemented preprocessing pipeline (MNE) for artifact removal and feature extraction",
      "Trained on BCI Competition IV dataset (22 channels, 4 classes)",
    ],
    atomId: "eeg",
    featured: true,
  },
  {
    id: "eskin",
    title: "Electronic Skin Sensors (Xiao Lab)",
    tech: ["Materials Science", "Polymer Engineering"],
    description: [
      "Piezoresistive pressure sensors (Under Pressure)",
      "Pressure and temperature sensors (Skin PT)",
      "Optimized polymer material composition and microstructure for prosthetics applications",
    ],
    atomId: "eskin",
    featured: true,
  },
  {
    id: "thermal",
    title: "Thermal Ground Planes for Power Plants (Lee Lab)",
    tech: ["CAD", "NumPy/Pandas", "Thermal Analysis"],
    description: [
      "Designed dry-cooling system using high-conductivity thermal ground planes",
      "Goal: reduce fuel usage and CO2 emissions in drought-affected regions",
      "Analyzed thermal performance data across multiple cooling configurations",
    ],
    atomId: "thermal",
    featured: true,
  },
  {
    id: "quantum",
    title: "Topological Quantum Materials (Khan Lab)",
    tech: ["Current Research", "Nanoelectronics"],
    description: [
      "Investigating topological quantum materials for nanoelectronics applications",
    ],
    atomId: "khan-lab",
    featured: true,
  },
];

export const education = [
  {
    school: "UC Berkeley College of Engineering",
    degree: "Joint B.S. in Materials Science & Engineering / EECS",
    duration: "Expected May 2028",
  },
  {
    school: "University of Colorado Boulder",
    degree: "Concurrent Enrollment",
    duration: "May 2022 – May 2023",
  },
  {
    school: "Fairview High School",
    degree: "High School Diploma / IB Diploma",
    duration: "Graduated",
  },
];

export const skills = {
  languages: ["Python", "TypeScript", "SQL", "C++"],
  frameworks: ["React", "React Native", "Node.js", "FastAPI", "PyTorch", "scikit-learn", "Three.js", "NumPy/Pandas", "MNE", "pymatgen"],
  databases: ["PostgreSQL", "MongoDB", "Redis", "REST APIs", "pgvector"],
  tools: ["Arduino", "CAD Software", "Git", "Linux", "Jupyter"],
  humanLanguages: ["Chinese (Native)", "English (Native)", "Spanish (Limited Working)"],
};

export const contact = {
  email: "kelly_yang@berkeley.edu",
  linkedin: "https://www.linkedin.com/in/kelly-yang06/",
};

export interface Award {
  title: string;
  issuer: string;
  date: string;
  description?: string;
  place?: string;
  awards?: string[];
  additionalAwards?: string[];
}

export const awards: Award[] = [
  {
    title: "National Junior Science and Humanities Symposium (JSHS) Finalist",
    issuer: "Department of Defense",
    date: "2024-05",
    description: "2nd Place at the Wyoming and Eastern Colorado JSHS ($1500)",
  },
  {
    title: "Colorado Science and Engineering Fair Finalist",
    issuer: "CSEF",
    date: "2024-04",
    awards: [
      "2nd place in the engineering category (2022)",
      "3rd place in the energy category, regional ISEF alternate (2024)",
      "Regeneron Biomedical Science Award ($500)",
      "Physics Classroom Demonstration Award (Science Toy Magic)",
      "American Vacuum Society Award",
      "Energy Efficiency and Innovation (Platte River Power Authority)",
      "Ralph Desch Memorial Technical Writing Award",
    ],
  },
  {
    title: "NCWIT Aspirations in Computing Affiliate Winner",
    issuer: "Colorado NCWIT Aspirations in Computing",
    date: "2024-01",
  },
  {
    title: "American Junior Academy of Sciences",
    issuer: "CWJAS",
    date: "2023-04",
    description: "Colorado-Wyoming Junior Academy of Sciences 65th Annual Symposium Session Winner",
  },
  {
    title: "Carnegie Hall Performer",
    issuer: "American Protégé International Piano and Strings Competition",
    date: "2022-12",
    place: "3rd Place Winner",
  },
  {
    title: "Royal Conservatory of Music Level 10 Practical Exam",
    issuer: "Royal Conservatory of Music",
    date: "2022-07",
  },
  {
    title: "AMC Maryam Mirzakhani Certificate Winner",
    issuer: "American Mathematics Competition",
    date: "2022-03",
  },
  {
    title: "Broadcom MASTERS Top 300",
    issuer: "Society for Science",
    date: "2021-09",
    additionalAwards: [
      "3rd best in show at CSEF",
      "1st in plant sciences category",
      "David Young Memorial Award (American Statistical Association)",
      "Elemer Bernath Memorial Technical Writing Award",
      "Excellence in Horticulture Award (CSU)",
      "Office of Naval Research Award",
    ],
  },
];
