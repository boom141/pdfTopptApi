import 'dotenv/config'
import { unlinkSync, readFileSync, writeFile } from 'fs'
import { imagekit } from './image-kit.service'
import { getDocument, OPS } from 'pdfjs-dist';
import sharp from 'sharp'
import Path from 'node:path';


class FileUploadService {
  private tempDist: string = process.env.TEMP_DIST_PATH as string
  private baseFileName: string = process.env.BASE_FILE_NAME as string
  private uploadedFile: string = this.tempDist +'/'+ this.baseFileName

   saveFile = (src: ArrayBuffer | any): void =>{
    writeFile(this.uploadedFile, Buffer.from(src), err => {
      err ?  console.log('file upload saved') : console.log(err)
    })
  }

   hostImage = async(imageBuffers: Buffer, name: string): Promise<void> =>{
    return await imagekit.upload({
      file: imageBuffers,
      fileName: name
    })
  }

   getFileInfo = async(src: ArrayBuffer): Promise<{maxPage: number}> =>{
    this.saveFile(src)
    const fileData = await getDocument(src).promise 
    return { maxPage: fileData._pdfInfo.numPages }
  }

   exportImages = async(pageLimit: number): Promise<Array<any> | any> =>{
    const doc = await getDocument(this.uploadedFile).promise
    const images = []
    for (let p = 1; p <= pageLimit; p++) {
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

            const file = Path.join(this.tempDist, `/${name}.png`)
            await sharp(img.data, {
              raw: { width, height, channels }
            }).toFile(file)

            const imageBuffer = readFileSync(file);
            unlinkSync(file);

            const filename = `${name}.png`;

            perPageImages.push(await this.hostImage(imageBuffer, filename));
          }
        } catch (error) {
          return error
        }
      }
      images.push({ page: page._pageIndex + 1, images: perPageImages })
    }
    return images
  }


}

export default FileUploadService