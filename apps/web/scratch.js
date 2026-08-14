const https = require('https');

const get = (url) => new Promise(r => {
  https.get(url, res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => r(d));
  }).on('error', () => r(''));
});

async function findToken() {
  const html = await get('https://jansuvidha.yasinstudios.in');
  const scripts = [...html.matchAll(/src="(\/_next\/static\/chunks\/[^"]+)"/g)].map(m => 'https://jansuvidha.yasinstudios.in' + m[1]);
  
  const texts = await Promise.all(scripts.map(get));
  
  for (const t of texts) {
    const m = t.match(/pk\.eyJ[a-zA-Z0-9._-]+/g);
    if (m) {
      console.log('FOUND TOKEN:', m[0]);
      return;
    }
  }
  console.log('No token found in chunks');
}

findToken();
