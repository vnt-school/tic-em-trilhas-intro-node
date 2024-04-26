import http from 'http';
import fs from 'fs';
import rotas from './routes.js';

fs.writeFile('./mensagem.txt', 'Olá, TIC em Trilhas do arquivo!', 'utf-8', (erro) => {
    if (erro) {
        console.log('Falha ao escrever o arquivo', erro);
        return;
    }
    console.log('Arquivo foi criado com sucesso');
});

fs.readFile('./mensagem.txt', 'utf-8', (erro, conteudo) => {
    if (erro) {
        console.log('Falha na leitura do arquivo', erro);
        return;
    }

    console.log(`Conteúdo: ${conteudo}`);

    iniciaServidorHttp(conteudo);
});

function iniciaServidorHttp(conteudo){
    const servidor = http.createServer((req, res) => {
        rotas(req, res, { conteudo });
    });

    const porta = 3000;
    const host = 'localhost';

    servidor.listen(porta, host, () => {
        console.log(`Servidor executando em http://${host}:${porta}/`)
    });
}
