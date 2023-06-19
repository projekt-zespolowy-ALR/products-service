import {BadRequestException, Injectable, type PipeTransform} from "@nestjs/common";
import * as uuid from "uuid";

@Injectable()
export class UUIDArrayValidationPipe implements PipeTransform<string[], string[]> {
	public transform(value: string[]): string[] {
		const isValid = value.every((item) => uuid.validate(item));
		if (!isValid) {
			throw new BadRequestException("Invalid UUIDv4 array");
		}
		return value;
	}
}
