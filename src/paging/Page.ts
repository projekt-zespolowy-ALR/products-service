import {ApiProperty} from "@nestjs/swagger";

import PageMeta from "./PageMeta.js";

class Page<T> {
	@ApiProperty({isArray: true})
	public readonly data!: readonly T[];

	@ApiProperty({type: PageMeta})
	public readonly meta!: PageMeta;
}

export default Page;
