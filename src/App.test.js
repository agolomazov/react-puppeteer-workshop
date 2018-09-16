const puppeteer = require('puppeteer');
const faker = require('faker');
const devices = require('puppeteer/DeviceDescriptors');
const iPhone = devices['iPhone 6'];

const user = {
	email: faker.internet.email(),
	password: 'test',
	firstName: faker.name.firstName(),
	lastName: faker.name.lastName(),
};

const isDebugging = (debug = false) => {
	const debugging_mode = {
		headless: false,
		slowMo: 100,
		devtools: true,
	};
	return debug ? debugging_mode : {};
};

let browser = null;
let page = null;

beforeAll(async () => {
	browser = await puppeteer.launch(isDebugging(true));
	page = await browser.newPage();
	await page.goto('http://localhost:3000');
	page.setViewport({ width: 500, height: 1000 });
});

afterAll(async () => {
	browser.close();
});

describe('on page load', () => {
	test(
		'h1 loads correctly',
		async () => {
			const html = await page.$eval('h1.App-title', el => el.innerHTML);
			expect(html).toBe('Welcome to React');
		},
		200000
	);

	test(
		'nav loads correctly',
		async () => {
			const navbar = await page.$eval('.navbar', el => (el ? true : false));
			const listItems = await page.$$('.nav-li');

			expect(navbar).toBe(true);
			// await page.screenshot({
			// 	path: 'result.png',
			// 	fullPage: true,
			// });
			expect(listItems.length).toBe(4);
		},
		20000
	);

	describe('login form', () => {
		test(
			'fills out form and submits',
			async () => {
				await page.setCookie({
					name: 'JWT',
					value: 'kdkdkdkdk',
				});

				const firstName = await page.$('[data-testid="firstName"]');
				const lastName = await page.$('[data-testid="lastName"]');
				const password = await page.$('[data-testid="password"]');
				const email = await page.$('[data-testid="email"]');
				const submit = await page.$('[data-testid="submit"]');

				await firstName.tap();
				await page.type('[data-testid="firstName"]', user.firstName);

				await lastName.tap();
				await page.type('[data-testid="lastName"]', user.lastName);

				await password.tap();
				await page.type('[data-testid="password"]', user.password);

				await email.tap();
				await page.type('[data-testid="email"]', user.email);

				await submit.tap();

				await page.waitForSelector('[data-testid="success"]');
			},
			1000000
		);

		test('sets firstName cookie', async () => {
			const cookie = await page.cookies();
			const firstNameCookie = cookie.find(c => c.name === 'firstName' && c.value === user.firstName);

			expect(firstNameCookie).not.toBeUndefined();
		});
	});
});
