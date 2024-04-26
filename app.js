import http from 'http';
import fs from 'fs';
import rotas from './routes.js';
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./tic.db ', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Conectado ao banco de dados SQLite.');

}); 

fs.writeFile('./mensagem.txt', 'Olá, TIC em Trilhas do arquivo!', 'utf8', (erro) => {
    if (erro) {
        console.log('Falha ao escrever no arquivo', erro);
        return;
    }
    console.log('Arquivo criado com sucesso');
});

fs.readFile('./mensagem.txt', 'utf8', (erro, conteudo) => {
    if (erro) {
        console.log('Falha na leitura do arquivo', erro);
        return;
    }

    console.log('Conteúdo:', conteudo);

    iniciaServidorHttp(conteudo);

});

function iniciaServidorHttp(conteudo) {
    const servidor = http.createServer((req, res) => {
        rotas(req, res, { conteudo });
    });

    const porta = 3000;
    const host = 'localhost';
    
    servidor.listen(porta, host, () => {
        console.log(`Servidor executando em http://${host}:${porta}/`);
    });
}