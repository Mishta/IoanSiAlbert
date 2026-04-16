#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
POLARIS COMMAND — Generator diagrame tehnice + formule matematice
Genereaza PNG-uri pentru slide-urile PPTX:
  assets/diagrams/formula_inverse_square.png
  assets/diagrams/formula_chain.png
  assets/diagrams/formula_current.png
  assets/diagrams/diagram_lagrange.png
  assets/diagrams/diagram_energy_bar.png
  assets/diagrams/diagram_kardashev.png
  assets/diagrams/diagram_methodology.png

Run: py -3.14 generate_assets.py
"""

import os
import math
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import matplotlib.patches as patches
from matplotlib.patches import FancyArrowPatch, Arc, Circle, FancyBboxPatch
from matplotlib.patheffects import withStroke
import matplotlib.patheffects as pe

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUT_DIR  = os.path.join(BASE_DIR, "assets", "diagrams")
os.makedirs(OUT_DIR, exist_ok=True)

# ── Design System POLARIS ──────────────────────────────────────────────────────
BG     = "#0f131f"
SURF   = "#1b1f2c"
SURF_H = "#262a37"
GOLD   = "#ffe3b7"
CYAN   = "#bdf4ff"
GREEN  = "#91ff89"
TEXT   = "#dfe2f3"
DIM    = "#d4c5ab"
LINE   = "#4f4632"

plt.rcParams.update({
    "figure.facecolor":  BG,
    "axes.facecolor":    BG,
    "text.color":        TEXT,
    "axes.labelcolor":   TEXT,
    "xtick.color":       DIM,
    "ytick.color":       DIM,
    "axes.edgecolor":    LINE,
    "grid.color":        LINE,
    "grid.alpha":        0.4,
    "font.family":       "sans-serif",
    "font.sans-serif":   ["Segoe UI", "Arial", "DejaVu Sans"],
})

def save(fig, name, dpi=200):
    path = os.path.join(OUT_DIR, name)
    fig.savefig(path, dpi=dpi, bbox_inches="tight",
                facecolor=BG, edgecolor="none")
    plt.close(fig)
    size = os.path.getsize(path) / 1024
    print(f"  [{size:6.0f} KB]  {name}")
    return path


# ═══════════════════════════════════════════════════════════════════════════════
# 1. FORMULE MATEMATICE
# ═══════════════════════════════════════════════════════════════════════════════

def make_formula(tex_str, filename, width=9, height=2.4, color=CYAN,
                 label=None, label_color=DIM):
    """Render formula mathtext ca PNG pe fundal dark."""
    fig, ax = plt.subplots(figsize=(width, height))
    fig.patch.set_facecolor(BG)
    ax.set_facecolor(BG)
    ax.axis("off")

    if label:
        ax.text(0.5, 0.85, label,
                transform=ax.transAxes, ha="center", va="center",
                fontsize=11, color=label_color, alpha=0.7,
                fontfamily="sans-serif")

    ax.text(0.5, 0.42, tex_str,
            transform=ax.transAxes, ha="center", va="center",
            fontsize=38, color=color,
            math_fontfamily="stix",
            usetex=False)

    # Linie decorativa subtire
    ax.axhline(y=0.12, xmin=0.15, xmax=0.85, color=LINE, linewidth=0.8)
    save(fig, filename, dpi=180)


print("Generez formule matematice...")
make_formula(
    r"$I(r) = \dfrac{P_\odot}{4\pi r^2}$",
    "formula_inverse_square.png",
    label="LEGEA INVERSULUI PATRATULUI  ·  Fundament fizic POLARIS",
    color=CYAN,
)
make_formula(
    r"$P_{incident} = I_{7M} \cdot A_{total}$" + "    " +
    r"$= 6{,}22 \times 10^5 \cdot 2{,}36 \times 10^7$",
    "formula_power_incident.png",
    label="PUTERE INCIDENTA  ·  Roi Dyson la 7 milioane km",
    color=GOLD,
)
make_formula(
    r"$j \leq j_c$    ;    $T_{op} = 77\,K$    ;    $\rho_{YBCO} \approx 0$",
    "formula_current.png",
    label="SUPRACONDUCTORI YBCO  ·  Densitate curent si temperatura de operare",
    color=CYAN,
)
make_formula(
    r"$\eta_{total} = \eta_{oglinzi} \cdot \eta_{laser} \cdot \eta_{L4} \cdot \eta_{YBCO} \approx 11\%$",
    "formula_efficiency.png",
    label="EFICIENTA CUMULATA  ·  Lant complet de conversie",
    color=GREEN,
    width=11,
)
make_formula(
    r"$P_{livrat} = 2 \times 800\,GW = 1{,}6\,TW$",
    "formula_delivered.png",
    label="PUTERE LIVRATA  ·  2 statii polare x 800 GW",
    color=GREEN,
    width=9, height=2.4,
)


# ═══════════════════════════════════════════════════════════════════════════════
# 2. DIAGRAMA LAGRANGE  (L4/L5 in sistemul Soare-Pamant)
# ═══════════════════════════════════════════════════════════════════════════════

print("Generez diagrama Lagrange...")

fig, ax = plt.subplots(figsize=(12, 9))
fig.patch.set_facecolor(BG)
ax.set_facecolor(BG)
ax.set_aspect("equal")
ax.axis("off")

# Orbita Pamantului
theta = np.linspace(0, 2 * np.pi, 360)
R = 1.0  # 1 UA normalizat
ax.plot(R * np.cos(theta), R * np.sin(theta),
        color=LINE, linewidth=1.2, linestyle="--", alpha=0.6)

# Soarele
sun = Circle((0, 0), 0.08, color="#ffba20", zorder=10)
ax.add_patch(sun)
sun_glow = Circle((0, 0), 0.14, color="#ffba20", alpha=0.15, zorder=9)
ax.add_patch(sun_glow)
ax.text(0, -0.22, "SOARELE", ha="center", va="top",
        color=GOLD, fontsize=11, fontweight="bold")

# Pamantul (la 0 grade pe orbita)
ex, ey = R, 0
earth = Circle((ex, ey), 0.05, color="#4fc3f7", zorder=10)
ax.add_patch(earth)
ax.text(ex + 0.08, ey + 0.08, "PAMANTUL", ha="left",
        color=CYAN, fontsize=11, fontweight="bold")

# L4 (60 grade inainte de Pamant = +60°)
l4_angle = math.radians(60)
l4x, l4y = R * math.cos(l4_angle), R * math.sin(l4_angle)

# L5 (60 grade in urma Pamantului = -60°)
l5_angle = math.radians(-60)
l5x, l5y = R * math.cos(l5_angle), R * math.sin(l5_angle)

# Punctele Lagrange
for px, py, label, col in [
    (l4x, l4y, "L4", GREEN),
    (l5x, l5y, "L5", GREEN),
]:
    glow = Circle((px, py), 0.07, color=col, alpha=0.2, zorder=8)
    ax.add_patch(glow)
    marker = Circle((px, py), 0.04, color=col, zorder=10)
    ax.add_patch(marker)
    off_x = 0.12 if px > 0 else -0.12
    off_y = 0.10
    ax.text(px + off_x, py + off_y, label,
            ha="center", color=col, fontsize=13, fontweight="bold")
    ax.text(px + off_x, py + off_y - 0.14,
            "Releu Energetic\nPOLARIS", ha="center",
            color=col, fontsize=8, alpha=0.8)

# Triunghi echilateral Soare-Pamant-L4
tri_pts = [(0, 0), (ex, ey), (l4x, l4y), (0, 0)]
txs = [p[0] for p in tri_pts]
tys = [p[1] for p in tri_pts]
ax.plot(txs, tys, color=GREEN, linewidth=0.8, linestyle=":", alpha=0.5)

# Triunghi Soare-Pamant-L5
tri_pts5 = [(0, 0), (ex, ey), (l5x, l5y), (0, 0)]
ax.plot([p[0] for p in tri_pts5], [p[1] for p in tri_pts5],
        color=GREEN, linewidth=0.8, linestyle=":", alpha=0.5)

# Sateliti colectori (aproape de Soare, la ~7M km = 0.047 UA)
sat_r = 0.25  # reprezentare schematics (nu la scala)
for angle_deg in [20, 70, 340, 290]:
    a = math.radians(angle_deg)
    sx, sy = sat_r * math.cos(a), sat_r * math.sin(a)
    ax.plot(sx, sy, "D", color=GOLD, markersize=6, zorder=10)

# Orbita satelitilor colectori (semn)
ax.plot(sat_r * np.cos(theta), sat_r * np.sin(theta),
        color=GOLD, linewidth=0.8, linestyle=":", alpha=0.4)
ax.text(-0.35, 0.22, "Roi Dyson\n(7M km fata\nde Soare)",
        ha="center", color=GOLD, fontsize=9, alpha=0.9)

# Fascicule laser: colector → L4
for angle_deg in [20, 70]:
    a = math.radians(angle_deg)
    sx, sy = sat_r * math.cos(a), sat_r * math.sin(a)
    ax.annotate("", xy=(l4x, l4y), xytext=(sx, sy),
                arrowprops=dict(arrowstyle="->", color=CYAN,
                                lw=1.0, alpha=0.7))

# Fascicul laser: L4 → Statii polare (reprezentat spre Pamant)
ax.annotate("", xy=(ex * 0.92, ey + 0.15), xytext=(l4x, l4y),
            arrowprops=dict(arrowstyle="->", color=GREEN,
                            lw=1.2, alpha=0.8))
ax.text((l4x + ex * 0.92) / 2 + 0.05,
        (l4y + ey + 0.15) / 2 + 0.1,
        "Laser\nL4→Pol", ha="center",
        color=GREEN, fontsize=8, alpha=0.85)

# Unghi 60° marker
arc = Arc((0, 0), 0.4, 0.4, angle=0, theta1=0, theta2=60,
          color=DIM, linewidth=1.0, linestyle="--")
ax.add_patch(arc)
ax.text(0.25, 0.13, "60°", color=DIM, fontsize=9)

# Legenda distante
ax.text(-1.55, -1.35,
        "Nota: Diagrama schematica — nu la scala\n"
        "Distanta Soare-Pamant = 1 UA = 150 milioane km\n"
        "Distanta Roi Dyson = 7 milioane km (0.047 UA)",
        color=DIM, fontsize=8, alpha=0.7, va="bottom")

# Titlu
ax.set_title("SISTEMUL LAGRANGE  ·  P.O.L.A.R.I.S.",
             color=GOLD, fontsize=14, fontweight="bold", pad=16)

ax.set_xlim(-1.6, 1.6)
ax.set_ylim(-1.5, 1.5)
save(fig, "diagram_lagrange.png", dpi=200)


# ═══════════════════════════════════════════════════════════════════════════════
# 3. DIAGRAMA COMPARATIE ENERGETICA (bar chart)
# ═══════════════════════════════════════════════════════════════════════════════

print("Generez bar chart comparatie energetica...")

fig, ax = plt.subplots(figsize=(12, 6))
fig.patch.set_facecolor(BG)
ax.set_facecolor(BG)

categories = [
    "Cerere globala\nIEA 2023",
    "POLARIS\nFaza 1",
    "POLARIS\nPotential maxim",
]
values   = [17.7, 1.6, 420.5]
colors   = [CYAN, GREEN, GOLD]
alphas   = [0.85, 1.0, 0.9]

bars = ax.barh(categories, values, color=colors,
               alpha=0.9, height=0.55, zorder=3)

# Valori pe bare
for bar, val, col in zip(bars, values, colors):
    xpos = bar.get_width() + 3
    ax.text(xpos, bar.get_y() + bar.get_height() / 2,
            f"{val} TW", va="center", ha="left",
            color=col, fontsize=15, fontweight="bold")

# Linie referinta cerere globala
ax.axvline(x=17.7, color=CYAN, linewidth=1.0,
           linestyle="--", alpha=0.5, zorder=2)

# Adnotare: POLARIS acopera 48% din cerere electrica
ax.annotate("≈ 48% din\nconsumul electric\nglobal",
            xy=(1.6, 1.0), xytext=(40, 1.0),
            fontsize=10, color=GREEN, va="center",
            arrowprops=dict(arrowstyle="->", color=GREEN, lw=1.0))

ax.set_xlabel("Terawati (TW)", color=DIM, fontsize=12)
ax.set_title("COMPARATIE ENERGETICA  ·  P.O.L.A.R.I.S. vs. Cerere Globala",
             color=GOLD, fontsize=13, fontweight="bold", pad=14)
ax.set_xlim(0, 490)
ax.grid(axis="x", color=LINE, alpha=0.4, zorder=0)
ax.spines["top"].set_visible(False)
ax.spines["right"].set_visible(False)
ax.spines["left"].set_color(LINE)
ax.spines["bottom"].set_color(LINE)
ax.tick_params(colors=DIM, labelsize=11)

save(fig, "diagram_energy_bar.png", dpi=200)


# ═══════════════════════════════════════════════════════════════════════════════
# 4. DIAGRAMA SCALA KARDASHEV (static, pentru background/overlay)
# ═══════════════════════════════════════════════════════════════════════════════

print("Generez diagrama Kardashev (static)...")

fig, ax = plt.subplots(figsize=(13, 5))
fig.patch.set_facecolor(BG)
ax.set_facecolor(BG)
ax.axis("off")

# Bara principala
bar_left, bar_right = 0.06, 0.94
bar_y = 0.5
bar_h = 0.18

# Background bar
bg_bar = FancyBboxPatch((bar_left, bar_y - bar_h / 2),
                          bar_right - bar_left, bar_h,
                          boxstyle="round,pad=0.002",
                          facecolor=SURF_H, edgecolor=LINE, linewidth=1)
ax.add_patch(bg_bar)

# Gradient fill (simulat cu multiple dreptunghiuri)
segments = 200
for i in range(segments):
    t = i / segments
    x_s = bar_left + t * (bar_right - bar_left)
    w_s = (bar_right - bar_left) / segments
    # Color: orange (0) → gold → cyan → green (1.0) → fade (1+)
    if t < 0.365:   # 0 → 0.73
        r = int(255 * (1 - t / 0.365) + 100 * (t / 0.365))
        g = int(100 * (1 - t / 0.365) + 180 * (t / 0.365))
        b = int(50  * (1 - t / 0.365) + 80  * (t / 0.365))
    elif t < 0.5:   # 0.73 → 1.0
        tt = (t - 0.365) / 0.135
        r = int(100 * (1 - tt) + 145 * tt)
        g = int(180 * (1 - tt) + 255 * tt)
        b = int(80  * (1 - tt) + 137 * tt)
    else:           # 1.0+
        r, g, b = 60, 80, 80
    col = f"#{r:02x}{g:02x}{b:02x}"
    rect = FancyBboxPatch((x_s, bar_y - bar_h / 2), w_s, bar_h,
                           boxstyle="square,pad=0",
                           facecolor=col, edgecolor="none")
    ax.add_patch(rect)

# Marker azi (0.73 = 36.5% din bara)
marker_x = bar_left + 0.365 * (bar_right - bar_left)
ax.plot([marker_x, marker_x], [bar_y - bar_h * 0.7, bar_y + bar_h * 1.4],
        color=CYAN, linewidth=2, zorder=10)
ax.text(marker_x, bar_y + bar_h * 1.6, "AZI\n0.73",
        ha="center", color=CYAN, fontsize=12, fontweight="bold")

# Marker Tip I (0.5 din bara = exact jumatatea, care e 1.0)
t1_x = bar_left + 0.5 * (bar_right - bar_left)
ax.plot([t1_x, t1_x], [bar_y - bar_h * 0.7, bar_y + bar_h * 1.4],
        color=GREEN, linewidth=2.5, zorder=10, linestyle="--")
ax.text(t1_x, bar_y + bar_h * 1.6, "TIP I\nPOLARIS",
        ha="center", color=GREEN, fontsize=12, fontweight="bold")

# Marker Tip II, III
for label, pos in [("TIP II", 0.75), ("TIP III", 1.0)]:
    tx = bar_left + pos * (bar_right - bar_left)
    ax.plot([tx, tx], [bar_y - bar_h * 0.5, bar_y + bar_h * 0.5],
            color=DIM, linewidth=1, alpha=0.5)
    ax.text(tx, bar_y + bar_h * 1.6, label,
            ha="center", color=DIM, fontsize=10, alpha=0.6)

# Descrieri sub bara
descriptions = [
    (bar_left + 0.18 * (bar_right - bar_left), "Energie\nfosilă"),
    (marker_x, "Energie\nsolara\nterestra"),
    (t1_x, "Energia\nuna planete"),
    (bar_left + 0.75 * (bar_right - bar_left), "Energia\nuna stele"),
]
for dx, dtxt in descriptions:
    ax.text(dx, bar_y - bar_h * 1.4, dtxt,
            ha="center", color=DIM, fontsize=8, alpha=0.65, va="top")

# Titlu
ax.set_title("SCALA KARDASHEV  ·  Tranzitia Civilizationala spre Tipul I",
             color=GOLD, fontsize=14, fontweight="bold", pad=10, y=0.98)
ax.text(0.5, 0.02,
        "POLARIS este puntea dintre Tipul 0 si Tipul I — prima tranzitie civilizationala",
        ha="center", color=DIM, fontsize=10, alpha=0.75,
        transform=ax.transAxes)

ax.set_xlim(0, 1)
ax.set_ylim(-0.15, 1.15)
save(fig, "diagram_kardashev.png", dpi=200)


# ═══════════════════════════════════════════════════════════════════════════════
# 5. DIAGRAMA METODOLOGIE (flowchart 6 domenii)
# ═══════════════════════════════════════════════════════════════════════════════

print("Generez diagrama metodologie...")

fig, ax = plt.subplots(figsize=(14, 7))
fig.patch.set_facecolor(BG)
ax.set_facecolor(BG)
ax.axis("off")

domains = [
    ("FIZICA\nASTROFIZICA", GOLD,   "Legea\ninversului\npatratului"),
    ("ASTRONOMIE\nORBITALA",  CYAN,  "Mecanica\nLagrange\nL4/L5"),
    ("INGINERIE\nOPTICA",     GOLD,  "Oglinzi km\nFascicule\nlaser"),
    ("SUPRACOND.\nYBCO",      CYAN,  "T=77K\nj<=jc\npierderi~0"),
    ("CRIOGENIE\nFLUIDE",     GREEN, "Azot lichid\nBaloane He\n30 km alt."),
    ("MECcanica\nFLUIDE",     GREEN, "Arhimede\nPlutire\nstratosf."),
]

n = len(domains)
xs = np.linspace(0.07, 0.93, n)
y_box = 0.55
box_w, box_h = 0.12, 0.32

for i, (name, col, detail) in enumerate(domains):
    # Box
    rect = FancyBboxPatch((xs[i] - box_w / 2, y_box - box_h / 2),
                           box_w, box_h,
                           boxstyle="round,pad=0.01",
                           facecolor=SURF, edgecolor=col,
                           linewidth=1.5, zorder=5)
    ax.add_patch(rect)

    # Titlu domeniu
    ax.text(xs[i], y_box + box_h * 0.2, name,
            ha="center", va="center", color=col,
            fontsize=9, fontweight="bold", zorder=6)

    # Detalii
    ax.text(xs[i], y_box - box_h * 0.2, detail,
            ha="center", va="center", color=DIM,
            fontsize=7.5, alpha=0.85, zorder=6)

    # Sageti de la un box la altul
    if i < n - 1:
        x_start = xs[i] + box_w / 2
        x_end   = xs[i + 1] - box_w / 2
        ax.annotate("", xy=(x_end, y_box), xytext=(x_start, y_box),
                    arrowprops=dict(arrowstyle="->",
                                   color=LINE, lw=1.2), zorder=4)

# Rezultat final
res_x = 0.5
res_y = 0.13
res_box = FancyBboxPatch((res_x - 0.22, res_y - 0.08),
                          0.44, 0.16,
                          boxstyle="round,pad=0.01",
                          facecolor=SURF_H, edgecolor=GREEN,
                          linewidth=2, zorder=5)
ax.add_patch(res_box)
ax.text(res_x, res_y,
        "REZULTAT:  1,6 TW  livrati  (eta_total = 11%)",
        ha="center", va="center", color=GREEN,
        fontsize=13, fontweight="bold", zorder=6)

# Sageti de la boxuri → rezultat
for i in range(n):
    ax.annotate("", xy=(res_x + (i - n / 2 + 0.5) * 0.07, res_y + 0.09),
                xytext=(xs[i], y_box - box_h / 2),
                arrowprops=dict(arrowstyle="->",
                               color=SURF_H, lw=0.8, alpha=0.5), zorder=3)

ax.set_title(
    "METODOLOGIE  ·  6 Domenii Integrate — Modele Matematice Inlantuite",
    color=GOLD, fontsize=13, fontweight="bold", pad=12)

ax.set_xlim(0, 1)
ax.set_ylim(0, 1)
save(fig, "diagram_methodology.png", dpi=200)


print("\nGata! Toate diagramele au fost generate in:")
print(f"  {OUT_DIR}")
