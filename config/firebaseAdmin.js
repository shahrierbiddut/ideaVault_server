const admin = require("firebase-admin");

let initialized = false;

const initFirebaseAdmin = () => {
    if (initialized || admin.apps.length > 0) {
        initialized = true;
        return admin;
    }

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
        console.error("❌ Firebase Admin SDK: Missing credentials", {
            projectId: !!projectId,
            clientEmail: !!clientEmail,
            privateKey: !!privateKey,
        });
        return null;
    }

    // Handle both escaped newlines from .env and actual newlines
    if (typeof privateKey === "string") {
        if (privateKey.includes("\\n")) {
            privateKey = privateKey.replace(/\\n/g, "\n");
        }
    }

    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId,
                clientEmail,
                privateKey,
            }),
        });
        console.log("✅ Firebase Admin SDK initialized successfully");
    } catch (error) {
        console.error("❌ Firebase Admin SDK initialization failed:", error.message);
        return null;
    }

    initialized = true;
    return admin;
};

module.exports = initFirebaseAdmin;