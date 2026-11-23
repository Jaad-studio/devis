export type CategoryKey = 'goal' | 'base' | 'ai' | 'boost' | 'care' | 'summary';

export interface BusinessGoalPreset {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  exampleTag: string;
  baseId: string;
  aiIds: string[];
  boostIds: string[];
  careId: string;
  iconName: 'Wrench' | 'Building2' | 'ShoppingBag' | 'Bot' | 'Layers' | 'Sliders';
}

export interface ServiceOption {
  id: string;
  category: 'base' | 'ai' | 'boost' | 'care';
  label: string;
  shortLabel?: string;
  price: number;
  isMonthly?: boolean;
  isCustomQuote?: boolean;
  pricePrefix?: string;
  badge?: string;
  pitch: string;
  concreteGain: string;
  includes: string[];
  deliveryDays: number;
  iconName: string;
  scores: {
    brand: number;
    google: number;
    automation: number;
  };
  requiresAppointment?: boolean;
}

export const JAAD_INFO = {
  brand: 'JAAD Studio',
  owner: 'Jâd ZORGUI',
  address: '1C rue Katia Krafft, 26100 Romans-sur-Isère',
  siret: '101 511 079 00010',
  tvaNotice: 'TVA non applicable, art. 293 B du CGI',
  email: 'hello@jaad.studio',
  secondaryEmail: 'jad.zorgui07@gmail.com',
  phoneDisplay: '06 26 78 98 39',
  whatsappNumber: '33626789839',
  website: 'https://www.jaad.studio',
  emailJs: {
    serviceId: 'service_a50wppp',
    templateId: 'template_z0zkxwr',
    publicKey: 'CR62e7-qqAmaY1IkA',
  },
} as const;

export const BUSINESS_GOALS: BusinessGoalPreset[] = [
  {
    id: 'artisan-local',
    badge: 'Le plus demandé',
    title: 'Artisan, Garage & Commerce local',
    subtitle: 'Attirer des clients autour de chez vous, montrer vos chantiers ou véhicules et recevoir plus d’appels.',
    exampleTag: 'Ex : Garage auto, couvreur, salon, restaurant',
    baseId: 'vitrine-impact',
    aiIds: [],
    boostIds: [],
    careId: 'maint-essentielle',
    iconName: 'Wrench',
  },
  {
    id: 'pme-signature',
    badge: 'Image & Devis',
    title: 'Showroom, PME & Marque Premium',
    subtitle: 'Un site mémorable avec simulateur interactif ou prise de RDV qui transforme vos visiteurs en devis qualifiés.',
    exampleTag: 'Ex : Cuisiniste, architecte, immobilier, B2B',
    baseId: 'vitrine-pro',
    aiIds: ['mini-app'],
    boostIds: [],
    careId: 'maint-essentielle',
    iconName: 'Building2',
  },
  {
    id: 'ecommerce',
    badge: 'Vente 24h/24',
    title: 'Boutique en Ligne / E-commerce',
    subtitle: 'Vendre vos produits ou réservations à toute heure avec paiement CB, Apple Pay et fiches prêtes pour Google.',
    exampleTag: 'Ex : Marque produit, concept store, prêt-à-porter',
    baseId: 'ecommerce-cle',
    aiIds: ['studio-contenu-ia'],
    boostIds: [],
    careId: 'maint-active',
    iconName: 'ShoppingBag',
  },
  {
    id: 'ia-booster',
    badge: 'Spécialité IA',
    title: 'Gagner 10h/semaine avec l’IA',
    subtitle: 'Déjà un site ou envie d’aller plus vite : mini-app métier, assistant client 24/7 ou automatisation complète.',
    exampleTag: 'Ex : Factures PDF auto, SEO auto, assistant WhatsApp',
    baseId: 'deja-site',
    aiIds: ['mini-app', 'assistant-ia-247'],
    boostIds: [],
    careId: 'aucun-abo',
    iconName: 'Bot',
  },
  {
    id: 'webapp-saas',
    badge: 'Sur-mesure',
    title: 'Web-App, Espace Client ou SaaS',
    subtitle: 'Créer votre propre logiciel en ligne avec connexions utilisateurs, tableau de bord et workflow automatisé.',
    exampleTag: 'Ex : Portail client, plateforme gestion, outil interne',
    baseId: 'webapp-saas',
    aiIds: ['auto-workflow-ia'],
    boostIds: [],
    careId: 'maint-active',
    iconName: 'Layers',
  },
  {
    id: 'carte-libre',
    badge: '100 % Libre',
    title: 'Composer moi-même à la carte',
    subtitle: 'Partir d’une feuille propre et piocher uniquement les prestations dont j’ai vraiment besoin.',
    exampleTag: 'Tarifs transparents en direct',
    baseId: 'vitrine-impact',
    aiIds: [],
    boostIds: [],
    careId: 'aucun-abo',
    iconName: 'Sliders',
  },
];

