interface Category {
	id: string;
	slug: string;
	name: string;
}

interface AddCategoryPayload {
	slug: string;
	name: string;
}

type AddCategoryRequestBody = {
	readonly name: string;
	readonly slug: string;
};

export {type Category, type AddCategoryPayload, type AddCategoryRequestBody};
