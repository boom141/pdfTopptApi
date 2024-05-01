import { Context } from "hono";
import { ResponseHelper } from "../types";
import { apiErrorResponse, apiSuccessResponse } from "../helpers/response.helper";
import FileUploadService from "../services/pdf-parsing.service";


class AppController{
    private fileUploadService: FileUploadService = new FileUploadService();
    
    fileInfo = async (c: Context): Promise<ResponseHelper.RequestResponse> =>{
        // try{
        //     const body = await c.req.parseBody()
        //     const fileBuffer = await (body.file as File).arrayBuffer()
        //     const result = await this.fileUploadService.getFileInfo(fileBuffer)
        //     return c.json({data: this.fileUploadService.sample})
        //   }catch(e: any){
        //     return c.json(apiErrorResponse('Request failed'))
        // }
        console.log(this.fileUploadService)
        return c.text(this.fileUploadService.sample.toString())
    }
}

export default AppController;