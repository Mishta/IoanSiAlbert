const fs = require('fs')
const path = require('path')

const src = path.resolve(__dirname, '../../assets')
const dst = path.resolve(__dirname, '../public/assets')

function copyDir(from, to) {
  if (!fs.existsSync(to)) fs.mkdirSync(to, { recursive: true })
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const s = path.join(from, entry.name)
    const d = path.join(to, entry.name)
    if (entry.isDirectory()) copyDir(s, d)
    else fs.copyFileSync(s, d)
  }
}

copyDir(src, dst)
console.log('Assets copied to website/public/assets/')
