import React, { useEffect, useState } from 'react';
import { listarDividas, deletarDivida } from '../services/dividaApi';
import { Link, useRouter } from 'simple-react-routing';

export default function ListaDividas({ clienteId }) {
    const [dividas, setDividas] = useState([]);
    const [busca, setBusca] = useState('');
    const [page, setPage] = useState(1);
    const [filtroStatus, setFiltroStatus] = useState('todos'); // Estado para o filtro de status das dívidas
    const { navigateTo } = useRouter();

    useEffect(() => {
        listarDividas(clienteId, busca, page)
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error('Erro ao buscar dívidas');
                }
            })
            .then(data => {
                // Aplicar filtro de acordo com o estado de filtroStatus
                let filteredDividas = data;
                if (filtroStatus === 'aberto') {
                    filteredDividas = data.filter(divida => !divida.estaPaga);
                } else if (filtroStatus === 'pago') {
                    filteredDividas = data.filter(divida => divida.estaPaga);
                }
                // Ordenar as dívidas pela data de criação (dataCriacao)
                filteredDividas.sort((a, b) => {
                    return new Date(a.dataCriacao) - new Date(b.dataCriacao);
                });
                setDividas(filteredDividas);
            })
            .catch(error => console.error('Erro ao buscar dívidas:', error));
    }, [clienteId, busca, page, filtroStatus]);

    useEffect(() => {
        handleSearch();
    }, [busca]); // Dispara a busca sempre que o estado 'busca' for alterado

    const handleDeleteDivida = id => {
        deletarDivida(id)
            .then(response => {
                if (response.status === 200) {
                    // Atualizar a lista após deletar a dívida
                    handleSearch(); // Chama handleSearch para atualizar a lista
                } else {
                    throw new Error('Erro ao deletar dívida');
                }
            })
            .catch(error => console.error('Erro ao deletar dívida:', error));
    };

    const handleSearch = () => {
        setPage(1); // Reinicia a página ao realizar uma nova busca
        listarDividas(clienteId, busca, 1)
            .then(response => response.json())
            .then(data => {
                // Aplicar filtro de acordo com o estado de filtroStatus
                let filteredDividas = data;
                if (filtroStatus === 'aberto') {
                    filteredDividas = data.filter(divida => !divida.estaPaga);
                } else if (filtroStatus === 'pago') {
                    filteredDividas = data.filter(divida => divida.estaPaga);
                }
                // Ordenar as dívidas pela data de criação (dataCriacao)
                filteredDividas.sort((a, b) => {
                    return new Date(a.dataCriacao) - new Date(b.dataCriacao);
                });
                setDividas(filteredDividas);
            })
            .catch(error => console.error('Erro ao buscar dívidas:', error));
    };

    const handleKeyPress = event => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const handleClearSearch = () => {
        setBusca('');
        setPage(1);
        handleSearch(); // Chama handleSearch para limpar a busca e atualizar a lista
    };

    const handlePageChange = direction => {
        if (direction === 'prev' && page > 1) {
            setPage(page - 1);
        } else if (direction === 'next') {
            setPage(page + 1);
        }
    };

    const handleChangeFiltro = event => {
        setFiltroStatus(event.target.value);
        setPage(1); // Reinicia a página ao alterar o filtro
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h1>Lista de Dívidas</h1>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <input
                    type="search"
                    style={{ minWidth: '250px', marginRight: '8px' }}
                    value={busca}
                    onChange={e => setBusca(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Buscar dívida"
                />
                <label style={{ display: 'flex', alignItems: 'center' }}>
                    Filtrar por:
                    <select value={filtroStatus} onChange={handleChangeFiltro} style={{ marginLeft: '8px' }}>
                        <option value="todos">Todos</option>
                        <option value="aberto">Em Aberto</option>
                        <option value="pago">Pagos</option>
                    </select>
                </label>
            </div>

            <table style={{ margin: 'auto', width: '100%' }}>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>Cliente</th>
                        <th>Valor</th>
                        <th>Está Paga</th>
                        <th>Data de Criação</th>
                        <th>Descrição</th>
                        <th>Editar</th>
                        <th>Fechar Conta</th>
                    </tr>
                </thead>
                <tbody>
                    {dividas.map(divida => (
                        <tr key={divida.id}>
                            <td>{divida.id}</td>
                            <td>{divida.cliente ? divida.cliente.nomeCompleto : ''}</td>
                            <td>{divida.valor}</td>
                            <td>{divida.estaPaga ? 'Sim' : 'Não'}</td>
                            <td>{divida.dataCriacao ? new Date(divida.dataCriacao).toLocaleDateString() : 'Não definida'}</td>
                            <td>{divida.descricao}</td>
                            <td>
                                <Link className='editar' to={`/dividas/editar/${divida.id}`}>Editar</Link>
                            </td>
                            <td>
                                <button type="button" onClick={() => handleDeleteDivida(divida.id)}>
                                    Fechar Conta
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ marginTop: '16px' }}>
                <button
                    type="button"
                    onClick={() => handlePageChange('prev')}
                    disabled={page === 1}
                    style={{ marginRight: '8px' }}
                >
                    Anterior
                </button>
                <span>{page}</span>
                <button type="button" onClick={() => handlePageChange('next')} style={{ marginLeft: '8px' }}>
                    Próximo
                </button>
            </div>
        </div>
    );
}
