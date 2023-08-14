import GLOBAL from "@default-js/defaultjs-common-utils/src/Global";
import { SERVICEURL } from "@default-js/defaultjs-common-utils/src/ServiceHelper";
import { toAsyncTemplateLoader } from "@default-js/defaultjs-template-language";

const getBaseTemplatePath = () => {
    return GLOBAL.DEFAULTJS_HTML_FORM_FIELD__BASE_TEMPLATE_PATH || ""
};

export const toTemplateLoader = (templatePath) => {
    return toAsyncTemplateLoader(() => new URL(`${getBaseTemplatePath()}${templatePath}`, SERVICEURL));
};