# Matriz de fuentes de contenido

> Todo dato publicado en el sitio SHALL tener una fila aquí. Fuentes válidas:
> **CV** = "Jhonier Negrete - AI Transformation Lead.pdf" (`public/cv.pdf`, copiado 2026-07-16, fuente de verdad principal);
> **GitHub** = API pública `api.github.com/repos/JhonierNegrete10/...` (consultada 2026-07-16, sin autenticación);
> **Decisión usuario** = confirmado explícitamente por el usuario en la sesión de diseño (2026-07-16, ver `design.md` § Context).

## Perfil (`src/data/profile.ts`)

| Dato publicado | Página/sección | Fuente exacta |
|---|---|---|
| Nombre "Jhonier Negrete" | Topbar, Home hero, footer, todas las páginas | CV — encabezado |
| Tagline "AI Transformation Lead \| Enterprise AI Agents & Governance" (ES/EN) | Home hero, Sobre mí | CV — título profesional |
| Ubicación "Medellín, Colombia" / "MED / REMOTE" | Topbar, Sobre mí | CV — ubicación del candidato |
| Disponibilidad `available: true` ("DISPONIBLE"/"AVAILABLE") | Topbar, Sobre mí, Contacto | Decisión usuario 2026-07-16 (estado inicial del sitio) |
| Email `contacto@jnegrete.dev` | Footer, Contacto | Decisión usuario 2026-07-16 (email publicado confirmado) |
| Link GitHub `github.com/JhonierNegrete10` | Contacto, footer | GitHub — cuenta verificada vía `api.github.com/users/JhonierNegrete10` |
| Link LinkedIn `linkedin.com/in/jhonier-negrete` | Contacto, footer | CV — sección de contacto (LinkedIn no fue scrapeable, HTTP 999; el CV es la fuente) |
| Coordenadas "LAT 6.2442° N / LON 75.5812° W" | Home hero (globo) | Coordenadas geográficas públicas de Medellín, Colombia (dato geográfico objetivo, no del CV) |

## Experiencia y educación (`src/data/experience.ts`)

