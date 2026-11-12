/* Grupo Bahia Imóveis — painel administrativo (carregado pelo cadeado do site) */
(function(){
document.body.insertAdjacentHTML('beforeend', "<div id=\"adm\" hidden><svg width=\"0\" height=\"0\" style=\"position:absolute\" aria-hidden=\"true\"><defs><symbol id=\"i-list\" viewBox=\"0 0 24 24\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01\"/></g></symbol><symbol id=\"i-plus\" viewBox=\"0 0 24 24\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 5v14M5 12h14\"/></g></symbol><symbol id=\"i-users\" viewBox=\"0 0 24 24\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"9\" cy=\"8\" r=\"3.5\"/><path d=\"M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5\"/><path d=\"M16 4.8a3.5 3.5 0 0 1 0 6.4M18.5 14.8c1.6.8 2.6 2.5 3 5.2\"/></g></symbol><symbol id=\"i-clock\" viewBox=\"0 0 24 24\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 7v5l3 2\"/></g></symbol><symbol id=\"i-eye\" viewBox=\"0 0 24 24\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/></g></symbol><symbol id=\"i-eyeoff\" viewBox=\"0 0 24 24\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4M6.6 6.6C3.8 8.4 2 12 2 12s3.6 7 10 7c1.7 0 3.2-.5 4.5-1.2\"/><path d=\"M9.9 9.9a3 3 0 0 0 4.2 4.2\"/></g></symbol><symbol id=\"i-out\" viewBox=\"0 0 24 24\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l-5-5 5-5M5 12h11\"/></g></symbol><symbol id=\"i-upload\" viewBox=\"0 0 24 24\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 16V4M7 9l5-5 5 5M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3\"/></g></symbol><symbol id=\"i-edit\" viewBox=\"0 0 24 24\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4Z\"/><path d=\"m13.5 6.5 4 4\"/></g></symbol><symbol id=\"i-trash\" viewBox=\"0 0 24 24\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6\"/></g></symbol><symbol id=\"i-copy\" viewBox=\"0 0 24 24\"><g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"8\" y=\"8\" width=\"12\" height=\"12\" rx=\"2\"/><path d=\"M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2\"/></g></symbol></defs></svg><!-- ================= LOGIN ================= -->\n<div class=\"auth\" id=\"auth\">\n  <div class=\"auth-card\">\n    <img class=\"auth-logo\" src=\"logo-grupo-bahia.png\" alt=\"Grupo Bahia Imóveis\">\n    <div class=\"demo-note\" id=\"demoNote\" hidden>\n      <b>Modo demonstração</b> — o servidor ainda não foi ligado (veja o LEIA-ME). Você pode testar o painel à vontade: tudo fica só neste navegador e nada é publicado para os visitantes.\n      <button class=\"btn btn-gold\" id=\"demoEntrar\" type=\"button\">Entrar na demonstração como Igor Ribeiro</button>\n    </div>\n\n    <form id=\"fLogin\" autocomplete=\"on\">\n      <h1>Painel administrativo</h1>\n      <p class=\"sub\">Entre com seu usuário e senha.</p>\n      <div class=\"field\"><label for=\"lUser\">Usuário</label><input id=\"lUser\" autocomplete=\"username\" autocapitalize=\"none\" spellcheck=\"false\" required></div>\n      <div class=\"field\"><label for=\"lPass\">Senha</label>\n        <div class=\"pw\"><input id=\"lPass\" type=\"password\" autocomplete=\"current-password\" required><button type=\"button\" class=\"eye\" data-eye=\"lPass\" aria-label=\"Mostrar senha\">👁</button></div></div>\n      <div class=\"ferr\" id=\"lErr\"></div>\n      <button class=\"btn btn-gold w100\" type=\"submit\">Entrar</button>\n      <p class=\"alt-link\">Ainda não tem acesso? <button type=\"button\" id=\"irSolicitar\">Solicitar acesso</button></p>\n    </form>\n\n    <form id=\"fSolicitar\" hidden autocomplete=\"off\">\n      <h1>Solicitar acesso</h1>\n      <p class=\"sub\">Seu pedido vai para o Igor Ribeiro. Você só consegue entrar depois que ele autorizar.</p>\n      <div class=\"field\"><label for=\"sNome\">Nome completo</label><input id=\"sNome\" required></div>\n      <div class=\"field\"><label for=\"sUser\">Usuário (para entrar)</label><input id=\"sUser\" autocapitalize=\"none\" spellcheck=\"false\" placeholder=\"ex.: maria.silva\" required></div>\n      <div class=\"row2\">\n        <div class=\"field\"><label for=\"sPass\">Senha</label><input id=\"sPass\" type=\"password\" autocomplete=\"new-password\" required></div>\n        <div class=\"field\"><label for=\"sPass2\">Repita a senha</label><input id=\"sPass2\" type=\"password\" autocomplete=\"new-password\" required></div>\n      </div>\n      <small class=\"hint\">Mínimo de 8 caracteres, com letras e números.</small>\n      <div class=\"ferr\" id=\"sErr\"></div><div class=\"fok\" id=\"sOk\"></div>\n      <button class=\"btn btn-gold w100\" type=\"submit\">Enviar pedido</button>\n      <p class=\"alt-link\"><button type=\"button\" id=\"irLogin\">← Voltar para o login</button></p>\n    </form>\n  </div>\n  <button type=\"button\" class=\"back-site\" data-adm-fechar>← Voltar para o site</button>\n</div>\n\n<!-- ================= PAINEL ================= -->\n<div class=\"app\" id=\"app\" hidden>\n  <aside class=\"side\" id=\"side\">\n    <img class=\"side-logo\" src=\"logo-grupo-bahia.png\" alt=\"Grupo Bahia Imóveis\">\n    <nav class=\"snav\">\n      <button data-v=\"painel\"><svg><use href=\"#i-grid\"/></svg>Painel</button>\n      <button data-v=\"posts\"><svg><use href=\"#i-list\"/></svg>Publicações</button>\n      <button data-v=\"editor\" id=\"navNovo\"><svg><use href=\"#i-plus\"/></svg>Nova publicação</button>\n      <div class=\"sgrp dono\">Administração</div>\n      <button data-v=\"usuarios\" class=\"dono\"><svg><use href=\"#i-users\"/></svg>Usuários e acessos <span class=\"pill-n\" id=\"nPend\" hidden></span></button>\n      <button data-v=\"registro\" class=\"dono\"><svg><use href=\"#i-clock\"/></svg>Registro de atividades</button>\n      <div class=\"sgrp\">Conta</div>\n      <button data-v=\"conta\"><svg><use href=\"#i-lock\"/></svg>Minha conta</button>\n      <button type=\"button\" data-adm-fechar><svg><use href=\"#i-eye\"/></svg>Voltar ao site</button>\n      <button id=\"sair\"><svg><use href=\"#i-out\"/></svg>Sair</button>\n    </nav>\n    <div class=\"me\"><span class=\"av\" id=\"meAv\">IR</span><div><b id=\"meNome\">—</b><small id=\"mePapel\">—</small></div></div>\n  </aside>\n\n  <div class=\"main\">\n    <header class=\"mbar\">\n      <button class=\"burger2\" id=\"burger2\" aria-label=\"Menu\"><span></span></button>\n      <h1 id=\"vTitulo\">Painel</h1>\n      <span class=\"demo-tag\" id=\"demoTag\" hidden>Demonstração</span>\n      <button class=\"btn btn-gold sm\" data-v=\"editor\" id=\"topNovo\"><svg><use href=\"#i-plus\"/></svg>Nova publicação</button>\n    </header>\n\n    <!-- Painel -->\n    <section class=\"view\" data-view=\"painel\">\n      <div class=\"stats4\" id=\"stats\"></div>\n      <div class=\"cardx\">\n        <div class=\"cx-h\"><h2>Últimas publicações</h2><button class=\"lnk\" data-v=\"posts\">Ver todas →</button></div>\n        <div id=\"ultimos\"></div>\n      </div>\n    </section>\n\n    <!-- Publicações -->\n    <section class=\"view\" data-view=\"posts\" hidden>\n      <div class=\"ptools\">\n        <input id=\"pBusca\" placeholder=\"Buscar por título, cidade ou categoria…\">\n        <select id=\"pStatus\"><option value=\"\">Todas</option><option value=\"publicado\">Publicadas</option><option value=\"rascunho\">Rascunhos (ocultas)</option></select>\n        <select id=\"pCat\"><option value=\"\">Todas as categorias</option></select>\n      </div>\n      <div id=\"pLista\"></div>\n    </section>\n\n    <!-- Editor -->\n    <section class=\"view\" data-view=\"editor\" hidden>\n      <form id=\"fPost\" class=\"egrid\" autocomplete=\"off\">\n        <div class=\"ecol\">\n          <div class=\"cardx\">\n            <h2>Informações</h2>\n            <div class=\"row2\">\n              <div class=\"field\"><label for=\"eTipo\">Tipo de publicação</label>\n                <select id=\"eTipo\"><option value=\"imovel\">Imóvel à venda</option><option value=\"lancamento\">Lançamento / loteamento</option><option value=\"divulgacao\">Divulgação (novidade, promoção, aviso)</option></select></div>\n              <div class=\"field\"><label for=\"eCat\">Categoria</label><select id=\"eCat\"></select></div>\n            </div>\n            <div class=\"field\"><label for=\"eTitulo\">Título *</label><input id=\"eTitulo\" maxlength=\"120\" placeholder=\"Ex.: Fazenda Independência\"></div>\n            <div class=\"row2\">\n              <div class=\"field\"><label for=\"eLocal\">Localização</label><input id=\"eLocal\" maxlength=\"100\" placeholder=\"Ex.: Região de Coaraci · Bahia\"></div>\n              <div class=\"field\"><label for=\"ePreco\">Preço</label><input id=\"ePreco\" maxlength=\"40\" placeholder=\"Ex.: R$ 1.200.000 ou Sob consulta\"></div>\n            </div>\n            <div class=\"field\"><label for=\"eResumo\">Características principais</label><input id=\"eResumo\" maxlength=\"160\" placeholder=\"Ex.: 55 hectares · Terreno plano · Rio Almada\"></div>\n            <div class=\"field\"><label for=\"eEtiqueta\">Etiqueta no cartão (opcional)</label><input id=\"eEtiqueta\" maxlength=\"40\" placeholder=\"Ex.: Parcelamento facilitado\"></div>\n            <div class=\"field\"><label for=\"eDesc\">Descrição</label><textarea id=\"eDesc\" maxlength=\"6000\" rows=\"9\" placeholder=\"Descreva o imóvel. Deixe uma linha em branco entre os parágrafos.\"></textarea></div>\n          </div>\n\n          <div class=\"cardx\">\n            <h2>Ficha técnica</h2>\n            <p class=\"muted\">Informações rápidas que aparecem em destaque na página do imóvel.</p>\n            <div class=\"sugs\" id=\"eSugs\"></div>\n            <div id=\"eFicha\"></div>\n            <button type=\"button\" class=\"btn btn-ghost sm\" id=\"addFicha\"><svg><use href=\"#i-plus\"/></svg>Adicionar item</button>\n          </div>\n\n          <div class=\"cardx\">\n            <h2>Localização e distâncias</h2>\n            <p class=\"muted\">Aparecem no esquema de distâncias. Informe a cidade, os km e, se souber, a direção a partir do imóvel.</p>\n            <div class=\"field\"><label for=\"eLocalTexto\">Texto sobre a localização (opcional)</label><textarea id=\"eLocalTexto\" rows=\"3\" maxlength=\"400\" placeholder=\"Ex.: A pista atravessa a propriedade, com caminhos internos para percorrer a fazenda de carro.\"></textarea></div>\n            <div class=\"dhead-r\"><span>Cidade / referência</span><span>km</span><span>Direção</span><span></span></div>\n            <div id=\"eDist\"></div>\n            <button type=\"button\" class=\"btn btn-ghost sm\" id=\"addDist\"><svg><use href=\"#i-plus\"/></svg>Adicionar distância</button>\n            <div class=\"field\" style=\"margin-top:16px\"><label for=\"eMapa\">Mapa (opcional): endereço ou coordenadas</label><input id=\"eMapa\" maxlength=\"300\" placeholder=\"Ex.: -14.6412, -39.5501 ou Rua X, Coaraci - BA\"></div>\n          </div>\n\n          <div class=\"cardx\">\n            <h2>Fotos e vídeos</h2>\n            <label class=\"drop\" id=\"drop\">\n              <input type=\"file\" id=\"eArq\" accept=\"image/*,video/mp4,video/quicktime,video/webm\" multiple hidden>\n              <svg><use href=\"#i-upload\"/></svg>\n              <b>Arraste as fotos e vídeos aqui</b>\n              <span>ou clique para escolher · fotos são otimizadas automaticamente</span>\n            </label>\n            <div class=\"row-link\">\n              <input id=\"eLink\" placeholder=\"Ou cole um link do YouTube, Instagram ou TikTok\">\n              <button type=\"button\" class=\"btn btn-ghost sm\" id=\"addLink\">Adicionar link</button>\n            </div>\n            <div class=\"mgrid\" id=\"eMidias\"></div>\n            <p class=\"muted small\">A primeira mídia é a capa. Use ◀ ▶ para mudar a ordem.</p>\n          </div>\n        </div>\n\n        <div class=\"ecol side2\">\n          <div class=\"cardx sticky\">\n            <h2>Publicação</h2>\n            <div class=\"field\"><label for=\"eSituacao\">Situação do imóvel</label>\n              <select id=\"eSituacao\"><option value=\"disponivel\">Disponível</option><option value=\"reservado\">Reservado</option><option value=\"vendido\">Vendido</option></select></div>\n            <div class=\"field\"><label>Formato na vitrine</label>\n              <div class=\"fmt\" id=\"eFormato\">\n                <button type=\"button\" data-f=\"padrao\"><i class=\"f1\"></i><span>Padrão</span><small>meia largura</small></button>\n                <button type=\"button\" data-f=\"largo\"><i class=\"f2\"></i><span>Largo</span><small>linha inteira</small></button>\n              </div></div>\n            <label class=\"check\"><input type=\"checkbox\" id=\"eDestaque\"> <span>Destacar (topo da vitrine e página inicial)</span></label>\n            <div class=\"estatus\" id=\"eStatus\">Nova publicação</div>\n            <div class=\"ferr\" id=\"eErr\"></div>\n            <button type=\"button\" class=\"btn btn-gold w100\" id=\"ePublicar\"><svg><use href=\"#i-send\"/></svg>Publicar no site</button>\n            <button type=\"button\" class=\"btn btn-ghost w100\" id=\"eRascunho\">Salvar sem publicar</button>\n            <button type=\"button\" class=\"lnk danger\" id=\"eCancelar\">Cancelar</button>\n            <div class=\"prev-h\">Prévia do cartão</div>\n            <div id=\"ePrev\"></div>\n          </div>\n        </div>\n      </form>\n    </section>\n\n    <!-- Usuários -->\n    <section class=\"view\" data-view=\"usuarios\" hidden>\n      <div class=\"cardx\" id=\"pendBox\"></div>\n      <div class=\"cardx\">\n        <div class=\"cx-h\"><h2>Usuários com acesso</h2><button class=\"btn btn-gold sm\" id=\"novoUser\"><svg><use href=\"#i-plus\"/></svg>Criar usuário</button></div>\n        <div id=\"uLista\"></div>\n      </div>\n    </section>\n\n    <!-- Registro -->\n    <section class=\"view\" data-view=\"registro\" hidden>\n      <div class=\"cardx\"><div id=\"rLista\"></div></div>\n    </section>\n\n    <!-- Minha conta -->\n    <section class=\"view\" data-view=\"conta\" hidden>\n      <div class=\"cardx narrow\">\n        <h2>Trocar minha senha</h2>\n        <form id=\"fSenha\" autocomplete=\"off\">\n          <div class=\"field\"><label for=\"cAtual\">Senha atual</label><input id=\"cAtual\" type=\"password\" autocomplete=\"current-password\"></div>\n          <div class=\"field\"><label for=\"cNova\">Nova senha</label><input id=\"cNova\" type=\"password\" autocomplete=\"new-password\"></div>\n          <div class=\"field\"><label for=\"cNova2\">Repita a nova senha</label><input id=\"cNova2\" type=\"password\" autocomplete=\"new-password\"></div>\n          <small class=\"hint\">Mínimo de 8 caracteres, com letras e números.</small>\n          <div class=\"ferr\" id=\"cErr\"></div>\n          <button class=\"btn btn-gold\" type=\"submit\">Salvar nova senha</button>\n        </form>\n      </div>\n    </section>\n  </div>\n</div>\n\n<!-- Janela de diálogo -->\n<div class=\"dlg\" id=\"dlg\"><div class=\"dlg-box\"><h3 id=\"dlgT\"></h3><div id=\"dlgB\"></div><div class=\"ferr\" id=\"dlgE\"></div><div class=\"dlg-a\"><button class=\"btn btn-ghost sm\" id=\"dlgNo\">Cancelar</button><button class=\"btn btn-gold sm\" id=\"dlgOk\">Confirmar</button></div></div></div>\n<div class=\"toasts\" id=\"toasts\"></div>\n</div>");
/* =====================================================
   Grupo Bahia Imóveis — Painel administrativo
   ===================================================== */
const CFG = window.CONFIG || { endpoint: '' };
const DEMO = !CFG.endpoint;
const CATS = ['Fazenda', 'Terreno', 'Loteamento', 'Sítio', 'Chácara', 'Casa', 'Área', 'Ilha', 'Imóvel comercial', 'Divulgação', 'Outro'];
const MAX_VIDEO_MB = DEMO ? 2.5 : 35;

/* ---------- utilidades ---------- */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const MEM = {};
const ls = {
  get(k, d){ try { const r = localStorage.getItem(k); if (r === null) return k in MEM ? MEM[k] : d; return JSON.parse(r) ?? d; } catch(e){ return k in MEM ? MEM[k] : d; } },
  set(k, v){ MEM[k] = v; try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch(e){ return !(e && /quota/i.test(e.name + e.message)); } },
  del(k){ delete MEM[k]; try { localStorage.removeItem(k); } catch(e){} }
};
const agora = () => { const d = new Date(), p = n => String(n).padStart(2, '0'); return `${p(d.getDate())}/${p(d.getMonth()+1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`; };
const uid = p => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
function toast(msg, tipo = 'ok'){
  const t = document.createElement('div'); t.className = 'toast ' + tipo; t.textContent = msg;
  $('#toasts').appendChild(t); setTimeout(() => t.classList.add('out'), 3200); setTimeout(() => t.remove(), 3700);
}
function dialogo(titulo, html, okTxt = 'Confirmar', perigo = false){
  return new Promise(res => {
    $('#dlgT').textContent = titulo; $('#dlgB').innerHTML = html; $('#dlgE').textContent = '';
    const ok = $('#dlgOk'), no = $('#dlgNo'); ok.textContent = okTxt; ok.classList.toggle('danger', perigo);
    $('#dlg').classList.add('show');
    const f = $('#dlgB').querySelector('input'); if (f) setTimeout(() => f.focus(), 50);
    const fim = v => { $('#dlg').classList.remove('show'); ok.onclick = no.onclick = null; res(v); };
    ok.onclick = () => fim(true); no.onclick = () => fim(false);
  });
}
const senhaOk = s => s.length >= 8 && /[A-Za-z]/.test(s) && /\d/.test(s);

/* ---------- mídias ---------- */
const ytId = u => { const m = String(u).match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([\w-]{11})/); return m ? m[1] : ''; };
function capa(p){
  for (const m of (p.midias || [])){
    if (m.tipo === 'imagem') return m.url;
    if (m.tipo === 'youtube') return 'https://img.youtube.com/vi/' + m.id + '/hqdefault.jpg';
    if (m.tipo === 'video' && m.id && !/^demo/.test(m.id)) return 'https://drive.google.com/thumbnail?id=' + m.id + '&sz=w800';
  }
  return '';
}
function comprimirImagem(file, max = 1600, q = .82){
  return new Promise((res, rej) => {
    if (file.type === 'image/gif' && file.size < 5e6){ const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(file); return; }
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
      res(c.toDataURL('image/jpeg', q));
    };
    img.onerror = () => rej(new Error('Não foi possível ler a imagem ' + file.name));
    img.src = url;
  });
}
const lerArquivo = f => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(f); });