export const BASE_OPTIONS: ServiceOption[] = [
  {
    id: 'deja-site',
    category: 'base',
    label: 'Aucun site à créer (uniquement des Outils IA ou de la visibilité)',
    price: 0,
    pitch:
      'Vous voulez uniquement un outil IA, une application interne pour votre entreprise ou améliorer votre visibilité actuelle, sans refaire de site.',
    concreteGain:
      'Ex concret : On crée votre application IA interne ou on connecte nos outils à votre activité actuelle.',
    includes: [
      'Aucun frais de création de site',
      'Outils utilisables sur téléphone & ordinateur',
      'Mise en place rapide dans votre entreprise',
    ],
    deliveryDays: 3,
    iconName: 'CheckCircle2',
    scores: { brand: 15, google: 15, automation: 20 },
  },
  {
    id: 'gmb-pack',
    category: 'base',
    label: 'Fiche Google Maps & Visibilité Locale',
    price: 290,
    badge: 'Offerte avec tout site',
    pitch:
      'Pour que les clients de votre ville vous trouvent sur Google et vous appellent, même sans avoir de site internet. Offerte si vous créez un site chez JAAD Studio.',
    concreteGain:
      'Ex concret : Un client tape votre métier + votre ville sur son téléphone et tombe sur votre fiche avec vos photos, avis et bouton Appeler.',
    includes: [
      'Création ou remise à neuf de votre fiche Google',
      'Réglage des zones, horaires, photos et services',
      'Offerte (0 €) dès que vous prenez un site internet',
    ],
    deliveryDays: 4,
    iconName: 'MapPin',
    scores: { brand: 35, google: 60, automation: 10 },
  },
  {
    id: 'vitrine-essentiel',
    category: 'base',
    label: 'Site Internet Essentiel (1 grande page complète)',
    price: 690,
    badge: 'Simple & Rapide',
    pitch:
      'Une page unique, propre et moderne qui présente votre entreprise, vos réalisations et permet de vous appeler ou demander un devis en 1 clic.',
    concreteGain:
      'Ex concret : Idéal pour un artisan ou commerce qui veut une vraie présence sérieuse rapidement sans gros budget.',
    includes: [
      'Design sur-mesure adapté aux téléphones',
      'Fiche Google Maps optimisée offerte (valeur 290 €)',
      'Bouton d’appel direct, WhatsApp & formulaire de contact',
      'Formation rapide pour savoir tout utiliser',
    ],
    deliveryDays: 7,
    iconName: 'Rocket',
    scores: { brand: 55, google: 50, automation: 15 },
  },
  {
    id: 'vitrine-impact',
    category: 'base',
    label: 'Site Internet Complet Sur-Mesure (Multi-pages)',
    price: 890,
    badge: 'Le plus choisi',
    pitch:
      'Un vrai site complet avec une page par prestation, vos réalisations avant/après et vos avis Google pour rassurer et décrocher plus de chantiers ou clients.',
    concreteGain:
      'Ex concret : Vos clients comprennent tout ce que vous faites, voient votre sérieux et vous envoient des demandes de devis qualifiées.',
    includes: [
      'Plusieurs pages dédiées à vos activités & avis clients',
      'Fiche Google Maps optimisée offerte (valeur 290 €)',
      'Galerie photos de vos réalisations & formulaires devis',
      '100 % à vous (aucune location mensuelle obligatoire)',
    ],
    deliveryDays: 12,
    iconName: 'Globe',
    scores: { brand: 75, google: 70, automation: 25 },
  },
  {
    id: 'vitrine-pro',
    category: 'base',
    label: 'Site Prestige + Animations & Expérience 3D',
    price: 1290,
    badge: 'Haut de gamme & 3D',
    pitch:
      'Un site au rendu exceptionnel avec animations fluides ou visualisation 3D interactive pour impressionner vos clients et surclasser vos concurrents.',
    concreteGain:
      'Ex concret : Pour un showroom, constructeur, architecte ou marque qui veut projeter une image haut de gamme immédiate.',
    includes: [
      'Direction artistique haut de gamme & module 3D interactif',
      'Fiche Google Maps optimisée offerte (valeur 290 €)',
      'Ultra rapide sur iPhone, Android et ordinateur',
      'Version bilingue Français / Anglais incluse si besoin',
    ],
    deliveryDays: 18,
    iconName: 'Crown',
    scores: { brand: 95, google: 75, automation: 35 },
  },
  {
    id: 'ecommerce-cle',
    category: 'base',
    label: 'Boutique en Ligne Clé en Main (E-Commerce)',
    price: 1490,
    badge: 'Vente en ligne 24h/24',
    pitch:
      'Vendez vos produits 24h/24 avec paiement par Carte Bancaire et Apple Pay, gestion facile des commandes et des stocks depuis votre téléphone.',
    concreteGain:
      'Ex concret : Vos clients commandent et paient directement en ligne, vous recevez le bon de commande prêt à expédier.',
    includes: [
      'Catalogue produits avec photos, tailles ou options',
      'Paiement sécurisé Carte Bancaire & Apple Pay',
      'Fiche Google Maps optimisée offerte (valeur 290 €)',
      'Formation incluse pour ajouter vos produits facilement',
    ],
    deliveryDays: 16,
    iconName: 'ShoppingBag',
    scores: { brand: 80, google: 70, automation: 55 },
  },
  {
    id: 'elearning-platform',
    category: 'base',
    label: 'Plateforme de Formation en Ligne (E-Learning)',
    price: 1490,
    badge: 'Formations & Cours',
    pitch:
      'Votre propre espace de formation : vos clients achètent vos cours en ligne et accèdent à leurs vidéos, PDF et exercices avec un code personnel.',
    concreteGain:
      'Ex concret : Vendez vos formations automatiquement sans reverser de commission à une plateforme extérieure.',
    includes: [
      'Espace élève privé avec mot de passe & vidéos/PDF',
      'Paiement en ligne par carte & accès automatique',
      'Fiche Google Maps optimisée offerte (valeur 290 €)',
      'Tableau de bord simple pour suivre vos élèves',
    ],
    deliveryDays: 18,
    iconName: 'GraduationCap',
    scores: { brand: 80, google: 55, automation: 60 },
  },
  {
    id: 'webapp-saas',
    category: 'base',
    label: 'Plateforme Web ou Portail Client Sur-Mesure',
    price: 1990,
    pricePrefix: 'Dès',
    badge: 'Sur-mesure',
    requiresAppointment: true,
    pitch:
      'Un portail complet avec comptes clients, espace pro/grossiste, suivi de commandes ou outil métier accessible en ligne.',
    concreteGain:
      'Ex concret : Vos clients ou partenaires se connectent à leur espace privé pour commander, suivre leurs dossiers ou télécharger leurs documents.',
    includes: [
      'Comptes utilisateurs sécurisés sur-mesure',
      'Base de données et tableau de bord de gestion',
      'Fiche Google Maps optimisée offerte (valeur 290 €)',
      'Accompagnement complet et prise en main',
    ],
    deliveryDays: 25,
    iconName: 'LayoutPanelTop',
    scores: { brand: 85, google: 45, automation: 75 },
  },
];

