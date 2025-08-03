import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Users E2E', () => {
	let app: INestApplication
	let prisma: PrismaService

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
		}).compile()

		app = moduleRef.createNestApplication()
		prisma = moduleRef.get(PrismaService)

		await app.init()
	})

	afterAll(async () => {
		await app.close()
		await prisma.$disconnect()
	})

	test('[POST] /users', async () => {
		const response = await request(app.getHttpServer()).post('/users').send({
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: '123456',
		})

		expect(response.statusCode).toBe(201)

		// const userInDatabase = await prisma.user.findFirst({
		//   where: {
		//     email: 'john.doe@example.com',
		//   },
		// });

		// expect(userInDatabase).toBeTruthy();
	})
})
