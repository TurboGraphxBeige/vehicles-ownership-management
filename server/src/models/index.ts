import { Sequelize } from 'sequelize-typescript';
import { Brand } from './brand.js';
import { Role } from './role.js';
import { Contact } from './contact.js';
import { Vehicle } from './vehicle.js';
import { VehiclePhoto } from './vehicle_photo.js';
import { VehicleModel } from './model.js';
import { Observation } from './observation.js';
import { User } from './user.js';
import { Service } from './service.js';
import { initAssociations } from './models-associations.js';
import dotenv from "dotenv";
import path from "path";
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

async function initialize() {
    try {
        // Authenticate connection
        await sequelize.authenticate();
        console.log('Database connection established');

        // Synchronize models
        await sequelize.createSchema('data',{})
        await sequelize.sync({
            schema: 'data',
            alter: true
        });

        console.log('Models synchronized');
        await sequelize.query('SELECT schema_name FROM information_schema.schemata;')
        await sequelize.query('SELECT table_schema,table_name FROM information_schema.tables;')
    } catch (error) {
        console.error('Database initialization error:', error);
        throw error;
    }
}

await initialize();

await sequelize.sync({
    force: false, // Set to true to drop and recreate tables
    alter: true   // Safely alter existing tables
});


initAssociations();

export { Brand, Role, Contact, Service, VehiclePhoto, VehicleModel, Observation, User, Vehicle };