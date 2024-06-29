const URL_API = "https://localhost:7266";

export function listarClientes(busca = '', page = 1) {
    // Constrói a URL com parâmetros de busca e paginação
    let url = `${URL_API}/api/Cliente?page=${page}`;

    // Adiciona o termo de busca à URL se fornecido
    if (busca.trim() !== '') {
        url += `&busca=${encodeURIComponent(busca.trim())}`;
    }

    return fetch(url);
}

export function obterClientePorId(id) {
    return fetch(`${URL_API}/api/Cliente/${id}`);
}

export function criarCliente(cliente) {
    var request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(cliente)
    };
    return fetch(`${URL_API}/api/Cliente`, request);
}

export function atualizarCliente(cliente) {
    var request = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(cliente)
    };
    return fetch(`${URL_API}/api/Cliente/${cliente.id}`, request);
}

export function deletarCliente(id) {
    var request = {
        method: "DELETE"
    };
    return fetch(`${URL_API}/api/Cliente/${id}`, request);
}
