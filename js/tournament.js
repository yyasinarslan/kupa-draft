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

    // Decision buttons
    document.getElementById('btnChoicePlase')?.addEventListener('click', () => this.handleDecisionChoice('plase'));
    document.getElementById('btnChoicePower')?.addEventListener('click', () => this.handleDecisionChoice('power'));
    document.getElementById('btnChoicePass')?.addEventListener('click', () => this.handleDecisionChoice('pass'));

    // Next round
    document.getElementById('btnNextRound')?.addEventListener('click', () => this.nextRound());
    document.getElementById('btnRetryMatch')?.addEventListener('click', () => this.showPreviewView());

    // Download champion card
    document.getElementById('btnDownloadChampionCard')?.addEventListener('click', () => this.downloadChampionCard());
    document.getElementById('btnNewDraftAfterTrophy')?.addEventListener('click', () => {
      this.hideAllOverlays();
      this.hideMatchUi();
      this.game.resetDraft();
    });
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
    window.soundEngine.playClick();
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
    document.getElementById('previewUserOvr').textContent = `${userRating} GÜÇ`;

    document.getElementById('previewOppFlag').textContent = this.activeOpponent.flag;
    document.getElementById('previewOppName').textContent = this.activeOpponent.name;
    document.getElementById('previewOppOvr').textContent = `${this.activeOpponent.ovr} GÜÇ`;

    document.getElementById('roundIntelText').innerHTML = roundData.intel;

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

    this.updateLiveSpiker(`📢 Hakem ilk düdüğü çaldı! ${this.rounds[this.currentRoundIndex].name} başladı!`);

    // Plan decision points
    this.decisionMinutes = [
      Math.floor(28 + Math.random() * 8), // around min 30
      Math.floor(70 + Math.random() * 8)  // around min 72
    ];

    const userRating = this.game.calculateAverageRating(this.game.squadSlots);
    const userChem = this.game.calculateChemistry(this.game.squadSlots);
    const userPower = userRating + (userChem / 33) * 4;
    this.powerAdvantage = userPower - this.activeOpponent.ovr;

    this.startMatchTimer();
  }

  startMatchTimer() {
    this.stopMatchSimulation();

    this.matchInterval = setInterval(() => {
      if (this.isMatchPaused) return;

      this.matchMinute += 2;
      document.getElementById('sbMatchMinute').textContent = `${this.matchMinute}'`;
      this.moveBallOnPitch();

      // Check Decision Trigger
      if (this.decisionMinutes.length > 0 && this.matchMinute >= this.decisionMinutes[0]) {
        this.decisionMinutes.shift();
        this.triggerCriticalDecision();
        return;
      }

      // Check Ambient Commentary
      this.checkAmbientMatchEvent();

      // End of 90'
      if (this.matchMinute >= 90) {
        this.stopMatchSimulation();
        this.endMatch();
      }
    }, 450);
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
    const rnd = Math.random();

    if (min === 14) {
      const mid = this.getRandomUserPlayer(['MID', 'MO', 'MOO', 'MDO']);
      this.updateLiveSpiker(`🔥 <strong>${min}'</strong> ${mid.name} harika bir ara pasıyla hücumu başlattı!`);
    } else if (min === 46) {
      this.updateLiveSpiker(`⏱️ <strong>45'</strong> İlk yarı bitti. Skor: Rüya Takım ${this.userScore} - ${this.oppScore} ${this.activeOpponent.name}`);
    } else if (min === 54 && rnd < 0.35) {
      if (this.powerAdvantage < 2 && Math.random() < 0.45 && this.oppScore <= this.userScore) {
        this.oppScore++;
        document.getElementById('sbOppScore').textContent = this.oppScore;
        window.soundEngine.playWhistle();
        this.updateLiveSpiker(`⚽ <strong>${min}' GOL!</strong> ${this.activeOpponent.name} hızlı hücumla golü buldu!`, 'danger');
      } else {
        const gk = this.getRandomUserPlayer(['GK', 'KL']);
        this.updateLiveSpiker(`🧤 <strong>${min}' HARİKA KURTARIŞ!</strong> ${gk.name} kalesinde devleşti!`, 'highlight');
      }
    } else if (min === 64) {
      const def = this.getRandomUserPlayer(['DEF', 'STP', 'SLB', 'SĞB']);
      this.updateLiveSpiker(`🛡️ <strong>${min}'</strong> ${def.name} savunmada kritik bir müdahaleyle topu kazandı.`);
    } else if (min === 84 && rnd < 0.30 && this.userScore <= this.oppScore) {
      const fwd = this.getRandomUserPlayer(['FWD', 'SNT', 'SĞK', 'SLK']);
      this.userScore++;
      document.getElementById('sbUserScore').textContent = this.userScore;
      this.recordGoal(fwd.name);
      window.soundEngine.playGoalHorn();
      window.soundEngine.playCrowdCheer();
      this.updateLiveSpiker(`⚽ <strong>${min}' GOOOOOOL!</strong> ${fwd.name} topu ağlara yolladı!`, 'goal');
    }
  }

  // ==========================================
  // CRITICAL DECISION MOMENT (With 5s Auto-Timer!)
  // ==========================================
  triggerCriticalDecision() {
    this.isMatchPaused = true;
    window.soundEngine.playReveal();

    const star = this.getRandomUserPlayer(['FWD', 'SNT', 'SĞK', 'SLK', 'MOO']);
    this.decisionActivePlayer = star;

    const overlay = document.getElementById('decisionOverlay');
    const title = document.getElementById('decisionTitle');
    const desc = document.getElementById('decisionDesc');
    const timerFill = document.getElementById('pdecTimerFill');

    title.textContent = `⚡ ${this.matchMinute}. DAKİKA: Kaleciyle Karşı Karşıya!`;
    desc.innerHTML = `
      🔥 <strong>${star.name}</strong> (${star.rating} Rating) ceza sahasına fırtına gibi girdi!
      <br><strong>5 saniye içinde karar ver (Seçmezsen otomatik şut çekilir):</strong>
    `;

    // Start 5-second countdown animation
    if (timerFill) {
      timerFill.style.transition = 'none';
      timerFill.style.width = '100%';
      setTimeout(() => {
        timerFill.style.transition = 'width 5s linear';
        timerFill.style.width = '0%';
      }, 50);
    }

    overlay.style.display = 'flex';

    // Auto-resolve after 5 seconds if child doesn't click (NEVER FREEZES!)
    this.decisionTimer = setTimeout(() => {
      if (this.isMatchPaused) {
        this.handleDecisionChoice('power'); // default to thrilling power shot!
      }
    }, 5000);
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
    const roll = Math.random() * 100;

    if (choiceType === 'plase') {
      const threshold = (stats.dri * 0.5 + stats.sho * 0.5) - 15;
      if (roll < threshold) {
        isGoal = true;
        comment = `🎯 <strong>GOOOOOOL!</strong> ${player.name} adrese teslim bir plaseyle 90'a astı!`;
      } else {
        comment = `🧤 <strong>DİREK!</strong> ${player.name}'in plasesini kaleci son anda parmaklarıyla çeldi!`;
      }
    } else if (choiceType === 'power') {
      const threshold = (stats.sho * 0.7 + stats.pac * 0.3) - 14;
      if (roll < threshold) {
        isGoal = true;
        comment = `⚡ <strong>GOOOOOOL!</strong> ${player.name} öyle bir füze çıkardı ki fileler yırtıldı!`;
      } else {
        comment = `💥 <strong>DİREKTE PATLADI!</strong> ${player.name}'in müthiş füzesi direkte patladı!`;
      }
    } else if (choiceType === 'pass') {
      const threshold = (stats.pas * 0.6 + stats.dri * 0.4) - 10;
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
