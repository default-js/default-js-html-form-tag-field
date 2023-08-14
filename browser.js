import GLOBAL from "@default-js/defaultjs-common-utils/src/Global";
import {} from "./index"

GLOBAL.defaultjs = GLOBAL.defaultjs || {};
GLOBAL.defaultjs.html = GLOBAL.defaultjs.html || {};
GLOBAL.defaultjs.html.form = GLOBAL.defaultjs.html.form;
GLOBAL.defaultjs.html.form.extfields = GLOBAL.defaultjs.html.extfields || {
	VERSION : "${version}"
};