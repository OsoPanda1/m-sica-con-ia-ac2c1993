const files = import.meta.glob<{ url: string }>("../assets/audio/*.mp3.asset.json", { eager: true, import: "default" });

export const LESSON_AUDIO: Record<string, string> = Object.fromEntries(
  Object.entries(files).map(([path, a]) => [(path.split("/").pop() ?? "").replace(".mp3.asset.json", ""), a.url]),
);
