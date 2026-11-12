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
  {nome:'Casa',       ico:'casa',    txt:'Casas para morar ou investir em toda a Bahia.'}
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
function abrirImovel(id){
  const p = POSTS.find(x => x.id === id); if (!p) return;
  const atual = $('.tab:not([hidden])'); if (atual && atual.dataset.aba !== 'detalhe') abaAnterior = atual.dataset.aba;
  const ms = p.midias || [], nFotos = ms.filter(m => m.tipo === 'imagem').length, nVid = ms.length - nFotos;
  const thumb = (m, i, extra) => {
    const src = m.tipo === 'imagem' ? m.url : Midia.capa({midias:[m]});
    return `<button class="g${i ? '' : ' g0'}" data-i="${i}"${i === 2 && ms.length > 3 ? ` data-mais="${ms.length - 3}"` : ''}>${src ? `<img src="${esc(src)}" alt="" loading="${i ? 'lazy' : 'eager'}">` : '<span class="gv"></span>'}${m.tipo !== 'imagem' ? '<span class="play">▶</span>' : ''}${extra || ''}</button>`;
  };
  const vis = ms.slice(0, 5);
  const galeria = !ms.length ? '' : `
    <div class="gal n${vis.length}" id="sec-fotos">
      ${vis.map((m, i) => thumb(m, i, i === 4 && ms.length > 5 ? `<span class="mais">+${ms.length - 5}</span>` : '')).join('')}
    </div>
    <p class="gcap">${[nFotos && nFotos + (nFotos > 1 ? ' fotos' : ' foto'), nVid && nVid + (nVid > 1 ? ' vídeos' : ' vídeo')].filter(Boolean).join(' · ')} · Clique em uma imagem para ampliar e percorrer a galeria</p>`;
  const local = blocoLocal(p), temLocal = !!local;
  const sim = (() => {
    const outros = POSTS.filter(x => x.id !== p.id);
    const mesmo = outros.filter(x => catDe(x) === catDe(p));
    return {lista: (mesmo.length ? mesmo : outros).slice(0, 3), mesmo: mesmo.length > 0};
  })();
  const interesse = esc('Olá! Tenho interesse em: ' + p.titulo + (p.cidade ? ' (' + p.cidade + ')' : '') + '.');
  $('#detalheBody').innerHTML = `
    <div class="wrap">
      <button class="voltar" data-tab="${abaAnterior}">← Voltar</button>
      ${galeria}
      <nav class="subnav">
        ${ms.length ? '<button data-ir="sec-fotos">Fotos</button>' : ''}<button data-ir="sec-desc">Descrição</button>${temLocal ? '<button data-ir="sec-local">Localização</button>' : ''}<button data-ir="sec-contato">Contato</button>
      </nav>
      <header class="dhead">
        <div class="dtop"><span class="lo">${esc(p.cidade || catDe(p))}</span>
          <div class="dsel">${p.tipo === 'lancamento' ? '<span class="chip-s">Lançamento</span>' : ''}<span class="chip-s">${esc(catDe(p))}</span>${SIT[p.situacao] ? `<span class="chip-s sit-${p.situacao}">${SIT[p.situacao]}</span>` : '<span class="chip-s ok">Disponível</span>'}</div></div>
        <h1>${esc(p.titulo)}</h1>
        ${p.resumo ? `<p>${esc(p.resumo)}</p>` : ''}
        <div class="dact">${p.preco ? `<b class="pr">${esc(p.preco)}</b>` : '<span></span>'}<button class="btn btn-ghost sm" id="compartilhar"><svg><use href="#i-share"/></svg>Compartilhar</button></div>
      </header>
      ${(p.ficha || []).length ? `<div class="ficha"><h2>Ficha técnica</h2><dl>${p.ficha.map(f => `<div><dt>${esc(f.rotulo)}</dt><dd>${esc(f.valor)}</dd></div>`).join('')}</dl></div>` : ''}
      <div class="dgrid" id="sec-desc">
        <div class="ddesc">
          <h2>Descrição ${p.tipo === 'divulgacao' ? 'da publicação' : 'do imóvel'}</h2>
          ${(p.descricao || 'Consulte os detalhes com a nossa equipe.').split(/\n\s*\n|\n/).filter(s => s.trim()).map(s => `<p>${esc(s)}</p>`).join('')}
        </div>
        <aside class="dbox" id="sec-contato">
          <span class="mini">Atendimento direto</span>
          <h3>Gostou deste imóvel?</h3>
          <p>Converse com a equipe do Grupo Bahia Imóveis para tirar dúvidas e agendar uma visita.</p>
          <button class="btn btn-gold" data-chat="${interesse}">Tenho interesse ↗</button>
          <b class="tel">(71) 99602-0606</b>
          <small>Grupo Bahia Imóveis · Atendimento pelo WhatsApp</small>
        </aside>
      </div>
    </div>
    ${local}
    <div class="wrap">
      <div class="agende">
        <div><h2>Agende sua visita</h2><p>Fale com a nossa equipe para consultar disponibilidade e combinar os detalhes.</p></div>
        <button class="btn btn-gold" data-chat="${esc('Olá! Gostaria de agendar uma visita: ' + p.titulo + '.')}">Agendar pelo chat ↗</button>
      </div>
      ${sim.lista.length ? `
      <div class="similares">
        <span class="eyebrow">Continue explorando</span>
        <h2>Imóveis similares</h2>
        ${sim.mesmo ? '' : '<p class="lead">No momento, não há outro imóvel do mesmo tipo no site. Conheça também estas opções na Bahia.</p>'}
        <div class="scards">${sim.lista.map(x => cartao(x, true)).join('')}</div>
      </div>` : ''}
    </div>`;
  const body = $('#detalheBody');
  body.querySelectorAll('.gal .g').forEach(b => b.onclick = () => lightbox(ms, +b.dataset.i));
  body.querySelectorAll('[data-ir]').forEach(b => b.onclick = () => {
    const el = $('#' + b.dataset.ir); if (el) window.scrollTo({top: el.getBoundingClientRect().top + scrollY - 160, behavior:'smooth'});
  });
  ligarCartoes(body);
  ligarLocal(body);
  const sh = $('#compartilhar');
  if (sh) sh.onclick = async () => {
    const texto = `${p.titulo}${p.cidade ? ' — ' + p.cidade : ''}${p.preco ? ' — ' + p.preco : ''}\nVeja no site do Grupo Bahia Imóveis: ${location.href.split('#')[0]}`;
    try {
      if (navigator.share) await navigator.share({title: p.titulo, text: texto});
      else { await navigator.clipboard.writeText(texto); sh.lastChild.textContent = 'Texto copiado!'; setTimeout(() => sh.lastChild.textContent = 'Compartilhar', 2200); }
    } catch(_) {}
  };
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

/* ===== GERAL ===== */
function iniciar(){
  montarChat(); montarCategorias(); montarBusca(); montarContato();

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
