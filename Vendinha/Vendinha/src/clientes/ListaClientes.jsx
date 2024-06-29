import React, { useEffect, useState } from "react";
import { listarClientes, deletarCliente } from "../services/clienteApi";
import { Link } from "simple-react-routing";

export default function ListaClientes() {
    const [clientes, setClientes] = useState([]);
    const [busca, setBusca] = useState("");
    const [page, setPage] = useState(1);
    const [error, setError] = useState(null);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            listarClientes(busca, page)
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error("Erro ao buscar clientes");
                    }
                })
                .then((data) => {
                    setClientes(data);
                    setError(null); // Limpa o erro se a busca for bem-sucedida
                })
                .catch((error) => {
                    console.error("Erro ao buscar clientes:", error);
                    setError(error.message); // Define o erro para exibição na UI
                    setClientes([]); // Limpa a lista de clientes em caso de erro
                });
        }, 300); // 300 milliseconds

        return () => clearTimeout(delayDebounceFn);
    }, [busca, page]);

    const handleDeleteCliente = (id) => {
        deletarCliente(id)
            .then((response) => {
                if (response.ok) {
                    listarClientes(busca, page)
                        .then((response) => response.json())
                        .then((data) => {
                            setClientes(data);
                            setError(null); // Limpa o erro se a exclusão for bem-sucedida
                        });
                } else {
                    throw new Error("Erro ao deletar cliente");
                }
            })
            .catch((error) => console.error("Erro ao deletar cliente:", error));
    };

    const handleSearchChange = (event) => {
        setBusca(event.target.value);
        setPage(1); // Reinicia a página ao realizar uma nova busca
    };

    return (
        <div style={{ textAlign: "center" }}>
            <h1>Lista de Clientes</h1>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                <input
                    type="search"
                    style={{ minWidth: "250px", marginRight: "8px" }}
                    value={busca}
                    onChange={handleSearchChange}
                    placeholder="Buscar cliente"
                />
                <Link to="/clientes/criar">Novo Cliente</Link>
            </div>

            {error && <div className="error">{error}</div>}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px", alignItems: "center" }}>
                {clientes.map((cliente) => (
                    <ClienteItem key={cliente.id} cliente={cliente} onDelete={handleDeleteCliente} />
                ))}
            </div>
            <div style={{ marginTop: "16px" }}>
                <button type="button" onClick={() => setPage(page - 1)} disabled={page === 1} style={{ marginRight: "8px" }}>
                    Anterior
                </button>
                <span>{page}</span>
                <button type="button" onClick={() => setPage(page + 1)} style={{ marginLeft: "8px" }}>
                    Próximo
                </button>
            </div>
        </div>
    );
}

function ClienteItem({ cliente, onDelete }) {
    return (
        <div className="card" style={{padding: "16px", border: "1px solid #ccc", borderRadius: "8px"}}>
            <ul style={{ listStyle: "none", padding: 0 }}>
                <li><strong>ID:</strong> {cliente.id}</li>
                <li><strong>Nome Completo:</strong> {cliente.nomeCompleto}</li>
                <li><strong>CPF:</strong> {cliente.cpf}</li>
                <li><strong>Data de Nascimento:</strong> {cliente.dataNascimento}</li>
                <li><strong>Email:</strong> {cliente.email}</li>
            </ul>
            <div style={{ marginTop: "8px", display: "flex", justifyContent: "center" }}>
                <Link className="editar" to={`/clientes/editar/${cliente.id}`} style={{ marginRight: "8px" }}>
                    Editar
                </Link>
                <button type="button" onClick={() => onDelete(cliente.id)}>
                    Excluir
                </button>
            </div>
        </div>
    );
}
