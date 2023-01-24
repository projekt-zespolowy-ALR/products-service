import {NestFastifyApplication} from "@nestjs/platform-fastify";

interface TestingEnvironment {
	readonly app: NestFastifyApplication;
	start(): Promise<void>;
	stop(): Promise<void>;
}

export default TestingEnvironment;
