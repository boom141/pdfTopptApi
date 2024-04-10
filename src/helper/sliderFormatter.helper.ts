
interface ImageData {
    image: string;
    thumbImage: string;
}

export const sliderFormatter = (sliderObject: any): Array<object> => {
    let newData = []
    if (sliderObject) {
        for (let pageData of sliderObject) {
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
