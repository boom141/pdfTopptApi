import { unlinkSync, readFileSync } from 'fs'
import { imagekit } from './imageKit.service'
import { getDocument, OPS } from 'pdfjs-dist';
import sharp from 'sharp'
import Path from 'node:path';

const uploadImage = async (imageBuffers: any, name: string) => {
  return await imagekit.upload({
    file: imageBuffers,
    fileName: name
  })
}

export const exportImages = async (src: any, dst: string, filter = []) => {
  const doc = await getDocument(src).promise
  const pageCount = doc._pdfInfo.numPages
  const images = []
  for (let p = 1; p <= pageCount; p++) {
    const page = await doc.getPage(p)
    const ops = await page.getOperatorList()

    const perPageImages: any[] = []
    for (let i = 0; i < ops.fnArray.length; i++) {
      try {
        if (
          ops.fnArray[i] === OPS.paintImageXObject ||
          ops.fnArray[i] === OPS.paintInlineImageXObject
        ) {
          const name = ops.argsArray[i][0]
          const common = await page.commonObjs.has(name)
          const img = await (common
            ? page.commonObjs.get(name)
            : page.objs.get(name)
          )
          const { width, height } = img
          const bytes = img.data.length
          const channels = bytes / width / height
          if (!(channels === 1 || channels === 2 || channels === 3 || channels === 4)) {
            throw new Error(`Invalid image channel: ${channels} for image ${name} on page ${page}`)
          }

          const file = Path.join(dst, `${name}.png`)
          await sharp(img.data, {
            raw: { width, height, channels }
          }).toFile(file)

          const imageBuffer = readFileSync(file);
          unlinkSync(file);

          const filename = `${name}.png`;

          perPageImages.push(await uploadImage(imageBuffer, filename));
        }
      } catch (error) {
        return error
      }
    }
    images.push({ page: page._pageIndex + 1, images: perPageImages })
  }
  return images
}
