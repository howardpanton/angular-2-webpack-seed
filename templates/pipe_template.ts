export const pipeTemplate =  {
    'component': `
    import { Pipe, PipeTransform } from '@angular/core';

    @Pipe({
    name: '<%= selector %>'
    })
    export class <%= name %>Pipe implements PipeTransform {

        transform(value: any, args?: any): any {
            return null;
        }

    }

    `,
    'test': `
    /* tslint:disable:no-unused-variable */

    import { TestBed, async } from '@angular/core/testing';
    import { <%= name %>Pipe } from './<%= selector %>.pipe';

    describe('Pipe: <%= name %>', () => {
        it('create an instance', () => {
            let pipe = new <%= name %>Pipe();
            expect(pipe).toBeTruthy();
        });
    });

`
};