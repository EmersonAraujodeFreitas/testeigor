/* =====================================================
   Grupo Bahia Imóveis — script do site
   ===================================================== */

/* ===== CONFIGURAÇÃO (fica em config.js) ===== */
const CONFIG = window.CONFIG || { whatsapp: '5571996020606', endpoint: '' };

const CATEGORIAS = [
  {nome:'Fazenda',    ico:'fazenda', txt:'Áreas produtivas para pecuária, agricultura e investimento.'},
  {nome:'Terreno',    ico:'terreno', txt:'Terrenos urbanos e rurais para construir do seu jeito.'},
  {nome:'Loteamento', ico:'lote',    txt:'Lotes em loteamentos com potencial de valorização.'},
  {nome:'Sítio',      ico:'sitio',   txt:'Natureza, tranquilidade e espaço para produzir.'},
  {nome:'Chácara',    ico:'chacara', txt:'Lazer e descanso perto da cidade.'},
  {nome:'Casa',       ico:'casa',    txt:'Casas para morar ou investir em todo o Brasil.'}
];

/* ===== CATÁLOGO =====
   As postagens são feitas pelo painel administrativo (admin.html).
   Opcional: itens fixos neste formato também aparecem na página Imóveis:
   {titulo:'Fazenda 120 ha', categoria:'Fazenda', cidade:'Feira de Santana - BA', preco:'R$ 2.500.000', area:'120 hectares', midias:[{tipo:'imagem', url:'fazenda1.jpg'}]}
*/
const IMOVEIS = [];

/* ===== MÍDIAS (usado pelo site e pelo painel) ===== */
const Midia = {
  youtubeId(u){ const m = String(u).match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([\w-]{11})/); return m ? m[1] : ''; },
  capa(p){
    for (const m of (p.midias || [])){
      if (m.tipo === 'imagem') return m.url;
      if (m.tipo === 'youtube') return 'https://img.youtube.com/vi/' + m.id + '/hqdefault.jpg';
      if (m.tipo === 'video' && m.id && !/^demo/.test(m.id)) return 'https://drive.google.com/thumbnail?id=' + m.id + '&sz=w1200';
    }
    return '';
  },
  temVideo(p){ return (p.midias || []).some(m => m.tipo === 'video' || m.tipo === 'youtube'); },
  html(m){
    const u = esc(m.url);
    if (m.tipo === 'imagem') return `<img src="${u}" alt="" loading="lazy">`;
    if (m.tipo === 'youtube') return `<iframe src="https://www.youtube.com/embed/${esc(m.id)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe>`;
    if (m.tipo === 'video') return /^(data:|blob:)/.test(m.url) || /\.(mp4|webm|mov)(\?|$)/i.test(m.url)
      ? `<video src="${u}" controls playsinline preload="metadata"></video>`
      : `<iframe src="${u}" allow="autoplay" allowfullscreen loading="lazy"></iframe>`;
    return `<a class="btn btn-ghost" href="${u}" target="_blank" rel="noopener">Abrir conteúdo</a>`;
  }
};

/* ===== UTILIDADES ===== */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const waLink = (num, msg) => 'https://wa.me/' + num + (msg ? '?text=' + encodeURIComponent(msg) : '');
const MEM = {};
const store = {
  get(k){ try { const v = localStorage.getItem(k); return v === null ? (k in MEM ? MEM[k] : null) : JSON.parse(v); } catch(e){ return k in MEM ? MEM[k] : null; } },
  set(k,v){ MEM[k] = v; try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} }
};
const soDigitos = s => String(s).replace(/\D/g, '');
function mascaraTel(v){
  const d = soDigitos(v).slice(0, 11);
  if (d.length <= 2) return d.length ? '(' + d : '';
  if (d.length <= 6) return `(${d.slice(0,2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`;
  return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
}
const telValido = v => { const d = soDigitos(v); return d.length === 10 || d.length === 11; };
const pagina = () => document.body.dataset.page || 'Início';
const hora = () => new Date().toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'});

/* ===== ENVIO DE MENSAGENS ===== */
async function enviarContato({nome, telefone, mensagem}){
  const tel = soDigitos(telefone);
  const dados = {
    nome, telefone: mascaraTel(tel), mensagem, pagina: pagina(),
    responder: waLink('55' + tel),
    data: new Date().toLocaleString('pt-BR')
  };
  if (CONFIG.endpoint){
    await fetch(CONFIG.endpoint, {method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain;charset=utf-8'}, body: JSON.stringify(dados)});
    return 'direto';
  }
  const texto = `Olá! Meu nome é ${nome}.\nMeu WhatsApp: ${dados.telefone}\n\n${mensagem}`;
  window.open(waLink(CONFIG.whatsapp, texto), '_blank', 'noopener');
  return 'whatsapp';
}

/* ===== CHAT ===== */
function montarChat(){
  const ico = (id, cls='') => `<svg class="${cls}"><use href="#i-${id}"/></svg>`;
  document.body.insertAdjacentHTML('beforeend', `
  <div class="chat" id="chat" role="dialog" aria-label="Conversar com o Grupo Bahia Imóveis">
    <div class="chat-h">
      <span class="av"><img src="logo-grupo-bahia.png" alt=""></span>
      <div><b>Grupo Bahia Imóveis</b><small>Atendimento pelo WhatsApp</small></div>
      <button type="button" id="chatClose" aria-label="Fechar">×</button>
    </div>
    <div class="chat-b" id="chatBody">
      <div class="bub in">Olá! 👋 Seja bem-vindo ao Grupo Bahia Imóveis.\nDeixe seu nome, seu WhatsApp e sua mensagem. Nossa equipe responde no seu WhatsApp.<small>${hora()}</small></div>
    </div>
    <form class="chat-f" id="chatForm" novalidate>
      <div class="two">
        <input id="cNome" placeholder="Seu nome" autocomplete="name" maxlength="60">
        <input id="cTel" placeholder="Seu WhatsApp" inputmode="tel" autocomplete="tel" maxlength="16">
      </div>
      <div class="who"><span id="cWho"></span><button type="button" id="cTroca">alterar</button></div>
      <input class="hp" id="cHp" tabindex="-1" autocomplete="off" aria-hidden="true">
      <div class="send">
        <textarea id="cMsg" placeholder="Digite sua mensagem…" maxlength="800"></textarea>
        <button type="submit" id="cBtn" aria-label="Enviar">${ico('send')}</button>
      </div>
      <div class="err" id="cErr"></div>
      <div class="note">Seus dados são usados só para respondermos você.</div>
    </form>
  </div>
  <button class="fwa" id="fwa" aria-label="Abrir conversa">${ico('wa','w')}<svg class="x" viewBox="0 0 24 24" width="26" height="26"><path d="M6 6l12 12M18 6 6 18" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg></button>`);

  const body = document.body, f = $('#chatForm'), nome = $('#cNome'), tel = $('#cTel'), msg = $('#cMsg'), err = $('#cErr');
  const salvo = store.get('gbi-contato');
  if (salvo){ nome.value = salvo.nome || ''; tel.value = salvo.telefone || ''; }
  const atualizaWho = () => {
    const ok = nome.value.trim().length >= 2 && telValido(tel.value) && store.get('gbi-contato');
    f.classList.toggle('who-ok', !!ok);
    if (ok) $('#cWho').textContent = `${nome.value.trim()} • ${tel.value}`;
  };
  atualizaWho();
  $('#cTroca').onclick = () => { f.classList.remove('who-ok'); nome.focus(); };
  tel.addEventListener('input', () => tel.value = mascaraTel(tel.value));

  const abrir = (texto) => {
    body.classList.add('chat-open');
    if (texto) msg.value = texto;
    setTimeout(() => (f.classList.contains('who-ok') ? msg : (nome.value ? (telValido(tel.value) ? msg : tel) : nome)).focus(), 260);
  };
  const fechar = () => body.classList.remove('chat-open');
  window.abrirChat = abrir;
  $('#fwa').onclick = () => body.classList.contains('chat-open') ? fechar() : abrir();
  $('#chatClose').onclick = fechar;
  document.addEventListener('keydown', e => { if (e.key === 'Escape') fechar(); });
  msg.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey && !matchMedia('(pointer:coarse)').matches){ e.preventDefault(); f.requestSubmit(); } });

  const bolha = (txt, lado) => {
    const b = document.createElement('div'); b.className = 'bub ' + lado;
    b.textContent = txt; b.insertAdjacentHTML('beforeend', `<small>${hora()}</small>`);
    $('#chatBody').appendChild(b); $('#chatBody').scrollTop = 1e6;
  };

  f.addEventListener('submit', async e => {
    e.preventDefault(); err.textContent = '';
    if ($('#cHp').value) return;
    const n = nome.value.trim(), t = tel.value, m = msg.value.trim();
    if (n.length < 2){ f.classList.remove('who-ok'); err.textContent = 'Digite seu nome.'; return nome.focus(); }
    if (!telValido(t)){ f.classList.remove('who-ok'); err.textContent = 'Digite seu WhatsApp com DDD. Ex.: (71) 99999-9999'; return tel.focus(); }
    if (m.length < 2){ err.textContent = 'Digite sua mensagem.'; return msg.focus(); }
    store.set('gbi-contato', {nome:n, telefone:t});
    $('#cBtn').disabled = true;
    bolha(m, 'out'); msg.value = '';
    try {
      const modo = await enviarContato({nome:n, telefone:t, mensagem:m});
      bolha(modo === 'direto'
        ? `Obrigado, ${n.split(' ')[0]}! ✅ Sua mensagem foi enviada. Vamos responder no seu WhatsApp ${mascaraTel(t)}.`
        : `Obrigado, ${n.split(' ')[0]}! Abrimos o WhatsApp com sua mensagem pronta, é só tocar em enviar.`, 'in');
    } catch(_) {
      bolha('Não conseguimos enviar agora. Tente novamente em instantes.', 'in');
    }
    $('#cBtn').disabled = false; atualizaWho();
  });
}

/* ===== PÁGINAS ===== */
function montarCategorias(){
  const html = CATEGORIAS.map(c => `
    <a class="cat rv" href="#" data-cat="${c.nome}">
      <span class="ico"><svg><use href="#i-${c.ico}"/></svg></span>
      <h3>${c.nome}</h3><p>${c.txt}</p>
      <svg class="go" width="22" height="22"><use href="#i-arrow"/></svg>
    </a>`).join('');
  ['#cats', '#cats2'].forEach(s => { const e = $(s); if (e) e.innerHTML = html; });
}

/* ===== GUIAS (tudo na mesma página, sem trocar o link) ===== */
function mostrarAba(nome){
  const alvo = $(`.tab[data-aba="${nome}"]`); if (!alvo) return;
  $$('.tab').forEach(t => t.hidden = t !== alvo);
  $$('.menu [data-tab]').forEach(a => { a.classList.toggle('active', a.dataset.tab === (nome === 'detalhe' ? 'imoveis' : nome)); });
  document.body.dataset.page = alvo.dataset.nome;
  $('#top').classList.remove('open');
  alvo.querySelectorAll('.rv').forEach(x => x.classList.add('in'));
  window.scrollTo({top:0, behavior:'instant' in window ? 'instant' : 'auto'});
  if (nome === 'imoveis') montarImoveis();
}

