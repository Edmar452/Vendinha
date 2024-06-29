const URL_API = 'https://localhost:7266';

export function listarDividas(clienteId, busca = '', pageNumber = 1, pageSize = 10) {
    const url = clienteId
        ? `${URL_API}/api/Divida?clienteId=${clienteId}&busca=${busca}&pageNumber=${pageNumber}&pageSize=${pageSize}`
        : `${URL_API}/api/Divida?busca=${busca}&pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return fetch(url);
}

export function buscarDivida(dividaId) {
    const url = `${URL_API}/api/Divida/${dividaId}`;
    return fetch(url);
}

export function criarDivida(divida) {
    const request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(divida)
    };
    return fetch(`${URL_API}/api/Divida`, request);
}

export function atualizarDivida(dividaId, divida) {
    const request = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(divida)
    };
    return fetch(`${URL_API}/api/Divida/${dividaId}`, request);
}

export function marcarDividaComoPaga(dividaId) {
    const request = {
        method: 'PATCH' // PATCH para marcar como paga, conforme a API
    };
    return fetch(`${URL_API}/api/Divida/${dividaId}/marcarPaga`, request);
}

export function deletarDivida(dividaId) {
    const request = {
        method: 'DELETE'
    };
    return fetch(`${URL_API}/api/Divida/${dividaId}`, request);
}
