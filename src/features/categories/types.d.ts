interface Category {
	id: string;
	slug: string;
	name: string;
}

interface AddCategoryPayload {
	slug: string;
	name: string;
}

export {type Category, type AddCategoryPayload};
