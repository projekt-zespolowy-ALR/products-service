import {Body, Controller, Post} from "@nestjs/common";
import {DumpService} from "./DumpService.js";
import type {DumpOffer} from "./Offer.js";

@Controller("/dump")
export class DumpController {
	private readonly dumpService: DumpService;
	public constructor(dumpService: DumpService) {
		this.dumpService = dumpService;
	}

	@Post("/")
	public async dump(@Body() dump: DumpOffer) {
		return await this.dumpService.dump(dump);
	}
}
