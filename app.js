import { db, isFirebaseInitialized, doc, setDoc, onSnapshot } from './firebase-config.js';

const STORAGE_KEY = 'retroshift_youtube_tracker_multichannel_v1';
const CHANNELS_STORAGE_KEY = 'retroshift_youtube_channels_v1';
const ACTIVE_CHANNEL_KEY = 'retroshift_youtube_active_channel_v1';
const FIRESTORE_DOC_ID = 'youtube_video_takip';

const DEFAULT_CHANNELS = [
  { id: 'ch_retroshift', name: 'Retro Shift', defaultTime: '19:00' },
  { id: 'ch_kanal2', name: '2. Kanalım', defaultTime: '20:00' }
];

const INITIAL_VIDEOS = [
  { number: 1, yearEra: '1975 NYC Cab Driver', title: 'What If You Were a 1970s NYC Cab Driver?', script: true, elevenlabs: true, music: true, capcut: true, youtubeUpload: true, publishStatus: 'published' },
  { number: 2, yearEra: '1968 Detroit Auto', title: 'What Was a 1968 Detroit Auto Shift Really Like?', script: true, elevenlabs: true, music: true, capcut: true, youtubeUpload: true, publishStatus: 'published' },
  { number: 3, yearEra: '1985 Wall Street', title: 'What If You Were a 1980s Wall Street Junior Broker?', script: true, elevenlabs: true, music: true, capcut: false, youtubeUpload: false, publishStatus: 'draft' },
  { number: 4, yearEra: '1718 Pirate Ship', title: 'What Was It ACTUALLY Like on an 18th-Century Pirate Ship?', script: true, elevenlabs: false, music: false, capcut: false, youtubeUpload: false, publishStatus: 'draft' },
  { number: 5, yearEra: '1665 Plague Doctor', title: 'What If You Were a 1665 London Plague Doctor?', script: true, elevenlabs: false, music: false, capcut: false, youtubeUpload: false, publishStatus: 'draft' },
  { number: 6, yearEra: '1912 Titanic Stoker', title: 'What If You Were a Titanic Boiler Room Stoker?', script: true, elevenlabs: false, music: false, capcut: false, youtubeUpload: false, publishStatus: 'draft' },
  { number: 7, yearEra: '1888 Jack the Ripper', title: 'What If You Were a Jack the Ripper Beat Cop in Whitechapel?', script: true, elevenlabs: false, music: false, capcut: false, youtubeUpload: false, publishStatus: 'draft' },
  { number: 8, yearEra: '1876 Deadwood Saloon', title: 'What If You Were a Saloon Bartender in Deadwood?', script: true, elevenlabs: false, music: false, capcut: false, youtubeUpload: false, publishStatus: 'draft' },
  { number: 9, yearEra: '80 AD Roman Gladiator', title: 'What If You Were a Roman Gladiator in the Colosseum?', script: true, elevenlabs: false, music: false, capcut: false, youtubeUpload: false, publishStatus: 'draft' },
  { number: 10, yearEra: '1605 Edo Samurai', title: 'What If You Were a Night Watchman in Samurai Edo?', script: true, elevenlabs: false, music: false, capcut: false, youtubeUpload: false, publishStatus: 'draft' },
  { number: 11, yearEra: '1849 California Gold Rush', title: 'What If You Were a Forty-Niner in the California Gold Rush?', script: true, elevenlabs: false, music: false, capcut: false, youtubeUpload: false, publishStatus: 'draft' },
  { number: 12, yearEra: '1845 Nantucket Whaleship', title: 'What Was It ACTUALLY Like on a 19th-Century Whaling Ship?', script: true, elevenlabs: false, music: false, capcut: false, youtubeUpload: false, publishStatus: 'draft' },
  { number: 13, yearEra: '1986 Chernobyl Control Room', title: 'What If You Were in the Chernobyl Control Room on April 26, 1986?', script: true, elevenlabs: false, music: false, capcut: false, youtubeUpload: false, publishStatus: 'draft' },
  { number: 14, yearEra: '1793 French Revolution', title: "What Was It Like as the Executioner's Assistant at the Guillotine?", script: true, elevenlabs: false, music: false, capcut: false, youtubeUpload: false, publishStatus: 'draft' },
  { number: 15, yearEra: '1916 Somme Trench Runner', title: 'What If You Were a Trench Runner in World War I?', script: true, elevenlabs: false, music: false, capcut: false, youtubeUpload: false, publishStatus: 'draft' },
  { number: 16, yearEra: '1931 Empire State Riveter', title: 'What Was a Day as an Empire State Building "Sky Boy" Riveter?', script: true, elevenlabs: false, music: false, capcut: false, youtubeUpload: false, publishStatus: 'draft' },
  { number: 17, yearEra: '1928 Chicago Speakeasy', title: 'What Was a Shift as an Al Capone Speakeasy Bartender?', script: true, elevenlabs: false, music: false, capcut: false, youtubeUpload: false, publishStatus: 'draft' },
  { number: 18, yearEra: '1944 Normandy D-Day Pilot', title: 'What Was It Like in the Cockpit of a D-Day C-47 Paratrooper Drop?', script: true, elevenlabs: false, music: false, capcut: false, youtubeUpload: false, publishStatus: 'draft' },
  { number: 19, yearEra: '1978 South Bronx Firefighter', title: 'What Was a 1970s South Bronx Firefighter Shift?', script: true, elevenlabs: false, music: false, capcut: false, youtubeUpload: false, publishStatus: 'draft' },
  { number: 20, yearEra: '1510 Venetian Galley Oarsman', title: 'What It Was Like as a Venetian Galley Oarsman', script: true, elevenlabs: false, music: false, capcut: false, youtubeUpload: false, publishStatus: 'draft' },
  { number: 21, yearEra: '1943 German U-Boat', title: 'What Was Life Like Inside a WWII German U-Boat?', script: true, elevenlabs: false, music: false, capcut: false, youtubeUpload: false, publishStatus: 'draft' },
  { number: 22, yearEra: '1883 Brooklyn Bridge Caisson', title: 'What Was It Like Building the Brooklyn Bridge Caissons?', script: true, elevenlabs: false, music: false, capcut: false, youtubeUpload: false, publishStatus: 'draft' },
  { number: 23, yearEra: '1869 Nitroglycerin Blaster', title: 'What Was a Day as a Nitroglycerin Blaster on the Railroad?', script: true, elevenlabs: false, music: false, capcut: false, youtubeUpload: false, publishStatus: 'draft' },
  { number: 24, yearEra: '1977 NYC Blackout Patrol', title: 'What If You Were an NYPD Officer During the 1977 Blackout?', script: true, elevenlabs: false, music: false, capcut: false, youtubeUpload: false, publishStatus: 'draft' },
  { number: 25, yearEra: '1906 SF Earthquake', title: "What Was a Firefighter's Shift During the 1906 Earthquake?", script: true, elevenlabs: false, music: false, capcut: false, youtubeUpload: false, publishStatus: 'draft' },
  { number: 26, yearEra: '1969 Apollo 11 Mission Control', title: 'What If You Were in NASA Mission Control During Apollo 11?', script: true, elevenlabs: false, music: false, capcut: false, youtubeUpload: false, publishStatus: 'draft' },
  { number: 27, yearEra: '1991 Kuwait Oil Fires', title: 'What Was It Like Putting Out 600 Blazing Kuwait Oil Wells?', script: true, elevenlabs: false, music: false, capcut: false, youtubeUpload: false, publishStatus: 'draft' },
  { number: 28, yearEra: '1898 Klondike Gold Rush', title: 'What Was It Like Digging Frozen Gravel in the Klondike?', script: true, elevenlabs: false, music: false, capcut: false, youtubeUpload: false, publishStatus: 'draft' },
  { number: 29, yearEra: '1942 Stalingrad Factory', title: 'What If You Fought Inside the Stalingrad Tractor Factory?', script: true, elevenlabs: false, music: false, capcut: false, youtubeUpload: false, publishStatus: 'draft' },
  { number: 30, yearEra: '1962 Alcatraz Escape', title: 'What If You Were on the 1962 Alcatraz Midnight Escape Raft?', script: true, elevenlabs: false, music: false, capcut: false, youtubeUpload: false, publishStatus: 'draft' }
];

