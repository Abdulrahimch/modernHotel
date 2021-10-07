let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../src/index')

chai.should()
chai.use(chaiHttp)

describe('TEST BOOKING.JS FILE', () => {
    /**
    * Test the GET route
    */
    describe('GET /booking', () => {
        it('it should get all bookings', async() => {
            const res = await chai.request(server)
            console.log(res)
            res.should.have.status(200)
//                .get('/booking')
//                .end((err, res) => {
//                    res.should.have.status(200);
//                    res.body.should.be.a('object');
//                done();
//            });
        });

//        it('it should Not get all bookings', () => {
//            chai.request(server)
//                .get('/bookings')
//                .end((err, res) => {
//                    res.should.have.status(404);
//                    //res.body.should.have.property('name');
//                    //res.body.should.have.property('id').eq(1);
//                    //res.text.should.be.eq('the booking does not have the provided id');
//                    done();
//                });
//        });

    });
    /**
    * test the POST route
    */
//    describe('POST /booking', () => {
//        it('it should POST a booking', () => {
//            const booking = {
//                name: 'test',
//                email: 'test@abood.com',
//                arriveDate: 1624370400000,
//                departDate: 1624449600000,
//                roomNumber: 22,
//                account: 'guest'
//            }
//            chai.request(server)
//                .post('/booking')
//                .send(booking)
//                .end((err, res) => {
//                    res.should.have.status(201)
//                    console.log('hello test')
//                    res.body.should.be.a('object')
//                    res.body.should.have.property('name').eq('yaser');
//                    res.body.should.have.property('id').eq(1);
//                done()
//                })
//        })
//    })
});
