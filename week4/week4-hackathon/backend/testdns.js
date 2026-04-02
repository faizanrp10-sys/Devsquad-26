const dns = require('dns');
const fs = require('fs');

dns.setServers(['8.8.8.8']); // Use Google DNS

dns.resolveSrv('_mongodb._tcp.cluster0.mnbpo5p.mongodb.net', (err, addresses) => {
    if (err) {
        fs.writeFileSync('dns_result.txt', 'Error: ' + err.message);
    } else {
        const sorted = addresses.sort((a,b) => a.priority - b.priority || a.weight - b.weight);
        const map = sorted.map(a => `${a.name}:${a.port}`).join(',');
        fs.writeFileSync('dns_result.txt', `Success: ${map}`);
    }
});