/* ===== FILTROS DOS IMÓVEIS ===== */
const FILTRO = {categoria:'', cidade:'', max:0};
const VALORES = [['', 'Sem limite', 0], ['100000', 'R$ 100 mil', 1e5], ['250000', 'R$ 250 mil', 2.5e5], ['500000', 'R$ 500 mil', 5e5], ['1000000', 'R$ 1 milhão', 1e6], ['3000000', 'R$ 3 milhões', 3e6]];
const semAcento = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
function precoNumero(s){
  s = semAcento(s); if (!s) return 0;
  let n = parseFloat(s.replace(/[^\d,\.]/g, '').replace(/\./g, '').replace(',', '.')) || 0;
  if (/milh/.test(s) && n < 1000) n *= 1e6; else if (/\bmil\b/.test(s) && n < 100000) n *= 1e3;
  return n;
}
function filtrarPor(f){ Object.assign(FILTRO, f); mostrarAba('imoveis'); }
function sincronizarCampos(){
  ['fTipo','iTipo'].forEach(id => { const e = $('#' + id); if (e) e.value = FILTRO.categoria; });
  ['fCidade','iCidade'].forEach(id => { const e = $('#' + id); if (e) e.value = FILTRO.cidade; });
  ['fValor','iValor'].forEach(id => { const e = $('#' + id); if (e) e.value = FILTRO.max ? String(FILTRO.max) : ''; });
}

let POSTS = [], carregado = false;
async function carregarPosts(){
  let lista = [];
  try {
    if (CONFIG.endpoint){
      const r = await fetch(CONFIG.endpoint + '?acao=posts', {cache:'no-store'});
      const j = await r.json(); if (j.ok) lista = j.posts || [];
    } else {
      lista = (store.get('gbi-demo-posts') || CONFIG.exemplo || []).filter(p => p.status === 'publicado');
    }
  } catch(_) {}
  POSTS = [...lista, ...IMOVEIS.map((p, i) => Object.assign({id:'fixo' + i}, p))];
  const peso = p => (p.situacao === 'vendido' ? 2 : 0) - (p.destaque === true ? 1 : 0);
  POSTS.sort((a, b) => peso(a) - peso(b));
}

/* ===== CARTÃO DO IMÓVEL (estilo vitrine) ===== */
const catDe = p => p.categoria || (p.tipo === 'divulgacao' ? 'Divulgação' : 'Imóvel');
const SIT = {reservado: 'Reservado', vendido: 'Vendido'};
const selos = p => (p.tipo === 'lancamento' ? '<span class="badge">Lançamento</span>' : '') + (p.etiqueta ? `<span class="badge">${esc(p.etiqueta)}</span>` : '') + (!p.etiqueta && p.destaque && p.tipo !== 'lancamento' ? '<span class="badge gold">Destaque</span>' : '');
function tituloFmt(t){
  const w = String(t || '').trim().split(/\s+/);
  if (w.length < 2) return esc(t) + '<span class="dot">.</span>';
  return esc(w[0]) + ' <em>' + esc(w.slice(1).join(' ')) + '</em><span class="dot">.</span>';
}
function verbo(p){
  if (p.tipo === 'divulgacao') return 'Ver publicação';
  if (p.tipo === 'lancamento') return 'Conhecer o lançamento';
  const c = semAcento(catDe(p));
  const art = /^(fazenda|chacara|casa|area|ilha)/.test(c) ? 'a' : 'o';
  return c === 'imovel' ? 'Conhecer o imóvel' : `Conhecer ${art} ${catDe(p).toLowerCase()}`;
}
function cartao(p, mini){
  const capa = Midia.capa(p);
  if (mini) return `
    <article class="scard" data-post="${esc(p.id)}" tabindex="0">
      <div class="ph">${capa ? `<img src="${esc(capa)}" alt="" loading="lazy">` : '<div class="noimg"><svg><use href="#i-casa"/></svg></div>'}${SIT[p.situacao] ? `<span class="sit ${p.situacao}">${SIT[p.situacao]}</span>` : ''}</div>
      <div class="bd"><span class="lo">${esc(p.cidade || catDe(p))}</span><h3>${esc(p.titulo)}</h3>
        ${p.resumo || p.preco ? `<p>${esc([p.preco, p.resumo].filter(Boolean).join(' · '))}</p>` : ''}
        <span class="lk">Ver imóvel ↗</span></div>
    </article>`;
  return `
    <article class="pcard${p.destaque ? ' hl' : ''}${p.formato === 'largo' ? ' wide' : ''}${p.situacao === 'vendido' ? ' sold' : ''}" data-post="${esc(p.id)}" tabindex="0">
      ${capa ? `<img src="${esc(capa)}" alt="${esc(p.titulo)}" loading="lazy">` : '<div class="noimg"><svg><use href="#i-casa"/></svg></div>'}
      <div class="badges">${selos(p)}</div>
      ${SIT[p.situacao] ? `<span class="sit ${p.situacao}">${SIT[p.situacao]}</span>` : (Midia.temVideo(p) ? '<span class="play" title="Tem vídeo">▶</span>' : '')}
      <div class="pc">
        <span class="lo">${esc(p.cidade || catDe(p))}</span>
        <h3>${tituloFmt(p.titulo)}</h3>
        ${p.resumo ? `<p>${esc(p.resumo)}</p>` : ''}
        ${p.preco ? `<b class="pr">${esc(p.preco)}</b>` : ''}
        <div class="pf"><span>${verbo(p)}</span><span class="ar">↗</span></div>
      </div>
    </article>`;
}
function montarDestaques(){
  const box = $('#destaques'); if (!box) return;
  const disp = POSTS.filter(p => p.situacao !== 'vendido');
  const lista = [...disp.filter(p => p.destaque), ...disp.filter(p => !p.destaque)].slice(0, 4);
  box.hidden = !lista.length;
  $('#destCards').innerHTML = lista.map((p, i) => cartao(Object.assign({}, p, {formato: lista.length % 2 && i === 0 ? 'largo' : 'padrao'}))).join('');
  ligarCartoes($('#destCards'));
}
function ligarCartoes(raiz){
  raiz.querySelectorAll('[data-post]').forEach(a => {
    a.addEventListener('click', () => abrirImovel(a.dataset.post));
    a.addEventListener('keydown', e => { if (e.key === 'Enter') abrirImovel(a.dataset.post); });
  });
}

