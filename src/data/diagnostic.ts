export type FocusAnswer = 'ai-only' | 'site-and-ai' | 'site-only';

export type AiChoiceId =
  | 'mini-app'
  | 'studio-contenu-ia'
  | 'assistant-ia-247'
  | 'auto-workflow-ia'
  | 'app-interne-ia'
  | 'systeme-multi-agents'
  | 'outil-ia-personnalise';

export type SiteNeedId =
  | 'deja-site'
  | 'gmb-pack'
  | 'vitrine-essentiel'
  | 'vitrine-impact'
  | 'vitrine-pro'
  | 'ecommerce-cle'
  | 'elearning-platform'
  | 'webapp-saas';

export type BoostChoiceId =
  | 'media-drone'
  | 'identite-logo'
  | 'configurateur-3d'
  | 'pack-legal';

export type MonthlyGrowthId = 'seo-mensuel' | 'geo-ia' | 'sea-ads';

export type CareChoiceId =
  | 'aucun-abo'
  | 'maint-essentielle'
  | 'maint-active';

export interface DiagnosticAnswers {
  focus: FocusAnswer;
  aiChoices: AiChoiceId[];
  siteNeed: SiteNeedId;
  boostChoices: BoostChoiceId[];
  monthlyGrowthChoices: MonthlyGrowthId[];
  care: CareChoiceId;
}

export interface QuizChoice<T extends string> {
  id: T;
  title: string;
  description: string;
  iconName: string;
  tag?: string;
}

export const DEFAULT_ANSWERS: DiagnosticAnswers = {
  focus: 'site-and-ai',
  aiChoices: [],
  siteNeed: 'vitrine-impact',
  boostChoices: [],
  monthlyGrowthChoices: [],
  care: 'maint-essentielle',
};

export const QUIZ_STEPS = [
  {
    num: '01',
    short: 'Votre projet',
    title: '1. Aujourd’hui, que voulez-vous mettre en place pour votre entreprise ?',
  },
  {
    num: '02',
    short: 'Outils & Apps IA',
    title: '2. Quels outils IA ou applications internes vous aideraient le plus au quotidien ?',
  },
  {
    num: '03',
    short: 'Site / Plateforme',
    title: '3. Côté Site Internet ou Plateforme, de quoi avez-vous besoin ?',
  },
  {
    num: '04',
    short: 'Google, Photos & Suivi',
    title: '4. Dernière étape : Visibilité Google, Photos & Suivi',
  },
] as const;

export const FOCUS_CHOICES: QuizChoice<FocusAnswer>[] = [
  {
    id: 'ai-only',
    title: 'Créer un Outil IA ou une Application Interne pour mon entreprise',
    description:
      'Gagner du temps tous les jours : appli interne sur-mesure, devis PDF automatiques, rédaction Google/réseaux, assistant client 24h/24 ou tri d’emails.',
    iconName: 'Bot',
    tag: 'Spécialité IA · Sans refaire de site',
  },
  {
    id: 'site-and-ai',
    title: 'Un Site Internet Pro + Des Outils IA pour automatiser et attirer des clients',
    description:
      'La totale : une vraie vitrine ou boutique moderne qui attire des clients + des outils IA qui travaillent pour moi.',
    iconName: 'Layers',
    tag: 'Le duo gagnant',
  },
  {
    id: 'site-only',
    title: 'Uniquement un Site Internet, une Boutique en ligne ou une Fiche Google',
    description:
      'Être bien visible sur Google, montrer mon travail proprement et recevoir plus d’appels, de devis ou de commandes.',
    iconName: 'Rocket',
  },
];

