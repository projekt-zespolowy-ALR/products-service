import {Injectable} from "@nestjs/common";
import type {User} from "./User.js";
import AppConfig from "../../app_config/AppConfig.js";
import UsersMicroserviceClientInternalError from "./UsersMicroserviceClientInternalError.js";
import UsersMicroserviceReferenceUserWithGivenIdNotFoundError from "./UsersMicroserviceClientUserWithGivenIdNotFoundError.js";

@Injectable()
export default class UsersMicroserviceClient {
	private readonly appConfig: AppConfig;
	public constructor(appConfig: AppConfig) {
		this.appConfig = appConfig;
	}

	public async getUserById(userId: string): Promise<User> {
		return await fetch(`${this.appConfig.USERS_MICROSERVICE_BASE_URL}/v1/users/${userId}`)
			.catch(() => {
				throw new UsersMicroserviceClientInternalError(`Failed to get user with id "${userId}".`);
			})
			.then(async (response) => {
				if (response.status === 404) {
					throw new UsersMicroserviceReferenceUserWithGivenIdNotFoundError(userId);
				}
				if (!response.ok) {
					throw new UsersMicroserviceClientInternalError(`Failed to get user with id "${userId}".`);
				}
				return await response.json();
			});
	}
}
