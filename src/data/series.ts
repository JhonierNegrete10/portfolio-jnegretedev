export interface SeriesDefinition {
  title: { es: string; en: string };
  description: { es: string; en: string };
  baseGuideSlug?: { es?: string; en?: string };
  planned?: {
    es: PlannedPiece[];
    en: PlannedPiece[];
  };
}

export interface PlannedPiece {
  title: string;
  description?: string;
  scheduled?: string;
}

export const seriesHubPagesPublished = true;

export const series: Record<string, SeriesDefinition> = {
  'kernel-agents': {
    title: { es: 'Kernel Agents', en: 'Kernel Agents' },
    description: {
      es: 'Cómo construyo un sistema de agentes especializados con permisos delimitados, trazabilidad y aprobación humana.',
      en: 'How I build a system of specialized agents with bounded permissions, traceability, and human approval.',
    },
    planned: {
      es: [
        {
          title: 'Del chat de contexto plano a agentes especializados con un espacio de trabajo trazable',
          description:
            'Qué cambió al dejar un chat con contexto plano por agentes con contexto delimitado y trazabilidad.',
        },
        {
          title: 'Por qué las acciones destructivas requieren Human-in-the-Loop y cómo definir esa frontera',
          description: 'Qué acciones se aprueban, cuáles se ejecutan solas y cómo queda registrada la decisión.',
        },
        {
          title: 'Delegación: el agente sabía qué hacer pero no ejecutaba',
          description: 'Qué aprendí al delegar tareas complejas y cómo cambió la definición de "tarea terminada".',
        },
        {
          title: 'Qué debe quedarse fuera de Kernel Agents: el código tiene otra fuente de verdad',
          description: 'La frontera con Cursor y Claude Code, y por qué duplicarla habría sido un error.',
        },
      ],
      en: [
        {
          title: 'From flat-context chat to specialized agents with a traceable workspace',
          description:
            'What changed when I replaced a flat-context chat with agents that have bounded context and traceability.',
        },
        {
          title: 'Why destructive actions require Human-in-the-Loop, and where to draw that line',
          description: 'Which actions need approval, which run on their own, and how the decision is recorded.',
        },
        {
          title: 'Delegation: the agent knew what to do but did not execute',
          description: 'What I learned delegating complex tasks and how "done" had to be redefined.',
        },
        {
          title: 'What must stay out of Kernel Agents: code has another source of truth',
          description: 'The boundary with Cursor and Claude Code, and why duplicating it would have been a mistake.',
        },
      ],
    },
  },
};

export function getSeries(id: string): SeriesDefinition {
  const definition = series[id];
  if (!definition) {
    throw new Error(`Unknown blog series "${id}". Declare it in src/data/series.ts.`);
  }
  return definition;
}
