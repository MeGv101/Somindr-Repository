// frontend/src/components/LanguageSwitcher.tsx
import { useEffect, useState } from "react";
import { setLanguage, startAutoTranslateObserver } from "../utils/translatePage";
import "../styles/LanguageSwitcher.css";

export default function LanguageSwitcher() {
  const [lang, setLang] = useState("es");

  useEffect(() => {
    startAutoTranslateObserver();
  }, []);

  const handleClick = (code: string) => {
    setLang(code);
    setLanguage(code);
  };

  return (
    <div className="lang-switcher">
      {["es", "en", "pt", "zh"].map((code) => (
        <button
          key={code}
          type="button"
          className={`lang-btn ${lang === code ? "active" : ""}`}
          onClick={() => handleClick(code)}
        >
          {code === "zh" ? "中文" : code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}