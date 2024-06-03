import request from "supertest";
import {app} from '../../app';
import { response } from "express";
import { Ticket } from "../../models/ticket";

it('has a route handler listening to /api/tickets for post requests',  async () => {
    const response = await request(app)
    .post('/api/tickets')
    .send({});

    expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is sigend in',  async () => {
    await request(app)
    .post('/api/tickets')
    .send({})
    .expect(401)
});

it('returns a status other than 401 if the user is signed in', async () => {
    const cookie = global.signin() 
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({})
    expect(response.status).not.toEqual(401);

})

it('retuns an error in an invalid title is provided',  async () => {
    await request(app)
    .post('/api/tickets')
    .set('Cookie',global.signin())
    .send({
        title:'',
        price:10
    })
    .expect(400);

    await request(app)
    .post('/api/tickets')
    .set('Cookie',global.signin())
    .send({
        price:10
    })
    .expect(400);

});

it('returns an error if an invalied price is provided',  async () => {
    await request(app)
    .post('/api/tickets')
    .set('Cookie',global.signin())
    .send({
        title:'test',
        price: -10
    })
    .expect(400);

    await request(app)
    .post('/api/tickets')
    .set('Cookie',global.signin())
    .send({
        title:'test',
    })
    .expect(400);
});

it('creates a ticket with valied inputs',  async () => {
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    const title = 'test'
    await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        title:title,
        price:20
    })
    .expect(201)

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].price).toEqual(20);
    expect(tickets[0].title).toEqual(title)
});