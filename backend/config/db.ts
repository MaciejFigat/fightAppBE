import mongoose, { Connection } from 'mongoose'

const connectDB = async (): Promise<Connection> => {
  try {
    const conn = await mongoose.connect(`${process.env.MONGO_URI}`)
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline)
    return conn.connection
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`.bgRed.bold)
    } else {
      console.error(`Unknown error occurred: ${error}`.bgRed.bold)
    }
    process.exit(1)
  }
}
export default connectDB
