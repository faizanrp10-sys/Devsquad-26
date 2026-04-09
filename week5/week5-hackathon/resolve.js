const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const srvHost = '_mongodb._tcp.cluster0.mnbpo5p.mongodb.net';
const txtHost = 'cluster0.mnbpo5p.mongodb.net';

console.log(`Resolving SRV for ${srvHost}...`);
dns.resolveSrv(srvHost, (err, addresses) => {
  if (err) {
    console.error('SRV Error:', err);
    process.exit(1);
  }
  console.log('SRV Records:', addresses);
  
  console.log(`Resolving TXT for ${txtHost}...`);
  dns.resolveTxt(txtHost, (err, txts) => {
    if (err) {
       console.error('TXT Error:', err);
    } else {
       console.log('TXT Records:', txts);
    }
    
    // Construct standard connection string
    const hosts = addresses.map(a => `${a.name}:${a.port}`).join(',');
    const txtOpts = txts ? txts.flat().join('&') : '';
    console.log('\n--- EXTRACTED MONGODB URI FORMAT ---');
    console.log(`mongodb://${hosts}/?ssl=true&${txtOpts}`);
  });
});
