import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// Registra visualizações de páginas públicas, sem coletar IP ou dados pessoais.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5220/api";

export default function PageViewTracker() {
  const location = useLocation();
  const lastSent = useRef({ path: "", at: 0 });

  useEffect(() => {
    const path = location.pathname;

    // Não contabiliza páginas administrativas, login ou telas de cadastro.
    if (
      path === "/login" ||
      path.startsWith("/admin") ||
      path.startsWith("/criar-")
    ) return;

    // Evita o envio duplicado causado pelo ciclo de efeitos do StrictMode.
    const now = Date.now();
    if (lastSent.current.path === path && now - lastSent.current.at < 1000) return;
    lastSent.current = { path, at: now };

    fetch(`${API_URL}/Estatisticas/acesso`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pagina: path }),
      keepalive: true
    }).catch(() => {
      // A falha no registro de métricas não deve afetar a navegação do visitante.
    });
  }, [location.pathname]);

  return null;
}
