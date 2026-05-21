const admin = require("firebase-admin");

let initialized = false;
let lastInitError = null;

const setLastInitError = (message) => {
    lastInitError = message;
};

const getFirebaseAdminInitError = () => lastInitError;

const normalizePrivateKey = (privateKey) => {
    if (typeof privateKey !== "string") return privateKey;
    return privateKey.includes("\\n") ? privateKey.replace(/\\n/g, "\n") : privateKey;
};

const hasPemMarkers = (privateKey) =>
    typeof privateKey === "string" &&
    privateKey.includes("-----BEGIN PRIVATE KEY-----") &&
    privateKey.includes("-----END PRIVATE KEY-----");

const initFirebaseAdmin = () => {
    if (initialized || admin.apps.length > 0) {
        initialized = true;
        setLastInitError(null);
        return admin;
    }

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
        const message = "Firebase Admin SDK credentials missing. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY.";
        console.error("❌ Firebase Admin SDK: Missing credentials", {
            projectId: !!projectId,
            clientEmail: !!clientEmail,
            privateKey: !!privateKey,
        });
        setLastInitError(message);
        return null;
    }

    privateKey = normalizePrivateKey(privateKey);

    if (!hasPemMarkers(privateKey)) {
        const message = "FIREBASE_PRIVATE_KEY format is invalid. It must include -----BEGIN PRIVATE KEY----- and -----END PRIVATE KEY----- markers.";
        console.error("❌ Firebase Admin SDK: Invalid private key format");
        setLastInitError(message);
        return null;
    }

    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId,
                clientEmail,
                privateKey,
            }),
        });
        setLastInitError(null);
        console.log("✅ Firebase Admin SDK initialized successfully");
    } catch (error) {
        const message = `Firebase Admin SDK initialization failed: ${error.message}`;
        console.error("❌ Firebase Admin SDK initialization failed:", error.message);
        setLastInitError(message);
        return null;
    }

    initialized = true;
    return admin;
};

module.exports = {
    initFirebaseAdmin,
    getFirebaseAdminInitError,
};