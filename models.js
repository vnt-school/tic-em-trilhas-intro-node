import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './tic.db'
});

sequelize.authenticate();

export const Produto = sequelize.define('produto', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    preco: {
        type: Sequelize.DOUBLE,
        allowNull: false
    }
});

export async function criaProduto(produto) {
    try {
        const resultado = await Produto.create(produto);
        console.log(`O produto ${resultado.nome} foi criado com sucesso!`);
        return resultado;
    } catch (erro) {
        console.log('Erro ao criar produto', erro);
        throw erro;
    }
}

export async function leProdutos() {
    try {
        const resultado = await Produto.findAll();
        console.log(`Produtos consultados com sucesso!`, resultado);
        return resultado;
    } catch (erro) {
        console.log('Erro ao buscar produto', erro);
        throw erro;
    }
}

export async function leProdutoPorId(id) {
    try {
        const resultado = await Produto.findByPk(id);
        console.log(`Produto consultado com sucesso!`, resultado);
        return resultado;
    } catch (erro) {
        console.log('Erro ao buscar produto', erro);
        throw erro;
    }
}

export async function atualizaProdutoPorId(id, dadosProduto) {
    try {
        const resultado = await Produto.findByPk(id);
        if(resultado?.id) {
            for (const chave in dadosProduto) {
                if(chave in resultado) {
                    resultado[chave] = dadosProduto[chave];
                }
            }
            resultado.save();
            console.log(`Produto atualizado com sucesso!`, resultado);
        }
        return resultado;
    } catch (erro) {
        console.log('Erro ao atualizar produto', erro);
        throw erro;
    }
}

export async function deletaProdutoPorId(id) {
    try {
        const resultado = await Produto.destroy({ where: { id: id } });
        console.log(`Produto deletado com sucesso!`, resultado);
        return resultado;
    } catch (erro) {
        console.log('Erro ao deletar produto', erro);
        throw erro;
    }
}

export const Pedido = sequelize.define('pedido', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    valor_total: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    estado: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

export const ProdutosPedido = sequelize.define('produtos_pedido', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    quantidade: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    preco: {
        type: Sequelize.DOUBLE,
        allowNull: false
    }
});

Produto.belongsToMany(Pedido, { through: ProdutosPedido });
Pedido.belongsToMany(Produto, { through: ProdutosPedido });

export async function criaPedido(novoPedido) {
    try {
        const pedido = await Pedido.create({
            valor_total: novoPedido.valorTotal,
            estado: 'ENCAMINHADO'
        });

        for (const prod of novoPedido.produtos) {
            const produto = await Produto.findByPk(prod.id);
            if (produto) {
                pedido.addProduto(produto, { through: { quantidade: prod.quantidade, preco: produto.preco } });
            }
        }

        console.log('Pedido criado com sucesso!');

        return pedido;
    } catch (erro) {
        console.log('Erro ao criar Pedido', erro);
        throw erro;
    }
}

export async function lePedidos() {
    try {
        const resultado = await ProdutosPedido.findAll();
        console.log('Pedidos foram consultados com sucesso!', resultado);
        return resultado;
    } catch(erro) {
        console.log('Erro ao consultar pedidos', erro);
        throw erro;
    }
}

export async function lePedidoPorId(id) {
    try {
        const resultado = await Pedido.findByPk(id);
        console.log('Pedido foi consultado com sucesso!', resultado);
        return resultado;
    } catch (erro) {
        console.log('Erro ao consultar pedido', erro);
        throw erro;
    }
}