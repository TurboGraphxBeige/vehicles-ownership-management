// src/models/index
import { Pool } from "pg";
import { Sequelize, Model } from 'sequelize-typescript';
//const { Sequelize, Model, DataTypes } = require('sequelize');
import path from "path";


export * from './vehicles.model';
export * from './vehicles.model';
export * from './users';

const pool = new Pool({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    maxLifetimeSeconds: 60,
});




//export { sequelize };


export { pool }