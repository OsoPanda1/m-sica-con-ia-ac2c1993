import { enrichLesson } from "./course-enrichment";

export type Block =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "code"; label?: string; text: string }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "tip"; text: string }
  | { type: "practice"; title: string; items: string[] };

export type Lesson = { id: string; title: string; minutes: number; blocks: Block[] };
export type Module = { id: string; number: number; title: string; goal: string; lessons: Lesson[] };

export const FREE_LESSON_ID = "m1-l1";

export const COURSE: Module[] = [
  {
    id: "m1",
    number: 1,
    title: "Fundamentos musicales para dirigir la IA",
    goal: "Entender los elementos que la IA necesita para transformar una idea en música.",
    lessons: [
      {
        id: "m1-l1",
        title: "La IA es tu banda: tú eres el director",
        minutes: 6,
        blocks: [
          { type: "p", text: "Muchos principiantes creen que la IA hace todo sola. Error. La IA amplifica tu creatividad, pero sigue necesitando dirección humana. Piensa en ella como una banda de músicos de élite esperando instrucciones." },
          { type: "tip", text: "Regla central: la IA no reemplaza tu criterio artístico; ejecuta una dirección clara. Define género, tempo, emoción, instrumentos, voz y estructura." },
          { type: "h", text: "Herramientas que usarás" },
          { type: "table", head: ["Tipo", "Herramientas"], rows: [
            ["Generadores de canciones (texto a música)", "Suno AI, Udio, AIVA, Boomy"],
            ["Voces y clonación", "Kits.ai, ElevenLabs"],
            ["Letras y composición", "ChatGPT, Claude"],
            ["Separación de pistas y edición", "BandLab, LALAL.AI, Moises.ai, LANDR Stems"],
            ["Masterización", "LANDR, eMastered, BandLab Mastering"],
          ] },
          { type: "h", text: "El método en 5 etapas" },
          { type: "list", ordered: true, items: ["Intención creativa", "Letra y estructura", "Prompt musical y generación", "Iteración, edición y mezcla", "Masterización y publicación"] },
        ],
      },
      {
        id: "m1-l2",
        title: "Los 5 elementos esenciales",
        minutes: 8,
        blocks: [
          { type: "table", head: ["Elemento", "Qué controla", "Ejemplo"], rows: [
            ["Ritmo", "El pulso y el groove", "Dembow, four-on-the-floor, beat de trap"],
            ["Melodía", "La línea cantada o instrumental", "La frase melódica del coro"],
            ["Armonía", "Los acordes y la emoción", "C – G – Am – F (la progresión más famosa del pop)"],
            ["Timbre", "El color del sonido", "Piano cálido, guitarra sucia, sintetizador brillante"],
            ["Dinámica", "Subidas y bajadas de energía", "Verso íntimo, coro explosivo"],
          ] },
          { type: "tip", text: "Una buena canción jamás mantiene la misma intensidad todo el tiempo." },
        ],
      },
      {
        id: "m1-l3",
        title: "Género, tempo (BPM) y energía",
        minutes: 7,
        blocks: [
          { type: "p", text: "El tempo se expresa en BPM (pulsos por minuto) y define la sensación física de la canción. Indicar un BPM aproximado orienta mucho a la IA." },
          { type: "table", head: ["Estilo", "BPM", "Sensación"], rows: [
            ["Balada / Lo-Fi", "60–85", "Íntima, melancólica"],
            ["R&B / Pop emocional", "80–105", "Sensual, nostálgica"],
            ["Reggaetón / Urbano", "88–100", "Groove, baile, actitud"],
            ["Pop moderno", "100–125", "Directo, pegajoso"],
            ["House / Dance", "120–128", "Energía continua"],
            ["Synthpop", "110–125", "Retrofuturista, brillante"],
            ["Trap", "130–160", "Tenso, oscuro"],
            ["Rock alternativo", "110–150", "Intenso, expansivo"],
            ["Techno / Drum & Bass", "130–170+", "Hipnótico, físico"],
          ] },
        ],
      },
      {
        id: "m1-l4",
        title: "Práctica: tu ficha creativa",
        minutes: 10,
        blocks: [
          { type: "p", text: "Antes de abrir cualquier herramienta, completa una ficha de 10 puntos. Es tu mapa." },
          { type: "practice", title: "Completa tu ficha", items: ["Tema o historia", "Emoción principal", "Género principal", "Subgénero o influencia", "BPM aproximado", "Instrumentos protagonistas", "Tipo de voz", "Época o estética visual", "Momento de mayor intensidad", "Tipo de final"] },
          { type: "code", label: "Ejemplo", text: "Balada pop latino cinematográfica, nostálgica y esperanzadora, 84 BPM, piano cálido, guitarras suaves, bajo profundo, cuerdas en el clímax, voz femenina íntima con coros amplios, estética nocturna, clímax en el último coro, cierre desvanecido." },
        ],
      },
    ],
  },
  {
    id: "m2",
    number: 2,
    title: "Anatomía de una canción profesional",
    goal: "Dominar el esqueleto que hace que una canción suene completa y comercial.",
    lessons: [
      {
        id: "m2-l1",
        title: "La estructura base",
        minutes: 7,
        blocks: [
          { type: "p", text: "Las etiquetas entre corchetes dentro del campo de letra le indican a la IA cómo organizar la canción. El estilo global va en el campo de prompt o estilo." },
          { type: "code", label: "Estructura recomendada", text: "[Intro]\n[Verse 1]\n[Pre-Chorus]\n[Chorus]\n[Post-Chorus]\n[Verse 2]\n[Pre-Chorus]\n[Chorus]\n[Bridge]\n[Final Chorus]\n[Outro]" },
          { type: "table", head: ["Sección", "Función", "Instrucción útil"], rows: [
            ["Intro", "Atmósfera (4, 8 o 16 compases)", "[Intro - ambient pad, soft piano]"],
            ["Verso", "Cuenta la historia", "[Verse 1 - intimate vocals, sparse drums]"],
            ["Pre-coro", "Crea tensión", "[Pre-Chorus - rising energy, drums building]"],
            ["Coro", "El gancho memorable", "[Chorus - explosive, layered harmonies]"],
            ["Post-coro", "Refuerza el hook", "[Post-Chorus - catchy synth melody]"],
            ["Puente", "Sorprende y contrasta", "[Bridge - stripped back, whispered vocals]"],
            ["Solo / Drop", "Momento instrumental", "[Guitar Solo - emotional, wide reverb]"],
            ["Outro", "Cierra la experiencia", "[Outro - fade out, piano and vocals]"],
          ] },
        ],
      },
      {
        id: "m2-l2",
        title: "Reglas de oro de cada sección",
        minutes: 5,
        blocks: [
          { type: "list", items: [
            "La intro debe captar la atención en los primeros 10 segundos.",
            "El verso debe contener imágenes concretas, no solo emociones abstractas.",
            "El pre-coro aumenta la expectativa sin revelar todo.",
            "El coro debe ser simple, repetible y emocional.",
            "El puente debe cambiar algo: acordes, ritmo, perspectiva o intensidad.",
            "El outro debe cerrar, no simplemente cortar.",
          ] },
          { type: "practice", title: "Escucha activa", items: ["Elige tu canción favorita", "Anota el segundo en que empieza cada sección", "Identifica qué cambia en el puente"] },
        ],
      },
    ],
  },
  {
    id: "m3",
    number: 3,
    title: "Composición lírica profesional",
    goal: "Escribir letras que la IA pueda cantar con claridad, emoción y ritmo.",
    lessons: [
      {
        id: "m3-l1",
        title: "Fórmula de letra en 5 pasos",
        minutes: 8,
        blocks: [
          { type: "p", text: "Una letra profesional no es un poema largo: es información emocional organizada. El verso narra, el pre-coro tensiona y el coro condensa la idea memorable." },
          { type: "list", ordered: true, items: ["Concepto central: una frase que resuma la canción.", "Personaje: quién vive la historia.", "Conflicto: qué se perdió, desea o teme.", "Imagen concreta: un detalle sensorial memorable.", "Hook: una frase corta, repetible y cargada de emoción."] },
          { type: "code", label: "Ejemplo · Hook: «Volverás a mí»", text: "Hoy desperté pensando en ti,\nsin saber dónde estarás.\nTu abrigo sigue junto a la puerta,\ncomo esperando que regreses ya." },
        ],
      },
      {
        id: "m3-l2",
        title: "Sílabas, rima y cadencia",
        minutes: 6,
        blocks: [
          { type: "list", items: [
            "Usa frases cortas en versos rápidos o urbanos.",
            "Usa frases sostenidas en baladas y coros amplios.",
            "Coloca vocales abiertas (A, O) en las notas altas del coro para más potencia vocal.",
            "Evita palabras difíciles de pronunciar justo antes del clímax.",
            "Repite el hook, pero varía la línea final del último coro.",
          ] },
        ],
      },
      {
        id: "m3-l3",
        title: "Plantilla de letra etiquetada",
        minutes: 8,
        blocks: [
          { type: "p", text: "Copia esta plantilla y reemplaza la letra con la tuya. Los descriptores dentro de los corchetes guían la interpretación de cada sección." },
          { type: "code", label: "Plantilla completa", text: "[Intro - Soft Piano, Ambient Pad]\n\n[Verse 1 - Intimate Female Vocal]\nHoy desperté pensando en ti,\nsin saber dónde estarás.\n\n[Pre-Chorus - Rising Energy, Soft Drums]\nY aunque el tiempo pase lento,\nsiento que aún puedo escuchar tu voz.\n\n[Chorus - Explosive, Layered Harmonies]\nVolverás, lo sé,\nvolverás a mí.\nAunque el mundo se apague,\ntu luz seguirá aquí.\n\n[Post-Chorus - Catchy Melody]\nVolverás, volverás...\n\n[Verse 2 - Emotional, More Instruments]\nRecorro calles que conocías,\nbuscando huellas de los dos.\n\n[Bridge - Stripped Back, Whispered]\nUn último aliento...\nuna última luz...\n\n[Final Chorus - Cinematic, Powerful Vocals]\nVolverás, lo sé...\n\n[Outro - Fade Out, Piano and Soft Vocals]\nVolverás a mí..." },
          { type: "practice", title: "Tu primera letra", items: ["Escribe tu concepto y tu hook", "Redacta verso 1, pre-coro y coro", "Etiqueta cada sección con descriptores"] },
        ],
      },
    ],
  },
  {
    id: "m4",
    number: 4,
    title: "Prompts musicales: estilo, instrumentos y atmósfera",
    goal: "Construir prompts que produzcan un sonido específico, no genérico.",
    lessons: [
      {
        id: "m4-l1",
        title: "La fórmula universal del prompt",
        minutes: 6,
        blocks: [
          { type: "p", text: "El prompt de estilo describe el carácter global; la letra etiquetada controla cada sección. Esa separación es la base del control profesional." },
          { type: "code", label: "Fórmula", text: "[Género principal] + [Subgénero / época] + [Instrumentos clave] + [Voz] + [Atmósfera / emoción] + [Tempo] + [Calidad de producción]" },
        ],
      },
      {
        id: "m4-l2",
        title: "Prompts listos para usar",
        minutes: 8,
        blocks: [
          { type: "code", label: "Pop synth moderno", text: "Modern synthpop, 80s-inspired, bright analog synthesizers, driving bass, crisp drums, confident female vocal, euphoric and nostalgic, 118 BPM, polished radio-ready production." },
          { type: "code", label: "Balada acústica", text: "Acoustic folk ballad, fingerpicked guitar, warm cello, soft piano, intimate female vocal, melancholic and cinematic, slow tempo around 72 BPM, natural room reverb." },
          { type: "code", label: "Reggaetón oscuro", text: "Modern Latin trap-reggaeton, heavy 808 sub-bass, dembow rhythm, dark synth pads, rhythmic male vocal, seductive and nocturnal, 94 BPM, clean modern urban mix." },
          { type: "code", label: "Rock cinematográfico", text: "Epic alternative rock, distorted guitars, powerful drums, cinematic strings, raspy male vocal, restrained verses, explosive anthemic chorus, 126 BPM, wide cinematic production." },
          { type: "code", label: "Electrónica emocional", text: "Emotional melodic house, warm pads, deep bass, arpeggiated synths, airy female vocal, hopeful and nocturnal, 124 BPM, wide stereo image, festival-ready drop." },
        ],
      },
      {
        id: "m4-l3",
        title: "Cómo evitar resultados genéricos",
        minutes: 5,
        blocks: [
          { type: "list", items: [
            "No escribas solo «pop bonito» o «canción triste».",
            "Añade dos instrumentos protagonistas y una textura distintiva.",
            "Define la dinámica: «versos contenidos, coro expansivo».",
            "Indica producción: analógica, cinematográfica, radio-ready, lo-fi, wide stereo.",
            "Usa referencias de época con cuidado: 80s-inspired, Y2K pop, modern Latin urban.",
          ] },
          { type: "practice", title: "Escribe tu prompt", items: ["Toma tu ficha creativa", "Conviértela en un prompt con la fórmula", "Compáralo con los ejemplos"] },
        ],
      },
    ],
  },
  {
    id: "m5",
    number: 5,
    title: "Voces, coros y efectos especiales",
    goal: "Controlar quién canta, cómo canta y qué recursos expresivos aparecen.",
    lessons: [
      {
        id: "m5-l1",
        title: "Descriptores vocales",
        minutes: 7,
        blocks: [
          { type: "table", head: ["Objetivo", "Descriptor"], rows: [
            ["Voz femenina cálida", "warm female vocal"],
            ["Voz masculina rasgada", "raspy male vocal"],
            ["Dúo", "male and female dual vocals"],
            ["Susurro", "whispered vocals"],
            ["Potencia", "powerful belting chorus"],
            ["Aire etéreo", "airy ethereal vocals"],
            ["Coros amplios", "layered choral harmonies"],
            ["Voz procesada", "autotuned vocals, reverb-drenched vocals"],
            ["Rap", "rhythmic rap flow, fast rap verse"],
            ["Palabra hablada", "spoken word intro"],
          ] },
          { type: "code", label: "Ejemplo de dirección vocal", text: "Female lead vocal, warm and intimate in the verses, emotional belting in the final chorus, layered harmonies and subtle ad-libs." },
        ],
      },
      {
        id: "m5-l2",
        title: "Efectos y recursos especiales",
        minutes: 5,
        blocks: [
          { type: "code", label: "Etiquetas especiales", text: "[Beat Drop]\n[Guitar Solo - Virtuoso, Heavy Distortion]\n[Silence]\n[Whispered Vocals]\n[Spoken Word Intro]\n[Build-Up]\n[Breakdown]\n[Instrumental Break]" },
          { type: "tip", text: "Cada recurso debe tener una función emocional. Un silencio antes del último coro hace que el regreso del beat sea mucho más impactante." },
        ],
      },
    ],
  },
  {
    id: "m6",
    number: 6,
    title: "Flujo profesional de generación",
    goal: "Convertir una generación prometedora en una versión final consistente.",
    lessons: [
      {
        id: "m6-l1",
        title: "Genera, elige y extiende",
        minutes: 8,
        blocks: [
          { type: "list", ordered: true, items: ["Idea y letra", "Prompt de estilo", "Generación base", "Selección de la mejor versión", "Extensión y estructura", "Separación de stems", "Edición, mezcla y masterización", "Entrega final"] },
          { type: "h", text: "Paso 1: el bloque inicial" },
          { type: "p", text: "Introduce el prompt y la primera parte de la letra (Intro + Verso 1 + Pre-coro + Coro). Genera entre 4 y 6 variantes y elige la de mejor afinación, groove, tempo, voz y energía." },
          { type: "h", text: "Paso 2: extiende con intención" },
          { type: "p", text: "Usa «Extend» o «Continuar» desde el segundo deseado y añade el resto de secciones. Ajusta descriptores si el final debe cambiar de intensidad." },
          { type: "code", text: "[Bridge - stripped back, atmospheric, whispered vocals]\n[Final Chorus - full band, layered harmonies, powerful vocals]\n[Outro - fade out, piano and soft vocals]" },
        ],
      },
      {
        id: "m6-l2",
        title: "Corrige una cosa a la vez",
        minutes: 6,
        blocks: [
          { type: "table", head: ["Problema", "Ajuste recomendado"], rows: [
            ["El coro no destaca", "Añade «explosive chorus», «layered harmonies», «wider mix»"],
            ["La voz suena plana", "Define textura y actitud vocal"],
            ["El ritmo no convence", "Cambia BPM, groove o subgénero"],
            ["El final es débil", "Diseña un outro con hook, fade out o cierre instrumental"],
            ["Suena genérico", "Añade un instrumento distintivo y textura de producción"],
            ["Se pierde la estructura", "Refuerza etiquetas y simplifica la letra"],
          ] },
        ],
      },
    ],
  },
  {
    id: "m7",
    number: 7,
    title: "Postproducción: stems, limpieza y mezcla",
    goal: "Llevar el audio generado a un nivel pulido y controlable.",
    lessons: [
      {
        id: "m7-l1",
        title: "Separación de pistas (stems)",
        minutes: 6,
        blocks: [
          { type: "p", text: "Exporta tu canción y sepárala con LALAL.AI, Moises, BandLab o LANDR Stems para trabajar por capas." },
          { type: "table", head: ["Pista", "Uso principal"], rows: [
            ["Voces", "Volumen, afinación, sibilancias y efectos"],
            ["Batería", "Golpe, energía y transiciones"],
            ["Bajo", "Evitar choque con la voz y reforzar el groove"],
            ["Otros / melódicos", "Sintetizadores, guitarras, pianos y pads"],
          ] },
        ],
      },
      {
        id: "m7-l2",
        title: "Mezcla básica y reemplazo vocal",
        minutes: 8,
        blocks: [
          { type: "list", ordered: true, items: [
            "Limpia la voz: ruidos, sibilancias y artefactos.",
            "Recorta graves innecesarios en la voz para que no compitan con el bajo.",
            "Da protagonismo a la voz sobre la instrumental.",
            "Crea profundidad con reverb y delay moderados.",
            "Sube ligeramente el coro y el último estribillo.",
            "Valida en audífonos, bocina de celular, auto y parlante pequeño.",
          ] },
          { type: "tip", text: "Si la voz tiene artefactos, sepárala y aplica otro modelo vocal (Kits.ai, ElevenLabs) conservando melodía y afinación. Verifica siempre permisos y licencias." },
        ],
      },
    ],
  },
  {
    id: "m8",
    number: 8,
    title: "Masterización y entrega final",
    goal: "Preparar una versión competitiva para streaming y redes.",
    lessons: [
      {
        id: "m8-l1",
        title: "Checklist y masterización con IA",
        minutes: 6,
        blocks: [
          { type: "practice", title: "Antes de masterizar", items: ["¿No hay distorsión en los picos?", "¿La voz se entiende siempre?", "¿El bajo no tapa la voz?", "¿La intro engancha?", "¿El coro tiene el mayor impacto?", "¿El final cierra bien?", "¿Suena bien en audífonos y bocinas pequeñas?"] },
          { type: "p", text: "Usa LANDR, eMastered o BandLab Mastering para lograr un volumen estandarizado para Spotify, YouTube y Apple Music." },
        ],
      },
      {
        id: "m8-l2",
        title: "Tu paquete de entrega profesional",
        minutes: 7,
        blocks: [
          { type: "list", items: ["Master final en WAV", "MP3 para revisiones", "Instrumental", "Versiones cortas de 15, 30 y 60 s para TikTok, Reels y Shorts", "Letra final con créditos", "Portada cuadrada legible en miniatura", "Ficha técnica", "Metadatos: título, artista, género, idioma, fecha y derechos"] },
          { type: "code", label: "Ficha técnica", text: "Título:\nArtista:\nGénero:\nSubgénero:\nBPM:\nTonalidad:\nDuración:\nIdioma:\nVoz principal:\nInstrumentos clave:\nEstructura:\nPrompt final:\nHerramientas usadas:\nNotas de mezcla:\nMasterización:\nDerechos y licencia:" },
        ],
      },
    ],
  },
  {
    id: "m9",
    number: 9,
    title: "Proyecto final: tu primera canción profesional",
    goal: "Crear una canción original de mínimo 2:30 minutos, lista para publicar.",
    lessons: [
      {
        id: "m9-l1",
        title: "La consigna y la plantilla final",
        minutes: 10,
        blocks: [
          { type: "practice", title: "Tu canción debe incluir", items: ["Estructura completa: intro, verso, pre-coro, coro, puente y outro", "Letra con imágenes concretas y un hook memorable", "Etiquetas en cada sección", "Prompt con género, tempo, instrumentos, voz, emoción y producción", "Al menos tres generaciones comparadas", "Una versión final mejorada", "Master final y paquete de publicación"] },
          { type: "code", label: "Prompt de estilo de ejemplo", text: "Cinematic Latin pop ballad, 84 BPM, nostalgic and hopeful, warm piano, soft electric guitars, deep bass, cinematic strings, intimate female vocal, powerful final chorus with layered harmonies, modern polished production, wide stereo image." },
        ],
      },
      {
        id: "m9-l2",
        title: "Plan de 4 semanas y errores a evitar",
        minutes: 7,
        blocks: [
          { type: "table", head: ["Semana", "Enfoque", "Entregable"], rows: [
            ["1", "Fundamentos, idea y letra", "Ficha creativa + letra etiquetada"],
            ["2", "Tempo, instrumentos, voz y prompts", "Prompt profesional + 5 generaciones"],
            ["3", "Estructura, extensión e iteración", "Mejor versión + correcciones"],
            ["4", "Stems, mezcla, master y entrega", "Canción final + portada + ficha técnica"],
          ] },
          { type: "list", items: ["Generar sin ficha creativa", "Prompts vagos", "Demasiados instrumentos a la vez", "Coros largos o abstractos", "No marcar la estructura", "Aceptar la primera generación", "Corregir muchas variables a la vez", "Publicar sin revisar en varios dispositivos", "Omitir licencias y créditos"] },
          { type: "tip", text: "Un prompt global bien construido, etiquetas estructurales y una postproducción por stems es lo que separa una generación casual de una entrega profesional." },
        ],
      },
    ],
  },
];

