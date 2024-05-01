
interface ImageData {
    image: string;
    thumbImage: string;
}

export const uploadArrayFormatter = (pdfContent: any): Array<object> => {
    let newData = []
    if (pdfContent) {
        for (let pageData of pdfContent) {
            let images = []
            for (let image of pageData.images) {
                let imageData: ImageData = {
                    image: image.url,
                    thumbImage: image.thumbnailUrl,
                };

                images.push(imageData);
            }
            newData.push({category: 'page' + pageData.page, images: images})
        }
    }

    return newData;
};


export const pixabayArrayFormatter = (imageList: any): Array<object> => {
    let images = Object()
    let newData = Array()
    if (imageList) {
        for (let image of imageList.hits) {
            const imageData: ImageData = {
                image: image.largeImageURL,
                thumbImage: image.previewURL
            }

            if(image.type in images){
                images[image.type].push(imageData)
            }else{
                images[image.type] = Array()
            }
        }

        for(let type in images){
            newData.push({category: type, images: images[type]})
        }
    }
    
    return newData;
};
