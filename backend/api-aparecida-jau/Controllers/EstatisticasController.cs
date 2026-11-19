using api_aparecida_jau.Data;
using api_aparecida_jau.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace api_aparecida_jau.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EstatisticasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EstatisticasController(AppDbContext context)
        {
            _context = context;
        }

        // Recebe somente o caminho da página. Não armazena IP, cookies ou dados pessoais.
        [HttpPost("acesso")]
        public async Task<IActionResult> RegistrarAcesso([FromBody] RegistrarAcessoRequest request)
        {
            var pagina = request.Pagina?.Trim();

            if (string.IsNullOrWhiteSpace(pagina) ||
                !pagina.StartsWith("/") ||
                pagina.StartsWith("//") ||
                pagina.Length > 300)
                return BadRequest("Caminho de página inválido.");

            if (pagina.StartsWith("/admin", StringComparison.OrdinalIgnoreCase) ||
                pagina.StartsWith("/criar-", StringComparison.OrdinalIgnoreCase) ||
                pagina.Equals("/login", StringComparison.OrdinalIgnoreCase))
                return NoContent();

            _context.AcessosSite.Add(new AcessoSite
            {
                Pagina = pagina,
                DataHoraUtc = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> Dashboard()
        {
            var agoraUtc = DateTime.UtcNow;
            var inicioHojeUtc = agoraUtc.Date;
            var inicio30DiasUtc = inicioHojeUtc.AddDays(-29);
            var inicio14DiasUtc = inicioHojeUtc.AddDays(-13);

            var totalNoticias = await _context.Noticias.CountAsync();
            var totalBoletins = await _context.BoletinsInfos.CountAsync();

            var noticiasRecentes = await _context.Noticias
                .Where(n => n.Data >= DateTime.UtcNow.AddMonths(-5).Date)
                .Select(n => n.Data)
                .ToListAsync();

            var boletinsRecentes = await _context.BoletinsInfos
                .Select(b => b.Data)
                .ToListAsync();

            var meses = Enumerable.Range(0, 6)
                .Select(i => new DateTime(agoraUtc.Year, agoraUtc.Month, 1).AddMonths(i - 5))
                .ToList();

            var publicacoesPorMes = meses.Select(mes =>
            {
                var noticiasNoMes = noticiasRecentes.Count(data =>
                    data.Year == mes.Year && data.Month == mes.Month);

                var boletinsNoMes = boletinsRecentes.Count(data =>
                {
                    if (DateTime.TryParseExact(data, "yyyy-MM", CultureInfo.InvariantCulture,
                        DateTimeStyles.None, out var dataBoletim))
                        return dataBoletim.Year == mes.Year && dataBoletim.Month == mes.Month;
                    return false;
                });

                return new
                {
                    mes = mes.ToString("MMM/yy", new CultureInfo("pt-BR")),
                    total = noticiasNoMes + boletinsNoMes
                };
            }).ToList();

            var acessos30Dias = await _context.AcessosSite
                .Where(a => a.DataHoraUtc >= inicio30DiasUtc)
                .ToListAsync();

            var acessos14Dias = acessos30Dias
                .Where(a => a.DataHoraUtc >= inicio14DiasUtc)
                .ToList();

            var acessosPorDia = Enumerable.Range(0, 14)
                .Select(i => inicio14DiasUtc.AddDays(i))
                .Select(dia => new
                {
                    dia = dia.ToString("dd/MM"),
                    total = acessos14Dias.Count(a => a.DataHoraUtc.Date == dia.Date)
                })
                .ToList();

            var paginasMaisAcessadas = acessos30Dias
                .GroupBy(a => a.Pagina)
                .Select(g => new { pagina = g.Key, total = g.Count() })
                .OrderByDescending(g => g.total)
                .Take(8)
                .ToList();

            return Ok(new
            {
                totalNoticias,
                totalBoletins,
                publicacoesPorMes,
                totalAcessos30Dias = acessos30Dias.Count,
                acessosHoje = acessos30Dias.Count(a => a.DataHoraUtc >= inicioHojeUtc),
                acessosPorDia,
                paginasMaisAcessadas
            });
        }
    }
}
