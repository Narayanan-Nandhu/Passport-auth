var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../index');

var should = chai.should();
var expect = require('chai').expect;
const request = require('supertest')

var Book = "";
try{
    Book=require('../models').Book;
}catch(err){
    Book={};
};
var User="";
try{
    User = require('../models').User;
}catch(err){
    User={};
}
chai.use(chaiHttp);

describe('Book API', function() {
  //Before each test we empty the database
  before(function(done) {
    Book.destroy({
      where: {},
      truncate: true
    });
    User.destroy({
      where: {},
      truncate: true
    });
    User.create({
      username: '123test',
      email: 'test123@gmail.com',
      password: '123test',
    }).then(function(user) {
     chai.request(app).post('/signin')
     .set({'content-type': 'application/x-www-form-urlencoded'})
     .send({'username': user.username, 'password': user.password })
     .end(function(err, res) {
       console.log("res SignCall=> ")
        expect(res.statusCode).to.equal(200);
        expect('Location', '/books');
        done()
      });;
    });
  });

  describe('/GET books', function() {
    it('Getting all books', function(done) {
      chai.request(app).get('/books').end(function(err, res) {
        res.should.have.status(200);
        res.body.should.be.a('array');
        done();
      });
    });
  });
  describe('/POST books', function() {
    it('Insert new book', function(done) {
      var book = {
        title: 'Jack Ma',
        author: 'Chen Wei',
        category: 'Biography'
      }
      chai.request(app).post('/books').set({'content-type': 'application/x-www-form-urlencoded'})
      .send(book)
      .end(function(err, res) {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
    });
  });
  describe('/GET/:id books', function() {
    it('Get book by id', function(done) {
      Book.create({
        title: 'Jack Ma',
        author: 'Chen Wei',
        category: 'Biography'
      }).then(function(book) {
        chai.request(app).get('/books/' + book.id).end(function(err, res) {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
      });
    });
    it('Get book by not existed id', function(done) {
      chai.request(app).get('/books/100').end(function(err, res) {
        res.should.have.status(400);
        res.text.should.equal('Book not found');
        done();
      })
    });
    it('Get book by invalid id', function(done) {
      chai.request(app).get('/books/abc').end(function(err, res) {
        res.should.have.status(400);
        res.text.should.equal('Invalid ID supplied');
        done();
      });
    });
  });
  describe('/PUT/:id books', function() {
    it('Update book by id', function(done) {
      Book.create({
        title: 'Jack Ma',
        author: 'Chen Wei',
        category: 'Biography'
      }).then(function(book) {
        var bookEdit = {
          title: 'Amor Fati',
          author: 'Rando Kim',
          category: 'Non Fiction'
        }
        chai.request(app).put('/books/' + book.id).send(bookEdit).end(function(err, res) {
          res.should.have.status(200);
          res.body.should.be.a('array');
          done();
        });
      })
    });
  });
  describe('/DELETE/:id books', function() {
    it('Delete book by id', function(done) {
      Book.create({
        title: 'Jack Ma',
        author: 'Chen Wei',
        category: 'Biography'
      }).then(function(book) {
        chai.request(app).delete('/books/' + book.id).end(function(err, res) {
          res.should.have.status(200);
          res.text.should.equal('1');
          done();
        });
      })
    });
  });
});
