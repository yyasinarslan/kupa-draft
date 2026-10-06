/**
 * KUPA DRAFT 26 - ON-PITCH WORLD CUP TOURNAMENT ENGINE
 * Matches are played DIRECTLY ON THE FOOTBALL PITCH!
 * Features:
 *  - Fixed: 5-second auto-countdown on decisions (NEVER hangs at min 30!)
 *  - Live scoreboard docked at top of pitch
 *  - Animated match ball on grass
 *  - Live spiker commentary ticker at bottom of pitch
 *  - 4 Knockout Rounds: Son 16 -> Çeyrek -> Yarı -> Büyük Final
 */

class TournamentEngine {
  constructor(gameInstance) {
    this.game = gameInstance;
    this.currentRoundIndex = 0;
    this.isMatchActive = false;
    this.rounds = [
      {
        id: 'son16',
        name: 'Son 16 Turu',
        intel: '🔥 Son 16 Karşılaşması: Kazanan takım Çeyrek Finale yükselir. Rüya kadronla sahaya çık!',
        opponents: [
          { name: 'Japonya', flag: '🇯🇵', ovr: 81, star: '⭐ Kubo, Mitoma' },
          { name: 'İsviçre', flag: '🇨🇭', ovr: 81, star: '⭐ Xhaka, Akanji' },
          { name: 'Meksika', flag: '🇲🇽', ovr: 80, star: '⭐ Gimenez, Alvarez' },
          { name: 'Fas', flag: '🇲🇦', ovr: 82, star: '⭐ Hakimi, Diaz' }
        ]
      },
      {
        id: 'ceyrek',
        name: 'Çeyrek Final',
        intel: '⚡ Çeyrek Final: Rakipler sertleşiyor! Kazanırsan adını yarı finale yazdıracaksın.',
        opponents: [
          { name: 'Portekiz', flag: '🇵🇹', ovr: 86, star: '⭐ C. Ronaldo, Fernandes' },
          { name: 'Hollanda', flag: '🇳🇱', ovr: 85, star: '⭐ Van Dijk, Gakpo' },
          { name: 'İtalya', flag: '🇮🇹', ovr: 84, star: '⭐ Barella, Donnarumma' },
          { name: 'Uruguay', flag: '🇺🇾', ovr: 84, star: '⭐ Valverde, Nunez' }
        ]
      },
      {
        id: 'yari',
        name: 'Yarı Final',
        intel: '🏟️ Yarı Final: Kupanın eşiğindesin! Bütün dünya bu maçı izliyor, şampiyonluk çok yakın!',
        opponents: [
          { name: 'Brezilya', flag: '🇧🇷', ovr: 87, star: '⭐ Vinicius Jr, Rodrygo' },
          { name: 'İngiltere', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', ovr: 88, star: '⭐ Bellingham, Kane' },
          { name: 'Almanya', flag: '🇩🇪', ovr: 87, star: '⭐ Wirtz, Musiala' }
        ]
      },
      {
        id: 'final',
        name: 'BÜYÜK FİNAL 🏆',
        intel: '👑 2026 DÜNYA KUPASI BÜYÜK FİNALİ: Kazan ve Altın Kupa ile tarihe geç!',
        opponents: [
          { name: 'Fransa', flag: '🇫🇷', ovr: 89, star: '⭐ Mbappé, Griezmann' },
          { name: 'Arjantin', flag: '🇦🇷', ovr: 89, star: '⭐ Messi, Lautaro' },
          { name: 'İspanya', flag: '🇪🇸', ovr: 88, star: '⭐ Yamal, Rodri' }
        ]
      }
    ];

    this.activeOpponent = null;
    this.userScore = 0;
    this.oppScore = 0;
    this.matchMinute = 0;
    this.matchInterval = null;
    this.isMatchPaused = false;
    this.decisionTimer = null;
    this.decisionActivePlayer = null;

    this.tournamentStats = {
      totalGoals: 0,
      goalsByPlayer: {}
    };

    this.isTournamentActive = false;
    this.bindEvents();
  }

  bindEvents() {
    // Open from Victory Modal
    document.getElementById('btnStartTournamentFromVictory')?.addEventListener('click', () => {
      document.getElementById('completionModal').style.display = 'none';
      this.openTournament();
    });

    // Open from Header
    const btnHeader = document.getElementById('btnHeaderTournament');
    btnHeader?.addEventListener('click', () => {
      if (!btnHeader.disabled) this.openTournament();
    });

    // Cancel Tournament Button
    document.getElementById('btnCancelTournament')?.addEventListener('click', () => {
      if (confirm('Turnuvayı iptal edip kadro ekranına dönmek istiyor musun? Turnuva ilerlemen sıfırlanacaktır.')) {
        this.cancelTournament();
      }
    });

    // Close preview
    document.getElementById('btnCloseRoundPreview')?.addEventListener('click', () => {
      this.hideAllOverlays();
    });

    // Start match
    document.getElementById('btnStartMatch')?.addEventListener('click', () => {
      this.startMatch();
    });

    // Exit match
    document.getElementById('btnExitMatch')?.addEventListener('click', () => {
      this.stopMatchSimulation();
      this.hideMatchUi();
      this.hideAllOverlays();
    });

    // Attack decision buttons
    document.getElementById('btnChoicePlase')?.addEventListener('click', () => this.handleDecisionChoice('plase'));
    document.getElementById('btnChoicePower')?.addEventListener('click', () => this.handleDecisionChoice('power'));
    document.getElementById('btnChoicePass')?.addEventListener('click', () => this.handleDecisionChoice('pass'));

    // Goalkeeper Defense decision buttons
    document.getElementById('btnChoiceDiveLeft')?.addEventListener('click', () => this.handleDefenseChoice('left'));
    document.getElementById('btnChoiceRushOut')?.addEventListener('click', () => this.handleDefenseChoice('rush'));
    document.getElementById('btnChoiceDiveRight')?.addEventListener('click', () => this.handleDefenseChoice('right'));

    // Next round
    document.getElementById('btnNextRound')?.addEventListener('click', () => this.nextRound());
    document.getElementById('btnRetryMatch')?.addEventListener('click', () => this.showPreviewView());

    // Download champion card
    document.getElementById('btnDownloadChampionCard')?.addEventListener('click', () => this.downloadChampionCard());
    document.getElementById('btnNewDraftAfterTrophy')?.addEventListener('click', () => {
      this.hideAllOverlays();
      this.hideMatchUi();
      this.isTournamentActive = false;
      document.body.classList.remove('tournament-active', 'match-running');
      this.game.resetDraft();
    });
  }

  cancelTournament() {
    this.stopMatchSimulation();
    this.hideMatchUi();
    this.hideAllOverlays();
    this.isTournamentActive = false;
    this.isMatchActive = false;
    this.currentRoundIndex = 0;
    this.activeOpponent = null;
    document.body.classList.remove('tournament-active', 'match-running');
    this.updateHeaderButton(true);
    window.soundEngine?.playWhistle();
  }

  updateHeaderButton(isReady) {
    const btn = document.getElementById('btnHeaderTournament');
    const badge = document.getElementById('headerTournamentBadge');
    if (!btn) return;

    if (isReady) {
      btn.disabled = false;
      btn.classList.add('ready-glow');
      badge.textContent = `🏆 KUPA (${this.currentRoundIndex}/4)`;
    } else {
      btn.disabled = true;
      btn.classList.remove('ready-glow');
      badge.textContent = `🏆 KUPA (0/4)`;
    }
  }

  openTournament() {
    if (this.game.squadSlots.filter(s => s.player).length < 11) {
      alert('Turnuvaya başlamak için önce 11 kişilik kadronu tamamlamalısın!');
      return;
    }
    this.isTournamentActive = true;
    document.body.classList.add('tournament-active');
    window.soundEngine?.playClick();
    this.showPreviewView();
  }

  showPreviewView() {
    this.stopMatchSimulation();
    this.hideMatchUi();

    const roundData = this.rounds[this.currentRoundIndex];
    if (!this.activeOpponent) {
      const oppList = roundData.opponents;
      this.activeOpponent = oppList[Math.floor(Math.random() * oppList.length)];
    }

    document.getElementById('tournamentRoundTitle').textContent = `${roundData.name} Karşılaşması`;
    this.updateStepper();

    const userRating = this.game.calculateAverageRating(this.game.squadSlots);
    const userChem = this.game.calculateChemistry(this.game.squadSlots);
    const chemBonus = Math.round((userChem / 33) * 5);
    const effectivePower = userRating + chemBonus;
    document.getElementById('previewUserOvr').textContent = `${effectivePower} GÜÇ`;

    document.getElementById('previewOppFlag').textContent = this.activeOpponent.flag;
    document.getElementById('previewOppName').textContent = this.activeOpponent.name;
    document.getElementById('previewOppOvr').textContent = `${this.activeOpponent.ovr} GÜÇ`;

    const diff = effectivePower - this.activeOpponent.ovr;
    let balanceIntel = '';
    if (diff >= 4) {
      balanceIntel = `<br><span style="color: #4ade80;">⚡ <strong>Taktik Analizi:</strong> Kadro kaliten ve ${userChem}/33 kimyan rakibe bariz üstünlük kuruyor (+${diff} Güç). Hücum pozisyonları lehine yoğunlaşacak!</span>`;
    } else if (diff <= -3) {
      balanceIntel = `<br><span style="color: #f87171;">⚠️ <strong>Taktik Analizi:</strong> Rakip çok formda ve tehlikeli (${this.activeOpponent.ovr} GÜÇ)! Savunman ve kalecin kritik anlarda çok terleyecek.</span>`;
    } else {
      balanceIntel = `<br><span style="color: #facc15;">⚖️ <strong>Taktik Analizi:</strong> İki takımın gücü başa baş (${diff >= 0 ? '+' : ''}${diff} Fark). Karşılaşmada her iki kalede de eşit tehlikeler oluşacak!</span>`;
    }

    document.getElementById('roundIntelText').innerHTML = roundData.intel + balanceIntel;

    this.showOverlay('tournamentPreviewView');
  }

  updateStepper() {
    const stepIds = ['stepSon16', 'stepCeyrek', 'stepYari', 'stepFinal'];
    stepIds.forEach((id, idx) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.classList.remove('active', 'completed');
      if (idx < this.currentRoundIndex) el.classList.add('completed');
      else if (idx === this.currentRoundIndex) el.classList.add('active');
    });
  }

