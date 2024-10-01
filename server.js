import express from 'express'
import "dotenv/config"
import authRoute from './routes/api.js'
import fileUpload from 'express-fileupload'
import helmet from 'helmet'
import cors from 'cors'
import { limiter } from './config/rateLimiter.js'
import { rateLimit } from 'express-rate-limit'

const app = express()
const PORT = process.env.PORT || 8000

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(fileUpload())
app.use(helmet())
app.use(cors())
app.use(limiter)


app.use('/api',authRoute)

import "./jobs/index.js"

app.get('/',(req,res)=>{
    return res.send('Server is working');
})

app.listen(PORT,()=>{
    console.log(`server running at port ${PORT}`)
})