import { PREFIX__NODENAME } from "./Constants";
import GLOBAL from "@default-js/defaultjs-common-utils/src/Global";
import { SERVICEURL } from "@default-js/defaultjs-common-utils/src/ServiceHelper";
import { Template } from "@default-js/defaultjs-template-language";

const getBaseTemplatePath = () => {
    return GLOBAL.DEFAULTJS_HTML_FORM_FIELD__BASE_TEMPLATE_PATH || ""
};

export const toTemplateLoader = (templatePath) => {
    let template = null;

    return async () => {
        if(!template)
            template = Template.load(new URL(`${getBaseTemplatePath()}${templatePath}`, SERVICEURL));

        return template;
    };
};

export const toNodename = (name) => {
    return `${PREFIX__NODENAME}${name}`;
};