import type { Bilingual } from './profile';

export interface ServiceStep {
  no: string;
  title: Bilingual;
  description: Bilingual;
}

export interface ServicesOffering {
  label: Bilingual;
  title: Bilingual;
  description: Bilingual;
  steps: ServiceStep[];
  cta: Bilingual;
}

/**
 * Freelance offering confirmed by the user (design.md, Decision 5): a real
 * consulting/implementation service compatible with the current GBM role.
 * Every capability is backed by CV experience — no availability promises
 * that conflict with the current employment.
 */
export const services: ServicesOffering = {
  label: {
    es: 'Para empresas',
    en: 'For companies',
  },
  title: {
    es: 'Consultoría e implementación de IA',
    en: 'AI consulting & implementation',
  },
  description: {
    es: 'Llevo la agentificación que hago a diario en un entorno enterprise a tu empresa: del diagnóstico a un sistema en producción, con evaluación desde el primer día y gobernanza sobre qué modelos y datos usan tus agentes.',
    en: 'I bring the enterprise-grade agentic work I do day to day into your company: from diagnosis to a production system, with evaluation from day one and governance over which models and data your agents use.',
  },
  steps: [
    {
      no: '01',
      title: {
        es: 'Diagnóstico de oportunidades IA',
        en: 'AI opportunity diagnosis',
      },
      description: {
        es: 'Reviso tus procesos y datos para identificar dónde un agente o un sistema RAG genera valor real y dónde no vale la pena todavía.',
        en: 'I review your processes and data to find where an agent or RAG system creates real value — and where it is not worth it yet.',
      },
    },
    {
      no: '02',
      title: {
        es: 'Implementación con evaluación desde el día uno',
        en: 'Implementation with evals from day one',
      },
      description: {
        es: 'Construyo el agente o el sistema RAG con una suite de evaluación desde el primer commit, usando el mismo enfoque que aplico con LangChain, LangGraph, Langfuse y Phoenix en producción.',
        en: 'I build the agent or RAG system with an evaluation suite from the first commit, using the same approach I apply with LangChain, LangGraph, Langfuse and Phoenix in production.',
      },
    },
    {
      no: '03',
      title: {
        es: 'Gobernanza y operación LLM',
        en: 'LLM governance & operation',
      },
      description: {
        es: 'Defino y opero el control de acceso a modelos, costos y trazabilidad de tus sistemas de IA, con el mismo criterio de gobernanza que aplico con Bifrost/LiteLLM.',
        en: 'I define and operate model access control, cost tracking and traceability for your AI systems, with the same governance criteria I apply with Bifrost/LiteLLM.',
      },
    },
  ],
  cta: {
    es: 'AGENDAR LLAMADA',
    en: 'BOOK A CALL',
  },
};
