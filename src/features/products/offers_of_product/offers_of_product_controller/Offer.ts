import {Exclude, Expose} from "class-transformer";

@Exclude()
export class Offer {
	@Expose()
	public readonly productId!: string;
	@Expose()
	public readonly dataSourceId!: string;
	@Expose()
	public readonly referenceUrl!: string | null;
	@Expose()
	public readonly imageUrl!: string | null;
	@Expose()
	public readonly description!: string | null;
	@Expose()
	public readonly pricePlnAsString!: string | null;
}
