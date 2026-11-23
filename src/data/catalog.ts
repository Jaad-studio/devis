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
    boostIds: ['seo-google'],
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
    boostIds: ['seo-google'],
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
    boostIds: ['seo-google'],
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
    id: 'vitrine-essentiel',
    category: 'base',
    label: 'Site Vitrine Essentiel',
    price: 690,
    pitch: 'L’indispensable propre, rapide et pro pour être crédible dès la 1re recherche Google.',
    concreteGain: 'Idéal pour se lancer vite sans budget excessif.',
    includes: ['Jusqu’à 4 sections / pages clés', 'Bouton WhatsApp & formulaire devis', 'Parfait sur iPhone & Android'],
    deliveryDays: 7,
    iconName: 'Rocket',
    scores: { brand: 55, google: 45, automation: 15 },
  },
  {
    id: 'vitrine-impact',
    category: 'base',
    label: 'Site Vitrine Sur-Mesure',
    price: 890,
    badge: 'Best-seller',
    pitch: 'Le vrai format gagnant : direction artistique unique, pages dédiées à vos offres et parcours de devis fluide.',
    concreteGain: 'Transforme vos visiteurs locaux en appels et demandes sérieuses.',
    includes: ['Design sur mesure (zéro template)', 'Galerie réalisations & avis Google', 'Architecture SEO propre dès le départ'],
    deliveryDays: 12,
    iconName: 'Sparkles',
    scores: { brand: 75, google: 65, automation: 25 },
  },
  {
    id: 'vitrine-pro',
    category: 'base',
    label: 'Site Signature + Expérience 3D',
    price: 1290,
    badge: 'Haut de gamme',
    pitch: 'Pour surclasser immédiatement vos concurrents avec un rendu studio luxe, scènes 3D ou multilingue FR/EN.',
    concreteGain: 'Positionne instantanément votre marque en leader du secteur.',
    includes: ['Effets immersifs & interactivité 3D', 'Bilingue FR / EN inclus si besoin', 'Performance & score Google 95+'],
    deliveryDays: 18,
    iconName: 'Crown',
    scores: { brand: 95, google: 75, automation: 35 },
  },
  {
    id: 'ecommerce-cle',
    category: 'base',
    label: 'Boutique E-Commerce Clé en Main',
    price: 1490,
    pitch: 'Encaissez 24h/24 par Carte Bancaire & Apple Pay avec une boutique simple à gérer depuis votre téléphone.',
    concreteGain: 'Vendez sans commission cachée, avec panier optimisé.',
    includes: ['Paiement sécurisé Stripe / Apple Pay', 'Gestion catalogue, prix & stocks', 'Emails automatiques de commande'],
    deliveryDays: 16,
    iconName: 'ShoppingBag',
    scores: { brand: 80, google: 65, automation: 55 },
  },
  {
    id: 'webapp-saas',
    category: 'base',
    label: 'Application Web / Plateforme Métier',
    price: 1990,
    pricePrefix: 'Dès',
    badge: 'Sur étude',
    requiresAppointment: true,
    pitch: 'Votre propre outil web privé ou produit SaaS avec comptes clients, espace membre et base de données temps réel.',
    concreteGain: 'Digitalise 100 % votre façon de travailler.',
    includes: ['Espace membre sécurisé & rôles', 'Base de données & Cloud scalable', 'Atelier cadrage fonctionnel offert'],
    deliveryDays: 25,
    iconName: 'LayoutPanelTop',
    scores: { brand: 85, google: 45, automation: 75 },
  },
  {
    id: 'deja-site',
    category: 'base',
    label: 'J’ai déjà mon site internet',
    price: 0,
    pitch: 'Vous gardez votre site actuel et ajoutez simplement nos outils IA, une mini-app reliée ou du référencement Google.',
    concreteGain: 'Pas besoin de tout refaire si votre base vous convient.',
    includes: ['Connexion directe possible au site actuel', 'Devis uniquement sur vos besoins ajoutés', 'Mise en place rapide'],
    deliveryDays: 3,
    iconName: 'CheckCircle2',
    scores: { brand: 15, google: 10, automation: 10 },
  },
];

