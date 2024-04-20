declare namespace SlideData{
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

    export interface Slide {
        number: number,
        height: number,
        width: number,
        backgroundColor: string,
        objects: Array<TextProps> | Array<ImageProps>,
        thumbnail: string | null
    }
}

export default SlideData