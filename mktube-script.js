'use strict';

const YT_API_KEY = 'AIzaSyBnY6hDxR7JSlPefhfhY8V22flAcZZlJ1s';
let searchQuery='',searchOffset=0,nextPageToken='',allResults=[],isSearching=false;
let currentVideoId=null,currentTab='mp4';

/* ── Mobile Sidebar Toggle ── */
function openSidebar(){
  document.querySelector('.yt-sidebar')?.classList.add('open');
  document.getElementById('sidebarOverlay')?.classList.add('open');
}
function closeSidebar(){
  document.querySelector('.yt-sidebar')?.classList.remove('open');
  document.getElementById('sidebarOverlay')?.classList.remove('open');
}
window.closeSidebar=closeSidebar;
/* Wire hamburger button */
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelector('.yt-hamburger')?.addEventListener('click',()=>{
    const sb=document.querySelector('.yt-sidebar');
    if(sb?.classList.contains('open')) closeSidebar(); else openSidebar();
  });
  /* Close sidebar when a nav item is clicked (mobile) */
  document.querySelectorAll('.yt-nav-item').forEach(n=>n.addEventListener('click',()=>{if(window.innerWidth<=960)closeSidebar()}));
});

/* ── YouTube Search API ── */
async function fetchSearch(q,pageToken=''){
  if(!YT_API_KEY)return null;
  const p=new URLSearchParams({part:'snippet',q,type:'video',maxResults:20,key:YT_API_KEY,...(pageToken?{pageToken}:{})});
  try{const r=await fetch('https://www.googleapis.com/youtube/v3/search?'+p);if(!r.ok)return null;const d=await r.json();nextPageToken=d.nextPageToken||'';return(d.items||[]).map(i=>({videoId:i.id.videoId,title:i.snippet.title,channel:i.snippet.channelTitle,published:timeAgo(i.snippet.publishedAt),thumb:i.snippet.thumbnails?.medium?.url||`https://i.ytimg.com/vi/${i.id.videoId}/mqdefault.jpg`}))}catch(e){return null}
}
function timeAgo(iso){if(!iso)return'';const d=(Date.now()-new Date(iso))/1000;if(d<3600)return Math.floor(d/60)+' min ago';if(d<86400)return Math.floor(d/3600)+' hrs ago';if(d<2592000)return Math.floor(d/86400)+' days ago';if(d<31536000)return Math.floor(d/2592000)+' months ago';return Math.floor(d/31536000)+' years ago'}
function escHtml(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}

/* ── Search ── */
async function doSearch(query,chipEl){
  query=(query||'').trim();if(!query)return;
  const input=document.getElementById('headerSearchInput');if(input&&input.value!==query)input.value=query;
  if(chipEl){document.querySelectorAll('.yt-chip').forEach(c=>c.classList.remove('active'));chipEl.classList.add('active')}
  closeSuggestions();searchQuery=query;searchOffset=0;nextPageToken='';allResults=[];isSearching=true;
  document.getElementById('searchPanel').style.display='block';
  document.getElementById('searchPanelTitle').textContent='Results for "'+query+'"';
  document.getElementById('searchResultsGrid').innerHTML='';
  document.getElementById('searchLoading').style.display='flex';
  document.getElementById('searchEmpty').style.display='none';
  document.getElementById('searchLoadMore').style.display='none';
  const results=await fetchSearch(query);isSearching=false;
  document.getElementById('searchLoading').style.display='none';
  if(!results){document.getElementById('searchEmpty').style.display='flex';document.getElementById('searchEmpty').innerHTML='<i class="fa-brands fa-youtube" style="color:var(--accent);font-size:2.5rem"></i><strong style="color:var(--text)">API Key Required</strong><span style="max-width:340px;line-height:1.6">Add your free YouTube Data API key to enable search.<br>Meanwhile, paste any YouTube link directly in the player below ↓</span>';return}
  if(!results.length){document.getElementById('searchEmpty').style.display='flex';return}
  allResults=results;renderResults(allResults);document.getElementById('searchLoadMore').style.display=nextPageToken?'block':'none';
}
window.doSearch=doSearch;