let channels = [];
let activeChannelId = 'ch_retroshift'; // 'all' veya kanal id
let videos = [];
let currentFilter = 'all';
let searchQuery = '';

function formatYMD(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function setCloudBadge(text, stateClass) {
  const badge = document.getElementById('cloudStatusBadge');
  if (!badge) return;
  badge.textContent = text;
  badge.className = 'cloud-badge ' + (stateClass || '');
}

function getActiveChannelObj() {
  return channels.find(c => c.id === activeChannelId) || channels[0] || { id: 'ch_retroshift', name: 'Retro Shift', defaultTime: '19:00' };
}

function getChannelName(channelId) {
  const ch = channels.find(c => c.id === channelId);
  return ch ? ch.name : 'Retro Shift';
}

function ensureVideoChannels() {
  const firstChannelId = (channels[0] && channels[0].id) || 'ch_retroshift';
  videos.forEach(v => {
    if (!v.channelId) v.channelId = firstChannelId;
  });
}

function loadState() {
  const savedChannels = localStorage.getItem(CHANNELS_STORAGE_KEY);
  if (savedChannels) {
    try {
      channels = JSON.parse(savedChannels);
    } catch (e) {}
  }
  if (!Array.isArray(channels) || channels.length === 0) {
    channels = [...DEFAULT_CHANNELS];
    localStorage.setItem(CHANNELS_STORAGE_KEY, JSON.stringify(channels));
  }

  const savedActive = localStorage.getItem(ACTIVE_CHANNEL_KEY);
  if (savedActive && (savedActive === 'all' || channels.some(c => c.id === savedActive))) {
    activeChannelId = savedActive;
  } else {
    activeChannelId = channels[0].id;
  }

  const savedVideos = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('retroshift_youtube_tracker_1perday_v1');
  if (savedVideos) {
    try {
      videos = JSON.parse(savedVideos);
    } catch (e) {}
  }

  if (!videos || videos.length === 0) {
    const base = new Date();
    videos = INITIAL_VIDEOS.map((v, i) => {
      const d = new Date(base);
      d.setDate(d.getDate() + i);
      return {
        id: 'v_' + v.number,
        channelId: 'ch_retroshift',
        number: v.number,
        yearEra: v.yearEra,
        title: v.title,
        script: v.script,
        elevenlabs: v.elevenlabs,
        music: v.music,
        capcut: v.capcut,
        youtubeUpload: v.youtubeUpload,
        publishDate: formatYMD(d),
        publishTime: '19:00',
        publishStatus: v.publishStatus,
        notes: ''
      };
    });
  }

  ensureVideoChannels();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
  syncDefaultTimeInput();
}

function syncDefaultTimeInput() {
  const timeInput = document.getElementById('defaultTimeInput');
  if (!timeInput) return;
  const ch = getActiveChannelObj();
  timeInput.value = ch.defaultTime || '19:00';
}

async function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
  localStorage.setItem(CHANNELS_STORAGE_KEY, JSON.stringify(channels));
  localStorage.setItem(ACTIVE_CHANNEL_KEY, activeChannelId);

  if (isFirebaseInitialized && db) {
    try {
      setCloudBadge('☁️ Kaydediliyor...', 'saving');
      const docRef = doc(db, 'sync_data', FIRESTORE_DOC_ID);
      await setDoc(docRef, {
        channels,
        videos,
        updatedAt: new Date().toISOString()
      });
      setCloudBadge('☁️ Bulut Aktif 🟢', 'online');
    } catch (err) {
      console.error('Firestore kayıt hatası:', err);
      setCloudBadge('⚠️ Yerel Kayıt (Bulut Hatası)', '');
    }
  }
}

