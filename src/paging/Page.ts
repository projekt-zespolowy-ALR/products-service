import PageMeta from "./PageMeta.js";

class Page<T> {
	public readonly items!: T[];

	public readonly meta!: PageMeta;
}

export default Page;
