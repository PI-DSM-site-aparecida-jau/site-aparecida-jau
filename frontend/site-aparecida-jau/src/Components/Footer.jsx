import React from "react";
import logo_pascom from "./../assets/img/logo/logo-pascom.png"

const links = [
  { label: "Início", href: "/" },
  { label: "Paróquia", href: "/paroquia" },
  { label: "Notícias", href: "/noticias" },
  { label: "Boletim Informativo", href: "/boletim-informativo" },
  { label: "Contato", href: "/contato" },
];

export default function Footer() {
  return (
    <footer className="w-full mt-[300px] bg-[#1397C6] text-white">
      <div className="mx-auto max-w-4xl px-6">
        {/* Logo e navegação */}
        <div className="flex flex-col items-center justify-between gap-6
                        border-b border-white/30 py-6
                        md:flex-row md:gap-8">

          {/* Logo */}
          <a
            href="/"
            aria-label="Pascom - Página inicial"
            className="shrink-0"
          >
            <img
              src={logo_pascom}
              alt="Logo da Pascom"
              className="h-12 w-auto object-contain"
            />
          </a>

          {/* Links */}
          <nav
            aria-label="Navegação do rodapé"
            className="flex flex-wrap items-center justify-center
                       gap-x-6 gap-y-4 md:gap-x-[71px]"
          >
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs font-semibold transition-colors
                           duration-200 hover:text-white/70
                           focus-visible:outline-none
                           focus-visible:ring-2
                           focus-visible:ring-white"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Copyright */}
        <div className="py-4 text-center md:text-left">
          <p className="text-[11px] text-white/90">
            © {new Date().getFullYear()}. Paróquia Nossa Senhora Aparecida
          </p>
        </div>
      </div>
    </footer>
  );
}