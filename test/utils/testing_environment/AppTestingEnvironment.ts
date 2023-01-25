import type TestingEnvironment from "./TestingEnvironment.d.js";

import {PostgreSqlContainer, StartedPostgreSqlContainer} from "testcontainers";

import * as fs from "fs/promises";
import {FastifyAdapter, NestFastifyApplication} from "@nestjs/platform-fastify";

import {Test} from "@nestjs/testing";
import AppModule from "../../../src/AppModule.js";
import configureApp from "../../../src/configureApp.js";
import FeaturesModule from "../../../src/features_module/FeaturesModule.js";
import {TypeOrmModule} from "@nestjs/typeorm";
import testsConfig from "../../config/testsConfig.js";

type AppTestingEnvironmentCreatedState = {
	id: "created";
};

type AppTestingEnvironmentStartedState = {
	id: "started";
	app: NestFastifyApplication;
	postgresqlContainer: StartedPostgreSqlContainer;
};

type PostgresqlContainerInitializationResult = {
	container: StartedPostgreSqlContainer;
	connectionOptions: PostgresqlConnectionOptions;
};

type PostgresqlConnectionOptions = {
	host: string;
	port: number;
	username: string;
	password: string;
	database: string;
};

type AppTestingEnvironmentStoppedState = {
	id: "stopped";
};

class AppTestingEnvironment implements TestingEnvironment {
	private state:
		| AppTestingEnvironmentCreatedState
		| AppTestingEnvironmentStartedState
		| AppTestingEnvironmentStoppedState;
	private generatePostgresqlPassword() {
		return Math.random().toString(36).substring(2);
	}
	private async initializePostgresql(
		postgresqlInitializationSqlScript: string
	): Promise<PostgresqlContainerInitializationResult> {
		const postgresqlContainerPassword = this.generatePostgresqlPassword();
		const postgresqlContainer = await new PostgreSqlContainer(
			testsConfig.TESTS_POSTGRESQL_CONTAINER_IMAGE_NAME
		)
			.withPassword(postgresqlContainerPassword)
			.withEnvironment({"PGPASSWORD": postgresqlContainerPassword})
			.withDatabase(testsConfig.TESTS_POSTGRESQL_CONTAINER_DATABASE_NAME)
			.start();

		const postgresqlContainerPort = postgresqlContainer.getMappedPort(5432);

		const postgresqlContainerHost = postgresqlContainer.getHost();

		const postgresqlContainerUsername = postgresqlContainer.getUsername();

		const postgresqlContainerDatabase = postgresqlContainer.getDatabase();

		await postgresqlContainer.exec([
			"psql",
			`--host=localhost`,
			`--port=5432`,
			`--username=${postgresqlContainer.getUsername()}`,
			`--dbname=${postgresqlContainer.getDatabase()}`,
			`--no-password`,
			`--command`,
			postgresqlInitializationSqlScript,
		]);

		return {
			container: postgresqlContainer,
			connectionOptions: {
				host: postgresqlContainerHost,
				port: postgresqlContainerPort,
				username: postgresqlContainerUsername,
				password: postgresqlContainerPassword,
				database: postgresqlContainerDatabase,
			},
		};
	}
	constructor() {
		this.state = {
			id: "created",
		};
	}
	private async initializeApp(
		postgresqlConnectionOptions: PostgresqlConnectionOptions
	): Promise<NestFastifyApplication> {
		const AppOrmModule = TypeOrmModule.forRoot({
			type: "postgres",
			host: postgresqlConnectionOptions.host,
			port: postgresqlConnectionOptions.port,
			username: postgresqlConnectionOptions.username,
			password: postgresqlConnectionOptions.password,
			database: postgresqlConnectionOptions.database,
			autoLoadEntities: true,
			synchronize: false,
		});

		const appTestingModule = await Test.createTestingModule({
			imports: [FeaturesModule, AppOrmModule],
		}).compile();

		const app = appTestingModule.createNestApplication<NestFastifyApplication>(
			new FastifyAdapter()
		);

		configureApp(app);
		await app.init();
		await app.getHttpAdapter().getInstance().ready();
		return app;
	}

	public async start() {
		if (this.state.id === "started") {
			throw new Error("TestingEnvironment is already started.");
		}
		if (this.state.id === "stopped") {
			throw new Error("TestingEnvironment is already stopped.");
		}
		const postgresqlInitializationSqlScript = await fs.readFile(
			testsConfig.TESTS_POSTGRESQL_INITIALIZATION_SQL_SCRIPT_PATH,
			"utf-8"
		);

		const postgresqlContainerInitializationResult = await this.initializePostgresql(
			postgresqlInitializationSqlScript
		);
		const postgresqlContainer = postgresqlContainerInitializationResult.container;
		console.log(
			`PostgreSQL container is started. Connection options: ${JSON.stringify(
				postgresqlContainerInitializationResult.connectionOptions
			)}`
		);
		const app = await this.initializeApp(postgresqlContainerInitializationResult.connectionOptions);
		this.state = {
			id: "started",
			app,
			postgresqlContainer,
		};
	}

	public async stop() {
		if (this.state.id === "stopped") {
			throw new Error("TestingEnvironment is already stopped.");
		}
		if (this.state.id === "created") {
			throw new Error("TestingEnvironment is not started.");
		}
		const {app, postgresqlContainer} = this.state;
		await app.close();
		await postgresqlContainer.stop();
		this.state = {
			id: "stopped",
		};
	}

	public get app(): NestFastifyApplication {
		if (this.state.id === "created") {
			throw new Error("TestingEnvironment is not started.");
		}
		if (this.state.id === "stopped") {
			throw new Error("TestingEnvironment is already stopped.");
		}
		return this.state.app;
	}
}

export default AppTestingEnvironment;
