"""
Export rollup_4_complet.html:
  1. Preview PNG (850x2000 px, screen)
  2. High-res PNG (5100x12000 px, ~181 DPI la 85x200cm) via Chrome scale=6
  3. 300 DPI PNG (10039x23622 px) via PIL LANCZOS + DPI metadata
"""
import base64, io, os, re, subprocess, tempfile
from PIL import Image

CHROME = r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
ROLLUP_DIR = os.path.dirname(os.path.abspath(__file__))
MIME = {
    ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml", ".css": "text/css", ".webp": "image/webp",
}

def img_to_b64(abs_p, max_px):
    ext = os.path.splitext(abs_p)[1].lower()
    if ext in (".svg", ".css"):
        return base64.b64encode(open(abs_p, "rb").read()).decode(), MIME.get(ext, "application/octet-stream")
    img = Image.open(abs_p)
    if img.width > max_px:
        ratio = max_px / img.width
        img = img.resize((max_px, int(img.height * ratio)), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, format="PNG", optimize=True)
    return base64.b64encode(buf.getvalue()).decode(), "image/png"

def inline_all(html, html_dir, max_px):
    def repl_src(m):
        attr, q, path = m.group(1), m.group(2), m.group(3)
        if path.startswith("data:") or path.startswith("http"):
            return m.group(0)
        abs_p = os.path.normpath(os.path.join(html_dir, path))
        if not os.path.exists(abs_p):
            print(f"  MISS: {abs_p}")
            return m.group(0)
        b64, mime = img_to_b64(abs_p, max_px)
        print(f"  OK  {os.path.basename(abs_p):50s} {len(b64)//1024:5d}KB")
        return f'{attr}={q}data:{mime};base64,{b64}{q}'
    html = re.sub(r'(src|href)=(["\'])([^"\']+)\2', repl_src, html)
    def repl_url(m):
        q, path = m.group(1), m.group(2)
        if path.startswith("data:") or path.startswith("http"):
            return m.group(0)
        abs_p = os.path.normpath(os.path.join(html_dir, path))
        if not os.path.exists(abs_p):
            return m.group(0)
        b64, mime = img_to_b64(abs_p, max_px)
        return f"url({q}data:{mime};base64,{b64}{q})"
    html = re.sub(r"url\((['\"]?)([^'\")\s]+)\1\)", repl_url, html)
    return html

def chrome_screenshot(html_path, out_png, win_w, win_h, scale=None, timeout=360, max_px=900):
    with open(html_path, "r", encoding="utf-8") as f:
        html = f.read()
    html = inline_all(html, os.path.dirname(html_path), max_px)
    print(f"  HTML size: {len(html)//1024//1024} MB")
    tmp = tempfile.NamedTemporaryFile(suffix=".html", delete=False, mode="w", encoding="utf-8")
    tmp.write(html)
    tmp.close()
    cmd = [
        CHROME, "--headless=new", "--disable-gpu",
        f"--screenshot={out_png}",
        f"--window-size={win_w},{win_h}",
        "--hide-scrollbars", "--no-sandbox",
        "--run-all-compositor-stages-before-draw",
        "--virtual-time-budget=10000",
    ]
    if scale:
        cmd.append(f"--force-device-scale-factor={scale:.4f}")
    cmd.append(f"file:///{tmp.name.replace(os.sep, '/')}")
    try:
        subprocess.run(cmd, capture_output=True, timeout=timeout)
        sz = os.path.getsize(out_png)
        print(f"  Output: {sz:,} bytes")
        return sz
    finally:
        try:
            os.unlink(tmp.name)
        except Exception:
            pass

html_src = os.path.join(ROLLUP_DIR, "rollup_4_complet.html")

# ── 1. Preview ────────────────────────────────────────
print("\n=== [1] Preview 850x2000 ===")
out_preview = os.path.join(ROLLUP_DIR, "rollup_4_complet.png")
chrome_screenshot(html_src, out_preview, 850, 2000, scale=None, timeout=360)

im_prev = Image.open(out_preview)
print(f"  Dimensions: {im_prev.width}x{im_prev.height} px")

# ── 2. Scale=4 high-res (3400x8000, CSS+text sharp) ──
# max_px=900 keeps HTML at ~7MB (same as preview) so Chrome doesn't OOM.
# CSS/text renders at full device-pixel density. Photos PIL-upscaled later.
print("\n=== [2] Scale=4  (3400x8000 px) — text sharp, small HTML ===")
out_hires = os.path.join(ROLLUP_DIR, "rollup_4_complet_hires.png")
chrome_screenshot(html_src, out_hires, 850, 2000, scale=4.0, timeout=600, max_px=900)

im_hires = Image.open(out_hires)
print(f"  Dimensions: {im_hires.width}x{im_hires.height} px")

# ── 3. Upscale to 300 DPI (10039x23622) via PIL ───────
print("\n=== [3] Upscale to 300 DPI (10039x23622) ===")
out_300 = os.path.join(ROLLUP_DIR, "rollup_4_complet_300dpi.png")
TARGET_W, TARGET_H = 10039, 23622
print(f"  Resizing {im_hires.width}x{im_hires.height} -> {TARGET_W}x{TARGET_H} (LANCZOS)...")
im_300 = im_hires.resize((TARGET_W, TARGET_H), Image.LANCZOS)
im_300.save(out_300, dpi=(300, 300), optimize=False)
sz_300 = os.path.getsize(out_300)
print(f"  Saved: {sz_300:,} bytes ({sz_300//1024//1024} MB)")
print(f"  DPI metadata: 300 x 300")
print(f"  Physical size @ 300 DPI: {TARGET_W/300*2.54:.1f}cm x {TARGET_H/300*2.54:.1f}cm")

print("\n=== DONE ===")
print(f"  Preview:  {os.path.basename(out_preview)}")
print(f"  Hi-res:   {os.path.basename(out_hires)}")
print(f"  300 DPI:  {os.path.basename(out_300)}")
