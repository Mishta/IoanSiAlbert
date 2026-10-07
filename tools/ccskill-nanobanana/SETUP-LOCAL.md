# Setup local (ce NU e in git)

Din acest folder lipsesc, intentionat, `venv/` si `.env` (ambele sunt in `.gitignore`).

```powershell
cd tools\ccskill-nanobanana
python -m venv venv
.\venv\Scripts\pip install -r requirements.txt
$key = (Get-Content ..\..\secrets\gemini-api-key-nanobanana -Raw).Trim()
Set-Content .env -Value "GEMINI_API_KEY=$key" -Encoding ascii
```

Cheia sta in `secrets/gemini-api-key-nanobanana` (vezi `secrets/README.md`). Nu o comite.