export const ALL_LESSONS = COURSE.flatMap((m) => m.lessons.map((l) => ({ ...enrichLesson(l), moduleId: m.id, moduleNumber: m.number })));
export const findLesson = (id: string) => ALL_LESSONS.find((l) => l.id === id);

export type Badge = { id: string; name: string; description: string; earned: boolean };

export function computeBadges(completed: Set<string>): Badge[] {
  const moduleDone = (id: string) => COURSE.find((m) => m.id === id)?.lessons.every((l) => completed.has(l.id)) ?? false;
  const modulesDone = COURSE.filter((m) => moduleDone(m.id)).length;
  return [
    { id: "first", name: "Primer acorde", description: "Completa tu primera lección", earned: completed.size >= 1 },
    { id: "lyric", name: "Letrista", description: "Termina el módulo de composición lírica", earned: moduleDone("m3") },
    { id: "prompt", name: "Maestro del prompt", description: "Termina el módulo de prompts musicales", earned: moduleDone("m4") },
    { id: "half", name: "Mitad del camino", description: "Completa 5 módulos", earned: modulesDone >= 5 },
    { id: "mix", name: "Ingeniero de mezcla", description: "Termina postproducción", earned: moduleDone("m7") },
    { id: "pro", name: "Productor IA", description: "Completa todo el curso", earned: completed.size === ALL_LESSONS.length },
  ];
}

export function hasActiveAccess(paidUntil: string | null | undefined, now = new Date()): boolean {
  return !!paidUntil && new Date(paidUntil).getTime() > now.getTime();
}
