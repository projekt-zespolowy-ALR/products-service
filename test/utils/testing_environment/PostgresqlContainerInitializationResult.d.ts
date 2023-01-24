import {StartedPostgreSqlContainer, type PostgreSqlContainer} from "testcontainers";

type PostgresqlContainerInitializationResult = {
	container: StartedPostgreSqlContainer;
	connectionOptions: {
		host: string;
		port: number;
		username: string;
		password: string;
		database: string;
	};
};

export default PostgresqlContainerInitializationResult;
