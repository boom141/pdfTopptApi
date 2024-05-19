import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { exportPPT } from './services/generate-ppt.service'
import AppController from './controllers/index.controller'
import {createReadStream, readFile} from 'fs'

import { stream, streamText, streamSSE } from 'hono/streaming'
import { promisify } from 'util'
import { apiSuccessResponse } from './helpers/response.helper'

const app = new Hono().basePath(process.env.BASE_API_PATH as string)
const appController = new AppController()

app.use(cors())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})


app.post('/fileInfo',  appController.fileInfo)
app.get('/extractImages', appController.extractImages)
app.get('/extractTexts', appController.extractTexts)

// app.get('/elements', async (c) => {
//   try {
//     let response = await getElements(c.req.query())
   
//     return c.json(apiSuccessResponse(
//       pixabayArrayFormatter(response),
//       'elements retrieved sucessfully'
//     ))

//   } catch (e:any) {
//     return c.json(apiErrorResponse(e.message))
//   }
// })

const readFileAsync = promisify(readFile) // Specify the path to your file
app.post('/export', async(c) => {
  let requestData = await c.req.json()
  await exportPPT(requestData.data)

  const filePath = 'src/data/temp/downloadable/result_presentation.pptx';
  const fileData = await readFileAsync(filePath) 
  return c.json(apiSuccessResponse(fileData.toString('base64'), 'sucess'))
})

app.get('/sample', c => c.text('Sample'))

const port = 5000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
