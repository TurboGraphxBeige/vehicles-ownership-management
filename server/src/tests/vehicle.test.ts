import { expect } from 'chai';
import request from 'supertest';
import dotenv from 'dotenv';
import path from 'path';
import app from '../server.js';


import { fileURLToPath } from 'url';
import { dirname } from 'path';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

if (!process.env.CI) {
    dotenv.config({
        path: path.resolve(__dirname, '../.env'),
        override: true,
    });
    console.log( 'pathresolve', path.resolve(__dirname, '../.env') )
}


// Define the type of the response if needed
interface LoginResponse {
    token: string;
}

/*describe('POST /login', () => {
    it('should return status 200 and a token', async () => {
        const res = await request(app)
            .post('/v1/login')
            .send({
                username: process.env.API_USERNAME,
                password: process.env.API_PASSWORD
            })
            .expect(200)
            .expect('Content-Type', /json/);

        expect(res.body.token).not.to.be.null;
    });
});*/
let token: string = '';

describe('POST /login', () => {
    before('return status 200 and a token', async () => {
        const response = await request(app)
            .post('/v1/login') // Adjust as necessary
            .send({
                username: process.env.API_USERNAME,
                password: process.env.API_PASSWORD
            })
            .expect(200)
            .expect('Content-Type', /json/);

        token = response.body.token;
        expect(token).to.not.be.null; // Optional assertion to check token was received
    });

    it('return a list of vehicle object', async () => {
        const res = await request(app)
            .get('/v1/vehicles')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .expect('Content-Type', /json/)

        expect(Array.isArray(res.body))
        console.log(res.body.vehicles)

    });

    it('return an array of brands object, containing an array of models object', async () => {
        const res = await request(app)
            .get('/v1/brands')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .expect('Content-Type', /json/)

        expect(Array.isArray(res.body))
        expect(Array.isArray(res.body[0].models))
        console.log(res.body)

    });

});


