import 'dotenv/config'
import { PDFExtract } from 'pdf.js-extract';
import { summarize } from "@ebereplenty/summarize";
import { unlinkSync, readFileSync, writeFile, writeFileSync, unlink, readFile } from 'fs'
import { imagekit } from './image-kit.service'
import { getDocument, OPS } from 'pdfjs-dist';
import { Parsing } from '../types';
import sharp from 'sharp'
import Path from 'node:path';
import { exportImages } from 'pdf-export-images'
import { promisify } from 'util';

const readFileAsync = promisify(readFile)
const removeFileAsync = promisify(unlink)

class FileParsingService {
  private tempDist: string = process.env.TEMP_DIST_PATH as string
  private baseFileName: string = process.env.BASE_FILE_NAME as string
  private uploadedFile: string = this.tempDist +'/'+ this.baseFileName

  private textExtractor = new PDFExtract()

  saveFile = (src: ArrayBuffer | any): void =>{
    writeFileSync(this.uploadedFile, Buffer.from(src))
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



  extractImages = async (pageLimit: number): Promise<Array<Parsing.HostedImage> | any> => {
    let images: Array<Parsing.HostedImage> = [];

    try {
        const rawImages: any = await exportImages(this.uploadedFile, 'src/data/temp');

        await Promise.all(rawImages.map(async (image: any) => {
            let tracker = Number(image.name.split('_')[1].split('p')[1])
            if(tracker <= pageLimit){
              let fileBuffer = await readFileAsync(this.tempDist + `/${image.name}.png`);
              const hostImageData = await this.hostImage(fileBuffer, image.name);
              images.push({ name: hostImageData.name, url: hostImageData.url, thumbnailUrl: hostImageData.thumbnailUrl });
            }
            await removeFileAsync(this.tempDist + `/${image.name}.png`);
        }));

        return images;
    } catch (error) {
        return error; 
    }
}

  extractTexts = async (pageLimit: number): Promise<Array<Parsing.ExtractedTexts> | any> =>{  
    const perPageData = await this.textExtractor.extract(this.uploadedFile, {lastPage: pageLimit})
    let texts:Array<Parsing.ExtractedTexts> = []
    for(const page of perPageData.pages){
       const textData = await this.parseText(page.content)
       texts.push({page: page.pageInfo.num, text: textData})
    }
    return texts
  }

  // extractContent = async (pageLimit: number): Promise<Array<Parsing.ExtractedContent>> => {
  //   let content: Array<Parsing.ExtractedContent> = []
  //   const imageData:Array<Parsing.ExtractedImages> = await this.extractImages(pageLimit)
  //   // const textData:Array<Parsing.ExtractedTexts> = await this.extractTexts(pageLimit)

  //   console.log(imageData)
  //   // console.log(textData)

  //   // for(let i = 0; i < pageLimit; i++){
  //   //   content.push({page: i + 1, images: imageData[i].images, text: textData[i].text})
  //   // }

  //   // console.log(content)
  //   return content
  // }
}

export default FileParsingService