  showOverlay(overlayId) {
    this.hideAllOverlays();
    const el = document.getElementById(overlayId);
    if (el) el.style.display = 'flex';
  }

  hideAllOverlays() {
    const overlays = [
      'tournamentPreviewView', 
      'decisionOverlay', 
      'tournamentResultView', 
      'tournamentTrophyView'
    ];
    overlays.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
  }

  showMatchUi() {
    this.isMatchActive = true;
    document.body.classList.add('match-running');
    document.querySelector('.pitch-wrapper')?.classList.add('match-compact-mode');
    document.getElementById('pitchScoreboard').style.display = 'flex';
    document.getElementById('pitchCommentaryBar').style.display = 'flex';
    document.getElementById('pitchMatchBall').style.display = 'block';
  }

  hideMatchUi() {
    this.isMatchActive = false;
    document.body.classList.remove('match-running');
    document.querySelector('.pitch-wrapper')?.classList.remove('match-compact-mode');
    document.getElementById('pitchScoreboard').style.display = 'none';
    document.getElementById('pitchCommentaryBar').style.display = 'none';
    document.getElementById('pitchMatchBall').style.display = 'none';
  }

  // ==========================================
  // START ON-PITCH MATCH
  // ==========================================
  startMatch() {
    this.hideAllOverlays();
    this.showMatchUi();
    window.soundEngine.playWhistle();

    this.userScore = 0;
    this.oppScore = 0;
    this.matchMinute = 0;
    this.isMatchPaused = false;
    this.scorersList = [];

    // Scoreboard setup
    document.getElementById('sbUserScore').textContent = '0';
    document.getElementById('sbOppScore').textContent = '0';
    document.getElementById('sbMatchMinute').textContent = "0'";
    document.getElementById('sbOppName').textContent = this.activeOpponent.name.toUpperCase();
    document.getElementById('sbOppFlag').textContent = this.activeOpponent.flag;
    document.getElementById('sbRoundTag').textContent = this.rounds[this.currentRoundIndex].name.toUpperCase();

    // Calculate rating, chemistry, and effective power advantage
    const userRating = this.game.calculateAverageRating(this.game.squadSlots);
    const userChem = this.game.calculateChemistry(this.game.squadSlots);
    const chemBonus = (userChem / 33) * 5; // Up to +5 boost for perfect 33 chemistry
    const userPower = userRating + chemBonus;
    this.powerAdvantage = userPower - this.activeOpponent.ovr;

    // Scoreboard setup
    document.getElementById('sbUserScore').textContent = '0';
    document.getElementById('sbOppScore').textContent = '0';
    document.getElementById('sbMatchMinute').textContent = "0'";
    document.getElementById('sbOppName').textContent = this.activeOpponent.name.toUpperCase();
    document.getElementById('sbOppFlag').textContent = this.activeOpponent.flag;
    document.getElementById('sbRoundTag').textContent = this.rounds[this.currentRoundIndex].name.toUpperCase();

    // Opening live spiker announcement according to power balance
    if (this.powerAdvantage >= 4) {
      this.updateLiveSpiker(`📢 Düdük çaldı! Kadro kalitemiz ve ${userChem}/33 kimyamız sahada bariz üstün, akın akın hücum edeceğiz!`);
    } else if (this.powerAdvantage <= -3) {
      this.updateLiveSpiker(`⚠️ Düdük çaldı! Rakip çok baskılı (${this.activeOpponent.ovr} GÜÇ), savunmamız ve kalecimiz bugün test edilecek!`);
    } else {
      this.updateLiveSpiker(`📢 Hakem ilk düdüğü çaldı! ${this.rounds[this.currentRoundIndex].name} başladı!`);
    }

    // Algorithmic generation of attack vs defense decision events
    this.decisionEvents = this.generateMatchDecisionEvents(this.powerAdvantage);

    this.startMatchTimer();
  }

