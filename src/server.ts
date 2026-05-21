import express, { type Application, type Request, type Response } from 'express'
const app:Application = express()
const port = 5000

app.get('/', (req:Request, res:Response) => {
  res.status(200).json({
    "message":"Express Server",
    "author":"DevPulse"
  })
})

app.listen(port, () => {
  console.log(`DevPulse server is runnig on port ${port}`)
})