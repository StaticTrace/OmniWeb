import { showToast } from './toast.js';

const LISTS = {
  adj:    ['Swift','Dark','Neon','Ghost','Cyber','Pixel','Void','Iron','Storm','Shadow','Frost','Blaze','Lunar','Solar','Quantum','Nexus','Echo','Ember','Nova','Flux','Hyper','Onyx','Prism','Rogue','Stealth','Vector','Zenith','Apex','Cipher','Delta'],
  noun:   ['Fox','Wolf','Eagle','Tiger','Raven','Cobra','Hawk','Lynx','Viper','Phoenix','Dragon','Falcon','Cipher','Vector','Pulse','Core','Node','Byte','Grid','Wave','Orbit','Comet','Quasar','Ranger','Specter','Titan','Nexus','Rift','Surge','Blaze'],
  first:  ['Alex','Blake','Casey','Dana','Ellis','Finn','Gray','Hunter','Indie','Jace','Kai','Logan','Morgan','Noel','Owen','Quinn','Reese','Sage','Taylor','Uma','Vale','West','Xen','Yael','Zara','Ash','Brook','Cole','Drew','Eden'],
  last:   ['Stone','Cross','Wells','Blake','Frost','Hayes','Knox','Lane','Nash','Park','Quinn','Reed','Shaw','Troy','Vance','Wade','York','Zane','Adler','Crane','Drake','Ellis','Ford','Grant','Hale','Lark','Marsh','Nolan','Pierce','Rowe'],
  codeA:  ['Operation','Project','Mission','Protocol','Directive','Initiative','Sequence','Vector'],
  codeN:  ['Midnight','Ironclad','Starfall','Vortex','Eclipse','Phantom','Thunderstrike','Cobalt','Neon','Obsidian'],
};

const pick = arr => arr[Math.floor(Math.random() * arr.length)];

const GENERATORS = {
  username: () => `${pick(LISTS.adj)}${pick(LISTS.noun)}${Math.floor(Math.random() * 90) + 10}`,
  fullname: () => `${pick(LISTS.first)} ${pick(LISTS.last)}`,
  codename: () => `${pick(LISTS.codeA)} ${pick(LISTS.codeN)}`,
};

const history = [];

window.generateName = function () {
  const mode   = document.querySelector('input[name="namegen-mode"]:checked')?.value || 'username';
  const result = (GENERATORS[mode] || GENERATORS.username)();

  const resultEl = document.getElementById('namegen-result');
  if (resultEl) resultEl.textContent = result;

  history.unshift(result);
  if (history.length > 5) history.pop();

  const histEl = document.getElementById('namegen-history');
  if (histEl && history.length > 1) {
    histEl.innerHTML =
      `<p style="font-size:0.78rem;color:var(--muted);margin-bottom:6px;">Recent</p>` +
      history.slice(1).map(n =>
        `<span style="display:inline-block;font-size:0.82rem;color:var(--muted);margin-right:10px;cursor:pointer;"
          onclick="document.getElementById('namegen-result').textContent='${n}'">${n}</span>`
      ).join('');
  }
};

window.copyName = function () {
  const text = document.getElementById('namegen-result')?.textContent;
  if (!text || text === 'Hit Generate ↓') return;
  navigator.clipboard.writeText(text).then(() => showToast('Name copied!'));
};
