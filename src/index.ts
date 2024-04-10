import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'


import { getElements } from './services/elements.service'
import { exportImages } from './services/imageHosting.service'
import { uploadObjectFormatter } from './helper/sliderFormatter.helper'


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
    return c.json({ code: 200, data: uploadObjectFormatter(pdfImages) })

  }catch (e){

    return c.json({code: 500})
  }
})

app.get('/elements', async (c) => {
  try {
    let response = await getElements(c.req.query())
    return c.json(response)
  } catch (e) {
    return c.json(e)
  }
})

app.get('/sample', c => c.text('Sample'))

const port = 5000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