export const AI_OPTIONS: ServiceOption[] = [
  {
    id: 'mini-app',
    category: 'ai',
    label: 'Mini-App Interne Sur-Mesure (sur Téléphone & PC)',
    price: 250,
    badge: 'Sans abonnement · Best-seller',
    pitch:
      'Une petite application privée créée juste pour vous, installable sur votre téléphone, pour régler une tâche précise de votre quotidien en 30 secondes.',
    concreteGain:
      'Ex concret : Calculateur de devis rapide sur chantier, générateur de posts/annonces, ou petit outil de commande interne — sans aucun abonnement mensuel.',
    includes: [
      'Créée sur-mesure à votre nom et votre logo',
      'S’utilise comme une appli sur iPhone, Android et PC',
      '0 € d’abonnement mensuel obligatoire',
    ],
    deliveryDays: 4,
    iconName: 'Smartphone',
    scores: { brand: 15, google: 10, automation: 35 },
  },
  {
    id: 'studio-contenu-ia',
    category: 'ai',
    label: 'App Interne IA : Rédaction Google, Fiches & Réseaux Sociaux',
    price: 490,
    badge: 'Visibilité & Réseaux',
    pitch:
      'Votre propre application IA entraînée sur votre entreprise : donnez-lui une photo ou 3 mots, elle rédige vos textes Google, articles et posts Instagram/Facebook.',
    concreteGain:
      'Ex concret : Comme l’application AB House Studio — vous publiez régulièrement sur Google et les réseaux en 2 clics sans payer d’agence de com.',
    includes: [
      'Connaît votre métier, votre ville et votre façon de parler',
      'Génère articles SEO Google, fiches produits et posts réseaux',
      'Simple à utiliser même sans rien connaître à l’IA',
    ],
    deliveryDays: 6,
    iconName: 'PenTool',
    scores: { brand: 10, google: 30, automation: 40 },
  },
  {
    id: 'assistant-ia-247',
    category: 'ai',
    label: 'Assistant IA qui répond aux clients 24h/24 (Site & WhatsApp)',
    price: 490,
    badge: 'Répond 24h/24',
    pitch:
      'Un assistant intelligent qui connaît vos tarifs, vos services et vos horaires : il répond aux questions des clients jour et nuit et récupère leurs coordonnées.',
    concreteGain:
      'Ex concret : Un client vous écrit à 21h ou pendant que vous travaillez → l’IA le renseigne poliment et vous envoie un résumé prêt à rappeler.',
    includes: [
      'Fonctionne sur votre site internet et/ou WhatsApp',
      'Entraîné uniquement sur les vraies infos de votre société',
      'Vous alerte par message dès qu’un client sérieux est prêt',
    ],
    deliveryDays: 6,
    iconName: 'Bot',
    scores: { brand: 15, google: 10, automation: 45 },
  },
  {
    id: 'auto-workflow-ia',
    category: 'ai',
    label: 'App & Automatisation IA : Devis PDF, Factures & Relances',
    price: 690,
    badge: 'Zéro paperasse',
    pitch:
      'Finie la paperasse le soir : vos demandes clients se transforment automatiquement en devis PDF pro à votre image, avec suivi et relances automatiques.',
    concreteGain:
      'Ex concret : Vous remplissez 4 infos (ou le client remplit un formulaire) → le devis PDF part tout seul et le client est relancé si besoin.',
    includes: [
      'Génération automatique de devis ou dossiers PDF propres',
      'Tableau clair pour voir qui a signé et qui relancer',
      'Envoi automatique par Email ou WhatsApp',
    ],
    deliveryDays: 8,
    iconName: 'Workflow',
    scores: { brand: 10, google: 5, automation: 50 },
  },
  {
    id: 'app-interne-ia',
    category: 'ai',
    label: 'Application Interne IA pour Gérer votre Activité (Équipe, Stock, Chantiers)',
    price: 890,
    badge: 'App Métier Interne',
    pitch:
      'Votre propre logiciel interne simplifié avec IA intégrée : suivi de chantiers, gestion de stock/véhicules, comptes-rendus dictés à la voix ou portail équipe.',
    concreteGain:
      'Ex concret : Vos employés ou vous-même prenez une photo ou dictez une note sur téléphone → tout est rangé, résumé par l’IA et classé par client.',
    includes: [
      'Application web privée pour vous et votre équipe',
      'Fonctions IA sur-mesure (résumé vocal, tri photo, calcul)',
      'Remplace les tableaux Excel compliqués et les feuilles volantes',
    ],
    deliveryDays: 12,
    iconName: 'Layers',
    scores: { brand: 15, google: 0, automation: 60 },
  },
  {
    id: 'systeme-multi-agents',
    category: 'ai',
    label: 'Assistant IA Administratif Complet (Emails, Documents & Prospection)',
    price: 1290,
    pricePrefix: 'Dès',
    badge: 'IA Sur-Mesure Avancée',
    requiresAppointment: true,
    pitch:
      'Une IA connectée à vos boîtes mail et documents qui trie vos messages, lit les devis ou PDF fournisseurs, prépare vos réponses et trouve de nouveaux clients.',
    concreteGain:
      'Ex concret : Comme un assistant de bureau qui lit, trie, résume vos dossiers et prépare le travail administratif tous les matins.',
    includes: [
      'Connexion sécurisée à vos emails, Drive ou outils actuels',
      'Lecture, tri et résumé automatique de documents/factures',
      'Conçu 100 % sur-mesure après étude de votre fonctionnement',
    ],
    deliveryDays: 14,
    iconName: 'Cpu',
    scores: { brand: 20, google: 10, automation: 70 },
  },
  {
    id: 'outil-ia-personnalise',
    category: 'ai',
    label: 'Outil IA ou Application Interne 100 % Personnalisé',
    price: 0,
    isCustomQuote: true,
    badge: '100 % Sur-mesure',
    requiresAppointment: true,
    pitch:
      'Vous avez une idée précise ou un besoin propre à votre métier qui ne rentre pas dans une case ? On conçoit et développe votre outil IA exactement selon votre façon de travailler.',
    concreteGain:
      'Ex concret : Connexion à votre logiciel métier, outil d’analyse de plans ou documents, assistant interne spécialisé ou automatisation sur-mesure.',
    includes: [
      'Échange gratuit de 20 min pour bien comprendre votre besoin',
      'Chiffrage précis et transparent envoyé sous 24h',
      'Conception 100 % adaptée à votre entreprise & vos équipes',
    ],
    deliveryDays: 10,
    iconName: 'Settings2',
    scores: { brand: 20, google: 5, automation: 75 },
  },
];

