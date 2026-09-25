# secrets/ — secretele proiectului POLARIS Bears-github

Conținutul acestui folder (cu excepția acestui README) este EXCLUS din git prin `.gitignore`
(`secrets/*` + `!secrets/README.md`). Nu se comite și nu se trimite nicăieri — nici pe GitHub.

Convenție (aceeași în toate proiectele din D:\Claude_Projects):
- `<nume>` — doar valoarea (fără comentarii), ca scripturile să o citească direct;
- `<nume>.md` — ce este, de unde provine, unde e folosit și cum se schimbă (rotire).
- Nume: litere mici, cu cratime, `<serviciu>-<ce-este>[-<cine-îl-folosește>]`.

## Secrete păstrate aici

| Fișier | Ce este |
|---|---|
| _(niciunul încă)_ | |

## Secrete păstrate în afara acestui folder

| Unde | Ce |
|---|---|
| _(de completat)_ | ex. `~/.claude.json` (servere MCP), `~/.ssh` (chei SSH — rămân acolo) |

Regulă: orice secret nou se adaugă aici (valoare + `.md`) și în tabelul de mai sus.