export const AI_OPTIONS: ServiceOption[] = [
  {
    id: 'mini-app',
    category: 'ai',
    label: 'Mini-App Métier Dédiée',
    price: 250,
    badge: 'Best-seller PME',
    pitch: 'Une vraie appli séparée (installable sur iPhone & Mac) créée pour un besoin précis : factures, blog/SEO, gestion stock ou devis.',
    concreteGain: 'Gagnez plusieurs heures par semaine sans logiciel complexe.',
    includes: ['Zéro coût mensuel obligatoire', 'Reliée directement à votre site si besoin', 'Aux couleurs & logo de votre société'],
    deliveryDays: 4,
    iconName: 'Smartphone',
    scores: { brand: 15, google: 10, automation: 35 },
  },
  {
    id: 'assistant-ia-247',
    category: 'ai',
    label: 'Agent Commercial IA 24/7',
    price: 490,
    badge: 'Ultra rentable',
    pitch: 'Assistant intelligent entraîné sur VOS tarifs et services : répond aux visiteurs 24h/24, qualifie la demande et transmet le lead prêt à appeler.',
    concreteGain: 'Ne perdez plus jamais un prospect qui écrit le soir ou le dimanche.',
    includes: ['Widget sur site + passerelle WhatsApp', 'Réponses sur-mesure (aucun blabla générique)', 'Résumé structuré envoyé par mail / SMS'],
    deliveryDays: 6,
    iconName: 'Bot',
    scores: { brand: 15, google: 10, automation: 45 },
  },
  {
    id: 'studio-contenu-ia',
    category: 'ai',
    label: 'Studio Contenu & SEO IA Interne',
    price: 490,
    pitch: 'Votre propre générateur éditorial privé : créez vos articles SEO, fiches Google Maps et légendes Instagram/LinkedIn avec vos photos en 2 clics.',
    concreteGain: 'Publiez 10x plus régulièrement sans payer d’agence mensuelle.',
    includes: ['Respecte votre ton & mots-clés locaux', 'Compatible sans API au début ou clé client', 'Prévisualisation Google & réseaux en direct'],
    deliveryDays: 6,
    iconName: 'Wand2',
    scores: { brand: 10, google: 30, automation: 35 },
  },
  {
    id: 'auto-workflow-ia',
    category: 'ai',
    label: 'Automatisation CRM, PDF & Relances',
    price: 690,
    badge: 'Zéro paperasse',
    pitch: 'Un client valide un formulaire → son devis ou dossier PDF pro se génère seul, s’enregistre dans votre suivi et déclenche vos relances.',
    concreteGain: 'Élimine 100 % des copier-coller et oublis de relance.',
    includes: ['Génération PDF automatique à votre image', 'Tableau de suivi prospects / clients clair', 'Notifications instantanées email / WhatsApp'],
    deliveryDays: 8,
    iconName: 'Workflow',
    scores: { brand: 10, google: 5, automation: 50 },
  },
  {
    id: 'systeme-multi-agents',
    category: 'ai',
    label: 'Système Multi-Agents IA Sur-Mesure',
    price: 1290,
    pricePrefix: 'Dès',
    badge: 'IA Ultra Poussée',
    requiresAppointment: true,
    pitch: 'Architecture IA avancée multi-agents connectée à vos boîtes mail, documents internes, prospection B2B ou outils métiers.',
    concreteGain: 'Un véritable département digital autonome qui travaille en continu.',
    includes: ['Agents IA spécialisés connectés à vos flux', 'Extraction de données, tris & comptes-rendus', 'Tableau de contrôle & garde-fous stricts'],
    deliveryDays: 14,
    iconName: 'Cpu',
    scores: { brand: 20, google: 10, automation: 65 },
  },
];

export const BOOST_OPTIONS: ServiceOption[] = [
  {
    id: 'seo-google',
    category: 'boost',
    label: 'Pack Boost Google & Visibilité Locale',
    price: 290,
    badge: 'Recommandé',
    pitch: 'Structure SEO avancée pour apparaître en tête sur votre ville & vos mots-clés, + optimisation complète de votre Fiche Google Business.',
    concreteGain: 'Des prospects gratuits qui vous trouvent directement sur Google.',
    includes: ['Pages & balises ciblées villes/services', 'Données structurées Google (Schema.org)', 'Plan d’action concret pour vos avis 5★'],
    deliveryDays: 4,
    iconName: 'Search',
    scores: { brand: 5, google: 40, automation: 5 },
  },
  {
    id: 'configurateur-3d',
    category: 'boost',
    label: 'Simulateur / Configurateur 3D Interactive',
    price: 390,
    pitch: 'Offrez une expérience interactive sur votre site : choix de matériaux, couleurs, formats ou packs visualisés en direct avant prise de RDV.',
    concreteGain: 'Les clients vous appellent déjà convaincus de leur choix.',
    includes: ['Rendu fluide même sur mobile', 'Connexion directe au formulaire de devis', 'Idéal déco, auto, bâtiment, produit'],
    deliveryDays: 6,
    iconName: 'Box',
    scores: { brand: 25, google: 10, automation: 20 },
  },
  {
    id: 'identite-logo',
    category: 'boost',
    label: 'Logo, Charte & Cartes Pro',
    price: 290,
    pitch: 'Création ou lifting pro de votre logo vectoriel, choix typographique, icône application iPhone et cartes de visite prêtes à imprimer.',
    concreteGain: 'Une identité cohérente sur votre camion, site, factures & réseaux.',
    includes: ['Logo clair + sombre haute définition', 'Icône mobile & signature mail pro', 'Fichier prêt imprimeur (cartes/flyers)'],
    deliveryDays: 5,
    iconName: 'Palette',
    scores: { brand: 30, google: 0, automation: 0 },
  },
  {
    id: 'media-drone',
    category: 'boost',
    label: 'Shooting Photo, Vidéo & Drone 4K',
    price: 390,
    pitch: 'De vraies images de votre équipe, showroom, atelier ou chantiers + plans aériens drone 4K et formats verticaux pour vos réseaux.',
    concreteGain: 'Rien ne rassure plus qu’une vraie photo authentique (zéro banque d’images).',
    includes: ['Séance photo + plans drone 4K', 'Retouches & optimisation vitesse web', 'Courtes vidéos prêtes pour Insta/TikTok'],
    deliveryDays: 5,
    iconName: 'Camera',
    scores: { brand: 30, google: 10, automation: 0 },
  },
  {
    id: 'pack-legal',
    category: 'boost',
    label: 'Pack Légal, CGV & Conformité RGPD',
    price: 120,
    pitch: 'Mentions légales, politique de confidentialité, gestion cookies propre et modèle de conditions générales adaptées à votre activité.',
    concreteGain: 'Votre site est carré administrativement dès le 1er jour.',
    includes: ['Mentions légales + RGPD sur-mesure', 'Conditions de devis / vente adaptées', 'Vérification conformité formulaires'],
    deliveryDays: 2,
    iconName: 'Scale',
    scores: { brand: 10, google: 5, automation: 0 },
  },
];