export const BOOST_OPTIONS: ServiceOption[] = [
  {
    id: 'configurateur-3d',
    category: 'boost',
    label: 'Simulateur de Prix ou Configurateur 3D sur votre site',
    price: 390,
    pitch:
      'Un outil ludique sur votre site où le client choisit ses options (modèle, surface, pack) et voit le résultat ou une estimation en direct.',
    concreteGain:
      'Ex concret : Les curieux filtrent eux-mêmes leur budget et vous recevez des clients prêts à signer.',
    includes: [
      'Fluide sur iPhone, Android et ordinateur',
      'Relié directement à votre formulaire ou WhatsApp',
      'Parfait pour showroom, bâtiment, auto ou produit sur-mesure',
    ],
    deliveryDays: 6,
    iconName: 'Box',
    scores: { brand: 25, google: 10, automation: 20 },
  },
  {
    id: 'media-drone',
    category: 'boost',
    label: 'Shooting Photo, Vidéo & Drone 4K dans votre entreprise',
    price: 390,
    pitch:
      'On se déplace pour prendre de vraies belles photos et vidéos (au sol + drone aérien) de vous, votre équipe, vos locaux ou vos chantiers.',
    concreteGain:
      'Ex concret : De vraies photos de votre travail rassurent 10 fois plus que des images prises au hasard sur Internet.',
    includes: [
      'Séance photo complète + plans aériens en drone 4K',
      'Retouches professionnelles et mise au format site web',
      'Courtes vidéos prêtes pour Instagram, TikTok & Google',
    ],
    deliveryDays: 5,
    iconName: 'Camera',
    scores: { brand: 30, google: 10, automation: 0 },
  },
  {
    id: 'identite-logo',
    category: 'boost',
    label: 'Création de Logo, Identité Visuelle & Cartes de Visite',
    price: 290,
    pitch:
      'Un logo neuf ou modernisé, propre sur fond clair comme foncé, avec vos maquettes de cartes de visite prêtes à imprimer.',
    concreteGain:
      'Ex concret : Une image pro sur votre site, vos devis, vos réseaux et vos véhicules.',
    includes: [
      'Logo haute qualité (fichiers web + imprimeur)',
      'Couleurs, polices & signature email assorties',
      'Maquette carte de visite ou flyer prête pour l’imprimeur',
    ],
    deliveryDays: 5,
    iconName: 'Palette',
    scores: { brand: 30, google: 0, automation: 0 },
  },
  {
    id: 'pack-legal',
    category: 'boost',
    label: 'Mentions Légales, RGPD & Conditions Générales (CGV)',
    price: 120,
    pitch:
      'Tous les textes obligatoires pour que votre site ou votre boutique soit 100 % en règle (option relecture par avocat disponible sur demande).',
    concreteGain:
      'Ex concret : Vous lancez votre site ou vos ventes en ligne l’esprit tranquille.',
    includes: [
      'Mentions légales & politique de confidentialité RGPD',
      'Modèle de Conditions Générales adapté (option avocat sur devis)',
      'Bandeau cookies et formulaires conformes',
    ],
    deliveryDays: 2,
    iconName: 'Scale',
    scores: { brand: 10, google: 5, automation: 0 },
  },
];