function initFirebaseRealtimeSync() {
  if (!isFirebaseInitialized || !db) {
    setCloudBadge('💾 Sadece Yerel Hafıza', '');
    return;
  }

  const docRef = doc(db, 'sync_data', FIRESTORE_DOC_ID);
  onSnapshot(
    docRef,
    snap => {
      if (snap.exists()) {
        const data = snap.data();
        let changed = false;

        if (data && Array.isArray(data.channels) && data.channels.length > 0) {
          if (JSON.stringify(data.channels) !== JSON.stringify(channels)) {
            channels = data.channels;
            localStorage.setItem(CHANNELS_STORAGE_KEY, JSON.stringify(channels));
            changed = true;
          }
        }

        if (data && Array.isArray(data.videos) && data.videos.length > 0) {
          if (JSON.stringify(data.videos) !== JSON.stringify(videos)) {
            videos = data.videos;
            ensureVideoChannels();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
            changed = true;
          }
        }

        if (changed) {
          if (activeChannelId !== 'all' && !channels.some(c => c.id === activeChannelId)) {
            activeChannelId = channels[0].id;
          }
          syncDefaultTimeInput();
          renderAll();
        }
        setCloudBadge('☁️ Bulut Aktif 🟢', 'online');
      } else {
        saveState();
      }
    },
    err => {
      console.error('Firestore dinleme hatası:', err);
      setCloudBadge('💾 Yerel Hafıza Aktif', '');
    }
  );
}

