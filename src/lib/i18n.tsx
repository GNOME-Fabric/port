import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "pt";

type Dict = Record<string, string>;

const EN: Dict = {
  "nav.reel": "[ REEL_2026 ]",
  "nav.projects": "Projects",
  "nav.contact": "Contact",

  "hero.kicker": "Lead Video Editor",
  "hero.tagline":
    "Making complex ideas impossible to skip. More than 3 years working with educational and finance content creators.",
  "hero.reach": "Reach out",
  "hero.timecode": "Session Timecode",

  "reel.projectId": "Project ID",
  "reel.codec": "Codec",
  "reel.globalTc": "Global Timecode",
  "reel.muted": "Muted · click for sound",
  "reel.overview": "Technical Overview",
  "reel.overviewBody":
    "Rhythmic editorial precision, motion design, and color science across educational, finance, and short-form work.",
  "reel.stack": "Software Stack",
  "reel.status": "Current Status",
  "reel.statusBody": "Available for projects 2026",
  "reel.close": "Close [ESC]",

  "cs.title": "Case Studies",
  "cs.selected": "Selected Cuts",
  "cs.creators": "Creator Work",
  "cs.other": "Other Cases",
  "cs.countSelected": "Selected 04 / 04",
  "cs.countCreators": "Creator Cuts",
  "cs.countOther": "Other Cases",
  "cs.fileId": "File ID",
  "cs.client": "Client",
  "cs.stackLabel": "Stack",
  "cs.play": "Play",
  "cs.views": "views",
  "cs.sample": "SAMPLE",

  "cs.p1.title": "Crypto Motion Cut",
  "cs.p1.category": "Finance / Crypto — Advertisement",
  "cs.p1.client": "Capital Manager",
  "cs.p1.desc":
    "Short-form motion design edit for educational and crypto content. Fast pacing without losing narrative rhythm.",
  "cs.p2.title": "Explainer Intro",
  "cs.p2.category": "Educational — YouTube",
  "cs.p2.client": "YouTube Strategist",
  "cs.p2.desc":
    "Intro for explainer long-form content, built around strong hooks and motion-typography compositions.",
  "cs.p3.title": "High-Energy Short",
  "cs.p3.category": "Entertainment / Study — Short-form",
  "cs.p3.client": "Personal Study",
  "cs.p3.desc":
    "Study compilation of compositions with fast pacing, visual effects, and a flashy style.",
  "cs.p4.title": "Short-form Advertisement",
  "cs.p4.category": "Advertisement — Short-form",
  "cs.p4.client": "Teaser Project",
  "cs.p4.desc":
    "Clean marketing short-form piece exploring typographic rhythm and easing curves in the reel palette.",

  "cs.other1.title": "Edit Sample — A",
  "cs.other2.title": "Edit Sample — B",
  "cs.other3.title": "Edit Sample — Short",
  "cs.otherLabel": "Editing sample cutdown.",

  "clients.title": "Trusted Collaborators",

  "test.q1":
    "Great editor! Incredibly fast turnaround, quick communication and super receptive to feedback.",
  "test.r1": "Content Creator",
  "test.q2":
    "Working with Mateus has been awesome! He's reliable and consistently delivers high-quality work. Definitely partnering up again for future projects!",
  "test.r2": "Content Creator",

  "footer.title": "Start the Render",
  "footer.body": "Currently accepting long and short-form contracts. Reply within 24h.",
  "footer.tag": "Cut with precision · 2026",
};