export const MONTHLY_ACQUISITION_OPTIONS: ServiceOption[] = [
  {
    id: 'seo-mensuel',
    category: 'care',
    label: 'Suivi SEO Mensuel (Monter sur Google chaque mois)',
    price: 149,
    isMonthly: true,
    badge: 'Référencement Google',
    pitch:
      'Travail SEO continu chaque mois : rédaction d’articles et pages locales sur votre ville, optimisation de votre Fiche Google Business et suivi de vos positions.',
    concreteGain:
      'Ex concret : Vous remontez durablement devant vos concurrents sur Google sans payer de pub au clic.',
    includes: [
      'Nouveaux articles & pages ciblées sur votre ville chaque mois',
      'Optimisation continue de votre Fiche Google Business',
      'Suivi clair de vos positions sur Google & Maps',
    ],
    deliveryDays: 0,
    iconName: 'Search',
    scores: { brand: 10, google: 45, automation: 10 },
  },
  {
    id: 'geo-ia',
    category: 'care',
    label: 'Référencement IA (Être recommandé par ChatGPT & les IA)',
    price: 149,
    isMonthly: true,
    badge: 'Nouveau · GEO',
    pitch:
      'Optimisation continue de vos contenus et preuves d’autorité pour que ChatGPT, Perplexity et Google IA citent et recommandent votre entreprise.',
    concreteGain:
      'Ex concret : Quand un client demande un bon professionnel de votre secteur à ChatGPT, votre nom ressort.',
    includes: [
      'Contenus structurés & mis à jour pour les moteurs IA',
      'Suivi de vos citations dans ChatGPT, Perplexity & Google AI',
      'Étude publicité dans les expériences IA selon disponibilité',
    ],
    deliveryDays: 0,
    iconName: 'Compass',
    scores: { brand: 15, google: 40, automation: 20 },
  },
  {
    id: 'sea-ads',
    category: 'care',
    label: 'Gestion Google Ads (Publicité Google, hors budget clic)',
    price: 190,
    isMonthly: true,
    badge: 'Appels rapides',
    pitch:
      'Création, pilotage et optimisation continue de vos campagnes Google Ads chaque mois pour capter des clients prêts à appeler (hors budget versé à Google).',
    concreteGain:
      'Ex concret : Vos annonces restent tout en haut de Google et sont ajustées chaque semaine pour limiter le coût par appel.',
    includes: [
      'Création et pilotage continu de vos annonces Google Ads',
      'Tri des mots-clés rentables & blocage des clics inutiles',
      'Suivi précis du nombre d’appels et de demandes reçues',
    ],
    deliveryDays: 0,
    iconName: 'TrendingUp',
    scores: { brand: 10, google: 45, automation: 10 },
  },
];