function getChannelVideos() {
  if (activeChannelId === 'all') return videos;
  return videos.filter(v => v.channelId === activeChannelId);
}

function isRowDone(v) {
  return v.script && v.elevenlabs && v.music && v.capcut && v.youtubeUpload;
}

function renderChannelBar() {
  const container = document.getElementById('channelTabs');
  const editBtn = document.getElementById('editChannelBtn');

  const tabsHtml = channels.map(ch => {
    const count = videos.filter(v => v.channelId === ch.id).length;
    const isActive = activeChannelId === ch.id;
    return `
      <button type="button" class="channel-tab ${isActive ? 'active' : ''}" onclick="selectChannel('${ch.id}')">
        <span>📺 ${escapeHtml(ch.name)}</span>
        <span class="channel-count">${count}</span>
      </button>
    `;
  }).join('');

  const allTabHtml = `
    <button type="button" class="channel-tab ${activeChannelId === 'all' ? 'active' : ''}" onclick="selectChannel('all')">
      <span>🌐 Tüm Kanallar</span>
      <span class="channel-count">${videos.length}</span>
    </button>
  `;

  container.innerHTML = tabsHtml + allTabHtml;
  if (editBtn) {
    editBtn.style.display = activeChannelId === 'all' ? 'none' : 'inline-flex';
  }
}

window.selectChannel = function(channelId) {
  activeChannelId = channelId;
  localStorage.setItem(ACTIVE_CHANNEL_KEY, activeChannelId);
  syncDefaultTimeInput();
  renderAll();
};

function renderSummary() {
  const list = getChannelVideos();
  const total = list.length;
  const eleven = list.filter(v => v.elevenlabs).length;
  const music = list.filter(v => v.music).length;
  const capcut = list.filter(v => v.capcut).length;
  const uploaded = list.filter(v => v.youtubeUpload).length;

  document.getElementById('summaryBar').innerHTML = `
    <div class="sum-box">
      <span class="sum-label">🎬 Kanal Video Sayısı</span>
      <span class="sum-val">${total}</span>
    </div>
    <div class="sum-box">
      <span class="sum-label">🎙️ ElevenLabs Hazır</span>
      <span class="sum-val" style="color:${eleven === total && total > 0 ? '#34d399' : '#fbbf24'}">${eleven} / ${total}</span>
    </div>
    <div class="sum-box">
      <span class="sum-label">🎵 Müzik İndirilen</span>
      <span class="sum-val" style="color:${music === total && total > 0 ? '#34d399' : '#fbbf24'}">${music} / ${total}</span>
    </div>
    <div class="sum-box">
      <span class="sum-label">✂️ CapCut Biten</span>
      <span class="sum-val" style="color:${capcut === total && total > 0 ? '#34d399' : '#fbbf24'}">${capcut} / ${total}</span>
    </div>
    <div class="sum-box">
      <span class="sum-label">📤 YT Yüklenen (Stok)</span>
      <span class="sum-val" style="color:#60a5fa">${uploaded} <small style="font-size:0.75rem; font-weight:500; color:#94a3b8;">(${uploaded} Günlük)</small></span>
    </div>
  `;
}

