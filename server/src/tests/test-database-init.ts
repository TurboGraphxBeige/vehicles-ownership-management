import { Sequelize } from 'sequelize';
import fs from 'fs';
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

dotenv.config({
    path: path.resolve('../.env.test'),
});

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Sequelize
const sequelize = new Sequelize(process.env.DB_NAME || '', process.env.DB_USER || '', process.env.DB_PWD || '', {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres', // or 'postgres', 'sqlite', etc.
});

// Sync function
async function syncDatabase() {
    try {
        await sequelize.sync({ force: true }); // Use force: true with caution; it drops tables
        console.log("TEST Database & tables synchronized!");
        // Execute the SQL script
        //const sqlFilePath = path.join(__dirname, 'sb_init_data_import.sql');
        //var sql_string = fs.readFileSync(sqlFilePath, 'utf8');


        //await sequelize.query(sql_string);
        console.log("Test data inserted!");
    } catch (error) {
        console.error("Unable to sync database:", error);
    } finally {
        await sequelize.close();
    }
}

// Run the sync function
syncDatabase();
