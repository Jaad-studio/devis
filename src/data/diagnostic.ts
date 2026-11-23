export type SectorAnswer =
  | 'artisan-btp'
  | 'garage-showroom'
  | 'commerce-resto'
  | 'formation-coach'
  | 'pme-b2b';

export type SituationAnswer =
  | 'local-only'
  | 'no-site'
  | 'old-site'
  | 'new-launch'
  | 'good-site';

export type GoalAnswer =
  | 'simple-contact'
  | 'more-calls'
  | 'premium-image'
  | 'sell-online'
  | 'train-sell'
  | 'custom-platform'
  | 'save-time';

export type DailyNeedAnswer =
  | 'help-google'
  | 'help-geo'
  | 'help-sea'
  | 'help-mini-app'
  | 'help-whatsapp-ai'
  | 'help-content-ia'
  | 'help-auto-pdf'
  | 'help-3d';

export type VisualAnswer =
  | 'media-ok'
  | 'need-photo'
  | 'need-logo'
  | 'need-legal'
  | 'need-full';

export type CareAnswer =
  | 'aucun-abo'
  | 'maint-essentielle'
  | 'maint-active'
  | 'croissance-seo-ia';

export interface DiagnosticAnswers {
  sector: SectorAnswer;
  situation: SituationAnswer;
  goal: GoalAnswer;
  dailyNeeds: DailyNeedAnswer[];
  visual: VisualAnswer;
  care: CareAnswer;
}

export interface QuizChoice<T extends string> {
  id: T;
  title: string;
  description: string;
  iconName: string;
  tag?: string;
}

export const DEFAULT_ANSWERS: DiagnosticAnswers = {
  sector: 'artisan-btp',
  situation: 'no-site',
  goal: 'more-calls',
  dailyNeeds: ['help-google'],
  visual: 'media-ok',
  care: 'maint-essentielle',
};

export const QUIZ_STEPS = [
  { num: '01', short: 'Activité', title: '1. Quelle est votre activité ?' },
  {
    num: '02',
    short: 'Situation',
    title: '2. Où en êtes-vous aujourd’hui sur Internet ?',
  },
  {
    num: '03',
    short: 'Objectif',
    title: '3. Que voulez-vous permettre à vos clients de faire en priorité ?',
  },
  {
    num: '04',
    short: 'Visibilité & IA',
    title: '4. Comment souhaitez-vous attirer des clients et gagner du temps ?',
  },
  {
    num: '05',
    short: 'Contenus & Suivi',
    title: '5. Vos contenus (Photos, CGV) et le suivi après mise en ligne',
  },
] as const;

export const SECTOR_CHOICES: QuizChoice<SectorAnswer>[] = [
  {
    id: 'artisan-btp',
    title: 'Artisan, BTP & Services locaux',
    description:
      'Couvreur, plombier, rénovation, dépannage, sécurité, paysagiste…',
    iconName: 'Wrench',
  },
  {
    id: 'garage-showroom',
    title: 'Garage Auto, Showroom ou Immobilier',
    description:
      'Véhicules, carrosserie, cuisiniste, menuiserie, agence immobilière…',
    iconName: 'Building2',
  },
  {
    id: 'commerce-resto',
    title: 'Boutique, Marque, Beauté ou Restauration',
    description:
      'Commerce, prêt-à-porter, créateur, salon de beauté, restaurant…',
    iconName: 'ShoppingBag',
  },
  {
    id: 'formation-coach',
    title: 'Organisme de Formation, Coach ou Académie',
    description:
      'Cours en ligne, formations professionnelles, accompagnement, e-learning…',
    iconName: 'GraduationCap',
  },
  {
    id: 'pme-b2b',
    title: 'PME, Cabinet, Agence ou Projet Tech / SaaS',
    description:
      'Entreprise B2B, bureau d’études, services, logiciel métier ou portail…',
    iconName: 'Layers',
  },
];