function renderTable() {
  const tbody = document.getElementById('tableBody');
  const baseList = getChannelVideos();

  const filtered = baseList
    .filter(v => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!`${v.number} ${v.title} ${v.yearEra} ${v.notes} ${getChannelName(v.channelId)}`.toLowerCase().includes(q)) return false;
      }
      if (currentFilter === 'incomplete') return !isRowDone(v);
      if (currentFilter === 'missing_elevenlabs') return !v.elevenlabs;
      if (currentFilter === 'missing_music') return !v.music;
      if (currentFilter === 'missing_capcut') return !v.capcut;
      if (currentFilter === 'missing_upload') return !v.youtubeUpload;
      if (currentFilter === 'done') return isRowDone(v);
      return true;
    })
    .sort((a, b) => a.number - b.number);

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="10" style="text-align:center; padding:32px; color:#94a3b8;">
          Bu kanalda veya filtrede henüz video yok. Sağ üstteki <strong>"+ Yeni Video"</strong> butonundan ekleyebilirsiniz.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(v => {
    const done = isRowDone(v);
    const showChannelBadge = activeChannelId === 'all';
    return `
      <tr class="${done ? 'row-done' : ''}">
        <td class="col-no">#${v.number}</td>
        <td class="col-title">
          <div class="video-main-title">${escapeHtml(v.title)}</div>
          <div class="video-sub-info">
            ${showChannelBadge ? `<span class="channel-inline-badge">📺 ${escapeHtml(getChannelName(v.channelId))}</span>` : ''}
            <span>📁 ${escapeHtml(v.yearEra)}</span>
            ${v.notes ? `<span class="note-inline">📌 ${escapeHtml(v.notes)}</span>` : ''}
          </div>
        </td>
        <td class="col-check">${renderCheckBtn(v.id, 'script', v.script)}</td>
        <td class="col-check">${renderCheckBtn(v.id, 'elevenlabs', v.elevenlabs)}</td>
        <td class="col-check">${renderCheckBtn(v.id, 'music', v.music)}</td>
        <td class="col-check">${renderCheckBtn(v.id, 'capcut', v.capcut)}</td>
        <td class="col-check">${renderCheckBtn(v.id, 'youtubeUpload', v.youtubeUpload)}</td>
        <td class="col-date">
          <div class="date-inline-wrap">
            <input type="date" class="inline-input" value="${v.publishDate || ''}" onchange="updateField('${v.id}', 'publishDate', this.value)" />
            <input type="time" class="inline-input" value="${v.publishTime || ''}" onchange="updateField('${v.id}', 'publishTime', this.value)" />
          </div>
        </td>
        <td class="col-status">
          <select class="status-select st-${v.publishStatus}" onchange="updateField('${v.id}', 'publishStatus', this.value)">
            <option value="draft" ${v.publishStatus === 'draft' ? 'selected' : ''}>⏳ Hazırlanıyor</option>
            <option value="scheduled" ${v.publishStatus === 'scheduled' ? 'selected' : ''}>⏰ Planlandı</option>
            <option value="published" ${v.publishStatus === 'published' ? 'selected' : ''}>🟢 Yayında</option>
          </select>
        </td>
        <td class="col-action">
          <button class="edit-icon-btn" onclick="openModal('${v.id}')" title="Düzenle / Not Ekle">✏️</button>
        </td>
      </tr>
    `;
  }).join('');
}

function renderCheckBtn(id, key, val) {
  return `
    <button type="button" class="check-btn ${val ? 'done' : ''}" onclick="toggleCheck('${id}', '${key}')">
      ${val ? '✅ Tamam' : '⬜ Bekliyor'}
    </button>
  `;
}

window.toggleCheck = function(id, key) {
  const v = videos.find(x => x.id === id);
  if (!v) return;
  v[key] = !v[key];
  if (key === 'youtubeUpload' && v.youtubeUpload && v.publishStatus === 'draft') {
    v.publishStatus = 'scheduled';
  }
  renderAll();
  saveState();
};

window.updateField = function(id, field, val) {
  const v = videos.find(x => x.id === id);
  if (!v) return;
  v[field] = val;
  if (field === 'publishStatus' && (val === 'scheduled' || val === 'published')) {
    v.youtubeUpload = true;
  }
  renderAll();
  saveState();
};

