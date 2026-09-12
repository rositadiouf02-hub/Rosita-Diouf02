import { useEffect, useRef, useState } from "react";
import profilePhoto from "./assets/profile.jpg";
import presentationVideo from "./assets/presentation.mp4";

// ── Floating 3D decorative shapes ──────────────────────────────────────────
function SoundWave({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 40" className={className} aria-hidden="true" fill="none">
      {[4, 12, 20, 28, 36, 44, 52, 60, 68, 76, 84, 92, 100, 108, 116].map((x, i) => {
        const heights = [8, 16, 24, 30, 36, 28, 20, 36, 24, 30, 20, 14, 26, 12, 6];
        const h = heights[i];
        return (
          <rect
            key={x}
            x={x - 2}
            y={(40 - h) / 2}
            width={4}
            height={h}
            rx={2}
            fill="currentColor"
            opacity={0.6 + (i % 3) * 0.1}
          />
        );
      })}
    </svg>
  );
}

function FloatingSphere({ size = 80, color = "#DCC7AD", opacity = 0.6, className = "" }) {
  return (
    <div
      className={`rounded-full absolute pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 35% 35%, ${color}cc, ${color}44)`,
        boxShadow: `0 8px 32px ${color}44`,
        opacity,
      }}
      aria-hidden="true"
    />
  );
}

function FloatingRing({ size = 60, color = "#7B1E2B", className = "" }) {
  return (
    <div
      className={`rounded-full absolute pointer-events-none border-2 ${className}`}
      style={{ width: size, height: size, borderColor: `${color}44` }}
      aria-hidden="true"
    />
  );
}

// ── Reveal on scroll ───────────────────────────────────────────────────────
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add("visible"), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);
  return (
    <div ref={ref} className={`section-reveal ${className}`}>
      {children}
    </div>
  );
}

// ── Navbar ─────────────────────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    ["Accueil", "#accueil"],
    ["À propos", "#a-propos"],
    ["Compétences", "#competences"],
    ["Services", "#services"],
    ["Projets", "#projets"],
    ["Parcours", "#parcours"],
    ["Contact", "#contact"],
  ];

  const handleLink = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4 transition-all duration-300`}
      role="banner"
    >
      <nav
        className={`w-full max-w-6xl rounded-2xl px-6 py-3 flex items-center justify-between transition-all duration-300 ${
          scrolled
            ? "glass shadow-lg shadow-bordeaux/5"
            : "bg-transparent"
        }`}
        aria-label="Navigation principale"
      >
        {/* Logo */}
        <a
          href="#accueil"
          onClick={(e) => { e.preventDefault(); handleLink("#accueil"); }}
          className="font-display text-2xl font-semibold text-[#7B1E2B] tracking-wide"
          aria-label="Rosita Diouf — accueil"
        >
          ROSITA.
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-6" role="list">
          {links.map(([label, href]) => (
            <li key={href}>
              <a
                href={href}
                onClick={(e) => { e.preventDefault(); handleLink(href); }}
                className="text-sm font-medium text-[#2a1a10]/70 hover:text-[#7B1E2B] transition-colors duration-200 font-body"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href="#contact"
          onClick={(e) => { e.preventDefault(); handleLink("#contact"); }}
          className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-lg"
          style={{ background: "linear-gradient(135deg, #7B1E2B, #A67C52)" }}
        >
          Me contacter
        </a>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-[#DCC7AD]/30 transition-colors"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span className={`block w-5 h-0.5 bg-[#7B1E2B] transition-all duration-300 ${open ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-5 h-0.5 bg-[#7B1E2B] transition-all duration-300 ${open ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-[#7B1E2B] transition-all duration-300 ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden fixed inset-0 top-20 z-40 glass px-6 py-8 flex flex-col gap-6">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              onClick={(e) => { e.preventDefault(); handleLink(href); }}
              className="font-display text-3xl font-light text-[#7B1E2B] border-b border-[#DCC7AD]/50 pb-4"
            >
              {label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); handleLink("#contact"); setOpen(false); }}
            className="mt-4 px-6 py-3 rounded-xl text-white font-semibold text-center"
            style={{ background: "linear-gradient(135deg, #7B1E2B, #A67C52)" }}
          >
            Me contacter
          </a>
        </div>
      )}
    </header>
  );
}

