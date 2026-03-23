'use client';
/**
 * PDF export hook for proxy sheet generation using jsPDF
 *
 * Layout: US Letter (8.5" x 11"), 3×3 grid, card size 2.5" x 3.5"
 * Margins: 0.5" horizontal, 0.75" vertical
 * Includes corner cut marks and card name label below each image
 */

import { useState, useCallback } from 'react';
import { CARDS_PER_PAGE, type ProxyEntry } from '../types';

const CARD_W = 2.5; // inches
const CARD_H = 3.5; // inches
const COLS = 3;
const ROWS = 3;
const PAGE_W = 8.5;
const PAGE_H = 11;
const MARGIN_X = (PAGE_W - COLS * CARD_W) / 2; // 0.5"
const MARGIN_Y = (PAGE_H - ROWS * CARD_H) / 2; // 0.75"
const CUT_MARK_LEN = 0.1; // inches
const LABEL_H = 0.15; // reserved below card for name label

async function fetchImageAsDataUrl(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const blob = await response.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function drawCutMarks(
  doc: InstanceType<typeof import('jspdf').jsPDF>,
  x: number,
  y: number
) {
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.005);

  // top-left
  doc.line(x - CUT_MARK_LEN, y, x, y);
  doc.line(x, y - CUT_MARK_LEN, x, y);

  // top-right
  doc.line(x + CARD_W, y - CUT_MARK_LEN, x + CARD_W, y);
  doc.line(x + CARD_W, y, x + CARD_W + CUT_MARK_LEN, y);

  // bottom-left
  doc.line(x - CUT_MARK_LEN, y + CARD_H, x, y + CARD_H);
  doc.line(x, y + CARD_H, x, y + CARD_H + CUT_MARK_LEN);

  // bottom-right
  doc.line(x + CARD_W, y + CARD_H, x + CARD_W + CUT_MARK_LEN, y + CARD_H);
  doc.line(x + CARD_W, y + CARD_H, x + CARD_W, y + CARD_H + CUT_MARK_LEN);
}

export function usePDFExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const exportPDF = useCallback(
    async (entries: ProxyEntry[], gameSlug: string) => {
      if (entries.length === 0) return;

      setIsExporting(true);
      setExportProgress(0);

      try {
        // Dynamic import to avoid SSR issues
        const { jsPDF } = await import('jspdf');

        const doc = new jsPDF({
          unit: 'in',
          format: 'letter',
          orientation: 'portrait',
        });

        // Expand entries to flat card list honoring quantities
        const flat = entries.flatMap((e) =>
          Array.from({ length: e.quantity }, () => e.card)
        );

        for (let i = 0; i < flat.length; i++) {
          const card = flat[i];
          const slotIndex = i % CARDS_PER_PAGE;

          if (slotIndex === 0 && i > 0) {
            doc.addPage();
          }

          const col = slotIndex % COLS;
          const row = Math.floor(slotIndex / COLS);
          const x = MARGIN_X + col * CARD_W;
          const y = MARGIN_Y + row * (CARD_H + LABEL_H);

          // Load image
          const imageUrl =
            card.imageUrl ?? card.imageUrlSmall ?? card.imageUrlLarge ?? null;

          if (imageUrl) {
            const dataUrl = await fetchImageAsDataUrl(imageUrl);
            if (dataUrl) {
              const isJpeg =
                dataUrl.startsWith('data:image/jpeg') ||
                dataUrl.startsWith('data:image/jpg');
              const format = isJpeg ? 'JPEG' : 'PNG';
              doc.addImage(dataUrl, format, x, y, CARD_W, CARD_H);
            } else {
              // Gray placeholder if image fails
              doc.setFillColor(220, 220, 220);
              doc.rect(x, y, CARD_W, CARD_H, 'F');
            }
          } else {
            doc.setFillColor(220, 220, 220);
            doc.rect(x, y, CARD_W, CARD_H, 'F');
          }

          // Cut marks
          drawCutMarks(doc, x, y);

          // Card name label below image
          doc.setFontSize(6);
          doc.setTextColor(60, 60, 60);
          const label = doc.splitTextToSize(card.name, CARD_W);
          doc.text(label[0] as string, x + CARD_W / 2, y + CARD_H + 0.1, {
            align: 'center',
          });

          setExportProgress(Math.round(((i + 1) / flat.length) * 100));
        }

        doc.save(`${gameSlug}-proxies.pdf`);
      } finally {
        setIsExporting(false);
        setExportProgress(0);
      }
    },
    []
  );

  return { isExporting, exportProgress, exportPDF };
}
