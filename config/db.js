const mongoose = require("mongoose");
const dns = require("node:dns");
const User = require("../models/User");

const dropLegacyUserIndexes = async() => {
    try {
        const indexes = await User.collection.indexes();
        const legacyUsernameIndex = indexes.find((index) => index.name === "username_1" || index?.key?.username === 1);

        if (!legacyUsernameIndex) return;

        await User.collection.dropIndex(legacyUsernameIndex.name);
        console.log(`Dropped legacy index: ${legacyUsernameIndex.name}`);
    } catch (error) {
        if (error?.codeName === "IndexNotFound") return;
        console.warn("Failed to drop legacy user index:", error.message);
    }
};

const connectDB = async() => {
    const dnsServers = (process.env.DNS_SERVERS || "8.8.8.8,1.1.1.1")
        .split(",")
        .map((server) => server.trim())
        .filter(Boolean);

    if (dnsServers.length > 0) {
        dns.setServers(dnsServers);
    }

    mongoose.set("strictQuery", true);
    mongoose.set("sanitizeFilter", true);

    await mongoose.connect(process.env.MONGODB_URI);
    await dropLegacyUserIndexes();
};

module.exports = connectDB;