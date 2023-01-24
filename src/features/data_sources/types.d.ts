type DataSource = {
	readonly id: string;
	readonly name: string;
	readonly slug: string;
	readonly url: string;
};

type AddDataSourcePayload = {
	readonly name: string;
	readonly slug: string;
	readonly url: string;
};

type AddDataSourceRequestBody = {
	readonly name: string;
	readonly slug: string;
	readonly url: string;
};

export {type DataSource, type AddDataSourcePayload, type AddDataSourceRequestBody};
