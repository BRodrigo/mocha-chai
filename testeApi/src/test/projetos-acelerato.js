const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();
const assert = chai.assert;

chai.use(chaiHttp);

let projeto;

const navigateUrl = "http://teste2.dev.com:8080"

const customer = {
    Username: 'account.owner@bluesoft.com.br',
    Password: 'kL+OVN4qxBq4G9v1haqYHw=='
}

describe('Projetos-Acelerato', () => {
    it('Teste: Deve retornar 401', (done) => {
        chai.request(navigateUrl)
            .get('/api/publica/projetos')
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.have.property('error').eql('Credenciais inválidas. Por favor verifique se você está passando seu token corretamente.');
                done();
            })
    });
    it('Teste: Deve retornar os projetos existentes no Acelerato', (done) => {
        chai.request(navigateUrl)
            .get('/api/publica/projetos')
            .auth(customer.Username, customer.Password)
            .end((err, res) => {
                projeto = res.body.content[0].projetoKey
                res.should.have.status(200);
                res.body.content.should.be.a('array');
                res.body.content[0].should.have.property('projetoKey');
                res.body.content[0].should.have.property('nome');
                res.body.content[0].should.have.property('ativo');
                done();
            })
    });
    it('Teste: Deve retornar um projeto especifico', (done) => {
        chai.request(navigateUrl)
            .get('/api/publica/projetos/ ' + projeto)
            .auth(customer.Username, customer.Password)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('projetoKey');
                res.body.should.have.property('nome');
                res.body.should.have.property('workflowDeProdutoKey');
                done();
            })
    })
    it('Teste: Deve criar um novo projeto', (done) => {
        let dadosDoProjeto = {
            projetoKey: 1,
            nome: "TestesTestes",
            descricao: "Testando",
            ativo: false,
            workflowDeProdutoKey: 1,
            workflowDeTarefasKey: 1,
            equipeKey: 2,
            dataDeInicioDoProjeto: "08/02/2018",
            nomeDoProjeto: "Acelerato",
            projetoTemplateKey: 1
        }
        chai.request(navigateUrl)
            .post('/api/publica/projetos/templates')
            .auth(customer.Username, customer.Password)
            .send(dadosDoProjeto)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.have.property('projetoKey');
                res.body.should.have.property('nome');
                res.body.should.have.property('workflowDeProdutoKey');
                done();
            })
    })
});