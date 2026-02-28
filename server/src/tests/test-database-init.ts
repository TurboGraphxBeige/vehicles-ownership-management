import { Sequelize } from 'sequelize-typescript';
import fs from 'fs';
import path from 'path'
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { Brand } from '../models/brand.js';
import { Role } from '../models/role.js';
import { Contact } from '../models/contact.js';
import { Vehicle } from '../models/vehicle.js';
import { VehiclePhoto } from '../models/vehicle_photo.js';
import { VehicleModel } from '../models/model.js';
import { Observation } from '../models/observation.js';
import { User } from '../models/user.js';
import { Service } from '../models/service.js';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

if (!process.env.CI) {
    dotenv.config({
        path: path.resolve(__dirname, '../.env'),
        override: true,
    });
}

const DB_HOST = process.env.DB_HOST ?? (() => { throw new Error('DB_HOST missing'); })();
const DB_USER = process.env.DB_USER ?? (() => { throw new Error('DB_USER missing'); })();
const DB_PWD = process.env.DB_PWD ?? (() => { throw new Error('DB_PASS missing'); })();
const DB_NAME = process.env.DB_NAME ?? (() => { throw new Error('DB_NAME missing'); })();


export const sequelize = new Sequelize({
    dialect: 'postgres',
    host: DB_HOST,
    username: DB_USER,
    password: DB_PWD,
    database: DB_NAME,
    port: Number(process.env.DB_PORT) || 5432,
    models: [Role, Brand, Contact, Vehicle, VehiclePhoto, VehicleModel, Observation, Service, User],
    logging: false
});

// Sync function
async function syncDatabase(): Promise<void> {
    try {
        //await sequelize.query('CREATE SCHEMA IF NOT EXISTS data;');
        await sequelize.query('CREATE SCHEMA IF NOT EXISTS data;')
        await sequelize.query('create extension if not exists pgcrypto;')
        await sequelize.sync({
            schema: 'data',
            force: true
        });

    } catch (error) {
        console.error("Unable to sync database:", error);
    }
}

async function insertTestData() {
    try {
        const sqlFilePath = path.join(__dirname, 'sb_init_data_import.sql');
        var sql_string = fs.readFileSync(sqlFilePath, 'utf8');

        await sequelize.query(sql_string);
        console.log("Test data inserted!");
        const [results, metadata] = await sequelize.query('SELECT * FROM data.user;')
        console.log(results);
    }
    catch (error) {
        console.error("Unable to insert test data in database:", error);
    }
}

// Run the sync function
async function createDatabase() {
    const max_attemps: number = 3
    let attemps: number = 0;
    while (attemps < max_attemps) {
        try {
            await sequelize.authenticate();
            break;
        }
        catch {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            attemps++
            console.log('Retrying in 1 seconds...');
        }

    }
    await syncDatabase();
    await insertTestData();
    await sequelize.close();
}

createDatabase()
