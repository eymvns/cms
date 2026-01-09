const http = require('http');

console.log('🧪 Testing server...\n');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/trips',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('✅ Server is responding!');
      console.log(`📊 Total trips: ${json.trips?.length || 0}`);
      
      if (json.trips && json.trips.length > 0) {
        const firstTrip = json.trips[0];
        console.log(`\n📋 First trip:`);
        console.log(`   ${firstTrip.departure} → ${firstTrip.arrival}`);
        console.log(`   Price: ${firstTrip.price} MAD`);
        console.log(`   Date: ${new Date(firstTrip.date).toLocaleDateString()}`);
        console.log(`   Seats: ${firstTrip.availableSeats}/${firstTrip.seats}`);
      }
      
      if (json.pagination) {
        console.log(`\n📄 Pagination: Page ${json.pagination.page} of ${json.pagination.pages}`);
      }
      
      console.log('\n🎉 Everything is working!');
    } catch (e) {
      console.log('⚠️  Response:', data.substring(0, 200));
    }
    process.exit(0);
  });
});

req.on('error', (e) => {
  console.error('❌ Error:', e.message);
  console.error('💡 Make sure the server is running: npm start');
  process.exit(1);
});

req.end();

