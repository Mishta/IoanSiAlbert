'use client'
import { useEffect, useRef } from 'react'
import styles from './DiagramZoom.module.css'

const NODE_X = [75, 231, 387, 543, 700, 856, 1012, 1168, 1324]
const SVG_W  = 1400
const ZOOM   = 2.4

const CONNECTORS = [
  { group: 'dz-conn-12', lines: ['dz-line-12'],                  length: 72 },
  { group: 'dz-conn-23', lines: ['dz-line-23'],                  length: 72 },
  { group: 'dz-conn-34', lines: ['dz-line-34'],                  length: 72 },
  { group: 'dz-conn-45', lines: ['dz-line-45'],                  length: 73 },
  { group: 'dz-conn-56', lines: ['dz-line-56a', 'dz-line-56b'], length: 72 },
  { group: 'dz-conn-67', lines: ['dz-line-67a', 'dz-line-67b'], length: 72 },
  { group: 'dz-conn-78', lines: ['dz-line-78'],                  length: 72 },
  { group: 'dz-conn-89', lines: ['dz-line-89'],                  length: 72 },
]

const SVG_MARKUP = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 680" style="width:100%;height:auto;display:block">
<defs>
  <linearGradient id="dz-bg" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%"   stop-color="#070b14"/>
    <stop offset="50%"  stop-color="#0d1b2e"/>
    <stop offset="100%" stop-color="#070b14"/>
  </linearGradient>
  <radialGradient id="dz-n1" cx="50%" cy="35%" r="55%"><stop offset="0%" stop-color="#ffdd44"/><stop offset="100%" stop-color="#e65100"/></radialGradient>
  <radialGradient id="dz-n2" cx="50%" cy="35%" r="55%"><stop offset="0%" stop-color="#ffa040"/><stop offset="100%" stop-color="#8a4000"/></radialGradient>
  <radialGradient id="dz-n3" cx="50%" cy="35%" r="55%"><stop offset="0%" stop-color="#ffd740"/><stop offset="100%" stop-color="#b8860b"/></radialGradient>
  <radialGradient id="dz-n4" cx="50%" cy="35%" r="55%"><stop offset="0%" stop-color="#80d8ff"/><stop offset="100%" stop-color="#0277bd"/></radialGradient>
  <radialGradient id="dz-n5" cx="50%" cy="35%" r="55%"><stop offset="0%" stop-color="#00e5ff"/><stop offset="100%" stop-color="#006064"/></radialGradient>
  <radialGradient id="dz-n6" cx="50%" cy="35%" r="55%"><stop offset="0%" stop-color="#ce93d8"/><stop offset="100%" stop-color="#4a148c"/></radialGradient>
  <radialGradient id="dz-n7" cx="50%" cy="35%" r="55%"><stop offset="0%" stop-color="#4fc3f7"/><stop offset="100%" stop-color="#01579b"/></radialGradient>
  <radialGradient id="dz-n8" cx="50%" cy="35%" r="55%"><stop offset="0%" stop-color="#69f0ae"/><stop offset="100%" stop-color="#1b5e20"/></radialGradient>
  <radialGradient id="dz-n9" cx="50%" cy="35%" r="55%"><stop offset="0%" stop-color="#ffe066"/><stop offset="100%" stop-color="#1a3050"/></radialGradient>
  <filter id="dz-g3" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="dz-g6" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="dz-g10" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="10" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <marker id="dz-arw"  markerWidth="9" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 9 3, 0 6" fill="#4fc3f7" opacity="0.75"/></marker>
  <marker id="dz-arwL" markerWidth="9" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 9 3, 0 6" fill="#00e5ff" opacity="0.85"/></marker>
  <marker id="dz-arwG" markerWidth="9" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 9 3, 0 6" fill="#69f0ae" opacity="0.85"/></marker>
</defs>

<rect width="1400" height="680" fill="url(#dz-bg)"/>

