/* =====================================================
   Grupo Bahia Imóveis — configuração do site e do painel
   ===================================================== */
window.CONFIG = {
  // WhatsApp da empresa (só números, com 55 + DDD)
  whatsapp: '5571996020606',

  // Endereço do "App da Web" do Google Apps Script (termina em /exec). Veja o LEIA-ME.txt.
  // Com ele preenchido:
  //  - o chat envia as mensagens direto, sem sair do site;
  //  - o painel administrativo (cadeado no canto inferior direito do site) funciona com login real;
  //  - a página Imóveis mostra as postagens publicadas no painel.
  // Vazio: o chat abre o WhatsApp com a mensagem pronta e o painel roda em MODO DEMONSTRAÇÃO
  // (tudo fica só no navegador de quem está testando, nada é publicado).
  endpoint: 'https://script.google.com/macros/s/AKfycbwDawrS0XPQnthz3p6eI5PQlmp5quznjJ7zv6_n_5meKRBdQxKQ_KiNjslS869i8swd/exec'
};