  // ==========================================
  // DYNAMIC SQUAD QUALITY & CHEMISTRY ALGORITHM
  // Higher rating & chemistry = more attack chances, less defense danger
  // Lower rating & chemistry = fewer attacks, more defensive danger
  // ==========================================
  generateMatchDecisionEvents(powerDiff) {
    // Probability that any key moment favors the user (Attack)
    // 0 diff = 50%
    // +6 diff = 80% attack chance
    // -6 diff = 20% attack chance
    let attackProb = 0.50 + (powerDiff * 0.05);
    attackProb = Math.max(0.18, Math.min(0.85, attackProb));

    // Heavy power disparity creates higher tempo (4 events), balanced match has 3 events
    let eventCount = 3;
    if (Math.abs(powerDiff) >= 4) {
      eventCount = 4;
    }

    const brackets = [
      { min: 18, max: 28 }, // Early pressure
      { min: 34, max: 44 }, // Late 1st half
      { min: 54, max: 64 }, // Early 2nd half
      { min: 74, max: 84 }  // Crunch time
    ];

    const selectedBrackets = (eventCount === 4) 
      ? brackets 
      : [brackets[0], brackets[2], brackets[3]];

    const events = [];
    let attackCount = 0;
    let defenseCount = 0;

    // Difficulty modifier from game settings
    const diff = (this.game.settings && this.game.settings.difficulty) ? this.game.settings.difficulty : 'normal';
    let adjustedAttackProb = attackProb;
    if (diff === 'easy') adjustedAttackProb = Math.min(0.85, attackProb + 0.12);
    if (diff === 'hard') adjustedAttackProb = Math.max(0.20, attackProb - 0.12);

    selectedBrackets.forEach(b => {
      const minute = Math.floor(b.min + Math.random() * (b.max - b.min + 1));
      const isAttack = Math.random() < adjustedAttackProb;
      if (isAttack) {
        events.push({ minute, type: 'attack' });
        attackCount++;
      } else {
        events.push({ minute, type: 'defense' });
        defenseCount++;
      }
    });

    // Guardrails ensuring gameplay alignment:
    // Superior squad (powerDiff >= 2): Guarantee at least 2 attacks
    if (powerDiff >= 2 && attackCount < 2) {
      events[0].type = 'attack';
      if (events.length > 2) events[1].type = 'attack';
    }
    // Underdog squad (powerDiff <= -2): Guarantee at least 2 defensive trials
    if (powerDiff <= -2 && defenseCount < 2) {
      events[events.length - 1].type = 'defense';
      if (events.length > 2) events[events.length - 2].type = 'defense';
    }
    // Dominant squad (powerDiff >= 5): Attacks must strictly outnumber defenses
    if (powerDiff >= 5) {
      events[0].type = 'attack';
      events[events.length - 1].type = 'attack';
    }

    return events.sort((a, b) => a.minute - b.minute);
  }

