using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using VendinhaApi.Entidades;
using VendinhaApi.Services;

namespace VendinhaApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClienteController : ControllerBase
    {
        private readonly ClienteService _clienteService;

        public ClienteController(ClienteService clienteService)
        {
            _clienteService = clienteService;
        }

        [HttpGet]
        public ActionResult<List<Cliente>> Get([FromQuery] string busca = null, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var clientes = _clienteService.ListarClientes(busca, pageNumber, pageSize);
            return Ok(clientes);
        }

        [HttpGet("{id}")]
        public ActionResult<Cliente> Get(int id)
        {
            var cliente = _clienteService.RetornaCliente(id);
            if (cliente == null)
            {
                return NotFound();
            }
            return Ok(cliente);
        }

        [HttpPost]
        public IActionResult Post([FromBody] Cliente cliente)
        {
            _clienteService.CriarCliente(cliente);
            return Ok(cliente);
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] Cliente cliente)
        {
            if (id != cliente.Id)
            {
                return BadRequest("O ID do cliente na rota não corresponde ao ID no corpo da requisição.");
            }

            try
            {
                _clienteService.EditarCliente(cliente);
                return Ok(cliente);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao editar o cliente: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _clienteService.ExcluirCliente(id);
            return Ok();
        }
    }
}
