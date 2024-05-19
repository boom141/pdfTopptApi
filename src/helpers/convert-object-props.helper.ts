import { SlideData } from "../types"
import pptxgen from "pptxgenjs"
import fetch from 'node-fetch';
import sizeOf from 'image-size';


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
            align: textObject.textAlign,
            fontFace: textObject.fontFamily,
            bold: textObject.fontWeight === 'bold',
            fontSize: textObject.fontSize,
            color: textObject.fill.split('#')[1],
            y: getCoordPercentage(textObject.top, slideHeight),
            x: getCoordPercentage(textObject.left, slideWidth),
            w: `${((textObject.width * textObject.scaleX) / slideWidth) * 100}%`, // Adjusted width calculation
            h: `${((textObject.height * textObject.scaleY) / slideHeight) * 100}%`, // Adjusted height calculation
            rotate: textObject.angle
        };
}

export const convertImageProps = async (
    imageObject: SlideData.ImageProps,
    slideHeight: number,
    slideWidth: number,
): Promise<pptxgen.ImageProps> => {
    try {
        // Fetch the image data from the URL
        const response = await fetch(imageObject.src);
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
        }

        const buffer = await response.arrayBuffer();
        const dimensions = sizeOf(Buffer.from(buffer));
        return {
            path: imageObject.src,
            y: getCoordPercentage(imageObject.top, slideHeight),
            x: getCoordPercentage(imageObject.left, slideWidth),
            w: `${(dimensions.width as number * imageObject.scaleX / slideWidth) * 100}%`,
            h: `${(dimensions.height as number * imageObject.scaleY / slideHeight) * 100}%`,
            rotate: imageObject.angle
        };
    } catch (error) {
        console.error('Error converting image props:', error);
        throw error;
    }
};