async function loadMoreResults(){
  if(isSearching||!nextPageToken)return;isSearching=true;
  document.getElementById('searchLoadMore').style.display='none';document.getElementById('searchLoading').style.display='flex';
  const r=await fetchSearch(searchQuery,nextPageToken);isSearching=false;document.getElementById('searchLoading').style.display='none';
  if(r&&r.length){allResults=[...allResults,...r];renderResults(r,true);document.getElementById('searchLoadMore').style.display=nextPageToken?'block':'none'}
}
window.loadMoreResults=loadMoreResults;

function renderResults(videos,append=false){
  const grid=document.getElementById('searchResultsGrid'),frag=document.createDocumentFragment();
  videos.forEach(v=>{const id=v.videoId;if(!id)return;
    const card=document.createElement('div');card.className='yt-result-card';card.dataset.id=id;
    card.innerHTML=`<div class="yt-result-thumb-wrap"><img class="yt-result-thumb" src="${v.thumb}" alt="${escHtml(v.title)}" loading="lazy" onerror="this.src='https://i.ytimg.com/vi/${id}/mqdefault.jpg'"/><div class="yt-result-thumb-overlay"><div class="yt-result-play-btn"><i class="fa-solid fa-play" style="margin-left:3px"></i></div></div></div><div class="yt-result-info"><div class="yt-result-title">${escHtml(v.title)}</div><div class="yt-result-meta">${v.channel?'<span class="yt-result-channel">'+escHtml(v.channel)+'</span>':''}<span>${v.published||''}</span></div></div>`;
    card.addEventListener('click',()=>playFromSearch(id,v.title,card));frag.appendChild(card)});
  if(!append)grid.innerHTML='';grid.appendChild(frag);
}

function playFromSearch(id,title,cardEl){
  document.querySelectorAll('.yt-result-card').forEach(c=>c.classList.remove('now-playing'));
  if(cardEl)cardEl.classList.add('now-playing');
  document.getElementById('videoUrl').value='https://www.youtube.com/watch?v='+id;loadVideo();
  document.querySelector('.yt-primary')?.scrollIntoView({behavior:'smooth',block:'start'});
}
window.playFromSearch=playFromSearch;
function closeSearch(){document.getElementById('searchPanel').style.display='none';document.querySelectorAll('.yt-chip').forEach((c,i)=>c.classList.toggle('active',i===0))}
window.closeSearch=closeSearch;

/* ── Autocomplete ── */
const TRENDING=['Lo-fi hip hop','Gaming highlights','Tech review','Coding tutorial','Music mix','Movie trailers 2025','Cricket highlights','IPL 2025','India news today','Bollywood songs','React JS tutorial','Python programming','AI tools 2025','Motivational speech'];
let suggestionsEl=null;
function createSuggestionsEl(){suggestionsEl=document.createElement('div');suggestionsEl.className='yt-suggestions';document.getElementById('headerSearchWrap').appendChild(suggestionsEl)}
function showSuggestions(q){if(!suggestionsEl)createSuggestionsEl();const ql=q.toLowerCase().trim();const m=ql?TRENDING.filter(s=>s.toLowerCase().includes(ql)).slice(0,7):TRENDING.slice(0,6);if(!m.length){closeSuggestions();return}suggestionsEl.innerHTML=m.map(s=>`<div class="yt-sug-item" onclick="doSearch('${escHtml(s)}');document.getElementById('headerSearchInput').value='${escHtml(s)}'"><i class="fa-solid fa-magnifying-glass"></i> ${escHtml(s)}</div>`).join('');suggestionsEl.classList.add('open')}
function closeSuggestions(){if(suggestionsEl)suggestionsEl.classList.remove('open')}

