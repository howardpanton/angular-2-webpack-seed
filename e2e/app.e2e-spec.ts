import { HowardAngularPage } from './app.po';

describe('howard-angular App', function() {
  let page: HowardAngularPage;

  beforeEach(() => {
    page = new HowardAngularPage();
  });

  it('should display message saying Hello from Howard Angular 2 App with Webpack', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Hello from Howard Angular 2 App with Webpack');
  });
});