  getDecisionDuration() {
    const diff = (this.game.settings && this.game.settings.difficulty) ? this.game.settings.difficulty : 'normal';
    if (diff === 'easy') return 7000;
    if (diff === 'hard') return 3500;
    return 5000;
  }

  startMatchTimer() {
    this.stopMatchSimulation();

    const speed = (this.game.settings && this.game.settings.speed) ? this.game.settings.speed : 1;
    const intervalMs = Math.max(150, Math.round(450 / speed));

    this.matchInterval = setInterval(() => {
      if (this.isMatchPaused) return;

      this.matchMinute += 2;
      document.getElementById('sbMatchMinute').textContent = `${this.matchMinute}'`;
      this.moveBallOnPitch();

      // Check Decision Trigger (Attack or Defense)
      if (this.decisionEvents.length > 0 && this.matchMinute >= this.decisionEvents[0].minute) {
        const nextEvt = this.decisionEvents.shift();
        if (nextEvt.type === 'defense') {
          this.triggerDefenseDecision();
        } else {
          this.triggerAttackDecision();
        }
        return;
      }

      // Check Ambient Commentary
      this.checkAmbientMatchEvent();

      // End of 90'
      if (this.matchMinute >= 90) {
        this.stopMatchSimulation();
        this.endMatch();
      }
    }, intervalMs);
  }

  exitCurrentMatch() {
    this.stopMatchSimulation();
    this.hideMatchUi();
    this.hideAllOverlays();
    this.isMatchActive = false;
    this.isTournamentActive = false;
    this.currentRoundIndex = 0;
    this.activeOpponent = null;
    this.updateHeaderButton(this.game.squadSlots.every(s => s.player));
  }

  stopMatchSimulation() {
    if (this.matchInterval) {
      clearInterval(this.matchInterval);
      this.matchInterval = null;
    }
    if (this.decisionTimer) {
      clearTimeout(this.decisionTimer);
      this.decisionTimer = null;
    }
  }

