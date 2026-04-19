#!/usr/bin/env python3
"""
Concateneaza CLIP 1 + CLIP 3 intr-un singur video pentru slide-ul de prezentare.
Output: videos/generated/CLIP_POLARIS_Sequence.mp4

Run: py -3.14 concat_clips.py
"""
import os
import subprocess
import tempfile
import shutil

FFMPEG = shutil.which("ffmpeg") or (
    r"C:\Users\mihai\AppData\Local\Microsoft\WinGet\Packages"
    r"\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe"
    r"\ffmpeg-8.1-full_build\bin\ffmpeg.exe"
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
VIDEOS_DIR = os.path.join(BASE_DIR, "videos", "generated")

CLIPS = [
    "CLIP 1 - Deployment.mp4",
    "CLIP 3 - Activare (complet revizuit).mp4",
]
OUTPUT = os.path.join(VIDEOS_DIR, "CLIP_POLARIS_Sequence.mp4")


def main():
    # Verify input files
    for clip in CLIPS:
        path = os.path.join(VIDEOS_DIR, clip)
        if not os.path.exists(path):
            print(f"EROARE: Fisier lipsa: {path}")
            return

    # Write concat list file
    with tempfile.NamedTemporaryFile(mode="w", suffix=".txt",
                                     delete=False, encoding="utf-8") as f:
        for clip in CLIPS:
            path = os.path.join(VIDEOS_DIR, clip).replace("\\", "/")
            f.write(f"file '{path}'\n")
        list_path = f.name

    print("Clips de concatenat:")
    for clip in CLIPS:
        size = os.path.getsize(os.path.join(VIDEOS_DIR, clip)) / 1024 / 1024
        print(f"  {clip}  ({size:.1f} MB)")

    print(f"\nOutput: CLIP_POLARIS_Sequence.mp4")
    print("Procesare ffmpeg...")

    cmd = [
        FFMPEG, "-y",
        "-f", "concat",
        "-safe", "0",
        "-i", list_path,
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "18",
        "-c:a", "aac",
        "-b:a", "192k",
        "-movflags", "+faststart",
        OUTPUT,
    ]

    result = subprocess.run(cmd, capture_output=True, text=True)
    os.unlink(list_path)

    if result.returncode == 0:
        size = os.path.getsize(OUTPUT) / 1024 / 1024
        print(f"Gata! {size:.1f} MB -> {OUTPUT}")
    else:
        print("EROARE ffmpeg:")
        print(result.stderr[-2000:])


if __name__ == "__main__":
    main()
