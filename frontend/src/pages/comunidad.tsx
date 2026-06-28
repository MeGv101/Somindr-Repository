import { useState } from "react";
import '/src/styles/comunidad.css'
import Navbar from '../components/navbar'


interface Reply { id: number; contenido: string; tiempo: string; votos: number; votado: boolean; }
interface Post  { id: number; contenido: string; categoria: string; tiempo: string; votos: number; votado: boolean; respuestas: Reply[]; expandido: boolean; }

const CAT = { Nutrición: { bg: "#0d2d1a", color: "#4ade80" }, Físico: { bg: "#0d1f3c", color: "#60a5fa" }, Psicoemocional: { bg: "#1e0d2d", color: "#c084fc" } } as Record<string, { bg: string; color: string }>;

const INIT: Post[] = [
  { id: 1, contenido: "¿Cuántas proteínas necesito al día si entreno 4 veces por semana? Tengo 17 años y peso 65 kg.", categoria: "Nutrición", tiempo: "hace 1 h", votos: 14, votado: false, expandido: false, respuestas: [
    { id: 101, contenido: "Lo recomendado es entre 1.6 y 2 g por kg. En tu caso, entre 104 y 130 g diarios.", tiempo: "hace 40 min", votos: 9, votado: false },
    { id: 102, contenido: "Complementa con legumbres si no comes mucha carne: lentejas, frijoles, garbanzos.", tiempo: "hace 20 min", votos: 5, votado: false },
  ]},
  { id: 2, contenido: "Llevo 3 semanas sin motivación para entrenar. No es pereza, literalmente no siento ganas de nada.", categoria: "Psicoemocional", tiempo: "hace 3 h", votos: 22, votado: false, expandido: false, respuestas: [
    { id: 201, contenido: "Eso se llama burnout. A veces el cuerpo necesita un descanso real. Bajar la intensidad no es retroceder.", tiempo: "hace 2 h", votos: 18, votado: false },
  ]},
  { id: 3, contenido: "¿Vale la pena hacer cardio en ayunas para quemar grasa?", categoria: "Físico", tiempo: "hace 6 h", votos: 8, votado: false, expandido: false, respuestas: [] },
];

