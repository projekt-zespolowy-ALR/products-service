type AddProductInDataSourcePayload = {
	readonly dataSourceId: string;
	readonly referenceUrl?: string | null | undefined;
	readonly imageUrl?: string | null | undefined;
	readonly price?: number | null | undefined;
	readonly description?: string | null | undefined;
};

export default AddProductInDataSourcePayload;