/* =====================================================
   COMUNICAÇÃO COM O SERVIDOR (ou demonstração local)
   ===================================================== */
let S = ls.get('gbi-sessao', null);   // {token, usuario}

async function api(acao, dados = {}){
  if (DEMO) return Demo.run(acao, dados);
  const r = await fetch(CFG.endpoint, { method: 'POST', headers: {'Content-Type': 'text/plain;charset=utf-8'},
    body: JSON.stringify(Object.assign({ acao, token: S && S.token }, dados)) });
  const j = await r.json();
  if (!j.ok){ if (j.sair) encerrar(true); throw new Error(j.erro || 'Erro no servidor.'); }
  return j;
}

/* Demonstração: guarda tudo no navegador, para testar o painel antes de ligar o servidor */
const Demo = {
  users(){ return ls.get('gbi-demo-users', [{ id:'u0', usuario:'igor', nome:'Igor Ribeiro', papel:'dono', status:'ativo', criado:agora(), ultimoAcesso:'', protegido:true }]); },
  posts(){ return ls.get('gbi-demo-posts', JSON.parse(JSON.stringify(CFG.exemplo || []))); },
  log(u, a, d){ const l = ls.get('gbi-demo-log', []); l.push({ data: agora(), usuario: u, acao: a, detalhe: d || '' }); ls.set('gbi-demo-log', l.slice(-300)); },
  salvarPosts(p){ if (!ls.set('gbi-demo-posts', p)) throw new Error('Espaço do navegador cheio. Na demonstração use poucas fotos; no site real não há esse limite.'); },
  async run(acao, d){
    const eu = S && S.usuario, us = this.users(), ps = this.posts(); let r = {};
    switch (acao){
      case 'login': throw new Error('No modo demonstração, use o botão "Entrar na demonstração".');
      case 'demoLogin': { const u = us[0]; r = { token: 'demo', usuario: u }; this.log(u.usuario, 'login'); break; }
      case 'solicitarAcesso': {
        if (us.some(u => u.usuario === d.usuario)) throw new Error('Esse usuário já existe.');
        us.push({ id: uid('u'), usuario: d.usuario, nome: d.nome, papel: 'editor', status: 'pendente', criado: agora(), ultimoAcesso: '' });
        ls.set('gbi-demo-users', us); this.log(d.usuario, 'solicitou acesso', d.nome); break;
      }
      case 'me': r = { usuario: us.find(u => u.id === eu.id) || us[0] }; break;
      case 'logout': break;
      case 'painel': r = { total: ps.length, publicados: ps.filter(p => p.status === 'publicado').length, rascunhos: ps.filter(p => p.status !== 'publicado').length, pendentes: us.filter(u => u.status === 'pendente').length, contatos: 0 }; break;
      case 'postsAdmin': r = { posts: ps.sort((a, b) => a.ordem - b.ordem) }; break;
      case 'salvarPost': {
        const p = Object.assign({}, d.post, { atualizado: agora() });
        const i = ps.findIndex(x => x.id === p.id);
        if (i >= 0) ps[i] = Object.assign(ps[i], p);
        else { p.id = uid('p'); p.criado = agora(); p.autor = eu.nome; p.ordem = Math.min(0, ...ps.map(x => x.ordem)) - 1; ps.push(p); }
        this.salvarPosts(ps); this.log(eu.usuario, i >= 0 ? 'editou postagem' : 'criou postagem', p.titulo); r = { id: p.id }; break;
      }
      case 'excluirPost': { const p = ps.find(x => x.id === d.id); this.salvarPosts(ps.filter(x => x.id !== d.id)); this.log(eu.usuario, 'excluiu postagem', p && p.titulo); break; }
      case 'statusPost': { const p = ps.find(x => x.id === d.id); if (d.status) p.status = d.status; if (typeof d.destaque === 'boolean') p.destaque = d.destaque; this.salvarPosts(ps); this.log(eu.usuario, 'alterou postagem', p.titulo); break; }
      case 'moverPost': {
        ps.sort((a, b) => a.ordem - b.ordem); const i = ps.findIndex(x => x.id === d.id), j = i + (d.direcao === 'cima' ? -1 : 1);
        if (j >= 0 && j < ps.length){ [ps[i], ps[j]] = [ps[j], ps[i]]; ps.forEach((p, k) => p.ordem = k); this.salvarPosts(ps); } break;
      }
      case 'enviarMidia': r = { midia: { tipo: d.mime.startsWith('video') ? 'video' : 'imagem', id: uid('demo'), url: d.dataURL } }; break;
      case 'trocarSenha': this.log(eu.usuario, 'trocou a senha'); break;
      case 'usuarios': r = { usuarios: us }; break;
      case 'criarUsuario': {
        if (us.some(u => u.usuario === d.usuario)) throw new Error('Esse usuário já existe.');
        us.push({ id: uid('u'), usuario: d.usuario, nome: d.nome, papel: d.papel || 'editor', status: 'ativo', criado: agora(), ultimoAcesso: '' });
        ls.set('gbi-demo-users', us); this.log(eu.usuario, 'criou usuário', d.usuario); break;
      }
      case 'aprovarUsuario': case 'bloquearUsuario': case 'excluirUsuario': case 'alterarPapel': case 'redefinirSenha': {
        const u = us.find(x => x.id === d.id); if (!u) throw new Error('Usuário não encontrado.');
        if (u.protegido && acao !== 'redefinirSenha') throw new Error('O acesso do Igor Ribeiro não pode ser alterado.');
        if (acao === 'aprovarUsuario') u.status = 'ativo';
        if (acao === 'bloquearUsuario') u.status = 'bloqueado';
        if (acao === 'alterarPapel') u.papel = d.papel;
        ls.set('gbi-demo-users', acao === 'excluirUsuario' ? us.filter(x => x.id !== d.id) : us);
        this.log(eu.usuario, acao, u.usuario); break;
      }
      case 'registro': r = { registro: ls.get('gbi-demo-log', []).slice().reverse() }; break;
      default: throw new Error('Ação desconhecida.');
    }
    await new Promise(z => setTimeout(z, 120));
    return Object.assign({ ok: true }, r);
  }
};

