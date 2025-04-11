const express = require("express");
const router = express.Router();
const candidateController = require("../controllers/candidateController");
const { protect } = require("../middlewares/authMiddleware");
const { upload } = require("../middlewares/uploadMiddleware");

router.post("/", protect, upload.single("resume"), candidateController.createCandidate);

router.get("/", protect, candidateController.getAllCandidates);

router.get("/:id", protect, candidateController.getCandidateById);

router.get("/download/:id", protect, candidateController.downloadResume);

router.put("/:id", protect, candidateController.updateCandidate);

router.delete("/:id", protect, candidateController.deleteCandidate);

router.post("/promote/:id", protect, candidateController.promoteToEmployee);

module.exports = router;
