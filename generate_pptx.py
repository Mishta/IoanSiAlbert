#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
POLARIS COMMAND — Dual PowerPoint Generator
Outputs:
  POLARIS_2019.pptx  — Office 2019 compatible (Fade transitions)
  POLARIS_365.pptx   — Microsoft 365 (Morph transitions)

Run: py -3.14 generate_pptx.py
"""

import os
import io
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.oxml.ns import qn
from lxml import etree
from PIL import Image as PILImage

# ── Design System: Celestial Command ──────────────────────────────────────────
C_BG        = RGBColor(0x0f, 0x13, 0x1f)   # #0f131f  background
C_SURFACE   = RGBColor(0x1b, 0x1f, 0x2c)   # #1b1f2c  surface container
C_SURFACE_H = RGBColor(0x26, 0x2a, 0x37)   # #262a37  surface high
C_PRIMARY   = RGBColor(0xff, 0xe3, 0xb7)   # #ffe3b7  gold
C_SECONDARY = RGBColor(0xbd, 0xf4, 0xff)   # #bdf4ff  cyan
C_TERTIARY  = RGBColor(0x91, 0xff, 0x89)   # #91ff89  green
C_TEXT      = RGBColor(0xdf, 0xe2, 0xf3)   # #dfe2f3  on-background
C_TEXT_DIM  = RGBColor(0xd4, 0xc5, 0xab)   # #d4c5ab  on-surface-variant
C_OUTLINE   = RGBColor(0x4f, 0x46, 0x32)   # #4f4632  outline-variant
C_DIM       = RGBColor(0x31, 0x34, 0x42)   # #313442  surface-variant

F_HEADLINE  = "Space Grotesk"
F_BODY      = "Manrope"
F_LABEL     = "Inter"

W = Inches(13.333)
H = Inches(7.5)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ── Slide Definitions ──────────────────────────────────────────────────────────
SLIDES = [
    # ── COVER ──────────────────────────────────────────────────────────────────
    {
        "num": "00", "type": "cover",
        "title": "P.O.L.A.R.I.S.",
        "subtitle": "Orbital Platform using Lasers for\nInnovative Solar Reception and Supply",
        "body": "Ioan CHELARU  ·  Albert OLARIU\nONCS 2026",
        "accent": C_PRIMARY,
        "image": "images/generated/06 POLARIS System General View (v2).png",
    },
    # ── 01 ─────────────────────────────────────────────────────────────────────
    {
        "num": "01", "section": "FRAMING",
        "title": "THE PROBLEM",
        "body": "Global energy demand is rising.\nFossil fuels are finite.\nThe atmosphere limits solar power on Earth.\nIt's time to think beyond our planet.",
        "accent": C_SECONDARY,
        "image": "images/generated/Image A - Earth Energy Crisis.png",
    },
    # ── 02 ─────────────────────────────────────────────────────────────────────
    {
        "num": "02", "section": "CONCEPT",
        "title": "THE VISION",
        "body": "P.O.L.A.R.I.S. — an Orbital Platform using Lasers\nfor Innovative Solar Reception and Supply.\nEnergy harvested near the Sun. Delivered to Earth.",
        "accent": C_PRIMARY,
        "image": "images/generated/Image C - Full System Panoramic.png",
    },
    # ── 03 ─────────────────────────────────────────────────────────────────────
    {
        "num": "03", "section": "ARCHITECTURE",
        "title": "THE DYSON SWARM",
        "body": "30 orbital mirrors, each 1 km in diameter,\npositioned just 7 million km from the Sun —\ncapturing solar radiation at over 600,000 W/m².",
        "accent": C_TERTIARY,
        "image": "images/generated/Image B - Mirror and Sun.png",
    },
    # ── 04 ─────────────────────────────────────────────────────────────────────
    {
        "num": "04", "section": "PHYSICS",
        "title": "THE POWER OF\nPROXIMITY",
        "body": "At 7 million km from the Sun, solar intensity\nis 450× greater than at Earth's orbit.\nThat's the energy advantage we're unlocking.",
        "accent": C_PRIMARY,
        "image": "images/generated/01 Mirrors (v2).png",
    },
    # ── 05 ─────────────────────────────────────────────────────────────────────
    {
        "num": "05", "section": "TECHNOLOGY",
        "title": "LASER CONVERSION",
        "body": "4 collector satellites transform reflected sunlight\ninto high-power laser beams — with 43% conversion efficiency.\nRaw solar energy becomes a directed beam of power.",
        "accent": C_SECONDARY,
        "image": "images/generated/02 Satelit Colector (close-up) (v2).png",
    },
    # ── 06 ─────────────────────────────────────────────────────────────────────
    {
        "num": "06", "section": "INFRASTRUCTURE",
        "title": "THE LAGRANGE HUB",
        "body": "L4 and L5 — gravitationally stable points in the Sun-Earth system.\nPOLARIS uses them as energy relay nodes,\neach carrying ~2.83 terawatts of laser power.",
        "accent": C_TERTIARY,
        "image": "images/generated/00 System Diagram.png",
    },
    # ── 07 — NOU ───────────────────────────────────────────────────────────────
    {
        "num": "07", "section": "ORBITAL MECHANICS",
        "title": "LAGRANGE SATELLITE\nPOSITIONING",
        "body": (
            "In 1772, Lagrange solved a problem Newton couldn't: where can a third body\n"
            "remain stable in a two-body system without fuel? The answer: 5 points.\n"
            "POLARIS uses L4 and L5 — 60° ahead and behind Earth, at 1 AU from the Sun.\n\n"
            "Collector Satellites orbit near the Sun at high angular velocity.\n"
            "Without a fixed relay, their laser beams would sweep unpredictably across Earth.\n"
            "Lagrange nodes break the path into two controlled legs:\n"
            "Collector → L4/L5 (moving-to-fixed) · L4/L5 → Polar Station (fixed-to-fixed).\n\n"
            "Result: a high-power laser beam that never oscillates over inhabited territory."
        ),
        "accent": C_SECONDARY,
        "image": "images/generated/03 Satelit Lagrange (close-up) - L4-L5  (v2).png",
        "wide_text": True,
    },
    # ── 08 ─────────────────────────────────────────────────────────────────────
    {
        "num": "08", "section": "MATERIALS",
        "title": "SUPERCONDUCTOR\nTECHNOLOGY",
        "body": (
            "YBCO superconducting cables — inspired by consultations\n"
            "with CERN physicists — operate at 77K using liquid nitrogen.\n"
            "Just ~7 tonnes of cable. Nearly zero transmission losses.\n\n"
            "Unlike NbTi cables (CERN LHC: 1.9K), YBCO operates at\n"
            "liquid nitrogen temperature — far more practical at scale."
        ),
        "accent": C_SECONDARY,
        "image": "images/generated/05 Cablul YBCO (v2).png",
    },
    # ── 09 ─────────────────────────────────────────────────────────────────────
    {
        "num": "09", "section": "DATA",
        "title": "THE NUMBERS",
        "stat": "1.6 TW",
        "stat_label": "delivered to Earth",
        "body": (
            "2 polar stations × 800 GW each = 1.6 terawatts.\n"
            "That's approximately 48% of all global electricity consumption.\n\n"
            "Global demand: 17.7 TW total\n"
            "POLARIS projected output: 420.5 TW theoretical\n"
            "Efficiency delta: +2,275%"
        ),
        "accent": C_TERTIARY,
        "image": "images/generated/Image D - Energy Mathematics.png",
    },
    # ── 10 ─────────────────────────────────────────────────────────────────────
    {
        "num": "10", "section": "PLATFORM",
        "title": "FLOATING POWER\nSTATIONS",
        "body": (
            "Each orbital power station weighs just 4 tonnes,\n"
            "suspended at 30 km altitude by helium balloons —\n"
            "applying Archimedes' principle at a planetary scale."
        ),
        "accent": C_PRIMARY,
        "image": "images/generated/04 Polar Station (v2).png",
    },
    # ── 11 ─────────────────────────────────────────────────────────────────────
    {
        "num": "11", "section": "EXTENSION",
        "title": "STAR POWER GRID",
        "body": (
            "The surplus energy at L4/L5 doesn't stop there.\n"
            "The Star Power Grid extension uses GEO microwave transmission\n"
            "to reach remote and underserved regions worldwide —\n"
            "clean energy, no ground infrastructure needed."
        ),
        "accent": C_SECONDARY,
        "image": "images/generated/Image E - Earth Grid Distribution.png",
    },
    # ── 12 — NOU ───────────────────────────────────────────────────────────────
    {
        "num": "12", "section": "CIVILIZATIONAL CONTEXT",
        "title": "KARDASHEV SCALE",
        "body": (
            "A Type 0 civilization uses energy from dead organic matter.\n"
            "A Type I civilization harnesses all energy available on its planet.\n\n"
            "Humanity is currently at ~0.73 on the Kardashev Scale.\n"
            "POLARIS is the bridge — a coherent path from Type 0 toward Type I.\n\n"
            "Not just an energy project. A civilizational transition."
        ),
        "accent": C_PRIMARY,
        "image": "images/generated/Image F - Kardashev Scale.png",
    },
    # ── 13 ─────────────────────────────────────────────────────────────────────
    {
        "num": "13", "section": "INNOVATION",
        "title": "ORIGINAL\nARCHITECTURE",
        "body": (
            "No existing study combines:\n"
            "· A Dyson swarm at 7 million km from the Sun\n"
            "· Lagrange energy relay hubs (L4/L5)\n"
            "· HTS YBCO superconducting transmission cables\n"
            "· Balloon-suspended stratospheric polar stations\n\n"
            "POLARIS is a genuinely new architecture."
        ),
        "accent": C_TERTIARY,
        "image": "images/generated/06 POLARIS System General View (v2).png",
    },
    # ── 14 ─────────────────────────────────────────────────────────────────────
    {
        "num": "14", "section": "VALIDATION",
        "title": "GROUNDED IN\nREAL SCIENCE",
        "body": (
            "· NASA Parker Solar Probe — reached 6.1 million km from the Sun\n"
            "· CERN — YBCO superconductor research and consultation\n"
            "· JAXA — microwave wireless energy transmission experiments\n"
            "· NASA NIAC — space-based solar power feasibility studies\n\n"
            "POLARIS builds on real, cutting-edge science."
        ),
        "accent": C_SECONDARY,
        "image": "images/generated/Image G - Science Lab meets Space.png",
    },
    # ── 15 ─────────────────────────────────────────────────────────────────────
    {
        "num": "15", "section": "CONCLUSION",
        "title": "THE MISSION",
        "body": (
            "POLARIS is not just a concept —\n"
            "it's a coherent theoretical model showing that\n"
            "space-based solar energy could become\n"
            "the backbone of humanity's global energy infrastructure\n"
            "in the 21st century."
        ),
        "accent": C_PRIMARY,
        "image": None,
        "layout": "center",
    },
    # ── 16 ─────────────────────────────────────────────────────────────────────
    {
        "num": "16", "section": "CREDITS",
        "title": "ECHIPA &\nBIBLIOGRAFIE",
        "body": None,
        "accent": C_SECONDARY,
        "image": "assets/team-hero.jpeg",
        "type": "credits",
    },
]

# ── Helper: set slide background color ────────────────────────────────────────
def set_bg(slide, color):
    bg = slide.background
    fill = bg.fill
    fill.solid()
    fill.fore_color.rgb = color

# ── Helper: add filled rectangle ──────────────────────────────────────────────
def add_rect(slide, left, top, width, height, color, line=False):
    from pptx.util import Emu
    shape = slide.shapes.add_shape(1, left, top, width, height)
    shape.fill.solid()
    shape.fill.fore_color.rgb = color
    if not line:
        shape.line.fill.background()
    else:
        shape.line.color.rgb = color
        shape.line.width = Pt(0.5)
    return shape

# ── Helper: add text box ───────────────────────────────────────────────────────
def add_text(slide, text, left, top, width, height,
             font_name=F_BODY, font_size=12, bold=False,
             color=C_TEXT_DIM, align=PP_ALIGN.LEFT, italic=False):
    txBox = slide.shapes.add_textbox(left, top, width, height)
    tf = txBox.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.alignment = align
    run = p.add_run()
    run.text = text
    run.font.name = font_name
    run.font.size = Pt(font_size)
    run.font.bold = bold
    run.font.italic = italic
    run.font.color.rgb = color
    return txBox

# ── Helper: add multi-paragraph text ──────────────────────────────────────────
def add_body(slide, text, left, top, width, height,
             font_name=F_BODY, font_size=15, color=C_TEXT_DIM,
             line_spacing_pct=145):
    lines = text.split("\n")
    txBox = slide.shapes.add_textbox(left, top, width, height)
    tf = txBox.text_frame
    tf.word_wrap = True
    first = True
    for line in lines:
        if first:
            p = tf.paragraphs[0]
            first = False
        else:
            p = tf.add_paragraph()
        p.alignment = PP_ALIGN.LEFT
        # line spacing
        pPr = p._p.get_or_add_pPr()
        lnSpc = etree.SubElement(pPr, qn("a:lnSpc"))
        spcPct = etree.SubElement(lnSpc, qn("a:spcPct"))
        spcPct.set("val", str(line_spacing_pct * 1000))
        run = p.add_run()
        run.text = line
        run.font.name = font_name
        run.font.size = Pt(font_size)
        run.font.color.rgb = color
    return txBox

# ── Helper: add title (multi-line, large) ─────────────────────────────────────
def add_title(slide, text, left, top, width, height,
              font_size=48, color=C_PRIMARY, font_name=F_HEADLINE):
    lines = text.split("\n")
    txBox = slide.shapes.add_textbox(left, top, width, height)
    tf = txBox.text_frame
    tf.word_wrap = True
    first = True
    for line in lines:
        if first:
            p = tf.paragraphs[0]
            first = False
        else:
            p = tf.add_paragraph()
        p.alignment = PP_ALIGN.LEFT
        run = p.add_run()
        run.text = line
        run.font.name = font_name
        run.font.size = Pt(font_size)
        run.font.bold = True
        run.font.color.rgb = color
    return txBox

# ── Helper: compress image to in-memory JPEG (max 1920px, quality 82) ─────────
def compress_image(full_path, max_px=1920, quality=82):
    img = PILImage.open(full_path).convert("RGB")
    w, h = img.size
    if w > max_px or h > max_px:
        ratio = min(max_px / w, max_px / h)
        img = img.resize((int(w * ratio), int(h * ratio)), PILImage.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=quality, optimize=True)
    buf.seek(0)
    return buf

# ── Helper: try to add image, skip if missing ─────────────────────────────────
def try_add_image(slide, rel_path, left, top, width, height):
    full = os.path.join(BASE_DIR, rel_path)
    if os.path.exists(full):
        try:
            img_stream = compress_image(full)
            slide.shapes.add_picture(img_stream, left, top, width, height)
            return True
        except Exception as e:
            print(f"  WARNING: Could not add image {rel_path}: {e}")
    else:
        print(f"  WARNING: Image not found: {full}")
    return False

# ── Helper: add Morph transition (M365 only) ──────────────────────────────────
def add_morph_transition(slide):
    sp_el = slide._element
    transition_xml = (
        '<p:transition xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" '
        'spd="slow"><p:morph origin="object"/></p:transition>'
    )
    transition_el = etree.fromstring(transition_xml)
    sp_el.append(transition_el)

# ── Helper: add Fade transition (Office 2019) ─────────────────────────────────
def add_fade_transition(slide):
    sp_el = slide._element
    transition_xml = (
        '<p:transition xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" '
        'spd="slow"><p:fade/></p:transition>'
    )
    transition_el = etree.fromstring(transition_xml)
    sp_el.append(transition_el)

# ── Common chrome (section label, num, footer, accent bar) ────────────────────
def add_chrome(slide, data):
    accent = data.get("accent", C_PRIMARY)
    num    = data.get("num", "00")

    # Left accent bar
    add_rect(slide, Inches(0.42), Inches(1.1), Inches(0.05), Inches(4.2), accent)

    # Section label
    section = data.get("section", "")
    if section:
        add_text(slide, section,
                 Inches(0.6), Inches(0.55), Inches(5), Inches(0.35),
                 font_name=F_LABEL, font_size=8, bold=True, color=accent)

    # POLARIS BEARS branding top-right
    add_text(slide, "POLARIS BEARS",
             Inches(10.0), Inches(0.38), Inches(3.0), Inches(0.38),
             font_name=F_HEADLINE, font_size=9, bold=True,
             color=C_PRIMARY, align=PP_ALIGN.RIGHT)

    # Bottom rule
    add_rect(slide, Inches(0.42), Inches(7.05), Inches(12.5), Inches(0.025), C_OUTLINE)

    # Footer
    add_text(slide,
             "ONCS 2026 — P.O.L.A.R.I.S. — ENERGIE SOLARĂ ORBITALĂ",
             Inches(0.55), Inches(7.15), Inches(10.5), Inches(0.28),
             font_name=F_LABEL, font_size=7, color=C_OUTLINE)

    # Slide number bottom-right
    add_text(slide, num,
             Inches(12.2), Inches(7.15), Inches(0.9), Inches(0.28),
             font_name=F_LABEL, font_size=7, bold=True,
             color=C_OUTLINE, align=PP_ALIGN.RIGHT)

# ── COVER slide ───────────────────────────────────────────────────────────────
def build_cover(prs, data):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(slide, C_BG)

    # Background image (full bleed, dimmed)
    img_path = os.path.join(BASE_DIR, data["image"])
    if os.path.exists(img_path):
        img_stream = compress_image(img_path, max_px=1920, quality=80)
        pic = slide.shapes.add_picture(img_stream, 0, 0, W, H)
        # Send to back
        slide.shapes._spTree.remove(pic._element)
        slide.shapes._spTree.insert(2, pic._element)

    # Dark overlay
    overlay = add_rect(slide, 0, 0, W, H, C_BG)
    overlay.fill.fore_color.rgb = RGBColor(0x0f, 0x13, 0x1f)
    # Transparency via XML
    solidFill = overlay.fill._xPr.find(qn("a:solidFill"))
    if solidFill is not None:
        srgbClr = solidFill.find(qn("a:srgbClr"))
        if srgbClr is not None:
            alpha = etree.SubElement(srgbClr, qn("a:alpha"))
            alpha.set("val", "82000")  # ~82% opacity

    # Top laser line
    add_rect(slide, Inches(1.5), Inches(1.8), Inches(4), Inches(0.03), C_SECONDARY)

    # Main title
    add_title(slide, data["title"],
              Inches(1.5), Inches(1.9), Inches(10), Inches(2.0),
              font_size=96, color=C_PRIMARY)

    # Subtitle
    add_body(slide, data["subtitle"],
             Inches(1.5), Inches(3.9), Inches(9), Inches(1.2),
             font_name=F_HEADLINE, font_size=20, color=C_SECONDARY,
             line_spacing_pct=140)

    # Bottom rule
    add_rect(slide, Inches(1.5), Inches(5.5), Inches(10), Inches(0.03), C_OUTLINE)

    # Team + event
    add_body(slide, data["body"],
             Inches(1.5), Inches(5.65), Inches(8), Inches(0.9),
             font_name=F_LABEL, font_size=13, color=C_TEXT_DIM,
             line_spacing_pct=150)

    return slide

# ── SPLIT slide (text left / image right) ─────────────────────────────────────
def build_split(prs, data):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(slide, C_BG)
    add_chrome(slide, data)

    accent = data.get("accent", C_PRIMARY)
    wide   = data.get("wide_text", False)

    if wide:
        text_left  = Inches(0.6)
        text_width = Inches(7.8)
        img_left   = Inches(8.9)
        img_width  = Inches(4.0)
    else:
        text_left  = Inches(0.6)
        text_width = Inches(6.5)
        img_left   = Inches(7.5)
        img_width  = Inches(5.4)

    img_top    = Inches(1.05)
    img_height = Inches(5.7)

    # Title
    title_size = 36 if wide else 44
    add_title(slide, data["title"],
              text_left, Inches(1.15), text_width, Inches(2.2),
              font_size=title_size, color=accent)

    # Body
    body = data.get("body", "")
    if body:
        body_top = Inches(3.5) if not data.get("stat") else Inches(4.5)
        add_body(slide, body, text_left, body_top, text_width, Inches(3.0),
                 font_size=14 if wide else 15, color=C_TEXT_DIM)

    # Stat (slide 09)
    if data.get("stat"):
        add_text(slide, data["stat"],
                 text_left, Inches(3.3), text_width, Inches(1.0),
                 font_name=F_HEADLINE, font_size=52, bold=True, color=accent)
        add_text(slide, data["stat_label"],
                 text_left, Inches(4.2), text_width, Inches(0.4),
                 font_name=F_LABEL, font_size=9, bold=True,
                 color=C_TEXT_DIM)

    # Image
    if data.get("image"):
        try_add_image(slide, data["image"], img_left, img_top, img_width, img_height)

    return slide

# ── CENTER slide (text only, wide) ────────────────────────────────────────────
def build_center(prs, data):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(slide, C_BG)
    add_chrome(slide, data)

    accent = data.get("accent", C_PRIMARY)

    add_title(slide, data["title"],
              Inches(0.6), Inches(1.15), Inches(12.0), Inches(2.8),
              font_size=56, color=accent)

    body = data.get("body", "")
    if body:
        add_body(slide, body,
                 Inches(0.6), Inches(4.2), Inches(12.0), Inches(2.6),
                 font_size=18, color=C_TEXT_DIM)

    return slide

# ── CREDITS slide ─────────────────────────────────────────────────────────────
def build_credits(prs, data):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(slide, C_BG)
    accent = data.get("accent", C_SECONDARY)

    # Left accent bar
    add_rect(slide, Inches(0.42), Inches(0.5), Inches(0.05), Inches(6.5), accent)

    # Section
    add_text(slide, "CREDITS",
             Inches(0.6), Inches(0.4), Inches(3), Inches(0.35),
             font_name=F_LABEL, font_size=8, bold=True, color=accent)

    # POLARIS BEARS
    add_text(slide, "POLARIS BEARS",
             Inches(10.0), Inches(0.38), Inches(3.0), Inches(0.38),
             font_name=F_HEADLINE, font_size=9, bold=True,
             color=C_PRIMARY, align=PP_ALIGN.RIGHT)

    # Title
    add_title(slide, data["title"],
              Inches(0.6), Inches(0.7), Inches(6.5), Inches(1.5),
              font_size=40, color=accent)

    # Team column header
    add_text(slide, "ECHIPA",
             Inches(0.6), Inches(2.35), Inches(5), Inches(0.4),
             font_name=F_LABEL, font_size=8, bold=True, color=C_PRIMARY)
    add_rect(slide, Inches(0.6), Inches(2.72), Inches(5.5), Inches(0.02), C_OUTLINE)

    team_text = (
        "Ioan CHELARU\n"
        "  Arhitectură sistem, calcule energetice,\n"
        "  superconductori YBCO, dinamică orbitală\n\n"
        "Albert OLARIU\n"
        "  Modelare vizuală, scala Kardashev,\n"
        "  rețea Star Power Grid, prezentare\n\n"
        "Colaboratori:\n"
        "  — de completat —"
    )
    add_body(slide, team_text,
             Inches(0.6), Inches(2.85), Inches(5.8), Inches(4.0),
             font_size=12, color=C_TEXT_DIM, line_spacing_pct=140)

    # Team photo
    if data.get("image"):
        try_add_image(slide, data["image"],
                      Inches(6.8), Inches(1.0), Inches(3.5), Inches(4.5))

    # Bibliography column header
    add_text(slide, "BIBLIOGRAFIE — HARVARD STYLE",
             Inches(0.6), Inches(5.0) if not data.get("image") else Inches(5.05),
             Inches(12), Inches(0.35),
             font_name=F_LABEL, font_size=7, bold=True, color=C_SECONDARY)

    bib_short = (
        "Mankins (2011) · ESA (2023) · Eddowes (2017) · Chou et al. (2019) · "
        "Glaser (1968) · Benford & Benford (2015) · Kardashev (1964) · "
        "Aschenbrenner (2023) · NASA NIAC · Parker Solar Probe · "
        "Lagrange Points · JAXA SSPS"
    )
    add_text(slide, bib_short,
             Inches(0.6), Inches(5.4), Inches(12.3), Inches(0.7),
             font_name=F_LABEL, font_size=8, color=C_OUTLINE)

    # Bottom rule
    add_rect(slide, Inches(0.42), Inches(7.05), Inches(12.5), Inches(0.025), C_OUTLINE)
    add_text(slide,
             "ONCS 2026 — P.O.L.A.R.I.S. — ENERGIE SOLARĂ ORBITALĂ",
             Inches(0.55), Inches(7.15), Inches(10.5), Inches(0.28),
             font_name=F_LABEL, font_size=7, color=C_OUTLINE)
    add_text(slide, "16",
             Inches(12.2), Inches(7.15), Inches(0.9), Inches(0.28),
             font_name=F_LABEL, font_size=7, bold=True,
             color=C_OUTLINE, align=PP_ALIGN.RIGHT)

    return slide

# ── Build one slide by type ────────────────────────────────────────────────────
def build_slide(prs, data):
    stype = data.get("type", "split")
    layout = data.get("layout", "split")

    if stype == "cover":
        return build_cover(prs, data)
    elif stype == "credits":
        return build_credits(prs, data)
    elif layout == "center" or not data.get("image"):
        return build_center(prs, data)
    else:
        return build_split(prs, data)

# ── Generate one presentation ─────────────────────────────────────────────────
def generate(m365=False):
    prs = Presentation()
    prs.slide_width  = W
    prs.slide_height = H

    for i, data in enumerate(SLIDES):
        print(f"  Slide {data['num']}: {data.get('title', '?')[:30]}...")
        slide = build_slide(prs, data)
        if m365:
            add_morph_transition(slide)
        else:
            add_fade_transition(slide)

    suffix   = "365" if m365 else "2019"
    out_path = os.path.join(BASE_DIR, f"POLARIS_{suffix}.pptx")
    prs.save(out_path)
    size_mb = os.path.getsize(out_path) / 1024 / 1024
    print(f"\nSaved: {out_path}  ({size_mb:.1f} MB)")
    return out_path

# ── Main ──────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=" * 60)
    print("POLARIS COMMAND - PowerPoint Generator")
    print("=" * 60)
    print("\n[1/2] Generating POLARIS_2019.pptx ...")
    generate(m365=False)
    print("\n[2/2] Generating POLARIS_365.pptx ...")
    generate(m365=True)
    print("\n" + "=" * 60)
    print("Done. Deschide fisierele in PowerPoint pentru preview.")
    print("=" * 60)
