# P.O.L.A.R.I.S. — Date Științifice Canonice

Proiect ONCS 2026 | Echipa Polaris Bears
Mentor: Prof. Francisc Dionisie Aaron
Elevi: Chelaru Ioan Cristian & Olariu David Albert, clasa a VIII-a

---

## Arhitectura sistemului (5 niveluri)

| Nivel | Componentă | Distanță față de Soare | Detalii tehnice |
|---|---|---|---|
| 1 — Solar | Dyson Ring (30 oglinzi) | ~7 milioane km (orbita interioară) | Ø 1 km/oglindă, reflectivitate 90%; între Soare și colectori; reflectă lumina ÎNAFARĂ spre colectori |
| 2 — Colectori | 4 sateliți colectori | ~10 milioane km (orbita exterioară) | Eficiență lumină→laser 43%; primesc lumina reflectată de oglinzi pe fața interioară (spre Soare) |
| 3 — Relay | 2 noduri L4/L5 | ~150 milioane km (1 UA) | L4→Pol Nord, L5→Pol Sud |
| 4 — Polar | 2 centrale polare flotante | 30 km altitudine | Baloane heliu, ≤4 tone/centrală |
| 5 — Ground | Cabluri YBCO supraconductoare | 0–30 km | 800 GW/cablu, ~7 tone, 30 km lungime |

---

## Fluxul energetic complet — Numere canonice

| Pas | Mărime | Valoare |
|---|---|---|
| Input | Constanta solară la 1 UA | I_Earth = 1361 W/m² |
| Pas 0 | Intensitate la 7M km de Soare | I_7M ≈ 6,22 × 10⁵ W/m² |
| Pas 1 | Arie totală Dyson Ring (30 × Aoglindă) | A_tot ≈ 2,36 × 10⁷ m² |
| Pas 1 | Putere solară incidentă pe oglinzi | P_incident ≈ 1,46 × 10¹³ W |
| Pas 1 | Putere reflectată (η=90%) | P_reflectată ≈ 1,32 × 10¹³ W |
| Pas 2 | Lumină per satelit colector (÷4) | P_lum/sat ≈ 3,30 × 10¹² W |
| Pas 3 | Laser per satelit (×43%) | P_laser/sat ≈ 1,42 × 10¹² W |
| Pas 3 | Laser total (4 sateliți) | P_laser,total ≈ 5,67 × 10¹² W |
| Pas 4 | Putere în L4 (2 sateliți) | P_L4 ≈ 2,83 × 10¹² W |
| Pas 4 | Putere în L5 (2 sateliți) | P_L5 ≈ 2,83 × 10¹² W |
| Pas 5 | Laser necesar/centrală pt. 800 GW (η=60%) | P_in,centr ≈ 1,33 × 10¹² W |
| Pas 5 | Utilizare din L4/L5 per centrală | ~47% |
| **OUTPUT** | **Putere electrică totală livrată** | **2 × 800 GW = 1,6 TW** |

---

## Statistica CHEIE pentru juriu

> **1,6 TW livrat continuu ≈ 48% din toată electricitatea consumată global**
> (consum global 2023: ~29.471 TWh/an = 3,36 TW medie continuă)

---

## Parametri tehnici critici

### Dyson Ring (orbita interioară — canonical)
- Distanță față de Soare: ~7 milioane km
- Poziție: orbita INTERIOARĂ — între Soare și sateliții colectori
- Nr. oglinzi: 30, grupate în 4 sectoare (la 12/3/6/9 pe elipsă)
- Diametru oglindă: 1 km → rază 500 m
- Arie oglindă: π × 500² ≈ 7,85 × 10⁵ m²
- Arie totală: 2,36 × 10⁷ m²
- Reflectivitate: 90%
- Reflectă lumina solară ÎNAFARĂ (outward) spre colectorii de pe orbita exterioară
- Fiecare sector (2 oglinzi în chevron/V) reflectă spre 1 satelit colector asignat

### Sateliți Colectori (orbita exterioară — canonical)
- Nr.: 4, la ~10 milioane km față de Soare
- Poziție: orbita EXTERIOARĂ față de Dyson Ring — dincolo de inelul de oglinzi
- Primesc lumina reflectată de oglinzi pe fața interioară (fața spre Soare/oglinzi)
- Emit laser verde din fața exterioară (fața spre L4/L5)
- Eficiență lumină→laser: 43%
- 2 sateliți → L4 (Polul Nord), 2 sateliți → L5 (Polul Sud)

