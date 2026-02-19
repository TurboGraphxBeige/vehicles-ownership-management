import { Sequelize } from 'sequelize';
import fs from 'fs';
import path from 'path'
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

if (!process.env.CI) {
    dotenv.config({
        path: path.resolve(__dirname, '../.env'),
        override: true,
    });
}

// Initialize Sequelize
const sequelize = new Sequelize(process.env.DB_NAME || '', process.env.DB_USER || '', process.env.DB_PWD || '', {
    port: Number(process.env.DB_PORT) || 5432,
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres', // or 'postgres', 'sqlite', etc.
});

// Sync function
async function syncDatabase() {
    try {
        await sequelize.query('CREATE SCHEMA IF NOT EXISTS data;');
        await sequelize.sync({ force: true }); // Use force: true with caution; it drops tables
        console.log("TEST Database & tables synchronized!");
        // Execute the SQL script
        const sqlFilePath = path.join(__dirname, 'sb_init_data_import.sql');
        var sql_string = fs.readFileSync(sqlFilePath, 'utf8');


        await sequelize.query(sql_string);
        console.log("Test data inserted!");
    } catch (error) {
        console.error("Unable to sync database:", error);
    } finally {
        await sequelize.close();
    }
}

// Run the sync function
syncDatabase();
