/**
 * KUPA DRAFT 26 - Dünya Kupası Kadro Kurma Oyunu
 * EA FC Türkçe Mevkiler (KL, SLB, STP, SĞB, MDO, MO, MOO, SLO, SĞO, SLK, SĞK, SNT)
 */

const FORMATIONS = {
  '4-3-3': [
    { id: 'gk', label: 'KL', category: 'GK', detailed: 'KL', x: 50, y: 88 },
    { id: 'lb', label: 'SLB', category: 'DEF', detailed: 'SLB', x: 16, y: 70 },
    { id: 'cb1', label: 'STP', category: 'DEF', detailed: 'STP', x: 38, y: 73 },
    { id: 'cb2', label: 'STP', category: 'DEF', detailed: 'STP', x: 62, y: 73 },
    { id: 'rb', label: 'SĞB', category: 'DEF', detailed: 'SĞB', x: 84, y: 70 },
    { id: 'cm1', label: 'MO', category: 'MID', detailed: 'MO', x: 28, y: 50 },
    { id: 'cam', label: 'MOO', category: 'MID', detailed: 'MOO', x: 50, y: 39 },
    { id: 'cm2', label: 'MO', category: 'MID', detailed: 'MO', x: 72, y: 50 },
    { id: 'lw', label: 'SLK', category: 'FWD', detailed: 'SLK', x: 20, y: 22 },
    { id: 'st', label: 'SNT', category: 'FWD', detailed: 'SNT', x: 50, y: 16 },
    { id: 'rw', label: 'SĞK', category: 'FWD', detailed: 'SĞK', x: 80, y: 22 }
  ],
  '4-4-2': [
    { id: 'gk', label: 'KL', category: 'GK', detailed: 'KL', x: 50, y: 88 },
    { id: 'lb', label: 'SLB', category: 'DEF', detailed: 'SLB', x: 16, y: 70 },
    { id: 'cb1', label: 'STP', category: 'DEF', detailed: 'STP', x: 38, y: 73 },
    { id: 'cb2', label: 'STP', category: 'DEF', detailed: 'STP', x: 62, y: 73 },
    { id: 'rb', label: 'SĞB', category: 'DEF', detailed: 'SĞB', x: 84, y: 70 },
    { id: 'lm', label: 'SLO', category: 'MID', detailed: 'SLO', x: 18, y: 45 },
    { id: 'cm1', label: 'MO', category: 'MID', detailed: 'MO', x: 40, y: 48 },
    { id: 'cm2', label: 'MO', category: 'MID', detailed: 'MO', x: 60, y: 48 },
    { id: 'rm', label: 'SĞO', category: 'MID', detailed: 'SĞO', x: 82, y: 45 },
    { id: 'st1', label: 'SNT', category: 'FWD', detailed: 'SNT', x: 38, y: 18 },
    { id: 'st2', label: 'SNT', category: 'FWD', detailed: 'SNT', x: 62, y: 18 }
  ],
  '4-2-3-1': [
    { id: 'gk', label: 'KL', category: 'GK', detailed: 'KL', x: 50, y: 88 },
    { id: 'lb', label: 'SLB', category: 'DEF', detailed: 'SLB', x: 16, y: 70 },
    { id: 'cb1', label: 'STP', category: 'DEF', detailed: 'STP', x: 38, y: 73 },
    { id: 'cb2', label: 'STP', category: 'DEF', detailed: 'STP', x: 62, y: 73 },
    { id: 'rb', label: 'SĞB', category: 'DEF', detailed: 'SĞB', x: 84, y: 70 },
    { id: 'cdm1', label: 'MDO', category: 'MID', detailed: 'MDO', x: 35, y: 55 },
    { id: 'cdm2', label: 'MDO', category: 'MID', detailed: 'MDO', x: 65, y: 55 },
    { id: 'lam', label: 'SLO', category: 'MID', detailed: 'SLO', x: 20, y: 35 },
    { id: 'cam', label: 'MOO', category: 'MID', detailed: 'MOO', x: 50, y: 32 },
    { id: 'ram', label: 'SĞO', category: 'MID', detailed: 'SĞO', x: 80, y: 35 },
    { id: 'st', label: 'SNT', category: 'FWD', detailed: 'SNT', x: 50, y: 15 }
  ],
  '3-4-3': [
    { id: 'gk', label: 'KL', category: 'GK', detailed: 'KL', x: 50, y: 88 },
    { id: 'cb1', label: 'STP', category: 'DEF', detailed: 'STP', x: 26, y: 70 },
    { id: 'cb2', label: 'STP', category: 'DEF', detailed: 'STP', x: 50, y: 72 },
    { id: 'cb3', label: 'STP', category: 'DEF', detailed: 'STP', x: 74, y: 70 },
    { id: 'lm', label: 'SLO', category: 'MID', detailed: 'SLO', x: 15, y: 46 },
    { id: 'cm1', label: 'MO', category: 'MID', detailed: 'MO', x: 38, y: 48 },
    { id: 'cm2', label: 'MO', category: 'MID', detailed: 'MO', x: 62, y: 48 },
    { id: 'rm', label: 'SĞO', category: 'MID', detailed: 'SĞO', x: 85, y: 46 },
    { id: 'lw', label: 'SLK', category: 'FWD', detailed: 'SLK', x: 20, y: 22 },
    { id: 'st', label: 'SNT', category: 'FWD', detailed: 'SNT', x: 50, y: 16 },
    { id: 'rw', label: 'SĞK', category: 'FWD', detailed: 'SĞK', x: 80, y: 22 }
  ]
};

