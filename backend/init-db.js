import db from './db.js';

const initDatabase = async () => {
  try {
    console.log('Checking database connection...');
    
    await db.query('SELECT 1 as test');
    console.log('Database connection successful');
    
    const [tables] = await db.query('SHOW TABLES');
    console.log('Existing tables:', tables.map(t => Object.values(t)[0]));
    
    if (tables.length === 0) {
      console.log('Warning: No tables found. Database may not be initialized properly.');
      console.log('Make sure the schema file is in the correct location: db-init/001_schema.sql');
    } else {
      console.log('Database tables found - initialization successful');
    }
    
  } catch (error) {
    console.error('Database initialization check failed:', error.message);
    process.exit(1);
  }
};

export default initDatabase;