export const SITUATION_CHOICES: QuizChoice<SituationAnswer>[] = [
  {
    id: 'local-only',
    title: 'Je veux juste être visible rapidement sur Google Maps dans ma ville',
    description: 'Sans forcément créer un gros site tout de suite.',
    iconName: 'MapPin',
    tag: 'Rapide',
  },
  {
    id: 'no-site',
    title: 'Je n’ai pas encore de site internet',
    description: 'Je veux créer ma première vraie vitrine professionnelle.',
    iconName: 'Rocket',
  },
  {
    id: 'old-site',
    title: 'J’ai déjà un site, mais il date ou ne rapporte pas assez de clients',
    description: 'Je veux monter en gamme et convertir davantage.',
    iconName: 'Sparkles',
  },
  {
    id: 'new-launch',
    title: 'Je lance une nouvelle activité, boutique ou offre',
    description: 'Je veux partir sur une base complète, pro et carrée.',
    iconName: 'Crown',
  },
  {
    id: 'good-site',
    title: 'Mon site actuel me convient très bien',
    description:
      'Je veux uniquement lui ajouter de l’IA, du SEO / GEO ou des options ciblées.',
    iconName: 'CheckCircle2',
  },
];

export const GOAL_CHOICES: QuizChoice<GoalAnswer>[] = [
  {
    id: 'simple-contact',
    title:
      'Me trouver facilement, voir l’essentiel sur 1 page et m’appeler / demander un devis',
    description: 'Clair, direct et efficace sans budget inutile.',
    iconName: 'Rocket',
  },
  {
    id: 'more-calls',
    title:
      'Explorer toutes mes prestations & réalisations en détail pour m’envoyer des demandes qualifiées',
    description:
      'Un vrai site complet qui rassure et fait sonner le téléphone.',
    iconName: 'Search',
    tag: 'Le plus choisi',
  },
  {
    id: 'premium-image',
    title:
      'Vivre une expérience haut de gamme / 3D qui surclasse tous mes concurrents',
    description: 'Positionner votre marque tout en haut de son marché.',
    iconName: 'Crown',
  },
  {
    id: 'sell-online',
    title:
      'Acheter mes produits en ligne 24h/24 par Carte Bancaire & Apple Pay',
    description: 'Catalogue, panier, comptes clients et commandes automatisées.',
    iconName: 'ShoppingBag',
  },
  {
    id: 'train-sell',
    title:
      'Suivre mes formations / cours en ligne avec un espace élève sécurisé',
    description: 'Modules vidéo, documents, accès privés et paiements en ligne.',
    iconName: 'GraduationCap',
  },
  {
    id: 'custom-platform',
    title:
      'Se connecter à une application web, un portail métier ou un SaaS sur-mesure',
    description: 'Digitaliser votre service avec un véritable outil en ligne.',
    iconName: 'LayoutPanelTop',
  },
  {
    id: 'save-time',
    title:
      'Automatiser mon quotidien grâce à l’IA (devis PDF, assistant 24/7, mini-app métier)',
    description: 'Gagner des heures chaque semaine sans payer dix logiciels.',
    iconName: 'Bot',
    tag: 'Spécialité IA',
  },
];

