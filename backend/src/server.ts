import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import morgan from 'morgan'
import path from 'path'
// import userRoutes from '../routes/userRoutes'
// import connectDB from '../config/db'
// import { notFound, errorHandler } from '../middleware/errorMiddleware'

dotenv.config()

// connectDB()

const app = express()

app.use(express.json())

// routes

// app.use('/api/users', userRoutes)

if (process.env.NODE_ENV === 'production') {
  // folder that will be used for static assets
  app.use(express.static(path.join(path.resolve(), 'frontend/build')))

  // handle every other route with index.html, which will contain
  // a script tag to your application's JavaScript file(s).
  app.get('*', function (request, response) {
    response.sendFile(
      path.resolve(path.resolve(), 'frontend/build', 'index.html')
    )
  })
} else {
  app.get('/', (req, res) => {
    res.send('API is running')
    // @ts-ignore
    next()
  })
}
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// app.use(notFound)
// app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(
    colors.yellow.bgCyan.bold(
      `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
    )
  )
})
