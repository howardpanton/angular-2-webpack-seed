import { HowardAngularPage } from './app.po';

describe('howard-angular App', function() {
  let page: HowardAngularPage;

  beforeEach(() => {
    page = new HowardAngularPage();
  });

  it('should display message saying Hello from Angular 2 App with Webpack & AoT', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Hello from Angular 2 App with Webpack & AoT');
  });
});
