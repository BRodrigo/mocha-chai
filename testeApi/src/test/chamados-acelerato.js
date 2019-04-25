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

const tituloAtualizado = {
    titulo: "TESTE1456"
}

describe('Chamado-Acelerato', () => {
    it('Teste: Deve retornar 401', (done) => {
        chai.request(navigateUrl)
            .get('/api/publica/chamados')
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.have.property('error').eql('Credenciais inválidas. Por favor verifique se você está passando seu token corretamente.');
                done();
            })
    });
    it('Teste: Deve retornar listagem de chamados', (done) => {
        chai.request(navigateUrl)
            .get('/api/publica/chamados')
            .auth(customer.Username, customer.Password)
            .end((err, res) => {
                ticket = res.body[0].ticketKey
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            })
    });
    it('Teste: Deve atualizar titulo do chamado', (done) => {
        chai.request(navigateUrl)
            .put('/api/publica/chamados ' + ticket)
            .auth(customer.Username, customer.Password)
            .send(tituloAtualizado)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            })
    });
    it('Teste: Deve retornar um chamado especifico', (done) => {
        chai.request(navigateUrl)
            .get('/api/publica/chamados/ ' + ticket)
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
    it('Teste: Deve criar um novo chamado', (done) => {
        let dadosDoChamado = {
            agenteKey: "2",
            anexoTempId: "local-1-2074565408263412",
            categoriaKey: "7",
            descricao: "<p>Criado via API</p>",
            emailSolicitante: "",
            envolvidosKey: [],
            especieDeTicketKey: "1",
            kanbanStatusKey: "",
            nomeSolicitante: "",
            organizacaoKey: "1",
            solicitanteKey: "1",
            tipoDePrioridadeKey: "1",
            tipoDeTicketKey: "7",
            titulo: "Teste123"

        }
        chai.request(navigateUrl)
            .post('/api/publica/chamados')
            .send(dadosDoChamado)
            .auth(customer.Username, customer.Password)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            })
    });
});