export const AI_DIAGNOSTIC_CHOICES: QuizChoice<AiChoiceId>[] = [
  {
    id: 'mini-app',
    title: 'Une Mini-App sur mon téléphone pour un besoin précis (zéro abonnement)',
    description:
      'Ex concret : Calculateur de prix rapide sur chantier, petit outil de devis ou de commande interne.',
    iconName: 'Smartphone',
    tag: '250 € · 0 € / mois',
  },
  {
    id: 'studio-contenu-ia',
    title: 'Une App Interne IA qui rédige mes textes Google & posts réseaux en 2 clics',
    description:
      'Ex concret : Vous mettez une photo de chantier ou produit → l’application écrit le texte parfait toute seule.',
    iconName: 'PenTool',
    tag: '490 €',
  },
  {
    id: 'assistant-ia-247',
    title: 'Un Assistant IA qui répond aux clients 24h/24 sur mon site & WhatsApp',
    description:
      'Ex concret : Renseigne vos vrais tarifs le soir et le week-end et prend le numéro du client.',
    iconName: 'Bot',
    tag: '490 €',
  },
  {
    id: 'auto-workflow-ia',
    title: 'Génération automatique de mes Devis PDF, Factures & Relances clients',
    description:
      'Ex concret : Plus de paperasse le soir, les devis PDF propres et les relances partent tout seuls.',
    iconName: 'Workflow',
    tag: '690 €',
  },
  {
    id: 'app-interne-ia',
    title: 'Une Application Interne IA pour gérer mon activité (chantiers, stock, équipe)',
    description:
      'Ex concret : Notes vocales résumées par IA, suivi photo par dossier, gestion véhicules ou planning.',
    iconName: 'Layers',
    tag: '890 € · App interne',
  },
  {
    id: 'systeme-multi-agents',
    title: 'Un Assistant IA Administratif complet (tri d’emails, lecture de factures, prospection)',
    description:
      'Ex concret : L’IA lit vos mails et documents PDF, prépare les réponses et classe tout pour vous.',
    iconName: 'Cpu',
    tag: 'Dès 1 290 € · Sur-mesure',
  },
  {
    id: 'outil-ia-personnalise',
    title: 'Autre besoin : un Outil IA ou une Application 100 % Personnalisée',
    description:
      'Ex concret : Vous avez une idée précise ou un besoin propre à votre métier ? Expliquez-nous votre idée et on crée l’outil sur-mesure.',
    iconName: 'Settings2',
    tag: 'Sur mesure',
  },
];

export const SITE_NEED_CHOICES: QuizChoice<SiteNeedId>[] = [
  {
    id: 'deja-site',
    title: 'Pas besoin de créer de site internet',
    description:
      'Je veux uniquement mes outils IA / applications internes (ou j’ai déjà un site qui me convient).',
    iconName: 'CheckCircle2',
    tag: '0 € de création site',
  },
  {
    id: 'gmb-pack',
    title: 'Juste une Fiche Google Maps optimisée pour sortir dans ma ville',
    description:
      'Idéal pour recevoir des appels locaux sans créer de site. Offerte (0 €) si vous prenez un site.',
    iconName: 'MapPin',
    tag: '290 € · Offerte avec un site',
  },
  {
    id: 'vitrine-essentiel',
    title: 'Un Site Simple & Pro en 1 page pour présenter l’essentiel',
    description:
      'Parfait pour être crédible tout de suite et être appelé facilement sur téléphone.',
    iconName: 'Rocket',
    tag: '690 €',
  },
  {
    id: 'vitrine-impact',
    title: 'Un Site Complet (plusieurs pages) pour montrer mes services, photos & avis',
    description:
      'Le format idéal pour rassurer les clients et recevoir des demandes de devis qualifiées.',
    iconName: 'Globe',
    tag: 'Le plus demandé · 890 €',
  },
  {
    id: 'vitrine-pro',
    title: 'Un Site Haut de Gamme avec animations ou expérience 3D',
    description: 'Pour marquer les esprits et surclasser tous vos concurrents.',
    iconName: 'Crown',
    tag: '1 290 €',
  },
  {
    id: 'ecommerce-cle',
    title: 'Une Boutique en ligne pour vendre mes produits par Carte Bancaire',
    description: 'Catalogue, panier, paiement CB / Apple Pay et gestion des commandes.',
    iconName: 'ShoppingBag',
    tag: '1 490 €',
  },
  {
    id: 'elearning-platform',
    title: 'Une Plateforme pour vendre mes Formations / Cours en ligne',
    description: 'Espace élève avec mot de passe, vidéos, PDF et paiement en ligne.',
    iconName: 'GraduationCap',
    tag: '1 490 €',
  },
  {
    id: 'webapp-saas',
    title: 'Un Portail Client ou Logiciel en ligne sur-mesure (Application / SaaS)',
    description: 'Espace client privé, portail grossiste ou plateforme métier complète.',
    iconName: 'LayoutPanelTop',
    tag: 'Dès 1 990 €',
  },
];

