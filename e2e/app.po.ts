import { browser, element, by } from 'protractor/globals';

export class HowardAngularPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('h1')).getText();
  }
}
