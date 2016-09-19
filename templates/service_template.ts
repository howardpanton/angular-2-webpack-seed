export const serviceTemplate =  {
    'component': `
    import { Injectable } from '@angular/core';

    @Injectable()
    export class <%= name %>Service {

        constructor() { }

    }

    `,
    'test': `
    /* tslint:disable:no-unused-variable */

    import { TestBed, async, inject } from '@angular/core/testing';
    import { <%= name %>Service } from './<%= selector %>.service';

    describe('Service: <%= name %>', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
            providers: [<%= name %>Service]
            });
        });

        it('should ...', inject([<%= name %>Service], (service: <%= name %>Service) => {
            expect(service).toBeTruthy();
        }));
    });

`
};