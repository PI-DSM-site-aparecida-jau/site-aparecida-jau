using System.ComponentModel.DataAnnotations;

namespace api_aparecida_jau.Models
{
    public class RegistrarAcessoRequest
    {
        [Required]
        [MaxLength(300)]
        public string Pagina { get; set; }
    }
}
