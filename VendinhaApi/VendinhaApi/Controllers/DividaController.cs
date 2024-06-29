using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using VendinhaApi.Entidades;
using VendinhaApi.Services;

namespace VendinhaApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DividaController : ControllerBase
    {
        private readonly DividaService _dividaService;
        private readonly ClienteService _clienteService;

        public DividaController(DividaService dividaService, ClienteService clienteService)
        {
            _dividaService = dividaService ?? throw new ArgumentNullException(nameof(dividaService));
            _clienteService = clienteService ?? throw new ArgumentNullException(nameof(clienteService));
        }

        [HttpGet]
        public ActionResult<List<Divida>> Get([FromQuery] string busca = null, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            if (!string.IsNullOrEmpty(busca))
            {
                var dividasBuscadas = _dividaService.BuscarDividas(busca, null, null, pageNumber, pageSize);
                return Ok(dividasBuscadas);
            }
            else
            {
                var dividas = _dividaService.ListarDividas(pageNumber, pageSize);
                return Ok(dividas);
            }
        }


        [HttpGet("{id}")]
        public ActionResult<Divida> Get(int id)
        {
            var divida = _dividaService.RetornaDivida(id);
            if (divida == null)
            {
                return NotFound();
            }
            return Ok(divida);
        }

        [HttpPost]
        public IActionResult Post([FromBody] DividaRequest request)
        {
            try
            {
                var cliente = _clienteService.RetornaCliente(request.ClienteId);
                if (cliente == null)
                {
                    return NotFound($"Cliente com ID {request.ClienteId} não encontrado.");
                }

                var divida = new Divida
                {
                    Valor = request.Valor,
                    EstaPaga = false,
                    DataCriacao = DateTime.UtcNow,
                    DataPagamento = request.DataPagamento,
                    Descricao = request.Descricao,
                    Cliente = cliente
                };

                _dividaService.CriarDivida(divida);
                return Ok(divida);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao criar a dívida: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] DividaRequest request)
        {
            try
            {
                var divida = _dividaService.RetornaDivida(id);
                if (divida == null)
                {
                    return NotFound($"Dívida com ID {id} não encontrada.");
                }

                var cliente = _clienteService.RetornaCliente(request.ClienteId);
                if (cliente == null)
                {
                    return NotFound($"Cliente com ID {request.ClienteId} não encontrado.");
                }

                divida.Valor = request.Valor;
                divida.EstaPaga = request.EstaPaga;
                divida.DataPagamento = request.DataPagamento;
                divida.Descricao = request.Descricao;
                divida.Cliente = cliente;

                _dividaService.EditarDivida(divida);

                return Ok(divida);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao editar a dívida: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                var divida = _dividaService.RetornaDivida(id);
                if (divida == null)
                {
                    return NotFound("Dívida não encontrada.");
                }

                _dividaService.ExcluirDivida(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao excluir a dívida: {ex.Message}");
            }
        }
    }

    public class DividaRequest
    {
        public decimal Valor { get; set; }
        public bool EstaPaga { get; set; }
        public DateTime? DataPagamento { get; set; }
        public string Descricao { get; set; }
        public int ClienteId { get; set; }
    }
}
