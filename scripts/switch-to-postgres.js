const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

if (schema.includes('provider = "sqlite"')) {
  schema = schema.replace('provider = "sqlite"', 'provider = "postgresql"');
  fs.writeFileSync(schemaPath, schema, 'utf8');
  console.log('✓ Successfully switched Prisma datasource provider to: postgresql');
} else if (schema.includes('provider = "postgresql"')) {
  console.log('Prisma datasource is already set to postgresql.');
} else {
  console.log('Could not identify datasource provider.');
}