<g id="dz-bg-layer">
  <g stroke="#4fc3f7" stroke-width="0.25" opacity="0.06">
    <line x1="0" y1="115" x2="1400" y2="115"/><line x1="0" y1="230" x2="1400" y2="230"/>
    <line x1="0" y1="345" x2="1400" y2="345"/><line x1="0" y1="460" x2="1400" y2="460"/>
    <line x1="0" y1="575" x2="1400" y2="575"/>
    <line x1="155" y1="0" x2="155" y2="680"/><line x1="311" y1="0" x2="311" y2="680"/>
    <line x1="467" y1="0" x2="467" y2="680"/><line x1="622" y1="0" x2="622" y2="680"/>
    <line x1="778" y1="0" x2="778" y2="680"/><line x1="933" y1="0" x2="933" y2="680"/>
    <line x1="1089" y1="0" x2="1089" y2="680"/><line x1="1244" y1="0" x2="1244" y2="680"/>
  </g>
  <g fill="white" opacity="0.6">
    <circle cx="28" cy="22" r="0.9"/><circle cx="110" cy="55" r="0.7"/><circle cx="200" cy="18" r="1"/>
    <circle cx="1200" cy="25" r="0.8"/><circle cx="1310" cy="60" r="1.1"/><circle cx="1380" cy="20" r="0.8"/>
    <circle cx="40" cy="640" r="0.9"/><circle cx="1360" cy="630" r="1"/><circle cx="700" cy="15" r="0.8"/><circle cx="700" cy="660" r="0.7"/>
  </g>
  <text x="700" y="40" font-family="'Courier New',monospace" font-size="21" font-weight="bold" fill="#c9a84c" text-anchor="middle" letter-spacing="4">LANȚ ENERGETIC P.O.L.A.R.I.S.</text>
  <text x="700" y="58" font-family="'Courier New',monospace" font-size="9.5" fill="#4fc3f7" text-anchor="middle" letter-spacing="1" opacity="0.8">Solar · Oglinzi · Captare · Conversie · LASER · L4/L5 · Transmisie · Recepție · Star Power Grid</text>
  <line x1="120" y1="67" x2="1280" y2="67" stroke="#4fc3f7" stroke-width="0.5" opacity="0.3"/>
  <rect x="75" y="80" width="1250" height="5" fill="#0a1628" rx="2"/>
  <rect x="75"   y="80" width="225" height="5" fill="#ff9a3c" rx="2" opacity="0.75"/>
  <rect x="300"  y="80" width="150" height="5" fill="#ffa040" opacity="0.7"/>
  <rect x="450"  y="80" width="150" height="5" fill="#c9a84c" opacity="0.7"/>
  <rect x="600"  y="80" width="125" height="5" fill="#4fc3f7" opacity="0.7"/>
  <rect x="725"  y="80" width="125" height="5" fill="#00e5ff" opacity="0.7"/>
  <rect x="850"  y="80" width="110" height="5" fill="#ce93d8" opacity="0.65"/>
  <rect x="960"  y="80" width="105" height="5" fill="#4fc3f7" opacity="0.7"/>
  <rect x="1065" y="80" width="100" height="5" fill="#69f0ae" opacity="0.7"/>
  <rect x="1165" y="80" width="160" height="5" fill="#ffe066" opacity="0.75"/>
  <text x="700" y="97" font-family="'Courier New',monospace" font-size="7.5" fill="#4fc3f7" text-anchor="middle" opacity="0.45" letter-spacing="1">pierderi energetice cumulate  →</text>
  <line x1="75" y1="410" x2="1370" y2="410" stroke="#4fc3f7" stroke-width="0.4" opacity="0.2"/>
  <g font-family="'Courier New',monospace" font-size="8" text-anchor="middle">
    <text x="75"   y="428" fill="#ff9a3c">1361 W/m²</text><text x="231"  y="428" fill="#ffa040">η ≈ 90%</text>
    <text x="387"  y="428" fill="#c9a84c">η ≈ 45%</text><text x="543"  y="428" fill="#4fc3f7">η ≈ 60%</text>
    <text x="700"  y="428" fill="#00e5ff">—</text><text x="856"  y="428" fill="#ce93d8">relay</text>
    <text x="1012" y="428" fill="#4fc3f7">η ≈ 90%</text><text x="1168" y="428" fill="#69f0ae">η ≈ 85%</text>
    <text x="1324" y="428" fill="#ffe066" font-weight="bold">~20%</text>
    <text x="75"   y="441" fill="#ff9a3c" opacity="0.6">input</text><text x="231"  y="441" fill="#ffa040" opacity="0.6">oglinzi</text>
    <text x="387"  y="441" fill="#c9a84c" opacity="0.6">GaAs PV</text><text x="543"  y="441" fill="#4fc3f7" opacity="0.6">laser</text>
    <text x="700"  y="441" fill="#00e5ff" opacity="0.6">emisie</text><text x="856"  y="441" fill="#ce93d8" opacity="0.6">L4/L5</text>
    <text x="1012" y="441" fill="#4fc3f7" opacity="0.6">atmosferă</text><text x="1168" y="441" fill="#69f0ae" opacity="0.6">rectenna</text>
    <text x="1324" y="441" fill="#ffe066" opacity="0.6">global</text>
  </g>
  <rect x="420" y="468" width="560" height="44" rx="5" fill="#0a1628" stroke="#c9a84c" stroke-width="0.8" opacity="0.9"/>
  <text x="700" y="486" font-family="'Courier New',monospace" font-size="9.5" fill="#c9a84c" text-anchor="middle">EFICIENȚĂ GLOBALĂ SISTEM</text>
  <text x="700" y="503" font-family="'Courier New',monospace" font-size="8.5" fill="#4fc3f7" text-anchor="middle" opacity="0.85">0.90 × 0.45 × 0.60 × 0.90 × 0.85 ≈ 18–20%  ·  captare 24/7  ·  fără intermitențe meteorologice</text>
  <rect x="755" y="530" width="290" height="32" rx="4" fill="#0a0818" stroke="#ce93d8" stroke-width="0.7" opacity="0.85"/>
  <text x="900" y="546" font-family="'Courier New',monospace" font-size="8" fill="#ce93d8" text-anchor="middle">LAGRANGE L4/L5: puncte de echilibru gravitațional</text>
  <text x="900" y="558" font-family="'Courier New',monospace" font-size="7.5" fill="#9c6aad" text-anchor="middle" opacity="0.8">Soare–Pământ · stabilitate pe termen lung fără propulsie</text>
  <rect x="1070" y="530" width="310" height="32" rx="4" fill="#0a1a08" stroke="#69f0ae" stroke-width="0.7" opacity="0.85"/>
  <text x="1225" y="546" font-family="'Courier New',monospace" font-size="8" fill="#69f0ae" text-anchor="middle">STAR POWER GRID: extensie terestră P.O.L.A.R.I.S.</text>
  <text x="1225" y="558" font-family="'Courier New',monospace" font-size="7.5" fill="#4fc3f7" text-anchor="middle" opacity="0.8">distribuție radiantă de la Pol Nord + Pol Sud · HVDC YBCO</text>
  <line x1="200" y1="648" x2="1200" y2="648" stroke="#c9a84c" stroke-width="0.4" opacity="0.22"/>
  <text x="700" y="660" font-family="'Courier New',monospace" font-size="9.5" fill="#c9a84c" text-anchor="middle" opacity="0.5" letter-spacing="2">POLARIS BEARS · ONCS 2026 · Inovăm prezentul. Alimentăm viitorul!</text>
