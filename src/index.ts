import { serve } from '@hono/node-server'
import { Hono } from 'hono'

import { getElements } from './services/elements.service'
import { exportImages } from './services/imageHosting.service'
import { url } from 'inspector'
import { json } from 'stream/consumers'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post('/upload', async (c) => {
  const body = await c.req.parseBody()
  const file = body.file

  const fileBuffer = file instanceof File ? await file.arrayBuffer() : false

  const pdfImages = await exportImages(fileBuffer, 'src/temp')

  return c.json({ data: pdfImages })
})


app.get('/elements', async (c) => {
  try {
    let response = await getElements(c.req.query())
    return c.json(response)
  } catch (e) {
    return c.json(e)
  }

})



const port = 5000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
