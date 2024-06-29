using NHibernate;
using NHibernate.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using VendinhaApi.Entidades;

namespace VendinhaApi.Services
{
    public class DividaService
    {
        private readonly ISessionFactory _sessionFactory;
        private readonly ClienteService _clienteService;

        public DividaService(ISessionFactory sessionFactory, ClienteService clienteService)
        {
            _sessionFactory = sessionFactory;
            _clienteService = clienteService;
        }

        public void CriarDivida(Divida divida)
        {
            using var session = _sessionFactory.OpenSession();
            using var transaction = session.BeginTransaction();

            try
            {
                divida.Cliente = session.Get<Cliente>(divida.Cliente.Id);

                bool clienteTemDividasNaoPagas = _clienteService.ClienteTemDividasNaoPagas(divida.Cliente.Id);

                divida.EstaPaga = !clienteTemDividasNaoPagas;

                session.Save(divida);
                transaction.Commit();
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                throw new Exception($"Erro ao criar a dívida: {ex.Message}");
            }
        }

        public void EditarDivida(Divida divida)
        {
            using var session = _sessionFactory.OpenSession();
            using var transaction = session.BeginTransaction();
            session.Update(divida);
            transaction.Commit();
        }

        public void ExcluirDivida(int id)
        {
            using var session = _sessionFactory.OpenSession();
            using var transaction = session.BeginTransaction();
            var divida = session.Get<Divida>(id);
            if (divida != null)
            {
                session.Delete(divida);
                transaction.Commit();
            }
        }

        public Divida RetornaDivida(int id)
        {
            using var session = _sessionFactory.OpenSession();
            return session.QueryOver<Divida>()
                          .Where(d => d.Id == id)
                          .Fetch(d => d.Cliente).Eager
                          .SingleOrDefault();
        }

        public List<Divida> ListarDividas(int pageNumber, int pageSize)
        {
            using var session = _sessionFactory.OpenSession();
            return session.QueryOver<Divida>()
                          .Fetch(d => d.Cliente).Eager
                          .Skip((pageNumber - 1) * pageSize)
                          .Take(pageSize)
                          .List()
                          .ToList();
        }

        public List<Divida> BuscarDividas(string descricao, DateTime? dataPagamento, bool? estaPaga, int pageNumber, int pageSize)
        {
            using var session = _sessionFactory.OpenSession();
            var query = session.QueryOver<Divida>();

            if (!string.IsNullOrEmpty(descricao))
            {
                query = query.WhereRestrictionOn(d => d.Descricao).IsLike($"%{descricao}%");
            }

            if (dataPagamento.HasValue)
            {
                query = query.Where(d => d.DataPagamento == dataPagamento);
            }

            if (estaPaga.HasValue)
            {
                query = query.Where(d => d.EstaPaga == estaPaga);
            }

            return query.Fetch(d => d.Cliente).Eager
                        .Skip((pageNumber - 1) * pageSize)
                        .Take(pageSize)
                        .List()
                        .ToList();
        }
    }
}