</g>

<g id="dz-conn-12">
  <line id="dz-line-12" x1="117" y1="290" x2="189" y2="290" stroke="#ffa040" stroke-width="1.8" stroke-dasharray="72" stroke-dashoffset="0" marker-end="url(#dz-arw)" opacity="0.7"/>
  <text x="153" y="280" font-family="'Courier New',monospace" font-size="7" fill="#ffa040" text-anchor="middle" opacity="0.65">fotoni concentrați</text>
</g>
<g id="dz-conn-23">
  <line id="dz-line-23" x1="273" y1="290" x2="345" y2="290" stroke="#c9a84c" stroke-width="1.8" stroke-dasharray="72" stroke-dashoffset="0" marker-end="url(#dz-arw)" opacity="0.7"/>
  <text x="309" y="280" font-family="'Courier New',monospace" font-size="7" fill="#c9a84c" text-anchor="middle" opacity="0.65">flux IR/VIS</text>
</g>
<g id="dz-conn-34">
  <line id="dz-line-34" x1="429" y1="290" x2="501" y2="290" stroke="#4fc3f7" stroke-width="1.8" stroke-dasharray="72" stroke-dashoffset="0" marker-end="url(#dz-arw)" opacity="0.7"/>
  <text x="465" y="280" font-family="'Courier New',monospace" font-size="7" fill="#4fc3f7" text-anchor="middle" opacity="0.65">curent DC</text>
</g>
<g id="dz-conn-45">
  <line id="dz-line-45" x1="585" y1="290" x2="658" y2="290" stroke="#00e5ff" stroke-width="2" stroke-dasharray="73" stroke-dashoffset="0" marker-end="url(#dz-arwL)" opacity="0.75"/>
  <text x="622" y="280" font-family="'Courier New',monospace" font-size="7" fill="#00e5ff" text-anchor="middle" opacity="0.7">DC → LASER</text>
