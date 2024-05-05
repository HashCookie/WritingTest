const express = require("express");
const https = require("https");
const querystring = require("querystring");
const crypto = require("crypto");
const uuid = require("uuid");
const app = express();
app.use(express.json());

const cors = require("cors");
app.use(cors());

// API密钥和密钥xxxxx
const APP_KEY = "62c2cdf10e77d810";
const APP_SECRET = "OIQC0HxQzq0dT7ItonlA7z1DMTYFdGxp";

// 鉴权参数添加函数
function addAuthParams(appKey, appSecret, params) {
  const q = params.q || params.img;
  const salt = uuid.v1();
  const curtime = Math.floor(Date.now() / 1000).toString();
  const sign = calculateSign(appKey, appSecret, q, salt, curtime);

  params.appKey = appKey;
  params.salt = salt;
  params.curtime = curtime;
  params.signType = "v3";
  params.sign = sign;
}

// 签名计算函数
function calculateSign(appKey, appSecret, q, salt, curtime) {
  const input = getInput(q);
  const strSrc = appKey + input + salt + curtime + appSecret;
  return encrypt(strSrc);
}

// 加密函数
function encrypt(strSrc) {
  const hash = crypto.createHash("sha256");
  hash.update(strSrc);
  return hash.digest("hex");
}

// 输入处理函数
function getInput(input) {
  if (!input) return input;
  const inputLen = input.length;
  return inputLen <= 20
    ? input
    : input.substring(0, 10) + inputLen + input.substring(inputLen - 10);
}

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
  const { essay } = req.body; // 假设前端传递的作文内容字段是essay
  const data = { q: essay }; // 只传递作文内容

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
