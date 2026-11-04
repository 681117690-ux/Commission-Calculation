const readline = require('readline');

// ANSI Color Codes
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const CYAN = "\x1b[36m";
const RESET = "\x1b[0m";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

// 1. Test Oracle (Expected Output): ผลลัพธ์ที่ถูกต้อง 100% ตาม Spec
function getExpectedOutput(rawLocks, rawStocks, rawBarrels) {
    if (rawLocks === null || rawStocks === null || rawBarrels === null ||
        rawLocks === "" || rawStocks === "" || rawBarrels === "" ||
        String(rawLocks).toLowerCase() === "null" ||
        String(rawStocks).toLowerCase() === "null" ||
        String(rawBarrels).toLowerCase() === "null") {
        return "Type mismatch Error";
    }

    const locks = Number(rawLocks);
    const stocks = Number(rawStocks);
    const barrels = Number(rawBarrels);

    if (isNaN(locks) || isNaN(stocks) || isNaN(barrels) ||
        !Number.isInteger(locks) || !Number.isInteger(stocks) || !Number.isInteger(barrels)) {
        return "Type mismatch Error";
    }

    if (locks < 1 || locks > 70 || stocks < 1 || stocks > 80 || barrels < 1 || barrels > 90) {
        return "Out of Boundary Error";
    }

    const sales = (45.0 * locks) + (30.0 * stocks) + (25.0 * barrels);

    let commission = 0.0;
    if (sales >= 1800.0) {
        commission = (0.10 * 1000.0) + (0.15 * 800.0) + (0.20 * (sales - 1800.0));
    } else if (sales >= 1000.0) {
        commission = (0.10 * 1000.0) + (0.15 * (sales - 1000.0));
    } else {
        commission = 0.10 * sales;
    }

    return `Locks sold: ${locks}, Stocks sold: ${stocks}, Barrels sold: ${barrels}, Total sales: $${sales}, Commission is $${Math.floor(commission)}`;
}

// 2. Program Under Test

// 2.1 โค้ดเดิมที่มี Bug (Comission.js)
function testLegacyProgram(rawLocks, rawStocks, rawBarrels) {
    const validate = (val) => {
        if (val === null || val === undefined || val === "" || String(val).toLowerCase() === "null") {
            return "Type mismatch Error";
        }
        const trimmed = String(val).trim();
        const num = Number(trimmed);
        if (isNaN(num) || !Number.isInteger(num)) {
            return "Type mismatch Error";
        }
        return num;
    };

    const locks = validate(rawLocks);
    const stocks = validate(rawStocks);
    const barrels = validate(rawBarrels);

    if (typeof locks === "string") return locks;
    if (typeof stocks === "string") return stocks;
    if (typeof barrels === "string") return barrels;

    const sales = (45.0 * locks) + (30.0 * stocks) + (25.0 * barrels);

    // Bug 1: ใช้ -1200 แทน -1800
    let commission = 0.0;
    if (sales >= 1800.0) {
        commission = (0.10 * 1000.0) + (0.15 * 800.0) + (0.20 * (sales - 1200.0));
    } else if (sales >= 1000.0) {
        commission = (0.10 * 1000.0) + (0.15 * (sales - 1000.0));
    } else {
        commission = 0.10 * sales;
    }

    // Bug 2: พิมพ์ stocks ซ้ำ
    return `commission for ${locks} locks ${stocks} stocks ${barrels} stocks is ${Math.floor(commission)}`;
}

// 2.2 โค้ดใหม่ที่แก้ไขแล้ว (CommissionUpdate.js)
function testUpdatedProgram(rawLocks, rawStocks, rawBarrels) {
    if (rawLocks === null || rawStocks === null || rawBarrels === null ||
        rawLocks === "" || rawStocks === "" || rawBarrels === "" ||
        String(rawLocks).toLowerCase() === "null" ||
        String(rawStocks).toLowerCase() === "null" ||
        String(rawBarrels).toLowerCase() === "null") {
        return "Type mismatch Error";
    }

    const locks = Number(rawLocks);
    const stocks = Number(rawStocks);
    const barrels = Number(rawBarrels);

    if (isNaN(locks) || isNaN(stocks) || isNaN(barrels) ||
        !Number.isInteger(locks) || !Number.isInteger(stocks) || !Number.isInteger(barrels)) {
        return "Type mismatch Error";
    }

    if (locks < 1 || locks > 70 || stocks < 1 || stocks > 80 || barrels < 1 || barrels > 90) {
        return "Out of Boundary Error";
    }

    const sales = (45.0 * locks) + (30.0 * stocks) + (25.0 * barrels);

    let commission = 0.0;
    if (sales >= 1800.0) {
        commission = (0.10 * 1000.0) + (0.15 * 800.0) + (0.20 * (sales - 1800.0));
    } else if (sales >= 1000.0) {
        commission = (0.10 * 1000.0) + (0.15 * (sales - 1000.0));
    } else {
        commission = 0.10 * sales;
    }

    return `Locks sold: ${locks}, Stocks sold: ${stocks}, Barrels sold: ${barrels}, Total sales: $${sales}, Commission is $${Math.floor(commission)}`;
}

