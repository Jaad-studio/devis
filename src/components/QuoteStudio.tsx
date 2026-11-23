'use client';

import React, { useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bot,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Compass,
  Cpu,
  Plus,
  RotateCcw,
  Sliders,
  X,
} from 'lucide-react';
import {
  AI_OPTIONS,
  BASE_OPTIONS,
  BOOST_OPTIONS,
  BUSINESS_GOALS,
  CARE_OPTIONS,
  JAAD_INFO,
  MONTHLY_ACQUISITION_OPTIONS,
  STEP_META,
  type BusinessGoalPreset,
  type ServiceOption,
} from '@/data/catalog';
import {
  AI_DIAGNOSTIC_CHOICES,
  BOOST_DIAGNOSTIC_CHOICES,
  CARE_DIAGNOSTIC_CHOICES,
  DEFAULT_ANSWERS,
  FOCUS_CHOICES,
  MONTHLY_GROWTH_DIAGNOSTIC_CHOICES,
  QUIZ_STEPS,
  SITE_NEED_CHOICES,
  computeRecommendation,
  type DiagnosticAnswers,
  type DiagnosticRecommendation,
  type FocusAnswer,
} from '@/data/diagnostic';
import { CatalogIcon } from './IconResolver';
import LiveQuoteSidebar, { AnimatedEuro, formatEuro } from './LiveQuoteSidebar';
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
            {!option.isCustomQuote && option.pricePrefix && (
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
              {option.isCustomQuote ? 'Sur mesure' : formatEuro(option.price)}
            </span>
            {option.isMonthly && !option.isCustomQuote && (
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
        <div className={`text-[11px] font-bold ${darkTheme ? 'text-blue-300' : 'text-blue-700'}`}>
          {option.concreteGain}
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
  const [mode, setMode] = useState<'diagnostic' | 'catalog'>('diagnostic');

  // Guided 4-Question State
  const [quizStep, setQuizStep] = useState<number>(0);
  const [maxVisitedStep, setMaxVisitedStep] = useState<number>(0);
  const [quizDone, setQuizDone] = useState<boolean>(false);
  const [answers, setAnswers] = useState<DiagnosticAnswers>(DEFAULT_ANSWERS);
  const [recommendation, setRecommendation] = useState<DiagnosticRecommendation | null>(null);
  const [showAddDrawer, setShowAddDrawer] = useState<boolean>(false);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Selected Quote State
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedGoalId, setSelectedGoalId] = useState<string>('artisan-local');
  const [baseId, setBaseId] = useState<string>('vitrine-impact');
  const [aiIds, setAiIds] = useState<string[]>([]);
  const [boostIds, setBoostIds] = useState<string[]>([]);
  const [monthlyGrowthIds, setMonthlyGrowthIds] = useState<string[]>([]);
  const [careId, setCareId] = useState<string>('maint-essentielle');
  const [presetBanner, setPresetBanner] = useState<string | null>(null);

  const activeStep = STEP_META[stepIndex];

  const baseOption = useMemo(
    () =>
      BASE_OPTIONS.find((item) => item.id === baseId) ||
      BASE_OPTIONS.find((item) => item.id === 'vitrine-impact') ||
      BASE_OPTIONS[0],
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

  const selectedMonthlyGrowth = useMemo(
    () => MONTHLY_ACQUISITION_OPTIONS.filter((item) => monthlyGrowthIds.includes(item.id)),
    [monthlyGrowthIds]
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

  const monthlyTotal = useMemo(() => {
    const growthSum = selectedMonthlyGrowth.reduce((acc, item) => acc + item.price, 0);
    return careOption.price + growthSum;
  }, [careOption, selectedMonthlyGrowth]);

  const estimatedDays = useMemo(() => {
    const hasPaidSite = baseOption.price > 0;
    const baseDays = hasPaidSite ? baseOption.deliveryDays : 0;
    const aiMax = selectedAi.reduce((max, item) => Math.max(max, item.deliveryDays), 0);
    const boostDays = selectedBoosts.reduce((acc, item) => acc + Math.ceil(item.deliveryDays * 0.4), 0);
    return Math.max(4, (hasPaidSite ? baseDays : aiMax) + (hasPaidSite && aiMax > 0 ? Math.ceil(aiMax * 0.5) : 0) + boostDays);
  }, [baseOption, selectedAi, selectedBoosts]);

  const scores = useMemo(() => {
    const all = [baseOption, ...selectedAi, ...selectedBoosts, ...selectedMonthlyGrowth, careOption];
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

  function toggleMulti(list: string[], setter: (next: string[]) => void, id: string) {
    setter(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  }

  function advanceQuizStep(targetStep: number) {
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    advanceTimerRef.current = setTimeout(() => {
      setQuizStep(targetStep);
      setMaxVisitedStep((prev) => Math.max(prev, targetStep));
      scrollTopSmooth();
    }, 150);
  }

  function handleSelectFocus(focus: FocusAnswer) {
    setAnswers((prev) => {
      if (focus === 'ai-only') {
        return {
          ...prev,
          focus,
          siteNeed: 'deja-site',
          boostChoices: [],
          care: 'aucun-abo',
        };
      }
      if (focus === 'site-and-ai') {
        return {
          ...prev,
          focus,
          siteNeed: prev.siteNeed === 'deja-site' ? 'vitrine-impact' : prev.siteNeed,
          care: 'maint-essentielle',
        };
      }
      return {
        ...prev,
        focus,
        aiChoices: [],
        siteNeed: prev.siteNeed === 'deja-site' ? 'vitrine-impact' : prev.siteNeed,
        care: 'maint-essentielle',
      };
    });
    advanceQuizStep(1);
  }

  function handleShowRecommendation() {
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    const rec = computeRecommendation(answers);
    setRecommendation(rec);
    setBaseId(rec.baseId);
    setAiIds(rec.aiIds);
    setBoostIds(rec.boostIds);
    setMonthlyGrowthIds(rec.monthlyGrowthIds);
    setCareId(rec.careId);
    setQuizDone(true);
    setShowAddDrawer(false);
    scrollTopSmooth();
  }

  function handleRestartDiagnostic() {
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    setAnswers(DEFAULT_ANSWERS);
    setQuizStep(0);
    setMaxVisitedStep(0);
    setQuizDone(false);
    setRecommendation(null);
    setShowAddDrawer(false);
    scrollTopSmooth();
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

  function resetAll() {
    setSelectedGoalId('artisan-local');
    setBaseId('vitrine-impact');
    setAiIds([]);
    setBoostIds([]);
    setMonthlyGrowthIds([]);
    setCareId('maint-essentielle');
    setPresetBanner(null);
    setStepIndex(0);
    if (mode === 'diagnostic') {
      handleRestartDiagnostic();
    } else {
      scrollTopSmooth();
    }
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

  // Visual items selected on the result screen
  const activeVisualItems: ServiceOption[] = useMemo(() => {
    const list: ServiceOption[] = [];
    if (baseOption.price > 0) list.push(baseOption);
    list.push(...selectedAi);
    list.push(...selectedBoosts);
    return list;
  }, [baseOption, selectedAi, selectedBoosts]);

  const unselectedAi = useMemo(
    () => AI_OPTIONS.filter((opt) => !aiIds.includes(opt.id)),
    [aiIds]
  );

  const unselectedBoosts = useMemo(
    () => BOOST_OPTIONS.filter((opt) => !boostIds.includes(opt.id)),
    [boostIds]
  );

  const deposit = Math.round(setupTotal * 0.3);
  const balance = setupTotal - deposit;
  const hasCustomQuote = selectedAi.some((item) => Boolean(item.isCustomQuote));

  return (
    <div className="min-h-screen flex flex-col relative pb-24 lg:pb-14">
      {/* Subtle Cobalt Background Atmosphere */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -left-32 w-[540px] h-[540px] rounded-full bg-blue-500/10 blur-[110px]" />
        <div className="absolute bottom-0 -right-32 w-[540px] h-[540px] rounded-full bg-sky-400/10 blur-[110px]" />
      </div>

      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <span className="w-9 h-9 rounded-xl bg-slate-900 text-white font-display font-black text-lg flex items-center justify-center shadow-sm shrink-0">
              J<span className="text-blue-500">.</span>
            </span>
            <div className="min-w-0">
              <div className="font-display font-black text-base sm:text-lg tracking-tight text-slate-900 leading-none truncate">
                JAAD <span className="text-blue-600">STUDIO.</span>
              </div>
              <div className="text-[9.5px] font-bold uppercase tracking-wider sm:tracking-widest text-slate-400 mt-0.5 truncate">
                <span className="sm:hidden">Web &amp; Apps IA</span>
                <span className="hidden sm:inline">Sites Web, Outils IA &amp; Applications Internes</span>
              </div>
            </div>
          </div>

          {/* 4-Step Nav in Diagnostic Mode */}
          {mode === 'diagnostic' ? (
            <nav
              aria-label="Progression des questions"
              className="hidden xl:flex items-center gap-1 bg-slate-100/90 p-1 rounded-full border border-slate-200/70"
            >
              {QUIZ_STEPS.map((q, idx) => {
                const isCurrent = !quizDone && quizStep === idx;
                const isClickable = quizDone || idx <= maxVisitedStep;
                return (
                  <button
                    key={q.num}
                    type="button"
                    disabled={!isClickable}
                    onClick={() => {
                      setQuizDone(false);
                      setQuizStep(idx);
                      scrollTopSmooth();
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                      isCurrent
                        ? 'bg-slate-900 text-white shadow-sm'
                        : isClickable
                          ? 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                          : 'text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <span className={isCurrent ? 'text-blue-400' : 'text-blue-600'}>
                      {quizDone || idx < quizStep ? '✓' : q.num}
                    </span>
                    <span>{q.short}</span>
                  </button>
                );
              })}
              {quizDone && (
                <span className="px-3.5 py-1.5 rounded-full text-[11px] font-bold bg-blue-600 text-white shadow-sm whitespace-nowrap">
                  Mon Devis
                </span>
              )}
            </nav>
          ) : (
            <nav
              aria-label="Étapes du catalogue"
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
          )}

          {/* Mode Toggle + Main Website */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'diagnostic' ? 'catalog' : 'diagnostic');
                scrollTopSmooth();
              }}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-900 hover:text-white hover:border-slate-900 text-xs font-bold text-slate-700 transition-colors whitespace-nowrap"
            >
              <Sliders className="w-3.5 h-3.5 shrink-0" />
              <span className="sm:hidden">{mode === 'diagnostic' ? 'Catalogue' : 'Questions'}</span>
              <span className="hidden sm:inline">
                {mode === 'diagnostic' ? 'Catalogue complet' : 'Questions guidées'}
              </span>
            </button>

            <a
              href={JAAD_INFO.website}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1 px-3 py-2 rounded-full border border-slate-200 bg-white hover:border-blue-600 text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors"
            >
              jaad.studio
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Mobile / Tablet Step Strip for Catalog Mode */}
        {mode === 'catalog' && (
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
        )}
      </header>

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        {/* ---------- MODE 1 : 4 QUESTIONS SIMPLES ---------- */}
        {mode === 'diagnostic' && !quizDone && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[11px] font-extrabold uppercase tracking-wider">
                  <Compass className="w-3.5 h-3.5" />
                  4 questions simples · Tarif clair et immédiat
                </div>
                <span className="text-xs font-extrabold text-slate-500">
                  Question {quizStep + 1} sur {QUIZ_STEPS.length}
                </span>
              </div>

              <div className="h-2 bg-slate-200/80 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${((quizStep + 1) / QUIZ_STEPS.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.14)] p-6 sm:p-10 space-y-6">
              {/* QUESTION 1 : Outil IA / App Interne vs Site + IA vs Site seul */}
              {quizStep === 0 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h1 className="font-display text-2xl sm:text-4xl font-black tracking-tight text-slate-900 leading-tight">
                      {QUIZ_STEPS[0].title}
                    </h1>
                    <p className="text-sm text-slate-600">
                      Nous créons aussi bien des <strong>outils IA et applications internes</strong> pour faire gagner du temps aux entreprises que des <strong>sites internet clé en main</strong>.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3.5">
                    {FOCUS_CHOICES.map((choice) => {
                      const active = answers.focus === choice.id;
                      const isAi = choice.id === 'ai-only';
                      return (
                        <button
                          key={choice.id}
                          type="button"
                          onClick={() => handleSelectFocus(choice.id)}
                          className={`group relative text-left rounded-2xl p-5 sm:p-6 border-2 transition-all flex items-start justify-between gap-4 ${
                            active
                              ? isAi
                                ? 'border-slate-900 bg-slate-900 text-white shadow-lg'
                                : 'border-blue-600 bg-blue-50/50 shadow-sm'
                              : isAi
                                ? 'border-slate-300 hover:border-slate-900 bg-slate-50/60'
                                : 'border-slate-200 hover:border-blue-400 bg-white'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                                active
                                  ? 'bg-blue-600 text-white'
                                  : isAi
                                    ? 'bg-slate-900 text-blue-400'
                                    : 'bg-slate-100 text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-600'
                              }`}
                            >
                              <CatalogIcon name={choice.iconName} className="w-6 h-6" />
                            </div>
                            <div className="space-y-1">
                              {choice.tag && (
                                <span
                                  className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-1 ${
                                    active && isAi
                                      ? 'bg-blue-500 text-white'
                                      : isAi
                                        ? 'bg-slate-900 text-blue-300'
                                        : 'bg-blue-100 text-blue-800'
                                  }`}
                                >
                                  {choice.tag}
                                </span>
                              )}
                              <div
                                className={`font-display font-extrabold text-base sm:text-lg leading-snug ${
                                  active && isAi ? 'text-white' : 'text-slate-900'
                                }`}
                              >
                                {choice.title}
                              </div>
                              <p
                                className={`text-xs sm:text-sm leading-relaxed ${
                                  active && isAi ? 'text-slate-300' : 'text-slate-600'
                                }`}
                              >
                                {choice.description}
                              </p>
                            </div>
                          </div>
                          <ArrowRight
                            className={`w-5 h-5 shrink-0 mt-1 transition-transform group-hover:translate-x-1 ${
                              active && isAi ? 'text-blue-400' : 'text-slate-400 group-hover:text-blue-600'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* QUESTION 2 : Choix concrets Outils IA & Applications Internes */}
              {quizStep === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-blue-300 text-[11px] font-bold">
                      <Bot className="w-3.5 h-3.5" />
                      {answers.focus === 'site-only'
                        ? 'Facultatif · Cochez seulement si un outil vous intéresse'
                        : 'Cochez une ou plusieurs solutions selon vos besoins'}
                    </div>
                    <h2 className="font-display text-2xl sm:text-4xl font-black tracking-tight text-slate-900">
                      {answers.focus === 'site-only'
                        ? '2. Souhaitez-vous ajouter un outil intelligent pour gagner du temps ?'
                        : QUIZ_STEPS[1].title}
                    </h2>
                    <p className="text-sm text-slate-600">
                      Nos outils et applications internes sont fabriqués sur-mesure pour votre entreprise : simples sur téléphone/PC, sans vous perdre dans la technique.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {AI_DIAGNOSTIC_CHOICES.map((choice) => {
                      const active = answers.aiChoices.includes(choice.id);
                      return (
                        <button
                          key={choice.id}
                          type="button"
                          onClick={() =>
                            setAnswers((prev) => ({
                              ...prev,
                              aiChoices: prev.aiChoices.includes(choice.id)
                                ? prev.aiChoices.filter((id) => id !== choice.id)
                                : [...prev.aiChoices, choice.id],
                            }))
                          }
                          className={`group relative text-left rounded-2xl p-4 sm:p-5 border-2 transition-all flex items-start gap-3.5 ${
                            choice.id === 'outil-ia-personnalise' ? 'sm:col-span-2 ' : ''
                          }${
                            active
                              ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                              : choice.id === 'outil-ia-personnalise'
                                ? 'border-slate-300 hover:border-blue-500 bg-slate-50/70'
                                : 'border-slate-200 hover:border-blue-400 bg-white'
                          }`}
                        >
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                              active
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-900 text-blue-400 group-hover:bg-blue-600 group-hover:text-white'
                            }`}
                          >
                            <CatalogIcon name={choice.iconName} className="w-5 h-5" />
                          </div>
                          <div className="space-y-1 flex-1 pr-6">
                            <div className="font-display font-extrabold text-sm text-slate-900 leading-snug">
                              {choice.title}
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">{choice.description}</p>
                            {choice.tag && (
                              <span className="inline-block text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md mt-1">
                                {choice.tag}
                              </span>
                            )}
                          </div>
                          <span
                            className={`absolute top-4 right-4 w-5 h-5 rounded-md flex items-center justify-center border ${
                              active
                                ? 'bg-blue-600 border-blue-600 text-white'
                                : 'border-slate-300 text-transparent'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setQuizStep(0);
                        scrollTopSmooth();
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Précédent</span>
                    </button>

                    <div className="flex flex-wrap items-center gap-3">
                      {answers.focus !== 'ai-only' && (
                        <button
                          type="button"
                          onClick={() => {
                            setAnswers((prev) => ({ ...prev, aiChoices: [] }));
                            setQuizStep(2);
                            setMaxVisitedStep((prev) => Math.max(prev, 2));
                            scrollTopSmooth();
                          }}
                          className="text-xs font-bold text-slate-500 hover:text-slate-900 underline"
                        >
                          Passer sans outil IA →
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setQuizStep(2);
                          setMaxVisitedStep((prev) => Math.max(prev, 2));
                          scrollTopSmooth();
                        }}
                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-extrabold uppercase tracking-wider transition-colors"
                      >
                        <span>Continuer (Question 3/4)</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* QUESTION 3 : Site Web ou Plateforme */}
              {quizStep === 2 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="font-display text-2xl sm:text-4xl font-black tracking-tight text-slate-900">
                      {QUIZ_STEPS[2].title}
                    </h2>
                    <p className="text-sm text-slate-600">
                      {answers.focus === 'ai-only'
                        ? 'Si vous avez déjà un site ou n’en voulez pas, laissez simplement « Pas besoin de créer de site internet ».'
                        : 'Choisissez simplement le format qui correspond à ce que vos clients doivent faire chez vous.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {SITE_NEED_CHOICES.map((choice) => {
                      const active = answers.siteNeed === choice.id;
                      return (
                        <button
                          key={choice.id}
                          type="button"
                          onClick={() => {
                            setAnswers((prev) => ({ ...prev, siteNeed: choice.id }));
                            advanceQuizStep(3);
                          }}
                          className={`group relative text-left rounded-2xl p-4 sm:p-5 border-2 transition-all flex items-start gap-3.5 ${
                            active
                              ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                              : 'border-slate-200 hover:border-blue-400 bg-white'
                          }`}
                        >
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                              active
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-600'
                            }`}
                          >
                            <CatalogIcon name={choice.iconName} className="w-5 h-5" />
                          </div>
                          <div className="space-y-1 flex-1">
                            <div className="font-display font-extrabold text-sm text-slate-900 leading-snug">
                              {choice.title}
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">{choice.description}</p>
                            {choice.tag && (
                              <span className="inline-block text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md mt-1">
                                {choice.tag}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* QUESTION 4 : Coups de pouce (Google / ChatGPT / Photos / Logo / Légal) + Suivi Mensuel */}
              {quizStep === 3 && (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h2 className="font-display text-2xl sm:text-4xl font-black tracking-tight text-slate-900">
                      {QUIZ_STEPS[3].title}
                    </h2>
                    <p className="text-sm text-slate-600">
                      Cochez uniquement ce qui vous est utile (c’est facultatif), puis choisissez si vous voulez qu’on s’occupe du suivi après livraison.
                    </p>
                  </div>

                  {/* 4A */}
                  <div className="space-y-3">
                    <div className="text-xs font-extrabold uppercase tracking-wider text-blue-700">
                      A · Coups de pouce supplémentaires (Facultatif — cochez seulement si besoin)
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {BOOST_DIAGNOSTIC_CHOICES.map((choice) => {
                        const active = answers.boostChoices.includes(choice.id);
                        return (
                          <button
                            key={choice.id}
                            type="button"
                            onClick={() =>
                              setAnswers((prev) => ({
                                ...prev,
                                boostChoices: prev.boostChoices.includes(choice.id)
                                  ? prev.boostChoices.filter((id) => id !== choice.id)
                                  : [...prev.boostChoices, choice.id],
                              }))
                            }
                            className={`relative text-left rounded-2xl p-4 border-2 transition-all flex items-start gap-3 ${
                              active
                                ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                                : 'border-slate-200 hover:border-blue-300 bg-white'
                            }`}
                          >
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                active ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              <CatalogIcon name={choice.iconName} className="w-4 h-4" />
                            </div>
                            <div className="space-y-0.5 flex-1 pr-6">
                              <div className="font-display font-extrabold text-sm text-slate-900 leading-snug">
                                {choice.title}
                              </div>
                              <p className="text-xs text-slate-600 leading-snug">{choice.description}</p>
                              {choice.tag && (
                                <span className="inline-block text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded mt-1">
                                  {choice.tag}
                                </span>
                              )}
                            </div>
                            <span
                              className={`absolute top-4 right-4 w-5 h-5 rounded-md flex items-center justify-center border ${
                                active
                                  ? 'bg-blue-600 border-blue-600 text-white'
                                  : 'border-slate-300 text-transparent'
                              }`}
                            >
                              <Check className="w-3.5 h-3.5" />
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 4B · Abonnements Visibilité (SEO, Référencement IA, Google Ads) */}
                  <div className="space-y-3">
                    <div className="text-xs font-extrabold uppercase tracking-wider text-blue-700">
                      B · Abonnements Visibilité Google, IA &amp; Publicité (Facultatif — par mois)
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {MONTHLY_GROWTH_DIAGNOSTIC_CHOICES.map((choice) => {
                        const active = answers.monthlyGrowthChoices.includes(choice.id);
                        return (
                          <button
                            key={choice.id}
                            type="button"
                            onClick={() =>
                              setAnswers((prev) => ({
                                ...prev,
                                monthlyGrowthChoices: prev.monthlyGrowthChoices.includes(choice.id)
                                  ? prev.monthlyGrowthChoices.filter((id) => id !== choice.id)
                                  : [...prev.monthlyGrowthChoices, choice.id],
                              }))
                            }
                            className={`relative text-left rounded-2xl p-4 border-2 transition-all flex flex-col justify-between gap-2 ${
                              active
                                ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                                : 'border-slate-200 hover:border-blue-300 bg-white'
                            }`}
                          >
                            <div className="space-y-1 pr-6">
                              <div className="font-display font-extrabold text-sm text-slate-900 leading-snug">
                                {choice.title}
                              </div>
                              <p className="text-xs text-slate-600 leading-snug">{choice.description}</p>
                            </div>
                            {choice.tag && (
                              <span className="inline-block self-start text-[11px] font-extrabold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded">
                                {choice.tag}
                              </span>
                            )}
                            <span
                              className={`absolute top-4 right-4 w-5 h-5 rounded-md flex items-center justify-center border ${
                                active
                                  ? 'bg-blue-600 border-blue-600 text-white'
                                  : 'border-slate-300 text-transparent'
                              }`}
                            >
                              <Check className="w-3.5 h-3.5" />
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 4C · Maintenance & Mises à jour */}
                  <div className="space-y-3">
                    <div className="text-xs font-extrabold uppercase tracking-wider text-blue-700">
                      C · Après la livraison, comment voulez-vous gérer la maintenance ?
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {CARE_DIAGNOSTIC_CHOICES.map((choice) => {
                        const active = answers.care === choice.id;
                        return (
                          <button
                            key={choice.id}
                            type="button"
                            onClick={() => setAnswers((prev) => ({ ...prev, care: choice.id }))}
                            className={`text-left rounded-2xl p-4 border-2 transition-all flex items-start gap-3 ${
                              active
                                ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                                : 'border-slate-200 hover:border-blue-300 bg-white'
                            }`}
                          >
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                active ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              <CatalogIcon name={choice.iconName} className="w-4 h-4" />
                            </div>
                            <div className="space-y-0.5 flex-1">
                              <div className="font-display font-extrabold text-sm text-slate-900 leading-snug">
                                {choice.title}
                              </div>
                              <p className="text-xs text-slate-600">{choice.description}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setQuizStep(2);
                        scrollTopSmooth();
                      }}
                      className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Question précédente</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleShowRecommendation}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-extrabold uppercase tracking-wider shadow-lg shadow-blue-600/25 transition-all"
                    >
                      <span>Voir mon projet &amp; mon tarif détaillé</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Bottom Back / Next Strip on Q1 & Q3 */}
              {(quizStep === 0 || quizStep === 2) && (
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    disabled={quizStep === 0}
                    onClick={() => {
                      setQuizStep((prev) => Math.max(0, prev - 1));
                      scrollTopSmooth();
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 disabled:opacity-30 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Précédent</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
                      const next = quizStep + 1;
                      setQuizStep(next);
                      setMaxVisitedStep((prev) => Math.max(prev, next));
                      scrollTopSmooth();
                    }}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-extrabold uppercase tracking-wider transition-colors"
                  >
                    <span>Continuer (Question {quizStep + 2}/{QUIZ_STEPS.length})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ---------- MODE 1 : RÉSULTAT ULTRA CLAIR ---------- */}
        {mode === 'diagnostic' && quizDone && recommendation && (
          <div className="space-y-8">
            {/* 1. Top Summary Banner */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/25 border border-blue-400/30 text-[11px] font-extrabold uppercase tracking-wider text-blue-300">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Voici la solution que nous vous conseillons
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setQuizDone(false);
                        setQuizStep(0);
                        scrollTopSmooth();
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-slate-300 hover:text-white underline"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Modifier mes réponses
                    </button>
                  </div>

                  <h1 className="font-display text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                    {recommendation.headline}
                  </h1>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {recommendation.explanation}
                  </p>
                </div>

                {/* Clear Price Summary Box */}
                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 min-w-[290px] space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-300 font-bold">
                        Total à la création
                      </div>
                      <div className="font-display text-3xl sm:text-4xl font-black text-white mt-0.5">
                        {setupTotal === 0 && hasCustomQuote ? (
                          <span>Sur mesure</span>
                        ) : (
                          <>
                            <AnimatedEuro value={setupTotal} />
                            {(baseOption.pricePrefix ||
                              selectedAi.some((a) => Boolean(a.pricePrefix))) && (
                              <span className="text-blue-400 text-xl ml-1">+</span>
                            )}
                          </>
                        )}
                      </div>
                      {setupTotal > 0 && hasCustomQuote && (
                        <div className="text-xs font-bold text-blue-300 mt-0.5">
                          + Outil IA personnalisé (sur mesure)
                        </div>
                      )}
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-white/10 px-2.5 py-1 rounded-full text-slate-200">
                      <Clock className="w-3 h-3 text-blue-400" />
                      ~{estimatedDays} j
                    </span>
                  </div>

                  <div className="pt-2.5 border-t border-white/10 space-y-1 text-xs text-slate-300">
                    {setupTotal === 0 && hasCustomQuote ? (
                      <div className="flex justify-between">
                        <span>Tarif &amp; échéancier :</span>
                        <strong className="text-white">Chiffrage sur mesure sous 24h</strong>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <span>Payé en 2 fois (30 % au lancement) :</span>
                          <strong className="text-white">{formatEuro(deposit)}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Solde à la livraison (70 %) :</span>
                          <strong className="text-white">{formatEuro(balance)}</strong>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between pt-1 border-t border-white/10">
                      <span>Suivi mensuel :</span>
                      <strong className="text-blue-300">
                        {monthlyTotal > 0 ? `${formatEuro(monthlyTotal)} / mois` : '0 € / mois'}
                      </strong>
                    </div>
                    <div className="text-[10px] text-slate-400 pt-0.5">
                      {JAAD_INFO.tvaNotice}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Simple Visual List of Selected Solutions */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900">
                    Ce qui est compris dans votre projet ({activeVisualItems.length})
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Chaque élément explique clairement à quoi il sert dans votre entreprise — modifiable en 1 clic.
                  </p>
                </div>
              </div>

              {activeVisualItems.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center space-y-3">
                  <p className="text-sm font-semibold text-slate-700">
                    Vous n’avez encore aucune prestation payante sélectionnée.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowAddDrawer(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Choisir un outil IA ou un site</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeVisualItems.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border-2 border-blue-600/80 bg-blue-50/20 p-5 flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-900 text-blue-400 flex items-center justify-center shrink-0">
                              <CatalogIcon name={item.iconName} className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-blue-700 mb-0.5">
                                {item.category === 'ai'
                                  ? 'Outil IA / App Interne'
                                  : item.category === 'base'
                                    ? 'Site / Plateforme'
                                    : 'Visibilité & Contenu'}
                              </span>
                              <h3 className="font-display font-extrabold text-base text-slate-900 leading-snug">
                                {item.label}
                              </h3>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="font-display font-black text-xl text-blue-700">
                              {item.isCustomQuote ? (
                                'Sur mesure'
                              ) : (
                                <>
                                  {item.pricePrefix ? `${item.pricePrefix} ` : ''}
                                  {formatEuro(item.price)}
                                </>
                              )}
                            </div>
                            <div className="text-[10px] font-semibold text-slate-500">
                              {item.isCustomQuote ? 'Chiffrage 24h' : `~${item.deliveryDays} jours`}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1.5 text-xs text-slate-700 leading-relaxed">
                          <p>
                            <strong className="text-slate-900">À quoi ça sert concrètement :</strong>{' '}
                            {item.pitch}
                          </p>
                          <p className="text-blue-800 font-semibold">{item.concreteGain}</p>
                        </div>

                        <ul className="space-y-1 pt-2 border-t border-slate-200/70">
                          {item.includes.map((inc) => (
                            <li key={inc} className="flex items-start gap-2 text-xs text-slate-700">
                              <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                              <span>{inc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-2 border-t border-slate-200/70 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            if (item.category === 'base') {
                              setBaseId('deja-site');
                            } else if (item.category === 'ai') {
                              setAiIds((prev) => prev.filter((x) => x !== item.id));
                            } else {
                              setBoostIds((prev) => prev.filter((x) => x !== item.id));
                            }
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-red-300 hover:text-red-700 text-xs font-bold text-slate-600 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Retirer de mon projet</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Expandable Add Drawer */}
              <div className="pt-3 border-t border-slate-100 space-y-4">
                <button
                  type="button"
                  onClick={() => setShowAddDrawer((prev) => !prev)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-extrabold text-slate-800 transition-colors"
                >
                  {showAddDrawer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  <span>
                    ➕ Ajouter un autre outil IA, un site ou une option à mon devis
                  </span>
                </button>

                {showAddDrawer && (
                  <div className="space-y-6 pt-2">
                    {/* Unselected AI Tools */}
                    {unselectedAi.length > 0 && (
                      <div className="space-y-2.5">
                        <div className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                          Outils IA &amp; Applications Internes disponibles
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {unselectedAi.map((opt) => (
                            <div
                              key={opt.id}
                              className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 flex items-start justify-between gap-3"
                            >
                              <div className="space-y-1">
                                <div className="font-display font-extrabold text-sm text-slate-900">
                                  {opt.label}
                                </div>
                                <p className="text-xs text-slate-600">{opt.concreteGain}</p>
                              </div>
                              <div className="text-right shrink-0 space-y-1.5">
                                <div className="font-display font-black text-sm text-slate-900">
                                  {opt.isCustomQuote
                                    ? 'Sur mesure'
                                    : `${opt.pricePrefix ? `${opt.pricePrefix} ` : ''}+${formatEuro(opt.price)}`}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setAiIds((prev) => [...prev, opt.id])}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-blue-600 text-[11px] font-bold text-white transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>Ajouter</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sites & Plateformes Switcher */}
                    <div className="space-y-2.5">
                      <div className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                        Site Internet / Fiche Google / Plateforme (changer de formule)
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {BASE_OPTIONS.map((b) => {
                          const isCur = b.id === baseId;
                          return (
                            <button
                              key={b.id}
                              type="button"
                              onClick={() => setBaseId(b.id)}
                              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                                isCur
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'bg-white border-slate-200 text-slate-700 hover:border-blue-400'
                              }`}
                            >
                              {b.label} ({b.pricePrefix ? `${b.pricePrefix} ` : ''}
                              {formatEuro(b.price)})
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Unselected Boosts */}
                    {unselectedBoosts.length > 0 && (
                      <div className="space-y-2.5">
                        <div className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                          Visibilité Google, Photos, Logo &amp; Légal
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {unselectedBoosts.map((opt) => (
                            <div
                              key={opt.id}
                              className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 flex items-start justify-between gap-3"
                            >
                              <div className="space-y-1">
                                <div className="font-display font-extrabold text-sm text-slate-900">
                                  {opt.label}
                                </div>
                                <p className="text-xs text-slate-600">{opt.concreteGain}</p>
                              </div>
                              <div className="text-right shrink-0 space-y-1.5">
                                <div className="font-display font-black text-sm text-slate-900">
                                  +{formatEuro(opt.price)}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setBoostIds((prev) => [...prev, opt.id])}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-blue-600 text-[11px] font-bold text-white transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>Ajouter</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Monthly Subscriptions (Maintenance + Visibility) */}
              <div className="pt-4 border-t border-slate-100 space-y-5">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-display text-base sm:text-lg font-extrabold text-slate-900">
                      Abonnements Visibilité : SEO, Référencement IA &amp; Google Ads (par mois)
                    </h3>
                    <p className="text-xs text-slate-600">
                      Activez ou retirez chaque levier d’acquisition mensuel en 1 clic — facultatif et séparé de la création.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {MONTHLY_ACQUISITION_OPTIONS.map((opt) => {
                      const active = monthlyGrowthIds.includes(opt.id);
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => toggleMulti(monthlyGrowthIds, setMonthlyGrowthIds, opt.id)}
                          className={`relative text-left rounded-2xl p-4 border-2 transition-all flex flex-col justify-between gap-2 ${
                            active
                              ? 'border-blue-600 bg-blue-50/40 shadow-sm'
                              : 'border-slate-200 hover:border-blue-300 bg-white'
                          }`}
                        >
                          <div className="space-y-1 pr-6">
                            <div className="font-display font-extrabold text-xs sm:text-sm text-slate-900 leading-snug">
                              {opt.label}
                            </div>
                            <p className="text-[11px] text-slate-600 leading-snug">{opt.concreteGain}</p>
                          </div>
                          <div className="font-display font-black text-base text-blue-700 pt-1">
                            {formatEuro(opt.price)} / mois
                          </div>
                          <span
                            className={`absolute top-4 right-4 w-5 h-5 rounded-md flex items-center justify-center border ${
                              active
                                ? 'bg-blue-600 border-blue-600 text-white'
                                : 'border-slate-300 text-transparent'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="font-display text-base sm:text-lg font-extrabold text-slate-900">
                      Maintenance &amp; mises à jour après livraison (modifiable en 1 clic)
                    </h3>
                    <p className="text-xs text-slate-600">
                      Rien d’obligatoire : choisissez 0 € pour être autonome, ou laissez-nous gérer technique et ajouts WhatsApp.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {CARE_OPTIONS.map((opt) => {
                      const active = careId === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setCareId(opt.id)}
                          className={`text-left rounded-2xl p-4 border-2 transition-all flex flex-col justify-between gap-2 ${
                            active
                              ? 'border-blue-600 bg-blue-50/40 shadow-sm'
                              : 'border-slate-200 hover:border-blue-300 bg-white'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="font-display font-extrabold text-xs sm:text-sm text-slate-900 leading-snug">
                              {opt.label}
                            </div>
                            <p className="text-[11px] text-slate-600 leading-snug">{opt.concreteGain}</p>
                          </div>
                          <div className="font-display font-black text-base text-blue-700 pt-1">
                            {opt.price > 0 ? `${formatEuro(opt.price)} / mois` : '0 € / mois'}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Direct Finalization (PDF / WhatsApp / Email) */}
            <FinalSummaryPanel
              baseOption={baseOption}
              selectedAi={selectedAi}
              selectedBoosts={selectedBoosts}
              selectedMonthlyGrowth={selectedMonthlyGrowth}
              careOption={careOption}
              setupTotal={setupTotal}
              monthlyTotal={monthlyTotal}
              estimatedDays={estimatedDays}
              diagnosticContext={recommendation.diagnosticSummaryText}
              showBanner={false}
              onResetAll={resetAll}
              onEditStep={() => {
                setQuizDone(false);
                setQuizStep(0);
                scrollTopSmooth();
              }}
            />

            <div className="text-center">
              <button
                type="button"
                onClick={handleRestartDiagnostic}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Recommencer le questionnaire à zéro</span>
              </button>
            </div>
          </div>
        )}

        {/* ---------- MODE 2 : CATALOGUE COMPLET (POUR EXPERTS / COMMERCIAL) ---------- */}
        {mode === 'catalog' && (
          <>
            {presetBanner && stepIndex > 0 && stepIndex < 5 && (
              <div className="mb-6 bg-blue-50 border border-blue-200/80 text-blue-900 px-4 py-3 rounded-2xl text-xs font-semibold flex flex-wrap items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
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
                selectedMonthlyGrowth={selectedMonthlyGrowth}
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
                <div className="lg:col-span-8 space-y-6">
                  {activeStep.id === 'goal' && (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[11px] font-extrabold uppercase tracking-wider">
                          <Clock className="w-3.5 h-3.5" />
                          Mode Catalogue Direct · Tarifs TTC visibles
                        </div>
                        <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-[1.06]">
                          Composez votre projet <span className="text-blue-600">Web &amp; IA à la carte.</span>
                        </h1>
                        <p className="text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed">
                          Cliquez sur un profil ou passez par nos{' '}
                          <button
                            type="button"
                            onClick={() => {
                              setMode('diagnostic');
                              scrollTopSmooth();
                            }}
                            className="text-blue-600 underline font-bold"
                          >
                            4 questions simples
                          </button>{' '}
                          pour être guidé automatiquement.
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

                  {activeStep.id === 'base' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-blue-600">
                          Étape 02 · Sites Internet &amp; Plateformes
                        </span>
                        <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                          Avez-vous besoin d’un site ou d’une plateforme ?
                        </h2>
                        <p className="text-sm text-slate-600">
                          Vous pouvez choisir « Aucun site à créer (0 €) » si vous cherchez uniquement des outils IA ou applications internes.
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

                  {activeStep.id === 'ai' && (
                    <div className="space-y-6">
                      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-800 shadow-lg">
                        <div className="space-y-2">
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-blue-400">
                            <Cpu className="w-3.5 h-3.5" />
                            Étape 03 · Outils IA &amp; Applications Internes
                          </span>
                          <h2 className="font-display text-2xl sm:text-4xl font-black tracking-tight">
                            Des outils IA sur-mesure pour aider votre entreprise.
                          </h2>
                          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                            Mini-App privée, App Interne IA de rédaction ou gestion d’équipe, Assistant client 24h/24, Automatisation Devis PDF &amp; Tri d’emails.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        {AI_OPTIONS.map((option) => (
                          <SelectableCard
                            key={option.id}
                            option={option}
                            darkTheme
                            selected={aiIds.includes(option.id)}
                            onToggle={() => toggleMulti(aiIds, setAiIds, option.id)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {activeStep.id === 'boost' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-blue-600">
                          Étape 04 · Google, ChatGPT, Photos &amp; Légal
                        </span>
                        <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                          Visibilité, Photos &amp; Conformité
                        </h2>
                        <p className="text-sm text-slate-600">
                          Sortez en haut de Google et sur ChatGPT, ajoutez un shooting photo/drone 4K ou vos textes légaux.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        {BOOST_OPTIONS.map((option) => (
                          <SelectableCard
                            key={option.id}
                            option={option}
                            selected={boostIds.includes(option.id)}
                            onToggle={() => toggleMulti(boostIds, setBoostIds, option.id)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {activeStep.id === 'care' && (
                    <div className="space-y-8">
                      <div className="space-y-2">
                        <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-blue-600">
                          Étape 05 · Abonnements Mensuels (Visibilité &amp; Maintenance)
                        </span>
                        <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                          Visibilité Google / IA &amp; Maintenance mensuelle
                        </h2>
                        <p className="text-sm text-slate-600">
                          Ajoutez un abonnement SEO, Référencement IA (ChatGPT) ou Google Ads si besoin, et choisissez votre niveau de maintenance (0 € à 99 €/mois).
                        </p>
                      </div>

                      <div className="space-y-3">
                        <h3 className="font-display text-lg font-extrabold text-slate-900">
                          Abonnements Visibilité &amp; Publicité (cumulables)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {MONTHLY_ACQUISITION_OPTIONS.map((option) => (
                            <SelectableCard
                              key={option.id}
                              option={option}
                              selected={monthlyGrowthIds.includes(option.id)}
                              onToggle={() =>
                                toggleMulti(monthlyGrowthIds, setMonthlyGrowthIds, option.id)
                              }
                            />
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="font-display text-lg font-extrabold text-slate-900">
                          Maintenance &amp; Mises à jour (1 choix)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>
                  )}

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

                <LiveQuoteSidebar
                  baseOption={baseOption}
                  selectedAi={selectedAi}
                  selectedBoosts={selectedBoosts}
                  selectedMonthlyGrowth={selectedMonthlyGrowth}
                  careOption={careOption}
                  setupTotal={setupTotal}
                  monthlyTotal={monthlyTotal}
                  estimatedDays={estimatedDays}
                  scores={scores}
                  onRemoveAi={(id) => setAiIds((prev) => prev.filter((x) => x !== id))}
                  onRemoveBoost={(id) => setBoostIds((prev) => prev.filter((x) => x !== id))}
                  onRemoveMonthlyGrowth={(id) =>
                    setMonthlyGrowthIds((prev) => prev.filter((x) => x !== id))
                  }
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
          </>
        )}
      </main>
    </div>
  );
}
