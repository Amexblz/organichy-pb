const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

if (schema.includes('provider = "postgresql"')) {
  schema = schema.replace('provider = "postgresql"', 'provider = "sqlite"');
  fs.writeFileSync(schemaPath, schema, 'utf8');
  console.log('✓ Successfully switched Prisma datasource provider to: sqlite');
} else if (schema.includes('provider = "sqlite"')) {
  console.log('Prisma datasource is already set to sqlite.');
} else {
  console.log('Could not identify datasource provider.');
}
