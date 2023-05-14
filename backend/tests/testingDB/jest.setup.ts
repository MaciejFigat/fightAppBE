import { connect, closeDatabase, clearDatabase } from './dbHandler'

beforeAll(async () => await connect())

afterEach(async () => await clearDatabase())

afterAll(async () => await closeDatabase())
