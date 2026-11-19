import { Link, NavLink } from "react-router-dom";
import logo_aparecida from "./../assets/img/logo/logo-aparecida.png";

const linkClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-semibold transition ${
    isActive ? "bg-[#034389] text-white" : "text-[#034389] hover:bg-blue-50"
  }`;

const AdminNavbar = () => (
  <header className="mt-2 flex flex-col items-center">
    <Link to="/admin" aria-label="Ir para o painel administrativo">
      <img className="w-[220px]" src={logo_aparecida} alt="Paróquia Nossa Senhora Aparecida" />
    </Link>
    <nav className="mt-4 flex w-full flex-wrap items-center justify-center gap-2 px-3 pb-4">
      <NavLink end to="/admin" className={linkClass}>Visão geral</NavLink>
      <NavLink to="/criar-noticia" className={linkClass}>Criar notícia</NavLink>
      <NavLink to="/criar-album" className={linkClass}>Criar álbum</NavLink>
      <NavLink to="/criar-boletim-info" className={linkClass}>Criar boletim</NavLink>
    </nav>
    <div className="h-px w-full bg-[#D9D9D9]" />
  </header>
);

export default AdminNavbar;
