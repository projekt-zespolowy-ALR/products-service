import {NestFactory} from "@nestjs/core";
import AppModule from "./AppModule.js";
import {FastifyAdapter, NestFastifyApplication} from "@nestjs/platform-fastify";
import configureApp from "./configureApp.js";
import AppConfig from "./config/AppConfig.js";

const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
configureApp(app);
const appConfig = app.get(AppConfig);

await app.listen(appConfig.PORT, appConfig.HOST);
console.log(`Next.js server listening at ${await app.getUrl()}`);