/* ── Voice Search ── */
window.startVoiceSearch=function(){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){alert('Voice search not supported.');return}const r=new SR();r.lang='en-IN';r.interimResults=false;document.getElementById('micIcon').className='fa-solid fa-microphone-lines';r.start();r.onresult=e=>{const q=e.results[0][0].transcript;document.getElementById('headerSearchInput').value=q;doSearch(q)};r.onend=()=>{document.getElementById('micIcon').className='fa-solid fa-microphone'};r.onerror=()=>{document.getElementById('micIcon').className='fa-solid fa-microphone'}};

/* ── Input Events ── */
document.addEventListener('DOMContentLoaded',()=>{
  const input=document.getElementById('headerSearchInput');if(!input)return;
  input.addEventListener('input',()=>showSuggestions(input.value));
  input.addEventListener('focus',()=>showSuggestions(input.value));
  document.addEventListener('click',e=>{if(!document.getElementById('headerSearchWrap')?.contains(e.target))closeSuggestions()});
  input.addEventListener('keydown',e=>{if(e.key==='Escape')closeSuggestions()});
  loadHomepage('trending india 2025');
});

/* ── Chip filter ── */
document.querySelectorAll('.yt-chip').forEach(c=>c.addEventListener('click',()=>{document.querySelectorAll('.yt-chip').forEach(x=>x.classList.remove('active'));c.classList.add('active')}));

/* ── Subscribe toggle ── */
document.getElementById('subBtn')?.addEventListener('click',function(){
  const s=this.dataset.sub==='1';
  if(s){this.innerHTML='<i class="fa-solid fa-bell"></i> Subscribe';this.style.background='var(--accent)';this.style.color='#000';delete this.dataset.sub}
  else{this.innerHTML='<i class="fa-solid fa-bell-slash"></i> Subscribed';this.style.background='var(--bg3)';this.style.color='var(--text)';this.dataset.sub='1'}
});

/* ── Tab Switcher ── */
window.switchTab=function(tab){currentTab=tab;document.getElementById('mp4List').style.display=tab==='mp4'?'flex':'none';document.getElementById('mp3List').style.display=tab==='mp3'?'flex':'none';document.getElementById('tabMp4').classList.toggle('active',tab==='mp4');document.getElementById('tabMp3').classList.toggle('active',tab==='mp3')};

/* ── Download Sites ── */
function getSites(id){const yt=encodeURIComponent('https://www.youtube.com/watch?v='+id);return{mp4:[{name:'SaveFrom',sub:'All qualities · MP4',icon:'fa-download',href:'https://en1.savefrom.net/16xF/#url='+yt},{name:'SSYouTube',sub:'Add "ss" trick · MP4',icon:'fa-bolt',href:'https://www.ssyoutube.com/watch?v='+id},{name:'9xBuddy',sub:'Multiple resolutions',icon:'fa-video',href:'https://9xbuddy.in/process?url='+yt},{name:'SnapSave',sub:'720p – 1080p',icon:'fa-film',href:'https://snapsave.app/result?url='+yt}],mp3:[{name:'SaveFrom MP3',sub:'Via SaveFrom · MP3',icon:'fa-music',href:'https://en1.savefrom.net/16xF/#url='+yt},{name:'YTmp3',sub:'320 kbps audio',icon:'fa-headphones',href:'https://ytmp3.cc/en13/youtube-to-mp3/?url='+yt},{name:'X2Convert',sub:'Direct convert · MP3',icon:'fa-compact-disc',href:'https://x2convert.com/en16/download-youtube-to-mp3/?url='+yt},{name:'ConvertMP3',sub:'Fast MP3 download',icon:'fa-waveform-lines',href:'https://www.convertmp3.io/?video='+yt}]}}
function buildDlList(id){const s=getSites(id);document.getElementById('mp4List').innerHTML=s.mp4.map(s=>`<a class="yt-dl-item" href="${s.href}" target="_blank" rel="noopener"><div class="yt-dl-item-ico"><i class="fa-solid ${s.icon}"></i></div><div class="yt-dl-item-info"><div class="yt-dl-item-name">${s.name}</div><div class="yt-dl-item-sub">${s.sub}</div></div><i class="fa-solid fa-arrow-up-right-from-square yt-dl-item-arrow"></i></a>`).join('');document.getElementById('mp3List').innerHTML=s.mp3.map(s=>`<a class="yt-dl-item mp3-item" href="${s.href}" target="_blank" rel="noopener"><div class="yt-dl-item-ico"><i class="fa-solid ${s.icon}"></i></div><div class="yt-dl-item-info"><div class="yt-dl-item-name">${s.name}</div><div class="yt-dl-item-sub">${s.sub}</div></div><i class="fa-solid fa-arrow-up-right-from-square yt-dl-item-arrow"></i></a>`).join('');switchTab('mp4')}

