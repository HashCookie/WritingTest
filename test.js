// 导入必要的模块
const https = require("https");
const querystring = require("querystring");
const crypto = require("crypto");
const uuid = require("uuid");

// API密钥和密钥
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
    const options = {
      method: method,
      headers: headers,
    };
    const req = https.request(url, options, (res) => {
      let data = [];
      res.on("data", (chunk) => {
        data.push(chunk);
      });
      res.on("end", () => {
        resolve(Buffer.concat(data));
      });
    });

    req.on("error", (e) => {
      reject(e);
    });

    req.write(querystring.stringify(params));
    req.end();
  });
}

// 创建并发送请求
async function createRequest() {
  const q = `You should write at least 120 words but no more than 180 words`;
  const grade = "cet4";
  const title =
    "Directions: For this part, you are allowed 30 minutes to write an advertisement on your campus website to sell some of the course books you used at college. Your advertisement may include a brief description of their content, their condition and price and your contact information. You should write at least 120 words but no more than 180 words";

  const data = { q, grade, to: title };
  addAuthParams(APP_KEY, APP_SECRET, data);

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
  const response = await doCall(
    "https://openapi.youdao.com/v2/correct_writing_text",
    headers,
    data,
    "POST"
  );
  const responseText = response.toString("utf-8");
  const responseDict = JSON.parse(responseText);
  const totalScore = responseDict.Result.totalScore;
  console.log(totalScore);
  console.log(responseText);
}

// 执行函数
createRequest();