/* ===== PÁGINA DO IMÓVEL (abre na mesma tela, sem trocar o link) ===== */
let abaAnterior = 'imoveis';
const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const dd = n => String(n).padStart(2, '0');
function iconeFicha(rotulo){
  const r = semAcento(rotulo);
  if (/agua|nascente|rio|poco/.test(r)) return 'gota';
  if (/energia|luz|eletric/.test(r)) return 'raio';
  if (/document|escritura|registro/.test(r)) return 'shield';
  if (/quarto|banheiro|suite|casa|constru/.test(r)) return 'casa';
  if (/acesso|distancia|estrada/.test(r)) return 'pin';
  if (/pasto|pastagem|lavoura|plant|pomar/.test(r)) return 'sitio';
  if (/benfeit|curral|galpao|armazem/.test(r)) return 'fazenda';
  if (/area|hectare|topograf|terreno/.test(r)) return 'terreno';
  return 'check';
}
function abrirImovel(id){
  const p = POSTS.find(x => x.id === id); if (!p) return;
  const atual = $('.tab:not([hidden])'); if (atual && atual.dataset.aba !== 'detalhe') abaAnterior = atual.dataset.aba;
  const ms = p.midias || [];
  const fotos = ms.map((m, i) => ({m, i})).filter(x => x.m.tipo === 'imagem');
  const videos = ms.map((m, i) => ({m, i})).filter(x => x.m.tipo !== 'imagem');
  const capa = Midia.capa(p);
  const sit = SIT[p.situacao];
  const destaques = (p.resumo || '').split('·').map(s => s.trim()).filter(Boolean);
  const ficha = (p.ficha || []).filter(f => f.rotulo && f.valor);
  const rapidos = ficha.slice(0, 3);
  const local = blocoLocal(p);
  const interesse = esc('Olá! Tenho interesse em: ' + p.titulo + (p.cidade ? ' (' + p.cidade + ')' : '') + '.');
  const sim = (() => {
    const outros = POSTS.filter(x => x.id !== p.id);
    const mesmo = outros.filter(x => catDe(x) === catDe(p));
    return {lista: [...mesmo, ...outros.filter(x => catDe(x) !== catDe(p))].slice(0, 8), mesmo: mesmo.length > 0};
  })();
  // próximos 6 dias (sem domingo)
  const dias = []; for (let d = new Date(), k = 0; dias.length < 6 && k < 10; k++){ d.setDate(d.getDate() + 1); if (d.getDay() !== 0) dias.push(new Date(d)); }
  const mosaico = lista => lista.map(({m, i}, k) => {
    const src = m.tipo === 'imagem' ? m.url : Midia.capa({midias: [m]});
    return `<button class="mz${k % 6 === 0 ? ' big' : ''}" data-i="${i}">${src ? `<img src="${esc(src)}" alt="" loading="lazy">` : '<span class="gv"></span>'}${m.tipo !== 'imagem' ? '<span class="play">▶</span>' : ''}</button>`;
  }).join('');

  $('#detalheBody').innerHTML = `
    <section class="ph2${capa ? '' : ' sem'}">
      <div class="ph2-media">${capa ? `<img src="${esc(capa)}" alt="${esc(p.titulo)}">` : ''}</div>
      <div class="wrap ph2-in">
        <button class="voltar2" data-tab="${abaAnterior}">← Voltar</button>
        <div class="ph2-txt">
          <div class="ph2-chips">${p.tipo === 'lancamento' ? '<span>Lançamento</span>' : ''}<span>${esc(catDe(p))}</span><span class="${p.situacao || 'disponivel'}">${sit || 'Disponível'}</span></div>
          <span class="lo">${esc(p.cidade || '')}</span>
          <h1>${tituloFmt(p.titulo)}</h1>
          ${p.resumo ? `<p>${esc(p.resumo)}</p>` : ''}
          <div class="ph2-act">
            ${fotos.length ? `<button class="btn btn-gold" data-galeria="0"><svg><use href="#i-grid"/></svg>Ver as fotos <b>${fotos.length}</b></button>` : ''}
            ${videos.length ? `<button class="btn btn-ghost light" data-galeria="${videos[0].i}"><svg><use href="#i-play"/></svg>Assistir ao vídeo</button>` : ''}
          </div>
        </div>
        ${ms.length > 1 ? `<div class="ph2-thumbs">${ms.slice(1, 4).map((m, k) => { const s = m.tipo === 'imagem' ? m.url : Midia.capa({midias: [m]}); return `<button data-galeria="${k + 1}">${s ? `<img src="${esc(s)}" alt="">` : ''}${k === 2 && ms.length > 4 ? `<span>+${ms.length - 4}</span>` : ''}</button>`; }).join('')}</div>` : ''}
      </div>
    </section>

    <div class="sbar"><div class="wrap sbar-in">
      <div class="sbar-p"><small>Valor</small><b>${esc(p.preco || 'Sob consulta')}</b></div>
      ${rapidos.length ? `<div class="sbar-f">${rapidos.map(f => `<div><svg><use href="#i-${iconeFicha(f.rotulo)}"/></svg><span><small>${esc(f.rotulo)}</small>${esc(f.valor)}</span></div>`).join('')}</div>` : '<div class="sbar-f"></div>'}
      <div class="sbar-a">
        <button class="ic2" data-share title="Compartilhar" aria-label="Compartilhar"><svg><use href="#i-share"/></svg><span>Compartilhar</span></button>
        <button class="btn btn-gold" data-chat="${interesse}">Tenho interesse</button>
      </div>
    </div></div>

    <div class="wrap d2">
      <div class="d2-main">
        <section class="d2-sec" id="sec-desc">
          <span class="eyebrow">Sobre o imóvel</span>
          <h2>Conheça ${p.tipo === 'divulgacao' ? 'os detalhes' : 'cada detalhe'}<span class="gold">.</span></h2>
          ${destaques.length ? `<ul class="hl2">${destaques.map(t => `<li><svg><use href="#i-check"/></svg>${esc(t)}</li>`).join('')}</ul>` : ''}
          <div class="txt2">${(p.descricao || 'Consulte os detalhes com a nossa equipe.').split(/\n\s*\n|\n/).filter(s => s.trim()).map(s => `<p>${esc(s)}</p>`).join('')}</div>
        </section>
        ${ficha.length ? `
        <section class="d2-sec">
          <span class="eyebrow">Ficha técnica</span>
          <div class="fi2">${ficha.map(f => `<div><i><svg><use href="#i-${iconeFicha(f.rotulo)}"/></svg></i><span><small>${esc(f.rotulo)}</small><b>${esc(f.valor)}</b></span></div>`).join('')}</div>
        </section>` : ''}
        ${ms.length ? `
        <section class="d2-sec" id="sec-fotos">
          <div class="mz-head"><div><span class="eyebrow">Galeria</span><h2>Fotos e vídeos</h2></div>
            ${fotos.length && videos.length ? `<div class="lc-tabs mz-tabs"><button class="on" data-mz="f">Fotos ${fotos.length}</button><button data-mz="v">Vídeos ${videos.length}</button></div>` : ''}</div>
          <div class="mz-grid" data-mzp="f">${mosaico(fotos.length ? fotos : videos)}</div>
          ${fotos.length && videos.length ? `<div class="mz-grid" data-mzp="v" hidden>${mosaico(videos)}</div>` : ''}
        </section>` : ''}
      </div>
      <aside class="d2-side" id="sec-contato">
        <div class="vis">
          <span class="mini">Visita guiada</span>
          <h3>Agende sua visita</h3>
          <p>Escolha o melhor dia e período. A nossa equipe confirma com você pelo WhatsApp.</p>
          <div class="vis-l">Dia</div>
          <div class="vis-d">${dias.map((d, k) => `<button type="button" class="${k ? '' : 'on'}" data-dia="${dd(d.getDate())}/${dd(d.getMonth() + 1)}/${d.getFullYear()}" data-sem="${DIAS[d.getDay()]}"><small>${DIAS[d.getDay()]}</small><b>${dd(d.getDate())}</b><small>${dd(d.getMonth() + 1)}</small></button>`).join('')}</div>
          <div class="vis-l">Período</div>
          <div class="vis-p"><button type="button" class="on" data-per="Manhã">Manhã</button><button type="button" data-per="Tarde">Tarde</button></div>
          <button class="btn btn-gold w100" id="pedirVisita"><svg><use href="#i-chat"/></svg>Solicitar visita</button>
          <div class="vis-or"><span>ou</span></div>
          <button class="btn btn-ghost w100" data-chat="${interesse}">Tirar uma dúvida</button>
          <a class="vis-tel" href="#" data-chat="${interesse}"><svg><use href="#i-wa"/></svg>(71) 99602-0606</a>
        </div>
      </aside>
    </div>

    ${local}

    ${sim.lista.length ? `
    <section class="sim2"><div class="wrap">
      <div class="sim2-h"><div><span class="eyebrow">Continue explorando</span><h2>${sim.mesmo ? 'Imóveis similares' : 'Outras oportunidades'}</h2></div>
        <div class="sim2-n"><button class="ic2" data-sim="-1" aria-label="Anterior">‹</button><button class="ic2" data-sim="1" aria-label="Próxima">›</button></div></div>
      <div class="sim2-t">${sim.lista.map(x => cartao(x, true)).join('')}</div>
    </div></section>` : ''}

    <div class="mbar2"><div><small>${esc(p.preco ? 'Valor' : catDe(p))}</small><b>${esc(p.preco || 'Sob consulta')}</b></div><button class="ic2" data-share aria-label="Compartilhar"><svg><use href="#i-share"/></svg></button><button class="btn btn-gold" data-chat="${interesse}">Tenho interesse</button></div>`;

  const body = $('#detalheBody');
  body.querySelectorAll('[data-galeria]').forEach(b => b.onclick = () => lightbox(ms, +b.dataset.galeria));
  body.querySelectorAll('.mz').forEach(b => b.onclick = () => lightbox(ms, +b.dataset.i));
  body.querySelectorAll('[data-mz]').forEach(b => b.onclick = () => {
    body.querySelectorAll('[data-mz]').forEach(x => x.classList.toggle('on', x === b));
    body.querySelectorAll('[data-mzp]').forEach(x => x.hidden = x.dataset.mzp !== b.dataset.mz);
  });
  const escolher = sel => body.querySelectorAll(sel).forEach(b => b.onclick = () => body.querySelectorAll(sel).forEach(x => x.classList.toggle('on', x === b)));
  escolher('.vis-d button'); escolher('.vis-p button');
  $('#pedirVisita').onclick = () => {
    const d = body.querySelector('.vis-d .on'), per = body.querySelector('.vis-p .on');
    abrirChat(`Olá! Gostaria de agendar uma visita: ${p.titulo}${p.cidade ? ' (' + p.cidade + ')' : ''}.\nDia: ${d.dataset.sem}, ${d.dataset.dia}\nPeríodo: ${per.dataset.per}`);
  };
  const trilho = body.querySelector('.sim2-t');
  body.querySelectorAll('[data-sim]').forEach(b => b.onclick = () => trilho.scrollBy({left: +b.dataset.sim * (trilho.clientWidth * .8), behavior: 'smooth'}));
  ligarCartoes(body);
  ligarLocal(body);
  body.querySelectorAll('[data-share]').forEach(sh => sh.onclick = async () => {
    const texto = `${p.titulo}${p.cidade ? ' — ' + p.cidade : ''}${p.preco ? ' — ' + p.preco : ''}\nVeja no site do Grupo Bahia Imóveis: ${location.href.split('#')[0]}`;
    try {
      if (navigator.share) await navigator.share({title: p.titulo, text: texto});
      else { await navigator.clipboard.writeText(texto); const s = sh.querySelector('span'); if (s){ s.textContent = 'Texto copiado!'; setTimeout(() => s.textContent = 'Compartilhar', 2200); } }
    } catch(_) {}
  });
  mostrarAba('detalhe');
}