/* =====================================================
   LOGIN
   ===================================================== */
function telaLogin(){
  $('#app').hidden = true; $('#auth').hidden = false;
  $('#demoNote').hidden = !DEMO;
}
async function entrar(res){
  S = { token: res.token, usuario: res.usuario }; ls.set('gbi-sessao', S);
  iniciarPainel();
}
function encerrar(expirou){
  if (S && !expirou) api('logout').catch(() => {});
  S = null; ls.del('gbi-sessao'); telaLogin();
  if (expirou) toast('Sua sessão expirou. Entre novamente.', 'err');
}
$('#fLogin').addEventListener('submit', async e => {
  e.preventDefault(); const b = e.submitter || $('#fLogin button[type=submit]'); $('#lErr').textContent = ''; b.disabled = true;
  try { await entrar(await api('login', { usuario: $('#lUser').value.trim().toLowerCase(), senha: $('#lPass').value })); $('#lPass').value = ''; }
  catch(err){ $('#lErr').textContent = err.message; }
  b.disabled = false;
});
$('#demoEntrar').onclick = async () => entrar(await api('demoLogin'));
$('#irSolicitar').onclick = () => { $('#fLogin').hidden = true; $('#fSolicitar').hidden = false; $('#sNome').focus(); };
$('#irLogin').onclick = () => { $('#fLogin').hidden = false; $('#fSolicitar').hidden = true; };
$('#fSolicitar').addEventListener('submit', async e => {
  e.preventDefault(); $('#sErr').textContent = ''; $('#sOk').textContent = '';
  const nome = $('#sNome').value.trim(), usuario = $('#sUser').value.trim().toLowerCase(), s1 = $('#sPass').value, s2 = $('#sPass2').value;
  if (nome.length < 3) return $('#sErr').textContent = 'Informe o nome completo.';
  if (!/^[a-z0-9._-]{3,30}$/.test(usuario)) return $('#sErr').textContent = 'Usuário: 3 a 30 letras minúsculas, números, ponto, hífen ou _.';
  if (!senhaOk(s1)) return $('#sErr').textContent = 'A senha precisa de 8+ caracteres, com letras e números.';
  if (s1 !== s2) return $('#sErr').textContent = 'As senhas não conferem.';
  try { await api('solicitarAcesso', { nome, usuario, senha: s1 }); $('#sOk').textContent = 'Pedido enviado! Aguarde a autorização do Igor Ribeiro.'; e.target.reset(); }
  catch(err){ $('#sErr').textContent = err.message; }
});
$$('[data-eye]').forEach(b => b.onclick = () => { const i = $('#' + b.dataset.eye); i.type = i.type === 'password' ? 'text' : 'password'; });

