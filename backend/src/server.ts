import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import morgan from 'morgan'
import userRoutes from '../routes/userRoutes'
import betRoutes from '../routes/betRoutes'
import connectDB from '../config/db'
import { notFound, errorHandler } from '../middleware/errorMiddleware'

dotenv.config()

connectDB()

const app = express()

app.use(express.json())

app.use((req, res, next) => {
  res.header('Content-Type', 'application/json')
  res.header('Access-Control-Allow-Headers', 'Authorization')
  res.header('Access-Control-Allow-Origin', 'https://fightbet.netlify.app')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
})
//? for preflight checks - CORS related
app.options('*', function (req, res) {
  res.header('Content-Type', 'application/json')
  res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type')
  res.send()
})

// routes

app.use('/api/users', userRoutes)
app.use('/api/bets', betRoutes)

if (process.env.NODE_ENV === 'production') {
  app.get('/', (req, res, next) => {
    res.send('API is running in production mode')

    next()
  })
} else {
  app.get('/', (req, res, next) => {
    res.send('API is running')

    next()
  })
}
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(
    colors.yellow.bgCyan.bold(
      `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
    )
  )
})
