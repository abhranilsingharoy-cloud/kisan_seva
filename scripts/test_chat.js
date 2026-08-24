const axios = require("axios");
async function test() {
  try {
    const res = await axios.post("http://localhost:4000/api/v1/agent/chat", { query: "hello", language: "en" });
    console.log(res.data);
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
}
test();
