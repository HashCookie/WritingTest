const crypto = require("crypto");
const uuid = require("uuid");

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

module.exports = {
  addAuthParams,
};
