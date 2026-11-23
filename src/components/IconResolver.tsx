'use client';

import React from 'react';
import {
  Bot,
  Box,
  Building2,
  Camera,
  Check,
  CheckCircle2,
  Cpu,
  Crown,
  Layers,
  LayoutPanelTop,
  Palette,
  Rocket,
  Scale,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sliders,
  Smartphone,
  Sparkles,
  TrendingUp,
  Wand2,
  Workflow,
  Wrench,
  Zap,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Wrench,
  Building2,
  ShoppingBag,
  Bot,
  Layers,
  Sliders,
  Rocket,
  Sparkles,
  Crown,
  LayoutPanelTop,
  CheckCircle2,
  Smartphone,
  Wand2,
  Workflow,
  Cpu,
  Search,
  Box,
  Palette,
  Camera,
  Scale,
  Check,
  ShieldCheck,
  Zap,
  TrendingUp,
};

export function CatalogIcon({ name, className = 'w-5 h-5' }: { name: string; className?: string }) {
  const Component = ICON_MAP[name] || Sparkles;
  return <Component className={className} />;
}
