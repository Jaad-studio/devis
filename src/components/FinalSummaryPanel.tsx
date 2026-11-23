'use client';

import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  Clock,
  Download,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  RotateCcw,
  Send,
  ShieldCheck,
  User,
} from 'lucide-react';
import {
  JAAD_INFO,
  TIMELINE_CHOICES,
  type ServiceOption,
} from '@/data/catalog';
import { generateJaadQuotePdf } from '@/lib/pdfGenerator';
import { formatEuro } from './LiveQuoteSidebar';

interface FinalSummaryPanelProps {
  baseOption: ServiceOption;
  selectedAi: ServiceOption[];
  selectedBoosts: ServiceOption[];
  careOption: ServiceOption;
  setupTotal: number;
  monthlyTotal: number;
  estimatedDays: number;
  diagnosticContext?: string;
  showBanner?: boolean;
  onResetAll: () => void;
  onEditStep: (stepIndex: number) => void;
}

export default function FinalSummaryPanel({
  baseOption,
  selectedAi,
  selectedBoosts,
  careOption,
  setupTotal,
  monthlyTotal,
  estimatedDays,
  diagnosticContext = '',
  showBanner = true,
  onResetAll,
  onEditStep,
}: FinalSummaryPanelProps) {
  const [clientName, setClientName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [timeline, setTimeline] = useState<string>('month');
  const [brief, setBrief] = useState('');
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );
  const [pdfNotice, setPdfNotice] = useState(false);

  const oneTimeItems: ServiceOption[] = [
    ...(baseOption.price > 0 || (selectedAi.length === 0 && selectedBoosts.length === 0)
      ? [baseOption]
      : []),
    ...selectedAi,
    ...selectedBoosts,
  ];
  const hasCustomQuote = oneTimeItems.some((item) => Boolean(item.isCustomQuote));
  const deposit = Math.round(setupTotal * 0.3);
  const timelineLabel =
    TIMELINE_CHOICES.find((item) => item.id === timeline)?.label || 'À définir';

  const combinedBrief = [diagnosticContext.trim(), brief.trim()].filter(Boolean).join(' — ');

  const hasValidContact =
    company.trim().length > 1 ||
    clientName.trim().length > 1 ||
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    phone.trim().length >= 8;

  const hasValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  function makeQuoteId(): string {
    return `JAAD-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  function handleDownloadPdf() {
    setFeedback(null);
    const quoteId = makeQuoteId();
    generateJaadQuotePdf({
      quoteId,
      clientName: clientName.trim() || company.trim() || 'Client JAAD Studio',
      company: company.trim() || clientName.trim() || 'Votre Entreprise',
      email: email.trim(),
      phone: phone.trim(),
      timelineLabel,
      brief: combinedBrief,
      oneTimeItems,
      monthlyItem: careOption.price > 0 ? careOption : null,
      setupTotal,
      monthlyTotal,
      estimatedDays,
    });
    setPdfNotice(true);
    setTimeout(() => setPdfNotice(false), 4000);
  }

  function buildWhatsAppUrl(): string {
    const itemsText = oneTimeItems
      .map(
        (item) =>
          `• ${item.label} (${
            item.isCustomQuote
              ? 'Sur mesure'
              : `${item.pricePrefix ? `${item.pricePrefix} ` : ''}${formatEuro(item.price)}`
          })`
      )
      .join('\n');
    const careLine =
      careOption.price > 0
        ? `• Suivi mensuel : ${careOption.label} (${formatEuro(careOption.price)}/mois)`
        : '• Suivi mensuel : Aucun abonnement';

    const totalLine =
      setupTotal === 0 && hasCustomQuote
        ? 'Total Création : Sur mesure (chiffrage sous 24h)'
        : `Total Création : ${formatEuro(setupTotal)}${hasCustomQuote ? ' + Sur mesure' : ''} (Acompte 30 % : ${formatEuro(deposit)})`;

    const message = [
      `Bonjour Jâd (JAAD Studio), voici ma simulation de devis :`,
      '',
      `Entreprise / Nom : ${company.trim() || clientName.trim() || 'Non précisé'}`,
      phone.trim() ? `Tél : ${phone.trim()}` : null,
      email.trim() ? `Email : ${email.trim()}` : null,
      `Lancement souhaité : ${timelineLabel}`,
      '',
      itemsText,
      careLine,
      '',
      totalLine,
      monthlyTotal > 0 ? `Abonnement : ${formatEuro(monthlyTotal)}/mois` : null,
      combinedBrief ? `\nPrécisions : ${combinedBrief}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    return `https://wa.me/${JAAD_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`;
  }

  async function handleSendEmail(ev: React.FormEvent) {
    ev.preventDefault();
    setFeedback(null);

    if (!hasValidEmail) {
      setFeedback({
        type: 'error',
        text: 'Renseignez une adresse email valide pour recevoir une copie et transmettre à JAAD Studio.',
      });
      return;
    }

    setSending(true);
    const optionsList = [
      ...oneTimeItems.map(
        (o) => `${o.label} (${o.isCustomQuote ? 'Sur mesure' : formatEuro(o.price)})`
      ),
      careOption.price > 0 ? `${careOption.label} (${formatEuro(careOption.price)}/m)` : null,
    ]
      .filter(Boolean)
      .join(' | ');

    try {
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: JAAD_INFO.emailJs.serviceId,
          template_id: JAAD_INFO.emailJs.templateId,
          user_id: JAAD_INFO.emailJs.publicKey,
          template_params: {
            to_email: JAAD_INFO.email,
            client_company: `${company.trim() || clientName.trim() || 'Prospect Web'} (${timelineLabel})`,
            client_email: email.trim(),
            client_phone: phone.trim() || 'Non renseigné',
            total_setup: new Intl.NumberFormat('fr-FR').format(setupTotal),
            total_monthly: new Intl.NumberFormat('fr-FR').format(monthlyTotal),
            selected_options: `${optionsList}${combinedBrief ? ` — Brief : ${combinedBrief}` : ''}`,
          },
        }),
      });

      if (res.ok) {
        setFeedback({
          type: 'success',
          text: 'Demande envoyée avec succès à JAAD Studio ! Jâd revient vers vous rapidement.',
        });
      } else {
        setFeedback({
          type: 'error',
          text: 'L’envoi email a rencontré une limite — utilisez le bouton WhatsApp ou téléchargez votre PDF juste à côté.',
        });
      }
    } catch {
      setFeedback({
        type: 'error',
        text: 'Impossible de joindre le serveur mail pour le moment — envoyez directement via WhatsApp en 1 clic.',
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Header Summary Card */}
      {showBanner && (
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Votre Devis Personnalisé est Prêt
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight">
                Récapitulatif sur-mesure
              </h2>
              <p className="text-sm text-slate-300 max-w-xl">
                Téléchargez votre devis PDF officiel JAAD Studio, ou transmettez cette configuration en 1 clic par WhatsApp ou Email pour valider ensemble.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 min-w-[240px]">
              <div className="text-[11px] uppercase tracking-wider text-slate-300 font-semibold">
                Total Création (Net)
              </div>
              <div className="font-display text-4xl font-extrabold text-white mt-0.5">
                {setupTotal === 0 && hasCustomQuote ? 'Sur mesure' : formatEuro(setupTotal)}
              </div>
              {setupTotal > 0 && hasCustomQuote && (
                <div className="text-xs font-bold text-blue-300 mt-0.5">+ Sur mesure</div>
              )}
              {monthlyTotal > 0 && (
                <div className="text-sm font-bold text-blue-400 mt-1">
                  + {formatEuro(monthlyTotal)} / mois
                </div>
              )}
              <div className="mt-3 pt-3 border-t border-white/10 text-[11px] text-slate-300 space-y-1">
                <div className="flex justify-between">
                  <span>Acompte 30 % :</span>
                  <strong className="text-white">{formatEuro(deposit)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Délai estimé :</span>
                  <strong className="text-white">~{estimatedDays} jours</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 6 Cols: Breakdown of selected items */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-extrabold text-slate-900">
              Détail des prestations
            </h3>
            {showBanner && (
              <button
                type="button"
                onClick={() => onEditStep(1)}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Modifier les choix
              </button>
            )}
          </div>

          <div className="divide-y divide-slate-100">
            {oneTimeItems.map((item) => (
              <div key={item.id} className="py-3.5 flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-slate-900">{item.label}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{item.concreteGain}</div>
                </div>
                <span className="text-sm font-extrabold text-blue-600 shrink-0">
                  {item.isCustomQuote ? (
                    'Sur mesure'
                  ) : (
                    <>
                      {item.pricePrefix ? `${item.pricePrefix} ` : ''}
                      {formatEuro(item.price)}
                    </>
                  )}
                </span>
              </div>
            ))}

            <div className="py-3.5 flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-bold text-slate-900">{careOption.label}</div>
                <div className="text-xs text-slate-500 mt-0.5">{careOption.concreteGain}</div>
              </div>
              <span className="text-sm font-extrabold text-slate-900 shrink-0">
                {careOption.price > 0 ? `${formatEuro(careOption.price)}/mois` : '0 €'}
              </span>
            </div>
          </div>

          <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-700">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">Tarifs nets sans surprise :</strong> {JAAD_INFO.tvaNotice}. Aucun coût caché, code et propriété transmis à 100 % à la livraison.
            </div>
          </div>
        </div>

        {/* Right 6 Cols: Contact + Instant Actions */}
        <form
          onSubmit={handleSendEmail}
          className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-sm"
        >
          <div>
            <h3 className="font-display text-lg font-extrabold text-slate-900">
              Finaliser &amp; recevoir votre devis
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Renseignez vos coordonnées pour personnaliser le PDF et l’envoyer à Jâd.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <label className="block space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Entreprise / Activité
              </span>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Ex : Garage Dupuis, Salon..."
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white text-sm outline-none transition-colors"
                />
              </div>
            </label>

            <label className="block space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Votre prénom / nom
              </span>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ex : Marc Dupuis"
                className="w-full px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white text-sm outline-none transition-colors"
              />
            </label>

            <label className="block space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Email (pour envoi mail)
              </span>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@entreprise.fr"
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white text-sm outline-none transition-colors"
                />
              </div>
            </label>

            <label className="block space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Téléphone / WhatsApp
              </span>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="06 .. .. .. .."
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white text-sm outline-none transition-colors"
                />
              </div>
            </label>
          </div>

          {/* Launch Horizon Pills */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              Quand souhaitez-vous démarrer ?
            </span>
            <div className="flex flex-wrap gap-2">
              {TIMELINE_CHOICES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTimeline(item.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                    timeline === item.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <label className="block space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Votre projet en quelques mots (optionnel)
            </span>
            <textarea
              rows={3}
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              placeholder="Ex : J'ai déjà un site sur..., je voudrais automatiser mes devis ou refaire un site moderne..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white text-sm outline-none resize-none transition-colors"
            />
          </label>

          {feedback && (
            <div
              className={`p-3.5 rounded-2xl text-xs font-bold border ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              {feedback.text}
            </div>
          )}

          {pdfNotice && (
            <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Devis PDF téléchargé !</span>
            </div>
          )}

          {/* 3 Direct Conversion CTAs */}
          <div className="space-y-2.5 pt-2">
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-600/20 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Envoyer sur WhatsApp ({JAAD_INFO.phoneDisplay})</span>
            </a>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4 text-blue-400" />
                <span>Télécharger Devis PDF</span>
              </button>

              <button
                type="submit"
                disabled={sending}
                className="py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                {sending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>Envoyer par Email</span>
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Réponse moyenne sous 2h · Romans-sur-Isère &amp; toute la France
            </span>
            <button
              type="button"
              onClick={onResetAll}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Recommencer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
