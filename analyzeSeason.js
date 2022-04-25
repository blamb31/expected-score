const fs = require('fs');

const median = arr => {
    const mid = Math.floor(arr.length / 2),
        nums = [...arr].sort((a, b) => parseInt(a) - parseInt(b));
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

        const expected = parseFloat(dataArr[2].split(':')[1].trim());
        const actual = parseInt(dataArr[3].split(':')[1].trim());
        const outcome = dataArr[6].split(':')[1].trim();

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
    console.log({
        totalActual,
        totalExpected,
        diff: totalActual - totalExpected,
        avgDif: (totalActual - totalExpected) / files.length,
        totalOver, totalUnder,
        avgOver: totalPointsOver / files.length,
        avgUnder: totalPointsUnder / files.length * -1,
        pointDiffInWins: pointsDiffInWins / totalWins,
        pointDiffInLosses: pointsDiffInLosses / totalLosses,
        highestOverValue: highestOver.val,
        highestOverGame: highestOver.game,
        lowestUnderValue: lowestUnder.val,
        lowestUnderGame: lowestUnder.game,
        medianDiff: median(allDiffs),
    });
}

main()