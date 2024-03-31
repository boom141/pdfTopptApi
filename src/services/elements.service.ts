import 'dotenv/config'
import { URLSearchParams } from 'url'

export const getElements = async (queryParams: any) => {
    const url = process.env.PIXABAY_BASE_URL as string
    const apiKey = process.env.PIXABAY_API_KEY as string

    let newQueryParams = new URLSearchParams()
    for (let key in queryParams) {
        newQueryParams.set(key, queryParams[key])
    }

    let result = await fetch(url + apiKey + "&" + newQueryParams.toString())
    return await result.json()
}