/* ── Helpers ── */
function extractId(url){const m=url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|embed\/|v\/|shorts\/))([a-zA-Z0-9_-]{11})/);return m?m[1]:null}
function showErr(msg){document.getElementById('errText').textContent=msg;document.getElementById('errBox').classList.add('show')}
function hideErr(){document.getElementById('errBox').classList.remove('show')}
async function fetchInfo(id){try{const r=await fetch('https://www.youtube.com/oembed?url='+encodeURIComponent('https://www.youtube.com/watch?v='+id)+'&format=json');if(r.ok){const d=await r.json();return{title:d.title,thumb:d.thumbnail_url}}}catch{}return{title:'YouTube Video',thumb:null}}

function resetPlayer(){
  document.getElementById('defaultState').style.display='flex';document.getElementById('loaderState').classList.remove('show');
  const p=document.getElementById('player');p.classList.remove('show');p.src='';
  document.getElementById('dlThumbRow').style.display='none';document.getElementById('dlTabs').style.display='none';
  document.getElementById('dlEmpty').style.display='block';document.getElementById('mp4List').innerHTML='';document.getElementById('mp3List').innerHTML='';
  document.getElementById('videoTitle').textContent='Paste a link and press Play to start watching without ads.';document.getElementById('videoTitle').classList.add('empty');
  document.getElementById('actionBar').style.display='none';currentVideoId=null;
  document.getElementById('suggestionsPanel').style.display='none';document.getElementById('suggestionsList').innerHTML='';
}

async function loadVideo(){
  const raw=document.getElementById('videoUrl').value.trim();hideErr();
  if(!raw){showErr('Please paste a YouTube URL.');resetPlayer();return}
  const id=extractId(raw);if(!id){showErr('Invalid YouTube URL.');resetPlayer();return}
  _actualLoadVideo();
}

async function _actualLoadVideo(){
  const raw=document.getElementById('videoUrl').value.trim();hideErr();
  const id=extractId(raw);if(!id)return;currentVideoId=id;
  document.getElementById('defaultState').style.display='none';document.getElementById('loaderState').classList.add('show');
  document.getElementById('player').classList.remove('show');document.getElementById('dlEmpty').style.display='none';
  const[info]=await Promise.all([fetchInfo(id),new Promise(r=>setTimeout(r,900))]);
  const player=document.getElementById('player');player.src='https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0&modestbranding=1';
  document.getElementById('loaderState').classList.remove('show');player.classList.add('show');
  document.getElementById('videoTitle').textContent=info.title;document.getElementById('videoTitle').classList.remove('empty');
  document.getElementById('actionBar').style.display='flex';document.getElementById('dlName').textContent=info.title;
  const thumb=document.getElementById('dlThumb');thumb.innerHTML=info.thumb?`<img src="${info.thumb}" alt="thumb"/>`:'<i class="fa-brands fa-youtube"></i>';
  document.getElementById('dlThumbRow').style.display='flex';document.getElementById('dlTabs').style.display='flex';buildDlList(id);
  loadSuggestions(info.title);
}

