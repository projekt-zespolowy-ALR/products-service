import type Category from "../types/Category.js";
import type CategoryEntity from "./CategoryEntity.js";

function deentitifyCategory(categoryEntity: CategoryEntity): Category {
	return {
		id: categoryEntity.id,
		name: categoryEntity.name,
		slug: categoryEntity.slug,
	};
}

export default deentitifyCategory;
