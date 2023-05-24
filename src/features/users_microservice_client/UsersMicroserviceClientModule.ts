import {Module} from "@nestjs/common";
import UsersMicroserviceClient from "./UsersMicroserviceClient.js";

@Module({
	imports: [],
	controllers: [],
	providers: [UsersMicroserviceClient],
	exports: [UsersMicroserviceClient],
})
export default class UsersMicroserviceClientModule {
	public constructor() {}
}
