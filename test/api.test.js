const request = require('supertest');
const app = require('../index');

describe('API Testings', () => {
    //tesing the test route '/test'
    // it('GET /test | Response with valid text Hello' , async () => {
    //     const response = await request(app).get('/test');
    //     expect(response.statusCode).toBe(200);
    //     expect(response.text).toEqual("Hello from express server")
      // testing all get products route '/api/product/get_products'
    it ('GET /api/product/get_products | Response with valid json data', async () => {
        const response = await request(app).get('/api/product/get_products');
        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
        expect(response.body.success).toBe(true)
        expect(response.body.message).toEqual("Products fetched successfully");
    })
     // get single product
     it ('GET /api/product/:id | Response with valid json data', async () => {
        const response = await request(app).get('/api/product/get_product/65767a3cbaf2fffdc926a306');
        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('product');
    })
    // testing user registration route '/api/user/create'
    it ('POST /api/user/create | Response with valid json data', async () => {
        const response = await request(app).post('/api/user/create').send({
            firstName: 'test',
            lastName: 'test',
            email: 'example@example.com',
            password: 'test123>'
        })
        console.log(response.body)
        // expect(response.body).toBeDefined()
        if(response.body.success){
            expect(response.body.success).toBe(true);
            expect(response.body.message).toEqual("User created successfully.");}
        else{
            expect(response.body.success).toBe(false);
            expect(response.body.message).toEqual("User already exists.");
        }
    })
    it ('POST /api/user/login | Response with valid json data', async () => {
        const response = await request(app).post('/api/user/login').send({
            email: 'admin@gmail.com',
            password: 'admin'
        })
        console.log(response.body)
        // expect(response.body).toBeDefined()
        if(response.body.success){
            expect(response.body.success).toBe(true);
            expect(response.body.message).toEqual("User logged in successfully.");}
        else{
            expect(response.body.success).toBe(false);
            expect(response.body.message).toEqual("User does not exists.");
        }
    })
    
})