import type { Bilingual } from './profile';

export interface ProjectLink {
  label: Bilingual;
  url: string;
}

export interface Project {
  /** Stable identifier used for routing/anchors. */
  slug: string;
  /** Display index, e.g. "001" — matches the reference table styling. */
  no: string;
  /** Year or year range as shown on the site (never invented). */
  year: string;
  title: Bilingual;
  role: Bilingual;
  description: Bilingual;
  /** Verifiable technologies only — no invented KPIs. */
  stack: string[];
  links?: ProjectLink[];
}

/**
 * Real projects only. Every entry is traceable to the CV or a verified
 * public GitHub repo — see docs/content-sources.md for the exact source
 * of each field. No invented metrics/KPIs (the reference HTML's 92%,
 * 1.2k, 300+, −75% etc. are fictional and MUST NOT appear here).
 */
export const projects: Project[] = [
  {
    slug: 'gbm-agent-orchestration',
    no: '001',
    year: '2024 — presente',
    title: {
      es: 'Orquestación de agentes y gobernanza LLM',
      en: 'Agent orchestration & LLM governance',
    },
    role: {
      es: 'AI Engineer — GBM Colombia',
      en: 'AI Engineer — GBM Colombia',
    },
    description: {
      es: 'Diseño e implementación de topologías de agentes con LangChain y LangGraph, con gobernanza de acceso a modelos vía Bifrost/LiteLLM y evaluación continua con Langfuse y Phoenix. Términos públicos del CV; sin nombres de cliente ni cifras internas.',
      en: 'Design and implementation of agent topologies with LangChain and LangGraph, with model-access governance via Bifrost/LiteLLM and continuous evaluation with Langfuse and Phoenix. Public CV terms only; no client names or internal figures.',
    },
    stack: ['Python', 'LangChain', 'LangGraph', 'Bifrost', 'LiteLLM', 'Langfuse', 'Phoenix'],
  },
  {
    slug: 'finiaerp',
    no: '002',
    year: '2026',
    title: {
      es: 'FiniaERP',
      en: 'FiniaERP',
    },
    role: {
      es: 'Founder',
      en: 'Founder',
    },
    description: {
      es: 'Producto propio en construcción: ERP enfocado en gestión financiera para pequeñas y medianas empresas.',
      en: 'Own product in progress: an ERP focused on financial management for small and medium businesses.',
    },
    stack: ['Product', 'Founder'],
    links: [{ label: { es: 'Sitio', en: 'Site' }, url: 'https://finiaerp.com' }],
  },
  {
    slug: 'nexteratech',
    no: '003',
    year: '2026',
    title: {
      es: 'NextEraTech',
      en: 'NextEraTech',
    },
    role: {
      es: 'Founder',
      en: 'Founder',
    },
    description: {
      es: 'Producto propio en construcción, enfocado en soluciones tecnológicas para empresas.',
      en: 'Own product in progress, focused on technology solutions for businesses.',
    },
    stack: ['Product', 'Founder'],
    links: [{ label: { es: 'Sitio', en: 'Site' }, url: 'https://nexteratech.top' }],
  },
  {
    slug: 'ttsflow',
    no: '004',
    year: '2024',
    title: {
      es: 'TTSFlow',
      en: 'TTSFlow',
    },
    role: {
      es: 'Capstone — Especialización en IA, EIA',
      en: 'Capstone — AI Specialization, EIA',
    },
    description: {
      es: 'Trabajo de grado de la Especialización en Inteligencia Artificial (EIA): sistema de texto a voz basado en MMS-TTS, servido con FastAPI, desplegado en AWS Lambda, con interfaz en Streamlit y contenedores Docker sobre EC2/S3.',
      en: 'Capstone project of the AI Specialization (EIA): a text-to-speech system based on MMS-TTS, served with FastAPI, deployed on AWS Lambda, with a Streamlit interface and Docker containers on EC2/S3.',
    },
    stack: ['Python', 'MMS-TTS', 'FastAPI', 'AWS Lambda', 'Streamlit', 'Docker', 'EC2', 'S3'],
    links: [
      { label: { es: 'Repositorio', en: 'Repo' }, url: 'https://github.com/JhonierNegrete10/tts-fastapi-app' },
    ],
  },
  {
    slug: 'intecol-vision',
    no: '005',
    year: '2022 — 2024',
    title: {
      es: 'Visión artificial para video-vigilancia',
      en: 'Computer vision for video surveillance',
    },
    role: {
      es: 'Junior Engineering Analyst — INTECOL',
      en: 'Junior Engineering Analyst — INTECOL',
    },
    description: {
      es: 'Sistemas de video-vigilancia con detección y seguimiento multi-objeto en tiempo real usando YOLO, y procesamiento de nubes de puntos 3D a partir de sensores TOF (time-of-flight).',
      en: 'Video-surveillance systems with real-time multi-object detection and tracking using YOLO, and 3D point-cloud processing from TOF (time-of-flight) sensors.',
    },
    stack: ['Python', 'YOLO', 'OpenCV', 'TOF 3D'],
  },
  {
    slug: 'oss-scrapytube-deltarobot',
    no: '006',
    year: '2021 — 2024',
    title: {
      es: 'Open source: ScrapyTube & Delta-Robot',
      en: 'Open source: ScrapyTube & Delta-Robot',
    },
    role: {
      es: 'Autor — proyectos personales',
      en: 'Author — personal projects',
    },
    description: {
      es: 'ScrapyTube: extracción de datos de listas de reproducción de YouTube y sitios similares. Delta-Robot: algoritmos e interfaz gráfica en Python, más firmware ESP32, para el robot delta de 3 grados de libertad de la tesis de pregrado en EIA.',
      en: 'ScrapyTube: data extraction from YouTube playlists and similar sites. Delta-Robot: algorithms and a Python GUI, plus ESP32 firmware, for the 3-DOF delta robot built for the undergraduate thesis at EIA.',
    },
    stack: ['Python', 'Jupyter', 'ESP32', 'Web scraping', 'Robotics'],
    links: [
      { label: { es: 'ScrapyTube ↗', en: 'ScrapyTube ↗' }, url: 'https://github.com/JhonierNegrete10/ScrapyTube' },
      { label: { es: 'Delta-Robot ↗', en: 'Delta-Robot ↗' }, url: 'https://github.com/JhonierNegrete10/Delta-Robot' },
    ],
  },
];
