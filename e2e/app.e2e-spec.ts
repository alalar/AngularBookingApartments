import { AngularBookingApartmentPage } from './app.po';

describe('angular-booking-apartment App', () => {
  let page: AngularBookingApartmentPage;

  beforeEach(() => {
    page = new AngularBookingApartmentPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
