require('dotenv/config')
const axios = require('axios')
const db = require('../config/database')

module.exports = {

    async login() {
        const body = { email: process.env.GKO_EMAIL, senha: process.env.GKO_SENHA }

        try {
            const response = await axios.post('http://utilities.confirmafacil.com.br/login/login', body)
            const data = response.data
            const token = data.resposta.token

            await db.query('INSERT INTO token (token) VALUES ($1)', [token])

            return {
                error: false,
                message: 'Token registrado com sucesso'
            }

        } catch (err) {
            return {
                error: true,
                message: `Erro ao realizar login na API: ${err}`
            }
        }
    },

    async listUltimoToken() {
        try {
            const response = await db.query(`
                SELECT 
                    t.token
                FROM (SELECT max(id), token FROM token GROUP BY 2 ORDER BY 1 DESC LIMIT 1) as t
            `)

            return response.rows[0].token

        } catch (err) {
            return {
                error: true,
                message: `Erro ao listar último token: ${err}`
            }
        }
    },

    async listAllOcorrencias(ultimoToken) {
        const queryParams = 'ate=2020%2F07%2F07%2008%3A00%3A00&de=2020%2F07%2F02%2000%3A00%3A00&tipoData=OCORRENCIA&codigoOcorrencia=19'
        const header = { headers: { authorization: ultimoToken } }

        try {
            const response = await axios.get(`http://utilities.confirmafacil.com.br/filter/ocorrencia?${queryParams}`, header)

            return response.data.respostas

        } catch (err) {
            return {
                error: true,
                message: `Erro ao listar ocorrências: ${err}`
            }
        }
    },

    async createNewOcorrencia(ocorrencias) {
        let erro = false
        let errorMessage = ''
        const CONSTRAINT_ERROR = 23505

        for (o of ocorrencias) {

            if (erro) {
                break
            }

            const ocorrencia = {
                ocorrencia_id: o.idOcorrencia,
                ocorrencia_data: o.data,
                ocorrencia_comentario: o.comentario,
                ocorrencia_codigo: o.tipoOcorrencia.codigo,
                ocorrencia_nome: o.tipoOcorrencia.nome,
                embarque_id: o.embarque.idEmbarque,
                embarque_numero: o.embarque.numero,
                embarque_data_criacao: o.embarque.dataCriacao,
                embarque_data_emissao: o.embarque.dataEmissao,
                embarque_data_embarque: o.embarque.dataEmbarque,
                embarque_data_previsao: o.embarque.dataPrevisao,
                embarque_status: o.embarque.statusEmbarque.nome,
                destinatario_id: o.embarque.destinatario.idDestinatario,
                destinatario_nome: o.embarque.destinatario.nome,
                destinatario_cnpj: o.embarque.destinatario.cnpj,
                destinatario_celular: o.embarque.destinatario.celular,
                destinatario_cidade: o.embarque.destinatario.endereco.cidade,
                destinatario_uf: o.embarque.destinatario.endereco.uf,
                destinatario_endereco_id: o.embarque.destinatario.endereco.idEndereco,
                transportadora_id: o.embarque.transportadora.idTransportadora,
                transportadora_cnpj: o.embarque.transportadora.cnpj,
                transportadora_nome: o.embarque.transportadora.nome,
                pedido_id: o.embarque.pedido.idPedido,
                pedido_numero: o.embarque.pedido.numero,
                pedido_data_emissao: o.embarque.pedido.dataEmissao,
                pedido_data_criacao: o.embarque.pedido.dataCriacao,
                pedido_data_agendamento: o.embarque.pedido.dataAgendamento,
                embarcador_id: o.embarque.embarcador.idEmbarcador,
                embarcador_cnpj: o.embarque.embarcador.cnpj,
                embarcador_nome: o.embarque.embarcador.nome,
                entrega_id: o.embarque.entregas[0].idEntrega,
                entrega_data_criacao: o.embarque.entregas[0].dataCriacao,
                entrega_data_entrega: o.embarque.entregas[0].dataEntrega
            }

            try {
                await db.query(`
                        INSERT INTO ocorrencia (
                            ocorrencia_id,
                            ocorrencia_data,
                            ocorrencia_comentario,
                            ocorrencia_codigo,
                            ocorrencia_nome,
                            embarque_id,
                            embarque_numero,
                            embarque_data_criacao,
                            embarque_data_emissao,
                            embarque_data_embarque,
                            embarque_data_previsao,
                            embarque_status,
                            destinatario_id,
                            destinatario_nome,
                            destinatario_cnpj,
                            destinatario_celular,
                            destinatario_cidade,
                            destinatario_uf,
                            destinatario_endereco_id,
                            transportadora_id,
                            transportadora_cnpj,
                            transportadora_nome,
                            pedido_id,
                            pedido_numero,
                            pedido_data_emissao,
                            pedido_data_criacao,
                            pedido_data_agendamento,
                            embarcador_id,
                            embarcador_cnpj,
                            embarcador_nome,
                            entrega_id,
                            entrega_data_criacao,
                            entrega_data_entrega
                        ) VALUES (
                            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 
                            $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, 
                            $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, 
                            $31, $32, $33
                        )`,
                    [
                        ocorrencia.ocorrencia_id,
                        ocorrencia.ocorrencia_data,
                        ocorrencia.ocorrencia_comentario,
                        ocorrencia.ocorrencia_codigo,
                        ocorrencia.ocorrencia_nome,
                        ocorrencia.embarque_id,
                        ocorrencia.embarque_numero,
                        ocorrencia.embarque_data_criacao,
                        ocorrencia.embarque_data_emissao,
                        ocorrencia.embarque_data_embarque,
                        ocorrencia.embarque_data_previsao,
                        ocorrencia.embarque_status,
                        ocorrencia.destinatario_id,
                        ocorrencia.destinatario_nome,
                        ocorrencia.destinatario_cnpj,
                        ocorrencia.destinatario_celular,
                        ocorrencia.destinatario_cidade,
                        ocorrencia.destinatario_uf,
                        ocorrencia.destinatario_endereco_id,
                        ocorrencia.transportadora_id,
                        ocorrencia.transportadora_cnpj,
                        ocorrencia.transportadora_nome,
                        ocorrencia.pedido_id,
                        ocorrencia.pedido_numero,
                        ocorrencia.pedido_data_emissao,
                        ocorrencia.pedido_data_criacao,
                        ocorrencia.pedido_data_agendamento,
                        ocorrencia.embarcador_id,
                        ocorrencia.embarcador_cnpj,
                        ocorrencia.embarcador_nome,
                        ocorrencia.entrega_id,
                        ocorrencia.entrega_data_criacao,
                        ocorrencia.entrega_data_entrega
                    ]
                )
            } catch (err) {
                if (err.code != CONSTRAINT_ERROR) {
                    erro = true
                    errorMessage = err
                }
            }
        }

        if (erro) {
            return {
                error: true,
                message: errorMessage
            }
        }

        return {
            error: false,
            message: 'Ocorrências cadastradas com sucesso'
        }

    },

}





