(function(){
  const rows=(window.PKA_DATA&&window.PKA_DATA.medallas)||[];
  const root=document.getElementById('medalExplorer');
  if(!root) return;
  const pt=document.documentElement.lang==='pt-BR';
  const t=pt?{
    search:'Buscar Pokémon ou efeito…',allBuffs:'Todos os bônus',allDebuffs:'Todas as penalidades',results:'medalhas',prev:'← Anterior',next:'Próxima →',page:'Página',buff:'Bônus',debuff:'Penalidade',none:'Sem penalidade registrada',empty:'Nenhuma medalha corresponde aos filtros.',clear:'Limpar filtros',hint:'Pesquise pelo Pokémon ou filtre por bônus e penalidade. Cada cartão mostra somente o efeito principal da medalha para facilitar a leitura.'
  }:{
    search:'Buscar Pokémon o efecto…',allBuffs:'Todos los bonos',allDebuffs:'Todas las penalidades',results:'medallas',prev:'← Anterior',next:'Siguiente →',page:'Página',buff:'Bono',debuff:'Penalidad',none:'Sin penalidad registrada',empty:'No hay medallas que coincidan con los filtros.',clear:'Limpiar filtros',hint:'Busca por Pokémon o filtra por bono y penalidad. Cada tarjeta muestra únicamente el efecto principal de la medalla para facilitar la lectura.'
  };
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const norm=s=>String(s??'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const unique=k=>[...new Set(rows.map(r=>String(r[k]||'').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
  const buffs=unique('Buff'), debuffs=unique('Debuff');
  let q='',buff='',debuff='',page=1; const per=24;
  root.innerHTML=`
    <div class="medalExplorerHead">
      <div><h3>${pt?'Explorador de medalhas':'Explorador de medallas'}</h3><p>${t.hint}</p></div>
      <span class="medalCount" data-count></span>
    </div>
    <div class="medalFilters">
      <label class="medalSearch"><span>⌕</span><input type="search" placeholder="${t.search}" aria-label="${t.search}"></label>
      <select data-buff aria-label="${t.allBuffs}"><option value="">${t.allBuffs}</option>${buffs.map(x=>`<option>${esc(x)}</option>`).join('')}</select>
      <select data-debuff aria-label="${t.allDebuffs}"><option value="">${t.allDebuffs}</option>${debuffs.map(x=>`<option>${esc(x)}</option>`).join('')}</select>
      <button class="medalClear" type="button">${t.clear}</button>
    </div>
    <div class="medalGrid" data-grid></div>
    <div class="medalPager" data-pager></div>`;
  const input=root.querySelector('input'), buffSel=root.querySelector('[data-buff]'), debuffSel=root.querySelector('[data-debuff]'), grid=root.querySelector('[data-grid]'), pager=root.querySelector('[data-pager]'), count=root.querySelector('[data-count]');
  function filtered(){return rows.filter(r=>{
    const hay=norm(`${r.Pokémon} ${r.Buff} ${r.Debuff}`);
    return (!q||hay.includes(norm(q)))&&(!buff||r.Buff===buff)&&(!debuff||r.Debuff===debuff);
  })}
  function sprite(name){try{return typeof pokemonSprite==='function'?pokemonSprite(name):''}catch(e){return ''}}
  function draw(){
    const data=filtered(), pages=Math.max(1,Math.ceil(data.length/per)); if(page>pages)page=pages;
    const view=data.slice((page-1)*per,page*per); count.textContent=`${data.length} ${t.results}`;
    grid.innerHTML=view.length?view.map(r=>`<article class="medalCard">
      <div class="medalPokemon"><img loading="lazy" decoding="async" src="${esc(sprite(r.Pokémon))}" alt="" onerror="this.style.display='none'"><strong>${esc(r.Pokémon)}</strong></div>
      <div class="medalEffect good"><span>＋ ${t.buff}</span><b>${esc(r.Buff||'—')}</b></div>
      <div class="medalEffect bad"><span>− ${t.debuff}</span><b>${esc(r.Debuff||t.none)}</b></div>
    </article>`).join(''):`<div class="medalEmpty">${t.empty}</div>`;
    pager.innerHTML=`<button type="button" data-prev ${page<=1?'disabled':''}>${t.prev}</button><span>${t.page} <b>${page}</b> / ${pages}</span><button type="button" data-next ${page>=pages?'disabled':''}>${t.next}</button>`;
    pager.querySelector('[data-prev]').onclick=()=>{page--;draw()};
    pager.querySelector('[data-next]').onclick=()=>{page++;draw()};
  }
  input.oninput=e=>{q=e.target.value;page=1;draw()};
  buffSel.onchange=e=>{buff=e.target.value;page=1;draw()};
  debuffSel.onchange=e=>{debuff=e.target.value;page=1;draw()};
  root.querySelector('.medalClear').onclick=()=>{q=buff=debuff='';page=1;input.value='';buffSel.value='';debuffSel.value='';draw()};
  draw();
})();