export default function comunidad(): import("react/jsx-runtime").JSX.Element {
  const [posts, setPosts] = useState<Post[]>(INIT);
  const [filtro, setFiltro] = useState("Todos");
  const [cat, setCat] = useState("Nutrición");
  const [texto, setTexto] = useState("");
  const [form, setForm] = useState(false);
  const [rTexto, setRTexto] = useState<Record<number, string>>({});
  const [rActivo, setRActivo] = useState<number | null>(null);

  const upPost = (id: number) =>
    setPosts(p => p.map(x => x.id !== id ? x : { ...x, votos: x.votado ? x.votos - 1 : x.votos + 1, votado: !x.votado }));

  const upReply = (pid: number, rid: number) =>
    setPosts(p => p.map(x => x.id !== pid ? x : { ...x, respuestas: x.respuestas.map(r => r.id !== rid ? r : { ...r, votos: r.votado ? r.votos - 1 : r.votos + 1, votado: !r.votado }) }));

  const toggle = (id: number) =>
    setPosts(p => p.map(x => x.id === id ? { ...x, expandido: !x.expandido } : x));

  const publicar = () => {
    if (!texto.trim()) return;
    setPosts(p => [{ id: Date.now(), contenido: texto.trim(), categoria: cat, tiempo: "ahora", votos: 0, votado: false, respuestas: [], expandido: false }, ...p]);
    setTexto(""); setForm(false);
  };

  const responder = (pid: number) => {
    const t = rTexto[pid]?.trim(); if (!t) return;
    setPosts(p => p.map(x => x.id !== pid ? x : { ...x, expandido: true, respuestas: [...x.respuestas, { id: Date.now(), contenido: t, tiempo: "ahora", votos: 0, votado: false }] }));
    setRTexto(r => ({ ...r, [pid]: "" })); setRActivo(null);
  };

  const visible = filtro === "Todos" ? posts : posts.filter(p => p.categoria === filtro);

  return (
  <div className="foro">
    <div className="foro-header">
      <p>Comunidad</p>
      <h1>Foro Somindr</h1>
      <small>Comparte, pregunta y aprende con otros.</small>
    </div>

    <div className="foro-body">
      <div className="foro-filtros">
        {["Todos", "Nutrición", "Físico", "Psicoemocional"].map(c => (
          <button key={c} className={filtro === c ? "foro-on" : ""} onClick={() => setFiltro(c)}>{c}</button>
        ))}
        <button className="foro-btn-nuevo" onClick={() => setForm(!form)}>+ Publicar</button>
      </div>

      {form && (
        <div className="foro-form">
          <textarea autoFocus placeholder="¿Qué quieres compartir o preguntar?" value={texto} onChange={e => setTexto(e.target.value)} />
          <div className="foro-form-acciones">
            <select value={cat} onChange={e => setCat(e.target.value)}>
              <option>Nutrición</option><option>Físico</option><option>Psicoemocional</option>
            </select>
            <button className="foro-btn-ok" onClick={publicar}>Publicar</button>
            <button className="foro-btn-cancel" onClick={() => setForm(false)}>Cancelar</button>
          </div>
        </div>
      )}

      {visible.map(post => (
        <div key={post.id} className="foro-post">
          <div className="foro-post-body">
            <div className="foro-post-meta">
              <span className="foro-tag" style={CAT[post.categoria]}>{post.categoria}</span>
              <span className="foro-tiempo">{post.tiempo}</span>
            </div>
            <p>{post.contenido}</p>
            <div className="foro-acciones">
              <button className={`foro-btn-voto ${post.votado ? "on" : "off"}`} onClick={() => upPost(post.id)}>
                <span>{post.votado ? "▲" : "△"}</span>{post.votos}
              </button>
              <button className="foro-btn-ghost" onClick={() => toggle(post.id)}>
                {post.respuestas.length} {post.respuestas.length === 1 ? "respuesta" : "respuestas"}
              </button>
              <button className="foro-btn-responder" onClick={() => { setRActivo(rActivo === post.id ? null : post.id); if (!post.expandido) toggle(post.id); }}>
                Responder
              </button>
            </div>
          </div>

          {post.expandido && (
            <div className="foro-replies">
              {post.respuestas.map(r => (
                <div key={r.id} className="foro-reply">
                  <p>{r.contenido}</p>
                  <div className="foro-reply-meta">
                    <button className={`foro-btn-voto-sm ${r.votado ? "on" : "off"}`} onClick={() => upReply(post.id, r.id)}>
                      <span>{r.votado ? "▲" : "△"}</span>{r.votos}
                    </button>
                    <span className="foro-tiempo">{r.tiempo}</span>
                  </div>
                </div>
              ))}

              {rActivo === post.id ? (
                <div className="foro-reply-form">
                  <textarea autoFocus placeholder="Tu respuesta..." value={rTexto[post.id] ?? ""} onChange={e => setRTexto(p => ({ ...p, [post.id]: e.target.value }))} />
                  <div className="foro-reply-btns">
                    <button className="foro-btn-ok-sm" onClick={() => responder(post.id)}>Publicar</button>
                    <button className="foro-btn-cancel-sm" onClick={() => setRActivo(null)}>Cancelar</button>
                  </div>
                </div>
              ) : (
                <button className="foro-btn-add" onClick={() => setRActivo(post.id)}>+ añadir respuesta</button>
              )}
            </div>
          )}
        </div>
      ))}

      {visible.length === 0 && <p className="foro-vacio">Sin publicaciones en esta categoría.</p>}
    </div>
  </div>
);

}