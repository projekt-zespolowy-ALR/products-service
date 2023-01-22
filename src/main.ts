import {NestFactory} from "@nestjs/core";
import AppModule from "./AppModule.js";
import {FastifyAdapter, NestFastifyApplication} from "@nestjs/platform-fastify";
import {AppConfig} from "./config/index.js";
import {HttpStatus, ValidationPipe, VersioningType} from "@nestjs/common";

const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
	cors: {
		methods: "*",
		allowedHeaders: "*",
		exposedHeaders: "*",
		credentials: true,

		origin: (requestOrigin, callback) => {
			callback(null, true);
		},
	},
});
app.enableVersioning({
	type: VersioningType.URI,
});
app.useGlobalPipes(
	new ValidationPipe({
		transform: true,
		whitelist: true,
		errorHttpStatusCode: HttpStatus.BAD_REQUEST,
	})
);
const appConfig = app.get(AppConfig);
await app.listen(appConfig.PORT, appConfig.HOST);
console.log(`Next.js server listening at ${await app.getUrl()}`);
