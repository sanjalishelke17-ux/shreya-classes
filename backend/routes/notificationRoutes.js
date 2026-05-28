const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/save-token", async (req, res) => {
    try {
        const { userId, token } = req.body;

        await pool.query(
            "UPDATE users SET fcm_token=$1 WHERE id=$2",
            [token, userId]
        );

        res.json({
            success: true,
            message: "Token saved",
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});

module.exports = router;
