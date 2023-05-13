import {plainToClass} from "class-transformer";
import Brand from "../brands_controller/Brand.js";
import type BrandEntity from "./BrandEntity.js";

export default function deentityifyBrandEntity(brandEntity: BrandEntity): Brand {
	return plainToClass(Brand, brandEntity);
}
