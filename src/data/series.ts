export interface SeriesDefinition {
  title: { es: string; en: string };
  description: { es: string; en: string };
  baseGuideSlug?: { es?: string; en?: string };
  planned?: { es: string[]; en: string[] };
}

export const seriesHubPagesPublished = true;

export const series: Record<string, SeriesDefinition> = {
  'kernel-agents': {
    title: { es: 'Kernel Agents', en: 'Kernel Agents' },
    description: {
      es: 'Cómo construyo un sistema de agentes especializados con permisos delimitados, trazabilidad y aprobación humana.',
      en: 'How I build a system of specialized agents with bounded permissions, traceability, and human approval.',
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
