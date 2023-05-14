import {plainToClass} from "class-transformer";
import Product from "../products_controller/Product.js";
import type ProductEntity from "./ProductEntity.js";

export default function deentityifyProductEntity(productEntity: ProductEntity): Product {
	return plainToClass(Product, productEntity);
}
