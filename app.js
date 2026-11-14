import { db, isFirebaseInitialized, doc, setDoc, onSnapshot } from './firebase-config.js';

const STORAGE_KEY = 'retroshift_youtube_tracker_1perday_v1';
const TIME_STORAGE_KEY = 'retroshift_youtube_default_time_v1';
const FIRESTORE_DOC_ID = 'youtube_video_takip';

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

let videos = [];
let currentFilter = 'all';
let searchQuery = '';
let defaultPublishTime = '19:00';

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

function loadState() {
  const savedTime = localStorage.getItem(TIME_STORAGE_KEY);
  if (savedTime) defaultPublishTime = savedTime;
  const timeInput = document.getElementById('defaultTimeInput');
  if (timeInput) timeInput.value = defaultPublishTime;

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      videos = JSON.parse(saved);
    } catch (e) {}
  }

  if (!videos || videos.length === 0) {
    const base = new Date();
    videos = INITIAL_VIDEOS.map((v, i) => {
      const d = new Date(base);
      d.setDate(d.getDate() + i);
      return {
        id: 'v_' + v.number,
        number: v.number,
        yearEra: v.yearEra,
        title: v.title,
        script: v.script,
        elevenlabs: v.elevenlabs,
        music: v.music,
        capcut: v.capcut,
        youtubeUpload: v.youtubeUpload,
        publishDate: formatYMD(d),
        publishTime: defaultPublishTime,
        publishStatus: v.publishStatus,
        notes: ''
      };
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
  }
}

async function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
  localStorage.setItem(TIME_STORAGE_KEY, defaultPublishTime);

  if (isFirebaseInitialized && db) {
    try {
      setCloudBadge('☁️ Kaydediliyor...', 'saving');
      const docRef = doc(db, 'sync_data', FIRESTORE_DOC_ID);
      await setDoc(docRef, {
        videos,
        defaultPublishTime,
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
        if (data && Array.isArray(data.videos) && data.videos.length > 0) {
          const incomingStr = JSON.stringify(data.videos);
          const localStr = JSON.stringify(videos);
          if (incomingStr !== localStr) {
            videos = data.videos;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
          }
          if (data.defaultPublishTime) {
            defaultPublishTime = data.defaultPublishTime;
            localStorage.setItem(TIME_STORAGE_KEY, defaultPublishTime);
            const timeInput = document.getElementById('defaultTimeInput');
            if (timeInput) timeInput.value = defaultPublishTime;
          }
          renderAll();
        }
        setCloudBadge('☁️ Bulut Aktif 🟢', 'online');
      } else {
        // İlk kez açılıyorsa mevcut başlangıç verisini buluta yaz
        saveState();
      }
    },
    err => {
      console.error('Firestore dinleme hatası:', err);
      setCloudBadge('💾 Yerel Hafıza Aktif', '');
    }
  );
}

function isRowDone(v) {
  return v.script && v.elevenlabs && v.music && v.capcut && v.youtubeUpload;
}

function renderSummary() {
  const total = videos.length;
  const eleven = videos.filter(v => v.elevenlabs).length;
  const music = videos.filter(v => v.music).length;
  const capcut = videos.filter(v => v.capcut).length;
  const uploaded = videos.filter(v => v.youtubeUpload).length;

  document.getElementById('summaryBar').innerHTML = `
    <div class="sum-box">
      <span class="sum-label">🎬 Toplam Video</span>
      <span class="sum-val">${total}</span>
    </div>
    <div class="sum-box">
      <span class="sum-label">🎙️ ElevenLabs Hazır</span>
      <span class="sum-val" style="color:${eleven === total ? '#34d399' : '#fbbf24'}">${eleven} / ${total}</span>
    </div>
    <div class="sum-box">
      <span class="sum-label">🎵 Müzik İndirilen</span>
      <span class="sum-val" style="color:${music === total ? '#34d399' : '#fbbf24'}">${music} / ${total}</span>
    </div>
    <div class="sum-box">
      <span class="sum-label">✂️ CapCut Biten</span>
      <span class="sum-val" style="color:${capcut === total ? '#34d399' : '#fbbf24'}">${capcut} / ${total}</span>
    </div>
    <div class="sum-box">
      <span class="sum-label">📤 YT Yüklenen (Stok)</span>
      <span class="sum-val" style="color:#60a5fa">${uploaded} <small style="font-size:0.75rem; font-weight:500; color:#94a3b8;">(${uploaded} Günlük)</small></span>
    </div>
  `;
}

function renderTable() {
  const tbody = document.getElementById('tableBody');
  const filtered = videos
    .filter(v => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!`${v.number} ${v.title} ${v.yearEra} ${v.notes}`.toLowerCase().includes(q)) return false;
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
    tbody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding:28px; color:#94a3b8;">Bu filtrede video yok.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(v => {
    const done = isRowDone(v);
    return `
      <tr class="${done ? 'row-done' : ''}">
        <td class="col-no">#${v.number}</td>
        <td class="col-title">
          <div class="video-main-title">${escapeHtml(v.title)}</div>
          <div class="video-sub-info">
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

window.openModal = function(id) {
  const modal = document.getElementById('videoModal');
  const delBtn = document.getElementById('deleteVideoBtn');
  if (!id) {
    const nextNo = videos.length ? Math.max(...videos.map(v => v.number)) + 1 : 1;
    document.getElementById('modalTitle').textContent = 'Yeni Video Ekle';
    document.getElementById('formVideoId').value = '';
    document.getElementById('formVideoNumber').value = nextNo;
    document.getElementById('formYearEra').value = '';
    document.getElementById('formTitle').value = '';
    document.getElementById('formPublishDate').value = formatYMD(new Date());
    document.getElementById('formPublishTime').value = defaultPublishTime;
    document.getElementById('formNotes').value = '';
    delBtn.style.display = 'none';
  } else {
    const v = videos.find(x => x.id === id);
    if (!v) return;
    document.getElementById('modalTitle').textContent = `Video #${v.number} Düzenle`;
    document.getElementById('formVideoId').value = v.id;
    document.getElementById('formVideoNumber').value = v.number;
    document.getElementById('formYearEra').value = v.yearEra || '';
    document.getElementById('formTitle').value = v.title || '';
    document.getElementById('formPublishDate').value = v.publishDate || '';
    document.getElementById('formPublishTime').value = v.publishTime || defaultPublishTime;
    document.getElementById('formNotes').value = v.notes || '';
    delBtn.style.display = 'inline-flex';
  }
  modal.classList.remove('hidden');
};