/* =====================================================
   PAINEL
   ===================================================== */
let POSTS = [], VIEW = 'painel';
const TITULOS = { painel: 'Painel', posts: 'Publicações', editor: 'Nova publicação', usuarios: 'Usuários e acessos', registro: 'Registro de atividades', conta: 'Minha conta' };
const souDono = () => S && S.usuario && S.usuario.papel === 'dono';

async function iniciarPainel(){
  try { const r = await api('me'); S.usuario = r.usuario; ls.set('gbi-sessao', S); }
  catch(err){ if (S){ toast(err.message, 'err'); } telaLogin(); return; }
  $('#auth').hidden = true; $('#app').hidden = false; $('#demoTag').hidden = !DEMO;
  $('#app').classList.toggle('is-dono', souDono());
  const n = S.usuario.nome || S.usuario.usuario;
  $('#meNome').textContent = n; $('#mePapel').textContent = souDono() ? 'Dono · acesso total' : 'Editor';
  $('#meAv').textContent = n.split(/\s+/).map(x => x[0]).slice(0, 2).join('').toUpperCase();
  mostrar('painel');
}

function mostrar(v, extra){
  if ((v === 'usuarios' || v === 'registro') && !souDono()) v = 'painel';
  VIEW = v;
  $$('.view').forEach(s => s.hidden = s.dataset.view !== v);
  $$('.snav [data-v]').forEach(b => b.classList.toggle('on', b.dataset.v === v));
  $('#vTitulo').textContent = v === 'editor' && extra ? 'Editar publicação' : TITULOS[v];
  $('#topNovo').hidden = v === 'editor';
  $('#side').classList.remove('open');
  $('#adm').scrollTop = 0;
  ({ painel: vPainel, posts: vPosts, editor: () => vEditor(extra), usuarios: vUsuarios, registro: vRegistro, conta: () => {} })[v]();
}
document.addEventListener('click', e => { const b = e.target.closest('[data-v]'); if (b){ e.preventDefault(); mostrar(b.dataset.v); } });
$('#sair').onclick = () => encerrar();
$('#burger2').onclick = () => $('#side').classList.toggle('open');

