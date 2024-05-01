import 'dotenv/config'
import { unlinkSync, readFileSync } from 'fs'
import { imagekit } from './image-kit.service'
import { getDocument, OPS } from 'pdfjs-dist';
import sharp from 'sharp'
import Path from 'node:path';


class FileUploadService {
  private tempDist = process.env.TEMP_DIST_PATH
  sample = 0
  async hostImage(imageBuffers: Buffer, name: string): Promise<void>{
    return await imagekit.upload({
      file: imageBuffers,
      fileName: name
    })
  }

  async getFileInfo(src: ArrayBuffer): Promise<number>{
    const fileData = await getDocument(src).promise
    console.log(fileData)

    return 0
  }


  // async exportImages(c: Context): Promise<ResponseHelper.Response>{
  //   const doc = await getDocument(src).promise
  //   const pageCount = doc._pdfInfo.numPages
  //   const images = []
  //   for (let p = 1; p <= pageCount; p++) {
  //     const page = await doc.getPage(p)
  //     const ops = await page.getOperatorList()

  //     const perPageImages: any[] = []
  //     for (let i = 0; i < ops.fnArray.length; i++) {
  //       try {
  //         if (
  //           ops.fnArray[i] === OPS.paintImageXObject ||
  //           ops.fnArray[i] === OPS.paintInlineImageXObject
  //         ) {
  //           const name = ops.argsArray[i][0]
  //           const common = await page.commonObjs.has(name)
  //           const img = await (common
  //             ? page.commonObjs.get(name)
  //             : page.objs.get(name)
  //           )
  //           const { width, height } = img
  //           const bytes = img.data.length
  //           const channels = bytes / width / height
  //           if (!(channels === 1 || channels === 2 || channels === 3 || channels === 4)) {
  //             throw new Error(`Invalid image channel: ${channels} for image ${name} on page ${page}`)
  //           }

  //           const file = Path.join(dst, `${name}.png`)
  //           await sharp(img.data, {
  //             raw: { width, height, channels }
  //           }).toFile(file)

  //           const imageBuffer = readFileSync(file);
  //           unlinkSync(file);

  //           const filename = `${name}.png`;

  //           perPageImages.push(await uploadImage(imageBuffer, filename));
  //         }
  //       } catch (error) {
  //         return error
  //       }
  //     }
  //     images.push({ page: page._pageIndex + 1, images: perPageImages })
  //   }
  //   return images
  // }


}

export default FileUploadService