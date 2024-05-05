const express = require("express");
const { addAuthParams } = require("./auth");
const { doCall } = require("./request");
const { APP_KEY, APP_SECRET, API_URL, PORT } = require("./config");

const app = express();
app.use(express.json()); // 解析 JSON 格式的请求体

const cors = require("cors"); // 解决跨域问题
app.use(cors());

app.post("/score", async (req, res) => {
  const { essay } = req.body;
  const data = { q: essay, grade: "cet4" };
  addAuthParams(APP_KEY, APP_SECRET, data);
  const headers = { "Content-Type": "application/x-www-form-urlencoded" };

  try {
    const responseText = await doCall(API_URL, headers, data, "POST");
    const responseDict = JSON.parse(responseText);
    console.log("Parsed Response:", responseDict);
    const totalScore = responseDict.Result.totalScore;
    res.json({ totalScore });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
