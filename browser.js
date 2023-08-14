import GLOBAL from "@default-js/defaultjs-common-utils/src/Global";
import "@default-js/defaultjs-html-form/browser";
import { FormTagFieldElement } from "./index";

GLOBAL.defaultjs = GLOBAL.defaultjs || {};
GLOBAL.defaultjs.html = GLOBAL.defaultjs.html || {};
GLOBAL.defaultjs.html.form = GLOBAL.defaultjs.html.form || {};
GLOBAL.defaultjs.html.form.fields = GLOBAL.defaultjs.html.forms.fields || {};
GLOBAL.defaultjs.html.form.fields.FormTagFieldElement = GLOBAL.defaultjs.html.form.fields.FormTagFieldElement || FormTagFieldElement;
