'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Calculator,
  ChevronUp,
  Clock,
  FileText,
  X,
} from 'lucide-react';
import type { ServiceOption } from '@/data/catalog';

export function formatEuro(amount: number): string {
  return `${new Intl.NumberFormat('fr-FR').format(amount)} €`;
}

export function AnimatedEuro({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const currentRef = useRef(value);

  useEffect(() => {
    const start = currentRef.current;
    const end = value;
    if (start === end) return;

    const duration = 380;
    const startTime = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -8 * progress);
      const next = Math.round(start + (end - start) * eased);
      currentRef.current = next;
      setDisplay(next);
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [value]);

  return <span>{formatEuro(display)}</span>;
}

interface LiveQuoteSidebarProps {
  baseOption: ServiceOption;
  selectedAi: ServiceOption[];
  selectedBoosts: ServiceOption[];
  selectedMonthlyGrowth?: ServiceOption[];
  careOption: ServiceOption;
  setupTotal: number;
  monthlyTotal: number;
  estimatedDays: number;
  scores: { brand: number; google: number; automation: number };
  onRemoveAi: (id: string) => void;
  onRemoveBoost: (id: string) => void;
  onRemoveMonthlyGrowth?: (id: string) => void;
  onResetCare: () => void;
  onJumpToSummary: () => void;
  onNextStep: () => void;
  isSummaryActive: boolean;
  nextLabel: string;
}

export default function LiveQuoteSidebar({
  baseOption,
  selectedAi,
  selectedBoosts,
  selectedMonthlyGrowth = [],
  careOption,
  setupTotal,
  monthlyTotal,
  estimatedDays,
  scores,
  onRemoveAi,
  onRemoveBoost,
  onRemoveMonthlyGrowth,
  onResetCare,
  onJumpToSummary,
  onNextStep,
  isSummaryActive,
  nextLabel,
}: LiveQuoteSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const deposit = Math.round(setupTotal * 0.3);
  const hasCustomQuote = selectedAi.some((item) => Boolean(item.isCustomQuote));
  const hasAppointmentItem =
    Boolean(baseOption.requiresAppointment) ||
    selectedAi.some((item) => item.requiresAppointment);

  const activeItemsCount =
    (baseOption.price > 0 ? 1 : 0) +
    selectedAi.length +
    selectedBoosts.length +
    selectedMonthlyGrowth.length +
    (careOption.price > 0 ? 1 : 0);

  return (
    <>
      {/* Desktop Sticky Live Card */}
      <aside className="hidden lg:block lg:col-span-4">
        <div className="sticky top-24 bg-white rounded-3xl border border-slate-200/80 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.12)] overflow-hidden">
          <div className="bg-slate-900 text-white px-6 py-5">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">
                <Calculator className="w-3.5 h-3.5" />
                Estimation en direct
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-300 bg-white/10 px-2.5 py-1 rounded-full">
                <Clock className="w-3 h-3 text-blue-400" />
                ~{estimatedDays} jours
              </span>
            </div>

            <div className="mt-4 flex items-baseline justify-between gap-3">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Création du projet
                </div>
                <div className="font-display text-4xl font-extrabold tracking-tight text-white mt-0.5">
                  {setupTotal === 0 && hasCustomQuote ? (
                    <span>Sur mesure</span>
                  ) : (
                    <>
                      <AnimatedEuro value={setupTotal} />
                      {hasAppointmentItem && <span className="text-blue-400 text-2xl ml-1">+</span>}
                    </>
                  )}
                </div>
              </div>

              {monthlyTotal > 0 && (
                <div className="text-right">
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                    Suivi / mois
                  </div>
                  <div className="font-display text-xl font-bold text-blue-400 mt-1">
                    {formatEuro(monthlyTotal)}
                    <span className="text-xs font-medium text-slate-400">/m</span>
                  </div>
                </div>
              )}
            </div>

            <p className="mt-2.5 text-[11px] text-slate-300 font-medium">
              Acompte 30 % au démarrage : <strong className="text-white">{formatEuro(deposit)}</strong> · Prix TTC
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Business Impact Gauges */}
            <div className="space-y-3 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Impact concret pour votre activité
              </div>
              {[
                { label: 'Image & Crédibilité', val: scores.brand, color: 'bg-blue-600' },
                { label: 'Visibilité Google & Appels', val: scores.google, color: 'bg-sky-500' },
                { label: 'Temps gagné par l’IA', val: scores.automation, color: 'bg-indigo-600' },
              ].map((meter) => (
                <div key={meter.label} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-700">
                    <span>{meter.label}</span>
                    <span className="text-slate-900">{meter.val}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${meter.color}`}
                      style={{ width: `${meter.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Live Selected Modules */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <span>Votre configuration ({activeItemsCount})</span>
                {activeItemsCount === 0 && <span className="text-slate-400">Aucune option</span>}
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                <div className="flex items-center justify-between gap-2 text-xs py-2 px-3 rounded-xl bg-blue-50/70 border border-blue-100">
                  <span className="font-bold text-slate-800 truncate">{baseOption.label}</span>
                  <span className="font-bold text-blue-700 shrink-0">
                    {baseOption.pricePrefix ? `${baseOption.pricePrefix} ` : ''}
                    {formatEuro(baseOption.price)}
                  </span>
                </div>

                {selectedAi.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-2 text-xs py-2 px-3 rounded-xl bg-slate-50 border border-slate-200/80"
                  >
                    <span className="font-semibold text-slate-700 truncate">{item.label}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-bold text-slate-900">
                        {item.isCustomQuote
                          ? 'Sur mesure'
                          : `${item.pricePrefix ? `${item.pricePrefix} ` : ''}${formatEuro(item.price)}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => onRemoveAi(item.id)}
                        aria-label={`Retirer ${item.label}`}
                        className="p-0.5 text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {selectedBoosts.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-2 text-xs py-2 px-3 rounded-xl bg-slate-50 border border-slate-200/80"
                  >
                    <span className="font-semibold text-slate-700 truncate">{item.label}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-bold text-slate-900">{formatEuro(item.price)}</span>
                      <button
                        type="button"
                        onClick={() => onRemoveBoost(item.id)}
                        aria-label={`Retirer ${item.label}`}
                        className="p-0.5 text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {careOption.price > 0 && (
                  <div className="flex items-center justify-between gap-2 text-xs py-2 px-3 rounded-xl bg-slate-900 text-white">
                    <span className="font-semibold truncate">{careOption.label}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-bold text-blue-300">{formatEuro(careOption.price)}/m</span>
                      <button
                        type="button"
                        onClick={onResetCare}
                        aria-label={`Retirer ${careOption.label}`}
                        className="p-0.5 text-slate-400 hover:text-white transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {selectedMonthlyGrowth.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-2 text-xs py-2 px-3 rounded-xl bg-slate-900 text-white"
                  >
                    <span className="font-semibold truncate">{item.label}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-bold text-blue-300">{formatEuro(item.price)}/m</span>
                      {onRemoveMonthlyGrowth && (
                        <button
                          type="button"
                          onClick={() => onRemoveMonthlyGrowth(item.id)}
                          aria-label={`Retirer ${item.label}`}
                          className="p-0.5 text-slate-400 hover:text-white transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {!isSummaryActive && (
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onNextStep}
                  className="w-full py-3.5 px-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-widest shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all"
                >
                  <span>{nextLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={onJumpToSummary}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>Voir &amp; télécharger le PDF maintenant</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Floating Dock + Expandable Drawer */}
      {!isSummaryActive && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
          {mobileOpen && (
            <div className="bg-white border-t border-slate-200 shadow-2xl px-4 py-4 max-h-[60vh] overflow-y-auto space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Détail de votre projet
                </span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="text-xs font-bold text-blue-600"
                >
                  Fermer
                </button>
              </div>
              <div className="flex justify-between text-xs py-1 font-semibold">
                <span>{baseOption.label}</span>
                <span className="text-blue-600">{formatEuro(baseOption.price)}</span>
              </div>
              {[...selectedAi, ...selectedBoosts].map((item) => (
                <div key={item.id} className="flex justify-between text-xs py-1">
                  <span className="text-slate-700">{item.label}</span>
                  <span className="font-bold">
                    {item.isCustomQuote ? 'Sur mesure' : formatEuro(item.price)}
                  </span>
                </div>
              ))}
              {careOption.price > 0 && (
                <div className="flex justify-between text-xs py-1 font-semibold">
                  <span>{careOption.label}</span>
                  <span>{formatEuro(careOption.price)}/mois</span>
                </div>
              )}
              {selectedMonthlyGrowth.map((item) => (
                <div key={item.id} className="flex justify-between text-xs py-1 font-semibold">
                  <span>{item.label}</span>
                  <span>{formatEuro(item.price)}/mois</span>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  onJumpToSummary();
                }}
                className="w-full mt-2 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center justify-center gap-2"
              >
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span>Aller au Devis PDF final</span>
              </button>
            </div>
          )}

          <div className="bg-white/95 backdrop-blur-lg border-t border-slate-200 px-4 py-3 flex items-center justify-between gap-3 shadow-[0_-10px_30px_rgba(15,23,42,0.08)]">
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-left min-w-0"
            >
              <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <span>Total estimé</span>
                <ChevronUp
                  className={`w-3.5 h-3.5 text-blue-600 transition-transform ${
                    mobileOpen ? 'rotate-180' : ''
                  }`}
                />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-xl font-extrabold text-slate-900">
                  {setupTotal === 0 && hasCustomQuote ? 'Sur mesure' : <AnimatedEuro value={setupTotal} />}
                </span>
                {monthlyTotal > 0 && (
                  <span className="text-xs font-bold text-blue-600">
                    + {formatEuro(monthlyTotal)}/m
                  </span>
                )}
              </div>
            </button>

            <button
              type="button"
              onClick={onNextStep}
              className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-blue-600/20"
            >
              <span>{nextLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