/* ===== LOCALIZAÇÃO: radar de distâncias + lista + mapa ===== */
const DIRS = {N:[-90,'ao Norte'], NE:[-45,'a Nordeste'], L:[0,'a Leste'], SE:[45,'a Sudeste'], S:[90,'ao Sul'], SO:[135,'a Sudoeste'], O:[180,'a Oeste'], NO:[-135,'a Noroeste']};
const kmNum = k => parseFloat(String(k).replace(',', '.')) || 0;
function radarSVG(p, ds){
  const C = 230, R0 = 34, R1 = 176;
  const max = Math.max(...ds.map(d => kmNum(d.km)), 1);
  const raio = km => R0 + (R1 - R0) * Math.sqrt(Math.min(km, max) / max);
  const passos = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500];
  const passo = passos.find(s => max / s <= 4) || 1000;
  const aneis = []; for (let k = passo; k < max * 1.001 && aneis.length < 4; k += passo) aneis.push(k);
  if (!aneis.length || aneis[aneis.length - 1] < max * .8) aneis.push(Math.round(max));
  const semDir = ds.filter(d => !DIRS[d.dir]).length;
  let k = 0;
  const pts = ds.map((d, i) => {
    const ang = DIRS[d.dir] ? DIRS[d.dir][0] : -150 + (k++) * 360 / Math.max(semDir, 1);
    const r = raio(kmNum(d.km)), a = ang * Math.PI / 180;
    return {d, x: C + r * Math.cos(a), y: C + r * Math.sin(a), ang};
  });
  const rot = pts.map((t, i) => {
    const dir = Math.cos(t.ang * Math.PI / 180) >= -0.1 ? 1 : -1;
    const lx = t.x + 14 * dir, anchor = dir > 0 ? 'start' : 'end';
    const ly = Math.max(26, Math.min(434, t.y));
    return `<g class="rp" style="--d:${.15 + i * .12}s">
      <line x1="${C}" y1="${C}" x2="${t.x.toFixed(1)}" y2="${t.y.toFixed(1)}" class="rl"/>
      <circle cx="${t.x.toFixed(1)}" cy="${t.y.toFixed(1)}" r="11" class="rh"/>
      <circle cx="${t.x.toFixed(1)}" cy="${t.y.toFixed(1)}" r="5" class="rd"/>
      <text x="${lx.toFixed(1)}" y="${(ly - 3).toFixed(1)}" text-anchor="${anchor}" class="rt">${esc(t.d.local)}</text>
      <text x="${lx.toFixed(1)}" y="${(ly + 13).toFixed(1)}" text-anchor="${anchor}" class="rk">${esc(t.d.km)} km</text>
    </g>`;
  }).join('');
  return `<svg class="radar" viewBox="0 0 460 460" role="img" aria-label="Esquema de distâncias a partir de ${esc(p.titulo)}">
    <defs><radialGradient id="rg" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#d9ad5f" stop-opacity=".22"/><stop offset="1" stop-color="#d9ad5f" stop-opacity="0"/></radialGradient></defs>
    <circle cx="${C}" cy="${C}" r="${R1 + 18}" fill="url(#rg)"/>
    ${aneis.map(k => `<circle cx="${C}" cy="${C}" r="${raio(k).toFixed(1)}" class="ring"/><text x="${C + 5}" y="${(C - raio(k) - 5).toFixed(1)}" class="rlab">${k} km</text>`).join('')}
    <line x1="${C}" y1="${C - R1 - 18}" x2="${C}" y2="${C + R1 + 18}" class="axis"/><line x1="${C - R1 - 18}" y1="${C}" x2="${C + R1 + 18}" y2="${C}" class="axis"/>
    <text x="${C}" y="16" class="card">N</text><text x="${C}" y="452" class="card">S</text><text x="451" y="${C + 4}" class="card">L</text><text x="9" y="${C + 4}" class="card">O</text>
    <g class="sweep"><path d="M${C} ${C} L${C} ${C - R1 - 18} A${R1 + 18} ${R1 + 18} 0 0 1 ${(C + (R1 + 18) * Math.sin(Math.PI / 5)).toFixed(1)} ${(C - (R1 + 18) * Math.cos(Math.PI / 5)).toFixed(1)} Z"/></g>
    ${rot}
    <circle cx="${C}" cy="${C}" r="16" class="cp"/><circle cx="${C}" cy="${C}" r="7" class="cc"/>
  </svg>`;
}
function blocoLocal(p){
  const ds = (p.distancias || []).filter(d => d.local && d.km);
  if (!ds.length && !p.mapa && !p.localTexto) return '';
  const ordem = [...ds].sort((a, b) => kmNum(a.km) - kmNum(b.km));
  const max = Math.max(...ds.map(d => kmNum(d.km)), 1);
  const regiao = p.cidade ? p.cidade.split(/[·\-–,]/)[0].trim() : 'Bahia';
  const temDir = ds.some(d => DIRS[d.dir]);
  const rotas = p.mapa ? 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(p.mapa) : '';
  const mapaFrame = p.mapa ? `<iframe class="mapa2" data-src="https://www.google.com/maps?q=${encodeURIComponent(p.mapa)}&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Mapa da localização"></iframe>` : '';
  return `
  <section class="loc2" id="sec-local"><div class="wrap">
    <div class="loc2-head">
      <div><span class="eyebrow">Localização</span><h2>${esc(regiao)}<span class="gold">.</span></h2></div>
      ${p.localTexto ? `<p>${esc(p.localTexto)}</p>` : `<p>Veja a que distância ${p.tipo === 'divulgacao' ? 'fica' : 'o imóvel fica'} das principais referências da região.</p>`}
    </div>
    <div class="loc2-grid">
      <div class="loc2-card">
        <div class="lc-top">
          <div><b>${esc(p.titulo)}</b><small>${esc(p.cidade || regiao)}</small></div>
          ${p.mapa && ds.length ? `<div class="lc-tabs" role="tablist"><button class="on" data-lt="esq">Esquema</button><button data-lt="mapa">Mapa</button></div>` : ''}
        </div>
        <div class="lc-body">
          ${ds.length ? `<div class="lc-pane on" data-lp="esq">${radarSVG(p, ds)}</div>` : ''}
          ${p.mapa ? `<div class="lc-pane${ds.length ? '' : ' on'}" data-lp="mapa">${mapaFrame}</div>` : ''}
        </div>
        <div class="lc-foot">${ds.length ? (temDir ? 'Esquema ilustrativo · direções aproximadas · distância fora de escala' : 'Esquema ilustrativo · posições e escala aproximadas') : 'Localização aproximada'}</div>
      </div>
      <div class="loc2-side">
        ${ds.length ? `<span class="mini">Distâncias</span>
        <ol class="dlist">${ordem.map((d, i) => `<li style="--w:${Math.max(6, kmNum(d.km) / max * 100).toFixed(0)}%;--d:${.1 + i * .08}s">
          <span class="n">${String(i + 1).padStart(2, '0')}</span>
          <div class="t"><b>${esc(d.local)}</b>${DIRS[d.dir] ? `<small>${DIRS[d.dir][1]}</small>` : ''}<i class="bar"></i></div>
          <span class="k">${esc(d.km)}<small>km</small></span></li>`).join('')}</ol>
        <p class="nota">Distâncias informadas pelo anunciante. Percurso e acesso exatos a confirmar.</p>` : ''}
        <div class="loc2-act">
          ${rotas ? `<a class="btn btn-gold" href="${esc(rotas)}" target="_blank" rel="noopener"><svg><use href="#i-pin"/></svg>Como chegar</a>` : ''}
          <button class="btn btn-ghost" data-chat="${esc('Olá! Gostaria de saber mais sobre a localização e o acesso de: ' + p.titulo + '.')}"><svg><use href="#i-chat"/></svg>Perguntar sobre o acesso</button>
        </div>
      </div>
    </div>
  </div></section>`;
}
function ligarLocal(raiz){
  raiz.querySelectorAll('[data-lt]').forEach(b => b.onclick = () => {
    raiz.querySelectorAll('[data-lt]').forEach(x => x.classList.toggle('on', x === b));
    raiz.querySelectorAll('[data-lp]').forEach(x => x.classList.toggle('on', x.dataset.lp === b.dataset.lt));
    const f = raiz.querySelector('.mapa2'); if (b.dataset.lt === 'mapa' && f && !f.src) f.src = f.dataset.src;
  });
  const soMapa = raiz.querySelector('.lc-pane.on .mapa2'); if (soMapa) soMapa.src = soMapa.dataset.src;
  const sec = raiz.querySelector('.loc2');
  if (sec && 'IntersectionObserver' in window){
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ sec.classList.add('vis'); io.disconnect(); } }), {threshold:.2});
    io.observe(sec);
  } else if (sec) sec.classList.add('vis');
}

/* ===== GALERIA AMPLIADA ===== */
let LB = {ms: [], i: 0};
function lightbox(ms, i){
  let lb = $('#lb');
  if (!lb){
    document.body.insertAdjacentHTML('beforeend', `<div class="lb" id="lb" role="dialog" aria-modal="true">
      <button class="lbx" aria-label="Fechar">×</button><button class="lbp" aria-label="Anterior">‹</button><button class="lbn" aria-label="Próxima">›</button>
      <div class="lbm" id="lbm"></div><div class="lbc" id="lbc"></div></div>`);
    lb = $('#lb');
    lb.querySelector('.lbx').onclick = fecharLightbox;
    lb.querySelector('.lbp').onclick = () => lbIr(-1);
    lb.querySelector('.lbn').onclick = () => lbIr(1);
    lb.addEventListener('click', e => { if (e.target === lb || e.target.id === 'lbm') fecharLightbox(); });
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('show')) return;
      if (e.key === 'Escape') fecharLightbox(); if (e.key === 'ArrowLeft') lbIr(-1); if (e.key === 'ArrowRight') lbIr(1);
    });
    let x0 = null;
    lb.addEventListener('touchstart', e => x0 = e.touches[0].clientX, {passive:true});
    lb.addEventListener('touchend', e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) lbIr(dx < 0 ? 1 : -1); x0 = null; });
  }
  LB = {ms, i}; lbDesenhar(); lb.classList.add('show'); document.body.style.overflow = 'hidden';
}
function lbIr(d){ LB.i = (LB.i + d + LB.ms.length) % LB.ms.length; lbDesenhar(); }
function lbDesenhar(){ $('#lbm').innerHTML = Midia.html(LB.ms[LB.i]); $('#lbc').textContent = (LB.i + 1) + ' / ' + LB.ms.length; }
function fecharLightbox(){ const lb = $('#lb'); if (lb && lb.classList.contains('show')){ lb.classList.remove('show'); $('#lbm').innerHTML = ''; document.body.style.overflow = ''; } }

async function montarImoveis(){
  const alvo = $('#cards'); if (!alvo) return;
  if (!carregado){
    alvo.innerHTML = '<div class="empty" style="opacity:.6"><span class="ico"><svg><use href="#i-search"/></svg></span><div><h3>Carregando…</h3></div></div>';
    await carregarPosts(); carregado = true;
  }
  desenharImoveis();
}
function desenharImoveis(){
  const alvo = $('#cards'), chips = $('#chips');
  const IM = POSTS;
  sincronizarCampos();
  const cat = p => p.categoria || (p.tipo === 'divulgacao' ? 'Divulgação' : 'Imóvel');
  const temFiltro = FILTRO.categoria || FILTRO.cidade || FILTRO.max;
  const lista = IM.filter(p =>
    (!FILTRO.categoria || semAcento(cat(p)) === semAcento(FILTRO.categoria)) &&
    (!FILTRO.cidade || semAcento([p.cidade, p.titulo, p.descricao].join(' ')).includes(semAcento(FILTRO.cidade))) &&
    (!FILTRO.max || !precoNumero(p.preco) || precoNumero(p.preco) <= FILTRO.max));
  const resumo = $('#filtroResumo');
  if (resumo){
    const partes = [FILTRO.categoria, FILTRO.cidade && 'em “' + FILTRO.cidade + '”', FILTRO.max && 'até ' + (VALORES.find(v => v[2] === FILTRO.max) || ['', ''])[1]].filter(Boolean);
    resumo.innerHTML = temFiltro ? `<span>Mostrando: <b>${esc(partes.join(' • '))}</b></span><button type="button" id="limpar">Limpar filtros ×</button>` : '';
    resumo.style.display = temFiltro ? '' : 'none';
    const l = $('#limpar'); if (l) l.onclick = () => { Object.assign(FILTRO, {categoria:'', cidade:'', max:0}); desenharImoveis(); };
  }
  const c = $('#countText');
  if (c) c.textContent = IM.length ? (lista.length + (lista.length === 1 ? ' opção encontrada' : ' opções encontradas')) : 'Novos anúncios em breve. Enquanto isso, consulte as oportunidades com a nossa equipe.';
  const tipos = [...new Set(IM.map(cat))];
  chips.style.display = tipos.length > 1 ? '' : 'none';
  chips.innerHTML = ['', ...tipos].map(t => `<button class="chip ${semAcento(t)===semAcento(FILTRO.categoria)?'on':''}" data-t="${esc(t)}">${t ? esc(t) : 'Todos'}</button>`).join('');
  chips.querySelectorAll('.chip').forEach(b => b.onclick = () => { FILTRO.categoria = b.dataset.t; desenharImoveis(); });
  if (!lista.length && (IM.length || temFiltro)){
    const oq = FILTRO.categoria ? FILTRO.categoria.toLowerCase() : 'imóvel';
    alvo.innerHTML = `
      <div class="empty">
        <span class="ico"><svg><use href="#i-search"/></svg></span>
        <div><h3>Nenhuma opção de ${esc(oq)} disponível agora</h3><p>Fale com a nossa equipe: avisamos você assim que surgir uma oportunidade com esse perfil.</p></div>
        <button class="btn btn-gold" data-chat="${esc('Olá! Procuro ' + oq + (FILTRO.cidade ? ' em ' + FILTRO.cidade : '') + '. Podem me avisar quando tiver?')}"><svg><use href="#i-chat"/></svg>Avise-me</button>
      </div>`;
    return;
  }
  if (!IM.length){
    chips.style.display = 'none';
    alvo.innerHTML = `
      <div class="empty">
        <span class="ico"><svg><use href="#i-search"/></svg></span>
        <div><h3>Estamos preparando nosso catálogo</h3><p>Novas oportunidades serão divulgadas conforme a disponibilidade. Fale conosco para consultar os imóveis disponíveis agora.</p></div>
        <button class="btn btn-gold" data-chat="Olá! Gostaria de consultar os imóveis disponíveis."><svg><use href="#i-chat"/></svg>Consultar agora</button>
      </div>`;
    return;
  }
  alvo.innerHTML = lista.map(p => cartao(p)).join('');
  ligarCartoes(alvo);
}

