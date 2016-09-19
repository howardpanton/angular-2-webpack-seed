export const directiveTemplate =  {
    'component': `
    import { Directive } from '@angular/core';

    @Directive({
    selector: '[app<%= selector %>]'
    })
    export class <%= name %>Directive {

        constructor() { }

    }

    `,
    'test': `
    /* tslint:disable:no-unused-variable */

    import { TestBed, async } from '@angular/core/testing';
    import { <%= name %> } from './<%= selector %>.directive';

    describe('Directive: <%= name %>', () => {
        it('should create an instance', () => {
            let directive = new <%= name %>Directive();
            expect(directive).toBeTruthy();
        });
    });

`
};