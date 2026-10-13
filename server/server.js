if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const DB = require("./data-source");
const app = require("./app");

const PORT = process.env.PORT || 6000;

// DB Connect & Server Start
(async () => {
  try {
    await DB.connectToDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Server running smoothly at PORT ${PORT}`);
    });
  } catch (error) {
    console.error(`❌ Server failed to start: ${error.message}`);
    process.exit(1);
  }
})();
