var chai = require('chai');
var chaiHttp = require('chai-http');
var User = require('../models/user');
var server = 'http://localhost:3000'
var mongoose = require('mongoose')
var bcryptjs = require("bcryptjs");
var expect = chai.expect

chai.use(chaiHttp);
require('dotenv').config()

describe('User', function(){
    this.timeout(1000000)
    before(function(done) {
        mongoose.connect(process.env.DB_TESTING, { useNewUrlParser: true }).then (function () {
            const salt = bcryptjs.genSaltSync(8);
            const hashedPassword = bcryptjs.hashSync('12345', salt);

            User.create({
              name: 'Testing',
              email : 'testing@mail.com',
              password : hashedPassword
            })
            .then ( function (user) {
                console.log("=======> before");
                done()
            })
            .catch (function (err) {
                done()
            })
        })
    })

  
    it('expect register a USER on /users/register POST', function(done) {
        chai.request(server)
          .post('/users/register')
          .send({name: 'wahyudi', email: 'wahyudi@mail.com', password: '12345'})
          .end(function(err, res){ 
              console.log(res);
              
            expect(res).to.have.status(200)  
            expect(res).be.json;
            expect(res.body).be.a('object');
            expect(res.body).have.property('message');
            expect(res.body.message).equal('user successfully registered');
            expect(res.body.message).be.a('string');
            expect(res.body).have.property('data');
            expect(res.body.data).be.a('object');
            expect(res.body.data).have.property('userId');
            expect(res.body.data).have.property('name');
            expect(res.body.data).have.property('email');
            expect(res.body.data).have.property('token');
            expect(res.body.data.name).equal('wahyudi');
            expect(res.body.data.name).be.a('string');
            expect(res.body.data.email).equal('wahyudi@mail.com');
            expect(res.body.data.email).be.a('string');
            done();
          });
      });

      it('expect login a USER on /users/login POST', function(done) {
          chai.request(server)
          .post('/users/login')
          .send({email: 'testing@mail.com', password: '12345'})
          .end(function(err, res) {
            expect(res).to.have.status(200)  
            expect(res).be.json;
            expect(res.body).be.a('object');
            expect(res.body).have.property('message');
            expect(res.body.message).equal('sign in success');
            expect(res.body.message).be.a('string');
            expect(res.body).have.property('data');
            expect(res.body.data).be.a('object');
            expect(res.body.data).have.property('userId');
            expect(res.body.data).have.property('name');
            expect(res.body.data).have.property('email');
            expect(res.body.data).have.property('token');
            expect(res.body.data.name).equal('Testing');
            expect(res.body.data.name).be.a('string');
            expect(res.body.data.email).equal('testing@mail.com');
            expect(res.body.data.email).be.a('string');
            done();
          })
      })

      it('expect get a USER on /users GET', function(done) {
          chai.request(server)
          .get('/users')
          .end(function(err, res) {
            expect(res).to.have.status(200)  
            expect(res).be.json;
            expect(res.body).be.a('object');
            expect(res.body).have.property('message');
            expect(res.body.message).equal('data users');
            expect(res.body.message).be.a('string');
            expect(res.body).have.property('data');
            expect(res.body.data).be.a('array');
            done();
          })
      })

    after(function (done) {
        mongoose.connect('mongodb://mtbcorner-test:sportident17@ds159772.mlab.com:59772/mtbcorner-test', { useNewUrlParser: true }).then (function () {
            User.collection.drop()
            .then (function () {
              console.log("=======> after");
              done()
            })
            .catch (function (err) {
                done()
            })
        })    
        
    })


})
