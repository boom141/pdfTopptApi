import { Context } from "hono";
import { ResponseHelper } from "../types";
import { apiErrorResponse, apiSuccessResponse } from "../helpers/response.helper";
import { API_RESPONSE_MESSAGE } from "../constant/index.constant";

import FileParsingService from "../services/file-parsing.service";


class AppController{
    private fileParsing: FileParsingService = new FileParsingService();
    
    fileInfo = async (c: Context): Promise<ResponseHelper.RequestResponse> =>{
        try{
            const body = await c.req.parseBody()
            const fileBuffer = await (body.file as File).arrayBuffer()
            const result = await this.fileParsing.getFileInfo(fileBuffer)
            return c.json(apiSuccessResponse(result, API_RESPONSE_MESSAGE.SUCCESS))
          }catch(e: any){
            return c.json(apiErrorResponse(API_RESPONSE_MESSAGE.ERROR))
        }
    }

    extractFromFile = async (c: Context): Promise<ResponseHelper.RequestResponse> =>{
        const queryParams: any = c.req.query()
        const pdfImages = await this.fileParsing.extractContent(queryParams.pageLimit as number)
        
        // try{
        //     const queryParams: any = c.req.query()
        //     const pdfImages = await this.fileParsing.extractContent(queryParams.pageLimit as number)
        //     return c.json(apiSuccessResponse(pdfImages, API_RESPONSE_MESSAGE.SUCCESS))
        // }catch(e: any){
        //     return c.json(apiErrorResponse(API_RESPONSE_MESSAGE.ERROR))
        // }
    }
}

export default AppController;