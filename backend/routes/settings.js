const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// GET settings
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM site_settings LIMIT 1"
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Failed to load settings"
        });
    }
});

// UPDATE settings
router.put("/", async (req, res) => {
    const {
        phone,
        whatsapp,
        email,
        address
    } = req.body;

    try {
        const result = await pool.query(
            `
      UPDATE site_settings
      SET
        phone=$1,
        whatsapp=$2,
        email=$3,
        address=$4
      WHERE id=1
      RETURNING *
      `,
            [phone, whatsapp, email, address]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: "Failed to update settings"
        });
    }
});

module.exports = router;