export const DAILY_NEED_CHOICES: QuizChoice<DailyNeedAnswer>[] = [
  {
    id: 'help-google',
    title: 'Sortir en haut de Google & Google Maps naturellement (SEO)',
    description:
      'Pour que les clients autour de vous tombent sur vous avant vos concurrents (+290 €).',
    iconName: 'Search',
    tag: 'Recommandé · +290 €',
  },
  {
    id: 'help-geo',
    title:
      'Être recommandé dans les réponses des IA comme ChatGPT & Perplexity (GEO)',
    description:
      'Apparaître quand un client demande un prestataire directement à une IA (+390 €).',
    iconName: 'Sparkles',
    tag: 'Nouveau · +390 €',
  },
  {
    id: 'help-sea',
    title: 'Recevoir des clients tout de suite avec la publicité Google (SEA)',
    description:
      'Campagnes ciblées prêtes à déclencher des appels dès les premiers jours (+390 €).',
    iconName: 'TrendingUp',
    tag: '+390 €',
  },
  {
    id: 'help-mini-app',
    title:
      'Avoir ma propre Mini-App métier privée sans abonnement (devis, SEO, stock)',
    description:
      'Installable sur téléphone, pensée pour un besoin concret sans frais mensuels (+250 €).',
    iconName: 'Smartphone',
    tag: '+250 €',
  },
  {
    id: 'help-whatsapp-ai',
    title:
      'Un assistant IA qui répond aux clients 24h/24 sur mon site & WhatsApp',
    description:
      'Renseigne vos tarifs/services même le soir et le week-end et qualifie le prospect (+490 €).',
    iconName: 'Bot',
    tag: '+490 €',
  },
  {
    id: 'help-content-ia',
    title: 'Générer mes posts réseaux & articles Google en 2 clics (Studio IA)',
    description:
      'Votre propre générateur privé adapté à votre ton et vos mots-clés (+490 €).',
    iconName: 'Wand2',
    tag: '+490 €',
  },
  {
    id: 'help-auto-pdf',
    title: 'Automatiser mes devis PDF, dossiers et relances clients',
    description:
      'Fini les copier-coller le soir : tout part et se classe automatiquement (+690 €).',
    iconName: 'Workflow',
    tag: '+690 €',
  },
  {
    id: 'help-3d',
    title: 'Intégrer un simulateur ou configurateur 3D interactif',
    description:
      'Vos visiteurs visualisent ou chiffrent leurs choix avant de vous contacter (+390 €).',
    iconName: 'Box',
    tag: '+390 €',
  },
];

export const VISUAL_CHOICES: QuizChoice<VisualAnswer>[] = [
  {
    id: 'media-ok',
    title: 'Oui, j’ai déjà mes visuels et mentions prêtes',
    description: 'Aucune option visuelle ou juridique supplémentaire à prévoir.',
    iconName: 'Check',
    tag: '0 €',
  },
  {
    id: 'need-photo',
    title: 'Je veux un vrai shooting photo, vidéo & drone 4K sur place',
    description: 'De vraies images de votre équipe, locaux ou chantiers.',
    iconName: 'Camera',
    tag: '+390 €',
  },
  {
    id: 'need-logo',
    title: 'J’aimerais créer ou moderniser mon logo & mes cartes pro',
    description: 'Identité visuelle vectorielle + cartes prêtes à imprimer.',
    iconName: 'Palette',
    tag: '+290 €',
  },
  {
    id: 'need-legal',
    title: 'Je veux être carré sur le juridique (Mentions, RGPD, trame CGV)',
    description: 'Conformité de base (option relecture par avocat sur devis).',
    iconName: 'Scale',
    tag: '+120 €',
  },
  {
    id: 'need-full',
    title: 'Pack complet : Photo / Drone 4K + Logo & Cartes + Pack Légal RGPD',
    description: 'Toute votre image et vos textes légaux gérés en une fois.',
    iconName: 'Sparkles',
    tag: '+800 €',
  },
];

export const CARE_CHOICES: QuizChoice<CareAnswer>[] = [
  {
    id: 'aucun-abo',
    title: 'Je préfère être 100 % autonome, sans abonnement',
    description: 'Vous réglez uniquement la création et gardez 100 % la main.',
    iconName: 'Check',
    tag: '0 €/mois',
  },
  {
    id: 'maint-essentielle',
    title: 'Maintenance & support technique tranquille',
    description: 'Hébergement, domaine, sauvegardes, SSL et petites modifs.',
    iconName: 'ShieldCheck',
    tag: '49 €/mois',
  },
  {
    id: 'maint-active',
    title: 'Gestion Active WhatsApp (mises à jour illimitées par message)',
    description:
      'Vous envoyez vos nouveautés / véhicules / chantiers sur WhatsApp, on publie.',
    iconName: 'Zap',
    tag: '99 €/mois',
  },
  {
    id: 'croissance-seo-ia',
    title: 'Suivi SEO mensuel & optimisation continue IA',
    description:
      'Gestion active + rédaction SEO mensuelle pour grimper sur Google.',
    iconName: 'TrendingUp',
    tag: '189 €/mois',
  },
];

