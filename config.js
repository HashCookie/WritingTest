require("dotenv").config();

module.exports = {
  APP_KEY: process.env.APP_KEY,
  APP_SECRET: process.env.APP_SECRET,
  API_URL: "https://openapi.youdao.com/v2/correct_writing_text",
  PORT: process.env.PORT || 3000,
};
