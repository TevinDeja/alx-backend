#!/usr/bin/yarn dev
import redis from 'redis';

const client = redis.createClient();

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

client.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err.message}`);
});

// Create Hash
function createHash() {
  const hashKey = 'HolbertonSchools';
  client.hset(hashKey, 'Portland', '50', redis.print);
  client.hset(hashKey, 'Seattle', '80', redis.print);
  client.hset(hashKey, 'New York', '20', redis.print);
  client.hset(hashKey, 'Bogota', '20', redis.print);
  client.hset(hashKey, 'Cali', '40', redis.print);
  client.hset(hashKey, 'Paris', '2', redis.print);
}

// Display Hash
function displayHash() {
  client.hgetall('HolbertonSchools', (err, result) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(result);
  });
}

function main() {
  createHash();
  displayHash();
}

main();
