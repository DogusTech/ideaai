const fs = require('fs')
const path = require('path')
const { Jimp } = require('jimp')

const root = path.resolve(__dirname, '..')
const source = path.join(root, 'public', 'icon.png')
const build = path.join(root, 'build')
const appx = path.join(build, 'appx')

function writePngIco(png, destination) {
  // ICO files may contain PNG payloads. This keeps the source mark lossless.
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(1, 4)
  const entry = Buffer.alloc(16)
  entry[0] = 0
  entry[1] = 0
  entry[2] = 0
  entry[3] = 0
  entry.writeUInt16LE(1, 4)
  entry.writeUInt16LE(32, 6)
  entry.writeUInt32LE(png.length, 8)
  entry.writeUInt32LE(22, 12)
  fs.writeFileSync(destination, Buffer.concat([header, entry, png]))
}

async function main() {
  if (!fs.existsSync(source)) throw new Error(`Missing source icon: ${source}`)
  fs.mkdirSync(appx, { recursive: true })
  const sourcePng = fs.readFileSync(source)
  fs.copyFileSync(source, path.join(build, 'icon.png'))
  writePngIco(sourcePng, path.join(build, 'icon.ico'))
  writePngIco(sourcePng, path.join(root, 'public', 'favicon.ico'))

  const image = await Jimp.read(source)
  const squares = [
    ['StoreLogo.png', 50],
    ['Square44x44Logo.png', 44],
    ['Square150x150Logo.png', 150],
    ['Square310x310Logo.png', 310],
  ]
  for (const [name, size] of squares) {
    const resized = image.clone().resize({ w: size, h: size })
    await resized.write(path.join(appx, name))
  }
  const wide = new Jimp({ width: 310, height: 150, color: 0x00000000 })
  wide.composite(image.clone().resize({ w: 150, h: 150 }), 80, 0)
  await wide.write(path.join(appx, 'Wide310x150Logo.png'))
  console.log(`Synced Turaen icons from ${path.relative(root, source)}`)
}

main().catch((error) => {
  console.error(error.stack || error.message)
  process.exitCode = 1
})
