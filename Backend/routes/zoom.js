const express = require("express");

const {
  saveZoomLink,
  getZoomLink,
} = require("../controllers/zoomController");

const router = express.Router();

router.post("/", saveZoomLink);

router.get("/:idTutor", getZoomLink);

module.exports = router;