const axios = require('axios');

async function testApi() {
  try {
    const res = await axios.get('https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b&format=json&limit=10&filters[Commodity]=Potato');
    console.log("Success! Found records:", res.data.records?.length || 0);
    if (res.data.records?.length > 0) {
      console.log("Sample:", res.data.records[0]);
    } else {
      console.log("Empty records.");
    }
  } catch (err) {
    console.error("API error:", err.message);
  }
}

testApi();
