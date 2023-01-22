type DataSource = {
	readonly id: string;
	readonly name: string;
	readonly slug: string;
	readonly url: string;
};

type AddDataSourcePayload = {
	name: string;
	slug: string;
	url: string;
};

export {type DataSource, type AddDataSourcePayload};