  moveBallOnPitch() {
    const ball = document.getElementById('pitchMatchBall');
    if (!ball) return;

    // Pick a player slot to pass to
    const filled = this.game.squadSlots.filter(s => s.player);
    if (filled.length > 0) {
      const target = filled[Math.floor(Math.random() * filled.length)];
      ball.style.left = `${target.x}%`;
      ball.style.top = `${target.y}%`;
    }
  }

  updateLiveSpiker(text, type = 'normal') {
    const spikerEl = document.getElementById('pcbLiveText');
    if (spikerEl) {
      spikerEl.innerHTML = text;
      spikerEl.className = `pcb-text ${type}`;
    }
  }

  checkAmbientMatchEvent() {
    const min = this.matchMinute;

    if (min === 14) {
      const mid = this.getRandomUserPlayer(['MID', 'MO', 'MOO', 'MDO']);
      this.updateLiveSpiker(`🔥 <strong>${min}'</strong> ${mid.name} harika bir ara pasıyla hücumu başlattı!`);
    } else if (min === 46) {
      this.updateLiveSpiker(`⏱️ <strong>45'</strong> İlk yarı bitti. Skor: Rüya Takım ${this.userScore} - ${this.oppScore} ${this.activeOpponent.name}`);
    } else if (min === 64) {
      const def = this.getRandomUserPlayer(['DEF', 'STP', 'SLB', 'SĞB']);
      this.updateLiveSpiker(`🛡️ <strong>${min}'</strong> ${def.name} savunmada kritik bir müdahaleyle topu kazandı.`);
    }
  }

  getUserGoalkeeper() {
    const gkSlot = this.game.squadSlots.find(s => 
      s.player && (s.player.position === 'GK' || s.detailed === 'KL' || s.category === 'GK')
    );
    if (gkSlot && gkSlot.player) return gkSlot.player;
    return this.getRandomUserPlayer(['GK', 'KL']) || { name: 'Kaleci', rating: 82, stats: { def: 82, phy: 80 } };
  }

  getOpponentStarName() {
    if (!this.activeOpponent) return 'Rakip Forvet';
    const raw = this.activeOpponent.star || '';
    const clean = raw.replace('⭐', '').split(',')[0].trim();
    return clean || this.activeOpponent.name;
  }

  // ==========================================
  // 1. ATTACK DECISION MOMENT (User Scores)
  // ==========================================
  triggerAttackDecision() {
    this.isMatchPaused = true;
    window.soundEngine.playReveal();

    const star = this.getRandomUserPlayer(['FWD', 'SNT', 'SĞK', 'SLK', 'MOO']);
    this.decisionActivePlayer = star;

    const overlay = document.getElementById('decisionOverlay');
    const badge = document.getElementById('pdecBadge');
    const title = document.getElementById('decisionTitle');
    const desc = document.getElementById('decisionDesc');
    const timerFill = document.getElementById('pdecTimerFill');

    if (badge) {
      badge.textContent = '⚡ KRİTİK GOL ANI!';
      badge.className = 'pdec-badge';
    }

    const durationMs = this.getDecisionDuration();
    const durationSec = durationMs / 1000;

    title.textContent = `⚡ ${this.matchMinute}. DAKİKA: Kaleciyle Karşı Karşıya!`;
    desc.innerHTML = `
      🔥 <strong>${star.name}</strong> (${star.rating} Rating) ceza sahasına fırtına gibi girdi!
      <br><strong>${durationSec} saniye içinde karar ver (Seçmezsen otomatik şut çekilir):</strong>
    `;

    document.getElementById('pdecAttackButtons').style.display = 'flex';
    document.getElementById('pdecDefenseButtons').style.display = 'none';

    // Start countdown animation with dynamic difficulty duration
    if (timerFill) {
      timerFill.style.transition = 'none';
      timerFill.style.width = '100%';
      setTimeout(() => {
        timerFill.style.transition = `width ${durationSec}s linear`;
        timerFill.style.width = '0%';
      }, 50);
    }

    overlay.style.display = 'flex';

    // Auto-resolve after dynamic seconds if user doesn't click
    this.decisionTimer = setTimeout(() => {
      if (this.isMatchPaused) {
        this.handleDecisionChoice('power'); // default to power shot
      }
    }, durationMs);
  }

  triggerCriticalDecision() {
    this.triggerAttackDecision();
  }

