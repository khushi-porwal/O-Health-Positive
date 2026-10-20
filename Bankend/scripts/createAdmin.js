
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const readline = require("readline");

dotenv.config();

const connectionDB = require("../config/db");
const Admin = require("../models/admin/Admin");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (question) =>
  new Promise((resolve) => rl.question(question, resolve));

const createAdmin = async () => {
  try {
    const name = (await ask("Admin name: ")).trim();
    const email = (await ask("Admin email: "))
      .trim()
      .toLowerCase();
    const password = await ask("Set admin password: ");

    if (!name || !email || !password) {
      throw new Error("All fields are required");
    }

    if (password.length < 12) {
      throw new Error("Use a password of at least 12 characters");
    }

    await connectionDB();

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      console.log("Admin with this email already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await Admin.create({
      name,
      email,
      password: hashedPassword,
      role: "ADMIN",
    });

    console.log("Admin created successfully.");
  } catch (error) {
    console.error("Admin creation failed:", error.message);
    process.exitCode = 1;
  } finally {
    rl.close();
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
};

createAdmin();
