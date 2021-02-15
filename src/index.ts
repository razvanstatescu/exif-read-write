// @ts-ignore
import * as piexif from 'deskfy-piexifjs';

export function getExifDataFromImage({ image }: { image: Blob }): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const exifData = piexif.load(e?.target?.result);
            resolve(piexif.dump(exifData));
        };
        reader.readAsDataURL(image);
    });
}

export function addExifDataToImage({ image, data }: { image: Blob, data: string }): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const newImage = piexif.insert(data, e?.target?.result);
            resolve(dataURItoBlob(newImage));
        };
        reader.readAsDataURL(image);
    });
}

function dataURItoBlob(dataurl: string): Blob {
    const arr = dataurl.split(',');
    // @ts-ignore
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}