'use client';

import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock,
  Cpu,
  Sparkles,
} from 'lucide-react';
import {
  AI_OPTIONS,
  BASE_OPTIONS,
  BOOST_OPTIONS,
  BUSINESS_GOALS,
  CARE_OPTIONS,
  JAAD_INFO,
  STEP_META,
  type BusinessGoalPreset,
  type ServiceOption,
} from '@/data/catalog';
import { CatalogIcon } from './IconResolver';
import LiveQuoteSidebar, { formatEuro } from './LiveQuoteSidebar';
import FinalSummaryPanel from './FinalSummaryPanel';

interface SelectableCardProps {
  option: ServiceOption;
  selected: boolean;
  darkTheme?: boolean;
  onToggle: () => void;
}

function SelectableCard({ option, selected, darkTheme = false, onToggle }: SelectableCardProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`group relative w-full text-left rounded-3xl p-6 border-2 transition-all duration-300 flex flex-col justify-between h-full ${
        darkTheme
          ? selected
            ? 'bg-slate-900 text-white border-blue-500 shadow-[0_20px_50px_-15px_rgba(37,99,235,0.45)]'
            : 'bg-slate-900/95 text-white border-slate-800 hover:border-blue-400/60'
          : selected
            ? 'bg-white text-slate-900 border-blue-600 shadow-[0_20px_45px_-20px_rgba(37,99,235,0.28)]'
            : 'bg-white text-slate-900 border-slate-200/80 hover:border-blue-300 shadow-sm hover:-translate-y-0.5'
      }`}
    >
      {option.badge && (
        <span
          className={`absolute -top-3 left-6 px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm ${
            darkTheme
              ? 'bg-blue-600 text-white'
              : selected
                ? 'bg-blue-600 text-white'
                : 'bg-slate-900 text-white'
          }`}
        >
          {option.badge}
        </span>
      )}

      <span
        className={`absolute top-5 right-5 w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
          selected
            ? 'bg-blue-600 border-blue-600 text-white scale-105'
            : darkTheme
              ? 'border-slate-700 text-transparent group-hover:border-blue-400'
              : 'border-slate-200 text-transparent group-hover:border-blue-300'
        }`}
      >
        <Check className="w-3.5 h-3.5" />
      </span>

      <div className="space-y-4">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
            selected
              ? 'bg-blue-600 text-white'
              : darkTheme
                ? 'bg-slate-800 text-blue-400 group-hover:bg-blue-600/20'
                : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'
          }`}
        >
          <CatalogIcon name={option.iconName} className="w-5 h-5" />
        </div>

        <div>
          <h3 className="font-display text-lg font-extrabold tracking-tight pr-7 leading-snug">
            {option.label}
          </h3>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            {option.pricePrefix && (
              <span
                className={`text-xs font-bold uppercase ${
                  darkTheme ? 'text-blue-300' : 'text-blue-600'
                }`}
              >
                {option.pricePrefix}
              </span>
            )}
            <span
              className={`font-display text-2xl sm:text-3xl font-black tracking-tight ${
                selected
                  ? darkTheme
                    ? 'text-blue-400'
                    : 'text-blue-600'
                  : darkTheme
                    ? 'text-white'
                    : 'text-slate-900'
              }`}
            >
              {formatEuro(option.price)}
            </span>
            {option.isMonthly && (
              <span className={`text-xs font-bold ${darkTheme ? 'text-slate-400' : 'text-slate-500'}`}>
                / mois
              </span>
            )}
          </div>
        </div>

        <p className={`text-xs leading-relaxed ${darkTheme ? 'text-slate-300' : 'text-slate-600'}`}>
          {option.pitch}
        </p>
      </div>

      <div
        className={`mt-5 pt-4 border-t space-y-2 ${
          darkTheme ? 'border-slate-800' : 'border-slate-100'
        }`}
      >
        <div
          className={`text-[11px] font-bold ${
            darkTheme ? 'text-blue-300' : 'text-blue-700'
          }`}
        >
          → {option.concreteGain}
        </div>
        <ul className="space-y-1.5">
          {option.includes.map((line) => (
            <li
              key={line}
              className={`flex items-start gap-2 text-[11px] font-medium ${
                darkTheme ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              <Check
                className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                  darkTheme ? 'text-blue-400' : 'text-blue-600'
                }`}
              />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>
    </button>
  );
}

export default function QuoteStudio() {
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedGoalId, setSelectedGoalId] = useState<string>('artisan-local');
  const [baseId, setBaseId] = useState<string>('vitrine-impact');
  const [aiIds, setAiIds] = useState<string[]>([]);
  const [boostIds, setBoostIds] = useState<string[]>(['seo-google']);
  const [careId, setCareId] = useState<string>('maint-essentielle');
  const [presetBanner, setPresetBanner] = useState<string | null>(null);

  const activeStep = STEP_META[stepIndex];

  const baseOption = useMemo(
    () => BASE_OPTIONS.find((item) => item.id === baseId) || BASE_OPTIONS[1],
    [baseId]
  );
  const selectedAi = useMemo(
    () => AI_OPTIONS.filter((item) => aiIds.includes(item.id)),
    [aiIds]
  );
  const selectedBoosts = useMemo(
    () => BOOST_OPTIONS.filter((item) => boostIds.includes(item.id)),
    [boostIds]
  );
  const careOption = useMemo(
    () => CARE_OPTIONS.find((item) => item.id === careId) || CARE_OPTIONS[0],
    [careId]
  );

  const setupTotal = useMemo(() => {
    const aiSum = selectedAi.reduce((acc, item) => acc + item.price, 0);
    const boostSum = selectedBoosts.reduce((acc, item) => acc + item.price, 0);
    return baseOption.price + aiSum + boostSum;
  }, [baseOption, selectedAi, selectedBoosts]);

  const monthlyTotal = careOption.price;

  const estimatedDays = useMemo(() => {
    const baseDays = baseOption.deliveryDays;
    const extraDays =
      selectedAi.reduce((acc, item) => acc + Math.ceil(item.deliveryDays * 0.6), 0) +
      selectedBoosts.reduce((acc, item) => acc + Math.ceil(item.deliveryDays * 0.4), 0);
    return Math.max(4, baseDays + extraDays);
  }, [baseOption, selectedAi, selectedBoosts]);

  const scores = useMemo(() => {
    const all = [baseOption, ...selectedAi, ...selectedBoosts, careOption];
    const sum = all.reduce(
      (acc, cur) => ({
        brand: acc.brand + cur.scores.brand,
        google: acc.google + cur.scores.google,
        automation: acc.automation + cur.scores.automation,
      }),
      { brand: 10, google: 10, automation: 10 }
    );
    return {
      brand: Math.min(100, sum.brand),
      google: Math.min(100, sum.google),
      automation: Math.min(100, sum.automation),
    };
  }, [baseOption, selectedAi, selectedBoosts, careOption]);

  function scrollTopSmooth() {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function applyGoalPreset(goal: BusinessGoalPreset) {
    setSelectedGoalId(goal.id);
    setBaseId(goal.baseId);
    setAiIds(goal.aiIds);
    setBoostIds(goal.boostIds);
    setCareId(goal.careId);
    setPresetBanner(`Configuration pré-remplie pour « ${goal.title} » — personnalisez librement ci-dessous.`);
    setStepIndex(goal.id === 'ia-booster' ? 2 : 1);
    scrollTopSmooth();
  }

  function toggleMulti(list: string[], setter: (next: string[]) => void, id: string) {
    setter(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  }

  function resetAll() {
    setSelectedGoalId('artisan-local');
    setBaseId('vitrine-impact');
    setAiIds([]);
    setBoostIds(['seo-google']);
    setCareId('maint-essentielle');
    setPresetBanner(null);
    setStepIndex(0);
    scrollTopSmooth();
  }

  function handleNextStep() {
    if (stepIndex < STEP_META.length - 1) {
      setStepIndex(stepIndex + 1);
      scrollTopSmooth();
    }
  }

  function handlePrevStep() {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
      scrollTopSmooth();
    }
  }

  const nextLabel =
    stepIndex === 0
      ? 'Choisir mon socle'
      : stepIndex >= STEP_META.length - 2
        ? 'Voir mon devis PDF'
        : `Étape ${STEP_META[stepIndex + 1]?.num || ''}`;

  return (
    <div className="min-h-screen flex flex-col relative pb-24 lg:pb-12">
      {/* Subtle Architectural Cobalt Background Atmosphere */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -left-32 w-[540px] h-[540px] rounded-full bg-blue-500/10 blur-[110px]" />
        <div className="absolute bottom-0 -right-32 w-[540px] h-[540px] rounded-full bg-sky-400/10 blur-[110px]" />
      </div>

      {/* Top Sticky Studio Navigation */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-slate-200/75">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-slate-900 text-white font-display font-black text-lg flex items-center justify-center shadow-sm">
              J<span className="text-blue-500">.</span>
            </span>
            <div>
              <div className="font-display font-black text-base sm:text-lg tracking-tight text-slate-900 leading-none">
                JAAD <span className="text-blue-600">STUDIO.</span>
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mt-0.5">
                Simulateur Transparent
              </div>
            </div>
          </div>

          {/* 6 Clickable Step Pills on Desktop */}
          <nav
            aria-label="Étapes du simulateur"
            className="hidden xl:flex items-center gap-1 bg-slate-100/90 p-1 rounded-full border border-slate-200/70"
          >
            {STEP_META.map((step, idx) => {
              const active = idx === stepIndex;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => {
                    setStepIndex(idx);
                    scrollTopSmooth();
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    active
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                  }`}
                >
                  <span className={active ? 'text-blue-400' : 'text-slate-400'}>{step.num}</span>
                  <span>{step.short}</span>
                </button>
              );
            })}
          </nav>

          <a
            href={JAAD_INFO.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-slate-200 bg-white hover:border-blue-600 text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors shrink-0"
          >
            <span className="hidden sm:inline">Découvrir</span> jaad.studio
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile / Tablet Step Strip */}
        <div className="xl:hidden border-t border-slate-100 bg-slate-50/90 px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {STEP_META.map((step, idx) => {
            const active = idx === stepIndex;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => {
                  setStepIndex(idx);
                  scrollTopSmooth();
                }}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors ${
                  active ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                {step.num} · {step.short}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        {presetBanner && stepIndex > 0 && stepIndex < 5 && (
          <div className="mb-6 bg-blue-50 border border-blue-200/80 text-blue-900 px-4 py-3 rounded-2xl text-xs font-semibold flex flex-wrap items-center justify-between gap-2">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
              {presetBanner}
            </span>
            <button
              type="button"
              onClick={() => setStepIndex(0)}
              className="text-blue-700 underline font-bold"
            >
              Changer d’objectif
            </button>
          </div>
        )}

        {activeStep.id === 'summary' ? (
          <FinalSummaryPanel
            baseOption={baseOption}
            selectedAi={selectedAi}
            selectedBoosts={selectedBoosts}
            careOption={careOption}
            setupTotal={setupTotal}
            monthlyTotal={monthlyTotal}
            estimatedDays={estimatedDays}
            onResetAll={resetAll}
            onEditStep={(idx) => {
              setStepIndex(idx);
              scrollTopSmooth();
            }}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Interactive Area (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Step 01: Playful Business Goal Picker */}
              {activeStep.id === 'goal' && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[11px] font-extrabold uppercase tracking-wider">
                      <Clock className="w-3.5 h-3.5" />
                      Tarifs visibles en direct · Zéro inscription imposée
                    </div>
                    <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-[1.06]">
                      À quel projet souhaitez-vous <span className="text-blue-600">donner vie aujourd’hui ?</span>
                    </h1>
                    <p className="text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed">
                      Cliquez simplement sur le profil qui vous ressemble : nous préparons une base cohérente avec de vrais tarifs, puis vous ajustez chaque brique en toute transparence.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {BUSINESS_GOALS.map((goal) => {
                      const active = goal.id === selectedGoalId;
                      return (
                        <button
                          key={goal.id}
                          type="button"
                          onClick={() => applyGoalPreset(goal)}
                          className={`group relative text-left rounded-3xl p-6 border-2 transition-all duration-300 flex flex-col justify-between gap-4 hover:-translate-y-0.5 ${
                            active
                              ? 'bg-white border-blue-600 shadow-[0_20px_45px_-20px_rgba(37,99,235,0.28)]'
                              : 'bg-white border-slate-200/80 hover:border-blue-300 shadow-sm'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div
                              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                                active
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-slate-100 text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-600'
                              }`}
                            >
                              <CatalogIcon name={goal.iconName} className="w-5 h-5" />
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                                goal.id === 'ia-booster'
                                  ? 'bg-slate-900 text-blue-300'
                                  : 'bg-blue-50 text-blue-700'
                              }`}
                            >
                              {goal.badge}
                            </span>
                          </div>

                          <div className="space-y-1.5">
                            <h2 className="font-display text-lg sm:text-xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {goal.title}
                            </h2>
                            <p className="text-xs text-slate-600 leading-relaxed">{goal.subtitle}</p>
                          </div>

                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
                            <span>{goal.exampleTag}</span>
                            <span className="inline-flex items-center gap-1 text-blue-600 group-hover:translate-x-1 transition-transform">
                              Choisir <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 02: Web / Platform Base */}
              {activeStep.id === 'base' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-blue-600">
                      Étape 02 · Votre Base Web ou Logiciel
                    </span>
                    <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                      Quel socle correspond à votre besoin ?
                    </h2>
                    <p className="text-sm text-slate-600">
                      Vous avez déjà un site internet ? Choisissez simplement la dernière carte à <strong>0 €</strong> pour ajouter uniquement nos outils IA ou du référencement Google.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {BASE_OPTIONS.map((option) => (
                      <SelectableCard
                        key={option.id}
                        option={option}
                        selected={baseId === option.id}
                        onToggle={() => setBaseId(option.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Step 03: Advanced AI Tools */}
              {activeStep.id === 'ai' && (
                <div className="space-y-6">
                  <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-800 shadow-lg">
                    <div className="space-y-2">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-blue-400">
                        <Cpu className="w-3.5 h-3.5" />
                        Étape 03 · Pôle Intelligence Artificielle &amp; Outils Poussés
                      </span>
                      <h2 className="font-display text-2xl sm:text-4xl font-black tracking-tight">
                        Des outils concrets qui travaillent pour vous.
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                        Sélectionnez zéro, un ou plusieurs modules. Nos outils sont conçus sur-mesure pour être simples à utiliser depuis votre téléphone, sans payer des dizaines d’abonnements logiciels.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {AI_OPTIONS.map((option) => (
                      <div
                        key={option.id}
                        className={option.id === 'systeme-multi-agents' ? 'md:col-span-2 h-full' : 'h-full'}
                      >
                        <SelectableCard
                          option={option}
                          darkTheme
                          selected={aiIds.includes(option.id)}
                          onToggle={() => toggleMulti(aiIds, setAiIds, option.id)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 04: Boosts & Visibility */}
              {activeStep.id === 'boost' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-blue-600">
                      Étape 04 · Visibilité Google, Image &amp; Options
                    </span>
                    <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                      Multipliez votre impact local &amp; visuel
                    </h2>
                    <p className="text-sm text-slate-600">
                      Ces briques facultatives font toute la différence pour remonter sur Google et rassurer immédiatement vos futurs clients.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {BOOST_OPTIONS.map((option) => (
                      <div
                        key={option.id}
                        className={option.id === 'seo-google' ? 'md:col-span-2 h-full' : 'h-full'}
                      >
                        <SelectableCard
                          option={option}
                          selected={boostIds.includes(option.id)}
                          onToggle={() => toggleMulti(boostIds, setBoostIds, option.id)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 05: Monthly Care */}
              {activeStep.id === 'care' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-blue-600">
                      Étape 05 · Tranquillité après mise en ligne
                    </span>
                    <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                      Voulez-vous qu’on gère la suite chaque mois ?
                    </h2>
                    <p className="text-sm text-slate-600">
                      Rien d’obligatoire : vous pouvez gérer seul à 0 €, ou nous confier hébergement, ajouts d’annonces, mises à jour et suivi Google.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {CARE_OPTIONS.map((option) => (
                      <SelectableCard
                        key={option.id}
                        option={option}
                        selected={careId === option.id}
                        onToggle={() => setCareId(option.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Desktop Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200/80">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={stepIndex === 0}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:text-slate-900 disabled:opacity-30 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Précédent</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  <span>{nextLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Sticky Live Sidebar + Mobile Bottom Bar */}
            <LiveQuoteSidebar
              baseOption={baseOption}
              selectedAi={selectedAi}
              selectedBoosts={selectedBoosts}
              careOption={careOption}
              setupTotal={setupTotal}
              monthlyTotal={monthlyTotal}
              estimatedDays={estimatedDays}
              scores={scores}
              onRemoveAi={(id) => setAiIds((prev) => prev.filter((x) => x !== id))}
              onRemoveBoost={(id) => setBoostIds((prev) => prev.filter((x) => x !== id))}
              onResetCare={() => setCareId('aucun-abo')}
              onJumpToSummary={() => {
                setStepIndex(STEP_META.length - 1);
                scrollTopSmooth();
              }}
              onNextStep={handleNextStep}
              isSummaryActive={false}
              nextLabel={nextLabel}
            />
          </div>
        )}
      </main>
    </div>
  );
}