/* ── Up Next Suggestions ── */
async function loadSuggestions(query){
  const panel=document.getElementById('suggestionsPanel');
  const list=document.getElementById('suggestionsList');
  if(!panel||!list)return;
  panel.style.display='block';
  list.innerHTML='<div class="yt-sug-loading"><div class="yt-spinner" style="width:24px;height:24px;border-width:2px"></div><span>Loading suggestions…</span></div>';
  /* Search for related videos using the current video title */
  const q=query.replace(/[^a-zA-Z0-9 ]/g,'').split(' ').slice(0,4).join(' ');
  const results=await fetchSearch(q);
  if(!results||!results.length){list.innerHTML='<div style="text-align:center;padding:20px;color:var(--text-dim);font-size:0.78rem">No suggestions available</div>';return}
  /* Filter out the currently playing video */
  const filtered=results.filter(v=>v.videoId&&v.videoId!==currentVideoId).slice(0,10);
  list.innerHTML='';
  filtered.forEach(v=>{
    const card=document.createElement('div');card.className='yt-sug-card';
    card.innerHTML=`<div class="yt-sug-card-thumb"><img src="${v.thumb}" alt="" loading="lazy" onerror="this.src='https://i.ytimg.com/vi/${v.videoId}/mqdefault.jpg'"/><div class="yt-sug-card-thumb-overlay"><div class="yt-sug-card-play"><i class="fa-solid fa-play" style="margin-left:1px"></i></div></div></div><div class="yt-sug-card-info"><div class="yt-sug-card-title">${escHtml(v.title)}</div>${v.channel?'<div class="yt-sug-card-channel">'+escHtml(v.channel)+'</div>':''}<div class="yt-sug-card-meta">${v.published||''}</div></div>`;
    card.addEventListener('click',()=>{
      document.getElementById('videoUrl').value='https://www.youtube.com/watch?v='+v.videoId;
      loadVideo();
      document.querySelector('.yt-primary')?.scrollIntoView({behavior:'smooth',block:'start'});
    });
    list.appendChild(card);
  });
}

function clearAll(){document.getElementById('videoUrl').value='';hideErr();resetPlayer()}

/* ── Mobile search ── */
window.openMobSearch=function(){document.getElementById('mobSearchBar').classList.add('open');setTimeout(()=>document.getElementById('mobSearchInput')?.focus(),120)};
window.closeMobSearch=function(){document.getElementById('mobSearchBar')?.classList.remove('open')};

/* ── Nav + Homepage ── */
function navSearch(query,el){document.querySelectorAll('.yt-nav-item').forEach(n=>n.classList.remove('active'));el?.classList.add('active');loadHomepage(query);return false}
window.navSearch=navSearch;

async function loadHomepage(query){
  const grid=document.getElementById('homepageGrid'),section=document.getElementById('homepageSection');if(!grid)return;
  const titleEl=section?.querySelector('.yt-homepage-title');
  if(titleEl)titleEl.textContent=query.includes('trending')?'🔥 Trending Now':query.includes('music')?'🎵 Top Music':query.includes('gaming')?'🎮 Gaming':query.includes('news')?'📰 Latest News':query.includes('cricket')?'🏏 Sports':query.includes('movies')?'🎬 Movies':query.includes('coding')?'💻 Coding':'🔍 '+query;
  grid.innerHTML=Array(12).fill('<div class="yt-skeleton-card"><div class="yt-skeleton-thumb"></div><div class="yt-skeleton-line"></div><div class="yt-skeleton-line short"></div></div>').join('');
  const results=await fetchSearch(query);
  if(!results||!results.length){grid.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-dim)">Could not load videos.</div>';return}
  grid.innerHTML='';results.forEach(v=>{const id=v.videoId;if(!id)return;
    const card=document.createElement('div');card.className='yt-result-card';
    card.innerHTML=`<div class="yt-result-thumb-wrap"><img class="yt-result-thumb" src="${v.thumb}" alt="" loading="lazy" onerror="this.src='https://i.ytimg.com/vi/${id}/mqdefault.jpg'"/><div class="yt-result-thumb-overlay"><div class="yt-result-play-btn"><i class="fa-solid fa-play" style="margin-left:3px"></i></div></div></div><div class="yt-result-info"><div class="yt-result-title">${escHtml(v.title)}</div><div class="yt-result-meta">${v.channel?'<span class="yt-result-channel">'+escHtml(v.channel)+'</span>':''}<span>${v.published||''}</span></div></div>`;
    card.addEventListener('click',()=>{document.getElementById('videoUrl').value='https://www.youtube.com/watch?v='+id;loadVideo();document.querySelector('.yt-primary')?.scrollIntoView({behavior:'smooth',block:'start'})});
    grid.appendChild(card)});
}

