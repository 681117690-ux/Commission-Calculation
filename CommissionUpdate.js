const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

// 1. ราคาสินค้าต่อหน่วยตาม Spec
const LOCK_PRICE = 45.0;
const STOCK_PRICE = 30.0;
const BARREL_PRICE = 25.0;

// 2. ช่วงขอบเขตข้อมูลที่ถูกต้อง (Boundary Specs)
const SPECS = {
    locks: { min: 1, max: 70, name: "Locks" },
    stocks: { min: 1, max: 80, name: "Stocks" },
    barrels: { min: 1, max: 90, name: "Barrels" }
};

/**
 * ฟังก์ชันรับค่า และตรวจสอบความถูกต้อง (Input Validation & Boundary Checking)
 */
async function parseInput(promptText, min, max, itemName) {
    while (true) {
        const rawInput = await askQuestion(promptText);
        const trimmed = rawInput.trim().toLowerCase();

        // คำสั่งออกจากโปรแกรม
        if (trimmed === 'exit' || trimmed === 'q') {
            return 'EXIT';
        }

        const num = Number(trimmed);

        // ตรวจสอบว่าเป็นชนิดข้อมูลตัวเลขจำนวนเต็มหรือไม่
        if (trimmed === "" || isNaN(num) || !Number.isInteger(num)) {
            console.log(`❌ Invalid input! Please enter a valid integer for ${itemName}.`);
            continue;
        }

        // ตรวจสอบการผ่านขอบเขต (Range Checking)
        if (num < min || num > max) {
            console.log(`⚠️ Out of Range! ${itemName} must be between ${min} and ${max}.`);
            continue;
        }

        return num;
    }
}

/**
 * ฟังก์ชันคำนวณยอดขายและค่าคอมมิชชันตาม Pseudocode ที่ถูกต้อง 100%
 */
function calculateCommission(locks, stocks, barrels) {
    const lockSales = LOCK_PRICE * locks;
    const stockSales = STOCK_PRICE * stocks;
    const barrelSales = BARREL_PRICE * barrels;
    const sales = lockSales + stockSales + barrelSales;

    let commission = 0.0;
    if (sales >= 1800.0) {
        // หัก 1800.0 สำหรับส่วนเกินยอด $1,800
        commission = (0.10 * 1000.0) + (0.15 * 800.0) + (0.20 * (sales - 1800.0));
    } else if (sales >= 1000.0) {
        commission = (0.10 * 1000.0) + (0.15 * (sales - 1000.0));
    } else {
        commission = 0.10 * sales;
    }

    return {
        lockSales,
        stockSales,
        barrelSales,
        sales,
        commission
    };
}

async function main() {
    console.log("=================================================");
    console.log("  Commission Calculation Program (Correct Spec)  ");
    console.log("=================================================");
    console.log("Type 'exit' or 'q' at any prompt to quit.\n");

    while (true) {
        // รับค่า Locks
        const locks = await parseInput(
            `Enter number of Locks (${SPECS.locks.min}-${SPECS.locks.max}): `,
            SPECS.locks.min,
            SPECS.locks.max,
            SPECS.locks.name
        );
        if (locks === 'EXIT') break;

        // รับค่า Stocks
        const stocks = await parseInput(
            `Enter number of Stocks (${SPECS.stocks.min}-${SPECS.stocks.max}): `,
            SPECS.stocks.min,
            SPECS.stocks.max,
            SPECS.stocks.name
        );
        if (stocks === 'EXIT') break;

        // รับค่า Barrels
        const barrels = await parseInput(
            `Enter number of Barrels (${SPECS.barrels.min}-${SPECS.barrels.max}): `,
            SPECS.barrels.min,
            SPECS.barrels.max,
            SPECS.barrels.name
        );
        if (barrels === 'EXIT') break;

        // คำนวณผลลัพธ์
        const result = calculateCommission(locks, stocks, barrels);

        // แสดงผลลัพธ์ตามโครงสร้าง Pseudocode Spec
        console.log("\n---------------- RESULTS ----------------");
        console.log(`Locks sold   : ${locks} ($${result.lockSales.toFixed(2)})`);
        console.log(`Stocks sold  : ${stocks} ($${result.stockSales.toFixed(2)})`);
        console.log(`Barrels sold : ${barrels} ($${result.barrelSales.toFixed(2)})`);
        console.log(`Total Sales  : $${result.sales.toFixed(2)}`);
        console.log(`Commission   : $${result.commission.toFixed(2)}`);
        console.log("-----------------------------------------\n");
    }

    console.log("\nProgram exited gracefully. Goodbye!");
    rl.close();
}

main();