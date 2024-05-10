import 'dotenv/config'
import { PDFExtract } from 'pdf.js-extract';
import { summarize } from "@ebereplenty/summarize";
import { unlinkSync, readFileSync, writeFile } from 'fs'
import { imagekit } from './image-kit.service'
import { getDocument, OPS } from 'pdfjs-dist';
import { Parsing } from '../types';
import sharp from 'sharp'
import Path from 'node:path';
import  SummarizeService  from './summarizer.service';
import { text } from 'stream/consumers';

class FileParsingService {
  private tempDist: string = process.env.TEMP_DIST_PATH as string
  private baseFileName: string = process.env.BASE_FILE_NAME as string
  private uploadedFile: string = this.tempDist +'/'+ this.baseFileName

  private textExtractor = new PDFExtract()

  saveFile = (src: ArrayBuffer | any): void =>{
    writeFile(this.uploadedFile, Buffer.from(src), err => {
      err ?  console.log('file upload saved') : console.log(err)
    })
  }

  hostImage = async(imageBuffers: Buffer, name: string): Promise<any> =>{
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

  parseText = async (pageTexts: Array<any>): Promise<string> => {
    let textContent = ''
    pageTexts.forEach(text => {
      textContent += text.str
    })
    
    textContent = await summarize({input: textContent, openAiApiKey: process.env.OPENAI_API_KEY as string})
    return textContent
  }

  extractImages = async(pageLimit: number): Promise<Array<Parsing.ExtractedImages> | any> =>{
    const doc = await getDocument('src/data/temp/file1.pdf').promise
    const images:Array<Parsing.ExtractedImages> = []
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
            
            const hostImageData = await this.hostImage(imageBuffer, filename)

            perPageImages.push({name: hostImageData.name, url: hostImageData.url, thumbnailUrl: hostImageData.thumbnailUrl});
          }
        } catch (error) {
          return error
        }
      }
      images.push({ page: page._pageIndex + 1, images: perPageImages })
    }
    return images
  }

  extractTexts = async (pageLimit: number): Promise<Array<Parsing.ExtractedTexts> | any> =>{  
    const perPageData = await this.textExtractor.extract('src/data/temp/file1.pdf', {lastPage: pageLimit})
    let texts:Array<Parsing.ExtractedTexts> = []
    for(const page of perPageData.pages){
       const textData = await this.parseText(page.content)
       texts.push({page: page.pageInfo.num, text: textData})
    }
    return texts
  }

  extractContent = async (pageLimit: number): Promise<Array<Parsing.ExtractedContent>> => {
    let content: Array<Parsing.ExtractedContent> = []
    const imageData:Array<Parsing.ExtractedImages> = await this.extractImages(pageLimit)
    // const textData:Array<Parsing.ExtractedTexts> = await this.extractTexts(pageLimit)

    console.log(imageData)
    // console.log(textData)

    // for(let i = 0; i < pageLimit; i++){
    //   content.push({page: i + 1, images: imageData[i].images, text: textData[i].text})
    // }

    // console.log(content)
    return content
  }
}

export default FileParsingService