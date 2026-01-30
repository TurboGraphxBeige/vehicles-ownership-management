import { expect } from 'chai';
import request from 'supertest';
import app from '../server.ts'; // Import from compiled dist folder

describe('Vehicles Endpoint', () => {
    it('GET /vehicles', async () => {
        const res = await request(app).get('/vehicles');
        // assertions...
    });
});