</g>
<g id="dz-conn-56">
  <line id="dz-line-56a" x1="742" y1="290" x2="814" y2="290" stroke="#00e5ff" stroke-width="3" stroke-dasharray="72" stroke-dashoffset="0" marker-end="url(#dz-arwL)" opacity="0.8" filter="url(#dz-g3)"/>
  <line id="dz-line-56b" x1="742" y1="290" x2="814" y2="290" stroke="white" stroke-width="0.8" stroke-dasharray="72" stroke-dashoffset="0" opacity="0.6"/>
  <text x="778" y="280" font-family="'Courier New',monospace" font-size="7" fill="#00e5ff" text-anchor="middle" opacity="0.8">LASER 1064nm</text>
</g>
<g id="dz-conn-67">
  <line id="dz-line-67a" x1="898" y1="290" x2="970" y2="290" stroke="#4fc3f7" stroke-width="2.5" stroke-dasharray="72" stroke-dashoffset="0" marker-end="url(#dz-arwL)" opacity="0.75" filter="url(#dz-g3)"/>
  <line id="dz-line-67b" x1="898" y1="290" x2="970" y2="290" stroke="white" stroke-width="0.6" stroke-dasharray="72" stroke-dashoffset="0" opacity="0.5"/>
  <text x="934" y="280" font-family="'Courier New',monospace" font-size="7" fill="#4fc3f7" text-anchor="middle" opacity="0.75">fascicul stabil</text>
</g>
<g id="dz-conn-78">
  <line id="dz-line-78" x1="1054" y1="290" x2="1126" y2="290" stroke="#69f0ae" stroke-width="1.8" stroke-dasharray="72" stroke-dashoffset="0" marker-end="url(#dz-arwG)" opacity="0.7"/>
  <text x="1090" y="280" font-family="'Courier New',monospace" font-size="7" fill="#69f0ae" text-anchor="middle" opacity="0.65">recepționat</text>
</g>
<g id="dz-conn-89">
  <line id="dz-line-89" x1="1210" y1="290" x2="1282" y2="290" stroke="#ffe066" stroke-width="2" stroke-dasharray="72" stroke-dashoffset="0" marker-end="url(#dz-arw)" opacity="0.8"/>
  <text x="1246" y="280" font-family="'Courier New',monospace" font-size="7" fill="#ffe066" text-anchor="middle" opacity="0.75">cablu YBCO</text>
</g>

<g id="dz-node-1" transform="translate(75,290)">
  <circle cx="0" cy="0" r="44" fill="#0a1628" stroke="#ff9a3c" stroke-width="1.4" opacity="0.95"/>
  <circle cx="0" cy="0" r="44" fill="url(#dz-n1)" opacity="0.12" filter="url(#dz-g10)"/>
  <circle cx="0" cy="0" r="20" fill="url(#dz-n1)" opacity="0.92" filter="url(#dz-g6)"/>
  <g stroke="#ffdd44" stroke-width="2" opacity="0.7">
    <line x1="0" y1="-27" x2="0" y2="-34"/><line x1="0" y1="27" x2="0" y2="34"/>
    <line x1="-27" y1="0" x2="-34" y2="0"/><line x1="27" y1="0" x2="34" y2="0"/>
    <line x1="-19" y1="-19" x2="-24" y2="-24"/><line x1="19" y1="-19" x2="24" y2="-24"/>
    <line x1="-19" y1="19" x2="-24" y2="24"/><line x1="19" y1="19" x2="24" y2="24"/>
  </g>
  <text x="0" y="60" font-family="'Courier New',monospace" font-size="9.5" font-weight="bold" fill="#ff9a3c" text-anchor="middle">SURSĂ SOLARĂ</text>
  <text x="0" y="73" font-family="'Courier New',monospace" font-size="8" fill="#ff9a3c" text-anchor="middle" opacity="0.8">1361 W/m²</text>
  <text x="0" y="85" font-family="'Courier New',monospace" font-size="7" fill="#4fc3f7" text-anchor="middle" opacity="0.55">constanta solară</text>
  <text x="0" y="-55" font-family="'Courier New',monospace" font-size="8.5" fill="#ff9a3c" text-anchor="middle" opacity="0.5">01</text>
</g>

