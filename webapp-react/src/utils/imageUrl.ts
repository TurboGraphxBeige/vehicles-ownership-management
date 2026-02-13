
export default function imageUrl(data?: Array<number>) {
    if (!data) return;

    const byteArray = data;

    const byteArrayToString = (byteArray: Array<number>) => {
        let str = '';
        for (let i = 0; i < byteArray.length; i += 65536) {
            str += String.fromCharCode.apply(null, byteArray.slice(i, i + 65536));
        }
        return str;
    };

    const base64String = btoa(byteArrayToString(byteArray));
    const image = `data:image/jpeg;base64,${base64String}`;
    return image;
}