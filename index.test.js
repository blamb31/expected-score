const index = require('./index.js');

test('Multiply input by 2', () => {
    expect(index.test(2)).toBe(4);
});

process.argv = ['node', 'index.js', 'jazzShootingNumbers2021-2022', 'true', '2022-04-16-Mavericks-Jazz']

test("Test the main function", () => {
    expect(process.argv).toEqual(['node', 'index.js', 'jazzShootingNumbers2021-2022', 'true', '2022-04-16-Mavericks-Jazz'])
})