/* eslint-env mocha */
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const axios = require('axios');
const app = require('../server');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Thread Service - Message Controller', () => {
    afterEach(() => {
        sinon.restore(); // Réinitialise les mocks après chaque test
    });

    describe('GET /', () => {
        it('devrait retourner la page d\'accueil avec des messages', (done) => {
            const mockMessages = [
                { username: 'User1', content: 'Message 1', createdAt: new Date() },
                { username: 'User2', content: 'Message 2', createdAt: new Date() }
            ];

            sinon.stub(axios, 'get').resolves({ data: mockMessages });

            chai.request(app)
                .get('/')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.html;
                    expect(res.text).to.include('Messages récents');
                    expect(res.text).to.include('User1');
                    expect(res.text).to.include('Message 1');
                    done();
                });
        });

        it('devrait afficher une erreur si l\'API échoue', (done) => {
            sinon.stub(axios, 'get').rejects(new Error('Erreur API'));

            chai.request(app)
                .get('/')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.html;
                    expect(res.text).to.include('Impossible de récupérer les messages');
                    done();
                });
        });
    });

    describe('GET /messages', () => {
        it('devrait retourner une réponse JSON avec success: true', (done) => {
            chai.request(app)
                .get('/messages')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('success', true);
                    done();
                });
        });
    });
});