| Dato publicado | Página/sección | Fuente exacta |
|---|---|---|
| AI Engineer — GBM Colombia, may 2024–presente | Sobre mí (timeline), Home (marquee de skills) | CV — experiencia laboral, entrada GBM Colombia |
| Descripción rol GBM: agentificación con LangChain/LangGraph, gobernanza Bifrost/LiteLLM, evals con Langfuse/Phoenix | Sobre mí (timeline), Proyectos (#001) | CV — detalle de responsabilidades en GBM Colombia (solo términos públicos, sin clientes ni cifras internas) |
| Junior Engineering Analyst — INTECOL, nov 2022–mar 2024 | Sobre mí (timeline) | CV — experiencia laboral, entrada INTECOL |
| Descripción rol INTECOL: video-vigilancia con YOLO, nubes de puntos 3D TOF | Sobre mí (timeline), Proyectos (#005) | CV — detalle de responsabilidades en INTECOL |
| Backend Engineer — MEMBO, jul–oct 2022 | Sobre mí (timeline) | CV — experiencia laboral, entrada MEMBO |
| Descripción rol MEMBO: OCR de 10k+ PDFs, Elasticsearch, PyTorch, OpenCV | Sobre mí (timeline) | CV — detalle de responsabilidades en MEMBO |
| Founder — FiniaERP.com, 2026 | Sobre mí (timeline), Proyectos (#002) | CV — experiencia/proyectos, entrada FiniaERP |
| Founder — NextEraTech.top, 2026 | Sobre mí (timeline), Proyectos (#003) | CV — experiencia/proyectos, entrada NextEraTech |
| Especialización en Inteligencia Artificial — EIA, 2024 (capstone TTSFlow) | Sobre mí (educación), Proyectos (#004) | CV — educación, Especialización en IA EIA |
| Bootcamp DATAPATH | Sobre mí (educación) | CV — educación/formación complementaria, DATAPATH |
| Ingeniería Mecatrónica — EIA, 2017–2022 | Sobre mí (educación) | CV — educación, pregrado EIA |
| Idiomas: Español nativo, Inglés profesional | Sobre mí | CV — sección de idiomas |

## Proyectos (`src/data/projects.ts`)

| Dato publicado | Página/sección | Fuente exacta |
|---|---|---|
| #001 Plataforma de orquestación de agentes y gobernanza LLM (GBM) — stack LangChain, LangGraph, Bifrost, LiteLLM, Langfuse, Phoenix; 2024–presente; rol AI Engineer | Home (tabla), Proyectos | CV — experiencia GBM Colombia (términos públicos del CV; sin nombre de cliente ni cifras internas, per decisión de diseño §5) |
| #002 FiniaERP.com — founder, 2026 | Home (tabla), Proyectos | CV — proyectos/experiencia, entrada FiniaERP; enlace `https://finiaerp.com` provisto por el usuario |
| #003 NextEraTech.top — founder, 2026 | Home (tabla), Proyectos | CV — proyectos/experiencia, entrada NextEraTech; enlace `https://nexteratech.top` provisto por el usuario |
| #004 TTSFlow — capstone Especialización IA EIA (2024): MMS-TTS, FastAPI, AWS Lambda, Streamlit, Docker, EC2/S3 | Home (tabla), Proyectos | CV — capstone TTSFlow; repo `github.com/JhonierNegrete10/tts-fastapi-app` (verificado: lenguaje Python, descripción "MLOps app", `api.github.com/repos/JhonierNegrete10/tts-fastapi-app`) |
| #005 Visión artificial para video-vigilancia — INTECOL: YOLO (tracking multi-objeto en tiempo real), nubes de puntos 3D TOF; 2022–2024 | Home (tabla), Proyectos | CV — experiencia INTECOL (proyecto interno; sin repo público por confidencialidad del empleador) |
| #006 Herramientas open source: ScrapyTube + Delta-Robot | Home (tabla), Proyectos | GitHub — repos públicos verificados vía `api.github.com` (ver detalle abajo) |
| ScrapyTube — 3★, scraping de listas de reproducción de YouTube | Proyectos (detalle #006) | `api.github.com/repos/JhonierNegrete10/ScrapyTube`: `stargazers_count: 3`, `language: "Jupyter Notebook"`, `description: "ScrapyTube es un proyecto de web scraping diseñado para extraer información específica de diferentes sitios web, como listas de reproducción de YouTube..."` |
| Delta-Robot — 2★, robot delta 3 GDL, tesis EIA (interfaz Python + firmware ESP32) | Proyectos (detalle #006) | `api.github.com/repos/JhonierNegrete10/Delta-Robot`: `stargazers_count: 2`, `language: "Python"`, `description: "...thesis 'Diseño e implementación de un robot delta de 3 grados de libertad'...GUI made in python...logic in the embedded system (ESP32)"` |

## Servicios (`src/data/services.ts`)

| Dato publicado | Página/sección | Fuente exacta |
|---|---|---|
| Oferta freelance "Consultoría e implementación de IA" (diagnóstico → agentes/RAG con evals desde el día uno → gobernanza/operación LLM) | Home, Servicios | Decisión usuario 2026-07-16 (Servicios se mantiene como oferta freelance real, compatible con el empleo actual en GBM) |
| Capacidad "diagnóstico de oportunidades IA" | Servicios | Respaldado por CV — rol de AI Engineer con responsabilidad de diseño de agentes en GBM |
| Capacidad "implementación de agentes/RAG con evals desde el día uno" | Servicios | Respaldado por CV — LangChain/LangGraph (agentes) y Langfuse/Phoenix (evals) en GBM |
| Capacidad "gobernanza y operación LLM" | Servicios | Respaldado por CV — Bifrost/LiteLLM (gobernanza) en GBM |
| CTA de contacto por email, sin promesas de disponibilidad que comprometan el rol actual | Servicios | Decisión usuario 2026-07-16 |

## Blog (`src/content/blog/`)

| Dato publicado | Página/sección | Fuente exacta |
|---|---|---|
| Colección vacía en el lanzamiento (sin posts ficticios) | Blog | Decisión de diseño — Non-Goals: "Contenido inventado: ni posts..." (`design.md`); estado "próximamente" hasta que el usuario publique contenido real |
| Feed RSS disponible aunque vacío (`/rss.xml`, `/en/rss.xml`) | Blog | Decisión usuario 2026-07-16 ("RSS sí se implementa") |

## Sobre mí — retrato

| Dato publicado | Página/sección | Fuente exacta |
|---|---|---|
| Composición gráfica (patrón grid/orbital con coordenadas de Medellín) en lugar de foto o placeholder de texto | Sobre mí | Decisión usuario 2026-07-16 ("retrato = composición gráfica, no foto"); coordenadas geográficas de Medellín (mismo dato que el globo de Home) |

## CV descargable

| Dato publicado | Página/sección | Fuente exacta |
|---|---|---|
| `/cv.pdf` enlazado desde botones "CV.PDF" | Home, Sobre mí, Contacto | Copiado literal de `D:\Documentos\cvs\Jhonier Negrete - AI Transformation Lead.pdf` a `public/cv.pdf` (tarea 1.1) |

## Notas de trazabilidad

- Repos de GitHub adicionales del usuario (`iot-weather-control-api`, `iot-weather-control-web`, `Kafka-fastapi-01`, `Delta-Robot-Esp32`) existen y fueron verificados vía la API pública, pero **no se publican como proyectos destacados en esta fase** (fuera del alcance de la tarea 2.3); no generan ninguna fila porque no hay ningún claim publicado sobre ellos todavía.
- Ningún dato de este sitio proviene del HTML de referencia (`reference/Portafolio 5a - Sitio.dc.html`) salvo el sistema visual (colores, tipografías, layout, animaciones) — el contenido de ese archivo (proyectos ficticios, métricas 92%/1.2k/300+/−75%, posts inventados, timeline "AI Engineer independiente") está explícitamente excluido y verificado por el gate anti-placeholder (tarea 4.2).
