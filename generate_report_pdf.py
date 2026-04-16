#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generare PDF — Raport Cross-Check POLARIS vs. Regulament ONCS 2026
Output: docs/POLARIS_CrossCheck_Report.pdf
Run: py -3.14 generate_report_pdf.py
"""

import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUT_PDF  = os.path.join(BASE_DIR, "docs", "POLARIS_CrossCheck_Report.pdf")

# ── Culori POLARIS design system ──────────────────────────────────────────────
C_BG_DARK   = colors.HexColor("#0f131f")
C_GOLD      = colors.HexColor("#ffe3b7")
C_CYAN      = colors.HexColor("#bdf4ff")
C_GREEN     = colors.HexColor("#91ff89")
C_TEXT      = colors.HexColor("#e8dcc8")
C_TEXT_DIM  = colors.HexColor("#d4c5ab")
C_OUTLINE   = colors.HexColor("#4f4632")
C_WARN      = colors.HexColor("#ff9f43")
C_OK        = colors.HexColor("#91ff89")
C_SECTION   = colors.HexColor("#1a2035")

PAGE_W, PAGE_H = A4

# ── Stiluri ───────────────────────────────────────────────────────────────────
styles = getSampleStyleSheet()

def style(name, **kwargs):
    return ParagraphStyle(name, **kwargs)

S_TITLE = style("Title",
    fontSize=22, leading=28, textColor=C_GOLD,
    fontName="Helvetica-Bold", spaceAfter=4, alignment=TA_LEFT)

S_SUBTITLE = style("Subtitle",
    fontSize=11, leading=16, textColor=C_CYAN,
    fontName="Helvetica", spaceAfter=2, alignment=TA_LEFT)

S_DATE = style("Date",
    fontSize=8, leading=12, textColor=C_TEXT_DIM,
    fontName="Helvetica", spaceAfter=12, alignment=TA_LEFT)

S_SECTION = style("Section",
    fontSize=12, leading=16, textColor=C_CYAN,
    fontName="Helvetica-Bold", spaceBefore=14, spaceAfter=4)

S_BODY = style("Body",
    fontSize=9, leading=14, textColor=C_TEXT,
    fontName="Helvetica", spaceAfter=4)

S_WARN = style("Warn",
    fontSize=9, leading=14, textColor=C_WARN,
    fontName="Helvetica-Bold", spaceAfter=4)

S_OK = style("Ok",
    fontSize=9, leading=14, textColor=C_OK,
    fontName="Helvetica", spaceAfter=4)

S_FOOTER = style("Footer",
    fontSize=7, leading=10, textColor=C_TEXT_DIM,
    fontName="Helvetica", alignment=TA_CENTER)

S_TABLE_HEADER = style("TH",
    fontSize=8, leading=11, textColor=C_BG_DARK,
    fontName="Helvetica-Bold")

S_TABLE_CELL = style("TC",
    fontSize=8, leading=12, textColor=C_TEXT,
    fontName="Helvetica")

S_TABLE_CELL_OK = style("TC_OK",
    fontSize=8, leading=12, textColor=C_OK,
    fontName="Helvetica-Bold")

S_TABLE_CELL_WARN = style("TC_WARN",
    fontSize=8, leading=12, textColor=C_WARN,
    fontName="Helvetica-Bold")

# ── Table style helpers ───────────────────────────────────────────────────────
def tbl_style(header_color=C_CYAN, row_colors=None):
    rc = row_colors or [(1, C_SECTION), (0, C_BG_DARK)]
    cmds = [
        ("BACKGROUND",  (0, 0), (-1, 0),  header_color),
        ("TEXTCOLOR",   (0, 0), (-1, 0),  C_BG_DARK),
        ("FONTNAME",    (0, 0), (-1, 0),  "Helvetica-Bold"),
        ("FONTSIZE",    (0, 0), (-1, 0),  8),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1),
            [C_SECTION, C_BG_DARK]),
        ("GRID",        (0, 0), (-1, -1), 0.4, C_OUTLINE),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING",(0, 0), (-1, -1), 6),
        ("TOPPADDING",  (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING",(0,0), (-1, -1), 5),
        ("VALIGN",      (0, 0), (-1, -1), "TOP"),
    ]
    return TableStyle(cmds)


def hr(color=C_OUTLINE, thickness=0.5):
    return HRFlowable(width="100%", thickness=thickness,
                      color=color, spaceAfter=6, spaceBefore=6)


# ── Continut document ─────────────────────────────────────────────────────────
def build_pdf():
    os.makedirs(os.path.dirname(OUT_PDF), exist_ok=True)

    doc = SimpleDocTemplate(
        OUT_PDF,
        pagesize=A4,
        leftMargin=2*cm, rightMargin=2*cm,
        topMargin=2.2*cm, bottomMargin=2*cm,
        title="POLARIS Cross-Check Report — ONCS 2026",
        author="P.O.L.A.R.I.S. / Claude Code",
    )

    story = []

    # ── Header ────────────────────────────────────────────────────────────────
    story.append(Paragraph("P.O.L.A.R.I.S.", S_TITLE))
    story.append(Paragraph(
        "Raport Cross-Check — Prezentare vs. Regulament ONCS 2026", S_SUBTITLE))
    story.append(Paragraph("Generat: 2026-04-16  ·  Echipa: Polaris Bears", S_DATE))
    story.append(hr(C_CYAN, 1.0))
    story.append(Spacer(1, 6))

    # ── 1. Grila de punctaj ───────────────────────────────────────────────────
    story.append(Paragraph("1. GRILA DE PUNCTAJ (100p)", S_SECTION))

    data_punctaj = [
        ["Criteriu", "Puncte", "Acoperire in PPTX", "Status"],
        ["a) Creativitate\n(#1 departajare)",
         "25p",
         "Slide 02 (viziune), Slide 15 (arhitectura originala\nexplicit), Slide 14 (Kardashev)",
         "✅ Excelent"],
        ["b) Abordare stiintifica\n(#2 departajare)",
         "15p",
         "Slide 04/05/07/10/11 (ecuatii + date numerice),\nSlide 16 (NASA/CERN/JAXA), Slide 17 (limitari)",
         "✅ Excelent"],
        ["c) Definirea obiectivelor\n(#5 departajare)",
         "10p",
         "Slide 03 — 5 obiective clare, slide dedicat",
         "✅ Complet"],
        ["d) Complexitate cercetare\n(#3 departajare)",
         "10p",
         "Slide 09 — 6 domenii + lant metodologic complet",
         "✅ Complet"],
        ["e) Claritate prezentare\n(#4 departajare)",
         "15p",
         "Design system consistent, imagini Kling\ncinematice, formule vizuale per slide",
         "✅ Solid"],
        ["f) Activitate echipa\n(#6 departajare)",
         "15p",
         "Slide 19 — roluri individuale distincte\nper elev (Ioan vs. Albert)",
         "✅ Complet"],
        ["g) Puncte din oficiu", "10p", "Automat", "✅"],
    ]

    col_w = [3.8*cm, 1.4*cm, 8.5*cm, 2.3*cm]
    tbl = Table(data_punctaj, colWidths=col_w, repeatRows=1)
    tbl.setStyle(tbl_style(C_CYAN))
    story.append(tbl)
    story.append(Spacer(1, 10))

    # ── 2. Intrebari obligatorii juriu ────────────────────────────────────────
    story.append(Paragraph("2. INTREBARILE OBLIGATORII ALE JURIULUI (Art. 16.3)", S_SECTION))

    data_juriu = [
        ["#", "Intrebare juriului", "Slide pregatit", "Status"],
        ["a", "Importanta problemelor practice rezolvate",
         "Slide 01 + Slide 11 (1,6 TW = 48% global)", "✅"],
        ["b", "Ingeniozitate specifica varstei",
         "Slide 14 (Kardashev 0.73→1.0) + Slide 15", "✅"],
        ["c", "Modul de intelegere a problematicii",
         "Slide-urile 04→12 (lant tehnic complet)", "✅"],
        ["d", "Experimentare & evaluare rezultate",
         "Slide 09 (metodologie) + Slide 11 (numere)", "✅"],
        ["e", "Nivelul de implicare, rolul fiecarui elev",
         "Slide 19 (Ioan = vizual/Kardashev, Albert = arhitectura/calcule)", "✅"],
        ["f ★", "Propunerea de dezvoltare ulterioara",
         "Slide 13 — Star Power Grid, orizont 30–50 ani", "✅"],
    ]

    col_w2 = [0.8*cm, 5.5*cm, 7.5*cm, 2.2*cm]
    tbl2 = Table(data_juriu, colWidths=col_w2, repeatRows=1)
    tbl2.setStyle(tbl_style(C_GOLD))
    story.append(tbl2)
    story.append(Spacer(1, 10))

    # ── 3. Timing prezentare ──────────────────────────────────────────────────
    story.append(Paragraph("3. TIMING PREZENTARE — 10 MINUTE", S_SECTION))
    story.append(Paragraph(
        "20 slide-uri (00–19) aliniate cu structura din regulament. "
        "Conform tabelului din REGULAMENT_NOTES.md, totalul estimat este "
        "<b>≈ 9:45 min</b> — margine de siguranta de 15 secunde.", S_BODY))
    story.append(Paragraph("Status: ✅ Incadrat in timp", S_OK))
    story.append(Spacer(1, 6))

    # ── 4. Probleme identificate ──────────────────────────────────────────────
    story.append(Paragraph("4. PROBLEME IDENTIFICATE", S_SECTION))

    story.append(Paragraph(
        "⚠️  CRITIC — Diacritice lipsa in textul slide-urilor", S_WARN))
    story.append(Paragraph(
        "Regulamentul impune diacritice obligatorii (Anexa 2.1) pentru toate "
        "materialele prezentate juriului. Textul din generate_pptx.py omite "
        "sistematic diacriticele. Exemple:", S_BODY))

    data_diacritice = [
        ["Text curent (fara diacritice)", "Text corect (cu diacritice)"],
        ['"statii plutitoare"', '"stații plutitoare"'],
        ['"Cererea globala de energie creste"', '"Cererea globală de energie crește"'],
        ['"pozitionate", "eficienta", "fasciculelor"',
         '"poziționate", "eficiența", "fasciculelor"'],
        ['"Limitari cunoscute"', '"Limitări cunoscute"'],
        ['"arhitectura orbitala"', '"arhitectură orbitală"'],
    ]

    col_w3 = [8*cm, 8*cm]
    tbl3 = Table(data_diacritice, colWidths=col_w3, repeatRows=1)
    tbl3.setStyle(tbl_style(C_WARN))
    story.append(tbl3)
    story.append(Spacer(1, 8))

    story.append(Paragraph(
        "⚠️  MINOR — Slide 18 (Concluzie) fara imagine/video", S_WARN))
    story.append(Paragraph(
        "Slide-ul 18 este text pur (type: statement). Ar castiga vizual "
        "daca ar folosi Image C (Full System Panoramic) ca fundal dimmed.", S_BODY))
    story.append(Spacer(1, 8))

    story.append(Paragraph("✅  OK — Risc anti-plagiat scazut", S_OK))
    story.append(Paragraph(
        "Continutul este original si specific. Bibliografie Harvard cu 12 surse "
        "verificate. Toate sursele accesibile online (aprilie 2026).", S_BODY))

    # ── 5. Recomandare prioritara ─────────────────────────────────────────────
    story.append(Spacer(1, 6))
    story.append(hr(C_CYAN, 0.8))
    story.append(Paragraph("5. RECOMANDARE PRIORITARA", S_SECTION))
    story.append(Paragraph(
        "Diacriticele reprezinta singura problema cu risc real de penalizare la "
        "criteriul (e) — Claritate prezentare (15p, #4 departajare). "
        "Corectarea lor in generate_pptx.py urmat de o regenerare PPTX este "
        "pasul urmator recomandat.", S_BODY))

    # ── Footer ────────────────────────────────────────────────────────────────
    story.append(Spacer(1, 20))
    story.append(hr(C_OUTLINE))
    story.append(Paragraph(
        "P.O.L.A.R.I.S.  ·  Polaris Bears  ·  ONCS 2026  ·  "
        "Sectiunea A — Stiinte Exacte  ·  Generat automat cu Claude Code",
        S_FOOTER))

    # ── Build ─────────────────────────────────────────────────────────────────
    def on_page(canvas, doc):
        canvas.saveState()
        canvas.setFillColor(C_BG_DARK)
        canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
        canvas.restoreState()

    doc.build(story, onFirstPage=on_page, onLaterPages=on_page)
    size_kb = os.path.getsize(OUT_PDF) / 1024
    print(f"Gata! {size_kb:.0f} KB -> {OUT_PDF}")


if __name__ == "__main__":
    build_pdf()
