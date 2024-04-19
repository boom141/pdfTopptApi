import pptxgen from "pptxgenjs";
import  SlideData  from "../types";

const addTextToSlide = (slide: pptxgen.Slide, textList: Array<SlideData.TextProps>) => {
    textList.forEach( text => {
        let convertedProps: pptxgen.TextPropsOptions = {
            fontFace: text.fontFamily,
            bold: text.fontWeight === 'bold' ? true : false,
            fontSize: text.fontSize,
            color: text.fill.split('#')[1],
            y: text.top,
            x: text.left,
            rotate: text.angle
        }

        slide.addText(text.text, convertedProps)
    })

    return slide
}

export const exportPPT = (slideData: Array<SlideData.Slide>) => {
    let newPpt = new pptxgen();

    let slide = newPpt.addSlide();

    // 4. Save the Presentation
    newPpt.writeFile({fileName: 'test_presentation.pptx'});
}

