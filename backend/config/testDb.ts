import mongoose, { Connection } from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

const connectTestDB = async (): Promise<Connection> => {
  let uri: string | undefined

  const mongod = await MongoMemoryServer.create()

  uri = mongod.getUri()

  if (!uri) {
    throw new Error('Database connection string is not defined')
  }

  try {
    const conn = await mongoose.connect(uri)

    console.log(`TestDB Connected: ${conn.connection.host}`.cyan.underline)
    return conn.connection
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`.bgRed.bold)
      console.log('NODE_ENV', process.env.NODE_ENV)
      console.log('uri', uri)
    } else {
      console.error(`Unknown error occurred: ${error}`.bgRed.bold)
      console.log('NODE_ENV', process.env.NODE_ENV)
    }
    process.exit(1)
  }
}

export default connectTestDB