export interface DiagnosticRecommendation {
  baseId: string;
  alternativeBaseIds: string[];
  aiIds: string[];
  boostIds: string[];
  matrixRecommendedIds: string[];
  recommendedCareId: string;
  careId: string;
  diagnosticHeadline: string;
  diagnosticReasoning: string;
  reasonsByItemId: Record<string, string>;
  diagnosticSummaryText: string;
}

const SECTOR_LABEL: Record<SectorAnswer, string> = {
  'artisan-btp': 'Artisan / BTP / Services locaux',
  'garage-showroom': 'Garage / Showroom / Immobilier',
  'commerce-resto': 'Boutique / Marque / Restauration',
  'formation-coach': 'Organisme de Formation / Coach',
  'pme-b2b': 'PME / Cabinet / Projet Tech',
};

const SITUATION_LABEL: Record<SituationAnswer, string> = {
  'local-only': 'Priorité visibilité Google Maps locale',
  'no-site': 'Pas encore de site internet',
  'old-site': 'Refonte pour mieux convertir',
  'new-launch': 'Lancement de nouvelle activité / offre',
  'good-site': 'Site actuel conservé',
};

const GOAL_LABEL: Record<GoalAnswer, string> = {
  'simple-contact': 'Site 1 page / contact rapide',
  'more-calls': 'Générer des appels et devis qualifiés',
  'premium-image': 'Image haut de gamme & 3D',
  'sell-online': 'Vendre en ligne 24h/24',
  'train-sell': 'Former et vendre des cours en ligne',
  'custom-platform': 'Digitaliser via Application / SaaS',
  'save-time': 'Gagner du temps avec l’IA',
};

const MATRIX_R_BY_BASE: Record<string, string[]> = {
  'gmb-pack': ['seo-google', 'media-drone'],
  'vitrine-essentiel': ['seo-google', 'media-drone'],
  'vitrine-impact': ['seo-google', 'geo-ia', 'media-drone'],
  'vitrine-pro': ['seo-google', 'geo-ia', 'media-drone'],
  'ecommerce-cle': ['pack-legal'],
  'elearning-platform': ['seo-google', 'pack-legal'],
  'webapp-saas': ['media-drone'],
  'deja-site': ['seo-google', 'geo-ia', 'mini-app'],
};

