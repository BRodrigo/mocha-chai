const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();
const assert = chai.assert;

chai.use(chaiHttp);

let demanda;

const navigateUrl = "http://teste2.dev.com:8080"

const customer = {
    Username: 'account.owner@bluesoft.com.br',
    Password: 'kL+OVN4qxBq4G9v1haqYHw=='
}
const esforcoAtualizado = {
    esforco: "6"
}

describe('Demanda-Acelerato', () => {
    it('Teste: Deve retornar 401', (done) => {
        chai.request(navigateUrl)
            .get('/api/publica/demandas')
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.have.property('error').eql('Credenciais inválidas. Por favor verifique se você está passando seu token corretamente.');
                done();
            })
    });
    it('Teste: Deve retornar listagem de demandas', (done) => {
        chai.request(navigateUrl)
            .get('/api/publica/demandas')
            .auth(customer.Username, customer.Password)
            .end((err, res) => {
                demanda = res.body[0].ticketKey
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            })
    });
    it('Teste: Deve atualizar esforco da demanda', (done) => {
        chai.request(navigateUrl)
            .put('/api/publica/demandas ' + demanda)
            .auth(customer.Username, customer.Password)
            .send(esforcoAtualizado)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            })
    });
    it('Teste: Deve retornar uma demanda especifica', (done) => {
        chai.request(navigateUrl)
            .get('/api/publica/demandas/ ' + demanda)
            .auth(customer.Username, customer.Password)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('id');
                res.body.should.have.property('ticketKey');
                res.body.should.have.property('titulo');
                res.body.should.have.property('descricao');
                done();
            })
    });
    it('Teste: Deve criar uma nova demanda', (done) => {
        let dadosDaDemanda = {
            categoriaKey: "10",
            descricao: "<p>Criado via API</p>",
            envolvidosKey: [],
            especieDeTicketKey: "3",
            projeto: { projetoKey: "2" },
            releaseKey: "-1",
            tipoDeTicketKey: "30",
            titulo: "Teste123"
        }
        chai.request(navigateUrl)
            .post('/api/publica/demandas')
            .send(dadosDaDemanda)
            .auth(customer.Username, customer.Password)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            })
    });
});