/* ---------- Painel ---------- */
async function vPainel(){
  try {
    const [st, ps] = await Promise.all([api('painel'), api('postsAdmin')]);
    POSTS = ps.posts;
    const card = (n, t, v, ico) => `<button class="stat" ${v ? `data-v="${v}"` : ''}><svg><use href="#i-${ico}"/></svg><b>${n}</b><span>${t}</span></button>`;
    $('#stats').innerHTML = card(st.total, 'Publicações', 'posts', 'list') + card(st.publicados, 'No ar no site', 'posts', 'eye') +
      card(st.rascunhos, 'Ocultas / rascunhos', 'posts', 'edit') +
      (souDono() ? card(st.pendentes, 'Acessos aguardando', 'usuarios', 'users') : card(st.contatos, 'Contatos recebidos', '', 'chat'));
    $('#nPend').hidden = !st.pendentes; $('#nPend').textContent = st.pendentes;
    $('#ultimos').innerHTML = POSTS.length ? POSTS.slice(0, 5).map(linhaPost).join('') : vazio('Nenhuma publicação ainda.', 'Criar a primeira publicação', 'editor');
    ligarLinhas($('#ultimos'));
  } catch(err){ toast(err.message, 'err'); }
}
const vazio = (t, b, v) => `<div class="vazio"><p>${t}</p>${b ? `<button class="btn btn-gold sm" data-v="${v}">${b}</button>` : ''}</div>`;

/* ---------- Publicações ---------- */
function linhaPost(p, i, lista){
  const c = capa(p), pub = p.status === 'publicado';
  return `<div class="prow" data-id="${esc(p.id)}">
    <div class="pthumb">${c ? `<img src="${esc(c)}" alt="">` : '<svg><use href="#i-casa"/></svg>'}</div>
    <div class="pinfo">
      <b>${esc(p.titulo)}</b>
      <small>${esc([p.categoria, p.cidade, p.preco].filter(Boolean).join(' · ') || '—')}</small>
      <small class="meta">${(p.midias || []).length} mídia(s) · atualizado ${esc(p.atualizado || p.criado || '')}${p.autor ? ' · por ' + esc(p.autor) : ''}</small>
    </div>
    <div class="ptags"><span class="st ${pub ? 'on' : ''}">${pub ? 'No ar' : 'Oculta'}</span>${p.destaque ? '<span class="st gold">★ Destaque</span>' : ''}${p.situacao === 'vendido' ? '<span class="st off">Vendido</span>' : p.situacao === 'reservado' ? '<span class="st amb">Reservado</span>' : ''}${p.formato === 'largo' ? '<span class="st">Largo</span>' : ''}</div>
    <div class="pacts">
      ${lista ? `<button class="ic" data-a="cima" title="Subir">▲</button><button class="ic" data-a="baixo" title="Descer">▼</button>` : ''}
      <button class="ic" data-a="destaque" title="${p.destaque ? 'Tirar destaque' : 'Destacar'}">${p.destaque ? '★' : '☆'}</button>
      <button class="ic" data-a="status" title="${pub ? 'Ocultar do site' : 'Publicar no site'}"><svg><use href="#i-${pub ? 'eyeoff' : 'eye'}"/></svg></button>
      <button class="ic" data-a="duplicar" title="Duplicar"><svg><use href="#i-copy"/></svg></button>
      <button class="ic" data-a="editar" title="Editar"><svg><use href="#i-edit"/></svg></button>
      <button class="ic danger" data-a="excluir" title="Excluir"><svg><use href="#i-trash"/></svg></button>
    </div>
  </div>`;
}
function ligarLinhas(raiz){
  raiz.querySelectorAll('.prow').forEach(row => {
    const p = POSTS.find(x => x.id === row.dataset.id);
    row.querySelectorAll('[data-a]').forEach(b => b.onclick = () => acaoPost(b.dataset.a, p));
    row.querySelector('.pinfo').onclick = () => mostrar('editor', p);
  });
}
async function acaoPost(a, p){
  try {
    if (a === 'editar') return mostrar('editor', p);
    if (a === 'duplicar') return mostrar('editor', Object.assign(JSON.parse(JSON.stringify(p)), { id: '', titulo: p.titulo + ' (cópia)', status: 'rascunho' }));
    if (a === 'excluir'){
      const ok = await dialogo('Excluir publicação?', `<p>“${esc(p.titulo)}” será removida do site e do painel. Essa ação não pode ser desfeita.</p>
        ${DEMO ? '' : '<label class="check"><input type="checkbox" id="dApagar" checked> <span>Apagar também as fotos e vídeos do Google Drive</span></label>'}`, 'Excluir', true);
      if (!ok) return;
      await api('excluirPost', { id: p.id, apagarArquivos: !DEMO && $('#dApagar') && $('#dApagar').checked }); toast('Publicação excluída.');
    }
    if (a === 'status'){ await api('statusPost', { id: p.id, status: p.status === 'publicado' ? 'rascunho' : 'publicado' }); toast(p.status === 'publicado' ? 'Publicação ocultada do site.' : 'Publicação no ar!'); }
    if (a === 'destaque'){ await api('statusPost', { id: p.id, destaque: !p.destaque }); toast(p.destaque ? 'Destaque removido.' : 'Publicação destacada.'); }
    if (a === 'cima' || a === 'baixo') await api('moverPost', { id: p.id, direcao: a });
    VIEW === 'painel' ? vPainel() : vPosts(true);
  } catch(err){ toast(err.message, 'err'); }
}
async function vPosts(manter){
  if (!manter){ $('#pBusca').value = ''; $('#pStatus').value = ''; }
  $('#pCat').innerHTML = '<option value="">Todas as categorias</option>' + CATS.map(c => `<option>${c}</option>`).join('');
  try { POSTS = (await api('postsAdmin')).posts; desenharPosts(); } catch(err){ toast(err.message, 'err'); }
}
function desenharPosts(){
  const q = $('#pBusca').value.trim().toLowerCase(), st = $('#pStatus').value, cat = $('#pCat').value;
  const l = POSTS.filter(p => (!st || p.status === st) && (!cat || p.categoria === cat) &&
    (!q || [p.titulo, p.cidade, p.categoria, p.resumo].join(' ').toLowerCase().includes(q)));
  const ordenavel = !q && !st && !cat;
  $('#pLista').innerHTML = l.length ? `<div class="cardx flush">${l.map((p, i) => linhaPost(p, i, ordenavel)).join('')}</div>`
    : vazio(POSTS.length ? 'Nada encontrado com esses filtros.' : 'Nenhuma publicação ainda.', 'Nova publicação', 'editor');
  ligarLinhas($('#pLista'));
}
['pBusca', 'pStatus', 'pCat'].forEach(id => $('#' + id).addEventListener('input', desenharPosts));

