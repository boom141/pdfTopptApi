import pptxgen from "pptxgenjs";
import  SlideData  from "../types";
import { convertImageProps, convertTextProps } from "../helpers/convertObjectProps.helper";


export const exportPPT = (slidesData: Array<SlideData.Slide>) => {
    let newPpt = new pptxgen();
    
    slidesData.forEach( slide =>{
        let newSlide = newPpt.addSlide();
        newSlide.background = {color: slide.backgroundColor.split('#')[1]}
        slide.objects.forEach( object => {
            if('text' in object){
                let textData = convertTextProps(object, slide.height, slide.width)
                newSlide.addText(object.text, textData)
            }else{
                let imageData = convertImageProps(object, slide.height, slide.width)
                newSlide.addImage(imageData)
            }
        })
    })

    newPpt.writeFile({fileName: 'test_presentation.pptx'});
}