  handleDecisionChoice(choiceType) {
    if (this.decisionTimer) {
      clearTimeout(this.decisionTimer);
      this.decisionTimer = null;
    }

    document.getElementById('decisionOverlay').style.display = 'none';
    this.isMatchPaused = false;
    window.soundEngine.playClick();

    const player = this.decisionActivePlayer;
    let isGoal = false;
    let comment = '';

    const stats = player.stats || { sho: 80, dri: 80, pas: 80, pac: 80 };
    const powerBonus = Math.max(-6, Math.min(6, (this.powerAdvantage || 0)));
    const roll = Math.random() * 100;

    if (choiceType === 'plase') {
      const threshold = (stats.dri * 0.5 + stats.sho * 0.5) - 15 + powerBonus;
      if (roll < threshold) {
        isGoal = true;
        comment = `🎯 <strong>GOOOOOOL!</strong> ${player.name} adrese teslim bir plaseyle 90'a astı!`;
      } else {
        comment = `🧤 <strong>DİREK!</strong> ${player.name}'in plasesini kaleci son anda parmaklarıyla çeldi!`;
      }
    } else if (choiceType === 'power') {
      const threshold = (stats.sho * 0.7 + stats.pac * 0.3) - 14 + powerBonus;
      if (roll < threshold) {
        isGoal = true;
        comment = `⚡ <strong>GOOOOOOL!</strong> ${player.name} öyle bir füze çıkardı ki fileler yırtıldı!`;
      } else {
        comment = `💥 <strong>DİREKTE PATLADI!</strong> ${player.name}'in müthiş füzesi direkte patladı!`;
      }
    } else if (choiceType === 'pass') {
      const threshold = (stats.pas * 0.6 + stats.dri * 0.4) - 10 + powerBonus;
      const target = this.getRandomUserPlayer(['FWD', 'SNT', 'MID', 'MOO'], player.id);
      if (roll < threshold) {
        isGoal = true;
        comment = `👟 <strong>AL DA AT!</strong> ${player.name}'in nefis pasında ${target.name} boş kaleye yuvarladı! GOOOOOOL!`;
        this.recordGoal(target.name);
      } else {
        comment = `🛡️ <strong>SAVUNMA!</strong> ${player.name}'in pasını savunma son anda kayarak önledi!`;
      }
    }

    if (isGoal) {
      this.userScore++;
      document.getElementById('sbUserScore').textContent = this.userScore;
      if (choiceType !== 'pass') this.recordGoal(player.name);
      window.soundEngine.playGoalHorn();
      window.soundEngine.playCrowdCheer();
      this.updateLiveSpiker(comment, 'goal');
    } else {
      window.soundEngine.playWhistle();
      this.updateLiveSpiker(comment, 'highlight');
    }
  }

  // ==========================================
  // 2. DEFENSE DECISION MOMENT (Goalkeeper Saves or Concedes)
  // ==========================================
  triggerDefenseDecision() {
    this.isMatchPaused = true;
    window.soundEngine.playWhistle();

    const gk = this.getUserGoalkeeper();
    const oppStar = this.getOpponentStarName();
    this.defenseActiveGk = gk;
    this.defenseActiveOppStar = oppStar;

    // Opponent picks secret shot direction: 'left', 'rush', 'right'
    const directions = ['left', 'rush', 'right'];
    this.oppSecretChoice = directions[Math.floor(Math.random() * directions.length)];

    const overlay = document.getElementById('decisionOverlay');
    const badge = document.getElementById('pdecBadge');
    const title = document.getElementById('decisionTitle');
    const desc = document.getElementById('decisionDesc');
    const timerFill = document.getElementById('pdecTimerFill');

    if (badge) {
      badge.textContent = '🛡️ TEHLİKE: KALECİNLE KURTAR!';
      badge.className = 'pdec-badge defense';
    }

    const durationMs = this.getDecisionDuration();
    const durationSec = durationMs / 1000;

    title.textContent = `⚡ ${this.matchMinute}. DAKİKA: Kalenle Karşı Karşıya!`;
    desc.innerHTML = `
      ⚠️ <strong>${oppStar}</strong> (${this.activeOpponent.name}) savunmanı deldi ve karşı karşıya kaldı!
      <br>Kalecin <strong>${gk.name}</strong> (${gk.rating} OVR) nereye hamle yapsın? Yanlış seçersen gol yiyeceksin! (${durationSec} sn):
    `;

    document.getElementById('pdecAttackButtons').style.display = 'none';
    document.getElementById('pdecDefenseButtons').style.display = 'flex';

    if (timerFill) {
      timerFill.style.transition = 'none';
      timerFill.style.width = '100%';
      setTimeout(() => {
        timerFill.style.transition = `width ${durationSec}s linear`;
        timerFill.style.width = '0%';
      }, 50);
    }

    overlay.style.display = 'flex';

    // Auto-resolve after dynamic seconds: if user does not choose, opponent scores!
    this.decisionTimer = setTimeout(() => {
      if (this.isMatchPaused) {
        this.handleDefenseChoice('none');
      }
    }, durationMs);
  }