function montarBusca(){
  const tipos = '<option value="">Todos os tipos</option>' + CATEGORIAS.map(c => `<option>${c.nome}</option>`).join('') + '<option>Divulgação</option>';
  const valores = VALORES.map(v => `<option value="${v[0]}">${v[1]}</option>`).join('');
  [['finder','f'], ['ifiltro','i']].forEach(([form, p]) => {
    const f = $('#' + form); if (!f) return;
    $('#' + p + 'Tipo').innerHTML = tipos;
    $('#' + p + 'Valor').innerHTML = valores;
    f.addEventListener('submit', e => {
      e.preventDefault();
      filtrarPor({categoria: $('#' + p + 'Tipo').value, cidade: $('#' + p + 'Cidade').value.trim(), max: Number($('#' + p + 'Valor').value) || 0});
    });
  });
}

function montarContato(){
  const f = $('#contactForm'); if (!f) return;
  const nome = $('#ctNome'), tel = $('#ctTel'), msg = $('#ctMsg'), err = $('#ctErr'), ok = $('#ctOk');
  const salvo = store.get('gbi-contato');
  if (salvo){ nome.value = salvo.nome || ''; tel.value = salvo.telefone || ''; }
  tel.addEventListener('input', () => tel.value = mascaraTel(tel.value));
  f.addEventListener('submit', async e => {
    e.preventDefault(); err.style.display = 'none'; ok.style.display = 'none';
    if ($('#ctHp').value) return;
    const n = nome.value.trim(), t = tel.value, m = msg.value.trim();
    const falha = (txt, el) => { err.textContent = txt; err.style.display = 'block'; el.focus(); };
    if (n.length < 2) return falha('Digite seu nome.', nome);
    if (!telValido(t)) return falha('Digite seu WhatsApp com DDD. Ex.: (71) 99999-9999', tel);
    if (m.length < 2) return falha('Digite sua mensagem.', msg);
    store.set('gbi-contato', {nome:n, telefone:t});
    const btn = f.querySelector('button[type=submit]'); btn.disabled = true;
    try {
      const modo = await enviarContato({nome:n, telefone:t, mensagem:m});
      ok.textContent = modo === 'direto'
        ? `Mensagem enviada! ✅ Vamos responder no seu WhatsApp ${mascaraTel(t)}.`
        : 'Abrimos o WhatsApp com sua mensagem pronta, é só tocar em enviar.';
      ok.style.display = 'block'; msg.value = '';
    } catch(_) { falha('Não conseguimos enviar agora. Tente novamente em instantes.', msg); }
    btn.disabled = false;
  });
}


/* ===== VÍDEO DE FUNDO DA CAPA (clipes em sequência com transição) ===== */
function iniciarVideoCapa(){
  const hero = $('.hero-v'), box = $('.hvid'); if (!box) return;
  const lista = (CONFIG.capa || []).filter(c => c && c.src); if (!lista.length) return;
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const economia = navigator.connection && (navigator.connection.saveData || /2g/.test(navigator.connection.effectiveType || ''));
  if (reduz || economia) return;
  const vids = [...box.querySelectorAll('video')];
  const seg = Math.max(4, +CONFIG.segundosPorClipe || 7) * 1000;
  // qualidade: Full HD em telas grandes, 720p nas demais; cai para uma menor se a maior não existir
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const QUALS = innerWidth * dpr >= 1400 ? ['1080', '720', '360'] : ['720', '360'];
  const url = (c, q) => c.src.replace('{q}', q || QUALS[0]);
  const ui = $('.hvid-tema b'), dots = $('.hvid-dots');
  dots.innerHTML = lista.map((c, k) => `<button type="button" aria-label="${esc(c.tema || 'Clipe ' + (k + 1))}" data-k="${k}"><i></i></button>`).join('');
  let atual = 0, camada = 0, timer = null, falhas = 0, visivel = true, rodando = false;
  const marcar = k => {
    if (ui) ui.textContent = lista[k].tema || '';
    dots.querySelectorAll('button').forEach((b, j) => { b.classList.toggle('on', j === k); b.style.setProperty('--t', seg + 'ms'); });
  };
  function carregar(v, k, cb){
    let nq = 0;
    v.onerror = () => {
      if (lista[k].src.includes('{q}') && nq < QUALS.length - 1){ nq++; v.src = url(lista[k], QUALS[nq]); v.load(); return; }
      falhas++; if (falhas >= lista.length * 2) return parar(); cb(false);
    };
    v.oncanplay = () => { v.oncanplay = null; cb(true); };
    v.src = url(lista[k]); v.load();
  }
  function mostrar(k){
    const v = vids[camada], ant = vids[1 - camada];
    carregar(v, k, ok => {
      if (!ok){ atual = (k + 1) % lista.length; return mostrar(atual); }
      falhas = 0;
      v.currentTime = 0; const pr = v.play(); if (pr) pr.catch(() => {});
      v.classList.add('on'); ant.classList.remove('on'); hero.classList.add('vid-on');
      setTimeout(() => { ant.pause(); }, 1600);
      marcar(k); atual = k;
      clearTimeout(timer); timer = setTimeout(proximo, seg);
    });
  }
  function proximo(){ if (!visivel) return; camada = 1 - camada; mostrar((atual + 1) % lista.length); }
  function parar(){ clearTimeout(timer); vids.forEach(v => { v.pause(); v.removeAttribute('src'); v.load(); }); hero.classList.remove('vid-on'); $('.hvid-ui').hidden = true; }
  dots.addEventListener('click', e => { const b = e.target.closest('[data-k]'); if (!b) return; clearTimeout(timer); camada = 1 - camada; mostrar(+b.dataset.k); });
  vids.forEach(v => { v.muted = true; v.loop = true; v.setAttribute('muted', ''); });
  const retomar = () => { if (!visivel || document.hidden) { clearTimeout(timer); vids.forEach(v => v.pause()); return; }
    if (!rodando){ rodando = true; return mostrar(0); }
    const v = vids[camada]; const pr = v.play(); if (pr) pr.catch(() => {}); clearTimeout(timer); timer = setTimeout(proximo, seg); };
  if ('IntersectionObserver' in window) new IntersectionObserver(es => { visivel = es[0].isIntersecting; retomar(); }, {threshold: .05}).observe(hero);
  else retomar();
  document.addEventListener('visibilitychange', retomar);
}

/* ===== GERAL ===== */
function iniciar(){
  montarChat(); montarCategorias(); montarBusca(); montarContato();
  iniciarVideoCapa();

  // Cadeado: carrega o painel administrativo só quando for usado
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-adm]'); if (!b) return;
    e.preventDefault(); $('#top').classList.remove('open');
    if (window.GBI_ADMIN) return window.GBI_ADMIN.abrir();
    b.classList.add('loading');
    const css = document.createElement('link'); css.rel = 'stylesheet'; css.href = 'admin.css'; document.head.appendChild(css);
    const js = document.createElement('script'); js.src = 'admin.js';
    js.onload = () => { b.classList.remove('loading'); window.GBI_ADMIN && window.GBI_ADMIN.abrir(); };
    js.onerror = () => { b.classList.remove('loading'); alert('Não foi possível abrir o painel. Verifique se os arquivos admin.js e admin.css foram enviados.'); };
    document.body.appendChild(js);
  });
  window.recarregarSite = async () => { await carregarPosts(); montarDestaques(); if (!$('.tab[data-aba="imoveis"]').hidden) desenharImoveis(); };

  document.addEventListener('click', e => {
    // Guias
    const tab = e.target.closest('[data-tab]');
    if (tab){ e.preventDefault(); if (tab.dataset.tab === 'imoveis' && !tab.closest('.tab')) Object.assign(FILTRO, {categoria:'', cidade:'', max:0}); mostrarAba(tab.dataset.tab); return; }
    // Categoria: mostra o que está disponível dessa categoria
    const cat = e.target.closest('[data-cat]');
    if (cat){ e.preventDefault(); filtrarPor({categoria: cat.dataset.cat, cidade:'', max:0}); return; }
    // Qualquer elemento com data-chat abre o chat com a mensagem pronta
    const el = e.target.closest('[data-chat]');
    if (el){ e.preventDefault(); $('#top').classList.remove('open'); fecharLightbox(); abrirChat(el.dataset.chat); }
  });
  carregarPosts().then(() => { carregado = true; montarDestaques(); if (!$('.tab[data-aba="imoveis"]').hidden) desenharImoveis(); });

  // Menu sempre completo no computador: se não couber, compacta em níveis (c1, c2, c3)
  const ajustarMenu = () => {
    const top = $('#top'), nav = $('.nav'), menu = $('#menu'), brand = $('.brand'), lang = $('.lang');
    top.classList.remove('c1', 'c2', 'c3');
    if (getComputedStyle($('#burger')).display !== 'none') return;
    const cabe = () => {
      const cs = getComputedStyle(nav), gap = parseFloat(cs.columnGap) || 0;
      const livre = nav.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const ml = lang ? parseFloat(getComputedStyle(lang).marginLeft) || 0 : 0;
      const usado = brand.offsetWidth + menu.scrollWidth + (lang ? lang.offsetWidth + ml : 0) + gap * 2 + 8;
      return usado <= livre;
    };
    for (const nivel of ['c1', 'c2', 'c3']){ if (cabe()) return; top.classList.remove('c1', 'c2', 'c3'); top.classList.add(nivel); }
  };
  window.ajustarMenu = ajustarMenu;
  addEventListener('resize', ajustarMenu);
  window.addEventListener('gbi-idioma', ajustarMenu);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(ajustarMenu);
  addEventListener('load', ajustarMenu);
  ajustarMenu();

  // Menu móvel
  const top_ = $('#top'), burger = $('#burger');
  burger.onclick = () => { const o = top_.classList.toggle('open'); burger.setAttribute('aria-expanded', o); };

  $$('.ano').forEach(e => e.textContent = new Date().getFullYear());

  if ('IntersectionObserver' in window){
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }), {threshold:.1});
    $$('.rv').forEach(el => io.observe(el));
  } else $$('.rv').forEach(el => el.classList.add('in'));
}
iniciar();

/* =====================================================
   IDIOMAS: Português (padrão), English, Español
   Os textos escritos nas publicações não são traduzidos.
   ===================================================== */
