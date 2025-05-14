/* eslint-env mocha */
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const axios = require('axios');
const app = require('../server');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Sender Service - Message Controller', () => {
    afterEach(() => {
        sinon.restore(); // Réinitialise les mocks après chaque test
    });

    describe('GET /', () => {
        it('devrait retourner le formulaire d\'envoi', (done) => {
            chai.request(app)
                .get('/')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.html;
                    expect(res.text).to.include('Envoyer un message');
                    done();
                });
        });
    });

    describe('POST /send', () => {
        it('devrait envoyer un message avec succès', (done) => {
            const message = {
                username: 'TestUser',
                content: 'Ceci est un message de test'
            };

            sinon.stub(axios, 'post').resolves(); // Simule un succès de l'API

            chai.request(app)
                .post('/send')
                .send(message)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.text).to.include('Message envoyé avec succès');
                    done();
                });
        });

        it('devrait afficher une erreur si le pseudonyme ou le contenu est manquant', (done) => {
            const message = { content: 'Message sans pseudonyme' };

            chai.request(app)
                .post('/send')
                .send(message)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.text).to.include('Le pseudonyme et le contenu sont requis');
                    done();
                });
        });

        it('devrait gérer une erreur lors de l\'appel à l\'API', (done) => {
            const message = {
                username: 'TestUser',
                content: 'Ceci est un message de test'
            };

            sinon.stub(axios, 'post').rejects(new Error('Erreur API')); // Simule une erreur de l'API

            chai.request(app)
                .post('/send')
                .send(message)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.text).to.include('Impossible d\'envoyer le message');
                    done();
                });
        });
    });
});