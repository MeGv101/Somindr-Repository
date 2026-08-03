const cache = new Map<string, string>();

export async function translateText(
  text: string,
  targetLang: string,
  sourceLang = "es"
): Promise<string> {
  const key = `${sourceLang}-${targetLang}-${text}`;
  if (cache.has(key)) return cache.get(key)!;

  try {
    const params = new URLSearchParams({
      q: text,
      langpair: `${sourceLang}|${targetLang}`
    });

    const res = await fetch(`https://api.mymemory.translated.net/get?${params}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    if (data.responseStatus !== 200) throw new Error(data.responseDetails);

    const translated = data.responseData.translatedText;
    cache.set(key, translated);
    return translated;
  } catch (err) {
    console.error("Error al traducir:", err);
    return text; 
  }
}