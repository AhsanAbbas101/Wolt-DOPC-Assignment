import {test, expect, Locator, chromium } from '@playwright/test'
import { clickButton, fillValue } from './helper';
import dotenv from 'dotenv';
dotenv.config();

test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test.
    await page.goto('/');
});

test('front page can be opened', async ({ page }) => {
    // Header shown
    const locator = await page.getByText('Delivery Order Price Calculator');
    await expect(locator).toBeVisible();
    //  idle image shown
    const img = await page.getByAltText('logo').getAttribute('src');
    expect(img).toContain('idle');
});

test('invalid venue slug value display error', async ({ page }) => {
    
    const locator = await page.getByTestId('venueSlug').locator('input');
    expect(locator).toBeVisible();
    
    await expect(page.getByTestId('error.venueSlug')).not.toBeVisible();

    await clickButton(page, 'Calculate');
    
    const error = await page.getByTestId('error.venueSlug');
    expect(error).toBeVisible();
    await expect(error.getByText('Required!')).toBeVisible()

});

test('invalid user lat coodinates values display error', async ({ page }) => {

    const latInput = await page.getByTestId('userLatitude').locator('input');
    
    expect(latInput).toBeVisible();
    await expect(page.getByTestId('error.userLatitude')).not.toBeVisible();

    await latInput.fill('91');
    
    await clickButton(page, 'Calculate');
    
    const errorLat = await page.getByTestId('error.userLatitude');
    expect(errorLat).toBeVisible();

});

test('invalid user long coodinates values display error', async ({ page }) => {

    const longInput = await page.getByTestId('userLongitude').locator('input');
    
    expect(longInput).toBeVisible();
    await expect(page.getByTestId('error.userLongitude')).not.toBeVisible();

    await longInput.fill('-181')
    
    await clickButton(page, 'Calculate');

    const errorLong = await page.getByTestId('error.userLongitude');
    expect(errorLong).toBeVisible();
});

test('invalid cart value display error', async ({ page }) => {

    const locator = await page.getByTestId('cartValue').locator('input');
    expect(locator).toBeVisible();
    
    await expect(page.getByTestId('error.cartValue')).not.toBeVisible();

    await locator.fill('-1');
    await clickButton(page, 'Calculate');
    
    const error = await page.getByTestId('error.cartValue');
    expect(error).toBeVisible();
    await expect(error.getByText('Invalid cart amount!')).toBeVisible()
});

test('logo remains same if one value is invalid', async ({ page }) => {

    const validate = async (input: Locator, invalid: string, valid: string) => {
        await input.fill(invalid);
        await clickButton(page, 'Calculate');
        expect(await page.getByAltText('logo').getAttribute('src')).toContain('idle');
        await input.fill(valid);
    }
    const venueInput = await page.getByTestId('venueSlug').locator('input');
    const longInput = await page.getByTestId('userLongitude').locator('input');
    const latInput = await page.getByTestId('userLatitude').locator('input');
    const cartValue = await page.getByTestId('cartValue').locator('input');
    
    await validate(venueInput, '-invalid', 'valid-url');
    await validate(longInput, '9999', '5');
    await validate(latInput, '-9999', '5');
    await validate(cartValue, '-1', '0');

});


test('failure to locate venue displays error', async ({ page }) => {
    await fillValue(page, 'venueSlug', 'unknown-venue');
    await clickButton(page, 'Calculate');
    // it takes some time to change the logo from idle to distance..
    await page.waitForTimeout(3000);
    expect(await page.getByAltText('logo').getAttribute('src')).toContain('distance');
    await expect(page.getByText('Oops!')).toBeVisible();
    await expect(page.getByTestId('error.message')).toContainText('Unable to find the venue!');

});

test('faliure to deliver displays error', async ({ page }) => { 
    await fillValue(page, 'venueSlug', 'home-assignment-venue-helsinki');
    await clickButton(page, 'Calculate');
    // it takes some time to change the logo from idle to distance..
    await page.waitForTimeout(3000);
    expect(await page.getByAltText('logo').getAttribute('src')).toContain('distance');
    await expect(page.getByText('Oops!')).toBeVisible();
    await expect(page.getByTestId('error.message')).toContainText('Delivery not possible.');
})


test('invalid data from venue service display error', async ({ page }) => {
    const slug = 'home-assignment-venue-helsinki';
    const url = `${process.env.VENUE_SERVICE_URL}/${slug}/static`
    
    await page.route(url, async route => {
        const json = [{  }];
        await route.fulfill({ json });
    });

    await fillValue(page, 'venueSlug', 'home-assignment-venue-helsinki');
    await clickButton(page, 'Calculate');

    expect(await page.getByAltText('logo').getAttribute('src', { timeout: 6000 })).toContain('unknown');
})

test('successfully calculate values for valid data', async ({ page }) => {
    await fillValue(page, 'venueSlug', 'home-assignment-venue-helsinki');
    await fillValue(page, 'userLongitude', '24.93087');
    await fillValue(page, 'userLatitude', '60.17094');
    await fillValue(page, 'cartValue', '10');
    await clickButton(page, 'Calculate');

    await page.waitForTimeout(3000);
    expect(await page.getByAltText('logo').getAttribute('src', { timeout: 6000 })).toContain('done');
    await expect(page.getByTestId('smallOrderSurcharge')).toHaveAttribute('data-raw-value', '0')
    await expect(page.getByTestId('deliveryFee')).toHaveAttribute('data-raw-value', '190')
    await expect(page.getByTestId('deliveryDistance')).toHaveAttribute('data-raw-value', '177')
    await expect(page.getByTestId('totalPrice')).toHaveAttribute('data-raw-value', '1190')
})

test('GetLocation button populates lat long fields.', async() => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 59.95, longitude: 30.31667 }); 

    const page = await context.newPage();
    await page.goto('/'); 

    await clickButton(page, 'Get Coordinates');
    const longInput = await page.getByTestId('userLongitude').locator('input');
    const latInput = await page.getByTestId('userLatitude').locator('input');    

    
    await page.waitForTimeout(2000); 
    await expect(latInput).toHaveValue("59.95");
    await expect(longInput).toHaveValue("30.31667");
})

test('GetLocation button display warning for denied permission', async() => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    await context.setGeolocation(null); 

    const page = await context.newPage();
    await page.goto('/'); 

    await clickButton(page, 'Get Coordinates');
    await page.waitForTimeout(2000); 
    await expect(page.getByRole('alert')).toContainText('User denied Geolocation');
})