export const CARE_OPTIONS: ServiceOption[] = [
  {
    id: 'aucun-abo',
    category: 'care',
    label: 'Je gère seul — 0 € par mois (Aucun abonnement)',
    price: 0,
    isMonthly: true,
    pitch:
      'Vous payez uniquement la création. Aucun frais mensuel de maintenance : vous êtes 100 % autonome.',
    concreteGain: 'Liberté totale, zéro prélèvement de maintenance.',
    includes: ['Livraison complète', 'Tous vos accès et fichiers remis en main propre'],
    deliveryDays: 0,
    iconName: 'Check',
    scores: { brand: 0, google: 0, automation: 0 },
  },
  {
    id: 'maint-essentielle',
    category: 'care',
    label: 'Tranquillité Technique (Hébergement, sécurité & petites modifs)',
    price: 49,
    isMonthly: true,
    pitch:
      'On veille sur votre site et vos outils tous les jours : hébergement rapide, nom de domaine, sauvegardes, sécurité et petites retouches incluses.',
    concreteGain: 'Vous dormez tranquille : zéro souci informatique.',
    includes: [
      'Hébergement pro & nom de domaine gérés pour vous',
      'Sauvegardes & surveillance 24h/24',
      'Changements simples (horaires, tarifs, textes) inclus',
    ],
    deliveryDays: 0,
    iconName: 'ShieldCheck',
    scores: { brand: 5, google: 10, automation: 10 },
  },
  {
    id: 'maint-active',
    category: 'care',
    label: 'On met tout à jour pour vous par simple message WhatsApp',
    price: 99,
    isMonthly: true,
    badge: 'Le plus pratique',
    pitch:
      'Envoyez-nous vos nouvelles photos de chantiers, véhicules, produits ou promos sur WhatsApp : on les met en ligne proprement pour vous.',
    concreteGain: 'Votre site et vos outils restent toujours à jour sans y passer votre soirée.',
    includes: [
      'Tout le suivi technique inclus',
      'Ajouts réguliers de photos, réalisations ou offres par WhatsApp',
      'Support réactif 7j/7',
    ],
    deliveryDays: 0,
    iconName: 'Zap',
    scores: { brand: 15, google: 25, automation: 25 },
  },
];

export const TIMELINE_CHOICES = [
  { id: 'asap', label: 'Dès cette semaine' },
  { id: 'month', label: 'Ce mois-ci' },
  { id: 'quarter', label: 'Dans 1 à 3 mois' },
  { id: 'explore', label: 'Je compare tranquillement' },
] as const;

export const STEP_META: Array<{ id: CategoryKey; num: string; label: string; short: string }> = [
  { id: 'goal', num: '01', label: 'Votre Objectif', short: 'Objectif' },
  { id: 'base', num: '02', label: 'Site ou Plateforme', short: 'Site Web' },
  { id: 'ai', num: '03', label: 'Outils & Apps IA', short: 'Outils IA' },
  { id: 'boost', num: '04', label: 'Google, Photos & Légal', short: 'Options' },
  { id: 'care', num: '05', label: 'Suivi Mensuel', short: 'Suivi' },
  { id: 'summary', num: '06', label: 'Mon Devis PDF', short: 'Devis PDF' },
];
