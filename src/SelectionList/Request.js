import { HTML_TAG_PREFIX } from "@default-js/defaultjs-html-form/src/Constants";
import {Requester} from "@default-js/defaultjs-dynamic-requester";
export const NODENAME = HTML_TAG_PREFIX + "request";

class Request extends HTMLElement {
	constructor() {
		super();
		this.style.display = "none";
	}

	get request() {
		try {
			return JSON.parse(this.textContent);
		} catch (e) {
			console.error(e);
		}
		return null;
    }

    execute({context}){
        if(!this.requester)
            this.requester = new Requester(this.request);
        return this.requester.execute({context})
    }
};

customElements.define(NODENAME, Request);
export default Request;
