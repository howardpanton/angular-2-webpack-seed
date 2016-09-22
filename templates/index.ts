import classTemplate = require('./class_template');
import { componentTemplate }  from './component_template';
import directiveTemplate = require('./directive_template');
import interfaceTemplate = require('./interface_template');
import pipeTemplate = require('./pipe_template');
import serviceTemplate = require('./service_template');
import { mainDevelopmentTemplate }  from './main-development_template';
import { mainProductionTemplate }  from './main-production_template';

const _ = require('lodash');

export const ensureImport: any = {
    classTemplate : classTemplate,
    componentTemplate : componentTemplate,
    directiveTemplate : directiveTemplate,
    pipeTemplate : pipeTemplate,
    serviceTemplate : serviceTemplate,
    interfaceTemplate : interfaceTemplate,
    mainDevelopmentTemplate : mainDevelopmentTemplate,
    mainProductionTemplate : mainProductionTemplate
};

export function setTemplateFiles(args: any) {
        let files: any;
        let argName = {
            value: ''
        };

        // gulp generate --component gallery
        if (_.has(args, 'component')) {
            argName.value = _.get(args, 'component');
            files = [
            {name: argName.value + '.component.ts', content: ensureImport.componentTemplate.component, type: argName.value},
            {name: argName.value + '.component.css', content: ensureImport.componentTemplate.css, type: argName.value},
            {name: argName.value + '.component.html', content: ensureImport.componentTemplate.html, type: argName.value},
            {name: argName.value + '.component.spec.ts', content: ensureImport.componentTemplate.test, type: argName.value}
            ];
        } else if (_.has(args, 'service')) {
            argName.value = _.get(args, 'service');
            files = [
            {name: argName.value + '.service.ts', content: ensureImport.serviceTemplate.component, type: argName.value},
            {name: argName.value + '.service.spec.ts', content: ensureImport.serviceTemplate.test, type: argName.value}
            ];
        } else if (_.has(args, 'class')) {
            argName.value = _.get(args, 'class');
            files = [
            {name: argName.value + '.class.ts', content: ensureImport.classTemplate.component, type: argName.value},
            {name: argName.value + '.class.spec.ts', content: ensureImport.classTemplate.test, type: argName.value}
            ];
        } else if (_.has(args, 'directive')) {
            argName.value = _.get(args, 'directive');
            files = [
            {name: argName.value + '.directive.ts', content: ensureImport.directiveTemplate.component, type: argName.value},
            {name: argName.value + '.directive.spec.ts', content: ensureImport.directiveTemplate.test, type: argName.value}
            ];
        } else if (_.has(args, 'interface')) {
            argName.value = _.get(args, 'interface');
            files = [
            {name: argName.value + '.interface.ts', content: ensureImport.interfaceTemplate.component, type: argName.value}
            ];
        } else if (_.has(args, 'pipe')) {
            argName.value = _.get(args, 'pipe');
            files = [
            {name: argName.value + '.pipe.ts', content: ensureImport.pipeTemplate.component, type: argName.value},
            {name: argName.value + '.pipe.spec.ts', content: ensureImport.pipeTemplate.test, type: argName.value}
            ];
        }

        return {files: files, argName: argName };
}
