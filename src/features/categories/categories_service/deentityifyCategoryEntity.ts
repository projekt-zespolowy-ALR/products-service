import {plainToClass} from "class-transformer";
import Category from "../categories_controller/Category.js";
import type CategoryEntity from "./CategoryEntity.js";

export default function deentityifyCategoryEntity(categoryEntity: CategoryEntity): Category {
	return plainToClass(Category, categoryEntity);
}
