import pptxgen from "pptxgenjs";
import  { SlideData }  from "../types";
import { convertImageProps, convertTextProps } from "../helpers/convert-object-props.helper";


export const exportPPT = async (slidesData: Array<SlideData.Slide>) => {
    let newPpt = new pptxgen();
    newPpt.layout = 'LAYOUT_16x9'; // Set layout to 16:9 (landscape)

    // Map each slide data to an array of promises for adding slides
    const slidePromises = slidesData.map(async slide => {
        let newSlide = newPpt.addSlide();
        newSlide.background = { color: slide.backgroundColor.split('#')[1] };

        // Map each object on the slide to an array of promises for adding objects
        const objectPromises = slide.objects.map(async (object) => {
            if ('text' in object) {
                let textData = convertTextProps(object, slide.height, slide.width);
                newSlide.addText(object.text, textData);
            } else {
                let imageData = await convertImageProps(object, slide.height, slide.width);
                newSlide.addImage(imageData);
            }
        });

        // Wait for all object promises to resolve
        await Promise.all(objectPromises);
    });

    // Wait for all slide promises to resolve
    await Promise.all(slidePromises);

    // Write the presentation file
    return await newPpt.writeFile({ fileName: `src/data/temp/downloadable/result-${Math.floor(Math.random() * (10000 - 1000) + 1) + 1000 }.pptx` });
}

