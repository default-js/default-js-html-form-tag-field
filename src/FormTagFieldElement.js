import { NODENAME__TAG_FIELD, NODENAME__TAG_FIELD_INPUT_VALIDATION} from "./Constants";
import { define } from "@default-js/defaultjs-html-components";
import { BaseField } from "@default-js/defaultjs-html-form";
import { Renderer } from "@default-js/defaultjs-template-language";
import { toTemplateLoader } from "./Helper";
import "./FormTagFieldInputValidationElement";

const NODENAME = NODENAME__TAG_FIELD;
const TEMPLATE__ROOT = toTemplateLoader(`/${NODENAME}/root.tpl.html`);
const TEMPLATE__ITEM = toTemplateLoader(`/${NODENAME}/item.tpl.html`);
const KEYCODE__ENTER = 13;

export const EVENT_REMOVE_TAG = `${NODENAME}:action:remove`;
export const EVENT_ADD_VALUE = `${NODENAME}:action:add-value`;

const MARKER__TAG_ITEM = "tag-item";
const ATTR__TAG_ITEM_VALUE = "tag-item-value";
const ATTR__TYPE = "type";
const ATTR__PLACEHOLDER = "placeholder";

const DEFAULT_TYPE = "text";
const SUPPORED_TYPES = [DEFAULT_TYPE, "url", "tel", "email", "number"];

const ATTRIBUTES = [];


class HTMLTagField extends BaseField {
	static get observedAttributes() {
		return ATTRIBUTES.concat(BaseField.observedAttributes);
	}

	static get NODENAME() {
		return NODENAME;
	}

	#initialize = false;
	#tagContainer = null;
	#inputValidations = [];
	#input = null;
	#initValues = new Set();
	#values = new Set();

	constructor() {
		super();

		const root = this.root;
		root.on(EVENT_REMOVE_TAG, (event) => {
			event.preventDefault()
			event.stopPropagation();
			const target = event.target;

			const tag = target.parent(`[${MARKER__TAG_ITEM}]`);
			if (tag) {
				const value = tag.attr(ATTR__TAG_ITEM_VALUE);
				this.#values.delete(value);
				tag.remove();
				this.publishValue();
			}
		});

		root.on(EVENT_ADD_VALUE, (event) => {
			event.preventDefault()
			event.stopPropagation();
			const input = this.#input;
			const value = event.detail;
			(async () => {
				if (value) {

					if (input)
						input.value = null;

					if (!this.#values.has(value)) {
						this.#values.add(value);
						this.#renderValue(value);
						this.publishValue();
					}
				}
			})();
		});
	}



	async init() {
		if (!this.#initialize) {
			const root = this.root;
			let type = (this.attr(ATTR__TYPE) || DEFAULT_TYPE).trim().toLowerCase();
			if (!SUPPORED_TYPES.includes(type))
				type = DEFAULT_TYPE;
			const placeholder = this.attr(ATTR__PLACEHOLDER) || "Press \"Enter\" for value";
			await Renderer.render({ container: root, data: { type, placeholder }, template: await TEMPLATE__ROOT(), mode: "prepend" });

			this.#inputValidations = Array.from(root.find(NODENAME__TAG_FIELD_INPUT_VALIDATION));

			this.#tagContainer = root.find("[tag-container]").first();
			const input = this.#input = root.find("input").first();

			input.on("keypress", (event) => {
				const { keyCode, target } = event;
				if (target != input || keyCode != KEYCODE__ENTER)
					return;

				event.preventDefault()
				event.stopPropagation();

				(async () => {

					const value = (input.value || "").trim();
					if (value.length <= 0)
						return;

					input.setCustomValidity("");
					const valid = await this.#acceptInput(value);
					if (!valid)
						input.setCustomValidity("invalid");

					input.checkValidity();
					const validity = input.validity;
					if (validity.valid)
						this.trigger(EVENT_ADD_VALUE, value);

					if (!validity.customError)
						input.reportValidity();

					input.setCustomValidity("");
				})();
			});
		}

		await super.init();
	}

	async #acceptInput(value) {
		if (this.#inputValidations) {
			const results = await Promise.all(this.#inputValidations.map((item) => item.validate(value)))
			return !results.includes(false);
		}

		return true;
	}


	async readonlyUpdated() {
		await this.ready;
		const readonly = this.readonly;
		this.#input.attr("disabled", readonly ? "" : null);
	}

	async publishValue() {
		const values = this.#values && this.#values.size > 0 ? Array.from(this.#values) : null;
		super.publishValue(values);
	}

	async #renderValue(value) {
		const initValues = this.#initValues;
		const container = this.#tagContainer;
		const template = await TEMPLATE__ITEM();

		await Renderer.render({
			container, template, data: {
				isNew: !initValues.has(value),
				title: value,
				value
			}, mode: "append"
		});
	}

	async #renderValues() {
		const values = Array.from(this.#values);
		const container = this.#tagContainer;
		container.empty();
		return Promise.all(values.sort().map((value) => this.#renderValue(value)));
	}

	async acceptValue(value) {
		return value == null || typeof value === "undefined" || value instanceof Array || value instanceof Set;
	}

	async normalizeValue(value) {
		return value ? value.filter((item) => !!item) : null;
	}

	async updatedValue(value) {
		await this.ready;
		value = (await value || []);
		this.#initValues = new Set(value);
		this.#values = new Set(value);
		this.#renderValues();
		return super.updatedValue(value);
	}
};

define(HTMLTagField);
export default HTMLTagField;