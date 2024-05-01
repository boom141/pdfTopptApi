import { ResponseHelper } from "../types"

export const apiSuccessResponse = (data: ResponseHelper.ResposeDataType, message: string): ResponseHelper.RequestResponse =>{
    const response = {
        success: true,
        code: 200,
        data: data,
        message: message
    }

    return response
}   

export const apiErrorResponse = (message: string): ResponseHelper.RequestResponse =>{
    const response = {
        success: false,
        code: 500,
        message: message
    }

    return response
}