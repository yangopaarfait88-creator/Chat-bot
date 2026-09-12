import React, { useState, useRef, useEffect } from "react";
import {
  Home,
  MessageCircle,
  MapPin,
  AlertTriangle,
  Globe,
  Phone,
  Navigation,
  Send,
  Thermometer,
  UtensilsCrossed,
  Stethoscope,
} from "lucide-react";

/**
 * DOKTÈ BOT — SUNU SANTE
 * Plateforme de santé communautaire pour Bangui, RCA.
 *
 * Choix techniques pour réseau lent / téléphones bas de gamme :
 * - Pas d'images distantes, uniquement des icônes SVG (lucide-react).
 * - Pas d'animations lourdes, transitions courtes (150-200ms).
 * - Un seul fichier, état géré en local avec useState (pas de librairie de routing).
 * - Cartes à bordures plates plutôt que des ombres coûteuses au rendu.
 *
 * ⚠️ IMPORTANT : les centres de santé, numéros de téléphone et le numéro
 * d'urgence ci-dessous sont des EXEMPLES PLACEHOLDER. Avant mise en
 * production, remplacer par des données vérifiées auprès du Ministère de
 * la Santé (RCA) — une mauvaise info ici peut mettre des vies en danger.
 *
 * ⚠️ Les textes en Sango au-delà du glossaire fourni par le client sont
 * une TRADUCTION D'ESSAI et doivent être relus par un locuteur natif
 * avant publication.
 */

// ---------------------------------------------------------------------------
// TRADUCTIONS
// ---------------------------------------------------------------------------
const translations = {
  fr: {
    // -- fournies par le client --
    accueil: "Accueil",
    chat: "Parler au Bot",
    cs: "Centres de Santé",
    urgence: "Urgence",
    slogan: "Sunu Sante : votre santé d'abord",
    fièvre: "J'ai de la fièvre",
    ventre: "Mal de ventre",
    nutrition: "Conseil Nutrition",
    utiliser_pos: "Utiliser ma position",
    appeler: "Appeler",
    // -- complémentaires --
    quickActionsTitle: "Que ressentez-vous aujourd'hui ?",
    quickActionsSub: "Choisissez un symptôme pour en parler au bot",
    chatTitle: "Doktè Bot",
    chatPlaceholder: "Écrivez votre question ici...",
    chatWelcome:
      "Bonjour, je suis Doktè Bot. Décrivez-moi ce que vous ressentez, ou choisissez un symptôme sur l'écran Accueil.",
    chatDisclaimer:
      "Je ne remplace pas un médecin. En cas de danger, appelez l'urgence.",
    csTitle: "Centres de santé près de vous",
    csSub: "Exemples de centres — vérifiez les infos avant de vous déplacer",
    distance: "Distance",
    address: "Adresse",
    locating: "Recherche de votre position...",
    locationError:
      "Position indisponible. Vérifiez que la localisation est activée.",
    urgenceTitle: "Besoin d'aide immédiate",
    urgenceSub:
      "En cas de danger vital (accident grave, saignement important, difficulté à respirer, perte de connaissance), appelez tout de suite.",
    urgenceCallLabel: "Appeler les urgences",
    urgenceTip1: "Restez calme et parlez lentement au téléphone",
    urgenceTip2: "Donnez votre quartier et un point de repère connu",
    urgenceTip3: "Ne raccrochez pas avant qu'on vous le dise",
    firstAidTitle: "En attendant les secours",
    firstAid1: "Ne déplacez pas une personne blessée gravement",
    firstAid2: "Gardez la personne au calme et couverte",
    firstAid3: "Ne donnez rien à boire à une personne inconsciente",
  },
  sg: {
    // -- fournies par le client --
    accueil: "Kua",
    chat: "Wâli na Doktè Bot",
    cs: "Bara Wana Sïö",
    urgence: "Afa",
    slogan: "Sunu Sante : bara mo so ti mo",
    fièvre: "Mbi yeke gbe",
    ventre: "Mbi yeke yê na tene",
    nutrition: "Bâa na mbï",
    utiliser_pos: "Yeke da mo na mbi",
    appeler: "Foni",
    // -- complémentaires (essai — à relire par un locuteur natif) --
    quickActionsTitle: "Mo yeke sara nyen laso ?",
    quickActionsSub: "Soro mbeni kpälë ti sïö na wâli na bot",
    chatTitle: "Doktè Bot",
    chatPlaceholder: "Sû tënë ti mo ge...",
    chatWelcome:
      "Bara mo, mbi yeke Doktè Bot. Fa na mbi ye so mo yeke sara, wala soro kpälë na yâ ti Kua.",
    chatDisclaimer:
      "Mbi yeke doktè pëpë. Tongana afa ayeke, foni na numero ti Afa.",
    csTitle: "Bara wana sïö so ayeke ndurü na mo",
    csSub: "Kpene tî bara — bâa nzönî ndëmö kozo ti gue",
    distance: "Yongoro",
    address: "Ndo",
    locating: "Mbi yeke gi ndo ti mo...",
    locationError: "Ndo ti mo ayeke pëpë. Bâa GPS ti mo.",
    urgenceTitle: "Mo bezoin ti mabe hîo",
    urgenceSub:
      "Tongana kpälë ayeke ngangü (kota kasa, mênë asigi mingi, mo yeke louse pëpë, mo tï gbïnï), foni hîo.",
    urgenceCallLabel: "Foni na Afa",
    urgenceTip1: "Duti nzönî, sâra tënë senge senge na telefon",
    urgenceTip2: "Fa quartier ti mo na mbeni ye so ayeke hînga",
    urgenceTip3: "Kanga telefon pëpë kozo ala tene mo",
    firstAidTitle: "Na ngoi so mo yeke ku amoto ti afa",
    firstAid1: "Zî pëpë zo so akä ngangü",
    firstAid2: "Zia zo ni aduti nzönî na kâmba",
    firstAid3: "Mu ngu pëpë na zo so alï gbïnï",
  },
};