function populateChannelSelect(selectedId) {
  const sel = document.getElementById('formChannelId');
  sel.innerHTML = channels.map(ch => `
    <option value="${ch.id}" ${ch.id === selectedId ? 'selected' : ''}>📺 ${escapeHtml(ch.name)}</option>
  `).join('');
}

window.openModal = function(id) {
  const modal = document.getElementById('videoModal');
  const delBtn = document.getElementById('deleteVideoBtn');
  const targetChId = activeChannelId === 'all' ? channels[0].id : activeChannelId;
  const chObj = channels.find(c => c.id === targetChId) || channels[0];

  if (!id) {
    const chVids = videos.filter(v => v.channelId === targetChId);
    const nextNo = chVids.length ? Math.max(...chVids.map(v => v.number)) + 1 : 1;
    document.getElementById('modalTitle').textContent = 'Yeni Video Ekle';
    document.getElementById('formVideoId').value = '';
    populateChannelSelect(targetChId);
    document.getElementById('formVideoNumber').value = nextNo;
    document.getElementById('formYearEra').value = '';
    document.getElementById('formTitle').value = '';
    document.getElementById('formPublishDate').value = formatYMD(new Date());
    document.getElementById('formPublishTime').value = chObj.defaultTime || '19:00';
    document.getElementById('formNotes').value = '';
    delBtn.style.display = 'none';
  } else {
    const v = videos.find(x => x.id === id);
    if (!v) return;
    document.getElementById('modalTitle').textContent = `Video #${v.number} Düzenle`;
    document.getElementById('formVideoId').value = v.id;
    populateChannelSelect(v.channelId || targetChId);
    document.getElementById('formVideoNumber').value = v.number;
    document.getElementById('formYearEra').value = v.yearEra || '';
    document.getElementById('formTitle').value = v.title || '';
    document.getElementById('formPublishDate').value = v.publishDate || '';
    document.getElementById('formPublishTime').value = v.publishTime || '19:00';
    document.getElementById('formNotes').value = v.notes || '';
    delBtn.style.display = 'inline-flex';
  }
  modal.classList.remove('hidden');
};

function closeModal() {
  document.getElementById('videoModal').classList.add('hidden');
}

function openChannelModal(isEdit) {
  const modal = document.getElementById('channelModal');
  const delBtn = document.getElementById('deleteChannelBtn');
  if (isEdit && activeChannelId !== 'all') {
    const ch = getActiveChannelObj();
    document.getElementById('channelModalTitle').textContent = 'Kanalı Düzenle';
    document.getElementById('channelFormId').value = ch.id;
    document.getElementById('channelFormName').value = ch.name;
    document.getElementById('channelFormTime').value = ch.defaultTime || '19:00';
    delBtn.style.display = channels.length > 1 ? 'inline-flex' : 'none';
  } else {
    document.getElementById('channelModalTitle').textContent = 'Yeni Kanal Ekle';
    document.getElementById('channelFormId').value = '';
    document.getElementById('channelFormName').value = '';
    document.getElementById('channelFormTime').value = '19:00';
    delBtn.style.display = 'none';
  }
  modal.classList.remove('hidden');
}

function closeChannelModal() {
  document.getElementById('channelModal').classList.add('hidden');
}

