import { criaProduto, leProdutos, leProdutoPorId, atualizaProdutoPorId, deletaProdutoPorId } from './models.js';

export default async function rotas(req, res, dado) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    if(req.method === 'GET' && req.url === '/') {
        const { conteudo } = dado;

        res.statusCode = 200;

        const resposta = {
            mensagem: conteudo
        };

        res.end(JSON.stringify(resposta));

        return;
    }

    if(req.method === 'POST' && req.url === '/produtos'){
        const corpo = [];

        req.on('data', (parte) => {
            corpo.push(parte);
        });

        req.on('end', async () => {
            const produto = JSON.parse(corpo);

            res.statusCode = 400;

            if(!produto?.nome) {
                const resposta = {
                    erro: {
                        mensagem: `O atributo 'nome' não foi encontrado, porém é obrigatório para a criação do produto`
                    }
                };

                res.end(JSON.stringify(resposta));

                return;
            }

            if (!produto?.preco) {
                const resposta = {
                    erro: {
                        mensagem: `O atributo 'preco' não foi encontrado, porém é obrigatório para a criação do produto`
                    }
                };

                res.end(JSON.stringify(resposta));

                return;
            }

            try {
                const resposta = await criaProduto(produto);
                
                res.statusCode = 201;

                res.end(JSON.stringify(resposta));

                return;
            } catch (erro) {
                console.log('Falha ao criar produto', erro);

                res.statusCode = 500;

                const resposta = {
                    erro: {
                        mensagem: `Falha ao criar produto ${produto.nome}`
                    }
                };

                res.end(JSON.stringify(resposta));

                return;
            }
        });

        req.on('error', (error) => {
            console.log('Falha ao processar requisição', error);

            res.statusCode = 400;

            const resposta = {
                erro: {
                    mensagem: 'Falha ao processar requisição'
                }
            };

            res.end(JSON.stringify(resposta));

            return;
        });

        return;
    }

    if (req.method === 'PATCH' && req.url.split('/')[1] === 'produtos' && !isNaN(req.url.split('/')[2])) {
        const corpo = [];

        req.on('data', (parte) => {
            corpo.push(parte);
        });

        req.on('end', async () => {
            const produto = JSON.parse(corpo);

            res.statusCode = 400;

            if (!produto?.nome && !produto?.preco) {
                const resposta = {
                    erro: { 
                        mensagem: `Nenhum atributo foi encontrado, porém ao menos um é obrigatório para a atualização do produto` 
                    }
                };

                res.end(JSON.stringify(resposta));

                return;
            }

            const id = req.url.split('/')[2];

            try {
                const resposta = await atualizaProdutoPorId(id, produto);

                res.statusCode = 200;

                if(!resposta) {
                    res.statusCode = 404;
                }

                res.end(JSON.stringify(resposta));

                return;
            } catch(erro) {
                console.log('Falha ao atualizar produto', erro);

                res.statusCode = 500;

                const resposta = {
                    erro: {
                        mensagem: `Falha ao atualizar produto ${id}`
                    }
                };

                res.end(JSON.stringify(resposta));

                return;
            }
        });

        req.on('error', (error) => {
            console.log('Falha ao processar requisição', error);

            res.statusCode = 400;

            const resposta = {
                erro: {
                    mensagem: 'Falha ao processar requisição'
                }
            };

            res.end(JSON.stringify(resposta));

            return;
        });

        return;
    }

    if (req.method === 'DELETE' && req.url.split('/')[1] === 'produtos' && !isNaN(req.url.split('/')[2])) {
        const id = req.url.split('/')[2];

        try {
            const encontrado = await deletaProdutoPorId(id);

            res.statusCode = 204;

            if(!encontrado) {
                res.statusCode = 404;
            }

            res.end();

            return;
        } catch (erro) {
            console.log('Falha ao deletar produto', erro);
            res.statusCode = 500;

            const resposta = {
                erro: {
                    mensagem: `Falha ao deletar produto ${id}`
                }
            };

            res.end(JSON.stringify(resposta));

            return;
        }
    }

    if (req.method === 'GET' && req.url.split('/')[1] === 'produtos' && !isNaN(req.url.split('/')[2])) {
        const id = req.url.split('/')[2];

        try {
            const resposta = await leProdutoPorId(id);

            res.statusCode = 200;

            if (!resposta) {
                res.statusCode = 404;
            }

            res.end(JSON.stringify(resposta));

            return;
        } catch (erro) {
            console.log('Falha ao buscar produto', erro);
            res.statusCode = 500;

            const resposta = {
                erro: {
                    mensagem: `Falha ao buscar produto ${id}`
                }
            };

            res.end(JSON.stringify(resposta));

            return;
        }
    }

    if (req.method === 'GET' && req.url === '/produtos') {
        try {
            const resposta = await leProdutos();

            res.statusCode = 200;

            res.end(JSON.stringify(resposta));

            return;
        } catch (erro) {
            console.log('Falha ao buscar produtos', erro);
            res.statusCode = 500;

            const resposta = {
                erro: {
                    mensagem: `Falha ao buscar produtos`
                }
            };

            res.end(JSON.stringify(resposta));

            return;
        }
    }

    res.statusCode = 404;

    const resposta = {
        erro: { 
            mensagem: 'Rota não encontrada!',
            url: req.url
        }
    };

    res.end(JSON.stringify(resposta));
}