// ---------------------------------------------------------------------------
// DONNÉES D'EXEMPLE (placeholder — à remplacer par des données vérifiées)
// ---------------------------------------------------------------------------
const healthCenters = [
  {
    id: 1,
    name: "Hôpital Communautaire de Bangui (exemple)",
    address: "Avenue de l'Indépendance, Bangui",
    phone: "+236 00 00 00 01",
    lat: 4.3947,
    lon: 18.5582,
  },
  {
    id: 2,
    name: "Centre de Santé Castors (exemple)",
    address: "Quartier Castors, Bangui",
    phone: "+236 00 00 00 02",
    lat: 4.3712,
    lon: 18.5601,
  },
  {
    id: 3,
    name: "Complexe Pédiatrique (exemple)",
    address: "Avenue Boganda, Bangui",
    phone: "+236 00 00 00 03",
    lat: 4.3888,
    lon: 18.5531,
  },
];

// Numéro d'urgence PLACEHOLDER — à remplacer par le vrai numéro local.
const EMERGENCY_NUMBER = "+236 00 00 00 00";

// ---------------------------------------------------------------------------
// LOGIQUE DU BOT (réponses locales simples, sans appel réseau)
// ---------------------------------------------------------------------------
function getBotReply(userText, lang) {
  const text = userText.toLowerCase();

  const isFever = /fièvre|fievre|chaud|gbe/.test(text);
  const isStomach = /ventre|tene|estomac/.test(text);
  const isNutrition = /nutrition|manger|mbï|repas/.test(text);

  if (lang === "sg") {
    if (isFever)
      return "Mo nyö ngu mingi, mo lâ na ndo ti hongo. Tongana gbe ayeke ngangü ndâli ti lâ 2, gue na bara wana sïö.";
    if (isStomach)
      return "Mo nyö ngu, mo te kobe senge senge. Tongana pasi angbâ, gue na bara wana sïö.";
    if (isNutrition)
      return "Te légumes na fruits mingi, nyö ngu töngana ngu 8 na lâ oko. Kete kobe use na lâ oko ahon oko kota kobe.";
    return "Mbi mä ye so mo tene. Soro mbeni kpälë na yâ ti Kua wala fa na mbi kete tënë mbeni.";
  }

  if (isFever)
    return "Buvez beaucoup d'eau et reposez-vous dans un endroit frais. Si la fièvre dure plus de 2 jours, ou si elle s'accompagne de convulsions ou de forte fatigue, rendez-vous dans un centre de santé.";
  if (isStomach)
    return "Buvez de l'eau propre et mangez léger. Si la douleur est très forte, s'il y a du sang, ou si elle persiste plus de 24h, consultez un centre de santé.";
  if (isNutrition)
    return "Privilégiez légumes, fruits et féculents variés, et buvez environ 8 verres d'eau propre par jour. Plusieurs petits repas valent mieux qu'un seul gros repas.";
  return "Je note votre message. Pouvez-vous préciser vos symptômes ? Vous pouvez aussi choisir un symptôme sur l'écran Accueil.";
}

