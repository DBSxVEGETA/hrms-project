const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logoutUser } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/checkAuth", protect, (req, res) => {
  res.json({
    isAuthenticated: true,
    user: req.user, 
  });
});
router.post("/logout", logoutUser);

module.exports = router;
