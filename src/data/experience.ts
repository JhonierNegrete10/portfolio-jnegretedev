import type { Bilingual } from './profile';

export type ExperienceKind = 'work' | 'venture' | 'education';

export interface ExperienceEntry {
  /** Display period, e.g. "2024 — presente". Never invented. */
  period: string;
  kind: ExperienceKind;
  org: string;
  role: Bilingual;
  description: Bilingual;
}

/**
 * Real timeline only (work, ventures, education), most recent first.
 * Source: CV "Jhonier Negrete - AI Transformation Lead" — see
 * docs/content-sources.md for the row-by-row traceability.
 */
export const experience: ExperienceEntry[] = [
  {
    period: '2026 — presente',
    kind: 'venture',
    org: 'FiniaERP · NextEraTech',
    role: {
      es: 'Founder',
      en: 'Founder',
    },
    description: {
      es: 'Fundador de FiniaERP.com y NextEraTech.top, dos productos propios en construcción, en paralelo a mi rol en GBM Colombia.',
      en: 'Founder of FiniaERP.com and NextEraTech.top, two own products in progress, alongside my role at GBM Colombia.',
    },
  },
  {
    period: '2024 — presente',
    kind: 'work',
    org: 'GBM Colombia',
    role: {
      es: 'AI Engineer',
      en: 'AI Engineer',
    },
    description: {
      es: 'Agentificación con LangChain y LangGraph, gobernanza de modelos con Bifrost/LiteLLM, evaluación continua con Langfuse y Phoenix.',
      en: 'Agentic systems with LangChain and LangGraph, model governance with Bifrost/LiteLLM, continuous evaluation with Langfuse and Phoenix.',
    },
  },
  {
    period: '2024',
    kind: 'education',
    org: 'EIA',
    role: {
      es: 'Especialización en Inteligencia Artificial',
      en: 'AI Specialization',
    },
    description: {
      es: 'Trabajo de grado: TTSFlow, sistema de texto a voz servido con FastAPI y desplegado en AWS Lambda.',
      en: 'Capstone: TTSFlow, a text-to-speech system served with FastAPI and deployed on AWS Lambda.',
    },
  },
  {
    period: '2022 — 2024',
    kind: 'work',
    org: 'INTECOL',
    role: {
      es: 'Junior Engineering Analyst',
      en: 'Junior Engineering Analyst',
    },
    description: {
      es: 'Video-vigilancia con detección y seguimiento en tiempo real (YOLO) y procesamiento de nubes de puntos 3D con sensores TOF.',
      en: 'Video surveillance with real-time detection and tracking (YOLO) and 3D point-cloud processing with TOF sensors.',
    },
  },
  {
    period: '2022',
    kind: 'work',
    org: 'MEMBO',
    role: {
      es: 'Backend Engineer',
      en: 'Backend Engineer',
    },
    description: {
      es: 'OCR sobre más de 10.000 PDFs con indexación en Elasticsearch, apoyado en PyTorch y OpenCV.',
      en: 'OCR over 10,000+ PDFs indexed in Elasticsearch, backed by PyTorch and OpenCV.',
    },
  },
  {
    period: '',
    kind: 'education',
    org: 'DATAPATH',
    role: {
      es: 'Bootcamp de datos',
      en: 'Data bootcamp',
    },
    description: {
      es: 'Formación complementaria en ingeniería y análisis de datos.',
      en: 'Complementary training in data engineering and analysis.',
    },
  },
  {
    period: '2017 — 2022',
    kind: 'education',
    org: 'EIA',
    role: {
      es: 'Ingeniería Mecatrónica',
      en: 'Mechatronics Engineering',
    },
    description: {
      es: 'Pregrado en Ingeniería Mecatrónica. Base de control, sistemas embebidos y robótica del portafolio open source.',
      en: 'Undergraduate degree in Mechatronics Engineering. The controls, embedded-systems and robotics base behind the open-source portfolio.',
    },
  },
];

export const languages: Bilingual = {
  es: 'Español nativo · Inglés profesional',
  en: 'Native Spanish · Professional English',
};
