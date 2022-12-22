import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app/index.js";
import {FastifyAdapter, NestFastifyApplication} from "@nestjs/platform-fastify";
import {AppConfig} from "./app-config/index.js";
import {VersioningType} from "@nestjs/common";

const bootstrap = async (): Promise<void> => {
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
	app.enableVersioning({
		type: VersioningType.URI,
	});
	// const appConfig = app.get(AppConfig);
	await app.listen(3000, "0.0.0.0");
	console.log(`Next.js server listening at ${await app.getUrl()}`);
};
bootstrap();
