import express, { type Application, type Request, type Response } from 'express'
import { authRoute } from './modules/auth/auth.route';
import { issueRoute } from './modules/issue/issue.route';
import globalErrorHandler from './middleware/globalErrorHandler';
import notFound from './middleware/notFound';
import cors from 'cors'
const app: Application = express()
app.use(cors())
app.use(express.json())
app.use(express.text());
app.use(express.urlencoded({ extended: true }))
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    "message": "Express Server",
    "author": "DevPulse"
  })
})

app.use('/api/auth', authRoute)
app.use('/api/issues', issueRoute)





app.use(notFound)
app.use(globalErrorHandler)
export default app