// 3. ชุดข้อมูล Test Cases ทั้งหมด (31 ข้อ)
const testCases = [
    { id: 1, category: "Locks nom", locks: 35, stocks: 40, barrels: 45 },
    { id: 2, category: "Locks min-", locks: 0, stocks: 40, barrels: 45 },
    { id: 3, category: "Locks min", locks: 1, stocks: 40, barrels: 45 },
    { id: 4, category: "Locks min+", locks: 2, stocks: 40, barrels: 45 },
    { id: 5, category: "Locks max-", locks: 69, stocks: 40, barrels: 45 },
    { id: 6, category: "Locks max", locks: 70, stocks: 40, barrels: 45 },
    { id: 7, category: "Locks max+", locks: 71, stocks: 40, barrels: 45 },
    { id: 8, category: "Locks -1", locks: -1, stocks: 40, barrels: 45 },
    { id: 9, category: "Locks Letter", locks: "a", stocks: 40, barrels: 45 },
    { id: 10, category: "Locks Float", locks: 0.5, stocks: 40, barrels: 45 },
    { id: 11, category: "Locks Null", locks: null, stocks: 40, barrels: 45 },
    { id: 12, category: "Stocks min-", locks: 35, stocks: 0, barrels: 45 },
    { id: 13, category: "Stocks min", locks: 35, stocks: 1, barrels: 45 },
    { id: 14, category: "Stocks min+", locks: 35, stocks: 2, barrels: 45 },
    { id: 15, category: "Stocks max-", locks: 35, stocks: 79, barrels: 45 },
    { id: 16, category: "Stocks max", locks: 35, stocks: 80, barrels: 45 },
    { id: 17, category: "Stocks max+", locks: 35, stocks: 81, barrels: 45 },
    { id: 18, category: "Stocks -1", locks: 35, stocks: -1, barrels: 45 },
    { id: 19, category: "Stocks Letter", locks: 35, stocks: "a", barrels: 45 },
    { id: 20, category: "Stocks Float", locks: 35, stocks: 0.5, barrels: 45 },
    { id: 21, category: "Stocks Null", locks: 35, stocks: null, barrels: 45 },
    { id: 22, category: "Barrels min-", locks: 35, stocks: 40, barrels: 0 },
    { id: 23, category: "Barrels min", locks: 35, stocks: 40, barrels: 1 },
    { id: 24, category: "Barrels min+", locks: 35, stocks: 40, barrels: 2 },
    { id: 25, category: "Barrels max-", locks: 35, stocks: 40, barrels: 89 },
    { id: 26, category: "Barrels max", locks: 35, stocks: 40, barrels: 90 },
    { id: 27, category: "Barrels max+", locks: 35, stocks: 40, barrels: 91 },
    { id: 28, category: "Barrels -1", locks: 35, stocks: 40, barrels: -1 },
    { id: 29, category: "Barrels Letter", locks: 35, stocks: 40, barrels: "a" },
    { id: 30, category: "Barrels Float", locks: 35, stocks: 40, barrels: 0.5 },
    { id: 31, category: "Barrels Null", locks: 35, stocks: 40, barrels: null }
];

// 4. ฟังก์ชันรันเทสเคสทั้งหมดทันที
function runTestSuite(fileName, targetFunc) {
    console.log(`\n=================== TESTING FILE: ${CYAN}${fileName}${RESET} ===================\n`);

    const line = "-----------------------------------------------------------------------------------------";
    console.log(line);
    console.log(`| ${"TC#".padEnd(4)} | ${"Test Case".padEnd(16)} | ${"Input (L,S,B)".padEnd(15)} | ${"Verdict".padEnd(7)} | ${"Actual Output"}`);
    console.log(line);

    let passCount = 0;
    let failCount = 0;

    testCases.forEach(tc => {
        const expected = getExpectedOutput(tc.locks, tc.stocks, tc.barrels);
        const actual = targetFunc(tc.locks, tc.stocks, tc.barrels);
        const isPass = (expected === actual);

        if (isPass) passCount++; else failCount++;

        const verdictText = isPass ? `${GREEN}PASS ${RESET}` : `${RED}FAIL ${RESET}`;

        console.log(
            `| ${String(tc.id).padEnd(4)} ` +
            `| ${tc.category.padEnd(16)} ` +
            `| ${`${tc.locks}, ${tc.stocks}, ${tc.barrels}`.padEnd(15)} ` +
            `| ${verdictText} ` +
            `| ${actual}`
        );
    });

    console.log(line);
    console.log(`Summary (${fileName}): Total ${testCases.length} | ${GREEN}PASS: ${passCount}${RESET} | ${RED}FAIL: ${failCount}${RESET}\n`);
}

// 5. เมนูหลักแบบกระชับ
async function mainMenu() {
    while (true) {
        console.log("=========================================");
        console.log("       SELECT FILE TO RUN TEST SUITE     ");
        console.log("=========================================");
        console.log("1. Run Test on Comission.js        (Legacy Buggy Code)");
        console.log("2. Run Test on CommissionUpdate.js (Corrected Code)");
        console.log("0. Exit");
        console.log("-----------------------------------------");

        const choice = (await askQuestion("Select Option (0-2): ")).trim();

        if (choice === '1') {
            runTestSuite("Comission.js", testLegacyProgram);
        } else if (choice === '2') {
            runTestSuite("CommissionUpdate.js", testUpdatedProgram);
        } else if (choice === '0') {
            console.log("\nExiting Test Suite. Goodbye!");
            rl.close();
            break;
        } else {
            console.log(`${RED}\nInvalid choice! Please select 0, 1, or 2.${RESET}\n`);
        }
    }
}

mainMenu();