/* ---------- Editor ---------- */
let E = null;
function vEditor(p){
  E = p ? JSON.parse(JSON.stringify(p)) : { id: '', tipo: 'imovel', titulo: '', categoria: 'Fazenda', cidade: '', preco: '', resumo: '', etiqueta: '', descricao: '', distancias: [], ficha: [], mapa: '', situacao: 'disponivel', formato: 'padrao', midias: [], status: 'rascunho', destaque: false };
  E.midias = E.midias || []; E.distancias = E.distancias || []; E.ficha = E.ficha || []; E.situacao = E.situacao || 'disponivel'; E.formato = E.formato || 'padrao';
  $('#eSituacao').value = E.situacao;
  $('#eCat').innerHTML = CATS.map(c => `<option>${c}</option>`).join('');
  const set = { eLocalTexto: 'localTexto', eTipo: 'tipo', eCat: 'categoria', eTitulo: 'titulo', eLocal: 'cidade', ePreco: 'preco', eResumo: 'resumo', eEtiqueta: 'etiqueta', eDesc: 'descricao', eMapa: 'mapa' };
  Object.entries(set).forEach(([id, k]) => $('#' + id).value = E[k] || '');
  if (E.categoria && !CATS.includes(E.categoria)) $('#eCat').insertAdjacentHTML('afterbegin', `<option>${esc(E.categoria)}</option>`), $('#eCat').value = E.categoria;
  $('#eDestaque').checked = !!E.destaque;
  $('#eStatus').innerHTML = E.id ? (E.status === 'publicado' ? '<span class="st on">No ar no site</span>' : '<span class="st">Oculta (rascunho)</span>') : 'Nova publicação';
  $('#ePublicar').lastChild.textContent = E.id && E.status === 'publicado' ? 'Salvar alterações' : 'Publicar no site';
  $('#eRascunho').textContent = E.id && E.status === 'publicado' ? 'Salvar e ocultar do site' : 'Salvar sem publicar';
  $('#eErr').textContent = ''; $('#eLink').value = '';
  desenharDist(); desenharFicha(); desenharFormato(); desenharMidias(); previa();
}
function lerForm(){
  E.tipo = $('#eTipo').value; E.categoria = $('#eCat').value; E.titulo = $('#eTitulo').value.trim(); E.cidade = $('#eLocal').value.trim();
  E.preco = $('#ePreco').value.trim(); E.resumo = $('#eResumo').value.trim(); E.etiqueta = $('#eEtiqueta').value.trim();
  E.descricao = $('#eDesc').value.trim(); E.mapa = $('#eMapa').value.trim(); E.localTexto = $('#eLocalTexto').value.trim(); E.destaque = $('#eDestaque').checked; E.situacao = $('#eSituacao').value;
}
$('#fPost').addEventListener('input', () => { lerForm(); previa(); });
$('#eTipo').addEventListener('change', () => { if ($('#eTipo').value === 'divulgacao') $('#eCat').value = 'Divulgação'; lerForm(); previa(); });

function desenharDist(){
  const DIRS = [['', 'Sem direção'], ['N', 'Norte'], ['NE', 'Nordeste'], ['L', 'Leste'], ['SE', 'Sudeste'], ['S', 'Sul'], ['SO', 'Sudoeste'], ['O', 'Oeste'], ['NO', 'Noroeste']];
  $('.dhead-r').hidden = !E.distancias.length;
  $('#eDist').innerHTML = E.distancias.map((d, i) => `<div class="drow dist-r" data-i="${i}">
    <input placeholder="Cidade ou referência" value="${esc(d.local)}" data-k="local" maxlength="40">
    <input placeholder="km" value="${esc(d.km)}" data-k="km" inputmode="decimal" maxlength="10">
    <select data-k="dir">${DIRS.map(([v, t]) => `<option value="${v}"${(d.dir || '') === v ? ' selected' : ''}>${t}</option>`).join('')}</select>
    <button type="button" class="ic danger" title="Remover">×</button></div>`).join('');
  $$('#eDist .drow').forEach(r => {
    const i = +r.dataset.i;
    r.querySelectorAll('input,select').forEach(inp => inp.oninput = inp.onchange = () => { E.distancias[i][inp.dataset.k] = inp.value.trim(); });
    r.querySelector('button').onclick = () => { E.distancias.splice(i, 1); desenharDist(); };
  });
}
const SUGS = ['Área total', 'Área construída', 'Quartos', 'Banheiros', 'Água', 'Energia', 'Acesso', 'Topografia', 'Benfeitorias', 'Documentação', 'Pastagem', 'Distância da cidade'];
function desenharFicha(){
  $('#eSugs').innerHTML = SUGS.filter(s => !E.ficha.some(f => f.rotulo === s)).map(s => `<button type="button" data-s="${s}">+ ${s}</button>`).join('');
  $$('#eSugs [data-s]').forEach(b => b.onclick = () => { if (E.ficha.length >= 16) return toast('Máximo de 16 itens.', 'err'); E.ficha.push({ rotulo: b.dataset.s, valor: '' }); desenharFicha(); $('#eFicha .drow:last-child input[data-k="valor"]').focus(); });
  $('#eFicha').innerHTML = E.ficha.map((f, i) => `<div class="drow ficha-r" data-i="${i}">
    <input placeholder="Item (ex.: Energia)" value="${esc(f.rotulo)}" data-k="rotulo" maxlength="40">
    <input placeholder="Valor (ex.: Trifásica)" value="${esc(f.valor)}" data-k="valor" maxlength="80">
    <button type="button" class="ic danger" title="Remover">×</button></div>`).join('');
  $$('#eFicha .drow').forEach(r => {
    const i = +r.dataset.i;
    r.querySelectorAll('input').forEach(inp => inp.oninput = () => { E.ficha[i][inp.dataset.k] = inp.value.trim(); });
    r.querySelector('button').onclick = () => { E.ficha.splice(i, 1); desenharFicha(); };
  });
}
$('#addFicha').onclick = () => { if (E.ficha.length >= 16) return toast('Máximo de 16 itens.', 'err'); E.ficha.push({ rotulo: '', valor: '' }); desenharFicha(); $('#eFicha .drow:last-child input').focus(); };
function desenharFormato(){
  $$('#eFormato [data-f]').forEach(b => { b.classList.toggle('on', b.dataset.f === E.formato); b.onclick = () => { E.formato = b.dataset.f; desenharFormato(); previa(); }; });
}
$('#addDist').onclick = () => { if (E.distancias.length >= 6) return toast('Máximo de 6 distâncias.', 'err'); E.distancias.push({ local: '', km: '', dir: '' }); desenharDist(); $('#eDist .drow:last-child input').focus(); };

