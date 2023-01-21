import {TypeOrmModule} from "@nestjs/typeorm";
import {AppConfig} from "../config/index.js";
import BrandEntity from "../features/brands/brands_service/BrandEntity.js";
import CategoryEntity from "../features/categories/CategoryEntity.js";
import {ProductEntity} from "../features/products/index.js";

const AppOrmModule = TypeOrmModule.forRootAsync({
	inject: [AppConfig],
	useFactory: (config: AppConfig) => ({
		type: "postgres",
		host: config.POSTGRES_HOST,
		port: config.POSTGRES_PORT,
		username: config.POSTGRES_USERNAME,
		password: config.POSTGRES_PASSWORD,
		database: config.POSTGRES_DATABASE,
		autoLoadEntities: true,
		synchronize: false,
	}),
});

export default AppOrmModule;
