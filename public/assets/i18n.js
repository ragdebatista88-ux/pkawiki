/* PKA Wiki — traducción dinámica ES / Português (Brasil)
   Cambia el idioma sin recargar y conserva la preferencia en localStorage. */
(() => {
  'use strict';
  const STORAGE_KEY = 'pka-wiki-language';
  const DEFAULT_LANG = 'es';
  const supported = new Set(['es', 'pt-BR']);
  let lang = supported.has(localStorage.getItem(STORAGE_KEY)) ? localStorage.getItem(STORAGE_KEY) : DEFAULT_LANG;
  let applying = false;

  const exact = new Map(Object.entries({
    'Inicio':'Início','Progresión':'Progressão','Mundo':'Mundo','Actividades':'Atividades','Guías':'Guias','Herramientas':'Ferramentas','Información':'Informações',
    'Primeros pasos':'Primeiros passos','Experiencia':'Experiência','Entrenamiento':'Treinamento','Talentos':'Talentos','Localizaciones':'Localizações','Instancias':'Instâncias','Rotaciones':'Rotações',
    'Policía':'Polícia','Calculadoras':'Calculadoras','Calculadora de Stars':'Calculadora de Stars','Calculadora de daño':'Calculadora de dano','Mapa desbloqueado':'Mapa desbloqueado',
    'Sistemas':'Sistemas','Sugerencias':'Sugestões','Buscar en la wiki…':'Buscar na wiki…','Buscar en esta sección…':'Buscar nesta seção…','Sin resultados':'Sem resultados',
    'Sección':'Seção','registros':'registros','Anterior':'Anterior','Siguiente':'Próxima','Abrir':'Abrir','Cerrar':'Fechar','Ver más':'Ver mais','Ver guía completa →':'Ver guia completa →',
    'En esta guía':'Neste guia','Información documentada':'Informação documentada','Datos de la comunidad':'Dados da comunidade','Estimación':'Estimativa','Referencias documentadas':'Referências documentadas',
    'Datos de juego/wiki':'Dados do jogo/wiki','Datos comunitarios separados':'Dados da comunidade separados','También te puede interesar':'Você também pode se interessar','Continúa con información relacionada sin salir de la wiki.':'Continue com informações relacionadas sem sair da wiki.',
    'Proyecto comunitario no afiliado ni respaldado oficialmente por PokeAlliance.':'Projeto comunitário não afiliado nem apoiado oficialmente pela PokeAlliance.',
    'Información comunitaria organizada y adaptada al español.':'Informação comunitária organizada e adaptada ao português brasileiro.',
    'Información organizada para la comunidad hispanohablante.':'Informação organizada para a comunidade brasileira.',
    'Adaptación y organización en español.':'Adaptação e organização em português brasileiro.',
    'Los valores pueden cambiar con actualizaciones del juego.':'Os valores podem mudar com atualizações do jogo.',
    'Importante:':'Importante:','Recompensa':'Recompensa','Recompensas':'Recompensas','Objetivo':'Objetivo','Ubicación':'Localização','Localización':'Localização','Coordenadas':'Coordenadas',
    'Cantidad':'Quantidade','Precio':'Preço','Nivel':'Nível','Función':'Função','Tipo':'Tipo','Objetos':'Itens','Equipo inicial':'Time inicial','Mejoras':'Melhorias','Ventajas':'Vantagens','Desventajas':'Desvantagens','Opciones posibles':'Opções possíveis',
    'Pokémon de la dungeon':'Pokémon da dungeon','Contra el líder':'Contra o líder','Líderes de Gym y sus Pokémon':'Líderes de Gym e seus Pokémon','Equipo del líder':'Time do líder','Entrada:':'Entrada:',
    'Cómo llegar':'Como chegar','Cómo funciona':'Como funciona','Cómo obtenerlo':'Como obter','Dónde encontrarlo':'Onde encontrar','Cómo usarlo':'Como usar','Consejos':'Dicas','Notas':'Notas','Nota':'Nota',
    'Todos':'Todos','Todas':'Todas','Sí':'Sim','No':'Não','Muy Raro':'Muito Raro','Raro':'Raro','Común':'Comum','Soporte':'Suporte','Daño':'Dano','Defensa':'Defesa','Ataque':'Ataque','Vida':'Vida',
    'Nombre':'Nome','Nombre o apodo':'Nome ou apelido','Opcional':'Opcional','Tipo de sugerencia *':'Tipo de sugestão *','Selecciona una opción':'Selecione uma opção','Corrección':'Correção','Nueva guía':'Novo guia','Información faltante':'Informação faltante','Mejora de la wiki':'Melhoria da wiki','Otro':'Outro',
    'Página relacionada':'Página relacionada','Sugerencia *':'Sugestão *','Enviar sugerencia':'Enviar sugestão','Enviando…':'Enviando…','¿Tienes una sugerencia?':'Tem uma sugestão?','Ayúdanos a corregir, completar o mejorar la wiki.':'Ajude-nos a corrigir, completar ou melhorar a wiki.',
    'Cómo quieres que te identifiquemos':'Como você quer ser identificado','Cuéntanos qué información debemos corregir, agregar o mejorar…':'Conte quais informações devemos corrigir, adicionar ou melhorar…',
    '¡Gracias! Tu sugerencia fue enviada correctamente.':'Obrigado! Sua sugestão foi enviada com sucesso.','No se pudo enviar la sugerencia.':'Não foi possível enviar a sugestão.','Ocurrió un error al enviar la sugerencia. Intenta de nuevo.':'Ocorreu um erro ao enviar a sugestão. Tente novamente.',
    'Centro de la wiki':'Central da wiki','Accesos útiles':'Acessos úteis','Contenido vivo, herramientas y rutas de consulta frecuentes.':'Conteúdo vivo, ferramentas e atalhos de consulta frequentes.',
    'Consulta y progreso':'Consulta e progresso','Directorio de NPCs':'Diretório de NPCs','Últimos cambios':'Últimas mudanças','Cómo leer nuestros datos':'Como interpretar nossos dados',
    'Datos base: Pokedex Pública PokeAlliance (By Mts Vitor).':'Dados base: Pokédex Pública PokeAlliance (By Mts Vitor).',
    'Guía rápida':'Guia rápido','Cómo importar el mapa desbloqueado':'Como importar o mapa desbloqueado','Descargar mapa':'Baixar mapa','Ver cómo instalarlo':'Ver como instalar','Ver imagen completa':'Ver imagem completa',
    'Abre Backup / Restore':'Abra Backup / Restore','Importa el minimapa':'Importe o minimapa','Paso 1 · Backup / Restore':'Passo 1 · Backup / Restore','Paso 2 · Import minimap':'Passo 2 · Import minimap',
    'No uses Import settings; solo necesitas Import minimap.':'Não use Import settings; você só precisa de Import minimap.','Descargar minimap854.otmm':'Baixar minimap854.otmm',
    'Explorar ▾':'Explorar ▾','Mundo y actividades':'Mundo e atividades','Herramientas e info':'Ferramentas e informações','Vista rápida':'Visão rápida','Ver todos los drops →':'Ver todos os drops →','No hay drops registrados para este Pokémon.':'Não há drops registrados para este Pokémon.',
    'Abrir en nuestra wiki →':'Abrir em nossa wiki →','Abrir enlace ↗':'Abrir link ↗','Ver en nuestra wiki →':'Ver em nossa wiki →',
    'Task':'Task','Tasks':'Tasks','Quest':'Quest','Quests':'Quests','Dungeons':'Dungeons','GYMs':'GYMs','NPCs':'NPCs','Addons':'Addons','Changelogs':'Changelogs','FAQ':'FAQ','Pokédex':'Pokédex',
    'Pokedex':'Pokédex','Pokémon':'Pokémon','Ciudad':'Cidade','Dungeon':'Dungeon','Hunt':'Hunt','Kills/h':'Kills/h','Jugadores':'Jogadores','Mobs':'Mobs','Tiempo':'Tempo','Drops':'Drops',
    'Información pendiente':'Informação pendente','Pendiente de documentar':'Pendente de documentar','Por documentar':'A documentar','Desconocido':'Desconhecido','No disponible':'Não disponível',
    'Idioma':'Idioma','Español':'Español','Português (Brasil)':'Português (Brasil)'
  }));

  // Sustituciones para contenido libre. Se aplican solamente en PT-BR y conservan nombres propios/Pokémon.
  const words = [
    ['\bdel\b','do'],['\bde la\b','da'],['\bde los\b','dos'],['\bde las\b','das'],['\bal\b','ao'],['\ba la\b','à'],['\ba los\b','aos'],['\ba las\b','às'],
    ['\bel\b','o'],['\bla\b','a'],['\blos\b','os'],['\blas\b','as'],['\bun\b','um'],['\buna\b','uma'],['\bunos\b','alguns'],['\bunas\b','algumas'],
    ['\by\b','e'],['\bo\b','ou'],['\bpero\b','mas'],['\bcon\b','com'],['\bsin\b','sem'],['\bpara\b','para'],['\bpor\b','por'],['\bdesde\b','desde'],['\bhasta\b','até'],['\bentre\b','entre'],['\bsobre\b','sobre'],['\bdebajo\b','embaixo'],['\barriba\b','acima'],
    ['\besta\b','esta'],['\beste\b','este'],['\bestos\b','estes'],['\bestas\b','estas'],['\bese\b','esse'],['\besa\b','essa'],['\bque\b','que'],['\bse\b','se'],['\bes\b','é'],['\bson\b','são'],['\bestá\b','está'],['\bestán\b','estão'],['\bpuede\b','pode'],['\bpueden\b','podem'],['\bdebe\b','deve'],['\bdeben\b','devem'],['\btiene\b','tem'],['\btienen\b','têm'],['\bhay\b','há'],
    ['\bjugador\b','jogador'],['\bjugadores\b','jogadores'],['\bjuego\b','jogo'],['\bpágina\b','página'],['\bpáginas\b','páginas'],['\bguía\b','guia'],['\bguías\b','guias'],['\binformación\b','informação'],['\bdatos\b','dados'],['\bvalor\b','valor'],['\bvalores\b','valores'],
    ['\bubicación\b','localização'],['\blocalización\b','localização'],['\blocalizaciones\b','localizações'],['\brecompensa\b','recompensa'],['\brecompensas\b','recompensas'],['\bcantidad\b','quantidade'],['\bnivel\b','nível'],['\bniveles\b','níveis'],['\bprecio\b','preço'],['\bprecios\b','preços'],['\bcosto\b','custo'],['\bcostos\b','custos'],
    ['\bequipo\b','time'],['\bequipos\b','times'],['\blíder\b','líder'],['\blíderes\b','líderes'],['\bentrada\b','entrada'],['\bsalida\b','saída'],['\bcueva\b','caverna'],['\bisla\b','ilha'],['\bpuente\b','ponte'],['\bnorte\b','norte'],['\bsur\b','sul'],['\beste\b','leste'],['\boeste\b','oeste'],
    ['\bataque\b','ataque'],['\bataques\b','ataques'],['\bdaño\b','dano'],['\bdaños\b','danos'],['\bdefensa\b','defesa'],['\bvida\b','vida'],['\bvelocidad\b','velocidade'],['\bexperiencia\b','experiência'],['\bhabilidad\b','habilidade'],['\bhabilidades\b','habilidades'],['\bmovimiento\b','movimento'],['\bmovimientos\b','movimentos'],
    ['\bmejora\b','melhoria'],['\bmejoras\b','melhorias'],['\bmejorar\b','melhorar'],['\bventaja\b','vantagem'],['\bventajas\b','vantagens'],['\bdesventaja\b','desvantagem'],['\bdesventajas\b','desvantagens'],['\bopción\b','opção'],['\bopciones\b','opções'],['\bposible\b','possível'],['\bposibles\b','possíveis'],
    ['\bnormal\b','normal'],['\bshiny\b','shiny'],['\braro\b','raro'],['\bmuy raro\b','muito raro'],['\bcomún\b','comum'],['\btipo\b','tipo'],['\belemento\b','elemento'],['\belemental\b','elemental'],['\bsoporte\b','suporte'],['\boficial\b','oficial'],['\bcomunidad\b','comunidade'],['\bcomunitario\b','comunitário'],['\bcomunitaria\b','comunitária'],
    ['\bprimero\b','primeiro'],['\bprimera\b','primeira'],['\bsegundo\b','segundo'],['\bsegunda\b','segunda'],['\btercero\b','terceiro'],['\btercera\b','terceira'],['\bnuevo\b','novo'],['\bnueva\b','nova'],['\bnuevos\b','novos'],['\bnuevas\b','novas'],['\bactual\b','atual'],['\bactuales\b','atuais'],
    ['\bver\b','ver'],['\babrir\b','abrir'],['\bcerrar\b','fechar'],['\bbuscar\b','buscar'],['\bseleccionar\b','selecionar'],['\bselecciona\b','selecione'],['\bmostrar\b','mostrar'],['\bocultar\b','ocultar'],['\bagregar\b','adicionar'],['\beliminar\b','remover'],['\bdescargar\b','baixar'],['\bimportar\b','importar'],['\busar\b','usar'],['\busa\b','use'],['\bobtener\b','obter'],['\bencontrar\b','encontrar'],
    ['\bcuando\b','quando'],['\bdonde\b','onde'],['\bdónde\b','onde'],['\bcómo\b','como'],['\bcuál\b','qual'],['\bcuáles\b','quais'],['\bqué\b','que'],['\bporque\b','porque'],['\btambién\b','também'],['\bsolo\b','apenas'],['\bsólo\b','apenas'],['\bmás\b','mais'],['\bmenos\b','menos'],['\bmismo\b','mesmo'],['\bmisma\b','mesma'],
    ['\bdisponible\b','disponível'],['\bdisponibles\b','disponíveis'],['\bnecesario\b','necessário'],['\bnecesaria\b','necessária'],['\bimportante\b','importante'],['\brecomendado\b','recomendado'],['\brecomendada\b','recomendada'],['\brecomendados\b','recomendados'],['\brecomendadas\b','recomendadas'],['\bprincipal\b','principal'],['\bsecundario\b','secundário'],['\bsecundaria\b','secundária'],
    ['\btiempo\b','tempo'],['\bhoras\b','horas'],['\bhora\b','hora'],['\bminutos\b','minutos'],['\bsegundos\b','segundos'],['\bdía\b','dia'],['\bdías\b','dias'],['\bsemana\b','semana'],['\bsemanal\b','semanal'],['\bmensual\b','mensal'],
    ['\brequiere\b','requer'],['\brequieren\b','requerem'],['\bpermite\b','permite'],['\bpermite\b','permite'],['\baumenta\b','aumenta'],['\breduce\b','reduz'],['\baparece\b','aparece'],['\baparecen\b','aparecem'],['\butiliza\b','utiliza'],['\butilizar\b','utilizar'],['\bconsigue\b','consegue'],['\bconseguir\b','conseguir'],
    ['\bobjetivo\b','objetivo'],['\bmisión\b','missão'],['\bmisiones\b','missões'],['\btarea\b','tarefa'],['\btareas\b','tarefas'],['\bobjeto\b','item'],['\bobjetos\b','itens'],['\bmaterial\b','material'],['\bmateriales\b','materiais'],['\bmoneda\b','moeda'],['\bmonedas\b','moedas'],
    ['\bregistrado\b','registrado'],['\bregistrados\b','registrados'],['\bregistrada\b','registrada'],['\bregistradas\b','registradas'],['\bpendiente\b','pendente'],['\bcompleto\b','completo'],['\bcompleta\b','completa'],['\bincompleto\b','incompleto'],['\bincompleta\b','incompleta'],
    ['\bactualización\b','atualização'],['\bactualizaciones\b','atualizações'],['\bcambio\b','mudança'],['\bcambios\b','mudanças'],['\bcorrección\b','correção'],['\bcorrecciones\b','correções'],['\bsistema\b','sistema'],['\bsistemas\b','sistemas']
  ].map(([p,r]) => [new RegExp(p,'giu'), r]);

  const originals = new WeakMap();
  const attrOriginals = new WeakMap();
  const skipTags = new Set(['SCRIPT','STYLE','NOSCRIPT','TEXTAREA','CODE','PRE']);

  function preserveCase(src, replacement) {
    if (!src) return replacement;
    if (src === src.toUpperCase() && src.length > 1) return replacement.toUpperCase();
    if (src[0] === src[0].toUpperCase()) return replacement.charAt(0).toUpperCase() + replacement.slice(1);
    return replacement;
  }
  function translateText(text) {
    if (lang === 'es' || !text || !/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ¿¡]/.test(text)) return text;
    const trimmed = text.trim();
    if (exact.has(trimmed)) return text.replace(trimmed, exact.get(trimmed));
    let out = text;
    for (const [rx, repl] of words) out = out.replace(rx, m => preserveCase(m, repl));
    // Correcciones frecuentes después de sustituciones por palabras.
    out = out
      .replace(/\bda o\b/gi,'do').replace(/\bdo a\b/gi,'da')
      .replace(/\bInformaçãos\b/g,'Informações').replace(/\binformaçãos\b/g,'informações')
      .replace(/\bLocalizaçãos\b/g,'Localizações').replace(/\blocalizaçãos\b/g,'localizações')
      .replace(/\bOpçãos\b/g,'Opções').replace(/\bopçãos\b/g,'opções');
    return out;
  }
  function shouldSkip(el) {
    if (!el) return true;
    if (skipTags.has(el.tagName)) return true;
    if (el.closest?.('[data-no-i18n], .languageSwitcher, .pokeMention, .pokemonName, .pokemon-title')) return true;
    return false;
  }
  function translateNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const parent = node.parentElement;
      if (!parent || shouldSkip(parent) || !node.nodeValue.trim()) return;
      if (!originals.has(node)) originals.set(node, node.nodeValue);
      const original = originals.get(node);
      node.nodeValue = lang === 'es' ? original : translateText(original);
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE || shouldSkip(node)) return;
    const attrs = ['placeholder','title','aria-label'];
    let rec = attrOriginals.get(node);
    if (!rec) { rec = {}; attrOriginals.set(node, rec); }
    attrs.forEach(a => {
      if (node.hasAttribute(a)) {
        if (!(a in rec)) rec[a] = node.getAttribute(a);
        node.setAttribute(a, lang === 'es' ? rec[a] : translateText(rec[a]));
      }
    });
    [...node.childNodes].forEach(translateNode);
  }
  function translateDocument() {
    applying = true;
    document.documentElement.lang = lang === 'pt-BR' ? 'pt-BR' : 'es';
    translateNode(document.body);
    const sel = document.querySelector('#wikiLanguageSelect');
    if (sel) sel.value = lang;
    applying = false;
    document.dispatchEvent(new CustomEvent('pka:languagechange',{detail:{language:lang}}));
  }
  function setLanguage(next) {
    if (!supported.has(next)) next = DEFAULT_LANG;
    lang = next;
    localStorage.setItem(STORAGE_KEY, lang);
    translateDocument();
  }
  function injectSwitcher() {
    if (document.querySelector('.languageSwitcher')) return;
    const shell = document.querySelector('.topbar .shell, header .shell, .topbar');
    if (!shell) return;
    const wrap = document.createElement('label');
    wrap.className = 'languageSwitcher';
    wrap.setAttribute('data-no-i18n','');
    wrap.innerHTML = `<span class="languageIcon" aria-hidden="true">🌐</span><select id="wikiLanguageSelect" aria-label="Idioma"><option value="es">ES · Español</option><option value="pt-BR">BR · Português</option></select>`;
    const nav = shell.querySelector('.nav, .navlinks');
    if (nav) shell.insertBefore(wrap, nav); else shell.appendChild(wrap);
    wrap.querySelector('select').value = lang;
    wrap.querySelector('select').addEventListener('change', e => setLanguage(e.target.value));
  }

  const observer = new MutationObserver(mutations => {
    if (applying) return;
    applying = true;
    for (const m of mutations) {
      m.addedNodes.forEach(n => translateNode(n));
    }
    applying = false;
  });

  function init() {
    injectSwitcher();
    translateDocument();
    observer.observe(document.body,{childList:true,subtree:true});
    // Una segunda pasada captura contenido renderizado por app.js en el mismo ciclo.
    setTimeout(translateDocument, 60);
    setTimeout(translateDocument, 300);
  }

  window.PKAI18N = { setLanguage, getLanguage:()=>lang, t:translateText, refresh:translateDocument };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
