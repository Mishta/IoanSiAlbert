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
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUT_PDF  = os.path.join(BASE_DIR, "docs", "POLARIS_CrossCheck_Report.pdf")

PAGE_W, PAGE_H = A4

# ── Paleta culori (fond ALB) ──────────────────────────────────────────────────
C_WHITE      = colors.white
C_TITLE      = colors.HexColor("#1a2035")   # navy inchis
C_SECTION    = colors.HexColor("#1a5276")   # albastru inchis
C_BODY       = colors.HexColor("#2c3e50")   # gri inchis
C_DIM        = colors.HexColor("#7f8c8d")   # gri mediu
C_OK         = colors.HexColor("#1e8449")   # verde inchis
C_WARN       = colors.HexColor("#d35400")   # portocaliu inchis
C_GRID       = colors.HexColor("#bdc3c7")   # gri deschis
C_TH_BG      = colors.HexColor("#2c3e50")   # header tabel inchis
C_ROW_ALT    = colors.HexColor("#f2f6fc")   # rand alternativ albastru pal
C_ACCENT_BAR = colors.HexColor("#2980b9")   # bara accent


# ── Stiluri text ──────────────────────────────────────────────────────────────
def S(name, **kw):
    return ParagraphStyle(name, **kw)

S_TITLE    = S("Title",    fontSize=20, leading=26, textColor=C_TITLE,
               fontName="Helvetica-Bold", spaceAfter=2)
S_SUBTITLE = S("Subtitle", fontSize=11, leading=16, textColor=C_SECTION,
               fontName="Helvetica",     spaceAfter=2)
S_DATE     = S("Date",     fontSize=8,  leading=12, textColor=C_DIM,
               fontName="Helvetica",     spaceAfter=10)
S_SECTION  = S("Section",  fontSize=11, leading=15, textColor=C_SECTION,
               fontName="Helvetica-Bold", spaceBefore=12, spaceAfter=5)
S_BODY     = S("Body",     fontSize=9,  leading=14, textColor=C_BODY,
               fontName="Helvetica",     spaceAfter=4)
S_OK       = S("Ok",       fontSize=9,  leading=14, textColor=C_OK,
               fontName="Helvetica-Bold", spaceAfter=4)
S_WARN     = S("Warn",     fontSize=9,  leading=14, textColor=C_WARN,
               fontName="Helvetica-Bold", spaceAfter=4)
S_FOOTER   = S("Footer",   fontSize=7,  leading=10, textColor=C_DIM,
               fontName="Helvetica",     alignment=TA_CENTER)

# Stiluri pentru celule tabel
S_TH  = S("TH",  fontSize=8, leading=11, textColor=C_WHITE,
           fontName="Helvetica-Bold")
S_TC  = S("TC",  fontSize=8, leading=12, textColor=C_BODY,
           fontName="Helvetica")
S_TOK = S("TOK", fontSize=8, leading=12, textColor=C_OK,
           fontName="Helvetica-Bold")
S_TWN = S("TWN", fontSize=8, leading=12, textColor=C_WARN,
           fontName="Helvetica-Bold")


def p(text, style):
    """Shortcut: Paragraph cu stil dat."""
    return Paragraph(text, style)


def make_table(rows, col_widths, header_bg=C_TH_BG):
    """Construieste tabel cu celule Paragraph (wrapping automat)."""
    tbl = Table(rows, colWidths=col_widths, repeatRows=1)
    tbl.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, 0),  header_bg),
        ("ROWBACKGROUNDS",(0, 1), (-1, -1), [C_WHITE, C_ROW_ALT]),
        ("GRID",          (0, 0), (-1, -1), 0.4, C_GRID),
        ("LEFTPADDING",   (0, 0), (-1, -1), 7),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 7),
        ("TOPPADDING",    (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("VALIGN",        (0, 0), (-1, -1), "TOP"),
    ]))
    return tbl


def hr(color=C_GRID, thickness=0.5):
    return HRFlowable(width="100%", thickness=thickness,
                      color=color, spaceAfter=6, spaceBefore=4)


