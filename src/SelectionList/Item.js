import { HTML_TAG_PREFIX } from "@default-js/defaultjs-html-form/src/Constants";
import Component from "@default-js/defaultjs-html-components/src/Component"
export const NODENAME = HTML_TAG_PREFIX + "selection-list-item";

const ATTR_ITEM_INDEX = "item-index";
const ATTRIBUTES = [ATTR_ITEM_INDEX];

class Item extends Component {
    static get observedAttributes() {
		return ATTRIBUTES;
	}
	constructor() {
		super();
	}

    async init(){

    }

    get itemIndex() {
        return parseInt(this.attr(ATTR_ITEM_INDEX));
    }
};

customElements.define(NODENAME, Item);
export default Item;
