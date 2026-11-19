import { expect, test } from '@playwright/test';

test('guest can add Audi TT to Garage', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Guest log in', exact: true }).click();

  const isGarage = (url: URL) => url.pathname === '/panel/garage';
  await expect(page).toHaveURL(isGarage);

  const addCar = page.getByRole('button', { name: 'Add car', exact: true });
  await expect(addCar).toBeVisible();

  const audiTtTitle = page
    .getByText('Audi TT', { exact: true })
    .filter({ visible: true });
  const audiTtCards = page
    .getByRole('list')
    .getByRole('listitem')
    .filter({ has: audiTtTitle, visible: true });
  const countBefore = await audiTtCards.count();

  await addCar.click();

  const form = page.getByRole('dialog');
  await form.getByRole('combobox', { name: 'Brand', exact: true })
    .selectOption({ label: 'Audi' });
  await form.getByRole('combobox', { name: 'Model', exact: true })
    .selectOption({ label: 'TT' });
  await form.getByRole('spinbutton', { name: 'Mileage', exact: true }).fill('12000');
  await form.getByRole('button', { name: 'Add', exact: true }).click();

  await expect(form).toBeHidden();
  await expect(page).toHaveURL(isGarage);
  await expect(audiTtCards).toHaveCount(countBefore + 1);
});