<g id="dz-node-2" transform="translate(231,290)">
  <circle cx="0" cy="0" r="44" fill="#0a1628" stroke="#ffa040" stroke-width="1.4" opacity="0.95"/>
  <circle cx="0" cy="0" r="44" fill="url(#dz-n2)" opacity="0.10" filter="url(#dz-g10)"/>
  <rect x="-5" y="-22" width="10" height="44" fill="#ffa040" opacity="0.75" rx="2" transform="rotate(-20,0,0)"/>
  <line x1="-36" y1="-12" x2="-8" y2="2" stroke="#ffdd44" stroke-width="2" opacity="0.8"/>
  <line x1="8" y1="2" x2="36" y2="18" stroke="#ffdd44" stroke-width="2" opacity="0.8" filter="url(#dz-g3)"/>
  <circle cx="0" cy="2" r="4" fill="white" opacity="0.85"/>
  <text x="0" y="60" font-family="'Courier New',monospace" font-size="9.5" font-weight="bold" fill="#ffa040" text-anchor="middle">OGLINZI SOLARE</text>
  <text x="0" y="73" font-family="'Courier New',monospace" font-size="8" fill="#ffa040" text-anchor="middle" opacity="0.8">30 oglinzi · Ø1km</text>
  <text x="0" y="85" font-family="'Courier New',monospace" font-size="7" fill="#4fc3f7" text-anchor="middle" opacity="0.55">la 7 mln km · η≈90%</text>
  <text x="0" y="-55" font-family="'Courier New',monospace" font-size="8.5" fill="#ffa040" text-anchor="middle" opacity="0.5">02</text>
</g>

<g id="dz-node-3" transform="translate(387,290)">
  <circle cx="0" cy="0" r="44" fill="#0a1628" stroke="#c9a84c" stroke-width="1.4" opacity="0.95"/>
  <circle cx="0" cy="0" r="44" fill="url(#dz-n3)" opacity="0.10" filter="url(#dz-g10)"/>
  <rect x="-12" y="-9" width="24" height="18" fill="#c9a84c" opacity="0.85" rx="3"/>
  <rect x="-32" y="-6" width="18" height="12" fill="#1565c0" opacity="0.9" rx="2"/>
  <rect x="14"  y="-6" width="18" height="12" fill="#1565c0" opacity="0.9" rx="2"/>
  <circle cx="0" cy="0" r="4.5" fill="white" opacity="0.9"/>
  <text x="0" y="60" font-family="'Courier New',monospace" font-size="9.5" font-weight="bold" fill="#c9a84c" text-anchor="middle">CAPTARE ORBITALĂ</text>
  <text x="0" y="73" font-family="'Courier New',monospace" font-size="8" fill="#c9a84c" text-anchor="middle" opacity="0.8">panou GaAs · η≈45%</text>
  <text x="0" y="85" font-family="'Courier New',monospace" font-size="7" fill="#4fc3f7" text-anchor="middle" opacity="0.55">fără pierderi atmosferice</text>
  <text x="0" y="-55" font-family="'Courier New',monospace" font-size="8.5" fill="#c9a84c" text-anchor="middle" opacity="0.5">03</text>
</g>

<g id="dz-node-4" transform="translate(543,290)">
  <circle cx="0" cy="0" r="44" fill="#0a1628" stroke="#4fc3f7" stroke-width="1.4" opacity="0.95"/>
  <circle cx="0" cy="0" r="44" fill="url(#dz-n4)" opacity="0.10" filter="url(#dz-g10)"/>
  <polygon points="6,-22 -8,0 2,0 -6,22 8,0 -2,0" fill="#4fc3f7" opacity="0.9" filter="url(#dz-g3)"/>
  <circle cx="0" cy="0" r="20" fill="none" stroke="#00e5ff" stroke-width="1.5" opacity="0.5" stroke-dasharray="4,3"/>
  <text x="0" y="60" font-family="'Courier New',monospace" font-size="9.5" font-weight="bold" fill="#4fc3f7" text-anchor="middle">CONVERSIE</text>
  <text x="0" y="73" font-family="'Courier New',monospace" font-size="8" fill="#4fc3f7" text-anchor="middle" opacity="0.8">diodă laser · η≈60%</text>
  <text x="0" y="85" font-family="'Courier New',monospace" font-size="7" fill="#4fc3f7" text-anchor="middle" opacity="0.55">YBCO supraconductor</text>
  <text x="0" y="-55" font-family="'Courier New',monospace" font-size="8.5" fill="#4fc3f7" text-anchor="middle" opacity="0.5">04</text>
</g>

