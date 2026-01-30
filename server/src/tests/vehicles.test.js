"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import 'supertests'
require("../server.ts");
describe('GET /users', function () {
    it('return list of users', function () {
        return request(app)
            .get('/v1/cars')
            .expect(200)
            .expect('Content-Type', /json/)
            .expect('[{"name":"ej","age":26},{"name":"jh","age":28}]');
    });
});
//# sourceMappingURL=vehicles.test.js.map