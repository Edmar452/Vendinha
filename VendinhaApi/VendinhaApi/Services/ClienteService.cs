using NHibernate;
using NHibernate.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using VendinhaApi.Entidades;

namespace VendinhaApi.Services
{
    public class ClienteService
    {
        private readonly ISessionFactory _sessionFactory;

        public ClienteService(ISessionFactory sessionFactory)
        {
            _sessionFactory = sessionFactory;
        }

        public void CriarCliente(Cliente cliente)
        {
            using var session = _sessionFactory.OpenSession();
            using var transaction = session.BeginTransaction();
            session.Save(cliente);
            transaction.Commit();
        }

        public void EditarCliente(Cliente cliente)
        {
            using var session = _sessionFactory.OpenSession();
            using var transaction = session.BeginTransaction();
            session.Update(cliente);
            transaction.Commit();
        }

        public void ExcluirCliente(int id)
        {
            using var session = _sessionFactory.OpenSession();
            using var transaction = session.BeginTransaction();
            var cliente = session.Get<Cliente>(id);
            if (cliente != null)
            {
                session.Delete(cliente);
                transaction.Commit();
            }
        }

        public Cliente RetornaCliente(int id)
        {
            using var session = _sessionFactory.OpenSession();
            return session.Get<Cliente>(id);
        }

        public List<Cliente> ListarClientes(string busca, int pageNumber, int pageSize)
        {
            using var session = _sessionFactory.OpenSession();
            var query = session.Query<Cliente>();

            if (!string.IsNullOrEmpty(busca))
            {
                query = query.Where(c => c.NomeCompleto.ToLower().Contains(busca.ToLower()) || c.Email.ToLower().Contains(busca.ToLower()));
            }

            return query.Skip((pageNumber - 1) * pageSize)
                        .Take(pageSize)
                        .ToList();
        }

        public bool ClienteTemDividasNaoPagas(int clienteId)
        {
            using var session = _sessionFactory.OpenSession();
            var dividas = session.Query<Divida>()
                                .Where(d => d.Cliente.Id == clienteId && !d.EstaPaga)
                                .ToList();
            return dividas.Any();
        }
    }
}
