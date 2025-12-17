// routes/store.js
const express = require("express");
const storeController = require("../controllers/store.controller");

const router = express.Router();

router.get("/:id/download-report", storeController.downloadStoreReport);

module.exports = router;
