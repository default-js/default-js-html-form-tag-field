import { NODENAME__TAG_FIELD_INPUT_VALIDATION } from "./Constants";
import { Component, define } from "@default-js/defaultjs-html-components";
import { ExpressionResolver } from "@default-js/defaultjs-expression-language";

export const NODENAME = NODENAME__TAG_FIELD_INPUT_VALIDATION;

const MARKER__ACTIVE = "active";
const ATTR__CONDITION = "condition";

class HTMLFormTagFieldInputValidation extends Component {

	static get NODENAME() { return NODENAME; }

	#initialized = false;
	#condition = "true";

	constructor() {
		super();
	}

	async init() {
		await super.init();

		if (!this.#initialized)
			this.#condition = (this.attr(ATTR__CONDITION) || "").trim();
	}

	async validate(value) {
		if(!this.#condition.length == 0)
			return true;

		const valid =  await ExpressionResolver.resolve(this.#condition, { $value: value }, false);
		this.attr(MARKER__ACTIVE, valid ? null : "");		
		
		return valid;
	}
};

define(HTMLFormTagFieldInputValidation);
export default HTMLFormTagFieldInputValidation;