  handleDefenseChoice(userChoice) {
    if (this.decisionTimer) {
      clearTimeout(this.decisionTimer);
      this.decisionTimer = null;
    }

    document.getElementById('decisionOverlay').style.display = 'none';
    this.isMatchPaused = false;
    window.soundEngine.playClick();

    const gk = this.defenseActiveGk || this.getUserGoalkeeper();
    const oppStar = this.defenseActiveOppStar || this.getOpponentStarName();
    const isCorrect = (userChoice === this.oppSecretChoice);

    // High rating bonus: elite GK (86+) has reflex chance even if wrong choice
    const reflexSave = (!isCorrect && userChoice !== 'none' && Math.random() < Math.max(0, (gk.rating - 80) * 0.015));

    if (isCorrect || reflexSave) {
      // Goalkeeper successfully saves!
      window.soundEngine.playWhistle();
      window.soundEngine.playCrowdCheer();

      let comment = '';
      if (userChoice === 'left') {
        comment = `🧤 <strong>MÜTHİŞ PLONJON!</strong> ${gk.name} sol köşeye adeta uçtu ve ${oppStar}'in füzesini kornere çeldi!`;
      } else if (userChoice === 'right') {
        comment = `🧤 <strong>HARİKA KURTARIŞ!</strong> ${gk.name} sağ direk dibine uzandı ve ${oppStar}'in şutunu çıkardı!`;
      } else if (userChoice === 'rush') {
        comment = `🧤 <strong>CESUR HAMLE!</strong> ${gk.name} zamanında kalesinden açıldı, ${oppStar}'in ayaklarına kapanarak mutlak golü önledi!`;
      } else {
        comment = `🧤 <strong>İNANILMAZ REFLEKS!</strong> ${gk.name} ters ayakta yakalanmasına rağmen ayağıyla golü çizgiden çıkardı!`;
      }
      this.updateLiveSpiker(comment, 'highlight');
    } else {
      // Conceded goal!
      this.oppScore++;
      document.getElementById('sbOppScore').textContent = this.oppScore;
      window.soundEngine.playWhistle();

      let comment = '';
      if (userChoice === 'none') {
        comment = `⚽ <strong>GOL!</strong> Kararsız kalındı! ${oppStar} boş köşeye yuvarladı ve ${this.activeOpponent.name} golü buldu!`;
      } else {
        const choiceLabels = { left: 'sol köşeye uzandı', right: 'sağ köşeye uzandı', rush: 'öne çıktı' };
        comment = `⚽ <strong>GOL!</strong> ${gk.name} ${choiceLabels[userChoice] || 'hamle yaptı'} ama ${oppStar} ters köşeye astı! Skor: Rüya Takım ${this.userScore} - ${this.oppScore} ${this.activeOpponent.name}`;
      }
      this.updateLiveSpiker(comment, 'danger');
    }
  }

  recordGoal(playerName) {
    this.scorersList.push(playerName);
    this.tournamentStats.totalGoals++;
    this.tournamentStats.goalsByPlayer[playerName] = (this.tournamentStats.goalsByPlayer[playerName] || 0) + 1;
  }

  getRandomUserPlayer(allowedPosCategories, excludeId = null) {
    const players = this.game.squadSlots
      .filter(s => s.player && (!excludeId || s.player.id !== excludeId))
      .map(s => s.player);

    const filtered = players.filter(p => 
      allowedPosCategories.includes(p.position) || 
      allowedPosCategories.includes(p.detailedPosition)
    );

    return filtered.length > 0 
      ? filtered[Math.floor(Math.random() * filtered.length)]
      : players[Math.floor(Math.random() * players.length)];
  }

  // ==========================================
  // MATCH END & RESULTS
  // ==========================================
  endMatch() {
    window.soundEngine.playWhistle();

    // No ties in World Cup Knockouts
    if (this.userScore === this.oppScore) {
      this.userScore++;
      const hero = this.getRandomUserPlayer(['FWD', 'MOO']);
      this.recordGoal(hero.name);
      this.updateLiveSpiker(`⚽ <strong>90+3' ALTIN GOL!</strong> ${hero.name} maçı kazandıran golü attı!`, 'goal');
      document.getElementById('sbUserScore').textContent = this.userScore;
    }

    setTimeout(() => {
      this.showMatchResultView();
    }, 1200);
  }

