const express = require("express");
const multer = require("multer");
const inventoryController = require("../controllers/inventory.controller");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("file"), inventoryController.uploadInventory);

module.exports = router;
