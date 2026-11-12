/* =====================================================
   Grupo Bahia Imóveis — configuração do site e do painel
   ===================================================== */
window.CONFIG = {
  // WhatsApp da empresa (só números, com 55 + DDD)
  whatsapp: '557196020606',

  // Endereço do "App da Web" do Google Apps Script (termina em /exec). Veja o LEIA-ME.txt.
  // Com ele preenchido:
  //  - o chat envia as mensagens direto, sem sair do site;
  //  - o painel administrativo (cadeado no canto inferior direito do site) funciona com login real;
  //  - a página Imóveis mostra as postagens publicadas no painel.
  // Vazio: o chat abre o WhatsApp com a mensagem pronta e o painel roda em MODO DEMONSTRAÇÃO
  // (tudo fica só no navegador de quem está testando, nada é publicado).
  // Vídeo de fundo da página inicial: clipes em sequência, com transição suave.
  // {q} vira 720 no computador e 360 no celular (economiza dados).
  // Para usar vídeos próprios, envie o .mp4 ao GitHub e troque o src (ex.: 'videos/praia.mp4').
  capa: [
    { tema: 'Praias',            src: 'https://assets.mixkit.co/videos/5371/5371-{q}.mp4' },
    { tema: 'Terrenos com lago', src: 'https://assets.mixkit.co/videos/4998/4998-{q}.mp4' },
    { tema: 'Fazendas',          src: 'https://assets.mixkit.co/videos/827/827-{q}.mp4' },
    { tema: 'Litoral',           src: 'https://assets.mixkit.co/videos/42495/42495-{q}.mp4' },
    { tema: 'Rios e natureza',   src: 'https://assets.mixkit.co/videos/43605/43605-{q}.mp4' }
  ],
  segundosPorClipe: 7,

  endpoint: 'https://script.google.com/macros/s/AKfycbwDawrS0XPQnthz3p6eI5PQlmp5quznjJ7zv6_n_5meKRBdQxKQ_KiNjslS869i8swd/exec'
};
