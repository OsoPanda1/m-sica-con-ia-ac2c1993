import type { Lesson } from "./course";

/** Turns a lesson into a natural spoken script (Spanish) for audio narration. */
export function lessonToScript(lesson: Lesson & { moduleNumber?: number }): string {
  const out: string[] = [];
  if (lesson.moduleNumber) out.push(`Módulo ${lesson.moduleNumber}. ${lesson.title}.`);
  else out.push(`${lesson.title}.`);
  for (const b of lesson.blocks) {
    switch (b.type) {
      case "p": out.push(b.text); break;
      case "h": out.push(`${b.text}.`); break;
      case "tip": out.push(`Un consejo importante: ${b.text}`); break;
      case "list":
        out.push(b.items.map((i, n) => (b.ordered ? `${n + 1}: ${i}.` : `${i}.`)).join(" "));
        break;
      case "table":
        out.push(b.rows.map((r) => r.map((c, j) => (j === 0 ? c : `${b.head[j]}: ${c}`)).join(", ") + ".").join(" "));
        break;
      case "code":
        out.push(`${b.label ?? "Ejemplo"}: ${b.text.replace(/\[([^\]]+)\]/g, "$1,").replace(/\n+/g, " ")}`);
        break;
      case "practice":
        out.push(`Ahora, práctica: ${b.title}. ${b.items.join(". ")}.`);
        break;
    }
  }
  out.push("Fin de la lección. Cuando termines, márcala como completada y continúa con la siguiente.");
  return out.join("\n\n").replace(/–/g, " a ").replace(/BPM/g, "be pe eme").replace(/IA\b/g, "I A");
}

export function chunkText(text: string, max = 3500): string[] {
  const parts = text.split(/\n\n/);
  const chunks: string[] = [];
  let cur = "";
  for (const p of parts) {
    if ((cur + "\n\n" + p).length > max && cur) { chunks.push(cur); cur = p; }
    else cur = cur ? cur + "\n\n" + p : p;
  }
  if (cur) chunks.push(cur);
  return chunks;
}