  showMatchResultView() {
    this.hideMatchUi();

    const isWinner = this.userScore > this.oppScore;
    const isGrandFinal = this.currentRoundIndex === 3;

    document.getElementById('resultUserScore').textContent = this.userScore;
    document.getElementById('resultOppScore').textContent = this.oppScore;
    document.getElementById('resultOppName').textContent = this.activeOpponent.name;
    document.getElementById('resultOppFlag').textContent = this.activeOpponent.flag;

    const scorersBox = document.getElementById('matchScorersBox');
    if (this.scorersList.length > 0) {
      scorersBox.innerHTML = `<strong>⚽ Goller:</strong> ${this.scorersList.join(', ')}`;
      scorersBox.style.display = 'block';
    } else {
      scorersBox.style.display = 'none';
    }

    const title = document.getElementById('resultTitle');
    const icon = document.getElementById('resultIcon');
    const btnNext = document.getElementById('btnNextRound');
    const btnRetry = document.getElementById('btnRetryMatch');

    if (isWinner) {
      window.soundEngine?.playVictory();
      window.confettiEngine?.fire(120, 3500);

      if (isGrandFinal) {
        setTimeout(() => this.showTrophyView(), 1500);
        return;
      }

      icon.textContent = '🎉';
      title.textContent = 'TURU GEÇTİN! TEBRİKLER!';
      btnNext.style.display = 'inline-flex';
      btnRetry.style.display = 'none';
      btnNext.querySelector('span').textContent = 'SONRAKİ MAÇA GEÇ ➔';
    } else {
      icon.textContent = '😢';
      title.textContent = 'MAĞLUBİYET! PES ETME!';
      btnNext.style.display = 'none';
      btnRetry.style.display = 'inline-flex';
    }

    this.showOverlay('tournamentResultView');
  }

  nextRound() {
    window.soundEngine?.playClick();
    this.currentRoundIndex++;
    this.activeOpponent = null;

    if (this.currentRoundIndex >= 4) {
      this.showTrophyView();
    } else {
      this.updateHeaderButton(true);
      this.showPreviewView();
    }
  }

  showTrophyView() {
    this.hideMatchUi();
    this.showOverlay('tournamentTrophyView');
    window.soundEngine?.playVictory();
    window.confettiEngine?.fire(200, 5000);

    let topScorerName = 'Kylian Mbappé';
    let maxGoals = 0;
    for (let p in this.tournamentStats.goalsByPlayer) {
      if (this.tournamentStats.goalsByPlayer[p] > maxGoals) {
        maxGoals = this.tournamentStats.goalsByPlayer[p];
        topScorerName = p;
      }
    }
    if (maxGoals === 0) maxGoals = 4;

    const captain = this.game.squadSlots.find(s => s.player && s.player.isCaptain)?.player;
    const mvpName = captain ? captain.name : topScorerName;

    document.getElementById('awardMvpName').textContent = mvpName;
    document.getElementById('awardGoldenBoot').textContent = `${topScorerName} (${maxGoals} Gol)`;
    document.getElementById('awardChemVal').textContent = `${this.game.calculateChemistry(this.game.squadSlots)} / 33`;

    setTimeout(() => window.confettiEngine?.fire(100, 3000), 800);
    setTimeout(() => window.confettiEngine?.fire(100, 3000), 1800);
  }

  downloadChampionCard() {
    window.soundEngine.playClick();
    const canvas = document.getElementById('exportCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 1200;
    canvas.height = 700;

    const grad = ctx.createLinearGradient(0, 0, 1200, 700);
    grad.addColorStop(0, '#0a0e17');
    grad.addColorStop(0.5, '#1e293b');
    grad.addColorStop(1, '#050811');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 700);

    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, 1160, 660);

    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 32px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🏆 2026 DÜNYA KUPASI ŞAMPİYONU 🏆', 600, 80);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px Outfit, sans-serif';
    ctx.fillText('RÜYA TAKIM 26', 600, 140);

    const userRating = this.game.calculateAverageRating(this.game.squadSlots);
    const userChem = this.game.calculateChemistry(this.game.squadSlots);
    ctx.fillStyle = '#00f0ff';
    ctx.font = '24px Outfit, sans-serif';
    ctx.fillText(`Kadro Gücü: ${userRating}  |  Kimya: ${userChem}/33  |  Diziliş: ${this.game.currentFormation}`, 600, 185);

    ctx.textAlign = 'left';
    ctx.font = '20px Outfit, sans-serif';
    const slots = this.game.squadSlots.filter(s => s.player);

    slots.forEach((s, idx) => {
      const col = idx < 6 ? 120 : 660;
      const row = 250 + (idx % 6) * 55;

      ctx.fillStyle = '#ffd700';
      ctx.fillText(`${s.label}:`, col, row);

      ctx.fillStyle = '#ffffff';
      const capTag = s.player.isCaptain ? ' (K)' : '';
      ctx.fillText(`${s.player.name}${capTag}`, col + 70, row);

      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`${s.player.teamFlag} ${s.player.rating}`, col + 380, row);
    });

    ctx.textAlign = 'center';
    ctx.fillStyle = '#64748b';
    ctx.font = 'italic 16px Outfit, sans-serif';
    ctx.fillText('Kupa Draft 26 • Dünya Kupası Şampiyonu Hatıra Kartı', 600, 640);

    const link = document.createElement('a');
    link.download = 'Dunya-Sampiyonu-Ruya-Takim-2026.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }
}

window.TournamentEngine = TournamentEngine;
