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
      "MyMediLog is an AI-powered mobile medical app I founded and developed to digitize prescriptions for elderly and underserved people in India. The project brings my interest in AI together with a practical application: helping turn prescription information into a digital form.",
    contribution:
      "I founded MyMediLog and developed the mobile application using Flutter and Firebase. My work brought together voice transcription, image recognition, and data analytics within the app. The project gave me a way to work across several parts of an application while keeping the intended users—elderly and underserved people in India—at the center of its purpose.",
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
      "Talk to Fab is a team-built, LLM-powered platform that enables semiconductor engineers to query and analyze complex fabrication data through natural language. It connects my interest in semiconductor technology with AI product development and the challenge of making specialized datasets easier to work with.",
    contribution:
      "As an AI/ML product development intern, I co-developed the platform and contributed to product definition, prototype development, testing, and integration. I worked with Python, FastAPI, React, APIs, and structured manufacturing datasets. My contribution spanned the product and its implementation, as part of a team building a natural-language interface for semiconductor engineering work.",
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
      "During my work at Dextroware Devices, I contributed to engineering a low-cost RISC-V-based system for translating head gestures into wheelchair control commands. My role centered on system specifications, motion-sensor signal accuracy, and collaboration on electrical reliability.",
    contribution:
      "As lead engineering intern, I developed specifications for the RISC-V-based control system. I worked on improving accelerometer and gyroscope signal accuracy through calibration and post-processing. I also collaborated with circuit design engineers to propose ESD solutions for reliability. These were contributions to the engineering effort; I did not independently build or ship a complete wheelchair.",
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
      "I built a ball-tracking robot using Arduino, Python, Raspberry Pi, and sonar sensors. The project connects real-time sensing with movement, using AI, sensor fusion, and motion prediction to respond to a ball’s changing position.",
    contribution:
      "I built the robot and programmed its real-time feedback and motion prediction using AI and sensor fusion. My work connected the sensing and software aspects of the project with the robot’s movement. It brought together Arduino, Python, Raspberry Pi, and sonar sensors in a practical hardware-and-software build around a clear physical task: tracking a ball.",
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
      "I conducted research on financial market volatility and efficiency with an MIT graduate and a UC Berkeley PhD mentor. The work applied machine learning and data modeling in Python to questions about financial markets. The paper is under review for publication.",
    contribution:
      "I applied machine learning and data modeling in Python as part of the research into financial market volatility and efficiency. I worked with an MIT graduate and a UC Berkeley PhD mentor. This project represents research work and a paper that is under review for publication; it is not a published result or an investment product.",
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
      "Tutoropia brings together tutoring, website work, and community service. I helped develop the platform and manage a team of five tutors, co-led website and business operations, and provided 150+ hours of free tutoring in mathematics and physics.",
    contribution:
      "I helped develop Tutoropia and manage its team of five tutors, while co-leading website and business operations. I also served as a lead tutor in Integrated Math 1–3 and AP Physics C and provided 150+ hours of free tutoring. My contribution combined supporting the platform and its operations with working directly with students in mathematics and physics.",
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
      "Paper prescriptions can be difficult to organize and access, especially for elderly and underserved people in India. MyMediLog addresses the task of digitizing that information. Its focus is on a practical use of AI in a mobile application, connecting prescription records with voice and image-based ways of capturing information.",
    approach:
      "The app combines Flutter and Firebase with voice transcription, image recognition, and data analytics. These capabilities support the broader goal of turning prescription information into a digital form. The illustration follows paper prescriptions toward organized digital information; it explains the idea behind the app. This portfolio itself does not accept, analyze, or store medical documents.",
  },
  fab: {
    problem:
      "Semiconductor engineers work with complex fab datasets and need ways to query and analyze them. Talk to Fab explores a natural-language interface for that task: asking questions about manufacturing information through an LLM-powered platform. The project sits at the intersection of specialized engineering data, software interfaces, and applied AI.",
    approach:
      "The platform brings together LLMs, structured manufacturing datasets, and a software stack that includes Python, FastAPI, React, and APIs. My work involved helping define the product, developing prototypes, testing, and contributing to integration. The chip-and-data scene is an illustration of that connection; it is not a diagram of an independently verified production architecture.",
  },
  wheelchair: {
    problem:
      "A head-gesture control system needs to translate physical movement into wheelchair commands. The work at Dextroware Devices focused on a low-cost RISC-V-based approach to that task. Motion-sensor accuracy and electrical reliability were important engineering topics within the work I contributed to.",
    approach:
      "My work combined system specifications with calibration and post-processing of accelerometer and gyroscope signals. Alongside that sensor work, I collaborated with circuit design engineers on proposals for ESD reliability. The directional-signal illustration represents the project’s purpose. The supported scope is specification, signal improvement, and reliability collaboration, rather than an independently completed wheelchair product.",
  },
  robot: {
    problem:
      "Tracking a moving ball connects two problems: understanding a changing physical situation and using that information to guide movement. The robot project gave me a concrete setting for working on real-time feedback, motion prediction, and sensor fusion. Its purpose was to connect sensing and software with a physical response.",
    approach:
      "I used Arduino, Python, Raspberry Pi, and sonar sensors, and programmed AI-based motion prediction and sensor fusion for real-time feedback. The illustration places the robot alongside a ball trajectory to explain that sensing-and-movement relationship. It represents the project concept rather than a live simulation, and no performance benchmarks or particular model architectures are claimed here.",
  },
  research: {
    problem:
      "Financial market volatility and efficiency offer questions for research using data and machine learning. This project investigated those topics through Python-based modeling with research mentorship. The scope described here is the research question, the tools I used, and the paper’s current review status; it does not make claims about predictive performance or financial outcomes.",
    approach:
      "The work used machine learning and data modeling in Python, with guidance from an MIT graduate and a UC Berkeley PhD mentor. The plot and connected points illustrate the relationship between a research question and data-based investigation. The paper is under review for publication, so this portfolio presents the work without claiming published findings or inventing specific algorithms, datasets, or results.",
  },
  tutoropia: {
    problem:
      "Helping students access tutoring involves both teaching and the work of supporting a tutoring platform. Tutoropia connected those responsibilities: developing the platform, coordinating tutors, and providing mathematics and physics instruction. My involvement covered both the organizational work and direct tutoring, with a substantial part of that teaching offered free of charge.",
    approach:
      "I co-led website and business operations, helped develop the platform, and helped manage five tutors. Alongside those responsibilities, I taught Integrated Math 1–3 and AP Physics C as a lead tutor. The learning tiles and book illustration represent the connection between the platform and teaching. Tutoropia’s technology stack is unspecified, so the focus areas here describe the work without assigning unverified tools.",
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
