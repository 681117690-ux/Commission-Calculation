const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

async function parseInput(promptText) {
    const rawInput = await askQuestion(promptText);
    const trimmed = rawInput.trim();
    const num = Number(trimmed);

    if (trimmed === "" || isNaN(num) || !Number.isInteger(num)) {
        console.log("Invalid input! Please enter a valid integer.");
        return null;
    }

    return num;
}

async function main() {
    // Line 7-9: กำหนดราคาสินค้า
    const LOCK_PRICE = 45.0;
    const STOCK_PRICE = 30.0;
    const BARREL_PRICE = 25.0;

    console.log("=== Commission Program (Correct Pseudocode Logic) ===\n");

    while (true) {
        // Line 13 & 15: รับค่าอินพุต
        const locks = await parseInput("Enter number of Locks (1-70): ");
        if (locks === null) continue;

        const stocks = await parseInput("Enter number of Stocks (1-80): ");
        if (stocks === null) continue;

        const barrels = await parseInput("Enter number of Barrels (1-90): ");
        if (barrels === null) continue;

        // Line 24-27: คำนวณยอดขายรวม
        const lockSales = LOCK_PRICE * locks;
        const stockSales = STOCK_PRICE * stocks;
        const barrelSales = BARREL_PRICE * barrels;
        const sales = lockSales + stockSales + barrelSales;

        // Line 29-41: คำนวณค่าคอมมิชชันตามสูตร Pseudocode ที่ถูกต้อง
        let commission = 0.0;
        if (sales >= 1800.0) {
            // Line 31-33: หัก -1800.0 ตาม Spec
            commission = (0.10 * 1000.0) + (0.15 * 800.0) + (0.20 * (sales - 1800.0));
        } else if (sales >= 1000.0) {
            // Line 36-37
            commission = (0.10 * 1000.0) + (0.15 * (sales - 1000.0));
        } else {
            // Line 39
            commission = 0.10 * sales;
        }

        // Line 21-23, 28, 42: แสดงผลลัพธ์ตามโครงสร้าง Pseudocode
        console.log(`\nLocks sold: ${locks}`);
        console.log(`Stocks sold: ${stocks}`);
        console.log(`Barrels sold: ${barrels}`);
        console.log(`Total sales: $${sales}`);
        console.log(`Commission is $${commission}`);
        console.log("\n-----------------------------------\n");
    }
}

main();