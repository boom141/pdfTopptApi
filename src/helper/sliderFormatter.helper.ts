
interface ImageData {
    image: string;
    thumbImage: string;
}

export const uploadObjectFormatter = (pdfContent: any): Array<object> => {
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
            newData.push({page: pageData.page, images: images})
        }
    }

    return newData;
};

interface ImageData {
    image: string;
    thumbImage: string;
}

export const ElmentsObjectFormatter = (elementList: any): Array<object> => {
    let newData = []
    if (elementList) {
        for (let pageData of elementList) {
            let images = []
            for (let image of pageData.images) {
                let imageData: ImageData = {
                    image: image.url,
                    thumbImage: image.thumbnailUrl,
                };

                images.push(imageData);
            }
            newData.push({page: pageData.page, images: images})
        }
    }

    return newData;
};
