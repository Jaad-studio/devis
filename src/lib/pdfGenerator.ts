import { jsPDF } from 'jspdf';
import { JAAD_INFO, type ServiceOption } from '@/data/catalog';

export interface QuotePdfPayload {
  quoteId: string;
  clientName: string;
  company: string;
  email: string;
  phone: string;
  timelineLabel: string;
  brief: string;
  oneTimeItems: ServiceOption[];
  monthlyItem: ServiceOption | null;
  setupTotal: number;
  monthlyTotal: number;
  estimatedDays: number;
}

function fmtEuro(value: number): string {
  const formatted = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace(/\u202f|\u00a0/g, ' ');
  return `${formatted} €`;
}

function pdfSafe(text: string): string {
  return text
    .replace(/→/g, '->')
    .replace(/★/g, '*')
    .replace(/…/g, '...')
    .replace(/[\u2018\u2019]/g, "'");
}

export function generateJaadQuotePdf(data: QuotePdfPayload): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = 210;
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  const dateStr = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  // Top subtle accent bar
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, pageWidth, 2.5, 'F');

  // Monogram [J.] badge + JAAD STUDIO wordmark
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(margin, 14, 12, 12, 2.2, 2.2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text('J', margin + 4.1, 22.1);
  doc.setTextColor(59, 102, 245);
  doc.text('.', margin + 7.9, 22.1);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(18);
  doc.text('JAAD', margin + 15.5, 21);
  doc.setTextColor(37, 99, 235);
  doc.text('STUDIO.', margin + 35, 21);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('SITES WEB · OUTILS IA SUR-MESURE · SOLUTIONS DIGITALES', margin + 15.5, 25.5);

  // Right quote header pill & metadata
  doc.setFillColor(239, 246, 255);
  doc.setDrawColor(191, 219, 254);
  doc.roundedRect(pageWidth - margin - 46, 13.5, 46, 6.2, 3, 3, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(37, 99, 235);
  doc.text('ESTIMATION SUR-MESURE', pageWidth - margin - 23, 17.6, { align: 'center' });

  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text(`N° ${data.quoteId}`, pageWidth - margin, 25.2, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Émis le ${dateStr} · Valable 30 jours`, pageWidth - margin, 29.8, { align: 'right' });

  // Horizontal hairline
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, 34, pageWidth - margin, 34);

  // Two-column emitter / client cards
  const boxY = 39;
  const boxW = (contentWidth - 6) / 2;
  const boxH = 29;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, boxY, boxW, boxH, 3, 3, 'FD');
  doc.roundedRect(margin + boxW + 6, boxY, boxW, boxH, 3, 3, 'FD');

  // Emitter details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(37, 99, 235);
  doc.text('PRESTATAIRE · ÉMETTEUR', margin + 4.5, boxY + 5.8);

  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(pdfSafe(`${JAAD_INFO.brand} — ${JAAD_INFO.owner}`), margin + 4.5, boxY + 11.2);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.4);
  doc.setTextColor(71, 85, 105);
  doc.text(pdfSafe(JAAD_INFO.address), margin + 4.5, boxY + 15.8);
  doc.text(pdfSafe(`Tél : ${JAAD_INFO.phoneDisplay} · ${JAAD_INFO.email}`), margin + 4.5, boxY + 20.1);
  doc.text(pdfSafe(`SIRET ${JAAD_INFO.siret} · ${JAAD_INFO.tvaNotice}`), margin + 4.5, boxY + 24.4);

  // Client details
  const rightX = margin + boxW + 10.5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(37, 99, 235);
  doc.text('CLIENT · DESTINATAIRE', rightX, boxY + 5.8);

  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  const displayCompany = (data.company || data.clientName || 'Prospect JAAD Studio').trim();
  doc.text(displayCompany, rightX, boxY + 11.2);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  const contactLine = [data.clientName && data.clientName !== displayCompany ? data.clientName : null, data.phone || null]
    .filter(Boolean)
    .join(' · ');
  if (contactLine) {
    doc.text(contactLine, rightX, boxY + 15.8);
    doc.text(data.email || 'Email à compléter', rightX, boxY + 20.1);
  } else {
    doc.text(data.email || 'Coordonnées à confirmer', rightX, boxY + 15.8);
  }
  doc.text(
    `Lancement : ${data.timelineLabel} · Délai estimé : ~${data.estimatedDays} jours`,
    rightX,
    boxY + 24.4
  );

  // Payment schedule bar
  let y = boxY + boxH + 7;
  const hasCustomQuote = data.oneTimeItems.some((item) => Boolean(item.isCustomQuote));
  const deposit = Math.round(data.setupTotal * 0.3);
  const balance = data.setupTotal - deposit;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, contentWidth, 12, 2.5, 2.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('ÉCHÉANCIER HABITUEL :', margin + 4, y + 7.3);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(
    data.setupTotal === 0 && hasCustomQuote
      ? 'Chiffrage sur mesure sous 24h  ·  Paiement habituel 30 % au lancement / 70 % à la livraison'
      : `30 % à la commande (${fmtEuro(deposit)})  ·  70 % à la mise en ligne (${fmtEuro(balance)})`,
    margin + 42,
    y + 7.3
  );

  y += 19;

  // Items table header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('PRESTATIONS SÉLECTIONNÉES', margin, y);
  doc.text('TYPE', pageWidth - margin - 42, y);
  doc.text('TARIF NET', pageWidth - margin, y, { align: 'right' });
  y += 3;
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  const renderRow = (item: ServiceOption) => {
    const tagMap: Record<ServiceOption['category'], string> = {
      base: 'Socle Web',
      ai: 'Outil IA',
      boost: 'Boost & Option',
      care: 'Suivi Mensuel',
    };

    const descLines = doc.splitTextToSize(pdfSafe(item.pitch), contentWidth - 52);
    const blockHeight = 7 + descLines.length * 4 + 4;

    if (y + blockHeight > 248) {
      doc.addPage();
      y = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(pdfSafe(item.label), margin, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(tagMap[item.category], pageWidth - margin - 42, y);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(item.isMonthly ? 15 : 37, item.isMonthly ? 23 : 99, item.isMonthly ? 42 : 235);
    const priceLabel = item.isCustomQuote
      ? 'Sur mesure'
      : `${item.pricePrefix ? `${item.pricePrefix} ` : ''}${fmtEuro(item.price)}${
          item.isMonthly ? '/mois' : ''
        }`;
    doc.text(priceLabel, pageWidth - margin, y, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(descLines, margin, y + 4.5);

    y += 5 + descLines.length * 4;
    doc.setDrawColor(241, 245, 249);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;
  };

  for (const item of data.oneTimeItems) {
    renderRow(item);
  }
  if (data.monthlyItem && data.monthlyItem.price > 0) {
    renderRow(data.monthlyItem);
  }

  // Optional client brief
  if (data.brief.trim()) {
    const briefLines = doc.splitTextToSize(pdfSafe(data.brief.trim()), contentWidth - 10);
    const briefBoxH = 11 + briefLines.length * 4;
    if (y + briefBoxH > 245) {
      doc.addPage();
      y = 20;
    }
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, briefBoxH, 2.5, 2.5, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(37, 99, 235);
    doc.text('PRÉCISIONS PROJET DU CLIENT', margin + 5, y + 5.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    doc.text(briefLines, margin + 5, y + 10);
    y += briefBoxH + 6;
  }

  // Totals Summary Box
  if (y + 38 > 272) {
    doc.addPage();
    y = 20;
  }
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(margin, y, contentWidth, 30, 3.5, 3.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('INVESTISSEMENT CRÉATION (NET À PAYER)', margin + 7, y + 8.5);
  doc.setFontSize(data.setupTotal > 0 && hasCustomQuote ? 16 : 20);
  doc.setTextColor(255, 255, 255);
  doc.text(
    data.setupTotal === 0 && hasCustomQuote
      ? 'Sur mesure'
      : `${fmtEuro(data.setupTotal)}${hasCustomQuote ? ' + Sur mesure' : ''}`,
    margin + 7,
    y + 18.5
  );
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(147, 197, 253);
  doc.text(
    data.setupTotal === 0 && hasCustomQuote
      ? 'Chiffrage personnalisé gratuit sous 24h'
      : `Dont acompte 30 % à la commande : ${fmtEuro(deposit)}`,
    margin + 7,
    y + 24.5
  );

  if (data.monthlyTotal > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text('ABONNEMENT MENSUEL', pageWidth - margin - 7, y + 8.5, { align: 'right' });
    doc.setFontSize(17);
    doc.setTextColor(96, 165, 250);
    doc.text(`${fmtEuro(data.monthlyTotal)} / mois`, pageWidth - margin - 7, y + 18, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(203, 213, 225);
    doc.text('Sans frais de mise en service cachés', pageWidth - margin - 7, y + 24.5, { align: 'right' });
  } else {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(203, 213, 225);
    doc.text('Formule sans abonnement mensuel', pageWidth - margin - 7, y + 16.5, { align: 'right' });
  }

  // Page footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `${JAAD_INFO.brand} · ${JAAD_INFO.owner} · SIRET ${JAAD_INFO.siret} · ${JAAD_INFO.tvaNotice}`,
    margin,
    285
  );
  doc.text(JAAD_INFO.website, pageWidth - margin, 285, { align: 'right' });

  const safeSlug = displayCompany
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  doc.save(`Devis_JAAD_${safeSlug || data.quoteId}.pdf`);
}
