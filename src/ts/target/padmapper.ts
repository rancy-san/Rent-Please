import * as puppeteer from 'puppeteer';
const AbstractTarget = require('./target');

class Padmapper extends AbstractTarget {
    public async search(browser:any, targetURL:string) {
        let [targetPage]:any = await browser.pages();
        await targetPage.goto(targetURL);
    }
}

module.exports = Padmapper;