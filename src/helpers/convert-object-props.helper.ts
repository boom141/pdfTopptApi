import SlideData from "../types"
import pptxgen from "pptxgenjs"

const getCoordPercentage = (part: number, whole: number): pptxgen.Coord => {
    let coord = (part/whole) * 100
    return `${coord}%`
}

export const convertTextProps = (
    textObject: SlideData.TextProps, 
    slideHeight: number,
    slideWidth: number
    ): pptxgen.TextPropsOptions => {
   return {
        fontFace: textObject.fontFamily,
        bold: textObject.fontWeight === 'bold' ? true : false,
        fontSize: textObject.fontSize,
        color: textObject.fill.split('#')[1],
        y: getCoordPercentage(textObject.top, slideHeight),
        x: getCoordPercentage(textObject.left, slideWidth),
        rotate: textObject.angle
    }
}

export const convertImageProps = (
    imageObject: SlideData.ImageProps,
    slideHeight: number,
    slideWidth: number,
    ): pptxgen.ImageProps => {
    return {
        path: imageObject.src,
        y: getCoordPercentage(imageObject.top, slideHeight),
        x: getCoordPercentage(imageObject.left, slideWidth),
    }
}