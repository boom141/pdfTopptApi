export declare namespace SlideData{
    export interface SlideObject{
        id: number,
        type: string
    }

    export interface TextProps extends SlideObject {
        text: string,
        fontFamily: string,
        fontWeight: string,
        fontSize: number,
        cursorColor: string,
        left: number,
        top: number,
        fill: string,
        angle: number
    }

    export interface ImageProps extends SlideObject {
        src: string,
        left: number,
        top: number,
        scaleX: number,
        scaleY: number,
        flipX: boolean,
        flipY: boolean,
        angle: number
    }

    export type ObjectsType = TextProps | ImageProps 

    export interface Slide {
        number: number,
        height: number,
        width: number,
        backgroundColor: string,
        objects: Array<ObjectsType>,
        thumbnail: string | null
    }
}

export declare namespace ResponseHelper{
    export type ResposeDataType = Array<any> | object | string | number

    export interface SuccessResponse {
        success: boolean,
        code: number,
        data: ResposeDataType,
        message: string
    }

    export interface ErrorResponse {
        success: boolean,
        code: number,
        message: string
    }

    export type RequestResponse = SuccessResponse | ErrorResponse | any
}

export declare namespace Parsing{
    export interface HostedImage {
        name: string
        url: string
        thumbnailUrl: string
    }

    export interface ExtractedImages{
        page: number
        images: Array<HostedImage>
    }

    export interface ExtractedTexts{
        page: number
        text: string
    }

    export interface ExtractedContent{
        page:number
        images: Array<HostedImage>
        text: string
    }
}