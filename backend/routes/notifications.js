const express = require("express");

const router = express.Router();

const pool = require("../config/db");

// Save FCM Token
router.post("/save-token", async (req, res) => {

    try {

        const { userId, token } = req.body;

        if (!userId || !token) {

            return res.status(400).json({
                success: false,
                message: "User ID and token required",
            });
        }

        // Save token in users table
        await pool.query(

            `
            UPDATE users
            SET fcm_token = $1
            WHERE id = $2
            `,

            [token, userId]
        );

        res.json({
            success: true,
            message: "FCM token saved successfully",
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            error: err.message,
        });
    }
});

module.exports = router;