const express = require("express");
const https = require("https");
const querystring = require("querystring");
const { addAuthParams } = require("./auth");
const app = express();
app.use(express.json());

const cors = require("cors");
app.use(cors());

const APP_KEY = "62c2cdf10e77d810";
const APP_SECRET = "OIQC0HxQzq0dT7ItonlA7z1DMTYFdGxp";

// 发送请求函数
function doCall(url, headers, params, method) {
  return new Promise((resolve, reject) => {
    // 确保URL是经过编码的
    const req = https.request(url, { method, headers }, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        resolve(data);
      });
    });

    req.on("error", (e) => {
      reject(e);
    });

    // 将params转换为query string
    const queryString = querystring.stringify(params);
    req.setHeader("Content-Length", Buffer.byteLength(queryString));
    req.write(queryString);
    req.end();
  });
}

// 处理评分的路由
app.post("/score", async (req, res) => {
  const { essay } = req.body; // 从请求体中提取essay
  const grade = "cet4"; // 固定设置grade为"cet4"

  const data = { q: essay, grade: grade }; // 在请求数据中包含essay和固定的grade

  // 添加鉴权参数
  addAuthParams(APP_KEY, APP_SECRET, data);

  // 设置请求头
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  try {
    // 发起请求
    const responseText = await doCall(
      "https://openapi.youdao.com/v2/correct_writing_text",
      headers,
      data,
      "POST"
    );

    // 解析返回的JSON数据
    const responseDict = JSON.parse(responseText);
    console.log("Parsed Response:", responseDict);

    // 提取分数并返回
    const totalScore = responseDict.Result.totalScore;
    res.json({ totalScore }); // 发送JSON响应
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// 设置监听端口
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
