import React, { useEffect, useState } from 'react';
import { buscarDivida, atualizarDivida, marcarDividaComoPaga } from '../services/dividaApi';
import { listarClientes } from '../services/clienteApi'; // Importe o serviço para listar clientes
import { useNavigation, useRouter } from 'simple-react-routing';

export default function FormDivida() {
    const { pathParams } = useRouter();
    const dividaId = pathParams['codigo'];
    const { navigateTo } = useNavigation();

    const [valor, setValor] = useState(0);
    const [estaPaga, setEstaPaga] = useState(false);
    const [dataPagamento, setDataPagamento] = useState('');
    const [descricao, setDescricao] = useState('');
    const [clienteId, setClienteId] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [dataAtual, setDataAtual] = useState('');
    const [clientesDisponiveis, setClientesDisponiveis] = useState([]);

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (dividaId) {
            setIsEditing(true);
            buscarDivida(dividaId)
                .then(response => {
                    if (response.status === 200) {
                        return response.json();
                    } else {
                        throw new Error('Erro ao buscar dívida');
                    }
                })
                .then(data => {
                    setValor(data.valor);
                    setEstaPaga(data.estaPaga);
                    setDataPagamento(
                        data.dataPagamento
                            ? new Date(data.dataPagamento).toISOString().substr(0, 10)
                            : ''
                    );
                    setDescricao(data.descricao);
                    setClienteId(data.cliente.id);
                })
                .catch(error => {
                    console.error('Erro ao buscar dívida:', error);
                });
        }

        // Define a data atual como valor mínimo para data de pagamento
        const hoje = new Date();
        const ano = hoje.getFullYear();
        let mes = hoje.getMonth() + 1;
        if (mes < 10) {
            mes = `0${mes}`;
        }
        let dia = hoje.getDate();
        if (dia < 10) {
            dia = `0${dia}`;
        }
        setDataAtual(`${ano}-${mes}-${dia}`);

        // Carregar lista de clientes disponíveis
        listarClientes()
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error('Erro ao buscar clientes');
                }
            })
            .then(data => {
                // Filtrar clientes que não têm dívidas
                const clientesSemDivida = data.filter(cliente => !cliente.temDivida);
                setClientesDisponiveis(clientesSemDivida);
            })
            .catch(error => {
                console.error('Erro ao buscar clientes:', error);
            });
    }, [dividaId]);

    const salvarDivida = async evento => {
        evento.preventDefault();

        const divida = {
            valor: Number(valor),
            estaPaga,
            dataPagamento: estaPaga ? new Date(dataPagamento).toISOString() : null,
            descricao,
            clienteId
        };

        try {
            let response;
            if (dividaId) {
                response = await atualizarDivida(dividaId, divida);
            } else {
                response = await criarDivida(divida);
            }

            if (response.status === 200) {
                navigateTo(null, '/dividas');
            } else {
                const error = await response.json();
                setErrorMessage(`Erro ao salvar dívida: ${JSON.stringify(error)}`);
            }
        } catch (error) {
            setErrorMessage(`Erro ao salvar dívida: ${error.message}`);
        }
    };

    const handleCheckboxChange = () => {
        setEstaPaga(!estaPaga);
    };

    return (
        <form onSubmit={salvarDivida} className="container">
            <div className="formulario">
                <div className="row">
                    <div className="input">
                        <label>Valor:</label>
                        <input
                            value={valor}
                            onChange={e => setValor(e.target.value)}
                            type="number"
                            step="0.01"
                            placeholder="Valor da dívida"
                            required
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="input">
                        <label>Está Paga:</label>
                        <input
                            type="checkbox"
                            checked={estaPaga}
                            onChange={handleCheckboxChange}
                            className="checkbox-large"
                        />
                    </div>
                </div>
                {estaPaga && (
                    <div className="row">
                        <div className="input">
                            <label>Data de Pagamento:</label>
                            <input
                                value={dataPagamento}
                                onChange={e => setDataPagamento(e.target.value)}
                                type="date"
                                min={dataAtual}
                            />
                        </div>
                    </div>
                )}
                <div className="row">
                    <div className="input">
                        <label>Descrição:</label>
                        <input
                            value={descricao}
                            onChange={e => setDescricao(e.target.value)}
                            type="text"
                            placeholder="Descrição da dívida"
                            required
                        />
                    </div>
                </div>
                {!isEditing && (
                    <div className="row">
                        <div className="input">
                            <label>Cliente:</label>
                            <select
                                value={clienteId}
                                onChange={e => setClienteId(e.target.value)}
                                required
                            >
                                {clientesDisponiveis.map(cliente => (
                                    <option key={cliente.id} value={cliente.id}>
                                        {cliente.nomeCompleto}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
                <button type="submit">{dividaId ? 'Atualizar' : 'Salvar'}</button>
                <p className="error">{errorMessage}</p>
            </div>
        </form>
    );
}
