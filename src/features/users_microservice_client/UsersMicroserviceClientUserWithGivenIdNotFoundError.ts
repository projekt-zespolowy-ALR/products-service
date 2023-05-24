export default class UsersMicroserviceReferenceUserWithGivenIdNotFoundError extends Error {
	public userId: string;
	public constructor(userId: string) {
		super(`User with id "${userId}" not found`);
		this.userId = userId;
	}
}