<g id="dz-node-5" transform="translate(700,290)">
  <circle cx="0" cy="0" r="44" fill="#0a1628" stroke="#00e5ff" stroke-width="1.8" opacity="0.95"/>
  <circle cx="0" cy="0" r="44" fill="url(#dz-n5)" opacity="0.14" filter="url(#dz-g10)"/>
  <rect x="-18" y="-9" width="26" height="18" fill="#00b8d4" opacity="0.85" rx="4"/>
  <circle cx="12" cy="0" r="7" fill="#00e5ff" opacity="0.9" filter="url(#dz-g6)"/>
  <line x1="19" y1="0"  x2="40" y2="0"  stroke="#00e5ff" stroke-width="3" opacity="0.95" filter="url(#dz-g3)"/>
  <line x1="19" y1="-5" x2="40" y2="-8" stroke="#00e5ff" stroke-width="1.5" opacity="0.55"/>
  <line x1="19" y1="5"  x2="40" y2="8"  stroke="#00e5ff" stroke-width="1.5" opacity="0.55"/>
  <text x="0" y="60" font-family="'Courier New',monospace" font-size="9.5" font-weight="bold" fill="#00e5ff" text-anchor="middle">EMISIE LASER</text>
  <text x="0" y="73" font-family="'Courier New',monospace" font-size="8" fill="#00e5ff" text-anchor="middle" opacity="0.8">1064 nm · IR</text>
  <text x="0" y="85" font-family="'Courier New',monospace" font-size="7" fill="#4fc3f7" text-anchor="middle" opacity="0.55">divergență &lt;0.001°</text>
  <text x="0" y="-55" font-family="'Courier New',monospace" font-size="8.5" fill="#00e5ff" text-anchor="middle" opacity="0.5">05</text>
</g>

<g id="dz-node-6" transform="translate(856,290)">
  <circle cx="0" cy="0" r="44" fill="#0a1628" stroke="#ce93d8" stroke-width="1.8" opacity="0.95" stroke-dasharray="8,3"/>
  <circle cx="0" cy="0" r="44" fill="url(#dz-n6)" opacity="0.12" filter="url(#dz-g10)"/>
  <path d="M-30,-20 Q0,-38 30,-20" stroke="#ce93d8" stroke-width="1.5" fill="none" opacity="0.7"/>
  <path d="M-30, 20 Q0, 38 30, 20" stroke="#ce93d8" stroke-width="1.5" fill="none" opacity="0.7"/>
  <circle cx="0" cy="0" r="8" fill="#ce93d8" opacity="0.85" filter="url(#dz-g6)"/>
  <text x="0" y="4" font-family="'Courier New',monospace" font-size="8" font-weight="bold" fill="white" text-anchor="middle" opacity="0.95">L4/L5</text>
  <text x="0" y="60" font-family="'Courier New',monospace" font-size="9.5" font-weight="bold" fill="#ce93d8" text-anchor="middle">NODUS LAGRANGE</text>
  <text x="0" y="73" font-family="'Courier New',monospace" font-size="8" fill="#ce93d8" text-anchor="middle" opacity="0.8">L4 / L5 · relay orbital</text>
  <text x="0" y="85" font-family="'Courier New',monospace" font-size="7" fill="#4fc3f7" text-anchor="middle" opacity="0.55">stabilizare · corecție</text>
  <text x="0" y="-55" font-family="'Courier New',monospace" font-size="8.5" fill="#ce93d8" text-anchor="middle" opacity="0.5">06</text>
  <rect x="-22" y="-58" width="44" height="14" rx="3" fill="#4a148c" opacity="0.75"/>
  <text x="0" y="-48" font-family="'Courier New',monospace" font-size="7.5" fill="#ce93d8" text-anchor="middle" font-weight="bold">LAGRANGE</text>
</g>

<g id="dz-node-7" transform="translate(1012,290)">
  <circle cx="0" cy="0" r="44" fill="#0a1628" stroke="#4fc3f7" stroke-width="1.4" opacity="0.95"/>
  <circle cx="0" cy="0" r="44" fill="url(#dz-n7)" opacity="0.10" filter="url(#dz-g10)"/>
  <line x1="-38" y1="0" x2="38" y2="0" stroke="#00e5ff" stroke-width="3" opacity="0.85" filter="url(#dz-g3)"/>
  <path d="M-28,-14 Q0,-20 28,-14" stroke="#4fc3f7" stroke-width="1.2" fill="none" opacity="0.55"/>
  <path d="M-28,14 Q0,20 28,14"  stroke="#4fc3f7" stroke-width="1.2" fill="none" opacity="0.55"/>
  <path d="M-38,24 Q0,30 38,24" stroke="#1565c0" stroke-width="2" fill="none" opacity="0.7"/>
  <text x="0" y="60" font-family="'Courier New',monospace" font-size="9.5" font-weight="bold" fill="#4fc3f7" text-anchor="middle">TRANSMISIE</text>
  <text x="0" y="73" font-family="'Courier New',monospace" font-size="8" fill="#4fc3f7" text-anchor="middle" opacity="0.8">atmosferă · η≈90%</text>
  <text x="0" y="85" font-family="'Courier New',monospace" font-size="7" fill="#4fc3f7" text-anchor="middle" opacity="0.55">1064nm transparent</text>
  <text x="0" y="-55" font-family="'Courier New',monospace" font-size="8.5" fill="#4fc3f7" text-anchor="middle" opacity="0.5">07</text>
