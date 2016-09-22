import { Component } from '@angular/core';
import '../../public/css/styles.css';
@Component({
  selector: 'as-my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'app works!';
    foo = 'bar';
 }

function doSomething() {
    console.log('foo');
}