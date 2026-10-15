export const categories = [
  "All",
  "AI",
  "Software",
  "Hardware",
  "Community",
] as const;
export type Category = (typeof categories)[number];
export interface Project {
  id: string;
  name: string;
  short: string;
  categories: Exclude<Category, "All">[];
  overview: string;
  contribution: string;
  technologies: string[];
  x: number;
  y: number;
}
export const projects: Project[] = [
  {
    id: "medilog",
    name: "MyMediLog",
    short: "MyMediLog",
    categories: ["AI", "Software"],
    overview:
      "An AI-powered mobile app that digitizes prescriptions for elderly and underserved people in India.",
    contribution:
      "I founded MyMediLog and developed the app using Flutter and Firebase. I integrated voice transcription, image recognition, and data analytics.",
    technologies: [
      "Flutter",
      "Firebase",
      "Voice transcription",
      "Image recognition",
    ],
    x: 16,
    y: 32,
  },
  {
    id: "fab",
    name: "Talk to Fab",
    short: "Talk to Fab",
    categories: ["AI", "Software"],
    overview:
      "A team-built, LLM-powered platform for semiconductor engineers to query and analyze fab data through natural language.",
    contribution:
      "As an AI/ML product development intern, I contributed to product definition, prototype development, testing, and integration. I worked with Python, FastAPI, React, APIs, and structured manufacturing datasets.",
    technologies: ["Python", "FastAPI", "React", "APIs", "LLMs"],
    x: 50,
    y: 44,
  },
  {
    id: "wheelchair",
    name: "Gesture-Control Wheelchair",
    short: "Gesture control",
    categories: ["Hardware"],
    overview:
      "Engineering contributions at Dextroware Devices to a low-cost, RISC-V-based system that translates head gestures into wheelchair commands.",
    contribution:
      "As lead engineering intern, I developed specifications for the RISC-V-based control system. I improved accelerometer and gyroscope signal accuracy through calibration and post-processing. I collaborated with circuit design engineers on ESD reliability proposals.",
    technologies: [
      "RISC-V",
      "Accelerometer & gyroscope calibration",
      "Sensor post-processing",
      "ESD reliability",
    ],
    x: 84,
    y: 32,
  },
  {
    id: "robot",
    name: "Ball Tracking Robot",
    short: "Ball tracking",
    categories: ["Hardware", "AI"],
    overview:
      "A ball-tracking robot that connects real-time sensing with movement through AI, sensor fusion, and motion prediction.",
    contribution:
      "I built the robot using Arduino, Python, Raspberry Pi, and sonar sensors. I programmed its real-time feedback and motion prediction using AI and sensor fusion.",
    technologies: [
      "Arduino",
      "Python",
      "Raspberry Pi",
      "Sonar sensors",
      "Sensor fusion",
    ],
    x: 19,
    y: 76,
  },
  {
    id: "research",
    name: "AI Research",
    short: "AI research",
    categories: ["AI"],
    overview:
      "Research on financial market volatility and efficiency using machine learning and Python data modeling. The paper is under review for publication.",
    contribution:
      "I applied machine learning and data modeling in Python to investigate market volatility and efficiency. I conducted the research with an MIT graduate and a UC Berkeley PhD mentor.",
    technologies: ["Python", "Machine learning", "Data modeling"],
    x: 50,
    y: 85,
  },
  {
    id: "tutoropia",
    name: "Tutoropia",
    short: "Tutoropia",
    categories: ["Community", "Software"],
    overview:
      "A tutoring platform connecting website work, tutor coordination, and free mathematics and physics instruction.",
    contribution:
      "I helped develop Tutoropia and manage a team of five tutors while co-leading website and business operations. As a lead tutor in Integrated Math 1–3 and AP Physics C, I provided 150+ hours of free tutoring.",
    technologies: ["Tutoring", "Website operations", "Team coordination"],
    x: 81,
    y: 76,
  },
];
export function filterProjects(
  collection: Project[],
  category: Category,
): Project[] {
  return category === "All"
    ? collection
    : collection.filter((project) => project.categories.includes(category));
}

export interface StoryContent {
  problem: string;
  approach: string;
}
export const stories: Record<string, StoryContent> = {
  medilog: {
    problem:
      "Paper prescriptions can be difficult for elderly and underserved people in India to organize and access.",
    approach:
      "The app combines Flutter and Firebase with voice transcription, image recognition, and data analytics. Voice and image-based input support prescription digitization, while analytics provide another way to work with the captured information.",
  },
  fab: {
    problem:
      "Semiconductor engineers need an accessible way to query and analyze complex manufacturing datasets.",
    approach:
      "The team combined a React interface with Python, FastAPI, APIs, and LLMs to work with structured fab data. My contributions covered both shaping the product and connecting its prototype components through testing and integration.",
  },
  wheelchair: {
    problem:
      "Head-gesture wheelchair controls need accurate motion signals and reliable electronics.",
    approach:
      "The work addressed sensing and reliability together: calibration and post-processing improved motion-sensor signals, while collaboration with circuit design engineers informed ESD proposals. My system specifications focused on a low-cost RISC-V-based approach to translating head gestures into control commands.",
  },
  robot: {
    problem:
      "A ball-tracking robot needs to respond as the ball’s position changes.",
    approach:
      "Sensor fusion and motion prediction connected incoming sensor information with real-time feedback. The build brought together sonar sensing, Arduino, Raspberry Pi, and Python to link software decisions with physical movement.",
  },
  research: {
    problem:
      "Financial market volatility and efficiency present questions that can be investigated through data modeling.",
    approach:
      "The research combined Python-based data modeling with machine learning under the guidance of an MIT graduate and a UC Berkeley PhD mentor. The work developed into a paper that is currently under review for publication.",
  },
  tutoropia: {
    problem:
      "Students need access to tutoring supported by organized teaching and platform operations.",
    approach:
      "My work connected the platform’s website and business operations with the teaching itself. Alongside coordinating a five-tutor team, I taught Integrated Math 1–3 and AP Physics C and contributed 150+ hours of free instruction.",
  },
};
// Tutoropia's entries are focus areas, not an invented technology stack.
export const supportedTechnologies = [
  ...new Set(
    projects
      .filter((project) => project.id !== "tutoropia")
      .flatMap((project) => project.technologies),
  ),
].sort();
export function filterStories(
  collection: Project[],
  category: Category,
  technology: string,
): Project[] {
  return filterProjects(collection, category).filter(
    (project) =>
      !technology ||
      (project.id !== "tutoropia" && project.technologies.includes(technology)),
  );
}