/* ── PWA ── */
let deferredPrompt=null;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;if(!localStorage.getItem('pwaDismissed'))document.getElementById('pwaBanner')?.classList.add('show')});
window.addEventListener('appinstalled',()=>{document.getElementById('pwaBanner')?.classList.remove('show');deferredPrompt=null});
async function installPWA(){if(deferredPrompt){deferredPrompt.prompt();const{outcome}=await deferredPrompt.userChoice;deferredPrompt=null;if(outcome==='accepted')document.getElementById('pwaBanner')?.classList.remove('show')}else{document.getElementById('pwaBanner')?.classList.remove('show')}}
window.installPWA=installPWA;
function dismissBanner(){document.getElementById('pwaBanner')?.classList.remove('show');localStorage.setItem('pwaDismissed','1')}
window.dismissBanner=dismissBanner;
if('serviceWorker'in navigator)window.addEventListener('load',async()=>{try{await navigator.serviceWorker.register('mktube-sw.js')}catch(e){}});

/* ═══════════════════════════════════════
   FULLSCREEN SHORTS — YouTube-style swipe
═══════════════════════════════════════ */
let shortsData=[],shortsIndex=0,shortsLoaded=false,shortsFeedEl=null,shortsLiked={};

async function openShortsPlayer(){
  document.getElementById('shortsOverlay').classList.add('open');document.body.style.overflow='hidden';
  shortsFeedEl=document.getElementById('shortsFeed');
  if(!shortsLoaded){await fetchShortsData();shortsLoaded=true}
  const hint=document.getElementById('shortsSwipeHint');if(hint){hint.style.animation='none';void hint.offsetWidth;hint.style.animation='hintFade 3s ease forwards'}
}
window.openShortsPlayer=openShortsPlayer;

function closeShortsPlayer(){
  document.getElementById('shortsOverlay').classList.remove('open');document.body.style.overflow='';
  document.querySelectorAll('#shortsFeed iframe').forEach(f=>{f.src=''});
}
window.closeShortsPlayer=closeShortsPlayer;

async function fetchShortsData(){
  shortsFeedEl.innerHTML='<div class="short-slide"><div class="short-loader"><div class="yt-spinner"></div></div></div>';
  const queries=['#shorts trending india','#shorts viral 2025','#shorts funny india','#shorts music 2025'];
  let all=[];for(const q of queries){const r=await fetchSearch(q);if(r)all=all.concat(r)}
  const seen=new Set();all=all.filter(v=>{if(!v.videoId||seen.has(v.videoId))return false;seen.add(v.videoId);return true});
  if(!all.length){shortsFeedEl.innerHTML='<div class="short-slide" style="display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.5)"><div>Could not load Shorts.</div></div>';return}
  shortsData=all;shortsIndex=0;shortsFeedEl.innerHTML='';
  all.forEach((v,i)=>buildShortSlide(v,i));activateSlide(0);
  shortsFeedEl.addEventListener('scroll',onShortsScroll,{passive:true});
}

let _scrollTimer=null;
function onShortsScroll(){clearTimeout(_scrollTimer);_scrollTimer=setTimeout(()=>{const h=shortsFeedEl.clientHeight;const idx=Math.round(shortsFeedEl.scrollTop/h);if(idx!==shortsIndex){shortsIndex=idx;activateSlide(shortsIndex)}},120)}

