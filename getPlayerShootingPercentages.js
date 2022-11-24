const puppeteer = require('puppeteer');

const getAllPlayerShootingStats = async () => {
    const browser = await puppeteer.launch({ headless: false, timeout: 0 });

    //Get the player ids on the roster
    const playerInfo = await getPlayerIds(browser)
    const players = playerInfo.playerIds
    const teamName = playerInfo.teamName

    //Get shooting stats for each player and print them
    const allStats = []
    for (let player of players) {
        allStats.push(await getPlayerShootingStats(browser, player[0]))
    }

    const prettyStats = {}
    prettyStats[teamName] = {}
    allStats.forEach(stat => {
        const playerName = stat[0].name
        prettyStats[teamName][playerName] = {}
        stat.shift()
        stat.slice(0, 7).forEach(ss => {
            let prettyDistance = null;
            switch (ss.distance) {
                case "Less Than 5 ft.":
                    prettyDistance = "_0_4"
                    break
                case "5-9 ft.":
                    prettyDistance = "_5_9"
                    break
                case "10-14 ft.":
                    prettyDistance = "_10_14"
                    break
                case "15-19 ft.":
                    prettyDistance = "_15_19"
                    break
                case "20-24 ft.":
                    prettyDistance = "_20_24"
                    break
                case "25-29 ft.":
                    prettyDistance = "_25_29"
                    break
                case "ft":
                    prettyDistance = "ft"
                    break
            }
            prettyStats[teamName][playerName][prettyDistance] = ss.percentage
        })
    })

    //Close the browser
    browser.close()
    return prettyStats
}

const getPlayerIds = async (browser) => {
    const page = await browser.newPage();


    await page.goto('https://www.nba.com/stats/team/1610612762', { timeout: 0 });



    // Waits until the `title` meta element is rendered
    await page.waitForSelector('tbody.Crom_body__UYOcU');

    const teamName = await page.evaluate(async () => {
        return document.querySelectorAll("div.TeamHeader_name__MmHlP > div")[1].innerText
    })

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

            content.push(data)
        }

        return content;
    });

    return { teamName, playerIds }

}

const getPlayerShootingStats = async (browser, player) => {
    const page = await browser.newPage();

    const url = `https://www.nba.com/stats/player/${player.id}/shooting?Season=2022-23`

    await page.goto(url, { timeout: 0 });


    // await page.waitForSelector('tbody.Crom_body__UYOcU');

    await page.waitForSelector("tbody");

    const playerShootingStats = await page.evaluate(async () => {

        const tbody = document.querySelectorAll("tbody");

        // iterate through the table rows
        const trs = Array.from(
            tbody[1].querySelectorAll("tr"),
        );

        const content = [];

        // iterate through each row of table
        for (const tr of trs) {
            const tds = Array.from(tr.querySelectorAll("td"));
            const data = tds.map((td) => td.innerText);

            content.push({ distance: data[0], percentage: data[3] })
        }

        return content;
    });

    await page.goto(`https://www.nba.com/stats/player/${player.id}/traditional`, { timeout: 0 });


    await page.waitForSelector("tbody.Crom_body__UYOcU");

    const playerFtPercentage = await page.evaluate(async () => {

        const tbody = document.querySelectorAll("tbody.Crom_body__UYOcU");

        // iterate through the table rows
        const trs = Array.from(
            tbody[0].querySelectorAll("tr"),
        );

        let content = null

        // iterate through each row of table
        for (const tr of trs) {
            const tds = Array.from(tr.querySelectorAll("td"));
            const data = tds.map((td) => td.innerText);

            content = { distance: "ft", percentage: data[12] }
        }

        return content;
    });

    return [player, playerFtPercentage, ...playerShootingStats]
}

getAllPlayerShootingStats()

module.exports = {
    getAllPlayerShootingStats
}