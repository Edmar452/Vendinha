import React, { useEffect, useState } from 'react';
import { obterClientePorId, criarCliente, atualizarCliente } from "../services/clienteApi";
import { useNavigation, useRouter } from 'simple-react-routing';

export default function FormCliente() {
    const { pathParams } = useRouter();
    const clienteId = pathParams["codigo"];
    const { navigateTo } = useNavigation();

    const [nomeCompleto, setNomeCompleto] = useState("");
    const [cpf, setCpf] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (clienteId) {
            obterClientePorId(clienteId)
                .then(response => {
                    if (response.status === 200) {
                        return response.json();
                    } else {
                        throw new Error("Erro ao buscar cliente");
                    }
                })
                .then(data => {
                    setNomeCompleto(data.nomeCompleto);
                    setCpf(data.cpf);
                    setDataNascimento(new Date(data.dataNascimento).toISOString().split('T')[0]);
                    setEmail(data.email);
                })
                .catch(error => {
                    console.error("Erro:", error);
                });
        }
    }, [clienteId]);

    const salvarCliente = async (evento) => {
        evento.preventDefault();
        const cliente = {
            id: clienteId,
            nomeCompleto,
            cpf,
            dataNascimento: new Date(dataNascimento).toISOString(),
            email
        };

        try {
            let response;
            if (clienteId) {
                response = await atualizarCliente(cliente);
            } else {
                response = await criarCliente(cliente);
            }

            if (response.status === 200) {
                navigateTo(null, "/clientes");
            } else {
                const error = await response.json();
                setErrorMessage(`Erro ao salvar cliente: ${JSON.stringify(error)}`);
            }
        } catch (error) {
            setErrorMessage(`Erro ao salvar cliente: ${error.message}`);
        }
    };

    return (
        <form onSubmit={salvarCliente} className="container">
            <div className="formulario">
                <div className="row">
                    <div className="input">
                        <label>Nome Completo:</label>
                        <input
                            value={nomeCompleto}
                            onChange={(e) => setNomeCompleto(e.target.value)}
                            type="text"
                            placeholder="Nome completo do cliente"
                            required
                        />
                    </div>
                    <div className="input">
                        <label>CPF:</label>
                        <input
                            value={cpf}
                            onChange={(e) => setCpf(e.target.value)}
                            type="text"
                            placeholder="CPF do cliente"
                            required
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="input">
                        <label>Data de Nascimento:</label>
                        <input
                            value={dataNascimento}
                            onChange={(e) => setDataNascimento(e.target.value)}
                            type="date"
                            required
                        />
                    </div>
                    <div className="input">
                        <label>Email:</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="Email do cliente"
                            required
                        />
                    </div>
                </div>
                <button type="submit">{clienteId ? "Atualizar" : "Salvar"}</button>
                <p className="error">{errorMessage}</p>
            </div>
        </form>
    );
}