function escapeHtml(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderAll() {
  renderChannelBar();
  renderSummary();
  renderTable();
}

document.addEventListener('DOMContentLoaded', () => {
  loadState();
  renderAll();
  initFirebaseRealtimeSync();

  document.querySelectorAll('#filterPills .pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#filterPills .pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      renderTable();
    });
  });

  document.getElementById('searchInput').addEventListener('input', e => {
    searchQuery = e.target.value.trim();
    renderTable();
  });

  document.getElementById('defaultTimeInput').addEventListener('change', e => {
    const val = e.target.value || '19:00';
    const ch = getActiveChannelObj();
    if (ch) ch.defaultTime = val;
    saveState();
  });

  document.getElementById('autoScheduleBtn').addEventListener('click', () => {
    const ch = getActiveChannelObj();
    const targetTime = (ch && ch.defaultTime) || document.getElementById('defaultTimeInput').value || '19:00';
    const targetList = getChannelVideos().sort((a, b) => a.number - b.number);
    const start = new Date();
    targetList.forEach((v, idx) => {
      const d = new Date(start);
      d.setDate(d.getDate() + idx);
      v.publishDate = formatYMD(d);
      v.publishTime = targetTime;
    });
    renderAll();
    saveState();
  });

  // Video Modal Events
  document.getElementById('addVideoBtn').addEventListener('click', () => openModal(null));
  document.getElementById('closeModalBtn').addEventListener('click', closeModal);
  document.getElementById('cancelModalBtn').addEventListener('click', closeModal);

  document.getElementById('videoForm').addEventListener('submit', e => {
    e.preventDefault();
    const id = document.getElementById('formVideoId').value;
    const channelId = document.getElementById('formChannelId').value;
    const number = Number(document.getElementById('formVideoNumber').value) || 1;
    const yearEra = document.getElementById('formYearEra').value.trim();
    const title = document.getElementById('formTitle').value.trim();
    const publishDate = document.getElementById('formPublishDate').value;
    const publishTime = document.getElementById('formPublishTime').value;
    const notes = document.getElementById('formNotes').value.trim();

    if (id) {
      const v = videos.find(x => x.id === id);
      if (v) Object.assign(v, { channelId, number, yearEra, title, publishDate, publishTime, notes });
    } else {
      videos.push({
        id: 'v_' + Date.now(),
        channelId,
        number,
        yearEra,
        title,
        script: false,
        elevenlabs: false,
        music: false,
        capcut: false,
        youtubeUpload: false,
        publishDate,
        publishTime,
        publishStatus: 'draft',
        notes
      });
    }
    closeModal();
    renderAll();
    saveState();
  });

  document.getElementById('deleteVideoBtn').addEventListener('click', () => {
    const id = document.getElementById('formVideoId').value;
    videos = videos.filter(x => x.id !== id);
    closeModal();
    renderAll();
    saveState();
  });

  // Channel Modal Events
  document.getElementById('addChannelBtn').addEventListener('click', () => openChannelModal(false));
  document.getElementById('editChannelBtn').addEventListener('click', () => openChannelModal(true));
  document.getElementById('closeChannelModalBtn').addEventListener('click', closeChannelModal);
  document.getElementById('cancelChannelModalBtn').addEventListener('click', closeChannelModal);

  document.getElementById('channelForm').addEventListener('submit', e => {
    e.preventDefault();
    const id = document.getElementById('channelFormId').value;
    const name = document.getElementById('channelFormName').value.trim();
    const defaultTime = document.getElementById('channelFormTime').value || '19:00';
    if (!name) return;

    if (id) {
      const ch = channels.find(c => c.id === id);
      if (ch) {
        ch.name = name;
        ch.defaultTime = defaultTime;
      }
    } else {
      const newId = 'ch_' + Date.now();
      channels.push({ id: newId, name, defaultTime });
      activeChannelId = newId;
    }
    syncDefaultTimeInput();
    closeChannelModal();
    renderAll();
    saveState();
  });

  document.getElementById('deleteChannelBtn').addEventListener('click', () => {
    const id = document.getElementById('channelFormId').value;
    if (!id || channels.length <= 1) return;
    channels = channels.filter(c => c.id !== id);
    videos = videos.filter(v => v.channelId !== id);
    activeChannelId = channels[0].id;
    syncDefaultTimeInput();
    closeChannelModal();
    renderAll();
    saveState();
  });

  // Export & Import
  document.getElementById('exportBtn').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify({ channels, videos }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `youtube-takip-${formatYMD(new Date())}.json`;
    a.click();
  });

  document.getElementById('importInput').addEventListener('change', e => {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = ev => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (Array.isArray(parsed)) {
          videos = parsed;
          ensureVideoChannels();
        } else if (parsed && Array.isArray(parsed.videos)) {
          if (Array.isArray(parsed.channels) && parsed.channels.length > 0) {
            channels = parsed.channels;
          }
          videos = parsed.videos;
          ensureVideoChannels();
        }
        renderAll();
        saveState();
      } catch (err) {}
    };
    r.readAsText(f);
  });
});
