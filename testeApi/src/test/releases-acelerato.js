const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();
const assert = chai.assert;

chai.use(chaiHttp);

let release;

const navigateUrl = "http://teste2.dev.com:8080"

const customer = {
    Username: 'account.owner@bluesoft.com.br',
    Password: 'kL+OVN4qxBq4G9v1haqYHw=='
}

const dadosReleaseEditada = {
    compartilhada: false,
    dataFinal: "08/03/2018",
    dataInicial: "08/02/2018",
    nivel: 0,
    nome: "Teste123456456",
    projetos: [2],
    releaseKey: 2,
    releasePaiKey: null
}

describe('Releases-Acelerato', () => {
    it('Teste: Deve retornar 401', (done) => {
        chai.request(navigateUrl)
            .get('/api/publica/releases')
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.have.property('error').eql('Credenciais inválidas. Por favor verifique se você está passando seu token corretamente.');
                done();
            })
    });
    it('Teste: Deve retornar as releases existentes no Acelerato', (done) => {
        chai.request(navigateUrl)
            .get('/api/publica/releases')
            .auth(customer.Username, customer.Password)
            .end((err, res) => {
                release = res.body.content[0].releaseKey
                res.should.have.status(200);
                res.body.content.should.be.a('array');
                res.body.content[0].should.have.property('releaseKey');
                res.body.content[0].should.have.property('nome');
                res.body.content[0].should.have.property('dataInicial');
                done();
            })
    });
    it('Teste: Deve retornar uma release especifica', (done) => {
        chai.request(navigateUrl)
            .get('/api/publica/releases/ ' + release)
            .auth(customer.Username, customer.Password)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('releaseKey');
                res.body.should.have.property('releaseNotes');
                res.body.should.have.property('dataInicial');
                done();
            })
    })

    it('Teste: Deve atualizar uma release', (done) => {
        chai.request(navigateUrl)
            .get('/api/publica/releases/2')
            .auth(customer.Username, customer.Password)
            .send(dadosReleaseEditada)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('releaseKey');
                res.body.should.have.property('releaseNotes');
                res.body.should.have.property('dataInicial');
                done();
            })
    })
});
    // it('Teste: Deve criar uma nova release', (done) => {
    //     let dadosDaRelease = {
    //         releaseKey: 2,
    //         nome: "2014-06-06",
    //         compartilhada: false,
    //         dataInicial: "02/06/2014",
    //         dataFinal: "06/06/2014",
    //         paiReleaseKey: null,
    //         nivel: 0,
    //         releasesFilhas: {
    //             links: [],
    //             content: []
    //         }
    //     }
    //     chai.request(navigateUrl)
    //         .post('/api/publica/releases')
    //         .auth(customer.Username, customer.Password)
    //         .end((err, res) => {
    //             res.should.have.status(200);
    //             res.body.should.have.property('projetoKey');
    //             res.body.content.should.have.property('nome');
    //             res.body.content.should.have.property('workflowDeProdutoKey');
    //             done();
    //         })
    // })