function desenharMidias(){
  $('#eMidias').innerHTML = E.midias.map((m, i) => {
    const c = m.tipo === 'imagem' ? m.url : capa({ midias: [m] });
    const rot = { imagem: 'Foto', video: 'Vídeo', youtube: 'YouTube', link: 'Link' }[m.tipo] || m.tipo;
    return `<div class="mi${m.enviando ? ' up' : ''}" data-i="${i}">
      ${c ? `<img src="${esc(c)}" alt="">` : (m.tipo === 'video' && /^data:/.test(m.url) ? `<video src="${esc(m.url)}" muted></video>` : `<span class="mt">${m.tipo === 'link' ? '🔗' : '▶'}</span>`)}
      <span class="ml">${i === 0 ? 'Capa · ' : ''}${rot}</span>
      ${m.enviando ? '<span class="spin"></span>' : `<div class="ma"><button type="button" data-m="esq" title="Mover para trás">◀</button><button type="button" data-m="dir" title="Mover para frente">▶</button><button type="button" data-m="del" class="danger" title="Remover">×</button></div>`}
    </div>`;
  }).join('');
  $$('#eMidias .mi').forEach(el => el.querySelectorAll('[data-m]').forEach(b => b.onclick = () => {
    const i = +el.dataset.i, a = b.dataset.m;
    if (a === 'del') E.midias.splice(i, 1);
    if (a === 'esq' && i > 0) [E.midias[i - 1], E.midias[i]] = [E.midias[i], E.midias[i - 1]];
    if (a === 'dir' && i < E.midias.length - 1) [E.midias[i + 1], E.midias[i]] = [E.midias[i], E.midias[i + 1]];
    desenharMidias(); previa();
  }));
}
async function enviarArquivos(files){
  for (const f of files){
    const video = f.type.startsWith('video'), imagem = f.type.startsWith('image');
    if (!video && !imagem){ toast(f.name + ': formato não aceito.', 'err'); continue; }
    if (video && f.size > MAX_VIDEO_MB * 1048576){ toast(`${f.name}: vídeo maior que ${MAX_VIDEO_MB} MB. ${DEMO ? 'Na demonstração, use vídeos pequenos ou link.' : 'Publique no YouTube e cole o link.'}`, 'err'); continue; }
    const tmp = { tipo: video ? 'video' : 'imagem', url: '', enviando: true }; E.midias.push(tmp); desenharMidias();
    try {
      const dataURL = imagem ? await comprimirImagem(f, DEMO ? 1100 : 1600, DEMO ? .72 : .82) : await lerArquivo(f);
      tmp.url = dataURL; desenharMidias();
      const mime = imagem ? (f.type === 'image/gif' && dataURL.startsWith('data:image/gif') ? 'image/gif' : 'image/jpeg') : (f.type || 'video/mp4');
      const r = await api('enviarMidia', { nome: f.name.replace(/\.[^.]+$/, '') + (imagem && mime === 'image/jpeg' ? '.jpg' : ''), mime, base64: dataURL.split(',')[1], dataURL: DEMO ? dataURL : undefined });
      Object.assign(tmp, r.midia); delete tmp.enviando;
    } catch(err){ E.midias.splice(E.midias.indexOf(tmp), 1); toast(f.name + ': ' + err.message, 'err'); }
    desenharMidias(); previa();
  }
}
$('#eArq').addEventListener('change', e => { enviarArquivos([...e.target.files]); e.target.value = ''; });
const drop = $('#drop');
['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('over'); }));
['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('over'); }));
drop.addEventListener('drop', e => enviarArquivos([...e.dataTransfer.files]));
$('#addLink').onclick = () => {
  const u = $('#eLink').value.trim(); if (!/^https?:\/\//i.test(u)) return toast('Cole um link completo (começando com https://).', 'err');
  const y = ytId(u); E.midias.push(y ? { tipo: 'youtube', id: y, url: 'https://www.youtube.com/watch?v=' + y } : { tipo: 'link', url: u });
  $('#eLink').value = ''; desenharMidias(); previa();
};

function tituloFmt(t){ const w = String(t || 'Título').trim().split(/\s+/); return w.length < 2 ? esc(w[0]) + '<span class="dot">.</span>' : esc(w[0]) + ' <em>' + esc(w.slice(1).join(' ')) + '</em><span class="dot">.</span>'; }
function previa(){
  const p = E, c = capa(p);
  $('#ePrev').innerHTML = `<article class="pcard${p.situacao === 'vendido' ? ' sold' : ''}">
    ${c ? `<img src="${esc(c)}" alt="">` : '<div class="noimg"><svg><use href="#i-casa"/></svg></div>'}
    <div class="badges">${p.tipo === 'lancamento' ? '<span class="badge">Lançamento</span>' : ''}${p.etiqueta ? `<span class="badge">${esc(p.etiqueta)}</span>` : (p.destaque && p.tipo !== 'lancamento' ? '<span class="badge gold">Destaque</span>' : '')}</div>
    ${p.situacao === 'reservado' ? '<span class="sit reservado">Reservado</span>' : p.situacao === 'vendido' ? '<span class="sit vendido">Vendido</span>' : ''}
    <div class="pc"><span class="lo">${esc(p.cidade || p.categoria)}</span><h3>${tituloFmt(p.titulo)}</h3>
    ${p.resumo ? `<p>${esc(p.resumo)}</p>` : ''}${p.preco ? `<b class="pr">${esc(p.preco)}</b>` : ''}
    <div class="pf"><span>Conhecer</span><span class="ar">↗</span></div></div></article>`;
}
async function salvar(publicar){
  lerForm(); $('#eErr').textContent = '';
  if (E.titulo.length < 2){ $('#eErr').textContent = 'Informe o título.'; return $('#eTitulo').focus(); }
  if (E.midias.some(m => m.enviando)) return $('#eErr').textContent = 'Aguarde o envio das mídias terminar.';
  if (publicar && !E.midias.length && !(await dialogo('Publicar sem foto?', '<p>A publicação vai aparecer sem imagem de capa. Deseja continuar?</p>', 'Publicar mesmo assim'))) return;
  const post = Object.assign({}, E, { status: publicar ? 'publicado' : 'rascunho', distancias: E.distancias.filter(d => d.local && d.km), ficha: E.ficha.filter(f => f.rotulo && f.valor), midias: E.midias.map(({ tipo, id, url }) => ({ tipo, id, url })) });
  const bs = [$('#ePublicar'), $('#eRascunho')]; bs.forEach(b => b.disabled = true);
  try { await api('salvarPost', { post }); toast(publicar ? 'Publicado! Já aparece no site.' : 'Salvo como rascunho (oculto no site).'); mostrar('posts'); }
  catch(err){ $('#eErr').textContent = err.message; }
  bs.forEach(b => b.disabled = false);
}
$('#ePublicar').onclick = () => salvar(true);
$('#eRascunho').onclick = () => salvar(false);
$('#eCancelar').onclick = async () => { if (await dialogo('Sair sem salvar?', '<p>As alterações não salvas serão perdidas.</p>', 'Sair')) mostrar('posts'); };

/* ---------- Usuários (só o dono) ---------- */
async function vUsuarios(){
  try {
    const us = (await api('usuarios')).usuarios;
    const pend = us.filter(u => u.status === 'pendente'), outros = us.filter(u => u.status !== 'pendente');
    $('#nPend').hidden = !pend.length; $('#nPend').textContent = pend.length;
    $('#pendBox').hidden = !pend.length;
    $('#pendBox').innerHTML = `<div class="cx-h"><h2>Pedidos de acesso aguardando autorização</h2></div>` + pend.map(u => `
      <div class="urow pend" data-id="${u.id}"><span class="av">${esc(u.nome.split(/\s+/).map(x => x[0]).slice(0, 2).join('').toUpperCase())}</span>
        <div class="uinfo"><b>${esc(u.nome)}</b><small>usuário: ${esc(u.usuario)} · pedido em ${esc(u.criado)}</small></div>
        <div class="uacts"><button class="btn btn-gold sm" data-u="aprovarUsuario">Autorizar</button><button class="btn btn-ghost sm" data-u="excluirUsuario">Recusar</button></div></div>`).join('');
    $('#uLista').innerHTML = outros.map(u => {
      const eu = u.id === S.usuario.id;
      return `<div class="urow" data-id="${u.id}"><span class="av${u.papel === 'dono' ? ' gold' : ''}">${esc(u.nome.split(/\s+/).map(x => x[0]).slice(0, 2).join('').toUpperCase())}</span>
        <div class="uinfo"><b>${esc(u.nome)}${eu ? ' <em>(você)</em>' : ''}</b><small>usuário: ${esc(u.usuario)} · último acesso: ${esc(u.ultimoAcesso || '—')}</small></div>
        <div class="ptags"><span class="st ${u.papel === 'dono' ? 'gold' : ''}">${u.papel === 'dono' ? 'Dono' : 'Editor'}</span><span class="st ${u.status === 'ativo' ? 'on' : 'off'}">${u.status === 'ativo' ? 'Ativo' : 'Bloqueado'}</span></div>
        <div class="uacts">${u.protegido || eu ? (eu ? '' : '<small class="muted">Acesso protegido</small>') + '' : `
          ${u.status === 'ativo' ? '<button class="btn btn-ghost sm" data-u="bloquearUsuario">Bloquear</button>' : '<button class="btn btn-gold sm" data-u="aprovarUsuario">Reativar</button>'}
          <button class="btn btn-ghost sm" data-u="alterarPapel">${u.papel === 'dono' ? 'Tornar editor' : 'Tornar dono'}</button>`}
          ${u.protegido && !eu ? '' : `<button class="btn btn-ghost sm" data-u="redefinirSenha">Nova senha</button>`}
          ${u.protegido || eu ? '' : '<button class="ic danger" data-u="excluirUsuario" title="Excluir"><svg><use href="#i-trash"/></svg></button>'}
        </div></div>`;
    }).join('') + `<p class="muted small" style="padding:14px 4px 0">Dono: pode tudo, inclusive autorizar e bloquear acessos. Editor: cria, edita, publica e exclui publicações.</p>`;
    $$('[data-u]').forEach(b => b.onclick = () => acaoUsuario(b.dataset.u, us.find(x => x.id === b.closest('[data-id]').dataset.id)));
  } catch(err){ toast(err.message, 'err'); }
}
async function acaoUsuario(a, u){
  try {
    if (a === 'redefinirSenha'){
      if (!(await dialogo('Nova senha para ' + u.nome, `<div class="field"><label>Nova senha</label><input id="dSenha" type="text" autocomplete="off"></div><small class="hint">Mínimo de 8 caracteres, com letras e números. Passe a senha para a pessoa por um canal seguro.</small>`, 'Salvar senha'))) return;
      const s = $('#dSenha').value; if (!senhaOk(s)) return toast('Senha fraca: use 8+ caracteres com letras e números.', 'err');
      await api('redefinirSenha', { id: u.id, senha: s }); toast('Senha alterada.'); return;
    }
    const textos = {
      aprovarUsuario: ['Autorizar acesso?', `${esc(u.nome)} poderá entrar no painel e gerenciar publicações.`, 'Autorizar', false],
      bloquearUsuario: ['Bloquear acesso?', `${esc(u.nome)} não conseguirá mais entrar no painel.`, 'Bloquear', true],
      excluirUsuario: [u.status === 'pendente' ? 'Recusar pedido?' : 'Excluir usuário?', `O acesso de ${esc(u.nome)} será removido.`, u.status === 'pendente' ? 'Recusar' : 'Excluir', true],
      alterarPapel: ['Alterar permissão?', u.papel === 'dono' ? `${esc(u.nome)} passará a ser editor.` : `${esc(u.nome)} passará a ser dono, com poder de autorizar e bloquear acessos.`, 'Confirmar', false]
    }[a];
    if (!(await dialogo(textos[0], `<p>${textos[1]}</p>`, textos[2], textos[3]))) return;
    await api(a, { id: u.id, papel: u.papel === 'dono' ? 'editor' : 'dono' });
    toast('Pronto!'); vUsuarios();
  } catch(err){ toast(err.message, 'err'); }
}
$('#novoUser').onclick = async () => {
  const ok = await dialogo('Criar usuário', `
    <div class="field"><label>Nome completo</label><input id="nNome"></div>
    <div class="field"><label>Usuário</label><input id="nUser" autocapitalize="none" placeholder="ex.: maria.silva"></div>
    <div class="field"><label>Senha</label><input id="nSenha" type="text" autocomplete="off"></div>
    <div class="field"><label>Permissão</label><select id="nPapel"><option value="editor">Editor (publicações)</option><option value="dono">Dono (acesso total)</option></select></div>`, 'Criar acesso');
  if (!ok) return;
  const d = { nome: $('#nNome').value.trim(), usuario: $('#nUser').value.trim().toLowerCase(), senha: $('#nSenha').value, papel: $('#nPapel').value };
  if (d.nome.length < 3 || !/^[a-z0-9._-]{3,30}$/.test(d.usuario)) return toast('Preencha nome e um usuário válido (minúsculas, sem espaços).', 'err');
  if (!senhaOk(d.senha)) return toast('Senha fraca: use 8+ caracteres com letras e números.', 'err');
  try { await api('criarUsuario', d); toast('Usuário criado.'); vUsuarios(); } catch(err){ toast(err.message, 'err'); }
};

/* ---------- Registro ---------- */
async function vRegistro(){
  try {
    const r = (await api('registro')).registro;
    $('#rLista').innerHTML = r.length ? `<table class="tbl"><thead><tr><th>Data</th><th>Usuário</th><th>Ação</th><th>Detalhe</th></tr></thead><tbody>${r.map(x => `<tr><td>${esc(x.data)}</td><td>${esc(x.usuario)}</td><td>${esc(x.acao)}</td><td>${esc(x.detalhe)}</td></tr>`).join('')}</tbody></table>` : vazio('Nenhuma atividade registrada.');
  } catch(err){ toast(err.message, 'err'); }
}

/* ---------- Minha conta ---------- */
$('#fSenha').addEventListener('submit', async e => {
  e.preventDefault(); $('#cErr').textContent = '';
  const a = $('#cAtual').value, n = $('#cNova').value, n2 = $('#cNova2').value;
  if (!senhaOk(n)) return $('#cErr').textContent = 'A nova senha precisa de 8+ caracteres, com letras e números.';
  if (n !== n2) return $('#cErr').textContent = 'As senhas não conferem.';
  try { await api('trocarSenha', { atual: a, nova: n }); e.target.reset(); toast('Senha alterada com sucesso.'); } catch(err){ $('#cErr').textContent = err.message; }
});

/* ---------- abrir / fechar dentro do site ---------- */
function abrirPainel(){ $('#adm').hidden = false; document.body.style.overflow = 'hidden'; }
function fecharPainel(){
  $('#adm').hidden = true; document.body.style.overflow = '';
  if (typeof window.recarregarSite === 'function') window.recarregarSite();
}
window.GBI_ADMIN = { abrir: abrirPainel, fechar: fecharPainel };
document.addEventListener('click', e => { if (e.target.closest('[data-adm-fechar]')){ e.preventDefault(); fecharPainel(); } });

/* ---------- início ---------- */
if (S && S.token && (!DEMO || S.token === 'demo')) iniciarPainel(); else telaLogin();

})();