export const BOOST_DIAGNOSTIC_CHOICES: QuizChoice<BoostChoiceId>[] = [
  {
    id: 'media-drone',
    title: 'Faire venir JAAD Studio pour un Shooting Photo, Vidéo & Drone 4K',
    description:
      'De vraies images de votre équipe, atelier ou chantiers pour remplacer les photos génériques.',
    iconName: 'Camera',
    tag: '+390 € (en 1 fois)',
  },
  {
    id: 'identite-logo',
    title: 'Créer ou moderniser mon Logo & mes Cartes de visite',
    description: 'Une identité moderne et prête pour vos véhicules, devis et réseaux.',
    iconName: 'Palette',
    tag: '+290 € (en 1 fois)',
  },
  {
    id: 'configurateur-3d',
    title: 'Ajouter un simulateur de prix / configurateur interactif',
    description:
      'Vos clients testent leurs options en direct avant de demander leur devis.',
    iconName: 'Box',
    tag: '+390 € (en 1 fois)',
  },
  {
    id: 'pack-legal',
    title: 'Rédiger mes Mentions légales, RGPD & Conditions Générales (CGV)',
    description:
      'Textes obligatoires prêts dès le 1er jour (option relecture par avocat disponible sur devis).',
    iconName: 'Scale',
    tag: '+120 € (en 1 fois)',
  },
];

export const MONTHLY_GROWTH_DIAGNOSTIC_CHOICES: QuizChoice<MonthlyGrowthId>[] = [
  {
    id: 'seo-mensuel',
    title: 'Suivi SEO Mensuel pour monter sur Google chaque mois',
    description:
      'Articles locaux, optimisation Google Business et suivi de vos positions chaque mois.',
    iconName: 'Search',
    tag: '149 € / mois',
  },
  {
    id: 'geo-ia',
    title: 'Référencement IA (être recommandé par ChatGPT, Gemini & Perplexity)',
    description:
      'Travail mensuel pour que les IA citent votre entreprise quand un client cherche votre métier.',
    iconName: 'Compass',
    tag: '149 € / mois',
  },
  {
    id: 'sea-ads',
    title: 'Gestion Google Ads (publicité Google, hors budget clic)',
    description:
      'Pilotage continu de vos campagnes pour recevoir des appels rapides et rentables.',
    iconName: 'TrendingUp',
    tag: '190 € / mois',
  },
];

export const CARE_DIAGNOSTIC_CHOICES: QuizChoice<CareChoiceId>[] = [
  {
    id: 'aucun-abo',
    title: 'Je gère tout seul — 0 € / mois (Aucun abonnement)',
    description: 'Vous payez uniquement la création et gardez 100 % la main.',
    iconName: 'Check',
    tag: '0 €/mois',
  },
  {
    id: 'maint-essentielle',
    title: 'Vous gérez l’hébergement, la sécurité et la technique (49 €/mois)',
    description: 'Nom de domaine, sauvegardes, sécurité et petites modifications.',
    iconName: 'ShieldCheck',
    tag: '49 €/mois',
  },
  {
    id: 'maint-active',
    title: 'Je vous envoie mes nouveautés sur WhatsApp et vous mettez tout à jour (99 €/mois)',
    description: 'Photos, véhicules, chantiers ou promos ajoutés pour vous chaque semaine.',
    iconName: 'Zap',
    tag: '99 €/mois · Pratique',
  },
];

