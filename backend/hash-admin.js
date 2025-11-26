// backend/hash-admin.js
const bcrypt = require("bcryptjs");

async function run() {
  const password = "Admin123!"; // choose your real password here
  const hash = await bcrypt.hash(password, 10);
  console.log("Hash:\n", hash);
}

run();