export const CARE_OPTIONS: ServiceOption[] = [
  {
    id: 'aucun-abo',
    category: 'care',
    label: 'Autonome — Aucun abonnement',
    price: 0,
    isMonthly: true,
    pitch: 'Vous réglez uniquement la création. Zéro frais mensuels JAAD Studio.',
    concreteGain: 'Liberté totale, vous gérez vous-même vos évolutions.',
    includes: ['Livraison clé en main', 'Code & accès transmis intégralement'],
    deliveryDays: 0,
    iconName: 'Check',
    scores: { brand: 0, google: 0, automation: 0 },
  },
  {
    id: 'maint-essentielle',
    category: 'care',
    label: 'Sérénité Essentielle',
    price: 49,
    isMonthly: true,
    pitch: 'On veille sur votre site tous les jours : hébergement rapide, nom de domaine, sécurité SSL, sauvegardes et petites modifs incluses.',
    concreteGain: 'Dormez tranquille : on s’occupe du technique pour vous.',
    includes: ['Hébergement Cloud & domaine inclus', 'Surveillance 24/7 & sauvegardes', 'Mises à jour textes / horaires / photos'],
    deliveryDays: 0,
    iconName: 'ShieldCheck',
    scores: { brand: 5, google: 10, automation: 10 },
  },
  {
    id: 'maint-active',
    category: 'care',
    label: 'Gestion Active & Mises à Jour',
    price: 99,
    isMonthly: true,
    badge: 'Plébiscité Pros',
    pitch: 'La formule tout-inclus type Garage / Showroom : ajoutez vos véhicules, chantiers, tarifs ou annonces en illimité par simple message WhatsApp.',
    concreteGain: 'Votre site reste vivant toutes les semaines sans y toucher.',
    includes: ['Tout le forfait Sérénité inclus', 'Ajouts continus annonces / produits / chantiers', 'Retouches photos & support WhatsApp 7j/7'],
    deliveryDays: 0,
    iconName: 'Zap',
    scores: { brand: 15, google: 25, automation: 25 },
  },
  {
    id: 'croissance-seo-ia',
    category: 'care',
    label: 'Croissance SEO & IA Continue',
    price: 189,
    isMonthly: true,
    pitch: 'Gestion Active + suivi mensuel des positions Google, rédaction régulière d’articles SEO ciblés et amélioration continue de vos outils IA.',
    concreteGain: 'Votre visibilité et vos automatisations progressent chaque mois.',
    includes: ['Tout le forfait Gestion Active inclus', 'Articles SEO ciblés & suivi Google', 'Optimisation mensuelle des agents & outils IA'],
    deliveryDays: 0,
    iconName: 'TrendingUp',
    scores: { brand: 20, google: 40, automation: 35 },
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
  { id: 'base', num: '02', label: 'Base Web / App', short: 'Base Web' },
  { id: 'ai', num: '03', label: 'Outils IA Poussés', short: 'IA & Apps' },
  { id: 'boost', num: '04', label: 'Boost Google & Options', short: 'Options' },
  { id: 'care', num: '05', label: 'Suivi Mensuel', short: 'Suivi' },
  { id: 'summary', num: '06', label: 'Mon Devis PDF', short: 'Devis PDF' },
];
