const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const repoRoot = path.resolve(__dirname, '../..')
const MAX_BYTES = 24 * 1024 * 1024 // 24MB — Cloudflare Pages limit is 25MB
const WEB_MAX_WIDTH = 1920          // max width for web delivery

function ensureSharp() {
  try { require.resolve('sharp') } catch {
    console.log('Installing sharp...')
    execSync('npm install sharp --no-save', { cwd: path.resolve(__dirname, '..'), stdio: 'inherit' })
  }
}

async function copyOrCompress(src, dst) {
  const stat = fs.statSync(src)
  const ext = path.extname(src).toLowerCase()
  if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
    const sharp = require('sharp')
    const dstJpeg = dst.replace(/\.(png|jpg|jpeg)$/i, '.jpg')
    await sharp(src)
      .resize(WEB_MAX_WIDTH, null, { withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(dstJpeg)
    const newStat = fs.statSync(dstJpeg)
    const savings = Math.round((1 - newStat.size / stat.size) * 100)
    console.log(`  ✓ ${Math.round(stat.size/1024)}KB → ${Math.round(newStat.size/1024)}KB (-${savings}%) ${path.basename(dstJpeg)}`)
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

  // videos/generated/ — copy only files <25MB (larger ones are on YouTube)
  const videoSrc = path.join(repoRoot, 'videos', 'generated')
  const videoDst = path.resolve(__dirname, '../public/videos')
  if (fs.existsSync(videoSrc)) {
    if (!fs.existsSync(videoDst)) fs.mkdirSync(videoDst, { recursive: true })
    for (const entry of fs.readdirSync(videoSrc, { withFileTypes: true })) {
      if (entry.isDirectory()) continue
      const s = path.join(videoSrc, entry.name)
      const stat = fs.statSync(s)
      if (stat.size > MAX_BYTES) {
        console.log(`  ⚠ skipped (>24MB, use YouTube): ${entry.name}`)
        continue
      }
      fs.copyFileSync(s, path.join(videoDst, entry.name))
    }
    console.log('✓ videos/ copied (excl. >24MB)')
  }
}

main().catch(err => { console.error(err); process.exit(1) })