// ── Hero ───────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      id="accueil"
      className="relative min-h-screen flex items-center overflow-hidden gradient-beige pt-24 pb-16"
      aria-label="Accueil"
    >
      {/* Background decorations */}
      <FloatingSphere size={300} color="#DCC7AD" opacity={0.3} className="top-[-80px] right-[-80px] animate-float-slow" />
      <FloatingSphere size={200} color="#A67C52" opacity={0.12} className="bottom-20 left-[-60px] animate-float" />
      <FloatingSphere size={120} color="#7B1E2B" opacity={0.08} className="top-40 left-1/3 animate-float-delay" />
      <FloatingRing size={180} color="#7B1E2B" className="top-1/4 right-1/4 animate-spin-slow" />
      <FloatingRing size={80} color="#A67C52" className="bottom-40 right-1/3" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
        {/* Left content */}
        <div className="space-y-8">
          <div className="animate-fade-up">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono-custom font-medium tracking-widest uppercase border"
              style={{ color: "#A67C52", borderColor: "#A67C52", background: "rgba(166,124,82,0.08)" }}
            >
              ✦ PORTFOLIO 2026
            </span>
          </div>

          <div className="animate-fade-up space-y-2" style={{ animationDelay: "0.1s" }}>
            <p className="text-base font-light text-[#A67C52] tracking-wide">Bonjour, je suis</p>
            <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-bold leading-none text-gradient">
              ROSITA
              <br />
              DIOUF
            </h1>
            <p className="font-display text-xl md:text-2xl font-light italic text-[#7B1E2B]/80">
              Assistante Digital & Designer UI/UX
            </p>
          </div>

          <p className="animate-fade-up text-base md:text-lg text-[#2a1a10]/70 leading-relaxed max-w-md" style={{ animationDelay: "0.2s" }}>
            <strong className="text-[#7B1E2B] font-medium">Je transforme les idées en expériences digitales modernes, utiles et mémorables.</strong>
            {" "}Passionnée par le digital, le design et les nouvelles technologies.
          </p>

          <div className="animate-fade-up flex flex-wrap gap-4" style={{ animationDelay: "0.3s" }}>
            <a
              href="#projets"
              onClick={(e) => { e.preventDefault(); document.querySelector("#projets")?.scrollIntoView({ behavior: "smooth" }); }}
              className="px-7 py-3.5 rounded-2xl text-white font-semibold transition-all duration-300 hover:opacity-90 hover:shadow-xl hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #7B1E2B, #A67C52)" }}
            >
              Découvrir mes projets
            </a>
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }); }}
              className="px-7 py-3.5 rounded-2xl font-semibold border-2 transition-all duration-300 hover:bg-[#7B1E2B] hover:text-white hover:-translate-y-0.5"
              style={{ color: "#7B1E2B", borderColor: "#7B1E2B" }}
            >
              Me contacter
            </a>
          </div>
        </div>

        {/* Right — Photo + floating cards */}
        <div className="relative flex justify-center items-center">
          <div className="relative w-full max-w-[340px] sm:max-w-[380px] md:max-w-[420px] aspect-[3/4] mx-auto">
            {/* Photo Frame */}
            <div
              className="w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/90 relative group backdrop-blur-sm"
              style={{
                background: "linear-gradient(135deg, #DCC7AD, #EDE0D0)",
                boxShadow: "0 25px 50px -12px rgba(123, 30, 43, 0.2), 0 0 0 1px rgba(220, 199, 173, 0.4)",
              }}
            >
              <img
                src={profilePhoto}
                alt="Rosita Diouf — Assistante Digital & Designer UI/UX"
                className="w-full h-full object-cover object-[50%_20%] transition-transform duration-700 ease-out group-hover:scale-105"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2a1a10]/30 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-[2.5rem] pointer-events-none" />
            </div>

            {/* Floating badge UI/UX */}
            <div className="glass absolute -left-4 sm:-left-8 top-8 rounded-2xl px-4 py-2.5 shadow-xl animate-float border border-white/40 z-10">
              <p className="font-mono-custom text-xs font-semibold text-[#7B1E2B] tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#7B1E2B]" />
                UI/UX DESIGN
              </p>
            </div>

            {/* Floating badge DIGITAL */}
            <div className="glass absolute -right-4 sm:-right-8 top-1/3 rounded-2xl px-4 py-2.5 shadow-xl animate-float-delay border border-white/40 z-10">
              <p className="font-mono-custom text-xs font-semibold text-[#A67C52] tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#A67C52]" />
                DIGITAL
              </p>
            </div>

            {/* Floating badge AI */}
            <div className="glass absolute -left-3 sm:-left-6 bottom-10 rounded-2xl px-4 py-2.5 shadow-xl animate-float-slow border border-white/40 z-10">
              <p className="font-mono-custom text-xs font-semibold text-[#7B1E2B] tracking-wider flex items-center gap-1.5">
                <span className="text-sm">⚡</span>
                AI INNOVATION
              </p>
            </div>

            {/* Wave decoration */}
            <div className="absolute -bottom-4 -right-2 text-[#A67C52] w-24 animate-float opacity-80 z-10">
              <SoundWave />
            </div>

            {/* Floating ring */}
            <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full border-2 border-[#7B1E2B]/20 animate-spin-slow pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float">
        <span className="text-xs text-[#A67C52] font-mono-custom tracking-widest">SCROLL</span>
        <div className="w-px h-12 bg-gradient-to-b from-[#A67C52] to-transparent" />
      </div>
    </section>
  );
}

