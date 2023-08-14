import "@default-js/defaultjs-html-components/src/components/Pagination";
import Request, { NODENAME as RequestNodeName } from "./Request";
import Item, { NODENAME as ItemNodeName } from "./Item";
import BaseField from "@default-js/defaultjs-html-form/src/BaseField";
import { HTML_TAG_PREFIX } from "@default-js/defaultjs-html-form/src/Constants";
import { Renderer, Template } from "@default-js/defaultjs-template-language";
import Resolver from "@default-js/defaultjs-expression-language/src/ExpressionResolver";

export const NODENAME = HTML_TAG_PREFIX + "selection-list";
const ATTR_TEMPLATE = "template";
const ATTR_REQUEST_PAGE_SIZE = "request-page-size";
const ATTR_RESPONSE_ITEMS = "response-items";
const ATTR_RESPONSE_PAGE_COUNT = "response-page-count";
const ATTRIBUTES = [ATTR_TEMPLATE, ATTR_RESPONSE_ITEMS, ATTR_RESPONSE_PAGE_COUNT, ATTR_REQUEST_PAGE_SIZE];
const TEMPLATE = `
<div class="${NODENAME}-filter"><input class="${NODENAME}-filter-input" type="text">
	<button class="${NODENAME}-filter-button">filter</button>
</div>
<div class="${NODENAME}-content"></div>
<d-pagination class="${NODENAME}-pagination" size="9" disable-shadow-dom></d-pagination>`;

const getItemTemplate = (node) => {
	let template = node.find(":scope > template").first();
	if (!!template) return template;
	const value = node.attr(ATTR_TEMPLATE);
	if (!value) return TEMPLATE;
	try {
		template = find(value).first();
		if (!!template) return template;
	} catch (e) {}
	return new URL(value, location.href);
};

const buildTemplate = async (node) => {
	const itemTemplate = await Template.load(getItemTemplate(node));
	const template = create(
		`
	<jstl jstl-foreach="\${$items}" jstl-foreach-var="$data">
		<${ItemNodeName} item-index="\${status.index}"></${ItemNodeName}>
	</jstl>
	`,
		true,
	);

	const container = template.content.find(ItemNodeName).first();
	container.append(itemTemplate.template.content.childNodes);
	return Template.load(template, false);
};
class SelectionList extends BaseField {
	static get observedAttributes() {
		return ATTRIBUTES.concat(BaseField.observedAttributes);
	}

	constructor() {
		super();
		this.initialized = false;

		this.on("d-pagination-to-page", (event) => {
			const {target, detail:[page]} = event;

			this.context.$paging.page = page;
			this.render();
			event.preventDefault();
			event.stopPropagation();
		})
	}

	async init() {
		this.initialized = false;
		this.initSelectionList();
	}

	async initSelectionList() {
		await this.initBaseField();
		this.append(TEMPLATE);
		this.filterInput = this.find(`.${NODENAME}-filter input`).first();
		this.filterButton = this.find(`.${NODENAME}-filter button`).first();
		this.container = this.find(`.${NODENAME}-content`).first();
		this.pagination = this.find("d-pagination").first();
		this.request = this.find(RequestNodeName).first();

		const template = await buildTemplate(this);
		this.renderer = new Renderer({ template });

		this.context = {
			$input: {},
			$paging: {
				page: 1,
				pages: 0,
				pageSize: parseInt(this.attr(ATTR_REQUEST_PAGE_SIZE) || "10"),
			},
		};

		if (this.active) this.render();
		this.initialized = true;
	}

	async activeUpdated() {
		if (this.active && this.initialized) this.render();
	}

	readonlyUpdated() {}

	async updatedValue() {}

	async render () {
		if(!this.initialized) return;

		const { request, container, form, renderer, pagination, context } = this;
		let response = await request.execute({
			context: {
				$data: form.data,
				$paging: context.$paging,
			}
		});
		response = await response.json();
		context.$response = response;
		context.$items = await Resolver.resolve(this.attr(ATTR_RESPONSE_ITEMS), context, []);
		context.$paging.pages = await Resolver.resolve(this.attr(ATTR_RESPONSE_PAGE_COUNT), context, 0);
	
		renderer.render({ container, data: context });
	
		pagination.attr("page", context.$paging.page).attr("count", context.$paging.pages);
	};
}

customElements.define(NODENAME, SelectionList);
export default SelectionList;
