import puppeteer from 'puppeteer';
import fs from 'node:fs';

const scrape = async () => {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();

    const url = 'https://books.toscrape.com';

    await page.goto(url);

    const books = await page.evaluate(() => {
        const bookElements = document.querySelectorAll('.product_pod');
        return Array.from(bookElements).map((book) => {
            const title = book.querySelector('h3 a').getAttribute('title');
            const price = book.querySelector('.price_color').textContent;
            const stock = book.querySelector('.instock.availability') ? 'In stock' : 'Out of stock';
            const rating = book.querySelector('.star-rating').className.split(' ')[1];
            const link = book.querySelector('h3 a').getAttribute('href');
            return { title, price, stock, rating, link };
        });
    })

    fs.writeFileSync('books.json', JSON.stringify(books, null, 2));

    await browser.close()
}

scrape().then(console.log('Data retreived')).catch(e => console.log(e));