const PT: Dict = {
  "nav.reel": "[ REEL_2026 ]",
  "nav.projects": "Projetos",
  "nav.contact": "Contato",

  "hero.kicker": "Editor de Vídeo Sênior",
  "hero.tagline":
    "Tornando ideias complexas impossíveis de pular. Mais de 3 anos trabalhando com criadores de conteúdo educacional e financeiro.",
  "hero.reach": "Fale comigo",
  "hero.timecode": "Timecode da Sessão",

  "reel.projectId": "ID do Projeto",
  "reel.codec": "Codec",
  "reel.globalTc": "Timecode Global",
  "reel.muted": "Sem som · clique para ouvir",
  "reel.overview": "Visão Técnica",
  "reel.overviewBody":
    "Precisão editorial rítmica, motion design e ciência de cor em conteúdo educacional, financeiro e short-form.",
  "reel.stack": "Software Stack",
  "reel.status": "Status Atual",
  "reel.statusBody": "Disponível para projetos em 2026",
  "reel.close": "Fechar [ESC]",

  "cs.title": "Case Studies",
  "cs.selected": "Cortes Selecionados",
  "cs.creators": "Trabalho com Criadores",
  "cs.other": "Outros Cases",
  "cs.countSelected": "Selecionados 04 / 04",
  "cs.countCreators": "Cortes de Criadores",
  "cs.countOther": "Outros Cases",
  "cs.fileId": "File ID",
  "cs.client": "Cliente",
  "cs.stackLabel": "Stack",
  "cs.play": "Play",
  "cs.views": "views",
  "cs.sample": "AMOSTRA",

  "cs.p1.title": "Crypto Motion Cut",
  "cs.p1.category": "Finanças / Crypto — Publicidade",
  "cs.p1.client": "Capital Manager",
  "cs.p1.desc":
    "Edição em motion design short-form para conteúdo educacional e cripto. Ritmo acelerado sem perder narrativa.",
  "cs.p2.title": "Intro de Explainer",
  "cs.p2.category": "Educacional — YouTube",
  "cs.p2.client": "YouTube Strategist",
  "cs.p2.desc":
    "Intro para conteúdo long-form explicativo, construída em torno de hooks fortes e composições de motion-typography.",
  "cs.p3.title": "Short de Alta Energia",
  "cs.p3.category": "Entretenimento / Estudo — Short-form",
  "cs.p3.client": "Estudo Pessoal",
  "cs.p3.desc":
    "Compilação de estudo de composições com ritmo rápido, efeitos visuais e estilo chamativo.",
  "cs.p4.title": "Publicidade Short-form",
  "cs.p4.category": "Publicidade — Short-form",
  "cs.p4.client": "Projeto Teaser",
  "cs.p4.desc":
    "Peça de marketing short-form limpa, explorando ritmo tipográfico e curvas de easing na paleta do reel.",

  "cs.other1.title": "Amostra de Edição — A",
  "cs.other2.title": "Amostra de Edição — B",
  "cs.other3.title": "Amostra de Edição — Short",
  "cs.otherLabel": "Recorte de amostra de edição.",

  "clients.title": "Colaboradores de Confiança",

  "test.q1":
    "Ótimo editor! Entregas incrivelmente rápidas, comunicação ágil e super receptivo a feedback.",
  "test.r1": "Criador de Conteúdo",
  "test.q2":
    "Trabalhar com o Mateus é sensacional! Ele é confiável e entrega sempre trabalho de alta qualidade. Com certeza vou fazer novos projetos juntos!",
  "test.r2": "Criadora de Conteúdo",

  "footer.title": "Start the Render",
  "footer.body": "Aceitando contratos long e short-form. Resposta em até 24h.",
  "footer.tag": "Cortado com precisão · 2026",
};

const DICTS: Record<Lang, Dict> = { en: EN, pt: PT };

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: string) => string };
const I18nCtx = createContext<Ctx>({ lang: "en", setLang: () => {}, t: (k) => k });

const STORAGE_KEY = "matsuo.lang";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (saved === "en" || saved === "pt") setLangState(saved);
    } catch {}
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {}
    if (typeof document !== "undefined") document.documentElement.lang = l;
  };

  useEffect(() => {
    if (typeof document !== "undefined") document.documentElement.lang = lang;
  }, [lang]);

  const t = (key: string) => DICTS[lang][key] ?? DICTS.en[key] ?? key;

  return <I18nCtx.Provider value={{ lang, setLang, t }}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  return useContext(I18nCtx);
}