const POSITION_NAMES = {
  'KL': 'Kaleci',
  'SLB': 'Sol Bek',
  'STP': 'Stoper',
  'SĞB': 'Sağ Bek',
  'MDO': 'Merkez Defansif Orta Saha',
  'MO': 'Merkez Orta Saha',
  'MOO': 'Merkez Ofansif Orta Saha',
  'SLO': 'Sol Orta Saha',
  'SĞO': 'Sağ Orta Saha',
  'SLK': 'Sol Kanat',
  'SĞK': 'Sağ Kanat',
  'SNT': 'Santrafor',
  'GK': 'Kaleci',
  'DEF': 'Defans',
  'MID': 'Orta Saha',
  'FWD': 'Forvet'
};

const COMPATIBLE_POSITIONS = {
  // Kaleci: Sadece Kaleciler
  'KL': ['KL'],

  // Defanslar: Sadece kendi mevkileri
  'STP': ['STP'],
  'SLB': ['SLB'],
  'SĞB': ['SĞB'],

  // Orta Sahalar:
  'MDO': ['MDO'], // Sadece Defansif Orta Saha
  'MO': ['MO', 'MDO', 'MOO'], // Merkez Orta Saha
  'MOO': ['MOO', 'MO'], // Ofansif Orta Saha

  // Kanatlar ve Kanat Orta Sahaları:
  'SLO': ['SLO', 'SLK'], // Sol Orta Saha -> Sol Kanat / Sol Orta oyuncuları
  'SLK': ['SLK', 'SLO'], // Sol Kanat -> Sol Kanat / Sol Orta oyuncuları
  'SĞO': ['SĞO', 'SĞK'], // Sağ Orta Saha -> Sağ Kanat / Sağ Orta oyuncuları
  'SĞK': ['SĞK', 'SĞO'], // Sağ Kanat -> Sağ Kanat / Sağ Orta oyuncuları

  // Forvet: Sadece Santraforlar
  'SNT': ['SNT']
};

class FutDraftGame {
  constructor() {
    this.teams = [];
    this.allPlayers = [];
    this.currentFormation = '4-3-3';
    this.squadSlots = [];
    this.activeDraftSlotIndex = null;
    this.captainPicked = false;
    this.isCaptainDraft = false;

    this.settings = this.loadSettings();
    this.init();
  }

