import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { exportPPT } from './services/generate-ppt.service'
import AppController from './controllers/index.controller'
import { readFile, unlink} from 'fs'
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
const removeFileAsync = promisify(unlink)
app.post('/export', async(c) => {
  let requestData = await c.req.json()


  const filePath = await exportPPT(requestData.data)
  console.log(filePath)
  const fileData = await readFileAsync(filePath) 
  const removedFile = await removeFileAsync(filePath)
  const base64Data = fileData.toString('base64');
  return c.json(apiSuccessResponse(base64Data, 'success'))
})

app.get('/sample', c => c.text('Sample'))

const port = 5000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
