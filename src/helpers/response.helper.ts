
export const apiSuccessResponse = (data: Array<any>, message: string) =>{
    const response = {
        success: true,
        code: 200,
        data: data,
        message: message
    }

    return response
}   

export const apiErrorResponse = (message: string) =>{
    const response = {
        success: false,
        code: 500,
        message: message
    }

    return response
}