// ── À Propos ───────────────────────────────────────────────────────────────
function About() {
  return (
    <section id="a-propos" className="py-24 bg-white relative overflow-hidden" aria-label="À propos">
      <FloatingSphere size={200} color="#DCC7AD" opacity={0.2} className="top-0 right-0 animate-float-slow" />
      <FloatingRing size={120} color="#7B1E2B" className="bottom-20 left-8 animate-spin-slow" />

      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="mb-16">
          <div className="flex items-center gap-4">
            <span className="font-mono-custom text-xs text-[#A67C52] tracking-widest uppercase">01 —</span>
            <h2 className="font-display text-5xl md:text-6xl font-semibold text-gradient">À propos de moi</h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <Reveal delay={100}>
            <div className="space-y-6">
              <p className="text-lg text-[#2a1a10]/80 leading-relaxed">
                Je suis <strong className="text-[#7B1E2B]">Rosita Diouf</strong>, passionnée par l'univers du digital, du design et de la communication numérique. Mon parcours m'a permis de développer une approche polyvalente combinant créativité, conception visuelle, expérience utilisateur, communication, marketing et outils digitaux.
              </p>
              <p className="text-lg text-[#2a1a10]/80 leading-relaxed">
                J'aime transformer une idée en une solution claire, esthétique et accessible. Je m'intéresse également aux possibilités offertes par <strong className="text-[#A67C52]">l'intelligence artificielle</strong> pour améliorer les expériences digitales et imaginer des solutions innovantes.
              </p>
              <p className="text-lg text-[#2a1a10]/80 leading-relaxed">
                Mon objectif est de continuer à développer mes compétences et de participer à des projets numériques utiles, créatifs et innovants.
              </p>

              <div className="flex flex-wrap gap-3 pt-4">
                {["Dakar, Sénégal", "Design", "Digital", "IA"].map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 rounded-full text-sm font-medium"
                    style={{ background: "rgba(220,199,173,0.4)", color: "#7B1E2B" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="relative">
              {/* Main card */}
              <div className="glass rounded-3xl p-8 shadow-xl border border-[#DCC7AD]/40">
                <div className="space-y-6">
                  <div className="w-12 h-1 rounded-full" style={{ background: "linear-gradient(90deg, #7B1E2B, #A67C52)" }} />
                  <blockquote className="font-display text-2xl font-light italic text-[#7B1E2B] leading-relaxed">
                    "Créer des expériences digitales qui ont du sens, de l'esthétique et de l'impact."
                  </blockquote>
                  <p className="text-sm text-[#A67C52] font-medium">— Rosita Diouf</p>
                </div>
              </div>

              {/* Floating mini card */}
              <div className="glass absolute -bottom-6 -right-6 rounded-2xl px-5 py-4 shadow-lg border border-[#DCC7AD]/40 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(123,30,43,0.1)" }}>
                    <span className="text-[#7B1E2B] text-sm">✦</span>
                  </div>
                  <div>
                    <p className="text-xs font-mono-custom text-[#A67C52]">Basée à</p>
                    <p className="text-sm font-semibold text-[#7B1E2B]">Dakar, Sénégal</p>
                  </div>
                </div>
              </div>

              {/* Decorative */}
              <FloatingSphere size={60} color="#7B1E2B" opacity={0.15} className="-top-8 -left-8 animate-float-delay" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ── Digital Profile ────────────────────────────────────────────────────────
const domains = [
  { num: "01", title: "UI/UX DESIGN", desc: "Créer des interfaces modernes, intuitives et adaptées aux utilisateurs.", icon: "◈" },
  { num: "02", title: "DESIGN GRAPHIQUE", desc: "Créer des identités visuelles, supports graphiques et univers de marque.", icon: "◉" },
  { num: "03", title: "COMMUNICATION DIGITALE", desc: "Transformer les idées en contenus et messages adaptés au digital.", icon: "◎" },
  { num: "04", title: "MARKETING DIGITAL", desc: "Utiliser des méthodes et outils de stratégie marketing pour structurer les projets.", icon: "◆" },
  { num: "05", title: "INTELLIGENCE ARTIFICIELLE", desc: "Explorer l'IA générative et ses possibilités dans les projets numériques.", icon: "◇" },
  { num: "06", title: "WEB", desc: "Comprendre et utiliser les technologies frontend pour concevoir des interfaces web.", icon: "○" },
];

function DigitalProfile() {
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: "#FDFAF6" }} aria-label="Profil digital">
      <FloatingSphere size={250} color="#DCC7AD" opacity={0.25} className="top-10 left-[-80px] animate-float-slow" />

      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="mb-16">
          <div className="flex items-center gap-4">
            <span className="font-mono-custom text-xs text-[#A67C52] tracking-widest uppercase">02 —</span>
            <h2 className="font-display text-5xl md:text-6xl font-semibold text-gradient">Un profil digital polyvalent</h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {domains.map((d, i) => (
            <Reveal key={d.num} delay={i * 80}>
              <div className="glass rounded-3xl p-7 card-hover border border-[#DCC7AD]/30 h-full">
                <div className="flex items-start justify-between mb-5">
                  <span className="text-3xl text-[#A67C52]/60">{d.icon}</span>
                  <span className="font-mono-custom text-xs text-[#7B1E2B]/50 tracking-widest">{d.num}</span>
                </div>
                <h3 className="font-mono-custom text-xs font-medium tracking-widest text-[#7B1E2B] mb-3">{d.title}</h3>
                <p className="text-sm text-[#2a1a10]/70 leading-relaxed">{d.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Compétences ────────────────────────────────────────────────────────────
const skillGroups = [
  {
    cat: "UI/UX DESIGN",
    items: ["Recherche utilisateur", "User Flow", "Wireframing", "Prototypage", "Design d'interfaces", "Design System", "Responsive Design", "Figma"],
  },
  {
    cat: "DESIGN GRAPHIQUE & BRANDING",
    items: ["Identité visuelle", "Logo", "Charte graphique", "Moodboard", "Affiches", "Branding", "Communication visuelle"],
  },
  {
    cat: "COMMUNICATION DIGITALE",
    items: ["Stratégie de communication", "Création de contenu", "Storytelling", "Réseaux sociaux", "Communication digitale"],
  },
  {
    cat: "MARKETING DIGITAL",
    items: ["AIDA", "SWOT", "SMART", "4P / 7P", "7C", "Growth Hacking", "Content Marketing", "Business Model Canvas"],
  },
  {
    cat: "INTELLIGENCE ARTIFICIELLE",
    items: ["IA générative", "Prompt Engineering", "Création de prompts", "Outils IA", "IA appliquée au design", "IA appliquée à la communication"],
  },
  {
    cat: "WEB",
    items: ["HTML5", "CSS3", "JavaScript", "Responsive Design"],
  },
];

function Skills() {
  const [active, setActive] = useState(0);

  return (
    <section id="competences" className="py-24 bg-white overflow-hidden" aria-label="Compétences">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="mb-16">
          <div className="flex items-center gap-4">
            <span className="font-mono-custom text-xs text-[#A67C52] tracking-widest uppercase">03 —</span>
            <h2 className="font-display text-5xl md:text-6xl font-semibold text-gradient">Mes compétences</h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tabs */}
          <Reveal>
            <div className="flex flex-col gap-2">
              {skillGroups.map((g, i) => (
                <button
                  key={g.cat}
                  onClick={() => setActive(i)}
                  className={`text-left px-5 py-4 rounded-2xl text-sm font-mono-custom tracking-wider transition-all duration-200 ${
                    active === i
                      ? "text-white shadow-lg"
                      : "text-[#7B1E2B] hover:bg-[#DCC7AD]/30"
                  }`}
                  style={active === i ? { background: "linear-gradient(135deg, #7B1E2B, #A67C52)" } : {}}
                  aria-pressed={active === i}
                >
                  {g.cat}
                </button>
              ))}
            </div>
          </Reveal>

          {/* Skills display */}
          <Reveal delay={100} className="lg:col-span-2">
            <div className="glass rounded-3xl p-8 min-h-64 border border-[#DCC7AD]/30">
              <h3 className="font-mono-custom text-xs tracking-widest text-[#A67C52] mb-6 uppercase">
                {skillGroups[active].cat}
              </h3>
              <div className="flex flex-wrap gap-3">
                {skillGroups[active].items.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                    style={{
                      background: "rgba(220,199,173,0.25)",
                      color: "#7B1E2B",
                      borderColor: "rgba(220,199,173,0.5)",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ── Services ───────────────────────────────────────────────────────────────
const services = [
  {
    num: "01",
    title: "UI/UX DESIGN",
    desc: "Conception d'interfaces modernes, intuitives et adaptées aux besoins des utilisateurs.",
    icon: "⬡",
  },
  {
    num: "02",
    title: "DESIGN & BRANDING",
    desc: "Création d'identités visuelles, supports graphiques et univers de marque cohérents.",
    icon: "◈",
  },
  {
    num: "03",
    title: "COMMUNICATION DIGITALE",
    desc: "Création de contenus et conception de supports adaptés aux plateformes digitales.",
    icon: "◉",
  },
  {
    num: "04",
    title: "DIGITAL & IA",
    desc: "Exploration et conception de solutions numériques intégrant les possibilités de l'intelligence artificielle.",
    icon: "◇",
  },
];

function Services() {
  return (
    <section id="services" className="py-24 relative overflow-hidden" style={{ background: "#FDFAF6" }} aria-label="Services">
      <FloatingSphere size={180} color="#7B1E2B" opacity={0.06} className="bottom-0 right-0 animate-float" />

      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="mb-4">
          <div className="flex items-center gap-4">
            <span className="font-mono-custom text-xs text-[#A67C52] tracking-widest uppercase">04 —</span>
            <h2 className="font-display text-5xl md:text-6xl font-semibold text-gradient">Ce que je peux créer pour vous</h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-16">
          {services.map((s, i) => (
            <Reveal key={s.num} delay={i * 100}>
              <div className="group glass rounded-3xl p-8 card-hover border border-[#DCC7AD]/30 h-full relative overflow-hidden">
                <div className="absolute top-4 right-4 font-mono-custom text-4xl font-bold text-[#DCC7AD]/50 leading-none select-none">
                  {s.num}
                </div>
                <div className="text-4xl mb-5 text-[#A67C52] group-hover:scale-110 transition-transform duration-300">
                  {s.icon}
                </div>
                <h3 className="font-mono-custom text-xs font-medium tracking-widest text-[#7B1E2B] mb-3">{s.title}</h3>
                <p className="text-sm text-[#2a1a10]/70 leading-relaxed">{s.desc}</p>
                <div className="mt-6 w-8 h-0.5 rounded-full group-hover:w-16 transition-all duration-300" style={{ background: "linear-gradient(90deg, #7B1E2B, #A67C52)" }} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Projects ───────────────────────────────────────────────────────────────
function Projects() {
  return (
    <section id="projets" className="py-24 bg-white overflow-hidden" aria-label="Projets">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="mb-4">
          <div className="flex items-center gap-4">
            <span className="font-mono-custom text-xs text-[#A67C52] tracking-widest uppercase">05 —</span>
            <h2 className="font-display text-5xl md:text-6xl font-semibold text-gradient">Mes projets</h2>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <p className="text-lg text-[#2a1a10]/60 mt-4 mb-16 max-w-2xl">
            Une sélection de projets réalisés ou explorés dans le cadre de mon parcours digital.
          </p>
        </Reveal>

        <div className="space-y-8">
          {/* Project 01 — Job4Elles */}
          <Reveal>
            <div className="glass rounded-3xl overflow-hidden border border-[#DCC7AD]/30 card-hover grid grid-cols-1 md:grid-cols-2">
              <div className="relative min-h-72 md:min-h-[360px] bg-[#3a2218] flex items-center justify-center overflow-hidden group">
                <video
                  src={presentationVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 glass px-3 py-1 rounded-full text-[11px] font-mono-custom text-[#7B1E2B] flex items-center gap-1.5 backdrop-blur-md pointer-events-none shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Vidéo de présentation
                </div>
              </div>
              <div className="p-8 space-y-4">
                <span className="font-mono-custom text-xs text-[#A67C52] tracking-widest">01</span>
                <h3 className="font-display text-3xl font-semibold text-[#7B1E2B]">JOB4ELLES</h3>
                <div className="flex flex-wrap gap-2">
                  {["UI/UX Design", "Digital"].map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: "rgba(220,199,173,0.4)", color: "#7B1E2B" }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-[#2a1a10]/70 leading-relaxed">
                  Conception d'une plateforme digitale pensée pour faciliter l'accès des femmes aux opportunités professionnelles.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["UI/UX", "Design", "Communication digitale", "Projet web"].map((d) => (
                    <span key={d} className="text-xs text-[#A67C52] font-mono-custom">• {d}</span>
                  ))}
                </div>
                <button className="mt-4 px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 hover:shadow-lg" style={{ background: "linear-gradient(135deg, #7B1E2B, #A67C52)" }}>
                  Voir le projet
                </button>
              </div>
            </div>
          </Reveal>

          {/* Project 02 — Originaire de Cabrousse */}
          <Reveal delay={100}>
            <div className="glass rounded-3xl overflow-hidden border border-[#DCC7AD]/30 card-hover grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 space-y-4 order-2 md:order-1">
                <span className="font-mono-custom text-xs text-[#A67C52] tracking-widest">02</span>
                <h3 className="font-display text-3xl font-semibold text-[#7B1E2B]">ORIGINAIRE DE CABROUSSE</h3>
                <div className="flex flex-wrap gap-2">
                  {["Branding", "Communication", "Digital"].map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: "rgba(220,199,173,0.4)", color: "#7B1E2B" }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-[#2a1a10]/70 leading-relaxed">
                  Projet de valorisation de l'identité, du patrimoine et des activités locales à travers une communication digitale moderne.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Branding", "Design graphique", "Communication", "Digital"].map((d) => (
                    <span key={d} className="text-xs text-[#A67C52] font-mono-custom">• {d}</span>
                  ))}
                </div>
                <button className="mt-4 px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 hover:shadow-lg" style={{ background: "linear-gradient(135deg, #7B1E2B, #A67C52)" }}>
                  Voir le projet
                </button>
              </div>
              <div
                className="h-64 md:h-auto flex items-center justify-center order-1 md:order-2"
                style={{ background: "linear-gradient(135deg, #DCC7AD, #c09a72)" }}
                role="img"
                aria-label="Mockup du projet Originaire de Cabrousse"
              >
                <div className="text-center space-y-3 p-8">
                  <div className="w-16 h-16 rounded-2xl mx-auto border-2 border-[#7B1E2B]/30 flex items-center justify-center" style={{ background: "rgba(123,30,43,0.08)" }}>
                    <span className="text-2xl text-[#7B1E2B]">◈</span>
                  </div>
                  <p className="text-sm text-[#7B1E2B] font-medium">[MOCKUP ORIGINAIRE DE CABROUSSE À AJOUTER]</p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Project 03 — MÉLOVOX — FEATURED */}
          <Reveal delay={150}>
            <div
              className="rounded-3xl overflow-hidden card-hover relative"
              style={{ background: "linear-gradient(135deg, #7B1E2B 0%, #5a1520 50%, #3d0e16 100%)" }}
            >
              <FloatingSphere size={200} color="#A67C52" opacity={0.12} className="top-0 right-0 animate-float-slow" />
              <FloatingRing size={150} color="#DCC7AD" className="bottom-10 right-20 animate-spin-slow" />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="p-10 md:p-12 space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="font-mono-custom text-xs text-[#DCC7AD]/60 tracking-widest">03</span>
                    <span className="px-3 py-1 rounded-full text-xs font-mono-custom font-medium" style={{ background: "rgba(220,199,173,0.2)", color: "#DCC7AD" }}>
                      PROJET PHARE
                    </span>
                  </div>

                  <h3 className="font-display text-5xl md:text-6xl font-bold text-white leading-tight">
                    MÉLOVOX
                  </h3>
                  <p className="font-display text-xl italic text-[#DCC7AD]">La mémoire des voix.</p>

                  <div className="flex flex-wrap gap-2">
                    {["UI/UX", "Culture", "Voix", "Intelligence artificielle"].map((tag) => (
                      <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium border" style={{ color: "#DCC7AD", borderColor: "rgba(220,199,173,0.3)", background: "rgba(220,199,173,0.1)" }}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="text-[#DCC7AD]/80 leading-relaxed">
                    Mélovox est un projet digital autour de la voix, de la musique et de la préservation et transmission du patrimoine culturel et vocal grâce aux nouvelles technologies et à l'intelligence artificielle.
                  </p>

                  <button
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    style={{ background: "linear-gradient(135deg, #DCC7AD, #A67C52)", color: "#3d0e16" }}
                  >
                    Découvrir Mélovox
                    <span>→</span>
                  </button>
                </div>

                {/* Mélovox visual */}
                <div className="relative flex items-center justify-center p-10 min-h-72">
                  {/* Mock app UI */}
                  <div className="w-full max-w-xs rounded-3xl p-6 space-y-4 shadow-2xl" style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(20px)", border: "1px solid rgba(220,199,173,0.2)" }}>
                    <div className="flex items-center justify-between">
                      <p className="text-white font-semibold text-sm">MÉLOVOX</p>
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full" style={{ background: "#DCC7AD" }} />
                        <span className="w-2 h-2 rounded-full" style={{ background: "#A67C52" }} />
                        <span className="w-2 h-2 rounded-full" style={{ background: "#7B1E2B" }} />
                      </div>
                    </div>
                    {/* Sound wave visualization */}
                    <div className="text-[#DCC7AD] w-full">
                      <SoundWave />
                    </div>
                    {/* Track cards */}
                    {["Voix ancestrales", "Mémoire musicale", "Patrimoine oral"].map((track, i) => (
                      <div key={track} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: i === 1 ? "rgba(166,124,82,0.3)" : "rgba(255,255,255,0.05)" }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(220,199,173,0.2)" }}>
                          <span className="text-[#DCC7AD] text-xs">♪</span>
                        </div>
                        <p className="text-xs text-[#DCC7AD]/80 font-medium">{track}</p>
                        {i === 1 && <span className="ml-auto text-[#DCC7AD] text-xs">▶</span>}
                      </div>
                    ))}
                  </div>

                  {/* Floating elements */}
                  <div className="glass-dark absolute top-4 right-4 rounded-xl px-3 py-2 animate-float">
                    <p className="text-xs text-[#DCC7AD] font-mono-custom">AI ✦</p>
                  </div>
                  <div className="glass-dark absolute bottom-4 left-4 rounded-xl px-3 py-2 animate-float-delay">
                    <p className="text-xs text-[#DCC7AD] font-mono-custom">Culture</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ── Mélovox Case Study ──────────────────────────────────────────────────────
function MelovoxCaseStudy() {
  const blocks = [
    {
      label: "LE PROBLÈME",
      content: "Comment préserver et transmettre la mémoire musicale, vocale et culturelle à l'ère du numérique ?",
      icon: "?",
    },
    {
      label: "LA SOLUTION",
      content: "Imaginer une plateforme digitale utilisant les technologies modernes et l'intelligence artificielle.",
      icon: "✦",
    },
    {
      label: "L'EXPÉRIENCE",
      content: "Créer une interface accessible, élégante et intuitive pour tous les utilisateurs.",
      icon: "◎",
    },
    {
      label: "L'INNOVATION",
      content: "Associer patrimoine culturel, voix, musique, technologie et intelligence artificielle.",
      icon: "◇",
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: "#F7F2EC" }} aria-label="Case study Mélovox">
      <FloatingSphere size={300} color="#7B1E2B" opacity={0.05} className="top-0 right-0 animate-float-slow" />

      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="text-center mb-16 space-y-4">
          <span className="font-mono-custom text-xs text-[#A67C52] tracking-widest uppercase">CASE STUDY</span>
          <h2 className="font-display text-6xl md:text-7xl font-bold text-gradient">MÉLOVOX</h2>
          <p className="font-display text-2xl italic text-[#A67C52]">La mémoire des voix.</p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
          {blocks.map((b, i) => (
            <Reveal key={b.label} delay={i * 100}>
              <div className="glass rounded-3xl p-8 card-hover border border-[#DCC7AD]/30 h-full">
                <div className="w-10 h-10 rounded-xl mb-5 flex items-center justify-center text-white font-bold" style={{ background: "linear-gradient(135deg, #7B1E2B, #A67C52)" }}>
                  {b.icon}
                </div>
                <h3 className="font-mono-custom text-xs tracking-widest text-[#A67C52] mb-3">{b.label}</h3>
                <p className="text-[#2a1a10]/80 leading-relaxed">{b.content}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Large visualization */}
        <Reveal delay={200}>
          <div
            className="rounded-3xl p-10 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #7B1E2B, #5a1520)" }}
          >
            <FloatingRing size={200} color="#DCC7AD" className="top-0 right-0 -translate-y-1/4 translate-x-1/4 animate-spin-slow" />
            <FloatingSphere size={150} color="#A67C52" opacity={0.15} className="bottom-0 left-0 animate-float" />

            <div className="relative z-10 text-center space-y-6">
              <p className="font-mono-custom text-xs tracking-widest text-[#DCC7AD]/60 uppercase">Interface Mélovox</p>
              <div className="max-w-lg mx-auto text-[#DCC7AD] w-full">
                <SoundWave className="w-full h-12" />
              </div>
              <blockquote className="font-display text-3xl md:text-4xl italic text-white max-w-2xl mx-auto leading-relaxed">
                "La voix est mémoire. La mémoire est culture. La culture est patrimoine."
              </blockquote>
              <div className="flex justify-center gap-4 flex-wrap">
                {["Voix", "IA", "Musique", "Culture", "Patrimoine", "Digital"].map((tag) => (
                  <span key={tag} className="px-4 py-2 rounded-full text-xs font-mono-custom border" style={{ color: "#DCC7AD", borderColor: "rgba(220,199,173,0.3)" }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── Parcours ───────────────────────────────────────────────────────────────
function Journey() {
  const formations = [
    {
      institution: "Sonatel Academy",
      title: "Formation — Assistante Digital",
      date: "[DATE À AJOUTER]",
      skills: ["Communication digitale", "Marketing digital", "Design", "UI/UX", "Création de contenu", "Gestion de projets", "Culture numérique", "Technologies web"],
    },
    {
      institution: "Orange Digital Center × Bixist Africa",
      title: "Formation — Intelligence Artificielle",
      date: "[DATE À AJOUTER]",
      skills: ["Intelligence artificielle", "IA générative", "Prompt Engineering", "Création de prompts", "Outils IA", "Applications de l'IA"],
    },
  ];

  const evolution = [
    "Découverte du digital",
    "Communication digitale",
    "Design graphique",
    "UI/UX Design",
    "Création de projets numériques",
    "Intelligence artificielle",
    "Innovation digitale",
  ];

  return (
    <section id="parcours" className="py-24 bg-white overflow-hidden" aria-label="Parcours">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="mb-16">
          <div className="flex items-center gap-4">
            <span className="font-mono-custom text-xs text-[#A67C52] tracking-widest uppercase">06 —</span>
            <h2 className="font-display text-5xl md:text-6xl font-semibold text-gradient">Parcours & Formations</h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Timeline */}
          <div className="space-y-0">
            {formations.map((f, i) => (
              <Reveal key={f.institution} delay={i * 150}>
                <div className="relative pl-10 pb-12">
                  {/* Line */}
                  {i < formations.length - 1 && (
                    <div className="absolute left-3.5 top-8 w-px h-full" style={{ background: "linear-gradient(180deg, #7B1E2B, #DCC7AD)" }} />
                  )}
                  {/* Dot */}
                  <div className="absolute left-0 top-1 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #7B1E2B, #A67C52)" }}>
                    <span className="w-2 h-2 rounded-full bg-white" />
                  </div>

                  <div className="glass rounded-3xl p-7 border border-[#DCC7AD]/30">
                    <span className="font-mono-custom text-xs text-[#A67C52] tracking-wider">{f.date}</span>
                    <h3 className="font-display text-2xl font-semibold text-[#7B1E2B] mt-2 mb-1">{f.title}</h3>
                    <p className="text-sm font-medium text-[#A67C52] mb-4">{f.institution}</p>
                    <div className="flex flex-wrap gap-2">
                      {f.skills.map((s) => (
                        <span key={s} className="px-3 py-1 rounded-lg text-xs" style={{ background: "rgba(220,199,173,0.3)", color: "#7B1E2B" }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Evolution */}
          <Reveal delay={200}>
            <div className="glass rounded-3xl p-8 border border-[#DCC7AD]/30 h-full">
              <h3 className="font-mono-custom text-xs tracking-widest text-[#A67C52] mb-8 uppercase">Mon parcours digital</h3>
              <div className="space-y-0">
                {evolution.map((step, i) => (
                  <div key={step} className="relative">
                    <div className="flex items-center gap-4 py-3">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: i === 0 ? "#DCC7AD" : i === evolution.length - 1 ? "#7B1E2B" : "#A67C52" }}
                      />
                      <p className={`text-sm font-medium ${i === evolution.length - 1 ? "text-[#7B1E2B]" : "text-[#2a1a10]/70"}`}>
                        {step}
                      </p>
                    </div>
                    {i < evolution.length - 1 && (
                      <div className="absolute left-[3px] top-8 w-px h-4" style={{ background: "rgba(166,124,82,0.4)" }} />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-[#DCC7AD]/30">
                <p className="text-sm text-[#2a1a10]/70 italic leading-relaxed">
                  Chaque apprentissage m'a permis d'élargir ma vision du digital et de développer un profil polyvalent à la croisée du design, de la communication, de la technologie et de l'intelligence artificielle.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ── Tools ──────────────────────────────────────────────────────────────────
const toolGroups = [
  { cat: "DESIGN", tools: ["Figma", "Canva"] },
  { cat: "CRÉATION DE CONTENU", tools: ["Canva", "CapCut"] },
  { cat: "WEB", tools: ["HTML5", "CSS3", "JavaScript"] },
  { cat: "IA", tools: ["ChatGPT", "Outils IA générative"] },
  { cat: "ORGANISATION", tools: ["Todoist"] },
];

function Tools() {
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: "#FDFAF6" }} aria-label="Outils">
      <FloatingSphere size={220} color="#DCC7AD" opacity={0.25} className="bottom-0 right-0 animate-float-slow" />

      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="mb-16">
          <div className="flex items-center gap-4">
            <span className="font-mono-custom text-xs text-[#A67C52] tracking-widest uppercase">07 —</span>
            <h2 className="font-display text-5xl md:text-6xl font-semibold text-gradient">Les outils que j'utilise</h2>
          </div>
        </Reveal>

        <div className="space-y-10">
          {toolGroups.map((g, i) => (
            <Reveal key={g.cat} delay={i * 80}>
              <div className="flex flex-wrap items-center gap-4">
                <span className="font-mono-custom text-xs tracking-widest text-[#A67C52] w-44 flex-shrink-0 uppercase">
                  {g.cat}
                </span>
                <div className="flex flex-wrap gap-3">
                  {g.tools.map((tool) => (
                    <span
                      key={tool}
                      className="px-5 py-2.5 rounded-2xl text-sm font-medium border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                      style={{
                        background: "rgba(255,255,255,0.8)",
                        color: "#7B1E2B",
                        borderColor: "rgba(220,199,173,0.5)",
                      }}
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Philosophy ──────────────────────────────────────────────────────────────
function Philosophy() {
  return (
    <section className="py-32 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #7B1E2B 0%, #5a1520 100%)" }} aria-label="Philosophie">
      <FloatingRing size={300} color="#DCC7AD" className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin-slow" />
      <FloatingSphere size={150} color="#A67C52" opacity={0.2} className="top-0 left-0 animate-float" />
      <FloatingSphere size={100} color="#DCC7AD" opacity={0.15} className="bottom-0 right-20 animate-float-delay" />

      {/* Sound wave decorations */}
      <div className="absolute top-12 left-12 text-white/10 w-40">
        <SoundWave />
      </div>
      <div className="absolute bottom-12 right-12 text-white/10 w-40">
        <SoundWave />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <Reveal>
          <span className="font-mono-custom text-xs tracking-widest text-[#DCC7AD]/60 uppercase">Philosophie</span>
          <blockquote className="font-display text-4xl md:text-6xl lg:text-7xl font-light italic text-white leading-tight mt-8">
            "Transformer une idée en une expérience digitale qui a du sens."
          </blockquote>
          <p className="mt-8 text-[#DCC7AD]/70 font-medium">— Rosita Diouf</p>
        </Reveal>
      </div>
    </section>
  );
}

// ── Contact ──────────────────────────────────────────────────────────────
function Contact() {
  const [form, setForm] = useState({ nom: "", email: "", sujet: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ nom: "", email: "", sujet: "", message: "" });
  };

  return (
    <section id="contact" className="py-24 bg-white relative overflow-hidden" aria-label="Contact">
      <FloatingSphere size={200} color="#DCC7AD" opacity={0.2} className="top-0 right-0 animate-float-slow" />
      <FloatingRing size={120} color="#7B1E2B" className="bottom-20 left-0 animate-spin-slow" />

      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="mb-16">
          <div className="flex items-center gap-4">
            <span className="font-mono-custom text-xs text-[#A67C52] tracking-widest uppercase">08 —</span>
            <h2 className="font-display text-5xl md:text-6xl font-semibold text-gradient">Une idée ? Construisons-la ensemble.</h2>
          </div>
          <p className="mt-6 text-lg text-[#2a1a10]/60 max-w-2xl">
            Vous avez un projet, une idée ou une opportunité professionnelle ? Parlons-en.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <Reveal>
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nom" className="block text-xs font-mono-custom tracking-widest text-[#A67C52] mb-2 uppercase">Nom</label>
                  <input
                    id="nom"
                    type="text"
                    required
                    value={form.nom}
                    onChange={(e) => setForm({ ...form, nom: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                    style={{ borderColor: "#DCC7AD", background: "rgba(220,199,173,0.1)" }}
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-mono-custom tracking-widest text-[#A67C52] mb-2 uppercase">Email</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                    style={{ borderColor: "#DCC7AD", background: "rgba(220,199,173,0.1)" }}
                    placeholder="votre@email.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="sujet" className="block text-xs font-mono-custom tracking-widest text-[#A67C52] mb-2 uppercase">Sujet</label>
                <input
                  id="sujet"
                  type="text"
                  value={form.sujet}
                  onChange={(e) => setForm({ ...form, sujet: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                  style={{ borderColor: "#DCC7AD", background: "rgba(220,199,173,0.1)" }}
                  placeholder="Objet de votre message"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-xs font-mono-custom tracking-widest text-[#A67C52] mb-2 uppercase">Message</label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all resize-none"
                  style={{ borderColor: "#DCC7AD", background: "rgba(220,199,173,0.1)" }}
                  placeholder="Décrivez votre projet ou opportunité..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 rounded-2xl text-white font-semibold transition-all duration-300 hover:opacity-90 hover:shadow-xl hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #7B1E2B, #A67C52)" }}
              >
                {sent ? "✓ Message envoyé !" : "Envoyer le message"}
              </button>
            </form>
          </Reveal>

          {/* Info */}
          <Reveal delay={150}>
            <div className="space-y-6">
              <div className="glass rounded-3xl p-8 border border-[#DCC7AD]/30">
                <h3 className="font-mono-custom text-xs tracking-widest text-[#A67C52] mb-6 uppercase">Informations</h3>
                <div className="space-y-5">
                  {[
                    { label: "Localisation", value: "Dakar, Sénégal", icon: "📍" },
                    { label: "Email", value: "[EMAIL À AJOUTER]", icon: "✉" },
                    { label: "Téléphone", value: "[NUMÉRO À AJOUTER]", icon: "☎" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(220,199,173,0.3)" }}>
                        <span className="text-base">{item.icon}</span>
                      </div>
                      <div>
                        <p className="text-xs text-[#A67C52] font-mono-custom tracking-wider">{item.label}</p>
                        <p className="text-sm font-medium text-[#2a1a10]/80">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social links */}
              <div className="glass rounded-3xl p-8 border border-[#DCC7AD]/30">
                <h3 className="font-mono-custom text-xs tracking-widest text-[#A67C52] mb-6 uppercase">Réseaux</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: "LinkedIn", placeholder: "[LIEN LINKEDIN À AJOUTER]" },
                    { name: "GitHub", placeholder: "https://github.com/rositadiouf02-hub" },
                    { name: "Instagram", placeholder: "[LIEN INSTAGRAM À AJOUTER]" },
                    { name: "TikTok", placeholder: "[LIEN TIKTOK À AJOUTER]" },
                  ].map((s) => (
                    <a
                      key={s.name}
                      href={s.placeholder}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 hover:bg-[#7B1E2B] hover:text-white hover:border-[#7B1E2B]"
                      style={{ color: "#7B1E2B", borderColor: "#DCC7AD" }}
                      aria-label={`${s.name} de Rosita Diouf`}
                    >
                      <span className="text-base">
                        {s.name === "LinkedIn" ? "in" : s.name === "GitHub" ? "gh" : s.name === "Instagram" ? "ig" : "tt"}
                      </span>
                      {s.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ── Footer ──────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="py-12 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #2a1a10, #3d0e16)" }} role="contentinfo">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <p className="font-display text-3xl font-semibold text-white">ROSITA DIOUF</p>
            <p className="text-sm text-[#DCC7AD]/60 mt-2">
              Assistante Digital · UI/UX · Design · Communication · Innovation
            </p>
          </div>

          <div className="flex items-center gap-4">
            {["LinkedIn", "GitHub", "Instagram", "TikTok"].map((s) => (
              <a
                key={s}
                href="#"
                className="w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-200 hover:bg-[#7B1E2B] hover:border-[#7B1E2B]"
                style={{ borderColor: "rgba(220,199,173,0.3)", color: "#DCC7AD" }}
                aria-label={s}
              >
                <span className="text-xs font-mono-custom">
                  {s === "LinkedIn" ? "in" : s === "GitHub" ? "gh" : s === "Instagram" ? "ig" : "tt"}
                </span>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center">
          <p className="text-sm text-[#DCC7AD]/40 font-mono-custom">
            © 2026 Rosita Diouf — Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ── App ────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <About />
        <DigitalProfile />
        <Skills />
        <Services />
        <Projects />
        <MelovoxCaseStudy />
        <Journey />
        <Tools />
        <Philosophy />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
