import {NestFastifyApplication} from "@nestjs/platform-fastify";
import type TestingEnvironment from "./TestingEnvironment.d.js";

class EmptyTestingEnvironment implements TestingEnvironment {
	private readonly ERROR_MESSAGE = "EmptyTestingEnvironment is not supposed to be used.";
	constructor() {}

	public async start() {
		throw new Error(this.ERROR_MESSAGE);
	}

	public async stop() {
		throw new Error(this.ERROR_MESSAGE);
	}

	public get app(): NestFastifyApplication {
		throw new Error(this.ERROR_MESSAGE);
	}
}

export default EmptyTestingEnvironment;
