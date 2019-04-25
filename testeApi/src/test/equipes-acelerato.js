const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();
const assert = chai.assert;

chai.use(chaiHttp);

let ticket;

const navigateUrl = "http://teste2.dev.com:8080"

const customer = {
    Username: 'account.owner@bluesoft.com.br',
    Password: 'kL+OVN4qxBq4G9v1haqYHw=='
}

describe('Equipes-Acelerato', () => {
    it('Teste: Deve retornar 401', (done) => {
        chai.request(navigateUrl)
            .get('/api/publica/equipes')
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.have.property('error').eql('Credenciais inválidas. Por favor verifique se você está passando seu token corretamente.');
                done();
            })
    });
    it('Teste: Deve retornar as equipes existentes no Acelerato', (done) => {
        chai.request(navigateUrl)
            .get('/api/publica/equipes')
            .auth(customer.Username, customer.Password)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body[0].should.have.property('equipeKey');
                res.body[0].should.have.property('nome');
                res.body[0].should.have.property('tipoDeEquipe');               
                done();
            })
    });
});