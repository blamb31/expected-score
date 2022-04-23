const fs = require('fs');

const median = arr => {
    const mid = Math.floor(arr.length / 2),
        nums = [...arr].sort((a, b) => a - b);
    return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};

const main = async () => {
    const files = fs.readdirSync('./results');

    let totalExpected = 0;
    let totalActual = 0;

    let totalOver = 0;
    let totalUnder = 0;

    let totalPointsOver = 0;
    let totalPointsUnder = 0;

    let pointsDiffInWins = 0;
    let pointsDiffInLosses = 0;

    let totalWins = 0;
    let totalLosses = 0;

    let highestOver = { val: 0, game: null };
    let lowestUnder = { val: 0, game: null };

    let allDiffs = [];

    //read file
    files.forEach(file => {
        const data = fs.readFileSync(`./results/${file}`, 'utf8');
        const dataArr = data.split('\n');

        const expected = parseInt(dataArr[0].split(':')[1].trim());
        const actual = parseInt(dataArr[1].split(':')[1].trim());
        const outcome = dataArr[4].split(':')[1].trim();

        allDiffs.push(actual - expected);

        totalExpected += expected;
        totalActual += actual;

        if (actual >= expected) {
            totalOver += 1;
            totalPointsOver += actual - expected;
        } else {
            totalUnder += 1;
            totalPointsUnder += expected - actual;
        }

        if (outcome === "Win") {
            totalWins += 1;
            pointsDiffInWins += (actual - expected)
        } else {
            totalLosses += 1;
            pointsDiffInLosses += (actual - expected)
        }

        if (actual - expected > highestOver.val) {
            highestOver.val = actual - expected;
            highestOver.game = file;
        }
        if (expected - actual < lowestUnder.val) {
            lowestUnder.val = actual - expected;
            lowestUnder.game = file;
        }

    });
}

main()