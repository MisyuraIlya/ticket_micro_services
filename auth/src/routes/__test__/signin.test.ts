import request from "supertest";
import { app } from "../../app";

it('fails when a email that does not exist in supplied', async () => {
    return request(app)
    .post('/api/users/signin')
    .send({
        email: 'test@gmail.com',
        password: 'password'
    })
    .expect(400);
})


it('fails when a email that does not exist in supplied', async () => {
    await request(app)
    .post('/api/users/signup')
    .send({
        email: 'test@gmail.com',
        password: 'password'
    })
    .expect(201);

    await request(app)
    .post('/api/users/signin')
    .send({
        email: 'test@gmail.com',
        password: 'asdasd'
    })
    .expect(400);
})

it('responds with a cookie when given valid credentials', async () => {
    await request(app)
    .post('/api/users/signup')
    .send({
        email: 'test@gmail.com',
        password: 'password'
    })
    .expect(201);

    const response = await request(app)
    .post('/api/users/signin')
    .send({
        email: 'test@gmail.com',
        password: 'password'
    })
    .expect(200);
    expect(response.get('Set-Cookie')).toBeDefined();
})


