import { Page } from "@playwright/test"

export const clickButton = (page: Page, text: string): Promise<void> => {
    return page.getByRole('button')
        .filter({ hasText: text })
        .click()
}

export const fillValue = async (page: Page, id: string, value): Promise<void> => {
    const input = await page.getByTestId(id).locator('input');
    await input.fill(value);
}
