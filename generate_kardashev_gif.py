#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generare GIF animat Kardashev Wipe — left-to-right reveal
Foloseste 2 imagini generate in Kling:
  - Image F1 - Kardashev Earth Today.png   (stanga: Pamant intunecat, 0.73)
  - Image F2 - Kardashev Earth POLARIS.png (dreapta: Pamant cu sistem orbital, 1.0)

Genereaza:
  images/generated/Image F - Kardashev Wipe.gif  (pentru PPTX slide 14)

Run: py -3.14 generate_kardashev_gif.py
"""

import os
from PIL import Image as PILImage, ImageDraw, ImageFont
import math

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ── Configurare ────────────────────────────────────────────────────────────────
IMG_A_REL = "images/generated/Image F1 - Kardashev Earth Today.png"
IMG_B_REL = "images/generated/Image F2 - Kardashev Earth POLARIS (1.0).png"
OUT_GIF   = "images/generated/Image F - Kardashev Wipe.gif"

# Dimensiune output GIF
OUT_W, OUT_H = 1280, 720

# Animatie
FRAMES_PAUSE_START = 18   # ~ 1.8s pauza pe imaginea A
FRAMES_WIPE        = 40   # ~ 4s pentru wipe
FRAMES_PAUSE_END   = 18   # ~ 1.8s pauza pe imaginea B
FRAME_MS           = 100  # 100ms per frame = 10fps

# Culori design system POLARIS
C_BG      = (15, 19, 31)
C_GOLD    = (255, 227, 183)
C_CYAN    = (189, 244, 255)
C_GREEN   = (145, 255, 137)
C_TEXT_DIM= (212, 197, 171)
C_LINE    = (79, 70, 50)

# ── Load & resize ambele imagini ──────────────────────────────────────────────

def load_and_fit(rel_path, target_w, target_h):
    """Incarca imaginea si o crop/resize sa umple exact target_w x target_h."""
    full = os.path.join(BASE_DIR, rel_path)
    if not os.path.exists(full):
        print(f"[WARN] Imagine lipsa: {full}")
        img = PILImage.new("RGB", (target_w, target_h), C_BG)
        d = ImageDraw.Draw(img)
        d.text((target_w // 2 - 100, target_h // 2), "[ imagine lipsa ]",
               fill=C_TEXT_DIM)
        return img
    img = PILImage.open(full).convert("RGB")
    iw, ih = img.size
    scale = max(target_w / iw, target_h / ih)
    nw, nh = int(iw * scale), int(ih * scale)
    img = img.resize((nw, nh), PILImage.LANCZOS)
    ox = (nw - target_w) // 2
    oy = (nh - target_h) // 2
    return img.crop((ox, oy, ox + target_w, oy + target_h))


def draw_overlay(img, kardashev_val, val_color, label_left, label_right):
    """Adauga overlayul cu bara Kardashev si valorile."""
    d = ImageDraw.Draw(img)
    overlay = PILImage.new("RGBA", img.size, (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)

    # Dark gradient bottom strip pentru text
    bar_y = OUT_H - 140
    for i in range(140):
        alpha = int(200 * (i / 140))
        od.rectangle([(0, bar_y + i), (OUT_W, bar_y + i + 1)],
                     fill=(15, 19, 31, alpha))
    img = PILImage.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
    d = ImageDraw.Draw(img)

    # --- Bara Kardashev ---
    bar_left  = int(OUT_W * 0.08)
    bar_right = int(OUT_W * 0.92)
    bar_w     = bar_right - bar_left
    bar_y_center = OUT_H - 75
    bar_h     = 6

    # Background bara
    d.rounded_rectangle(
        [(bar_left, bar_y_center - bar_h // 2),
         (bar_right, bar_y_center + bar_h // 2)],
        radius=3, fill=(79, 70, 50, 200)
    )

    # Fill bara (0.0 la stanga, 1.0 = 100%)
    fill_x = bar_left + int(bar_w * min(kardashev_val, 1.0))
    if fill_x > bar_left:
        d.rounded_rectangle(
            [(bar_left, bar_y_center - bar_h // 2),
             (fill_x, bar_y_center + bar_h // 2)],
            radius=3, fill=val_color
        )

    # Marker circular pe pozitia curenta
    marker_r = 10
    d.ellipse(
        [(fill_x - marker_r, bar_y_center - marker_r),
         (fill_x + marker_r, bar_y_center + marker_r)],
        fill=val_color, outline=(255, 255, 255, 200), width=2
    )

    # Ticks: 0.0 / 0.73 / 1.0 / II / III
    ticks = [(0.0, "0"), (0.73, "0.73"), (1.0, "I"), (1.5, "II"), (2.0, "III")]
    for tv, tl in ticks:
        tx = bar_left + int(bar_w * min(tv / 2.0, 1.0))  # scala 0-2 in bara
        # tick actual la 0-1 scale
        tx = bar_left + int(bar_w * (tv / 2.0)) if tv <= 2.0 else bar_right
        d.line([(tx, bar_y_center - 14), (tx, bar_y_center + 14)],
               fill=(212, 197, 171), width=1)
        d.text((tx - 8, bar_y_center + 18), tl, fill=(212, 197, 171))

    # Eticheta valoare curenta
    val_str = f"Tip {kardashev_val:.2f}"
    d.text((fill_x - 30, bar_y_center - 32), val_str, fill=val_color)

    # Label stanga / dreapta
    d.text((bar_left, OUT_H - 115), label_left, fill=(212, 197, 171))
    d.text((bar_right - len(label_right) * 7, OUT_H - 115),
           label_right, fill=val_color)

    return img


# ── Generare frames ────────────────────────────────────────────────────────────

def easeInOut(t):
    """Smooth easing pentru wipe."""
    return t * t * (3.0 - 2.0 * t)


def generate_gif():
    print("Incarc imaginile...")
    img_a = load_and_fit(IMG_A_REL, OUT_W, OUT_H)
    img_b = load_and_fit(IMG_B_REL, OUT_W, OUT_H)

    frames = []
    durations = []

    # -- Faza 1: Pauza pe imaginea A (Pamant azi, 0.73) --
    for _ in range(FRAMES_PAUSE_START):
        frame = img_a.copy()
        frame = draw_overlay(frame, 0.73, (255, 140, 50),
                             "Azi: 0.73", "")
        frames.append(frame)
        durations.append(FRAME_MS)

    # -- Faza 2: Wipe stanga → dreapta cu progres Kardashev --
    for i in range(FRAMES_WIPE):
        t = easeInOut(i / (FRAMES_WIPE - 1))
        wipe_x = int(OUT_W * t)

        # Compune: A pe stanga, B pe dreapta
        composite = img_a.copy()
        if wipe_x > 0:
            region_b = img_b.crop((0, 0, wipe_x, OUT_H))
            composite.paste(region_b, (0, 0))

        # Linie de separare animata (glow cyan)
        d = ImageDraw.Draw(composite)
        if 2 <= wipe_x <= OUT_W - 2:
            for offset, alpha in [(0, 200), (1, 100), (2, 50), (-1, 100), (-2, 50)]:
                lx = wipe_x + offset
                if 0 <= lx < OUT_W:
                    d.line([(lx, 0), (lx, OUT_H)],
                           fill=(189, 244, 255, alpha), width=1)

        # Kardashev value interpolat: 0.73 → 1.0
        kv = 0.73 + (1.0 - 0.73) * t
        color = (
            int(255 * (1 - t) + 145 * t),   # R: gold→green
            int(140 * (1 - t) + 255 * t),   # G
            int(50  * (1 - t) + 137 * t),   # B
        )
        label_r = f"POLARIS: Tip {kv:.2f}" if t > 0.1 else ""
        composite = draw_overlay(composite, kv, color,
                                 "Azi: 0.73", label_r)
        frames.append(composite)
        durations.append(FRAME_MS)

    # -- Faza 3: Pauza pe imaginea B (POLARIS 1.0) --
    for _ in range(FRAMES_PAUSE_END):
        frame = img_b.copy()
        frame = draw_overlay(frame, 1.0, (145, 255, 137),
                             "Azi: 0.73", "POLARIS: Tip 1.0")
        frames.append(frame)
        durations.append(FRAME_MS)

    # -- Salveaza GIF --
    out_path = os.path.join(BASE_DIR, OUT_GIF)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    print(f"Salvez GIF ({len(frames)} frames) → {out_path}")
    frames[0].save(
        out_path,
        save_all=True,
        append_images=frames[1:],
        duration=durations,
        loop=0,        # loop infinit
        optimize=False
    )
    size_mb = os.path.getsize(out_path) / 1024 / 1024
    print(f"Gata! {size_mb:.1f} MB — {len(frames)} frames @ {FRAME_MS}ms")
    print(f"Durata totala: {sum(durations)/1000:.1f}s")


if __name__ == "__main__":
    generate_gif()
