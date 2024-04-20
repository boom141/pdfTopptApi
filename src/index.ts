import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'


import { getElements } from './services/elements.service'
import { exportImages } from './services/imageHosting.service'
import { pixabayArrayFormatter, uploadArrayFormatter } from './helpers/sliderFormatter.helper'
import { apiErrorResponse, apiSuccessResponse } from './helpers/response.helper'
import { exportPPT } from './services/generatePPT.service'

const app = new Hono().basePath(process.env.BASE_API_PATH as string)
app.use(cors())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post('/upload', async (c) => {
  try{
    const body = await c.req.parseBody()
    const file = body.file
    const fileBuffer = file instanceof File ? await file.arrayBuffer() : false
    const pdfImages = await exportImages(fileBuffer, 'src/temp')
    
    console.log(body)

    return c.json(apiSuccessResponse(
      uploadArrayFormatter(pdfImages), 
      'upload complete', 
      ))

  }catch (e:any){
    return c.json(apiErrorResponse(e.message))
  }
})

app.get('/elements', async (c) => {
  try {
    let response = await getElements(c.req.query())
   
    return c.json(apiSuccessResponse(
      pixabayArrayFormatter(response),
      'elements retrieved sucessfully'
    ))

  } catch (e:any) {
    return c.json(apiErrorResponse(e.message))
  }
})

app.post('/export', async(c) => {
  let requestData = await c.req.json()
  exportPPT(requestData.data)
  return c.json(apiSuccessResponse([], 'sucess'))
})

app.get('/sample', c => c.text('Sample'))

const port = 5000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
