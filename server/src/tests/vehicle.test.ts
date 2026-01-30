import { expect } from 'chai';
import request from 'supertest';
import dotenv from 'dotenv';
import path from 'path';
import app from '../server';

dotenv.config({
    path: path.resolve('src/tests/.env.test'),
});

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
    before(async () => {
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

    it('should return status 200 and a token', async () => {
        const res = await request(app)
            .get('/v1/vehicles')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .expect('Content-Type', /json/);
            console.log(res.body)

    });
});
