using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api_aparecida_jau.Models
{
    [Table("AcessosSite")]
    public class AcessoSite
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(300)]
        public string Pagina { get; set; }

        public DateTime DataHoraUtc { get; set; }
    }
}
