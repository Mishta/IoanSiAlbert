const fs = require('fs')
const path = require('path')

const repoRoot = path.resolve(__dirname, '../..')

function copyDir(from, to) {
  if (!fs.existsSync(to)) fs.mkdirSync(to, { recursive: true })
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const s = path.join(from, entry.name)
    const d = path.join(to, entry.name)
    if (entry.isDirectory()) copyDir(s, d)
    else fs.copyFileSync(s, d)
  }
}

// assets/ → public/assets/
copyDir(
  path.join(repoRoot, 'assets'),
  path.resolve(__dirname, '../public/assets')
)
console.log('✓ assets/ copied')

// images/generated/ → public/images/generated/  (skip /old subfolder — too large)
const imgSrc = path.join(repoRoot, 'images', 'generated')
const imgDst = path.resolve(__dirname, '../public/images/generated')
if (!fs.existsSync(imgDst)) fs.mkdirSync(imgDst, { recursive: true })
for (const entry of fs.readdirSync(imgSrc, { withFileTypes: true })) {
  if (entry.name === 'old') continue
  if (entry.isDirectory()) continue
  fs.copyFileSync(path.join(imgSrc, entry.name), path.join(imgDst, entry.name))
}
console.log('✓ images/generated/ copied (excl. old/)')

// images/generated/desk-display/ → public/images/generated/desk-display/
copyDir(
  path.join(imgSrc, 'desk-display'),
  path.join(imgDst, 'desk-display')
)
console.log('✓ images/generated/desk-display/ copied')