// ---------------------------------------------------------------------------
// COMPOSANT PRINCIPAL
// ---------------------------------------------------------------------------
export default function App() {
  const [lang, setLang] = useState("fr"); // "fr" par défaut, comme demandé
  const [screen, setScreen] = useState("accueil"); // accueil | chat | cs | urgence
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [coords, setCoords] = useState(null);
  const [locStatus, setLocStatus] = useState("idle"); // idle | loading | error

  const t = translations[lang];
  const chatEndRef = useRef(null);

  // Message d'accueil du bot, une seule fois
  useEffect(() => {
    setMessages([{ from: "bot", text: t.chatWelcome }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Défilement automatique vers le bas du chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, screen]);

  const toggleLang = () => setLang((l) => (l === "fr" ? "sg" : "fr"));

  // Envoie un message utilisateur (texte libre ou raccourci depuis Accueil)
  const sendMessage = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const botText = getBotReply(trimmed, lang);
    setMessages((m) => [
      ...m,
      { from: "user", text: trimmed },
      { from: "bot", text: botText },
    ]);
    setDraft("");
    setScreen("chat");
  };

  const handleGeolocate = () => {
    setLocStatus("loading");
    if (!navigator.geolocation) {
      setLocStatus("error");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
        setLocStatus("idle");
      },
      () => setLocStatus("error"),
      { timeout: 8000 }
    );
  };

  // Distance approximative (km) — formule de Haversine, suffisante pour un tri simple
  const distanceKm = (center) => {
    if (!coords) return null;
    const R = 6371;
    const dLat = ((center.lat - coords.lat) * Math.PI) / 180;
    const dLon = ((center.lon - coords.lon) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((coords.lat * Math.PI) / 180) *
        Math.cos((center.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  const sortedCenters = coords
    ? [...healthCenters].sort((a, b) => distanceKm(a) - distanceKm(b))
    : healthCenters;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center font-sans text-gray-900">
      {/* Cadre mobile : plein écran sur téléphone, colonne centrée sur grand écran */}
      <div className="w-full max-w-[420px] min-h-screen bg-white flex flex-col relative">
        <TopBar lang={lang} onToggleLang={toggleLang} t={t} />

        <main className="flex-1 overflow-y-auto pb-20">
          {screen === "accueil" && (
            <AccueilScreen t={t} onQuickAction={sendMessage} onGoUrgence={() => setScreen("urgence")} />
          )}
          {screen === "chat" && (
            <ChatScreen
              t={t}
              messages={messages}
              draft={draft}
              setDraft={setDraft}
              onSend={() => sendMessage(draft)}
              chatEndRef={chatEndRef}
            />
          )}
          {screen === "cs" && (
            <CentresScreen
              t={t}
              centers={sortedCenters}
              coords={coords}
              locStatus={locStatus}
              onLocate={handleGeolocate}
              distanceKm={distanceKm}
            />
          )}
          {screen === "urgence" && <UrgenceScreen t={t} />}
        </main>

        <BottomNav screen={screen} setScreen={setScreen} t={t} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// BARRE DU HAUT
// ---------------------------------------------------------------------------
function TopBar({ lang, onToggleLang, t }) {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
          <Stethoscope className="w-5 h-5 text-white" />
        </div>
        <span className="font-semibold text-base leading-tight">Doktè Bot</span>
      </div>

      <button
        onClick={onToggleLang}
        className="flex items-center gap-1.5 border border-gray-300 rounded-full px-3 py-1.5 text-sm font-medium min-h-[36px] active:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        aria-label="Changer de langue / Yeke changé ti yângâ"
      >
        <Globe className="w-4 h-4 text-emerald-600" />
        <span className={lang === "fr" ? "text-gray-900" : "text-gray-400"}>Fr</span>
        <span className="text-gray-300">/</span>
        <span className={lang === "sg" ? "text-gray-900" : "text-gray-400"}>Sango</span>
      </button>
    </header>
  );
}

// ---------------------------------------------------------------------------
// ÉCRAN 1 : ACCUEIL
// ---------------------------------------------------------------------------
function AccueilScreen({ t, onQuickAction, onGoUrgence }) {
  return (
    <div className="px-4 pt-5 pb-4">
      {/* Bloc slogan */}
      <section className="bg-emerald-500 rounded-2xl px-5 py-6 mb-5">
        <p className="text-white text-lg font-semibold leading-snug">{t.slogan}</p>
      </section>

      {/* Actions rapides */}
      <section>
        <h2 className="text-base font-semibold mb-1">{t.quickActionsTitle}</h2>
        <p className="text-sm text-gray-500 mb-3">{t.quickActionsSub}</p>

        <div className="flex flex-col gap-3">
          <QuickActionButton
            icon={<Thermometer className="w-5 h-5" />}
            label={t.fièvre}
            onClick={() => onQuickAction(t.fièvre)}
          />
          <QuickActionButton
            icon={<AlertTriangle className="w-5 h-5" />}
            label={t.ventre}
            onClick={() => onQuickAction(t.ventre)}
          />
          <QuickActionButton
            icon={<UtensilsCrossed className="w-5 h-5" />}
            label={t.nutrition}
            onClick={() => onQuickAction(t.nutrition)}
          />
        </div>
      </section>

      {/* Bandeau urgence toujours visible */}
      <button
        onClick={onGoUrgence}
        className="mt-6 w-full flex items-center justify-center gap-2 bg-red-500 text-white rounded-2xl py-4 font-semibold min-h-[52px] active:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
      >
        <AlertTriangle className="w-5 h-5" />
        {t.urgence}
      </button>
    </div>
  );
}

function QuickActionButton({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-4 py-3.5 min-h-[52px] text-left active:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
    >
      <span className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
        {icon}
      </span>
      <span className="font-medium text-[15px]">{label}</span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// ÉCRAN 2 : CHAT
// ---------------------------------------------------------------------------
function ChatScreen({ t, messages, draft, setDraft, onSend, chatEndRef }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") onSend();
  };

  return (
    <div className="flex flex-col h-full min-h-[70vh]">
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-base font-semibold">{t.chatTitle}</h2>
        <p className="text-xs text-gray-500 mt-0.5">{t.chatDisclaimer}</p>
      </div>

      <div className="flex-1 px-4 py-2 flex flex-col gap-2.5 overflow-y-auto">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-[15px] leading-snug ${
              m.from === "bot"
                ? "bg-gray-100 text-gray-900 self-start rounded-tl-sm"
                : "bg-emerald-500 text-white self-end rounded-tr-sm"
            }`}
          >
            {m.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="px-3 py-3 border-t border-gray-200 flex items-center gap-2 bg-white">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t.chatPlaceholder}
          className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-[15px] min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        />
        <button
          onClick={onSend}
          aria-label={t.chat}
          className="w-11 h-11 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 active:bg-emerald-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
        >
          <Send className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ÉCRAN 3 : CENTRES DE SANTÉ
// ---------------------------------------------------------------------------
function CentresScreen({ t }) {
  const [centers, setCenters] = useState([]);
  const [coords, setCoords] = useState(null);
  const [locStatus, setLocStatus] = useState("idle"); // idle | loading | error

  const API_URL = "https://ton-api-railway.up.railway.app"; // <-- Tu mettras ton lien ici

  const handleGeolocate = () => {
    setLocStatus("loading");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setCoords({ lat, lon });

        // Appel à l'API Flask
        try {
          const res = await fetch(`${API_URL}/api/cs-proches?lat=${lat}&lon=${lon}`);
          const data = await res.json();
          setCenters(data);
          setLocStatus("idle");
        } catch (err) {
          setLocStatus("error");
        }
      },
      () => setLocStatus("error"),
      { timeout: 8000 }
    );
  };

  return (
    <div className="px-4 pt-5 pb-4">
      <h2 className="text-base font-semibold mb-1">{t.csTitle}</h2>
      <p className="text-sm text-gray-500 mb-4">{t.csSub}</p>

      <button
        onClick={handleGeolocate}
        className="w-full flex items-center justify-center gap-2 border border-emerald-500 text-emerald-600 rounded-2xl py-3 font-medium min-h-[48px] mb-4 active:bg-emerald-50"
      >
        <Navigation className="w-4 h-4" />
        {t.utiliser_pos}
      </button>

      {locStatus === "loading" && <p className="text-sm text-gray-500 mb-3">{t.locating}</p>}
      {locStatus === "error" && <p className="text-sm text-red-500 mb-3">{t.locationError}</p>}

      <div className="flex flex-col gap-3">
        {centers.map((c) => (
          <div key={c.id} className="border border-gray-200 rounded-2xl px-4 py-3.5">
            <div className="flex items-start gap-2.5">
              <span className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </span>
              <div className="flex-1">
                <p className="font-medium text-[15px]">{c.nom}</p>
                <p className="text-sm text-gray-500">{c.quartier}</p>
                <p className="text-sm text-emerald-600 font-medium">{t.distance} : {c.distance} km</p>
              </div>
            </div>
            <a href={`tel:${c.tel}`} className="mt-3 w-full flex items-center justify-center gap-2 bg-emerald-500 text-white rounded-xl py-2.5 font-medium">
              <Phone className="w-4 h-4" />
              {t.appeler}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ÉCRAN 4 : URGENCE
// ---------------------------------------------------------------------------
function UrgenceScreen({ t }) {
  return (
    <div className="px-4 pt-5 pb-4">
      <div className="flex items-center gap-2.5 mb-2">
        <span className="w-9 h-9 rounded-full bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </span>
        <h2 className="text-base font-semibold">{t.urgenceTitle}</h2>
      </div>
      <p className="text-sm text-gray-600 mb-5 leading-relaxed">{t.urgenceSub}</p>

      <a
        href={`tel:${EMERGENCY_NUMBER.replace(/\s/g, "")}`}
        className="w-full flex flex-col items-center justify-center gap-1 bg-red-500 text-white rounded-2xl py-5 font-semibold min-h-[64px] active:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
      >
        <span className="flex items-center gap-2 text-lg">
          <Phone className="w-5 h-5" />
          {t.urgenceCallLabel}
        </span>
        <span className="text-red-100 text-sm">{EMERGENCY_NUMBER}</span>
      </a>

      <div className="mt-5 flex flex-col gap-2">
        <TipRow text={t.urgenceTip1} />
        <TipRow text={t.urgenceTip2} />
        <TipRow text={t.urgenceTip3} />
      </div>

      <div className="mt-6 border-t border-gray-200 pt-4">
        <h3 className="text-sm font-semibold mb-2">{t.firstAidTitle}</h3>
        <div className="flex flex-col gap-2">
          <TipRow text={t.firstAid1} />
          <TipRow text={t.firstAid2} />
          <TipRow text={t.firstAid3} />
        </div>
      </div>
    </div>
  );
}

function TipRow({ text }) {
  return (
    <div className="flex items-start gap-2.5 bg-gray-100 rounded-xl px-3.5 py-3">
      <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0 mt-2" />
      <p className="text-sm text-gray-700 leading-snug">{text}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// NAVIGATION DU BAS
// ---------------------------------------------------------------------------
function BottomNav({ screen, setScreen, t }) {
  const items = [
    { key: "accueil", label: t.accueil, icon: Home },
    { key: "chat", label: t.chat, icon: MessageCircle },
    { key: "cs", label: t.cs, icon: MapPin },
    { key: "urgence", label: t.urgence, icon: AlertTriangle },
  ];

  return (
    <nav className="fixed bottom-0 w-full max-w-[420px] bg-white border-t border-gray-200 flex items-stretch z-10">
      {items.map(({ key, label, icon: Icon }) => {
        const active = screen === key;
        const isUrgence = key === "urgence";
        return (
          <button
            key={key}
            onClick={() => setScreen(key)}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 min-h-[60px] focus:outline-none ${
              active ? "text-emerald-600" : isUrgence ? "text-red-500" : "text-gray-400"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[11px] font-medium leading-tight text-center px-0.5">
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
