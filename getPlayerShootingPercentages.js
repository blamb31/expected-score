
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    const players = await getPlayerIds(page)

    for (let player of players) {
        await getPlayerShootingStats(page, player[0])
    }

    await browser.close();
})();

async function getPlayerIds(page) {

    await page.goto('https://www.nba.com/stats/team/1610612762');

    // Waits until the `title` meta element is rendered
    await page.waitForSelector('tbody.Crom_body__UYOcU');

    const playerIds = await page.evaluate(() => {

        const tbody = document.querySelector(
            "tbody.Crom_body__UYOcU",
        );

        // iterate through the table rows
        const trs = Array.from(
            tbody.querySelectorAll("tr"),
        );

        const content = []

        // iterate through each row of table
        for (const tr of trs) {
            const tds = Array.from(tr.querySelectorAll("td a"));
            const data = tds.map((td) => {
                const link = td.getAttribute('href')
                const linkParts = link.split("/")
                const name = td.innerText;
                return { name, id: linkParts[linkParts.length - 2] }
            });

            console.log({ data })
            content.push(data)
        }

        return content;
    });


    return playerIds

}

async function getPlayerShootingStats(page, player) {
    const url = `https://www.nba.com/stats/player/${player.id}/shooting?Season=2022-23`
    await page.goto(url);
    // await page.waitForSelector('tbody.Crom_body__UYOcU');

    await page.waitForSelector("tbody.Crom_body__UYOcU");
    const playerShootingStats = await page.evaluate(async () => {

        const tbody = document.querySelectorAll("tbody.Crom_body__UYOcU");

        // iterate through the table rows
        const trs = Array.from(
            tbody[1].querySelectorAll("tr"),
        );

        const content = [];

        // iterate through each row of table
        for (const tr of trs) {
            const tds = Array.from(tr.querySelectorAll("td"));
            const data = tds.map((td) => td.innerText);

            console.log({ data })
            content.push({ distance: data[0], percentage: data[3] })
        }

        return content;
    });
    console.log(player.name)
    playerShootingStats.forEach(stat => console.log({ stat }))

}