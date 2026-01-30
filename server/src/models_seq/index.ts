import { Sequelize } from 'sequelize-typescript';
import { Brand } from './brand';
import { Role } from './role';
import { Contact } from './contact';
import { Vehicle } from './vehicle';
import { VehiclePhoto } from './vehicle_photo';
import { VehicleModel } from './model';
import { Observation } from './observation';
import { User } from './user';
import { initAssociations } from './models-associations';
import 'dotenv/config';

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
    models: [Role, Brand, Contact, Vehicle, VehiclePhoto, VehicleModel, Observation, User],

});
console.log(process.env.DB_HOST)
initAssociations();

export { Brand, Role, Contact, Vehicle, VehiclePhoto, VehicleModel, Observation, User };