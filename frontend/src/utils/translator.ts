const STORAGE_KEY = "somindr_translation_cache";

const cache = new Map<string, string>(
  Object.entries(
    JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}")
  )
);

export async function translateText(
  text: string,
  targetLang: string,
  sourceLang = "es"
): Promise<string> {
  const key = `${sourceLang}-${targetLang}-${text}`;

  if (cache.has(key)) {
    return cache.get(key)!;
  }

  try {
    const params = new URLSearchParams({
      q: text,
      langpair: `${sourceLang}|${targetLang}`
    });

    const res = await fetch(
      `https://api.mymemory.translated.net/get?${params}`
    );

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();

    if (data.responseStatus !== 200) {
      throw new Error(data.responseDetails);
    }

    const translated = data.responseData.translatedText;

    cache.set(key, translated);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(Object.fromEntries(cache))
    );

    return translated;
  } catch (err) {
    console.error("Error al traducir:", err);
    return text;
  }
}