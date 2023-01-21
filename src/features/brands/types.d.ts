interface Brand {
	id: string;
	name: string;
	slug: string;
}

interface AddBrandPayload {
	name: string;
	slug: string;
}

export {type Brand, type AddBrandPayload};
