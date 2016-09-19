export const classTemplate =  {
    'component': `
export class <%= name %> {

}
    `,
    'test': `
/* tslint:disable:no-unused-variable */

import { addProviders, async, inject } from '@angular/core/testing';
import {<%= name %>} from './<%= selector %>';

describe('<%= name %>', () => {
    it('should create an instance', () => {
        expect(new <%= name %>()).toBeTruthy();
    });
});

`
};