  loadSettings() {
    const defaultSettings = {
      difficulty: 'normal',
      speed: 1,
      sound: true,
      beraChance: 0.50
    };
    try {
      const saved = localStorage.getItem('kupa_draft_settings');
      if (saved) {
        return { ...defaultSettings, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
    return defaultSettings;
  }

  saveSettings() {
    try {
      localStorage.setItem('kupa_draft_settings', JSON.stringify(this.settings));
    } catch (e) {}
    this.applySettings();
  }

  applySettings() {
    if (window.soundEngine) {
      window.soundEngine.isMuted = !this.settings.sound;
    }
  }

  showMainMenu() {
    // Strictly close all modals
    ['formationModal', 'draftPickModal', 'completionModal', 'settingsModal', 'howToPlayModal'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });

    const menu = document.getElementById('mainMenuScreen');
    if (menu) {
      menu.classList.remove('hidden');
      menu.style.display = 'flex';
    }
  }

  hideMainMenu() {
    const menu = document.getElementById('mainMenuScreen');
    if (menu) {
      menu.classList.add('hidden');
      setTimeout(() => {
        if (menu.classList.contains('hidden')) {
          menu.style.display = 'none';
        }
      }, 350);
    }
  }

  async init() {
    await this.loadTeams();
    this.bindEvents();
    this.setFormation('4-3-3');
    this.tournament = new TournamentEngine(this);
    this.applySettings();
    
    // Explicitly guarantee all modals are closed initially
    ['formationModal', 'draftPickModal', 'completionModal', 'settingsModal', 'howToPlayModal'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });

    // Purely display Main Menu on launch
    this.showMainMenu();
  }

  async loadTeams() {
    if (window.TEAMS_DATA && Array.isArray(window.TEAMS_DATA) && window.TEAMS_DATA.length > 0) {
      this.teams = window.TEAMS_DATA;
    } else {
      try {
        const res = await fetch('data/teams.json');
        this.teams = await res.json();
      } catch (e) {
        console.error('Failed to load teams.json', e);
      }
    }

    // Flatten all players with team metadata for quick querying
    this.allPlayers = [];
    this.teams.forEach(team => {
      team.players.forEach(p => {
        this.allPlayers.push({
          ...p,
          teamName: team.name,
          teamFlag: team.flag,
          teamCode: team.code,
          isTop10: team.isTop10
        });
      });
    });
  }

  bindEvents() {
    // --------------------------------------------------
    // MAIN MENU & NAVIGATION
    // --------------------------------------------------
    const btnStartDraft = document.getElementById('btnMenuStartDraft');
    if (btnStartDraft) {
      btnStartDraft.addEventListener('click', () => {
        window.soundEngine.playClick();
        // Ensure all modals are strictly closed
        ['settingsModal', 'howToPlayModal', 'draftPickModal', 'completionModal'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.style.display = 'none';
        });

        this.hideMainMenu();
        this.resetDraft(false);

        // Start flow by opening the formation selection modal!
        setTimeout(() => {
          document.getElementById('formationModal').style.display = 'flex';
        }, 200);
      });
    }

    const btnMenuSettings = document.getElementById('btnMenuSettings');
    if (btnMenuSettings) {
      btnMenuSettings.addEventListener('click', () => {
        window.soundEngine.playClick();
        this.openSettingsModal();
      });
    }

    const btnHeaderSettings = document.getElementById('btnHeaderSettings');
    if (btnHeaderSettings) {
      btnHeaderSettings.addEventListener('click', () => {
        window.soundEngine.playClick();
        this.openSettingsModal();
      });
    }

    const btnMenuHowToPlay = document.getElementById('btnMenuHowToPlay');
    if (btnMenuHowToPlay) {
      btnMenuHowToPlay.addEventListener('click', () => {
        window.soundEngine.playClick();
        document.getElementById('howToPlayModal').style.display = 'flex';
      });
    }

    const btnCloseHowToPlay = document.getElementById('btnCloseHowToPlay');
    if (btnCloseHowToPlay) {
      btnCloseHowToPlay.addEventListener('click', () => {
        window.soundEngine.playClick();
        document.getElementById('howToPlayModal').style.display = 'none';
      });
    }

    const btnCloseHowToPlayBottom = document.getElementById('btnCloseHowToPlayBottom');
    if (btnCloseHowToPlayBottom) {
      btnCloseHowToPlayBottom.addEventListener('click', () => {
        window.soundEngine.playClick();
        document.getElementById('howToPlayModal').style.display = 'none';
      });
    }

    const btnHeaderMainMenu = document.getElementById('btnHeaderMainMenu');
    if (btnHeaderMainMenu) {
      btnHeaderMainMenu.addEventListener('click', () => {
        window.soundEngine.playClick();
        if (this.tournament && this.tournament.isMatchActive) {
          if (confirm('Devam eden maç iptal edilecek ve Ana Menüye dönülecektir. Emin misiniz?')) {
            this.tournament.exitCurrentMatch();
            this.resetDraft();
            this.showMainMenu();
          }
        } else {
          const hasPickedAny = this.squadSlots.some(s => s.player);
          if (hasPickedAny) {
            if (confirm('Ana Menüye dönmek istiyor musunuz? Mevcut kadronuz sıfırlanacaktır.')) {
              this.resetDraft();
              this.showMainMenu();
            }
          } else {
            this.showMainMenu();
          }
        }
      });
    }

    // Settings Modal: Close & Save
    const btnCloseSettings = document.getElementById('btnCloseSettings');
    if (btnCloseSettings) {
      btnCloseSettings.addEventListener('click', () => {
        window.soundEngine.playClick();
        document.getElementById('settingsModal').style.display = 'none';
      });
    }

    const btnSaveSettings = document.getElementById('btnSaveSettings');
    if (btnSaveSettings) {
      btnSaveSettings.addEventListener('click', () => {
        window.soundEngine.playClick();
        this.saveSettings();
        document.getElementById('settingsModal').style.display = 'none';
      });
    }

    // Settings: Difficulty selection
    const diffHintMap = {
      easy: 'Acemi: 7sn Karar Süresi, Rahat AI',
      normal: 'Profesyonel: 5sn Karar Süresi, Dengeli Maçlar',
      hard: 'Efsane: 3.5sn Karar Süresi, Sert & Tehlikeli AI'
    };
    document.querySelectorAll('#diffOptions .opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#diffOptions .opt-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.settings.difficulty = btn.dataset.diff;
        const hintEl = document.getElementById('diffHintText');
        if (hintEl) hintEl.textContent = diffHintMap[this.settings.difficulty] || '';
        window.soundEngine.playClick();
      });
    });

    // Settings: Speed selection
    const speedHintMap = {
      '1': '1x Normal Hız',
      '1.5': '1.5x Hızlı Akış',
      '2': '2x Fırtına Modu'
    };
    document.querySelectorAll('#speedOptions .opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#speedOptions .opt-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.settings.speed = parseFloat(btn.dataset.speed);
        const hintEl = document.getElementById('speedHintText');
        if (hintEl) hintEl.textContent = speedHintMap[btn.dataset.speed] || '';
        window.soundEngine.playClick();
      });
    });

    // Settings: Sound Toggle
    // Settings: Sound Toggle
    const soundToggle = document.getElementById('toggleSound');
    if (soundToggle) {
      soundToggle.addEventListener('change', () => {
        this.settings.sound = soundToggle.checked;
        if (window.soundEngine) window.soundEngine.isMuted = !this.settings.sound;
        if (this.settings.sound) window.soundEngine.playClick();
      });
    }

    // --------------------------------------------------
    // FORMATION & SQUAD SELECTION
    // --------------------------------------------------
    // Formation options click in modal
    document.querySelectorAll('.formation-card-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.formation-card-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFormation = btn.dataset.formation;
        window.soundEngine.playClick();
      });
    });

    // Confirm formation button
    document.getElementById('btnConfirmFormation').addEventListener('click', () => {
      window.soundEngine.playClick();
      document.getElementById('formationModal').style.display = 'none';
      this.setFormation(this.currentFormation);
      
      // Right after formation, trigger Step 1: Captain Pick!
      setTimeout(() => {
        this.openCaptainDraftModal();
      }, 300);
    });

    // Open Formation Modal button in header
    document.getElementById('btnOpenFormationModal').addEventListener('click', () => {
      if (this.tournament && (this.tournament.isMatchActive || this.tournament.isTournamentActive)) return;
      window.soundEngine.playClick();
      document.getElementById('formationModal').style.display = 'flex';
    });

    // Close Draft Pick Modal (if button exists)
    const btnCloseDraft = document.getElementById('btnCloseDraftModal');
    if (btnCloseDraft) {
      btnCloseDraft.addEventListener('click', () => {
        window.soundEngine.playClick();
        document.getElementById('draftPickModal').style.display = 'none';
        this.isCaptainDraft = false;
        this.activeDraftSlotIndex = null;
      });
    }

    // Reset Draft Button
    document.getElementById('btnResetDraft').addEventListener('click', () => {
      if (this.tournament && (this.tournament.isMatchActive || this.tournament.isTournamentActive)) return;
      window.soundEngine.playClick();
      this.resetDraft(true);
    });

    // Victory Modal Buttons
    document.getElementById('btnVictoryClose').addEventListener('click', () => {
      window.soundEngine.playClick();
      document.getElementById('completionModal').style.display = 'none';
    });

    document.getElementById('btnVictoryRestart').addEventListener('click', () => {
      window.soundEngine.playClick();
      document.getElementById('completionModal').style.display = 'none';
      this.resetDraft(true);
    });

    document.getElementById('btnVictoryDownload').addEventListener('click', () => {
      window.soundEngine.playClick();
      this.exportSquadCard();
    });

    document.getElementById('btnDownloadSquad').addEventListener('click', () => {
      window.soundEngine.playClick();
      this.exportSquadCard();
    });
  }

  openSettingsModal() {
    const diffBtns = document.querySelectorAll('#diffOptions .opt-btn');
    diffBtns.forEach(b => b.classList.toggle('active', b.dataset.diff === this.settings.difficulty));
    const diffHintMap = {
      easy: 'Acemi: 7sn Karar Süresi, Rahat AI',
      normal: 'Profesyonel: 5sn Karar Süresi, Dengeli Maçlar',
      hard: 'Efsane: 3.5sn Karar Süresi, Sert & Tehlikeli AI'
    };
    const diffHint = document.getElementById('diffHintText');
    if (diffHint) diffHint.textContent = diffHintMap[this.settings.difficulty] || '';

    const speedBtns = document.querySelectorAll('#speedOptions .opt-btn');
    speedBtns.forEach(b => b.classList.toggle('active', Math.abs(parseFloat(b.dataset.speed) - this.settings.speed) < 0.05));
    const speedHintMap = { '1': '1x Normal Hız', '1.5': '1.5x Hızlı Akış', '2': '2x Fırtına Modu' };
    const speedHint = document.getElementById('speedHintText');
    if (speedHint) speedHint.textContent = speedHintMap[String(this.settings.speed)] || '';

    const soundToggle = document.getElementById('toggleSound');
    if (soundToggle) soundToggle.checked = this.settings.sound;

    document.getElementById('settingsModal').style.display = 'flex';
  }

  setFormation(formationKey) {
    this.currentFormation = formationKey;
    document.getElementById('currentFormationBadge').textContent = `${formationKey} ▾`;

    const template = FORMATIONS[formationKey] || FORMATIONS['4-3-3'];
    this.squadSlots = template.map(slot => ({
      ...slot,
      player: null
    }));

    this.captainPicked = false;
    this.captainCandidates = null;
    this.renderPitch();
    this.updateStatsDisplay();
  }

  resetDraft(autoOpenCaptain = false) {
    this.captainPicked = false;
    this.captainCandidates = null;
    this.activeDraftSlotIndex = null;
    this.squadSlots.forEach(slot => {
      slot.player = null;
      slot.candidates = null;
    });
    this.renderPitch();
    this.updateStatsDisplay();
    const btnDownload = document.getElementById('btnDownloadSquad');
    if (btnDownload) btnDownload.style.display = 'none';

    if (this.tournament) {
      this.tournament.currentRoundIndex = 0;
      this.tournament.activeOpponent = null;
      this.tournament.updateHeaderButton(false);
    }

    if (autoOpenCaptain) {
      setTimeout(() => {
        this.openCaptainDraftModal();
      }, 250);
    }
  }

  resetGame() {
    this.resetDraft(false);
  }

  // ==========================================
  // PITCH RENDERING & INTERACTIVE SLOTS
  // ==========================================
  renderPitch() {
    const pitchLayer = document.getElementById('pitchPlayersLayer');
    if (!pitchLayer) return;

    pitchLayer.innerHTML = '';
    this.squadSlots.forEach((slot, index) => {
      const slotDiv = document.createElement('div');
      slotDiv.className = 'pitch-slot';
      slotDiv.style.left = `${slot.x}%`;
      slotDiv.style.top = `${slot.y}%`;

      if (slot.player) {
        slotDiv.classList.add('slot-filled');
        const p = slot.player;
        const posText = slot.label;
        const captainBadgeHtml = p.isCaptain ? `<span class="p-card-captain-tag">© C</span>` : '';
        const isBirthday = p.cardType === 'birthday' || p.rating === 99;
        let cardTierClass = '';
        if (isBirthday) {
          cardTierClass = 'birthday-special';
        } else if (p.rating >= 87) {
          cardTierClass = 'elite';
        }
        const avatarIcon = isBirthday ? '👑' : '👤';
        const displayName = isBirthday ? 'Y. Bera' : p.name.split(' ').pop();

        slotDiv.innerHTML = `
          <div class="pitch-card-filled ${cardTierClass}">
            ${captainBadgeHtml}
            <div class="p-card-top">
              <span class="p-card-rating">${p.rating}</span>
              <span class="p-card-pos">${posText}</span>
              <span class="p-card-flag">${p.teamFlag}</span>
            </div>
            <div class="p-card-avatar">${avatarIcon}</div>
            <div class="p-card-name">${displayName}</div>
          </div>
          <div class="slot-pos-badge">${slot.label}</div>
        `;
      } else {
        // Empty slot with +
        slotDiv.innerHTML = `
          <div class="pitch-card-empty">
            <span class="empty-plus">+</span>
            <span class="empty-pos-text">${slot.label}</span>
          </div>
          <div class="slot-pos-badge">${slot.label}</div>
        `;
      }

      // Clicking slot opens draft pick modal (only if slot is empty and tournament/match not active)
      slotDiv.addEventListener('click', () => {
        // Prevent clicks during match simulation or active tournament
        if (this.tournament && (this.tournament.isMatchActive || this.tournament.isTournamentActive)) return;
        // Prevent re-drafting/changing once player is picked for this slot
        if (slot.player) return;

        window.soundEngine.playClick();
        if (!this.captainPicked) {
          // If captain not chosen yet, direct to captain selection
          this.openCaptainDraftModal();
        } else {
          this.openDraftPickModal(index);
        }
      });

      pitchLayer.appendChild(slotDiv);
    });
  }

  // ==========================================
  // STEP 1: CAPTAIN SELECTION MODAL
  // 5 World-Class Superstars to lead the squad
  // ==========================================
  openCaptainDraftModal() {
    this.isCaptainDraft = true;
    this.activeDraftSlotIndex = null;

    document.getElementById('draftModalPosBadge').textContent = '🌟 1. ADIM: KAPTANINI SEÇ';
    document.getElementById('draftModalTitle').textContent = 'Rüya Takımının Kaptanı Kim Olsun?';
    document.querySelector('#draftPickModal .draft-pick-header p').textContent = 
      'Takımına liderlik edecek bir süperstar seç. Seçtiğin kaptan ilk 11\'deki mevkisine yerleşecektir:';

    if (!this.captainCandidates) {
      // 5 World-class superstars (87-99) across different formation positions
      const superstars = this.allPlayers
        .filter(p => p.rating >= 86)
        .sort(() => 0.5 - Math.random());

      const candidates = [];
      const usedPositions = new Set();
      const usedNations = new Set();

      // High chance for the Birthday Hero Y. Bera as a captain option (configurable in settings)
      const bera = this.allPlayers.find(p => p.id === 'tur_y_bera');
      const beraProb = (this.settings && this.settings.beraChance !== undefined) ? this.settings.beraChance : 0.50;
      if (bera && Math.random() < beraProb) {
        candidates.push({ ...bera, isCaptain: true });
        usedPositions.add(bera.detailedPosition);
        usedNations.add(bera.teamName);
      }

      for (let p of superstars) {
        if (candidates.length >= 5) break;
        if (candidates.some(c => c.id === p.id)) continue;
        const matchingSlot = this.squadSlots.find(s => 
          s.detailed === p.detailedPosition || 
          (COMPATIBLE_POSITIONS[s.detailed] && COMPATIBLE_POSITIONS[s.detailed].includes(p.detailedPosition))
        );
        if (matchingSlot && !usedPositions.has(p.detailedPosition) && !usedNations.has(p.teamName)) {
          candidates.push({ ...p, isCaptain: true });
          usedPositions.add(p.detailedPosition);
          usedNations.add(p.teamName);
        }
      }

      // Fallback if needed
      if (candidates.length < 5) {
        for (let p of superstars) {
          if (candidates.length >= 5) break;
          if (!candidates.some(c => c.id === p.id)) {
            candidates.push({ ...p, isCaptain: true });
          }
        }
      }
      this.captainCandidates = candidates.sort(() => 0.5 - Math.random());
    }

    this.renderCandidateCards(this.captainCandidates);
    document.getElementById('draftPickModal').style.display = 'flex';
  }

  // ==========================================
  // STEP 2: REGULAR POSITION DRAFT MODAL
  // Tiered probabilities & country diversity
  // ==========================================
  openDraftPickModal(slotIndex) {
    this.isCaptainDraft = false;
    this.activeDraftSlotIndex = slotIndex;
    const slot = this.squadSlots[slotIndex];

    const posDetailedName = POSITION_NAMES[slot.detailed] || POSITION_NAMES[slot.category] || slot.label;
    document.getElementById('draftModalPosBadge').textContent = `${slot.label} • ${posDetailedName.toUpperCase()}`;
    document.getElementById('draftModalTitle').textContent = `${posDetailedName} Seçimi`;
    document.querySelector('#draftPickModal .draft-pick-header p').textContent = 
      'Aşağıdaki 5 futbolcu arasından bu mevki için en iyi tercihi yap:';

    // Pick 5 candidates matching this position with tiered ratings (cached on slot)
    if (!slot.candidates) {
      slot.candidates = this.getCandidatesForSlot(slot);
    }
    this.renderCandidateCards(slot.candidates);

    const modal = document.getElementById('draftPickModal');
    modal.style.display = 'flex';
  }

  getCandidatesForSlot(slot) {
    const chosenIds = new Set(
      this.squadSlots.filter(s => s.player).map(s => s.player.id)
    );

    // Strictly match compatible positions (e.g. SĞO -> ['SĞO', 'SĞK'], MDO -> ['MDO'], etc.)
    const allowedPositions = COMPATIBLE_POSITIONS[slot.detailed] || [slot.detailed];
    let pool = this.allPlayers.filter(p => 
      allowedPositions.includes(p.detailedPosition) && !chosenIds.has(p.id)
    );

    // Fallback if squad picked almost everyone in pool
    if (pool.length < 5) {
      pool = this.allPlayers.filter(p => allowedPositions.includes(p.detailedPosition));
    }

    // Realistic FUT Draft Rating Tiers:
    // Slot 1: Star / Walkout chance (~25% chance of 85-99, otherwise 82-99)
    // Slot 2: Solid High Gold (80-84)
    // Slot 3: Mid Gold (78-82)
    // Slot 4: Common Gold (75-79)
    // Slot 5: Wildcard / Underdog (71-77)
    const hasWalkout = Math.random() < 0.25;
    const tierSpecs = [
      hasWalkout ? { min: 85, max: 99 } : { min: 82, max: 99 },
      { min: 80, max: 84 },
      { min: 78, max: 82 },
      { min: 75, max: 79 },
      { min: 71, max: 77 }
    ];

    const candidates = [];
    const usedIds = new Set();
    const usedNations = new Set();

    // Special Birthday Star Y. Bera appearance:
    const beraPlayer = this.allPlayers.find(p => p.id === 'tur_y_bera');
    const isBeraNotPicked = beraPlayer && !chosenIds.has('tur_y_bera');
    if (isBeraNotPicked) {
      const isSntSlot = slot.detailed === 'SNT';
      const isAttackSlot = slot.category === 'FWD' || slot.detailed === 'MOO';
      const beraProb = (this.settings && this.settings.beraChance !== undefined) ? this.settings.beraChance : 0.50;
      const shouldAppear = isSntSlot ? (Math.random() < beraProb) : (isAttackSlot ? Math.random() < (beraProb * 0.5) : false);
      if (shouldAppear) {
        candidates.push(beraPlayer);
        usedIds.add(beraPlayer.id);
        usedNations.add(beraPlayer.teamName);
      }
    }

    tierSpecs.forEach(spec => {
      if (candidates.length >= 5) return;
      // Find matching players in this rating range
      let eligible = pool.filter(p => 
        !usedIds.has(p.id) && 
        p.rating >= spec.min && 
        p.rating <= spec.max
      );

      // Prioritize different nations
      let freshNation = eligible.filter(p => !usedNations.has(p.teamName));
      let pick = null;

      if (freshNation.length > 0) {
        pick = freshNation[Math.floor(Math.random() * freshNation.length)];
      } else if (eligible.length > 0) {
        pick = eligible[Math.floor(Math.random() * eligible.length)];
      } else {
        // Fallback strictly within compatible position pool
        let broader = pool.filter(p => !usedIds.has(p.id));
        let broadFresh = broader.filter(p => !usedNations.has(p.teamName));
        pick = broadFresh.length > 0 
          ? broadFresh[Math.floor(Math.random() * broadFresh.length)]
          : (broader.length > 0 ? broader[Math.floor(Math.random() * broader.length)] : null);
      }

      if (pick) {
        candidates.push(pick);
        usedIds.add(pick.id);
        usedNations.add(pick.teamName);
      }
    });

    // Shuffle final 5 so the highest rating isn't always in slot 1
    return candidates.sort(() => 0.5 - Math.random());
  }

  // ==========================================
  // CANDIDATE CARDS BUILDER
  // ==========================================
  renderCandidateCards(candidates) {
    const container = document.getElementById('draftCandidatesRow');
    container.innerHTML = '';

    candidates.forEach(player => {
      const card = document.createElement('div');
      
      // Determine Tier Class
      let tierClass = 'rare-gold';
      const isBirthday = player.cardType === 'birthday' || player.rating === 99;
      if (isBirthday) {
        tierClass = 'birthday-special';
      } else if (player.rating >= 87) {
        tierClass = 'elite';
      } else if (player.rating >= 82) {
        tierClass = 'rare-gold';
      } else if (player.rating >= 77) {
        tierClass = 'common-gold';
      } else {
        tierClass = 'underdog';
      }

      if (player.isCaptain) {
        tierClass += ' captain';
      }

      card.className = `fut-card ${tierClass}`;

      const posLabel = this.isCaptainDraft 
        ? (player.detailedPosition || player.position) 
        : (this.activeDraftSlotIndex !== null ? this.squadSlots[this.activeDraftSlotIndex].label : (player.detailedPosition || player.position));
      const captainTagHtml = player.isCaptain ? `<span class="captain-tag">© KAPTAN</span>` : '';
      const avatarIcon = isBirthday ? '👑' : (player.avatar || '👤');

      card.innerHTML = `
        ${captainTagHtml}
        <div class="card-top">
          <div class="card-meta-left">
            <div class="card-rating">${player.rating}</div>
            <div class="card-position">${posLabel}</div>
            <div class="card-meta-flag">${player.teamFlag}</div>
          </div>
          <div class="card-avatar-wrap">
            <div class="card-silhouette">${avatarIcon}</div>
          </div>
        </div>
        
        <div class="card-mid">
          <div class="card-name">${player.name}</div>
          <div class="card-club">${player.club}</div>
        </div>

        <div class="card-stats-grid">
          <div class="stat-row">
            <span class="stat-label-fut">PAC</span>
            <span class="stat-val-fut">${player.stats.pac}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label-fut">DRI</span>
            <span class="stat-val-fut">${player.stats.dri}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label-fut">SHO</span>
            <span class="stat-val-fut">${player.stats.sho}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label-fut">DEF</span>
            <span class="stat-val-fut">${player.stats.def}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label-fut">PAS</span>
            <span class="stat-val-fut">${player.stats.pas}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label-fut">PHY</span>
            <span class="stat-val-fut">${player.stats.phy}</span>
          </div>
        </div>

        <button class="btn-select-card">KADROYA SEÇ ➔</button>
      `;

      card.addEventListener('click', () => {
        if (this.isCaptainDraft) {
          this.selectCaptainForSquad(player);
        } else {
          this.selectPlayerForActiveSlot(player);
        }
      });

      container.appendChild(card);
    });
  }

  selectCaptainForSquad(player) {
    window.soundEngine.playVictory();
    this.captainPicked = true;
    this.isCaptainDraft = false;
    this.captainCandidates = null;

    // Place into matching slot in current formation using COMPATIBLE_POSITIONS
    let targetSlot = this.squadSlots.find(s => !s.player && s.detailed === player.detailedPosition);
    if (!targetSlot) {
      targetSlot = this.squadSlots.find(s => !s.player && COMPATIBLE_POSITIONS[s.detailed] && COMPATIBLE_POSITIONS[s.detailed].includes(player.detailedPosition));
    }
    if (!targetSlot) {
      targetSlot = this.squadSlots.find(s => !s.player && s.category === player.position);
    }
    if (!targetSlot) {
      targetSlot = this.squadSlots.find(s => !s.player);
    }

    if (targetSlot) {
      targetSlot.player = { ...player, isCaptain: true };
      targetSlot.candidates = null;
    }

    document.getElementById('draftPickModal').style.display = 'none';
    this.renderPitch();
    this.updateStatsDisplay();
  }

  selectPlayerForActiveSlot(player) {
    if (this.activeDraftSlotIndex === null) return;

    window.soundEngine.playCardPick();
    this.squadSlots[this.activeDraftSlotIndex].player = player;
    this.squadSlots[this.activeDraftSlotIndex].candidates = null;

    // Close modal
    document.getElementById('draftPickModal').style.display = 'none';
    this.activeDraftSlotIndex = null;

    // Re-render pitch and update stats
    this.renderPitch();
    this.updateStatsDisplay();

    // Check if squad is 11/11 complete!
    const filledCount = this.squadSlots.filter(s => s.player).length;
    if (filledCount === 11) {
      setTimeout(() => {
        this.showCompletionModal();
      }, 350);
    }
  }

  // ==========================================
  // STATS & CHEMISTRY CALCULATION
  // ==========================================
  updateStatsDisplay() {
    const filledSlots = this.squadSlots.filter(s => s.player);
    const count = filledSlots.length;
    document.getElementById('squadCountDisplay').textContent = `${count} / 11`;

    if (count > 0) {
      const avgRating = this.calculateAverageRating(this.squadSlots);
      document.getElementById('squadRatingDisplay').textContent = avgRating;

      const chem = this.calculateChemistry(filledSlots);
      document.getElementById('squadChemDisplay').textContent = `${chem} / 33`;
    } else {
      document.getElementById('squadRatingDisplay').textContent = '--';
      document.getElementById('squadChemDisplay').textContent = '0 / 33';
    }

    if (this.tournament) {
      this.tournament.updateHeaderButton(count === 11);
    }
  }

  calculateAverageRating(slots) {
    const filled = slots.filter(s => s.player);
    if (filled.length === 0) return 0;
    return Math.round(filled.reduce((sum, s) => sum + s.player.rating, 0) / filled.length);
  }

  calculateChemistry(filledSlots) {
    if (filledSlots.length === 0) return 0;
    let score = Math.round((filledSlots.length / 11) * 16); // base progression
    
    // Nationality and club synergies
    const nations = {};
    const clubs = {};

    filledSlots.forEach(s => {
      nations[s.player.teamName] = (nations[s.player.teamName] || 0) + 1;
      clubs[s.player.club] = (clubs[s.player.club] || 0) + 1;
    });

    Object.values(nations).forEach(c => {
      if (c >= 2) score += 2;
      if (c >= 3) score += 3;
    });

    Object.values(clubs).forEach(c => {
      if (c >= 2) score += 3;
    });

    return Math.min(33, score);
  }

  // ==========================================
  // COMPLETION VICTORY MODAL
  // ==========================================
  showCompletionModal() {
    window.soundEngine.playVictory();
    window.confettiEngine.fire(150, 4500);

    const filledSlots = this.squadSlots.filter(s => s.player);
    const avgRating = Math.round(
      filledSlots.reduce((sum, s) => sum + s.player.rating, 0) / 11
    );
    const chem = this.calculateChemistry(filledSlots);

    document.getElementById('victoryOvrVal').textContent = avgRating;
    document.getElementById('victoryChemVal').textContent = `${chem} / 33`;
    document.getElementById('victoryFormationVal').textContent = this.currentFormation;

    document.getElementById('completionModal').style.display = 'flex';
    document.getElementById('btnDownloadSquad').style.display = 'inline-flex';
  }

  // ==========================================
  // EXPORT SQUAD AS HIGH-RES PNG CARD
  // ==========================================
  exportSquadCard() {
    const canvas = document.getElementById('exportCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 1200;
    canvas.height = 1500;

    // 1. Stadium Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGrad.addColorStop(0, '#070a12');
    bgGrad.addColorStop(0.5, '#0f172a');
    bgGrad.addColorStop(1, '#05070d');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Header Title & Badges
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 50px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🏆 DÜNYA KUPASI 2026 - RÜYA 11', canvas.width / 2, 80);

    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 30px Rajdhani, sans-serif';
    const ovr = document.getElementById('squadRatingDisplay').textContent;
    const chem = document.getElementById('squadChemDisplay').textContent;
    ctx.fillText(`DİZİLİŞ: ${this.currentFormation}   |   GÜÇ: ${ovr} OVR   |   KİMYA: ${chem}`, canvas.width / 2, 130);

    // 3. Draw Pitch
    const pitchX = 100;
    const pitchY = 170;
    const pitchW = 1000;
    const pitchH = 1240;

    // Pitch Grass
    const pitchGrad = ctx.createLinearGradient(0, pitchY, 0, pitchY + pitchH);
    pitchGrad.addColorStop(0, '#1b5e20');
    pitchGrad.addColorStop(1, '#114015');
    ctx.fillStyle = pitchGrad;
    ctx.roundRect(pitchX, pitchY, pitchW, pitchH, 24);
    ctx.fill();

    // Pitch Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 4;
    ctx.roundRect(pitchX, pitchY, pitchW, pitchH, 24);
    ctx.stroke();

    // Halfway line & Center Circle
    ctx.beginPath();
    ctx.moveTo(pitchX, pitchY + pitchH / 2);
    ctx.lineTo(pitchX + pitchW, pitchY + pitchH / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(pitchX + pitchW / 2, pitchY + pitchH / 2, 110, 0, Math.PI * 2);
    ctx.stroke();

    // 4. Draw Each Player Card on the Pitch
    this.squadSlots.forEach(slot => {
      const px = pitchX + (slot.x / 100) * pitchW;
      const py = pitchY + (slot.y / 100) * pitchH;

      const cardW = 114;
      const cardH = 150;
      const cardX = px - cardW / 2;
      const cardY = py - cardH / 2;

      // Card Background
      const isElite = slot.player && slot.player.rating >= 87;
      const cardGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
      if (isElite) {
        cardGrad.addColorStop(0, '#1e293b');
        cardGrad.addColorStop(0.5, '#0f172a');
        cardGrad.addColorStop(1, '#334155');
      } else {
        cardGrad.addColorStop(0, '#ffd700');
        cardGrad.addColorStop(0.5, '#b8933b');
        cardGrad.addColorStop(1, '#533c09');
      }

      ctx.fillStyle = cardGrad;
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, 12);
      ctx.fill();

      ctx.strokeStyle = isElite ? '#00f0ff' : '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      if (slot.player) {
        const p = slot.player;

        // Rating & Position
        ctx.fillStyle = isElite ? '#ffffff' : '#000000';
        ctx.font = 'bold 24px Rajdhani, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(p.rating, cardX + 10, cardY + 28);

        ctx.font = 'bold 15px Rajdhani, sans-serif';
        ctx.fillText(p.detailedPosition || p.position, cardX + 10, cardY + 46);

        // Captain tag
        if (p.isCaptain) {
          ctx.fillStyle = '#ffd700';
          ctx.fillRect(cardX + cardW - 32, cardY + 8, 24, 18);
          ctx.fillStyle = '#000000';
          ctx.font = 'bold 12px Rajdhani, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('© C', cardX + cardW - 20, cardY + 22);
        }

        // Player Name
        ctx.fillStyle = isElite ? '#ffffff' : '#000000';
        ctx.font = 'bold 16px Outfit, sans-serif';
        ctx.textAlign = 'center';
        const lastName = p.name.split(' ').pop();
        ctx.fillText(lastName, px, cardY + 115);

        // Club
        ctx.fillStyle = isElite ? '#94a3b8' : '#333333';
        ctx.font = '12px Outfit, sans-serif';
        ctx.fillText(p.club, px, cardY + 134);
      }
    });

    // 5. Watermark / Footer
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '18px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('KUPA DRAFT 26 - Dünya Kupası Kadro Kurma Oyunu', canvas.width / 2, 1460);

    // 6. Trigger Download
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `Kupa_Draft_26_${this.currentFormation}.png`;
    link.href = dataUrl;
    link.click();
  }
}

// Start Game on DOM ready
window.addEventListener('DOMContentLoaded', () => {
  window.game = new FutDraftGame();
});
