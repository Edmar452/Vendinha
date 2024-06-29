namespace VendinhaApi.Entidades
{
    public class Divida
    {
        public int Id { get; set; }
        public decimal Valor { get; set; }
        public bool EstaPaga { get; set; }
        public DateTime DataCriacao { get; set; }
        public DateTime? DataPagamento { get; set; }
        public string Descricao { get; set; }
        public Cliente Cliente { get; set; }
    }
}