function buildShortSlide(v,i){
  const id=v.videoId,title=v.title||'Short',channel=v.channel||'Creator',initial=channel.charAt(0).toUpperCase();
  const slide=document.createElement('div');slide.className='short-slide';slide.dataset.index=i;slide.dataset.id=id;
  slide.innerHTML=`<div class="short-slide-top"></div><div class="short-loader" id="sl-loader-${i}"><div class="yt-spinner"></div></div><iframe id="sl-frame-${i}" src="" allow="autoplay; encrypted-media" allowfullscreen></iframe><div class="short-slide-bottom"></div><div class="short-info"><div class="short-info-channel"><div class="short-info-avatar">${escHtml(initial)}</div><div class="short-info-name">@${escHtml(channel)}</div></div><div class="short-info-title">${escHtml(title)}</div></div><div class="short-actions"><div class="short-action-btn" id="sl-like-${i}" onclick="toggleShortLike(${i})"><div class="short-action-icon"><i class="fa-solid fa-heart"></i></div><div class="short-action-label">Like</div></div><div class="short-action-btn" onclick="shareShort('${id}')"><div class="short-action-icon"><i class="fa-solid fa-share"></i></div><div class="short-action-label">Share</div></div><div class="short-action-btn" onclick="openInPlayer('${id}','${escHtml(title).replace(/'/g,"\\'")}')"><div class="short-action-icon"><i class="fa-solid fa-play"></i></div><div class="short-action-label">Play</div></div></div>`;
  shortsFeedEl.appendChild(slide);
}

function activateSlide(idx){
  const id=shortsData[idx]?.videoId;const frame=document.getElementById('sl-frame-'+idx);const loader=document.getElementById('sl-loader-'+idx);if(!frame||!id)return;
  if(!frame.src||frame.src===''||frame.src===window.location.href){frame.onload=()=>{loader?.classList.add('hidden')};frame.src='https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0&loop=1&playlist='+id+'&modestbranding=1&controls=1'}
  /* Pause other slides */
  shortsData.forEach((_,n)=>{if(n!==idx){const f=document.getElementById('sl-frame-'+n);if(f&&f.src&&f.src!=='')f.src=''}});
}

function shortsNext(){if(shortsIndex<shortsData.length-1){shortsIndex++;scrollToSlide(shortsIndex)}}
function shortsPrev(){if(shortsIndex>0){shortsIndex--;scrollToSlide(shortsIndex)}}
window.shortsNext=shortsNext;window.shortsPrev=shortsPrev;
function scrollToSlide(idx){shortsFeedEl.scrollTo({top:idx*shortsFeedEl.clientHeight,behavior:'smooth'});activateSlide(idx)}

function toggleShortLike(idx){const btn=document.getElementById('sl-like-'+idx);if(!btn)return;shortsLiked[idx]=!shortsLiked[idx];btn.classList.toggle('liked',shortsLiked[idx])}
window.toggleShortLike=toggleShortLike;
function shareShort(id){const url='https://www.youtube.com/shorts/'+id;if(navigator.share)navigator.share({title:'Watch this Short!',url});else navigator.clipboard?.writeText(url).then(()=>alert('Link copied!'))}
window.shareShort=shareShort;
function openInPlayer(id,title){closeShortsPlayer();document.getElementById('videoUrl').value='https://www.youtube.com/shorts/'+id;loadVideo();document.querySelector('.yt-primary')?.scrollIntoView({behavior:'smooth',block:'start'})}
window.openInPlayer=openInPlayer;

/* Keyboard shortcuts */
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&document.getElementById('shortsOverlay')?.classList.contains('open'))closeShortsPlayer();
  if(document.getElementById('shortsOverlay')?.classList.contains('open')){if(e.key==='ArrowDown')shortsNext();if(e.key==='ArrowUp')shortsPrev()}
});
