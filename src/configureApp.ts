import {NestFastifyApplication} from "@nestjs/platform-fastify";
import {HttpStatus, ValidationPipe, VersioningType} from "@nestjs/common";

async function configureApp(app: NestFastifyApplication): Promise<void> {
	app.enableCors({
		methods: "*",
		allowedHeaders: "*",
		exposedHeaders: "*",
		credentials: true,
		origin: (requestOrigin, callback) => {
			callback(null, true);
		},
	});
	app.enableVersioning({
		type: VersioningType.URI,
		defaultVersion: "1",
	});
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
			errorHttpStatusCode: HttpStatus.BAD_REQUEST,
		})
	);
}

export default configureApp;
