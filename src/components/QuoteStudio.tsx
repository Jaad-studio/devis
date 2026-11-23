'use client';

import React, { useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Cpu,
  Plus,
  RotateCcw,
  Sliders,
  Sparkles,
  X,
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
import {
  CARE_CHOICES,
  DAILY_NEED_CHOICES,
  DEFAULT_ANSWERS,
  GOAL_CHOICES,
  QUIZ_STEPS,
  SECTOR_CHOICES,
  SITUATION_CHOICES,
  VISUAL_CHOICES,
  computeRecommendation,
  type DiagnosticAnswers,
  type DiagnosticRecommendation,
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
        <div className={`text-[11px] font-bold ${darkTheme ? 'text-blue-300' : 'text-blue-700'}`}>
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
  // Primary Mode: Guided 5-question diagnostic vs. Full expert catalog
  const [mode, setMode] = useState<'diagnostic' | 'catalog'>('diagnostic');

  // Diagnostic State
  const [quizStep, setQuizStep] = useState<number>(0);
  const [maxVisitedStep, setMaxVisitedStep] = useState<number>(0);
  const [quizDone, setQuizDone] = useState<boolean>(false);
  const [answers, setAnswers] = useState<DiagnosticAnswers>(DEFAULT_ANSWERS);
  const [recommendation, setRecommendation] = useState<DiagnosticRecommendation | null>(null);
  const [showMoreOptions, setShowMoreOptions] = useState<boolean>(false);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Shared Quote Selections (updated by Diagnostic AND editable in both modes)
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedGoalId, setSelectedGoalId] = useState<string>('artisan-local');
  const [baseId, setBaseId] = useState<string>('vitrine-impact');
  const [aiIds, setAiIds] = useState<string[]>([]);
  const [boostIds, setBoostIds] = useState<string[]>(['seo-google']);
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

  function toggleMulti(list: string[], setter: (next: string[]) => void, id: string) {
    setter(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  }

  function toggleOptionById(option: ServiceOption) {
    if (option.category === 'ai') {
      toggleMulti(aiIds, setAiIds, option.id);
    } else if (option.category === 'boost') {
      toggleMulti(boostIds, setBoostIds, option.id);
    }
  }

  function advanceQuizStep(targetStep: number) {
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    advanceTimerRef.current = setTimeout(() => {
      setQuizStep(targetStep);
      setMaxVisitedStep((prev) => Math.max(prev, targetStep));
      scrollTopSmooth();
    }, 150);
  }

  function handleShowRecommendation() {
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    const rec = computeRecommendation(answers);
    setRecommendation(rec);
    setBaseId(rec.baseId);
    setAiIds(rec.aiIds);
    setBoostIds(rec.boostIds);
    setCareId(rec.careId);
    setQuizDone(true);
    setShowMoreOptions(false);
    scrollTopSmooth();
  }

  function handleRestartDiagnostic() {
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    setAnswers(DEFAULT_ANSWERS);
    setQuizStep(0);
    setMaxVisitedStep(0);
    setQuizDone(false);
    setRecommendation(null);
    setShowMoreOptions(false);
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
    setBoostIds(['seo-google']);
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

  // Computed extras lists for the Diagnostic Result View
  const allExtras = useMemo(() => [...BOOST_OPTIONS, ...AI_OPTIONS], []);
  const activeExtras = useMemo(
    () => allExtras.filter((opt) => aiIds.includes(opt.id) || boostIds.includes(opt.id)),
    [allExtras, aiIds, boostIds]
  );

  const recommendedUnselectedExtras = useMemo(() => {
    const recIds = recommendation?.matrixRecommendedIds || [];
    return allExtras.filter(
      (opt) => recIds.includes(opt.id) && !aiIds.includes(opt.id) && !boostIds.includes(opt.id)
    );
  }, [allExtras, recommendation, aiIds, boostIds]);

  const otherUnselectedExtras = useMemo(() => {
    const recIds = new Set(recommendation?.matrixRecommendedIds || []);
    return allExtras.filter(
      (opt) => !recIds.has(opt.id) && !aiIds.includes(opt.id) && !boostIds.includes(opt.id)
    );
  }, [allExtras, recommendation, aiIds, boostIds]);

  const orderedAlternativeBases = useMemo(() => {
    const preferred = new Set(recommendation?.alternativeBaseIds || []);
    const primary = BASE_OPTIONS.filter((b) => preferred.has(b.id) && b.id !== baseId);
    const rest = BASE_OPTIONS.filter((b) => !preferred.has(b.id) && b.id !== baseId);
    return [...primary, ...rest];
  }, [recommendation, baseId]);

  const deposit = Math.round(setupTotal * 0.3);

  return (
    <div className="min-h-screen flex flex-col relative pb-24 lg:pb-14">
      {/* Subtle Architectural Cobalt Background Atmosphere */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -left-32 w-[540px] h-[540px] rounded-full bg-blue-500/10 blur-[110px]" />
        <div className="absolute bottom-0 -right-32 w-[540px] h-[540px] rounded-full bg-sky-400/10 blur-[110px]" />
      </div>

      {/* Top Sticky Studio Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-slate-900 text-white font-display font-black text-lg flex items-center justify-center shadow-sm shrink-0">
              J<span className="text-blue-500">.</span>
            </span>
            <div>
              <div className="font-display font-black text-base sm:text-lg tracking-tight text-slate-900 leading-none">
                JAAD <span className="text-blue-600">STUDIO.</span>
              </div>
              <div className="text-[9.5px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">
                Des idées en solutions digitales.
              </div>
            </div>
          </div>

          {/* Middle Progress / Step Nav */}
          {mode === 'diagnostic' ? (
            <nav
              aria-label="Progression du diagnostic"
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
                  Ma Solution
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

          {/* Right Mode Toggle + Site Link */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'diagnostic' ? 'catalog' : 'diagnostic');
                scrollTopSmooth();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-900 hover:text-white hover:border-slate-900 text-xs font-bold text-slate-700 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>
                {mode === 'diagnostic' ? 'Grille & Catalogue Complet' : 'Diagnostic Guidé (5 questions)'}
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
        {/* ---------- MODE 1 : DIAGNOSTIC GUIDÉ (DEFAULT) ---------- */}
        {mode === 'diagnostic' && !quizDone && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Reassuring Header & Progress Bar */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[11px] font-extrabold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  Diagnostic gratuit en 1 minute · Solution &amp; Tarif immédiat
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

            {/* Question Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.14)] p-6 sm:p-10 space-y-6">
              {/* Q1: SECTOR */}
              {quizStep === 0 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h1 className="font-display text-2xl sm:text-4xl font-black tracking-tight text-slate-900">
                      {QUIZ_STEPS[0].title}
                    </h1>
                    <p className="text-sm text-slate-600">
                      Cliquez simplement sur ce qui décrit le mieux votre entreprise : pas besoin de connaître le vocabulaire technique.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {SECTOR_CHOICES.map((choice) => {
                      const active = answers.sector === choice.id;
                      return (
                        <button
                          key={choice.id}
                          type="button"
                          onClick={() => {
                            setAnswers((prev) => ({ ...prev, sector: choice.id }));
                            advanceQuizStep(1);
                          }}
                          className={`group text-left rounded-2xl p-5 border-2 transition-all flex items-start gap-4 ${
                            active
                              ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                              : 'border-slate-200 hover:border-blue-400 bg-white'
                          }`}
                        >
                          <div
                            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                              active
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-600'
                            }`}
                          >
                            <CatalogIcon name={choice.iconName} className="w-5 h-5" />
                          </div>
                          <div className="space-y-1">
                            <div className="font-display font-extrabold text-base text-slate-900 group-hover:text-blue-700">
                              {choice.title}
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">{choice.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Q2: SITUATION */}
              {quizStep === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="font-display text-2xl sm:text-4xl font-black tracking-tight text-slate-900">
                      {QUIZ_STEPS[1].title}
                    </h2>
                    <p className="text-sm text-slate-600">
                      Cela nous évite de vous proposer quelque chose que vous avez déjà ou dont vous n’avez pas besoin.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {SITUATION_CHOICES.map((choice) => {
                      const active = answers.situation === choice.id;
                      return (
                        <button
                          key={choice.id}
                          type="button"
                          onClick={() => {
                            setAnswers((prev) => ({ ...prev, situation: choice.id }));
                            advanceQuizStep(2);
                          }}
                          className={`group text-left rounded-2xl p-4 sm:p-5 border-2 transition-all flex items-center justify-between gap-4 ${
                            active
                              ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                              : 'border-slate-200 hover:border-blue-400 bg-white'
                          }`}
                        >
                          <div className="flex items-start sm:items-center gap-4">
                            <div
                              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                active
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-slate-100 text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-600'
                              }`}
                            >
                              <CatalogIcon name={choice.iconName} className="w-5 h-5" />
                            </div>
                            <div className="space-y-0.5">
                              <div className="font-display font-extrabold text-base text-slate-900">
                                {choice.title}
                              </div>
                              <p className="text-xs text-slate-600">{choice.description}</p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 shrink-0 transition-colors" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Q3: MAIN GOAL */}
              {quizStep === 2 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="font-display text-2xl sm:text-4xl font-black tracking-tight text-slate-900">
                      {QUIZ_STEPS[2].title}
                    </h2>
                    <p className="text-sm text-slate-600">
                      Choisissez l’usage principal que vous attendez de votre outil digital.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {GOAL_CHOICES.map((choice) => {
                      const active = answers.goal === choice.id;
                      return (
                        <button
                          key={choice.id}
                          type="button"
                          onClick={() => {
                            setAnswers((prev) => ({ ...prev, goal: choice.id }));
                            advanceQuizStep(3);
                          }}
                          className={`group relative text-left rounded-2xl p-5 border-2 transition-all flex items-start gap-3.5 ${
                            active
                              ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                              : 'border-slate-200 hover:border-blue-400 bg-white'
                          }`}
                        >
                          {choice.tag && (
                            <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-900 text-white uppercase tracking-wider">
                              {choice.tag}
                            </span>
                          )}
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                              active
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-600'
                            }`}
                          >
                            <CatalogIcon name={choice.iconName} className="w-5 h-5" />
                          </div>
                          <div className="space-y-1">
                            <div className="font-display font-extrabold text-sm sm:text-base text-slate-900 leading-snug">
                              {choice.title}
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">{choice.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Q4: DAILY NEEDS / ACQUISITION & AI (MULTI-SELECT) */}
              {quizStep === 3 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
                      Plusieurs choix possibles (ou aucun)
                    </div>
                    <h2 className="font-display text-2xl sm:text-4xl font-black tracking-tight text-slate-900">
                      {QUIZ_STEPS[3].title}
                    </h2>
                    <p className="text-sm text-slate-600">
                      Cochez tout ce qui vous aiderait concrètement à trouver des clients ou gagner du temps.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {DAILY_NEED_CHOICES.map((choice) => {
                      const active = answers.dailyNeeds.includes(choice.id);
                      return (
                        <button
                          key={choice.id}
                          type="button"
                          onClick={() =>
                            setAnswers((prev) => ({
                              ...prev,
                              dailyNeeds: prev.dailyNeeds.includes(choice.id)
                                ? prev.dailyNeeds.filter((id) => id !== choice.id)
                                : [...prev.dailyNeeds, choice.id],
                            }))
                          }
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
                          <div className="space-y-1 flex-1 pr-6">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-display font-extrabold text-sm text-slate-900 leading-snug">
                                {choice.title}
                              </span>
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
                        setAnswers((prev) => ({ ...prev, dailyNeeds: [] }));
                        setQuizStep(4);
                        setMaxVisitedStep((prev) => Math.max(prev, 4));
                        scrollTopSmooth();
                      }}
                      className="text-xs font-bold text-slate-500 hover:text-slate-900 underline"
                    >
                      Je n’ai pas besoin d’option supplémentaire pour l’instant →
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setQuizStep(4);
                        setMaxVisitedStep((prev) => Math.max(prev, 4));
                        scrollTopSmooth();
                      }}
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-extrabold uppercase tracking-wider transition-colors"
                    >
                      <span>Continuer (Question 5/5)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Q5: VISUALS / LEGAL + MONTHLY CARE */}
              {quizStep === 4 && (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h2 className="font-display text-2xl sm:text-4xl font-black tracking-tight text-slate-900">
                      {QUIZ_STEPS[4].title}
                    </h2>
                    <p className="text-sm text-slate-600">
                      Une fois ces deux points choisis, vous découvrez immédiatement votre solution personnalisée et le tarif détaillé.
                    </p>
                  </div>

                  {/* Part A: Visuals & Legal */}
                  <div className="space-y-3">
                    <div className="text-xs font-extrabold uppercase tracking-wider text-blue-700">
                      A · Avez-vous déjà votre logo, vos photos et vos textes légaux ?
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {VISUAL_CHOICES.map((choice) => {
                        const active = answers.visual === choice.id;
                        return (
                          <button
                            key={choice.id}
                            type="button"
                            onClick={() => setAnswers((prev) => ({ ...prev, visual: choice.id }))}
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
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-display font-extrabold text-sm text-slate-900">
                                  {choice.title}
                                </span>
                                {choice.tag && (
                                  <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded shrink-0">
                                    {choice.tag}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-600">{choice.description}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Part B: Monthly Follow-up */}
                  <div className="space-y-3">
                    <div className="text-xs font-extrabold uppercase tracking-wider text-blue-700">
                      B · Une fois votre projet en ligne, comment préférez-vous fonctionner ?
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {CARE_CHOICES.map((choice) => {
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
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-display font-extrabold text-sm text-slate-900">
                                  {choice.title}
                                </span>
                                {choice.tag && (
                                  <span className="text-[10px] font-extrabold text-slate-900 bg-slate-100 px-2 py-0.5 rounded shrink-0">
                                    {choice.tag}
                                  </span>
                                )}
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
                        setQuizStep(3);
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
                      <span>Voir ma solution recommandée &amp; mon tarif</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Bottom Back / Next Strip on Q1-Q3 */}
              {quizStep < 3 && (
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
                      const next = quizStep + 1;
                      setQuizStep(next);
                      setMaxVisitedStep((prev) => Math.max(prev, next));
                      scrollTopSmooth();
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <span>Continuer</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ---------- MODE 1 : DIAGNOSTIC RESULT & ADAPTED SOLUTION ---------- */}
        {mode === 'diagnostic' && quizDone && recommendation && (
          <div className="space-y-8">
            {/* Block 1: Personalized Diagnostic & Budget Hero */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/25 border border-blue-400/30 text-[11px] font-extrabold uppercase tracking-wider text-blue-300">
                      <Sparkles className="w-3.5 h-3.5" />
                      Diagnostic &amp; Solution Adaptée
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setQuizDone(false);
                        setQuizStep(0);
                        scrollTopSmooth();
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-300 hover:text-white underline"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      Modifier mes réponses au questionnaire
                    </button>
                  </div>

                  <h1 className="font-display text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                    {recommendation.diagnosticHeadline}
                  </h1>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {recommendation.diagnosticReasoning}
                  </p>
                </div>

                {/* Clear Punctual vs Monthly Box */}
                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 min-w-[275px] space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-300 font-bold">
                        Frais ponctuels (Création)
                      </div>
                      <div className="font-display text-3xl sm:text-4xl font-black text-white mt-0.5">
                        <AnimatedEuro value={setupTotal} />
                        {baseOption.pricePrefix && (
                          <span className="text-blue-400 text-xl ml-1">+</span>
                        )}
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-white/10 px-2.5 py-1 rounded-full text-slate-200">
                      <Clock className="w-3 h-3 text-blue-400" />
                      ~{estimatedDays} j
                    </span>
                  </div>

                  <div className="pt-2.5 border-t border-white/10 space-y-1 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span>Abonnement mensuel :</span>
                      <strong className="text-blue-300">
                        {monthlyTotal > 0 ? `${formatEuro(monthlyTotal)} / mois` : '0 € (Autonome)'}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Acompte 30 % au lancement :</span>
                      <strong className="text-white">{formatEuro(deposit)}</strong>
                    </div>
                    <div className="text-[10px] text-slate-400 pt-0.5">
                      {JAAD_INFO.tvaNotice} · 100 % propriétaire
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Block 2: Recommended Socle + ✓ Inclusions + 1-Click Base Comparators */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-blue-600 text-white text-[10px] font-extrabold uppercase tracking-wider">
                      ✓ Socle de votre solution
                    </span>
                    {baseOption.badge && (
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                        {baseOption.badge}
                      </span>
                    )}
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900">
                    {baseOption.label}
                  </h2>
                  <p className="text-xs sm:text-sm font-semibold text-blue-700">
                    →{' '}
                    {recommendation.reasonsByItemId[baseOption.id] ||
                      baseOption.concreteGain}
                  </p>
                </div>

                <div className="md:text-right shrink-0">
                  <div className="font-display text-3xl font-black text-slate-900">
                    {baseOption.pricePrefix ? `${baseOption.pricePrefix} ` : ''}
                    {formatEuro(baseOption.price)}
                  </div>
                  <div className="text-xs font-medium text-slate-500">
                    Création ponctuelle · ~{baseOption.deliveryDays} jours
                  </div>
                </div>
              </div>

              {/* ✓ Socle Inclusions Grid */}
              <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-100">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-3">
                  Inclus de base dans ce socle (✓) :
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {baseOption.includes.map((inc) => (
                    <div key={inc} className="flex items-start gap-2.5 text-xs font-semibold text-slate-800">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </span>
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 1-Click Switch to Another Socle */}
              <div className="space-y-2.5">
                <div className="text-xs font-bold text-slate-500">
                  Comparer ou choisir un autre socle en 1 clic :
                </div>
                <div className="flex flex-wrap gap-2">
                  {orderedAlternativeBases.map((alt) => {
                    const isSuggestedAlt = recommendation.alternativeBaseIds.includes(alt.id);
                    return (
                      <button
                        key={alt.id}
                        type="button"
                        onClick={() => setBaseId(alt.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                          isSuggestedAlt
                            ? 'bg-blue-50/70 border-blue-200 text-blue-900 hover:bg-blue-600 hover:text-white hover:border-blue-600'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400'
                        }`}
                      >
                        <span>{alt.label}</span>
                        <span className="opacity-80">
                          ({alt.pricePrefix ? `${alt.pricePrefix} ` : ''}
                          {formatEuro(alt.price)})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Block 3: Recommended Complements (R) & Selected Options (O) */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900">
                  Compléments recommandés (<span className="text-blue-600">R</span>) &amp; options de votre devis
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Activez ou retirez chaque module en 1 clic : votre estimation et votre PDF se mettent à jour instantanément.
                </p>
              </div>

              {/* Currently Active Extras */}
              <div className="space-y-3">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  Modules activés dans votre estimation ({activeExtras.length})
                </div>

                {activeExtras.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-xs text-slate-600">
                    Aucun complément payant activé — seul votre socle ({baseOption.label}) est chiffré. Ajoutez ci-dessous un complément recommandé (<strong>R</strong>) ou une option si besoin.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {activeExtras.map((opt) => {
                      const isMatrixR = recommendation.matrixRecommendedIds.includes(opt.id);
                      return (
                        <div
                          key={opt.id}
                          className="rounded-2xl border-2 border-blue-600 bg-blue-50/30 p-4 flex items-start justify-between gap-3"
                        >
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                                  isMatrixR
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-900 text-white'
                                }`}
                              >
                                {isMatrixR ? 'R · Recommandé' : 'O · Option ajoutée'}
                              </span>
                              <span className="font-display font-extrabold text-sm text-slate-900">
                                {opt.label}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {recommendation.reasonsByItemId[opt.id] || opt.concreteGain}
                            </p>
                          </div>

                          <div className="text-right shrink-0 space-y-2">
                            <div className="font-display font-black text-base text-blue-700">
                              +{formatEuro(opt.price)}
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleOptionById(opt)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-red-300 hover:text-red-700 text-[11px] font-bold text-slate-600 transition-colors"
                            >
                              <X className="w-3 h-3" />
                              <span>Retirer</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Matrix Recommended (R) not yet enabled */}
              {recommendedUnselectedExtras.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700">
                    Compléments conseillés pour votre format (R · Recommandés) :
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {recommendedUnselectedExtras.map((opt) => (
                      <div
                        key={opt.id}
                        className="rounded-2xl border border-blue-200 bg-white p-4 flex items-start justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-100 text-blue-800 uppercase">
                              R · Conseillé
                            </span>
                            <span className="font-display font-extrabold text-sm text-slate-900">
                              {opt.label}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {recommendation.reasonsByItemId[opt.id] || opt.concreteGain}
                          </p>
                        </div>

                        <div className="text-right shrink-0 space-y-2">
                          <div className="font-display font-black text-base text-slate-900">
                            {opt.pricePrefix ? `${opt.pricePrefix} ` : ''}
                            +{formatEuro(opt.price)}
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleOptionById(opt)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-[11px] font-bold text-white transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Ajouter</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Expandable Drawer for all remaining O options */}
              {otherUnselectedExtras.length > 0 && (
                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <button
                    type="button"
                    onClick={() => setShowMoreOptions((prev) => !prev)}
                    className="inline-flex items-center gap-2 text-xs font-extrabold text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    {showMoreOptions ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                    <span>
                      Explorer les autres options à la carte (IA, GEO, SEA, 3D, Drone, Légal — {otherUnselectedExtras.length})
                    </span>
                  </button>

                  {showMoreOptions && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {otherUnselectedExtras.map((opt) => (
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
                            <div className="font-display font-bold text-sm text-slate-900">
                              {opt.pricePrefix ? `${opt.pricePrefix} ` : ''}
                              +{formatEuro(opt.price)}
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleOptionById(opt)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-blue-600 text-[11px] font-bold text-white transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Ajouter</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Block 4: Monthly Care / Support Switcher */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
              <div>
                <h2 className="font-display text-lg sm:text-xl font-black text-slate-900">
                  Suivi mensuel &amp; maintenance après mise en ligne
                </h2>
                <p className="text-xs text-slate-600">
                  Frais mensuels séparés de la création ponctuelle — ajustez librement ci-dessous.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {CARE_OPTIONS.map((opt) => {
                  const active = careId === opt.id;
                  const isRec = recommendation.recommendedCareId === opt.id;
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
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-display font-extrabold text-sm text-slate-900">
                            {opt.label}
                          </span>
                          {isRec && (
                            <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[9px] font-extrabold uppercase shrink-0">
                              R
                            </span>
                          )}
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

            {/* Block 5: Direct PDF Download / WhatsApp / Email */}
            <FinalSummaryPanel
              baseOption={baseOption}
              selectedAi={selectedAi}
              selectedBoosts={selectedBoosts}
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
                <span>Refaire tout le diagnostic à zéro</span>
              </button>
            </div>
          </div>
        )}

        {/* ---------- MODE 2 : FULL CATALOGUE MODE (FOR SALESPERSON / EXPERTS) ---------- */}
        {mode === 'catalog' && (
          <>
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
                  {activeStep.id === 'goal' && (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[11px] font-extrabold uppercase tracking-wider">
                          <Clock className="w-3.5 h-3.5" />
                          Mode Catalogue Direct · Tarifs nets visibles en direct
                        </div>
                        <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-[1.06]">
                          À quel projet souhaitez-vous <span className="text-blue-600">donner vie aujourd’hui ?</span>
                        </h1>
                        <p className="text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed">
                          Cliquez sur un profil pour pré-remplir la grille, ou passez directement en{' '}
                          <button
                            type="button"
                            onClick={() => {
                              setMode('diagnostic');
                              scrollTopSmooth();
                            }}
                            className="text-blue-600 underline font-bold"
                          >
                            mode diagnostic 5 questions
                          </button>
                          .
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
                          Étape 02 · Socles Web &amp; Plateformes
                        </span>
                        <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                          Quel socle correspond à votre besoin ?
                        </h2>
                        <p className="text-sm text-slate-600">
                          De la fiche Google My Business (290 €) jusqu’à l’Application / SaaS (dès 1 990 €), ou 0 € si vous avez déjà votre site.
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
                            Étape 03 · Pôle Intelligence Artificielle &amp; Outils Poussés
                          </span>
                          <h2 className="font-display text-2xl sm:text-4xl font-black tracking-tight">
                            Des outils concrets qui travaillent pour vous.
                          </h2>
                          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                            Sélectionnez zéro, un ou plusieurs modules : mini-app métier sans abonnement, agent WhatsApp 24/7, studio SEO ou système multi-agents.
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

                  {activeStep.id === 'boost' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-blue-600">
                          Étape 04 · Acquisition (SEO, GEO, SEA) &amp; Contenus
                        </span>
                        <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                          Multipliez votre impact local, IA &amp; visuel
                        </h2>
                        <p className="text-sm text-slate-600">
                          Activez les leviers d’acquisition Google (SEO / SEA), visibilité moteurs IA (GEO), shooting photo/drone 4K, 3D ou pack juridique CGV.
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
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-blue-600">
                          Étape 05 · Maintenance, Support &amp; Suivi SEO mensuel
                        </span>
                        <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                          Voulez-vous qu’on gère la suite chaque mois ?
                        </h2>
                        <p className="text-sm text-slate-600">
                          Rien d’obligatoire : autonomie totale à 0 €, ou délégation mensuelle pour hébergement, mises à jour et croissance SEO.
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
          </>
        )}
      </main>
    </div>
  );
}
