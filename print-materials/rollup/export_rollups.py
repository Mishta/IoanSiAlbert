"""
Convertește imaginile din rollup HTML-uri în base64 inline,
apoi exportă PNG via Chrome headless.
"""
import base64
import os
import re
import subprocess
import tempfile
import shutil

CHROME = shutil.which("chrome") or shutil.which("google-chrome") or \
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"

ROLLUP_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(ROLLUP_DIR, "..", ".."))

ROLLUPS = [
    "rollup_1_viziunea",
    "rollup_2_tehnologia",
    "rollup_3_impactul",
]

MIME = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
}

def inline_images(html_content, html_dir):
    def replace_src(match):
        attr = match.group(1)  # src or href
        quote = match.group(2)
        path = match.group(3)

        # Only process relative paths (not data: or http:)
        if path.startswith("data:") or path.startswith("http"):
            return match.group(0)

        # Resolve path relative to html_dir
        abs_path = os.path.normpath(os.path.join(html_dir, path))
        if not os.path.exists(abs_path):
            print(f"  [WARN] Not found: {abs_path}")
            return match.group(0)

        ext = os.path.splitext(abs_path)[1].lower()
        mime = MIME.get(ext, "application/octet-stream")

        with open(abs_path, "rb") as f:
            b64 = base64.b64encode(f.read()).decode("ascii")

        print(f"  [OK] Inlined {os.path.basename(abs_path)} ({ext})")
        return f'{attr}={quote}data:{mime};base64,{b64}{quote}'

    # Match src="..." or src='...'
    pattern = re.compile(r'(src|href)=(["\'])([^"\']+)\2')
    return pattern.sub(replace_src, html_content)

def inline_css_urls(html_content, html_dir):
    """Also inline url(...) in <style> blocks for background-image etc."""
    def replace_url(match):
        quote = match.group(1)
        path = match.group(2)
        if path.startswith("data:") or path.startswith("http"):
            return match.group(0)
        abs_path = os.path.normpath(os.path.join(html_dir, path))
        if not os.path.exists(abs_path):
            return match.group(0)
        ext = os.path.splitext(abs_path)[1].lower()
        mime = MIME.get(ext, "application/octet-stream")
        with open(abs_path, "rb") as f:
            b64 = base64.b64encode(f.read()).decode("ascii")
        print(f"  [OK] Inlined CSS url: {os.path.basename(abs_path)}")
        return f"url({quote}data:{mime};base64,{b64}{quote})"

    pattern = re.compile(r"url\((['\"]?)([^'\")\s]+)\1\)")
    return pattern.sub(replace_url, html_content)

def export_rollup(name):
    html_path = os.path.join(ROLLUP_DIR, f"{name}.html")
    out_png = os.path.join(ROLLUP_DIR, f"{name}.png")

    print(f"\n=== Processing {name} ===")

    with open(html_path, "r", encoding="utf-8") as f:
        html = f.read()

    html_dir = os.path.dirname(html_path)
    html = inline_images(html, html_dir)
    html = inline_css_urls(html, html_dir)

    # Write to temp file
    tmp = tempfile.NamedTemporaryFile(
        suffix=".html", delete=False, mode="w", encoding="utf-8"
    )
    tmp.write(html)
    tmp.close()
    tmp_path = tmp.name
    print(f"  Temp file: {tmp_path}")

    # Chrome headless export
    cmd = [
        CHROME,
        "--headless=new",
        "--disable-gpu",
        f"--screenshot={out_png}",
        "--window-size=850,2000",
        "--hide-scrollbars",
        "--no-sandbox",
        "--run-all-compositor-stages-before-draw",
        "--virtual-time-budget=5000",
        f"file:///{tmp_path.replace(os.sep, '/')}",
    ]
    print(f"  Running Chrome...")
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=180)
        if result.returncode != 0:
            print(f"  [ERROR] Chrome exit {result.returncode}: {result.stderr[:500]}")
        else:
            size = os.path.getsize(out_png)
            print(f"  [OK] {out_png} — {size:,} bytes")
    finally:
        os.unlink(tmp_path)

if __name__ == "__main__":
    for rollup in ROLLUPS:
        export_rollup(rollup)
    print("\nDone.")
