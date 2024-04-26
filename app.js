import sqlite3 from 'sqlite3';
import express from 'express';
import bodyParser from 'body-parser';

import { rotasProduto } from './routes/produtos.js';
import { rotasPedido } from './routes/pedidos.js';

import { sequelize } from './models.js';

const app = express();

app.use(bodyParser.json());

app.use(rotasProduto);
app.use(rotasPedido);

async function inicializaApp() {
    const db = new sqlite3.Database('./tic.db', (erro) => {
        if (erro) {
            console.log('Falha ao incializar o banco de dados');
            return;
        }
        console.log('Banco de dados inicializado');
    });

    await sequelize.sync();

    const porta = 3000;

    app.listen(porta);
}

inicializaApp();
