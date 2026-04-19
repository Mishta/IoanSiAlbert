const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const repoRoot = path.resolve(__dirname, '../..')
const MAX_BYTES = 24 * 1024 * 1024 // 24MB — Cloudflare Pages limit is 25MB

function ensureSharp() {
  try { require.resolve('sharp') } catch {
    console.log('Installing sharp...')
    execSync('npm install sharp --no-save', { cwd: path.resolve(__dirname, '..'), stdio: 'inherit' })
  }
}

async function copyOrCompress(src, dst) {
  const stat = fs.statSync(src)
  const ext = path.extname(src).toLowerCase()
  if (stat.size > MAX_BYTES && (ext === '.png' || ext === '.jpg' || ext === '.jpeg')) {
    const sharp = require('sharp')
    const dstJpeg = dst.replace(/\.(png|jpg|jpeg)$/i, '.jpg')
    await sharp(src).jpeg({ quality: 82, mozjpeg: true }).toFile(dstJpeg)
    console.log(`  ✓ compressed → ${path.basename(dstJpeg)}`)
  } else {
    fs.copyFileSync(src, dst)
  }
}

async function copyDir(from, to) {
  if (!fs.existsSync(to)) fs.mkdirSync(to, { recursive: true })
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const s = path.join(from, entry.name)
    const d = path.join(to, entry.name)
    if (entry.isDirectory()) await copyDir(s, d)
    else await copyOrCompress(s, d)
  }
}

async function main() {
  ensureSharp()

  // assets/ → public/assets/
  await copyDir(
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
    await copyOrCompress(path.join(imgSrc, entry.name), path.join(imgDst, entry.name))
  }
  console.log('✓ images/generated/ copied (excl. old/)')

  // images/generated/desk-display/ → public/images/generated/desk-display/
  await copyDir(
    path.join(imgSrc, 'desk-display'),
    path.join(imgDst, 'desk-display')
  )
  console.log('✓ images/generated/desk-display/ copied')
}

main().catch(err => { console.error(err); process.exit(1) })