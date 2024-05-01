import 'dotenv/config'
import ImageKit from 'imagekit'

const publicKey = process.env.PUBLIC_KEY as string;
const privateKey = process.env.PRIVATE_KEY as string;
const urlEndpoint = process.env.URL_ENDPOINT as string;

export const imagekit: any = new ImageKit({
    publicKey: publicKey,
    privateKey: privateKey,
    urlEndpoint: urlEndpoint
});