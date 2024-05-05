const https = require("https");
const querystring = require("querystring");

function doCall(url, headers, params, method) {
  return new Promise((resolve, reject) => {
    const options = { method, headers };
    const req = https.request(url, options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
    });
    req.on("error", (e) => reject(e));
    const queryString = querystring.stringify(params);
    req.setHeader("Content-Length", Buffer.byteLength(queryString));
    req.write(queryString);
    req.end();
  });
}

module.exports = { doCall };