### Noduri L4/L5
- Poziție: punctele Lagrange ale sistemului Soare-Pământ
- Distanță față de Pământ: ~1 UA (~150 milioane km, la 60° în orbita Pământului)
- L4 → Polul Nord | L5 → Polul Sud
- Randament conversie laser→electricitate: 60%
- Surplus energetic la L4/L5: ~53% disponibil pentru Star Power Grid
- **Captor laser — "Irisul"**: array de petale mecanice trapezoidale (18–24 petale) în jurul unui hub hexagonal central. Fiecare petalăeste o oglindă activă înclinată spre interior, care reflectă razele laser incidente spre hubul central — principiu identic cu telescopul Cassegrain cu oglinzi segmentate. Cele 2 raze verzi de intrare lovesc petale diferite ale irisului și sunt concentrate la un singur punct focal central intens.

### Centrale Polare
- Altitudine: 30 km (stratosfera superioară)
- Masă centrală: ≤4 tone
- Susținere: baloane cu heliu (principiul Arhimede: F_A = ρ_aer × V × g)
- Densitate aer la 30 km: mult mai mică decât la sol

### Cabluri YBCO
- Lungime: ~30 km (vertical, de la centrală la sol)
- Masă cablu: ~7 tone
- Masă totală (centrală + cablu): ≈11 tone / pol
- Capacitate: 800 GW per cablu
- Material: YBCO (supraconductor HTS, T_critica ≈ 93K / −180°C)
- Avantaj față de NbTi (CERN): funcționează cu azot lichid (77K), nu heliu lichid (4K) → sistem criogenic mult mai ușor
- Constrângere: densitatea de curent j = I/A ≤ j_c (densitate critică YBCO)

---

## Star Power Grid (extensie viitoare, 30–50 ani)

- Folosește surplusul energetic (~53%) din nodurile L4/L5
- Transmisie wireless prin microunde din orbita GEO
- Eficiență transmisie: 70–85%
- Capacitate: 100–500 GW total (20–50 centrale GEO de 5–20 GW fiecare)
- Țintă: zone izolate, slab electrificate, fără infrastructură terestră

---

## Legi fizice fundamentale utilizate

| Lege/Principiu | Formula | Aplicare |
|---|---|---|
| Legea inversului pătratului | I(r) = P / (4π·r²) | Intensitate solară la 7M km |
| Conservarea energiei | E_util = η × E_input | Toate etapele de conversie |
| Principiul Arhimede | F_A = ρ_aer × V × g | Flotabilitate baloane la 30 km |
| Supraconductivitate YBCO | j = I/A ≤ j_c | Dimensionare cablu |
| Transmisie putere | P = U × I | Curentul în cablul YBCO |

---

## Referințe bibliografice canonice (pentru credibilitate la juriu)

1. Dyson, F. J. — *Search for Artificial Stellar Sources of Infrared Radiation*, Science, 1960
2. NASA — *Solar Power Satellites and Orbital Energy Systems*, 2023
3. JAXA — Experiment de transmisie energie prin microunde la scară de kilowați
4. CERN — Magneți NbTi în LHC; cercetări YBCO pentru HTS
5. OpenStax Physics — Light and Electromagnetic Waves, cap. 16
6. ESA Educational Portal — Photovoltaic Experiments in Microgravity
7. Kardashev, N. S. — *Transmission of Information by Extraterrestrial Civilizations*, 1964

---

## Întrebări probabile din partea juriului de astrofizică

| Întrebare probabilă | Răspuns din proiect |
|---|---|
| De ce L4/L5 și nu orbita geostaționară? | L4/L5 sunt echilibre gravitaționale stabile, fără consum de combustibil pentru menținere |
| De ce YBCO și nu NbTi? | YBCO: T_critică 93K (azot lichid vs heliu lichid) → sistem criogenic mult mai ușor, ideal pentru o structură suspendată de baloane |
| Cât de realistă e susținerea la 30 km? | Principiul Arhimede aplicat la densitatea aerului la 30 km: fezabil fizic, dar necesită mega-baloane la limita tehnologiei actuale |
| Parker Solar Probe a ajuns la 6,1M km de Soare — oglinzile tale sunt la 7M km. Este posibil? | Da — Parker Solar Probe (2018) demonstrează fezabilitatea operării la aceste distanțe |
| Cât din energia globală ar furniza sistemul? | 1,6 TW ≈ 48% din consumul global de electricitate (3,36 TW în 2023) |
| Ce este Scala Kardashev? | Clasificarea civilizațiilor după consum energetic. Tip I: ~10¹⁶ W. Proiectul este un pas spre tranziția Tip I. |