export interface DiagnosticRecommendation {
  baseId: SiteNeedId;
  aiIds: AiChoiceId[];
  boostIds: BoostChoiceId[];
  monthlyGrowthIds: MonthlyGrowthId[];
  careId: CareChoiceId;
  headline: string;
  explanation: string;
  diagnosticSummaryText: string;
}

const FOCUS_LABEL: Record<FocusAnswer, string> = {
  'ai-only': 'Outils IA & Applications Internes',
  'site-and-ai': 'Site Internet + Outils IA',
  'site-only': 'Site Internet / Visibilité Google',
};

export function computeRecommendation(
  answers: DiagnosticAnswers
): DiagnosticRecommendation {
  const baseId: SiteNeedId = answers.siteNeed;
  // If user specifically chose "AI only" and forgot to check an AI item on step 2, pre-select Mini-App
  const aiIds: AiChoiceId[] =
    answers.focus === 'ai-only' && answers.aiChoices.length === 0
      ? ['mini-app']
      : answers.aiChoices;

  const boostIds: BoostChoiceId[] = answers.boostChoices;

  const hasSite = baseId !== 'deja-site';
  const hasAi = aiIds.length > 0;

  let headline = 'Voici votre projet sur-mesure';
  if (!hasSite && hasAi) {
    headline = 'Votre solution sur-mesure : Outils IA & Application Interne';
  } else if (hasSite && hasAi) {
    headline = 'Votre duo gagnant : Site / Plateforme + Outils IA sur-mesure';
  } else if (baseId === 'gmb-pack') {
    headline = 'Votre projet : Être visible rapidement sur Google Maps';
  } else if (baseId === 'ecommerce-cle') {
    headline = 'Votre projet : Boutique en Ligne Clé en Main (24h/24)';
  } else if (baseId === 'elearning-platform') {
    headline = 'Votre projet : Plateforme de Formation en Ligne (E-Learning)';
  } else if (baseId === 'webapp-saas') {
    headline = 'Votre projet : Portail Client ou Plateforme Métier Sur-Mesure';
  } else if (hasSite) {
    headline = 'Votre solution web clé en main sur-mesure';
  }

  const lines: string[] = [];
  if (!hasSite && hasAi) {
    lines.push(
      `Vous avez choisi de vous concentrer à 100 % sur vos outils IA (${aiIds.length} solution${aiIds.length > 1 ? 's' : ''}) sans frais inutiles de création de site.`
    );
  } else if (hasSite && hasAi) {
    lines.push(
      `Vous combinez une vraie présence professionnelle en ligne avec ${aiIds.length} outil${aiIds.length > 1 ? 's' : ''} IA conçu${aiIds.length > 1 ? 's' : ''} pour vous faire gagner du temps chaque semaine.`
    );
  } else if (hasSite) {
    lines.push(
      'Votre projet est cadré de façon claire : pas de superflu, uniquement les éléments indispensables pour rassurer vos clients et générer des demandes.'
    );
  } else {
    lines.push(
      'Sélectionnez au moins un outil IA, une fiche Google ou un type de site ci-dessous pour chiffrer votre projet.'
    );
  }

  lines.push(
    'Tout vous appartient à 100 %, avec paiement simple en 2 fois (30 % au lancement, 70 % à la livraison) et tous les prix affichés TTC sans surprise.'
  );

  const diagnosticSummaryText = `Besoin principal : ${FOCUS_LABEL[answers.focus]} | Outils IA : ${aiIds.length} | Base : ${baseId}`;

  return {
    baseId,
    aiIds,
    boostIds,
    monthlyGrowthIds: answers.monthlyGrowthChoices,
    careId: answers.care,
    headline,
    explanation: lines.join(' '),
    diagnosticSummaryText,
  };
}
