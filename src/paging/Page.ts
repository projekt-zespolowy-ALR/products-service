import {plainToClass} from "class-transformer";

import PageMeta from "./PageMeta.js";

class Page<T> {
	public readonly data!: readonly T[];

	public readonly meta!: PageMeta;

	public map<A>(mapper: (item: T, index: number, array: readonly T[]) => A): Page<A> {
		return plainToClass(Page, {
			data: this.data.map(mapper),
			meta: this.meta,
		}) as Page<A>;
	}
}

export default Page;
