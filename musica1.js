const audio = document.querySelector('#audio');
const button = document.querySelector('.toggle-play');
const statusText = document.querySelector('#music-status');
const progress = document.querySelector('#progress');
const track = (window.GIL_PLAYLIST || [])[0];
audio.volume = .5;
const time = value => `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, '0')}`;
function syncPlayer() {
  const playing = !audio.paused && !audio.ended;
  document.querySelector('.music').classList.toggle('is-playing', playing);
  button.setAttribute('aria-pressed', String(playing));
  button.setAttribute('aria-label', playing ? 'Pausar música' : 'Reproduzir música');
  statusText.textContent = playing ? 'Tocando agora · no meu ritmo' : 'Clique em qualquer lugar para ouvir';
}
button.disabled = !track;
if (track) { audio.src = track.src; document.querySelector('#track-title').textContent = track.title || track.name.replace(/\.mp3$/i, ''); }
else { statusText.textContent = 'Nenhuma música disponível.'; }
button.addEventListener('click', async () => {
  if (!audio.paused) { audio.pause(); return; }
  try { await audio.play(); } catch { statusText.textContent = 'Não foi possível reproduzir a música.'; }
});
async function startOnFirstClick(event) {
  // O botão já controla play/pause; evita duas ações no mesmo clique.
  if (!event.isTrusted || !track || event.target.closest('.toggle-play')) return;
  try { await audio.play(); }
  catch { statusText.textContent = 'Não foi possível reproduzir a música. Tente o play.'; }
}
document.addEventListener('click', startOnFirstClick);
// Após começar, cliques comuns não retomam uma música pausada pelo usuário.
audio.addEventListener('play', () => document.removeEventListener('click', startOnFirstClick), { once: true });
['play', 'pause', 'ended'].forEach(event => audio.addEventListener(event, syncPlayer));
audio.addEventListener('loadedmetadata', () => {
  if (Number.isFinite(audio.duration) && audio.duration > 0) { document.querySelector('#duration').textContent = time(audio.duration); progress.disabled = false; }
});
audio.addEventListener('timeupdate', () => {
  document.querySelector('#current-time').textContent = time(audio.currentTime);
  progress.value = audio.duration ? audio.currentTime / audio.duration * 100 : 0;
});
progress.addEventListener('input', () => { if (Number.isFinite(audio.duration)) audio.currentTime = Number(progress.value) / 100 * audio.duration; });
audio.addEventListener('error', () => { syncPlayer(); statusText.textContent = 'Arquivo de música indisponível.'; });
let toastTimer;
document.querySelector('.copy-id').addEventListener('click', async () => {
  const toast = document.querySelector('.toast');
  try { await navigator.clipboard.writeText('iGil'); toast.textContent = 'Regname iGil copiado'; }
  catch { toast.textContent = 'Regname: iGil'; }
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 2600);
});
const stars = document.querySelector('.stars');
for (let i = 0; i < 110; i++) {
  const star = document.createElement('span');
  star.className = 'star';
  star.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;--size:${1+Math.random()*1.4}px;--speed:${3+Math.random()*5}s;--delay:-${Math.random()*8}s`;
  stars.appendChild(star);
}




