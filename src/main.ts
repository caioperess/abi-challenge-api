import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { EnvService } from './infra/env/env.service'

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		logger: ['log', 'error', 'warn'],
	})

	const configService = app.get(EnvService)
	const port = configService.get('PORT')

	app.enableCors()

	await app.listen(port)
}

bootstrap()