const I18N = (() => {
  // [português, inglês, espanhol]
  const T = [
    ['Grupo Bahia Imóveis | Realizando sonhos, construindo futuro!', 'Grupo Bahia Imóveis | Making dreams come true, building the future!', 'Grupo Bahia Imóveis | Realizando sueños, construyendo futuro!'],
    ['Início', 'Home', 'Inicio'], ['Imóveis', 'Properties', 'Inmuebles'], ['Categorias', 'Categories', 'Categorías'],
    ['Como funciona', 'How it works', 'Cómo funciona'], ['A empresa', 'About us', 'La empresa'], ['Dúvidas', 'FAQ', 'Preguntas'],
    ['Contato', 'Contact', 'Contacto'], ['Fale conosco', 'Contact us', 'Contáctenos'],
    ['Imóveis em todo o Brasil', 'Properties all over Brazil', 'Inmuebles en todo Brasil'],
    ['Realizando sonhos,', 'Making dreams come true,', 'Realizando sueños,'], ['construindo futuro!', 'building the future!', '¡construyendo futuro!'],
    ['Terrenos, loteamentos, fazendas, sítios, chácaras e casas. Encontre o imóvel ideal e fale direto com a nossa equipe.', 'Land, lots, farms, small farms, country houses and homes. Find the ideal property and talk directly to our team.', 'Terrenos, loteos, haciendas, fincas, quintas y casas. Encuentre el inmueble ideal y hable directo con nuestro equipo.'],
    ['Ver imóveis à venda', 'See properties for sale', 'Ver inmuebles en venta'], ['Falar com um especialista', 'Talk to a specialist', 'Hablar con un especialista'],
    ['Atuação em todo o Brasil', 'Serving all of Brazil', 'Presencia en todo Brasil'], ['Atendimento direto', 'Direct service', 'Atención directa'],
    ['Informações claras de cada imóvel', 'Clear information on every property', 'Información clara de cada inmueble'],
    ['Encontre seu imóvel', 'Find your property', 'Encuentre su inmueble'], ['Veja na hora o que está disponível para venda.', 'Instantly see what is available for sale.', 'Vea al instante lo que está disponible para la venta.'],
    ['Tipo de imóvel', 'Property type', 'Tipo de inmueble'], ['Cidade ou região', 'City or region', 'Ciudad o región'], ['Investimento até', 'Budget up to', 'Inversión hasta'],
    ['Buscar', 'Search', 'Buscar'], ['Oportunidades selecionadas', 'Selected opportunities', 'Oportunidades seleccionadas'],
    ['Imóveis em', 'Featured', 'Inmuebles'], ['destaque', 'properties', 'destacados'], ['Ver todos os imóveis', 'See all properties', 'Ver todos los inmuebles'],
    ['Encontre por categoria', 'Browse by category', 'Busque por categoría'], ['O que você', 'What are you', '¿Qué está'], ['procura?', 'looking for?', 'buscando?'],
    ['Clique em uma categoria para ver o que está disponível.', 'Click a category to see what is available.', 'Haga clic en una categoría para ver lo disponible.'],
    ['Portfólio imobiliário', 'Real estate portfolio', 'Portafolio inmobiliario'], ['à venda', 'for sale', 'en venta'],
    ['Carregando as oportunidades…', 'Loading opportunities…', 'Cargando oportunidades…'], ['Tipo', 'Type', 'Tipo'], ['Até', 'Up to', 'Hasta'],
    ['O imóvel ideal', 'The ideal property', 'El inmueble ideal'], ['para você', 'for you', 'para usted'],
    ['Clique em uma categoria e veja o que está disponível para venda.', 'Click a category and see what is available for sale.', 'Haga clic en una categoría y vea lo disponible para la venta.'],
    ['Do primeiro contato', 'From the first contact', 'Del primer contacto'], ['à chave na mão', 'to the keys in hand', 'a las llaves en mano'],
    ['Um atendimento simples e próximo, do início ao fim.', 'Simple, close support from start to finish.', 'Una atención simple y cercana, de principio a fin.'],
    ['Encontre o imóvel', 'Find the property', 'Encuentre el inmueble'], ['Busque por tipo, cidade e valor, ou navegue pelas categorias.', 'Search by type, city and price, or browse the categories.', 'Busque por tipo, ciudad y valor, o navegue por las categorías.'],
    ['Fale com a gente', 'Talk to us', 'Hable con nosotros'], ['Clique em "Tenho interesse", deixe seu nome e WhatsApp e mande sua mensagem.', 'Click "I\'m interested", leave your name and WhatsApp and send your message.', 'Haga clic en "Me interesa", deje su nombre y WhatsApp y envíe su mensaje.'],
    ['Conheça o imóvel', 'Get to know the property', 'Conozca el inmueble'], ['Tire dúvidas, veja fotos, vídeos, documentos e agende uma visita.', 'Ask questions, see photos, videos, documents and schedule a visit.', 'Resuelva dudas, vea fotos, videos, documentos y agende una visita.'],
    ['Realize o negócio', 'Close the deal', 'Cierre el negocio'], ['Acompanhamos você até a conclusão, com transparência em cada etapa.', 'We support you until the end, with transparency at every step.', 'Lo acompañamos hasta el final, con transparencia en cada etapa.'],
    ['Sobre nós', 'About us', 'Sobre nosotros'], ['Grupo', 'Grupo', 'Grupo'], ['Bahia Imóveis', 'Bahia Imóveis', 'Bahia Imóveis'],
    ['Realizando sonhos, construindo futuro!', 'Making dreams come true, building the future!', '¡Realizando sueños, construyendo futuro!'],
    ['Todo o Brasil', 'All of Brazil', 'Todo Brasil'], ['Área de atuação', 'Service area', 'Área de actuación'], ['6 categorias', '6 categories', '6 categorías'],
    ['Rurais e urbanos', 'Rural and urban', 'Rurales y urbanos'], ['Direto', 'Direct', 'Directo'], ['Atendimento no WhatsApp', 'Service via WhatsApp', 'Atención por WhatsApp'],
    ['Quem somos', 'Who we are', 'Quiénes somos'], ['Oportunidades imobiliárias', 'Real estate opportunities', 'Oportunidades inmobiliarias'], ['em todo o Brasil', 'all over Brazil', 'en todo Brasil'],
    ['Atuamos com a divulgação de oportunidades imobiliárias em todo o Brasil, conforme a disponibilidade dos imóveis.', 'We showcase real estate opportunities all over Brazil, according to property availability.', 'Divulgamos oportunidades inmobiliarias en todo Brasil, según la disponibilidad de los inmuebles.'],
    ['Imóveis rurais e urbanos: da fazenda produtiva à casa na cidade.', 'Rural and urban properties: from productive farms to homes in the city.', 'Inmuebles rurales y urbanos: de la hacienda productiva a la casa en la ciudad.'],
    ['Informações claras sobre cada propriedade antes da visita.', 'Clear information about each property before the visit.', 'Información clara sobre cada propiedad antes de la visita.'],
    ['Contato direto, sem intermediários desnecessários.', 'Direct contact, no unnecessary middlemen.', 'Contacto directo, sin intermediarios innecesarios.'],
    ['Entre em contato', 'Get in touch', 'Contáctenos'], ['Para proprietários', 'For owners', 'Para propietarios'], ['Quer vender seu', 'Want to sell your', '¿Quiere vender su'], ['imóvel no Brasil?', 'property in Brazil?', 'inmueble en Brasil?'],
    ['Fale com a gente e divulgue sua propriedade para quem está procurando.', 'Talk to us and show your property to people who are looking.', 'Hable con nosotros y divulgue su propiedad a quien está buscando.'],
    ['Anunciar meu imóvel', 'List my property', 'Anunciar mi inmueble'], ['Dúvidas frequentes', 'Frequently asked questions', 'Preguntas frecuentes'], ['Perguntas', 'Common', 'Preguntas'], ['comuns', 'questions', 'comunes'],
    ['Não encontrou sua resposta? Fale com a gente pelo chat.', "Didn't find your answer? Talk to us on the chat.", '¿No encontró su respuesta? Hable con nosotros por el chat.'],
    ['Em quais regiões vocês atuam?', 'Which regions do you serve?', '¿En qué regiones actúan?'],
    ['Atuamos com oportunidades em todo o Brasil. Use a busca por cidade ou fale com a gente.', 'We have opportunities all over Brazil. Search by city or talk to us.', 'Tenemos oportunidades en todo Brasil. Busque por ciudad o hable con nosotros.'],
    ['Quais tipos de imóvel vocês trabalham?', 'What types of property do you work with?', '¿Con qué tipos de inmuebles trabajan?'],
    ['Fazendas, terrenos, loteamentos, sítios, chácaras e casas, além de outros imóveis conforme a disponibilidade.', 'Farms, land, lots, small farms, country houses and homes, plus other properties according to availability.', 'Haciendas, terrenos, loteos, fincas, quintas y casas, además de otros inmuebles según disponibilidad.'],
    ['Como vejo o que está disponível?', 'How do I see what is available?', '¿Cómo veo lo que está disponible?'],
    ['Clique em uma categoria ou use a busca. Aparecem na hora as opções à venda, com fotos, vídeos e detalhes.', 'Click a category or use the search. Properties for sale appear instantly, with photos, videos and details.', 'Haga clic en una categoría o use la búsqueda. Aparecen al instante las opciones en venta, con fotos, videos y detalles.'],
    ['Posso anunciar meu imóvel com vocês?', 'Can I list my property with you?', '¿Puedo anunciar mi inmueble con ustedes?'],
    ['Sim. Mande pelo chat as informações da propriedade e retornamos no seu WhatsApp com os próximos passos.', 'Yes. Send the property details on the chat and we will reply on your WhatsApp with the next steps.', 'Sí. Envíe por el chat la información de la propiedad y le respondemos por WhatsApp con los próximos pasos.'],
    ['Por que pedem meu nome e WhatsApp?', 'Why do you ask for my name and WhatsApp?', '¿Por qué piden mi nombre y WhatsApp?'],
    ['Para que a nossa equipe possa responder você diretamente no seu WhatsApp. Seus dados são usados só para esse atendimento.', 'So our team can reply to you directly on WhatsApp. Your data is used only for this purpose.', 'Para que nuestro equipo pueda responderle directamente por WhatsApp. Sus datos se usan solo para esta atención.'],
    ['Fazer uma pergunta', 'Ask a question', 'Hacer una pregunta'], ['Vamos', "Let's", '¿Hablamos'], ['conversar?', 'talk?', 'ahora?'],
    ['Deixe sua mensagem com seu nome e WhatsApp. Nossa equipe responde no seu WhatsApp.', 'Leave your message with your name and WhatsApp. Our team will reply on your WhatsApp.', 'Deje su mensaje con su nombre y WhatsApp. Nuestro equipo le responde por WhatsApp.'],
    ['Resposta no seu WhatsApp', 'Reply on your WhatsApp', 'Respuesta por WhatsApp'], ['Retornamos pelo número que você informar', 'We reply to the number you provide', 'Respondemos al número que usted indique'],
    ['Envie sua mensagem', 'Send your message', 'Envíe su mensaje'], ['Todos os campos são obrigatórios.', 'All fields are required.', 'Todos los campos son obligatorios.'],
    ['Nome', 'Name', 'Nombre'], ['Mensagem', 'Message', 'Mensaje'], ['Enviar mensagem', 'Send message', 'Enviar mensaje'],
    ['Procurando um imóvel', 'Looking for a property', '¿Busca un inmueble'], ['no Brasil?', 'in Brazil?', 'en Brasil?'],
    ['Conte o que você procura. A nossa equipe responde no seu WhatsApp.', 'Tell us what you are looking for. Our team will reply on your WhatsApp.', 'Cuéntenos lo que busca. Nuestro equipo le responde por WhatsApp.'],
    ['Ver imóveis', 'See properties', 'Ver inmuebles'],
    ['Realizando sonhos, construindo futuro! Fazendas, terrenos, loteamentos, sítios, chácaras e casas em todo o Brasil.', 'Making dreams come true, building the future! Farms, land, lots, small farms, country houses and homes all over Brazil.', '¡Realizando sueños, construyendo futuro! Haciendas, terrenos, loteos, fincas, quintas y casas en todo Brasil.'],
    ['Navegação', 'Navigation', 'Navegación'], ['Atendimento', 'Support', 'Atención'],
    ['Grupo Bahia Imóveis. Todos os direitos reservados.', 'Grupo Bahia Imóveis. All rights reserved.', 'Grupo Bahia Imóveis. Todos los derechos reservados.'],
    ['Área restrita', 'Restricted area', 'Área restringida'], ['Grupo Bahia Imóveis — início', 'Grupo Bahia Imóveis — home', 'Grupo Bahia Imóveis — inicio'], ['Abrir menu', 'Open menu', 'Abrir menú'],
    ['Ex.: Salvador, Feira de Santana', 'E.g.: Salvador, Feira de Santana', 'Ej.: Salvador, Feira de Santana'], ['Digite a cidade', 'Type the city', 'Escriba la ciudad'],
    ['Seu nome', 'Your name', 'Su nombre'], ['Conte o que você procura ou o que deseja saber', 'Tell us what you are looking for or want to know', 'Cuéntenos lo que busca o lo que desea saber'],
    // categorias
    ['Fazenda', 'Farm', 'Hacienda'], ['Terreno', 'Land', 'Terreno'], ['Loteamento', 'Subdivision', 'Loteo'], ['Sítio', 'Small farm', 'Finca'],
    ['Chácara', 'Country house', 'Quinta'], ['Casa', 'House', 'Casa'], ['Divulgação', 'News', 'Novedades'], ['Imóvel', 'Property', 'Inmueble'],
    ['Área', 'Area', 'Área'], ['Ilha', 'Island', 'Isla'], ['Imóvel comercial', 'Commercial property', 'Inmueble comercial'], ['Outro', 'Other', 'Otro'],
    ['Áreas produtivas para pecuária, agricultura e investimento.', 'Productive land for cattle, farming and investment.', 'Áreas productivas para ganadería, agricultura e inversión.'],
    ['Terrenos urbanos e rurais para construir do seu jeito.', 'Urban and rural land to build your way.', 'Terrenos urbanos y rurales para construir a su manera.'],
    ['Lotes em loteamentos com potencial de valorização.', 'Lots in subdivisions with appreciation potential.', 'Lotes en loteos con potencial de valorización.'],
    ['Natureza, tranquilidade e espaço para produzir.', 'Nature, peace and space to produce.', 'Naturaleza, tranquilidad y espacio para producir.'],
    ['Lazer e descanso perto da cidade.', 'Leisure and rest close to the city.', 'Ocio y descanso cerca de la ciudad.'],
    ['Casas para morar ou investir em todo o Brasil.', 'Homes to live in or invest all over Brazil.', 'Casas para vivir o invertir en todo Brasil.'],
    // busca e vitrine
    ['Todos os tipos', 'All types', 'Todos los tipos'], ['Sem limite', 'No limit', 'Sin límite'], ['Todos', 'All', 'Todos'],
    ['R$ 100 mil', 'R$ 100 thousand', 'R$ 100 mil'], ['R$ 250 mil', 'R$ 250 thousand', 'R$ 250 mil'], ['R$ 500 mil', 'R$ 500 thousand', 'R$ 500 mil'],
    ['R$ 1 milhão', 'R$ 1 million', 'R$ 1 millón'], ['R$ 3 milhões', 'R$ 3 million', 'R$ 3 millones'],
    ['Mostrando:', 'Showing:', 'Mostrando:'], ['Limpar filtros ×', 'Clear filters ×', 'Limpiar filtros ×'],
    ['Novos anúncios em breve. Enquanto isso, consulte as oportunidades com a nossa equipe.', 'New listings soon. Meanwhile, ask our team about opportunities.', 'Nuevos anuncios pronto. Mientras tanto, consulte las oportunidades con nuestro equipo.'],
    ['Fale com a nossa equipe: avisamos você assim que surgir uma oportunidade com esse perfil.', 'Talk to our team: we will let you know as soon as a matching opportunity appears.', 'Hable con nuestro equipo: le avisamos en cuanto surja una oportunidad con ese perfil.'],
    ['Avise-me', 'Notify me', 'Avíseme'], ['Estamos preparando nosso catálogo', 'We are preparing our catalog', 'Estamos preparando nuestro catálogo'],
    ['Novas oportunidades serão divulgadas conforme a disponibilidade. Fale conosco para consultar os imóveis disponíveis agora.', 'New opportunities will be published as they become available. Contact us to check the properties available now.', 'Nuevas oportunidades se publicarán según disponibilidad. Contáctenos para consultar los inmuebles disponibles ahora.'],
    ['Consultar agora', 'Ask now', 'Consultar ahora'], ['Carregando…', 'Loading…', 'Cargando…'],
    ['Lançamento', 'New launch', 'Lanzamiento'], ['Destaque', 'Featured', 'Destacado'], ['Reservado', 'Reserved', 'Reservado'], ['Vendido', 'Sold', 'Vendido'],
    ['Disponível', 'Available', 'Disponible'], ['Exemplo', 'Example', 'Ejemplo'], ['Sob consulta', 'Price on request', 'Precio a consultar'],
    ['Ver publicação', 'View post', 'Ver publicación'], ['Conhecer o lançamento', 'See the launch', 'Conocer el lanzamiento'], ['Conhecer o imóvel', 'See the property', 'Conocer el inmueble'],
    ['Ver imóvel ↗', 'View property ↗', 'Ver inmueble ↗'],
    // página do imóvel
    ['← Voltar', '← Back', '← Volver'], ['Fotos', 'Photos', 'Fotos'], ['Descrição', 'Description', 'Descripción'], ['Localização', 'Location', 'Ubicación'],
    ['Compartilhar', 'Share', 'Compartir'], ['Texto copiado!', 'Text copied!', '¡Texto copiado!'], ['Ficha técnica', 'Key facts', 'Ficha técnica'],
    ['Descrição do imóvel', 'Property description', 'Descripción del inmueble'], ['Descrição da publicação', 'Post description', 'Descripción de la publicación'],
    ['Consulte os detalhes com a nossa equipe.', 'Ask our team for details.', 'Consulte los detalles con nuestro equipo.'],
    ['Gostou deste imóvel?', 'Like this property?', '¿Le gustó este inmueble?'],
    ['Converse com a equipe do Grupo Bahia Imóveis para tirar dúvidas e agendar uma visita.', 'Talk to the Grupo Bahia Imóveis team to ask questions and schedule a visit.', 'Hable con el equipo de Grupo Bahia Imóveis para resolver dudas y agendar una visita.'],
    ['Tenho interesse ↗', "I'm interested ↗", 'Me interesa ↗'], ['Grupo Bahia Imóveis · Atendimento pelo WhatsApp', 'Grupo Bahia Imóveis · Support via WhatsApp', 'Grupo Bahia Imóveis · Atención por WhatsApp'],
    ['Área total', 'Total area', 'Área total'], ['Área construída', 'Built area', 'Área construida'], ['Quartos', 'Bedrooms', 'Dormitorios'], ['Banheiros', 'Bathrooms', 'Baños'],
    ['Água', 'Water', 'Agua'], ['Energia', 'Power', 'Energía'], ['Acesso', 'Access', 'Acceso'], ['Topografia', 'Topography', 'Topografía'],
    ['Benfeitorias', 'Improvements', 'Mejoras'], ['Documentação', 'Documents', 'Documentación'], ['Pastagem', 'Pasture', 'Pastos'], ['Distância da cidade', 'Distance to town', 'Distancia a la ciudad'],
    ['Veja a que distância o imóvel fica das principais referências da região.', 'See how far the property is from the main landmarks in the region.', 'Vea a qué distancia está el inmueble de las principales referencias de la región.'],
    ['Veja a que distância fica das principais referências da região.', 'See how far it is from the main landmarks in the region.', 'Vea a qué distancia está de las principales referencias de la región.'],
    ['Esquema', 'Diagram', 'Esquema'], ['Mapa', 'Map', 'Mapa'], ['Distâncias', 'Distances', 'Distancias'],
    ['Esquema ilustrativo · direções aproximadas · distância fora de escala', 'Illustrative diagram · approximate directions · not to scale', 'Esquema ilustrativo · direcciones aproximadas · fuera de escala'],
    ['Esquema ilustrativo · posições e escala aproximadas', 'Illustrative diagram · approximate positions and scale', 'Esquema ilustrativo · posiciones y escala aproximadas'],
    ['Localização aproximada', 'Approximate location', 'Ubicación aproximada'],
    ['Distâncias informadas pelo anunciante. Percurso e acesso exatos a confirmar.', 'Distances provided by the seller. Exact route and access to be confirmed.', 'Distancias informadas por el anunciante. Recorrido y acceso exactos a confirmar.'],
    ['Como chegar', 'Directions', 'Cómo llegar'], ['Perguntar sobre o acesso', 'Ask about access', 'Preguntar sobre el acceso'],
    ['ao Norte', 'to the North', 'al Norte'], ['a Nordeste', 'to the Northeast', 'al Noreste'], ['a Leste', 'to the East', 'al Este'], ['a Sudeste', 'to the Southeast', 'al Sureste'],
    ['ao Sul', 'to the South', 'al Sur'], ['a Sudoeste', 'to the Southwest', 'al Suroeste'], ['a Oeste', 'to the West', 'al Oeste'], ['a Noroeste', 'to the Northwest', 'al Noroeste'],
    ['L', 'E', 'E'], ['O', 'W', 'O'],
    ['Agende sua visita', 'Schedule your visit', 'Agende su visita'],
    ['Fale com a nossa equipe para consultar disponibilidade e combinar os detalhes.', 'Talk to our team to check availability and arrange the details.', 'Hable con nuestro equipo para consultar disponibilidad y combinar los detalles.'],
    ['Agendar pelo chat ↗', 'Schedule via chat ↗', 'Agendar por el chat ↗'], ['Continue explorando', 'Keep exploring', 'Siga explorando'], ['Imóveis similares', 'Similar properties', 'Inmuebles similares'],
    ['No momento, não há outro imóvel do mesmo tipo no site. Conheça também estas opções no Brasil.', 'There is no other property of the same type right now. See these other options in Brazil.', 'Por ahora no hay otro inmueble del mismo tipo. Conozca también estas opciones en Brasil.'],
    ['Sem mídia', 'No media', 'Sin multimedia'],
    // chat
    ['Atendimento pelo WhatsApp', 'Support via WhatsApp', 'Atención por WhatsApp'], ['Seu WhatsApp', 'Your WhatsApp', 'Su WhatsApp'], ['alterar', 'change', 'cambiar'],
    ['Digite sua mensagem…', 'Type your message…', 'Escriba su mensaje…'], ['Seus dados são usados só para respondermos você.', 'Your data is used only to reply to you.', 'Sus datos se usan solo para responderle.'],
    ['Olá! 👋 Seja bem-vindo ao Grupo Bahia Imóveis.\nDeixe seu nome, seu WhatsApp e sua mensagem. Nossa equipe responde no seu WhatsApp.', 'Hello! 👋 Welcome to Grupo Bahia Imóveis.\nLeave your name, WhatsApp and message. Our team will reply on your WhatsApp.', '¡Hola! 👋 Bienvenido a Grupo Bahia Imóveis.\nDeje su nombre, su WhatsApp y su mensaje. Nuestro equipo le responde por WhatsApp.'],
    ['Digite seu nome.', 'Please enter your name.', 'Escriba su nombre.'], ['Digite seu WhatsApp com DDD. Ex.: (71) 99999-9999', 'Enter your WhatsApp with area code. E.g.: (71) 99999-9999', 'Escriba su WhatsApp con código de área. Ej.: (71) 99999-9999'],
    ['Digite sua mensagem.', 'Please type your message.', 'Escriba su mensaje.'], ['Não conseguimos enviar agora. Tente novamente em instantes.', "We couldn't send it now. Please try again shortly.", 'No pudimos enviar ahora. Intente de nuevo en unos instantes.'],
    ['Abrimos o WhatsApp com sua mensagem pronta, é só tocar em enviar.', 'We opened WhatsApp with your message ready, just tap send.', 'Abrimos WhatsApp con su mensaje listo, solo toque en enviar.'],
    ['Praias', 'Beaches', 'Playas'], ['Terrenos com lago', 'Land with lakes', 'Terrenos con lago'], ['Fazendas', 'Farms', 'Haciendas'], ['Litoral', 'Coastline', 'Litoral'], ['Rios e natureza', 'Rivers and nature', 'Ríos y naturaleza'],
    ['Ver as fotos', 'See the photos', 'Ver las fotos'], ['Assistir ao vídeo', 'Watch the video', 'Ver el video'], ['Valor', 'Price', 'Valor'],
    ['Sobre o imóvel', 'About the property', 'Sobre el inmueble'], ['Conheça', 'Discover', 'Conozca'], ['cada detalhe', 'every detail', 'cada detalle'], ['os detalhes', 'the details', 'los detalles'],
    ['Galeria', 'Gallery', 'Galería'], ['Fotos e vídeos', 'Photos and videos', 'Fotos y videos'],
    ['Visita guiada', 'Guided visit', 'Visita guiada'], ['Agende sua visita', 'Schedule your visit', 'Agende su visita'],
    ['Escolha o melhor dia e período. A nossa equipe confirma com você pelo WhatsApp.', 'Choose the best day and time. Our team will confirm with you on WhatsApp.', 'Elija el mejor día y período. Nuestro equipo le confirma por WhatsApp.'],
    ['Dia', 'Day', 'Día'], ['Período', 'Time', 'Período'], ['Manhã', 'Morning', 'Mañana'], ['Tarde', 'Afternoon', 'Tarde'],
    ['Solicitar visita', 'Request a visit', 'Solicitar visita'], ['ou', 'or', 'o'], ['Tirar uma dúvida', 'Ask a question', 'Hacer una consulta'],
    ['Outras oportunidades', 'Other opportunities', 'Otras oportunidades'], ['Tenho interesse', "I'm interested", 'Me interesa'],
    ['Seg', 'Mon', 'Lun'], ['Ter', 'Tue', 'Mar'], ['Qua', 'Wed', 'Mié'], ['Qui', 'Thu', 'Jue'], ['Sex', 'Fri', 'Vie'], ['Sáb', 'Sat', 'Sáb'], ['Dom', 'Sun', 'Dom'],
    ['Abrir conversa', 'Open chat', 'Abrir chat'], ['Fechar', 'Close', 'Cerrar'], ['Enviar', 'Send', 'Enviar'], ['Anterior', 'Previous', 'Anterior'], ['Próxima', 'Next', 'Siguiente']
  ];
  const IDX = {pt: 0, en: 1, es: 2};
  const MAPA = new Map(T.map(r => [r[0], r]));
  const CAT = ['fazenda', 'terreno', 'loteamento', 'sítio', 'chácara', 'casa', 'imóvel', 'área', 'ilha'];
  // frases com partes variáveis
  const R = [
    [/^(\d+) opç(ão|ões) encontradas?$/, (m, l) => l === 'en' ? `${m[1]} ${m[1] === '1' ? 'option' : 'options'} found` : `${m[1]} ${m[1] === '1' ? 'opción encontrada' : 'opciones encontradas'}`],
    [/^Nenhuma opção de (.+) disponível agora$/, (m, l) => l === 'en' ? `No ${tr(cap(m[1]), l).toLowerCase()} available right now` : `Ninguna opción de ${tr(cap(m[1]), l).toLowerCase()} disponible ahora`],
    [/^Conhecer (a|o) (.+)$/, (m, l) => l === 'en' ? `See the ${tr(cap(m[2]), l).toLowerCase()}` : `Conocer ${/^(Hacienda|Finca|Quinta|Casa|Isla|Área)$/.test(tr(cap(m[2]), l)) ? 'la' : 'el'} ${tr(cap(m[2]), l).toLowerCase()}`],
    [/^Obrigado, (.+)! ✅ Sua mensagem foi enviada\. Vamos responder no seu WhatsApp (.+)\.$/, (m, l) => l === 'en' ? `Thank you, ${m[1]}! ✅ Your message was sent. We will reply on your WhatsApp ${m[2]}.` : `¡Gracias, ${m[1]}! ✅ Su mensaje fue enviado. Le responderemos por WhatsApp ${m[2]}.`],
    [/^Obrigado, (.+)! Abrimos o WhatsApp com sua mensagem pronta, é só tocar em enviar\.$/, (m, l) => l === 'en' ? `Thank you, ${m[1]}! We opened WhatsApp with your message ready, just tap send.` : `¡Gracias, ${m[1]}! Abrimos WhatsApp con su mensaje listo, solo toque en enviar.`],
    [/^Mensagem enviada! ✅ Vamos responder no seu WhatsApp (.+)\.$/, (m, l) => l === 'en' ? `Message sent! ✅ We will reply on your WhatsApp ${m[1]}.` : `¡Mensaje enviado! ✅ Le responderemos por WhatsApp ${m[1]}.`],
    [/^Fotos (\d+)$/, (m, l) => (l === 'en' ? 'Photos ' : 'Fotos ') + m[1]],
    [/^Vídeos (\d+)$/, (m, l) => (l === 'en' ? 'Videos ' : 'Videos ') + m[1]],
    [/^de (.+)$/, (m, l) => (l === 'en' ? 'from ' : 'de ') + m[1]],
  ];
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  function tr(pt, l){
    if (l === 'pt') return pt;
    const r = MAPA.get(pt); if (r) return r[IDX[l]];
    return null;
  }
  function traduzir(pt, l, el){
    if (l === 'pt') return pt;
    const lim = pt.trim(); if (!lim) return pt;
    const pre = pt.slice(0, pt.indexOf(lim)), pos = pt.slice(pt.indexOf(lim) + lim.length);
    let t = tr(lim, l);
    if (t === null && el && el.closest('#filtroResumo b')) t = lim.split(' • ').map(p => {
      let x = tr(p, l); if (x !== null) return x;
      let m = p.match(/^em “(.+)”$/); if (m) return (l === 'en' ? 'in “' : 'en “') + m[1] + '”';
      m = p.match(/^até (.+)$/); if (m) return (l === 'en' ? 'up to ' : 'hasta ') + (tr(m[1], l) || m[1]);
      return p; }).join(' • ');
    if (t === null && el && el.closest('.gcap')) t = lim.replace(/(\d+) fotos?/, (a, n) => l === 'en' ? `${n} photo${n === '1' ? '' : 's'}` : `${n} foto${n === '1' ? '' : 's'}`)
      .replace(/(\d+) vídeos?/, (a, n) => l === 'en' ? `${n} video${n === '1' ? '' : 's'}` : `${n} video${n === '1' ? '' : 's'}`)
      .replace('Clique em uma imagem para ampliar e percorrer a galeria', l === 'en' ? 'Click an image to enlarge and browse the gallery' : 'Haga clic en una imagen para ampliar y recorrer la galería');
    if (t === null) for (const [re, fn] of R){ const m = lim.match(re); if (m && !(re.source.startsWith('^de ') && !(el && el.closest('.kms')))){ t = fn(m, l); break; } }
    return t === null ? pt : pre + t + pos;
  }
  let lang = 'pt';
  const orig = new WeakMap(), origAttr = new WeakMap();
  const ATTRS = ['placeholder', 'aria-label', 'title'];
  const pular = el => !el || el.closest('#adm, script, style, [data-noi18n], .dlist .t b, .lc-top, .pc h3, .scard h3, .dhead h1, .ph2 h1, .ph2 .lo, .ph2-txt > p, .hl2 li, .txt2 p, .fi2 b, .sbar-f span, .dhead p, .ddesc p, .loc2-head h2, .loc2-head p, .rt, .ficha dd, .pc p, .scard p');
  function noTexto(n){
    const el = n.parentElement; if (pular(el)) return;
    if (!orig.has(n)) orig.set(n, n.data);
    const pt = orig.get(n), novo = traduzir(pt, lang, el);
    if (n.data !== novo){ trocando = true; n.data = novo; trocando = false; }
  }
  function noElemento(el){
    if (pular(el)) return;
    let o = origAttr.get(el); if (!o){ o = {}; origAttr.set(el, o); }
    for (const a of ATTRS) if (el.hasAttribute(a)){
      if (!(a in o)) o[a] = el.getAttribute(a);
      const v = traduzir(o[a], lang, el); if (el.getAttribute(a) !== v) el.setAttribute(a, v);
    }
  }
  function percorrer(raiz){
    if (raiz.nodeType === 3) return noTexto(raiz);
    if (raiz.nodeType !== 1 || pular(raiz)) return;
    noElemento(raiz);
    const w = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, { acceptNode: n => n.nodeType === 1 && pular(n) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
    let n; while ((n = w.nextNode())) n.nodeType === 3 ? noTexto(n) : noElemento(n);
  }
  let trocando = false;
  const obs = new MutationObserver(ms => {
    if (trocando) return;
    for (const m of ms){
      if (m.type === 'characterData'){ const n = m.target; if (orig.get(n) !== n.data && traduzir(orig.get(n) || '', lang) !== n.data){ orig.set(n, n.data); } noTexto(n); }
      else m.addedNodes.forEach(percorrer);
    }
  });
  const tituloPt = document.title;
  function definir(l){
    lang = IDX[l] !== undefined ? l : 'pt';
    try { localStorage.setItem('gbi-lang', lang); } catch(e){}
    document.documentElement.lang = {pt: 'pt-BR', en: 'en', es: 'es'}[lang];
    document.title = traduzir(tituloPt, lang);
    document.querySelectorAll('[data-lang]').forEach(b => { b.classList.toggle('on', b.dataset.lang === lang); b.setAttribute('aria-pressed', b.dataset.lang === lang); });
    trocando = true; percorrer(document.body); trocando = false;
    window.dispatchEvent(new Event('gbi-idioma'));
  }
  function iniciar(){
    let l = null; try { l = localStorage.getItem('gbi-lang'); } catch(e){}
    if (!l){ const n = (navigator.language || 'pt').slice(0, 2); l = n === 'en' || n === 'es' ? n : 'pt'; }
    obs.observe(document.body, {childList: true, subtree: true, characterData: true});
    document.addEventListener('click', e => { const b = e.target.closest('[data-lang]'); if (b){ e.preventDefault(); definir(b.dataset.lang); } });
    definir(l);
  }
  return { iniciar, definir, get lang(){ return lang; } };
})();
I18N.iniciar();