</g>

<g id="dz-node-8" transform="translate(1168,290)">
  <circle cx="0" cy="0" r="44" fill="#0a1628" stroke="#69f0ae" stroke-width="1.4" opacity="0.95"/>
  <circle cx="0" cy="0" r="44" fill="url(#dz-n8)" opacity="0.10" filter="url(#dz-g10)"/>
  <path d="M0,16 L0,-8 M-26,-6 Q0,-28 26,-6" stroke="#69f0ae" stroke-width="2.5" fill="none" opacity="0.9"/>
  <circle cx="0" cy="-6" r="5.5" fill="#69f0ae" opacity="0.85" filter="url(#dz-g3)"/>
  <rect x="-5" y="16" width="10" height="7" fill="#69f0ae" opacity="0.65" rx="1"/>
  <text x="0" y="60" font-family="'Courier New',monospace" font-size="9.5" font-weight="bold" fill="#69f0ae" text-anchor="middle">RECEPȚIE</text>
  <text x="0" y="73" font-family="'Courier New',monospace" font-size="8" fill="#69f0ae" text-anchor="middle" opacity="0.8">rectenna · η≈85%</text>
  <text x="0" y="85" font-family="'Courier New',monospace" font-size="7" fill="#4fc3f7" text-anchor="middle" opacity="0.55">laser → curent DC</text>
  <text x="0" y="-55" font-family="'Courier New',monospace" font-size="8.5" fill="#69f0ae" text-anchor="middle" opacity="0.5">08</text>
</g>

<g id="dz-node-9" transform="translate(1324,290)">
  <circle cx="0" cy="0" r="52" fill="#ffe066" opacity="0.04" filter="url(#dz-g10)"/>
  <circle cx="0" cy="0" r="46" fill="#0a1628" stroke="#ffe066" stroke-width="2" opacity="0.95"/>
  <circle cx="0" cy="0" r="46" fill="url(#dz-n9)" opacity="0.15" filter="url(#dz-g10)"/>
  <circle cx="0" cy="0" r="20" fill="none" stroke="#1565c0" stroke-width="1.5" opacity="0.7"/>
  <line x1="-20" y1="0" x2="20" y2="0" stroke="#4fc3f7" stroke-width="0.8" opacity="0.6"/>
  <line x1="0" y1="-20" x2="0"   y2="-42" stroke="#ffe066" stroke-width="1.5" opacity="0.8"/>
  <line x1="0" y1="20"  x2="0"   y2="42"  stroke="#4fc3f7" stroke-width="1.5" opacity="0.8"/>
  <line x1="20" y1="0"  x2="42"  y2="8"   stroke="#ffe066" stroke-width="1.2" opacity="0.65"/>
  <line x1="20" y1="0"  x2="42"  y2="-8"  stroke="#ffe066" stroke-width="1.2" opacity="0.65"/>
  <line x1="-20" y1="0" x2="-42" y2="8"   stroke="#4fc3f7" stroke-width="1.2" opacity="0.65"/>
  <line x1="-20" y1="0" x2="-42" y2="-8"  stroke="#4fc3f7" stroke-width="1.2" opacity="0.65"/>
  <circle cx="0"   cy="-42" r="3" fill="#ffe066" opacity="0.9"/>
  <circle cx="0"   cy="42"  r="3" fill="#4fc3f7" opacity="0.9"/>
  <circle cx="42"  cy="8"   r="2.5" fill="#ffe066" opacity="0.8"/>
  <circle cx="42"  cy="-8"  r="2.5" fill="#ffe066" opacity="0.8"/>
  <circle cx="-42" cy="8"   r="2.5" fill="#4fc3f7" opacity="0.8"/>
  <circle cx="-42" cy="-8"  r="2.5" fill="#4fc3f7" opacity="0.8"/>
  <text x="0" y="63" font-family="'Courier New',monospace" font-size="10" font-weight="bold" fill="#ffe066" text-anchor="middle">STAR POWER GRID</text>
  <text x="0" y="76" font-family="'Courier New',monospace" font-size="7.5" fill="#ffe066" text-anchor="middle" opacity="0.85">distribuție radiantă</text>
  <text x="0" y="88" font-family="'Courier New',monospace" font-size="7" fill="#4fc3f7" text-anchor="middle" opacity="0.6">poli → continente · HVDC</text>
  <text x="0" y="-58" font-family="'Courier New',monospace" font-size="8.5" fill="#ffe066" text-anchor="middle" opacity="0.5">09</text>
  <rect x="-28" y="-70" width="56" height="14" rx="3" fill="#1a3a0a" stroke="#69f0ae" stroke-width="0.8" opacity="0.9"/>
  <text x="0" y="-60" font-family="'Courier New',monospace" font-size="7.5" fill="#69f0ae" text-anchor="middle" font-weight="bold">1600 GW · GLOBAL</text>