function closeModal() {
  document.getElementById('videoModal').classList.add('hidden');
}

function escapeHtml(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderAll() {
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
    defaultPublishTime = e.target.value || '19:00';
    saveState();
  });

  document.getElementById('autoScheduleBtn').addEventListener('click', () => {
    const sorted = [...videos].sort((a, b) => a.number - b.number);
    const start = new Date();
    sorted.forEach((v, idx) => {
      const d = new Date(start);
      d.setDate(d.getDate() + idx);
      v.publishDate = formatYMD(d);
      v.publishTime = defaultPublishTime;
    });
    renderAll();
    saveState();
  });

  document.getElementById('addVideoBtn').addEventListener('click', () => openModal(null));
  document.getElementById('closeModalBtn').addEventListener('click', closeModal);
  document.getElementById('cancelModalBtn').addEventListener('click', closeModal);

  document.getElementById('videoForm').addEventListener('submit', e => {
    e.preventDefault();
    const id = document.getElementById('formVideoId').value;
    const number = Number(document.getElementById('formVideoNumber').value) || 1;
    const yearEra = document.getElementById('formYearEra').value.trim();
    const title = document.getElementById('formTitle').value.trim();
    const publishDate = document.getElementById('formPublishDate').value;
    const publishTime = document.getElementById('formPublishTime').value;
    const notes = document.getElementById('formNotes').value.trim();

    if (id) {
      const v = videos.find(x => x.id === id);
      if (v) Object.assign(v, { number, yearEra, title, publishDate, publishTime, notes });
    } else {
      videos.push({
        id: 'v_' + Date.now(),
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

  document.getElementById('exportBtn').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(videos, null, 2)], { type: 'application/json' });
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
          renderAll();
          saveState();
        }
      } catch (err) {}
    };
    r.readAsText(f);
  });
});
