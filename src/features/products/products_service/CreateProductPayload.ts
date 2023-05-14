export default class CreateProductPayload {
	public readonly brandId!: string;

	public readonly slug!: string;

	public readonly massKilograms!: number | null;

	public readonly volumeLiters!: number | null;

	public readonly name!: string;
}