export function computeRecommendation(
  answers: DiagnosticAnswers
): DiagnosticRecommendation {
  // 1. Choose the right Socle
  let baseId = 'vitrine-impact';

  if (answers.situation === 'good-site' && answers.goal === 'save-time') {
    baseId = 'deja-site';
  } else if (
    answers.goal === 'train-sell' ||
    (answers.sector === 'formation-coach' && answers.goal === 'sell-online')
  ) {
    baseId = 'elearning-platform';
  } else if (answers.goal === 'sell-online') {
    baseId = 'ecommerce-cle';
  } else if (answers.goal === 'custom-platform') {
    baseId = 'webapp-saas';
  } else if (
    answers.situation === 'local-only' &&
    answers.goal !== 'premium-image' &&
    answers.goal !== 'save-time'
  ) {
    baseId = 'gmb-pack';
  } else if (answers.goal === 'simple-contact') {
    baseId = 'vitrine-essentiel';
  } else if (answers.goal === 'premium-image') {
    baseId = 'vitrine-pro';
  } else {
    baseId = 'vitrine-impact';
  }

  // 2. Quick alternative socles to compare in 1 click
  const altMap: Record<string, string[]> = {
    'gmb-pack': ['vitrine-essentiel', 'vitrine-impact'],
    'vitrine-essentiel': ['gmb-pack', 'vitrine-impact', 'vitrine-pro'],
    'vitrine-impact': ['vitrine-essentiel', 'vitrine-pro', 'deja-site'],
    'vitrine-pro': ['vitrine-impact', 'vitrine-essentiel'],
    'ecommerce-cle': ['vitrine-impact', 'elearning-platform', 'webapp-saas'],
    'elearning-platform': ['ecommerce-cle', 'webapp-saas'],
    'webapp-saas': ['vitrine-pro', 'ecommerce-cle'],
    'deja-site': ['vitrine-impact', 'vitrine-essentiel'],
  };
  const alternativeBaseIds = altMap[baseId] || ['vitrine-impact', 'vitrine-essentiel'];

  // 3. AI items selected directly from user answers
  const aiSet = new Set<string>();
  if (answers.dailyNeeds.includes('help-mini-app')) aiSet.add('mini-app');
  if (answers.dailyNeeds.includes('help-whatsapp-ai')) aiSet.add('assistant-ia-247');
  if (answers.dailyNeeds.includes('help-content-ia')) aiSet.add('studio-contenu-ia');
  if (answers.dailyNeeds.includes('help-auto-pdf')) aiSet.add('auto-workflow-ia');
  if (answers.goal === 'save-time' && aiSet.size === 0) {
    aiSet.add('mini-app');
  }
  const aiIds = Array.from(aiSet);

  // 4. Boosts & Visuals / Legal
  const boostSet = new Set<string>();
  if (answers.dailyNeeds.includes('help-google') && baseId !== 'gmb-pack') {
    boostSet.add('seo-google');
  }
  if (answers.dailyNeeds.includes('help-geo')) boostSet.add('geo-ia');
  if (answers.dailyNeeds.includes('help-sea')) boostSet.add('sea-ads');
  if (answers.dailyNeeds.includes('help-3d')) boostSet.add('configurateur-3d');

  if (answers.visual === 'need-logo' || answers.visual === 'need-full') {
    boostSet.add('identite-logo');
  }
  if (answers.visual === 'need-photo' || answers.visual === 'need-full') {
    boostSet.add('media-drone');
  }
  if (answers.visual === 'need-legal' || answers.visual === 'need-full') {
    boostSet.add('pack-legal');
  }
  const boostIds = Array.from(boostSet);

  // 5. Matrix Recommended (R) IDs for the chosen Socle
  const matrixRecommendedIds = MATRIX_R_BY_BASE[baseId] || ['seo-google', 'media-drone'];
  const recommendedCareId =
    baseId === 'webapp-saas'
      ? 'maint-active'
      : baseId === 'gmb-pack'
        ? 'aucun-abo'
        : 'maint-essentielle';

  // 6. Per-item plain-French reasons
  const reasonsByItemId: Record<string, string> = {
    'gmb-pack':
      'Recommandé pour vous car vous voulez être visible vite sur Google Maps localement sans partir sur un site complexe.',
    'vitrine-essentiel':
      'Recommandé pour vous car vous cherchez une page claire et pro qui permet de vous contacter immédiatement.',
    'vitrine-impact':
      'Recommandé pour vous car ce format multipage rassure vos prospects locaux et génère régulièrement appels et devis.',
    'vitrine-pro':
      'Recommandé pour vous car vous visez une image haut de gamme avec effet 3D qui surclasse vos concurrents.',
    'ecommerce-cle':
      'Recommandé pour vous car vous voulez vendre vos produits en ligne 24h/24 par Carte & Apple Pay.',
    'elearning-platform':
      'Recommandé pour vous car vous voulez héberger et vendre vos cours ou formations dans un espace élève sécurisé.',
    'webapp-saas':
      'Recommandé pour vous car votre besoin demande une plateforme métier sur-mesure (comptes, données, workflows).',
    'deja-site':
      'Recommandé pour vous car votre site actuel vous convient : aucun socle inutile facturé.',
    'mini-app':
      'Outil concret (calculateur, générateur SEO, devis) sans abonnement mensuel caché.',
    'assistant-ia-247':
      'Répond aux prospects 24h/24 sur votre site et WhatsApp et vous envoie le contact qualifié.',
    'studio-contenu-ia':
      'Génère vos fiches Google, articles SEO et posts réseaux à votre image en 2 clics.',
    'auto-workflow-ia':
      'Automatise vos devis PDF et relances clients pour supprimer la saisie manuelle.',
    'seo-google':
      'Option R (Recommandée) : optimise votre présence naturelle sur Google et Google Maps dans votre secteur.',
    'geo-ia':
      'Option R (Recommandée) : positionne votre entreprise dans les réponses de ChatGPT, Gemini et Perplexity.',
    'sea-ads':
      'Déclenche des demandes immédiates via des campagnes ciblées Google Ads.',
    'configurateur-3d':
      'Permet au visiteur de simuler ou visualiser son choix en direct avant de demander un devis.',
    'identite-logo':
      'Logo vectoriel et cartes de visite professionnelles pour inspirer confiance dès le premier regard.',
    'media-drone':
      'Option R (Recommandée) : vraies photos et vidéos/drone de votre activité (10x plus crédible qu’une image générique).',
    'pack-legal':
      'Option R E-Commerce/Formation : mentions légales, RGPD et structure CGV conformes (option avocat disponible).',
  };

  // 7. Headline & Reasoning
  const sectorName = SECTOR_LABEL[answers.sector];
  const situationName = SITUATION_LABEL[answers.situation];
  const goalName = GOAL_LABEL[answers.goal];

  const headlineMap: Record<string, string> = {
    'gmb-pack': 'Votre solution idéale : Visibilité Locale Google My Business',
    'vitrine-essentiel': 'Votre solution idéale : Site One-Page clair & efficace',
    'vitrine-impact': `Votre solution idéale : Site Multipage d’acquisition (${sectorName})`,
    'vitrine-pro': `Votre solution idéale : Site Signature Haut de Gamme + 3D`,
    'ecommerce-cle': 'Votre solution idéale : Boutique E-Commerce Clé en Main',
    'elearning-platform': 'Votre solution idéale : Plateforme E-Learning & Formations',
    'webapp-saas': 'Votre solution idéale : Application Web / Plateforme Sur-Mesure',
    'deja-site': 'Votre plan d’action : booster votre site existant (IA & Acquisition)',
  };

  const parts: string[] = [
    `D’après votre activité (${sectorName}) et votre priorité (« ${goalName.toLowerCase()} »), nous vous recommandons ce socle avec toutes ses inclusions de base déjà comprises.`,
  ];

  if (answers.situation === 'good-site' && baseId !== 'deja-site') {
    parts.push(
      'Comme vous êtes satisfait de votre site actuel, vous pouvez aussi basculer en 1 clic sur « J’ai déjà mon site (0 €) » ci-dessous si vous souhaitez n’ajouter que les modules.'
    );
  }

  parts.push(
    'Vous pouvez activer ou retirer chaque complément recommandé (marqué R) ou option en 1 clic ci-dessous pour ajuster votre budget exact.'
  );

  const diagnosticSummaryText = `Diagnostic JAAD : ${sectorName} | Situation : ${situationName} | Priorité : ${goalName}`;

  return {
    baseId,
    alternativeBaseIds,
    aiIds,
    boostIds,
    matrixRecommendedIds,
    recommendedCareId,
    careId: answers.care,
    diagnosticHeadline: headlineMap[baseId] || headlineMap['vitrine-impact'],
    diagnosticReasoning: parts.join(' '),
    reasonsByItemId,
    diagnosticSummaryText,
  };
}
