export const componentTemplate = { 'component': `
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'as-my-<%= selector %>',
    templateUrl: './<%= selector %>.component.html',
    styleUrls: ['./<%= selector %>.component.css']
})
export class <%= name %>Component implements OnInit {

    constructor() {}

    ngOnInit() {
    }

}

`,
'css': '',
'html': `
<h1>
   <%= selector %> works!
</h1>
`,
'test': `
/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { <%= name %>Component } from './<%= selector %>.component';

describe('Component: <%= name %>', () => {
  it('should create an instance', () => {
    let component = new <%= name %>Component();
    expect(component).toBeTruthy();
  });
});

`

};