</g>
</svg>`

export default function DiagramZoom() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const wrapRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap    = wrapRef.current
    const section = sectionRef.current
    if (!wrap || !section) return

    const setup = async () => {
      const mod = await import('gsap')
      const gsap = mod.gsap ?? mod.default
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const renderW = wrap.getBoundingClientRect().width
      const offsets = NODE_X.map(nx => renderW * ZOOM * (0.5 - nx / SVG_W))

      const bgLayer      = wrap.querySelector('#dz-bg-layer')
      const nodeEls      = NODE_X.map((_, i) => wrap.querySelector(`#dz-node-${i + 1}`))
      const connGroupEls = CONNECTORS.map(c => wrap.querySelector(`#${c.group}`))
      const connLineEls  = CONNECTORS.map(c =>
        c.lines.map(id => wrap.querySelector(`#${id}`)).filter(Boolean)
      )

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end:   'bottom bottom',
          scrub: 1.5,
        },
      })

      let t = 0

      // Phase 1: zoom in to node 1
      // Simultaneously: bg layer fades out, nodes 2-9 fade out, connectors fade out
      const nodes2to9  = nodeEls.slice(1).filter((n): n is Element => n !== null)
      const connGroups = connGroupEls.filter((g): g is Element => g !== null)

      tl.to(wrap,      { scale: ZOOM, x: offsets[0], duration: 1.2, ease: 'power2.inOut' }, t)
      tl.to(bgLayer,   { opacity: 0,                 duration: 0.8                        }, t)
      tl.to(nodes2to9, { opacity: 0,                 duration: 0.7                        }, t)
      tl.to(connGroups,{ opacity: 0,                 duration: 0.6                        }, t)
      t += 1.9  // 1.2s zoom + 0.7s pause at node 1

      // Phases 2–9: pan to each node, draw connector, reveal node
      for (let i = 1; i < NODE_X.length; i++) {
        const connGroupEl = connGroupEls[i - 1]
        const lineEls     = connLineEls[i - 1]
        const nodeEl      = nodeEls[i]
        const connLength  = CONNECTORS[i - 1].length

        // Make connector group visible, reset line to undrawable, then draw during pan
        tl.set(connGroupEl, { opacity: 1 }, t)
        lineEls.forEach(lineEl => {
          tl.set(lineEl, { attr: { 'stroke-dashoffset': connLength } }, t)
          tl.to(lineEl,  { attr: { 'stroke-dashoffset': 0 }, duration: 0.55, ease: 'power1.inOut' }, t)
        })
        tl.to(wrap, { x: offsets[i], duration: 0.6, ease: 'power1.inOut' }, t)
        // Node fades in near end of pan
        tl.to(nodeEl, { opacity: 1, duration: 0.3, ease: 'power2.out' }, t + 0.38)

        t += 1.3  // 0.6s pan + 0.7s pause
      }

      // Final: fade background back in, zoom out to overview
      tl.to(bgLayer, { opacity: 1, duration: 0.7 }, t)
      tl.to(wrap,    { scale: 1, x: 0, duration: 1.2, ease: 'power2.inOut' }, t + 0.2)
    }

    setup()
  }, [])

  return (
    <div ref={sectionRef} className={styles.section}>
      <div className={styles.sticky}>
        <p className={styles.label}>Lanțul energetic complet</p>
        <div
          ref={wrapRef}
          className={styles.svg}
          dangerouslySetInnerHTML={{ __html: SVG_MARKUP }}
        />
      </div>
    </div>
  )
}