# ── Build PDF ─────────────────────────────────────────────────────────────────
def build_pdf():
    os.makedirs(os.path.dirname(OUT_PDF), exist_ok=True)

    doc = SimpleDocTemplate(
        OUT_PDF,
        pagesize=A4,
        leftMargin=2*cm, rightMargin=2*cm,
        topMargin=2.2*cm, bottomMargin=2*cm,
        title="POLARIS Cross-Check Report — ONCS 2026",
        author="Polaris Bears / Claude Code",
    )

    W = PAGE_W - 4*cm   # latime utila
    story = []

    # ── Header ────────────────────────────────────────────────────────────────
    story.append(p("P.O.L.A.R.I.S.", S_TITLE))
    story.append(p("Raport Cross-Check — Prezentare vs. Regulament ONCS 2026", S_SUBTITLE))
    story.append(p("Generat: 2026-04-16  &nbsp;·&nbsp;  Echipa: Polaris Bears &nbsp;·&nbsp; ONCS 2026", S_DATE))
    story.append(hr(C_ACCENT_BAR, 1.5))
    story.append(Spacer(1, 4))

    # ── 1. Grila de punctaj ───────────────────────────────────────────────────
    story.append(p("1. GRILA DE PUNCTAJ (100 puncte)", S_SECTION))

    # Latime coloane: criteriu | puncte | acoperire | status
    cw1 = [3.6*cm, 1.3*cm, 9.8*cm, 2.3*cm]
    rows1 = [
        [p("Criteriu", S_TH), p("Pct.", S_TH),
         p("Acoperire in prezentare", S_TH), p("Status", S_TH)],

        [p("a) Creativitate &amp; originalitate<br/><i>(#1 la departajare)</i>", S_TC),
         p("25p", S_TC),
         p("Slide 02 (viziune), Slide 15 (arhitectura originala — explicit: "
           "\"Nicio lucrare existenta nu combina Dyson+Lagrange+YBCO+baloane\"), "
           "Slide 14 (Kardashev 0.73→1.0)", S_TC),
         p("✅ Excelent", S_TOK)],

        [p("b) Abordare stiintifica<br/><i>(#2 la departajare)</i>", S_TC),
         p("15p", S_TC),
         p("Slide 04/05/07/10/11 (ecuatii + date numerice cu surse), "
           "Slide 16 (validare NASA/CERN/JAXA/NASA NIAC), "
           "Slide 17 (limitari recunoscute = maturitate stiintifica)", S_TC),
         p("✅ Excelent", S_TOK)],

        [p("c) Definirea obiectivelor<br/><i>(#5 la departajare)</i>", S_TC),
         p("10p", S_TC),
         p("Slide 03 dedicat — 5 obiective clare, masurabile, cu surse", S_TC),
         p("✅ Complet", S_TOK)],

        [p("d) Complexitate cercetare<br/><i>(#3 la departajare)</i>", S_TC),
         p("10p", S_TC),
         p("Slide 09 — 6 domenii integrate (fizica, astronomie, inginerie, "
           "supraconductivitate, criogenie, mecanica fluidelor) + lant "
           "metodologic complet", S_TC),
         p("✅ Complet", S_TOK)],

        [p("e) Claritate prezentare<br/><i>(#4 la departajare)</i>", S_TC),
         p("15p", S_TC),
         p("Design system consistent pe toate 20 slide-urile, imagini Kling "
           "cinematice, formule vizuale dedicate per slide", S_TC),
         p("✅ Solid", S_TOK)],

        [p("f) Activitate echipa<br/><i>(#6 la departajare)</i>", S_TC),
         p("15p", S_TC),
         p("Slide 19 — roluri individuale distincte: Ioan (vizual, Kardashev, "
           "prezentare) vs. Albert (arhitectura, calcule, YBCO, dinamica)", S_TC),
         p("✅ Complet", S_TOK)],

        [p("g) Puncte din oficiu", S_TC),
         p("10p", S_TC),
         p("Acordate automat", S_TC),
         p("✅", S_TOK)],
    ]
    story.append(make_table(rows1, cw1))
    story.append(Spacer(1, 8))

    # ── 2. Intrebari juriu ────────────────────────────────────────────────────
    story.append(p("2. INTREBARILE OBLIGATORII ALE JURIULUI (Art. 16.3)", S_SECTION))

    cw2 = [0.7*cm, 5.8*cm, 9.0*cm, 1.5*cm]
    rows2 = [
        [p("#", S_TH), p("Intrebare obligatorie", S_TH),
         p("Slide pregatit", S_TH), p("OK", S_TH)],

        [p("a", S_TC),
         p("Importanta problemelor practice rezolvate", S_TC),
         p("Slide 01 (Problema: fosile limitate, atmosfera blocheaza 30%) + "
           "Slide 11 (1,6 TW = 48% din consumul electric global)", S_TC),
         p("✅", S_TOK)],

        [p("b", S_TC),
         p("Ingeniozitate specifica varstei", S_TC),
         p("Slide 14 (Kardashev 0.73→1.0, tranzitie civilizationala) + "
           "Slide 15 (arhitectura absentata din literatura clasica)", S_TC),
         p("✅", S_TOK)],

        [p("c", S_TC),
         p("Modul de intelegere a problematicii", S_TC),
         p("Slide-urile 04-12: lant tehnic complet "
           "(oglinzi → laser → Lagrange → YBCO → receptor polar → retea)", S_TC),
         p("✅", S_TOK)],

        [p("d", S_TC),
         p("Experimentare si evaluare rezultate", S_TC),
         p("Slide 09 (metodologie, modele matematice imbricate) + "
           "Slide 11 (numere exacte cu surse IEA 2023)", S_TC),
         p("✅", S_TOK)],

        [p("e", S_TC),
         p("Nivelul de implicare, rolul fiecarui elev", S_TC),
         p("Slide 19 — Ioan: modelare vizuala, Kardashev, Star Power Grid, prezentare. "
           "Albert: arhitectura sistem, calcule energetice, YBCO, dinamica orbitala.", S_TC),
         p("✅", S_TOK)],

        [p("f ★", S_TWN),
         p("<b>Propunerea de dezvoltare ulterioara</b><br/>"
           "(ceruta explicit de juriu)", S_TC),
         p("Slide 13 — Star Power Grid: distributie prin microunde GEO catre "
           "regiuni slab deservite. Orizont temporal explicit: 30-50 ani.", S_TC),
         p("✅", S_TOK)],
    ]
    story.append(make_table(rows2, cw2))
    story.append(Spacer(1, 8))

    # ── 3. Timing ─────────────────────────────────────────────────────────────
    story.append(p("3. TIMING PREZENTARE — 10 MINUTE", S_SECTION))
    story.append(p(
        "20 slide-uri (00–19) aliniate cu structura din regulament. "
        "Totalul estimat conform REGULAMENT_NOTES.md: <b>aprox. 9:45 min</b> — "
        "margine de siguranta de 15 secunde.", S_BODY))
    story.append(p("✅  Incadrat in timp", S_OK))
    story.append(Spacer(1, 4))

    # ── 4. Probleme identificate ──────────────────────────────────────────────
    story.append(p("4. PROBLEME IDENTIFICATE", S_SECTION))

    story.append(p("⚠  CRITIC — Diacritice lipsa in textul slide-urilor", S_WARN))
    story.append(p(
        "Regulamentul impune diacritice obligatorii (Anexa 2.1) pentru toate materialele "
        "prezentate juriului. Textul din generate_pptx.py omite sistematic diacriticele. "
        "Risc de penalizare la criteriul (e) Claritate prezentare (15p, #4 departajare).", S_BODY))

    cw3 = [W/2, W/2]
    rows3 = [
        [p("Text curent (fara diacritice)", S_TH),
         p("Text corect (cu diacritice)", S_TH)],
        [p('"statii plutitoare"', S_TWN),        p('"stati&#x0163;i plutitoare"', S_TOK)],
        [p('"Cererea globala de energie creste"', S_TWN),
         p('"Cererea global&#x0103; de energie cre&#x015F;te"', S_TOK)],
        [p('"pozitionate", "eficienta"', S_TWN),
         p('"pozi&#x021B;ionate", "eficien&#x021B;a"', S_TOK)],
        [p('"Limitari cunoscute"', S_TWN),        p('"Limit&#x0103;ri cunoscute"', S_TOK)],
        [p('"arhitectura orbitala"', S_TWN),      p('"arhitectur&#x0103; orbital&#x0103;"', S_TOK)],
    ]
    story.append(make_table(rows3, cw3, header_bg=colors.HexColor("#7b241c")))
    story.append(Spacer(1, 8))

    story.append(p("⚠  MINOR — Slide 18 (Concluzie) fara imagine de fundal", S_WARN))
    story.append(p(
        "Slide-ul 18 este text pur (type: statement, fara imagine/video). "
        "Ar castiga vizual daca ar folosi Image C (Full System Panoramic) "
        "ca fundal dimmed la 30-40%.", S_BODY))
    story.append(Spacer(1, 6))

    story.append(p("✅  OK — Risc anti-plagiat scazut", S_OK))
    story.append(p(
        "Continutul este original si specific arhitecturii POLARIS. "
        "Bibliografie Harvard cu 12 surse verificate si accesibile online (aprilie 2026). "
        "Stilul academic este consistent.", S_BODY))

    # ── 5. Recomandare ────────────────────────────────────────────────────────
    story.append(Spacer(1, 4))
    story.append(hr(C_ACCENT_BAR, 1.0))
    story.append(p("5. RECOMANDARE PRIORITARA", S_SECTION))
    story.append(p(
        "Diacriticele reprezinta singura problema cu risc real de penalizare. "
        "Corectarea lor in <b>generate_pptx.py</b> urmata de o regenerare a ambelor "
        "fisiere PPTX este pasul imediat urmator. "
        "Toate celelalte criterii sunt acoperite la nivel excelent sau complet.", S_BODY))

    # ── Footer ────────────────────────────────────────────────────────────────
    story.append(Spacer(1, 16))
    story.append(hr(C_GRID))
    story.append(p(
        "P.O.L.A.R.I.S.  ·  Polaris Bears  ·  ONCS 2026  ·  "
        "Sectiunea A — Stiinte Exacte  ·  Generat automat cu Claude Code",
        S_FOOTER))

    doc.build(story)
    size_kb = os.path.getsize(OUT_PDF) / 1024
    print(f"Gata! {size_kb:.0f} KB -> {OUT_PDF}")


if __name__ == "__main__":
    build_pdf()
