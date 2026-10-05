/**
 * KUPA DRAFT 26 - World Cup Tournament & Interactive Match Engine
 * 4-Round Knockout (Son 16 -> Çeyrek -> Yarı -> Büyük Final)
 * Live Commentary, Audio Effects, Decision QTEs, Confetti & Trophy Ceremony
 */

class TournamentEngine {
  constructor(gameInstance) {
    this.game = gameInstance;
    this.currentRoundIndex = 0; // 0: Son 16, 1: Çeyrek, 2: Yarı, 3: Final
    this.rounds = [
      {
        id: 'son16',
        name: 'Son 16 Turu',
        intel: '🔥 Son 16 Karşılaşması: Kazanan takım doğrudan Çeyrek Finale yükselir. Kadronun gücünü sahada göster!',
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
        intel: '⚡ Çeyrek Final: Rakipler giderek sertleşiyor! Kazanırsan adını yarı finale yazdıracaksın.',
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
    this.tournamentStats = {
      totalGoals: 0,
      goalsByPlayer: {},
      cleanSheets: 0
    };

    this.bindEvents();
  }

  bindEvents() {
    // Open from Victory Modal
    const btnFromVictory = document.getElementById('btnStartTournamentFromVictory');
    if (btnFromVictory) {
      btnFromVictory.addEventListener('click', () => {
        document.getElementById('completionModal').style.display = 'none';
        this.openTournament();
      });
    }

    // Open from Header
    const btnHeader = document.getElementById('btnHeaderTournament');
    if (btnHeader) {
      btnHeader.addEventListener('click', () => {
        if (!btnHeader.disabled) {
          this.openTournament();
        }
      });
    }

    // Close Tournament Modal
    const btnClose = document.getElementById('btnCloseTournamentModal');
    if (btnClose) {
      btnClose.addEventListener('click', () => {
        this.closeTournament();
      });
    }

    // Start Match button
    const btnStart = document.getElementById('btnStartMatch');
    if (btnStart) {
      btnStart.addEventListener('click', () => {
        this.startMatch();
      });
    }

    // Next Round button
    const btnNext = document.getElementById('btnNextRound');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        this.nextRound();
      });
    }

    // Retry Match button
    const btnRetry = document.getElementById('btnRetryMatch');
    if (btnRetry) {
      btnRetry.addEventListener('click', () => {
        this.showPreviewView();
      });
    }

    // Decision Choices
    document.getElementById('btnChoicePlase')?.addEventListener('click', () => this.handleDecisionChoice('plase'));
    document.getElementById('btnChoicePower')?.addEventListener('click', () => this.handleDecisionChoice('power'));
    document.getElementById('btnChoicePass')?.addEventListener('click', () => this.handleDecisionChoice('pass'));

    // Download Champion card
    document.getElementById('btnDownloadChampionCard')?.addEventListener('click', () => {
      this.downloadChampionCard();
    });

    // New Draft after trophy
    document.getElementById('btnNewDraftAfterTrophy')?.addEventListener('click', () => {
      this.closeTournament();
      this.game.resetGame();
    });
  }

  openTournament() {
    if (this.game.squadSlots.filter(s => s.player).length < 11) {
      alert('Turnuvaya başlamak için önce ilk 11 kadronu tamamlamalısın!');
      return;
    }

    window.soundEngine.playClick();
    document.getElementById('tournamentModal').style.display = 'flex';
    this.showPreviewView();
  }

  closeTournament() {
    this.stopMatchSimulation();
    document.getElementById('tournamentModal').style.display = 'none';
  }

  updateHeaderButton(isReady) {
    const btnHeader = document.getElementById('btnHeaderTournament');
    const badge = document.getElementById('headerTournamentBadge');
    if (!btnHeader) return;

    if (isReady) {
      btnHeader.disabled = false;
      btnHeader.classList.add('ready-glow');
      badge.textContent = `🏆 KUPA (${this.currentRoundIndex}/4)`;
    } else {
      btnHeader.disabled = true;
      btnHeader.classList.remove('ready-glow');
      badge.textContent = `🏆 KUPA (0/4)`;
    }
  }

  showPreviewView() {
    this.stopMatchSimulation();

    // Select opponent for current round if not already selected
    const roundData = this.rounds[this.currentRoundIndex];
    if (!this.activeOpponent) {
      const oppList = roundData.opponents;
      this.activeOpponent = oppList[Math.floor(Math.random() * oppList.length)];
    }

    // Update Round Title & Stepper
    document.getElementById('tournamentRoundTitle').textContent = roundData.name;
    this.updateStepper();

    // Update User Team Preview
    const userRating = this.game.calculateAverageRating(this.game.squadSlots);
    const userChem = this.game.calculateChemistry(this.game.squadSlots);

    document.getElementById('previewUserOvr').textContent = `${userRating} GÜÇ`;
    document.getElementById('previewUserChem').textContent = `${userChem} KİMYA`;

    // Update Opponent Preview
    document.getElementById('previewOppFlag').textContent = this.activeOpponent.flag;
    document.getElementById('previewOppName').textContent = this.activeOpponent.name;
    document.getElementById('previewOppOvr').textContent = `${this.activeOpponent.ovr} GÜÇ`;
    document.getElementById('previewOppStar').textContent = this.activeOpponent.star;

    document.getElementById('roundIntelText').innerHTML = roundData.intel;

    // Toggle Views
    this.switchView('tournamentPreviewView');
  }

  updateStepper() {
    const stepIds = ['stepSon16', 'stepCeyrek', 'stepYari', 'stepFinal'];
    stepIds.forEach((id, idx) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.classList.remove('active', 'completed');
      if (idx < this.currentRoundIndex) {
        el.classList.add('completed');
      } else if (idx === this.currentRoundIndex) {
        el.classList.add('active');
      }
    });
  }

  switchView(viewId) {
    const views = [
      'tournamentPreviewView', 
      'tournamentMatchView', 
      'tournamentResultView', 
      'tournamentTrophyView'
    ];
    views.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = (id === viewId) ? 'block' : 'none';
    });
  }

  // ==========================================
  // MATCH SIMULATION & INTERACTIVE COMMENTARY
  // ==========================================
  startMatch() {
    window.soundEngine.playWhistle();
    this.switchView('tournamentMatchView');

    this.userScore = 0;
    this.oppScore = 0;
    this.matchMinute = 0;
    this.isMatchPaused = false;

    // Reset Scoreboard UI
    document.getElementById('sbUserScore').textContent = '0';
    document.getElementById('sbOppScore').textContent = '0';
    document.getElementById('sbMatchMinute').textContent = "0'";
    document.getElementById('sbOppName').textContent = this.activeOpponent.name.toUpperCase();
    document.getElementById('sbOppFlag').textContent = this.activeOpponent.flag;
    document.getElementById('sbRoundTag').textContent = this.rounds[this.currentRoundIndex].name.toUpperCase();

    // Clear Commentary Feed
    const feed = document.getElementById('commentaryFeed');
    feed.innerHTML = `
      <div class="comm-line intro">
        <span class="comm-min">0'</span>
        <span class="comm-txt">📢 Hakem düdüğünü çaldı! ${this.rounds[this.currentRoundIndex].name} heyecanı başladı!</span>
      </div>
    `;

    // Plan 2 Critical Decision Points (e.g. 28'-35' and 72'-78')
    this.decisionMinutes = [
      Math.floor(25 + Math.random() * 12),
      Math.floor(68 + Math.random() * 14)
    ];

    // Calculate match probability advantages
    const userRating = this.game.calculateAverageRating(this.game.squadSlots);
    const userChem = this.game.calculateChemistry(this.game.squadSlots);
    // Chemistry gives up to +4 power boost
    const userPower = userRating + (userChem / 33) * 4;
    const oppPower = this.activeOpponent.ovr;

    this.powerAdvantage = userPower - oppPower; // positive if user is stronger

    this.scorersList = [];
    this.startMatchTimer();
  }

  startMatchTimer() {
    this.stopMatchSimulation();

    this.matchInterval = setInterval(() => {
      if (this.isMatchPaused) return;

      this.matchMinute += 2;
      document.getElementById('sbMatchMinute').textContent = `${this.matchMinute}'`;
      this.animateRadarBall();

      // Check Decision Triggers
      if (this.decisionMinutes.length > 0 && this.matchMinute >= this.decisionMinutes[0]) {
        this.decisionMinutes.shift();
        this.triggerCriticalDecision();
        return;
      }

      // Generate Ambient Commentary / Chances
      this.checkAmbientMatchEvent();

      // End of 90 minutes
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
  }

  animateRadarBall() {
    const ball = document.getElementById('radarBall');
    if (!ball) return;
    // Animate ball across pitch according to action
    const x = 20 + Math.random() * 60;
    const y = 20 + Math.random() * 60;
    ball.style.left = `${x}%`;
    ball.style.top = `${y}%`;
  }

  addCommentary(min, text, type = 'normal') {
    const feed = document.getElementById('commentaryFeed');
    if (!feed) return;

    const line = document.createElement('div');
    line.className = `comm-line ${type}`;
    line.innerHTML = `
      <span class="comm-min">${min}'</span>
      <span class="comm-txt">${text}</span>
    `;
    feed.appendChild(line);
    feed.scrollTop = feed.scrollHeight;
  }

  checkAmbientMatchEvent() {
    const min = this.matchMinute;

    // Normal Match Commentary Flavors
    const randomSeed = Math.random();

    if (min === 16) {
      const mid = this.getRandomUserPlayer(['MID', 'MO', 'MOO', 'MDO']);
      this.addCommentary(min, `🔥 ${mid.name} orta alanda rakibinden sıyrıldı, hücumu organize ediyor.`);
    } else if (min === 45) {
      this.addCommentary(min, `⏱️ İlk yarı sona erdi! Takımlar soyunma odasına gidiyor. Skor: ${this.userScore} - ${this.oppScore}`);
    } else if (min === 54 && randomSeed < 0.35) {
      // Opponent Chance
      if (this.powerAdvantage < 2 && Math.random() < 0.45 && this.oppScore <= this.userScore) {
        this.oppScore++;
        document.getElementById('sbOppScore').textContent = this.oppScore;
        window.soundEngine.playWhistle();
        this.addCommentary(min, `⚽ GOL! ${this.activeOpponent.name} hızlı hücumla golü buldu!`, 'danger');
      } else {
        const gk = this.getRandomUserPlayer(['GK', 'KL']);
        this.addCommentary(min, `🧤 NEFİS KURTARIŞ! Kalecimiz ${gk.name} kritik pozisyonda gole izin vermedi!`, 'highlight');
      }
    } else if (min === 62) {
      const def = this.getRandomUserPlayer(['DEF', 'STP', 'SLB', 'SĞB']);
      this.addCommentary(min, `🛡️ ${def.name} savunmada zamanında müdahaleyle rakip atağı kesti.`);
    } else if (min === 84 && randomSeed < 0.30 && this.userScore <= this.oppScore) {
      // Late User Chance
      const fwd = this.getRandomUserPlayer(['FWD', 'SNT', 'SĞK', 'SLK']);
      this.userScore++;
      document.getElementById('sbUserScore').textContent = this.userScore;
      this.recordGoal(fwd.name);
      window.soundEngine.playGoalHorn();
      window.soundEngine.playCrowdCheer();
      this.addCommentary(min, `⚽ GOOOOOOOL! ${fwd.name} ceza sahası dışından müthiş astı!`, 'goal');
    }
  }

  // ==========================================
  // CRITICAL INTERACTIVE DECISION MOMENT
  // ==========================================
  triggerCriticalDecision() {
    this.isMatchPaused = true;
    window.soundEngine.playReveal();

    const star = this.getRandomUserPlayer(['FWD', 'SNT', 'SĞK', 'SLK', 'MOO']);
    this.decisionActivePlayer = star;

    const modal = document.getElementById('decisionOverlay');
    const title = document.getElementById('decisionTitle');
    const desc = document.getElementById('decisionDesc');

    title.textContent = `${this.matchMinute}. DAKİKA: Ceza Sahası Çizgisi!`;
    desc.innerHTML = `
      🔥 <strong>${star.name}</strong> (${star.rating} Rating) topla fırtına gibi ceza alanına girdi! Kaleciyle karşı karşıya!
      <br><strong>Sen olsan ne yapardın? Kararını ver:</strong>
    `;

    modal.style.display = 'flex';
  }

  handleDecisionChoice(choiceType) {
    document.getElementById('decisionOverlay').style.display = 'none';
    this.isMatchPaused = false;
    window.soundEngine.playClick();

    const player = this.decisionActivePlayer;
    let isGoal = false;
    let comment = '';

    // Probability based on stats & choice
    const stats = player.stats || { sho: 80, dri: 80, pas: 80, pac: 80 };
    const roll = Math.random() * 100;

    if (choiceType === 'plase') {
      // Technique & Dripling test
      const successThreshold = (stats.dri * 0.5 + stats.sho * 0.5) - 15;
      if (roll < successThreshold) {
        isGoal = true;
        comment = `🎯 GOOOOOOL! ${player.name} adrese teslim bir plaseyle topu 90'a bıraktı! Muhteşem bir teknik!`;
      } else {
        comment = `🧤 DİREK VE KALECİ! ${player.name}'in plasesini kaleci son anda parmaklarının ucuyla kornere çeldi!`;
      }
    } else if (choiceType === 'power') {
      // Shot Power test
      const successThreshold = (stats.sho * 0.7 + stats.pac * 0.3) - 14;
      if (roll < successThreshold) {
        isGoal = true;
        comment = `⚡ GOOOOOOL! ${player.name} öyle bir füze çıkardı ki fileler yırtılacaktı! İnanılmaz bir gol!`;
      } else {
        comment = `💥 ÜST DİREKTE PATLADI! ${player.name}'in müthiş füzesi üst direkte yankılandı!`;
      }
    } else if (choiceType === 'pass') {
      // Pass & Assist test
      const successThreshold = (stats.pas * 0.6 + stats.dri * 0.4) - 10;
      const target = this.getRandomUserPlayer(['FWD', 'SNT', 'MID', 'MOO'], player.id);
      if (roll < successThreshold) {
        isGoal = true;
        comment = `👟 AL DA AT DEDİ! ${player.name}'in enfes pasında ${target.name} topu boş ağlara yuvarladı! GOOOOOOL!`;
        this.recordGoal(target.name);
      } else {
        comment = `🛡️ SAVUNMA ARAYA GİRDİ! ${player.name}'in pasını rakip stoper son anda kayarak önledi!`;
      }
    }

    if (isGoal) {
      this.userScore++;
      document.getElementById('sbUserScore').textContent = this.userScore;
      if (choiceType !== 'pass') this.recordGoal(player.name);
      window.soundEngine.playGoalHorn();
      window.soundEngine.playCrowdCheer();
      this.addCommentary(this.matchMinute, comment, 'goal');
    } else {
      window.soundEngine.playWhistle();
      this.addCommentary(this.matchMinute, comment, 'highlight');
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

    if (filtered.length > 0) {
      return filtered[Math.floor(Math.random() * filtered.length)];
    }
    return players[Math.floor(Math.random() * players.length)];
  }

  // ==========================================
  // MATCH RESULT & ADVANCEMENT
  // ==========================================
  endMatch() {
    window.soundEngine.playWhistle();

    // Ensure decisive result in knockout tournament (no ties!)
    if (this.userScore === this.oppScore) {
      // Extra time / penalties decider favored by power advantage
      if (Math.random() < 0.65 || this.powerAdvantage >= 0) {
        this.userScore++;
        const hero = this.getRandomUserPlayer(['FWD', 'MOO']);
        this.recordGoal(hero.name);
        this.addCommentary(90, `⚽ UZATMALARDA ALTIN GOL! ${hero.name} 90+3'te maçı koparan golü attı!`, 'goal');
      } else {
        this.oppScore++;
        this.addCommentary(90, `⚽ Rakip uzatmalarda golü buldu.`, 'danger');
      }
      document.getElementById('sbUserScore').textContent = this.userScore;
      document.getElementById('sbOppScore').textContent = this.oppScore;
    }

    setTimeout(() => {
      this.showMatchResultView();
    }, 1200);
  }

  showMatchResultView() {
    this.switchView('tournamentResultView');

    const isWinner = this.userScore > this.oppScore;
    const isGrandFinal = this.currentRoundIndex === 3;

    // Scores
    document.getElementById('resultUserScore').textContent = this.userScore;
    document.getElementById('resultOppScore').textContent = this.oppScore;
    document.getElementById('resultOppName').textContent = this.activeOpponent.name;
    document.getElementById('resultOppFlag').textContent = this.activeOpponent.flag;

    // Scorers list
    const scorersBox = document.getElementById('matchScorersBox');
    if (this.scorersList.length > 0) {
      scorersBox.innerHTML = `
        <strong>⚽ Goller:</strong> ${this.scorersList.join(', ')}
      `;
      scorersBox.style.display = 'block';
    } else {
      scorersBox.style.display = 'none';
    }

    const title = document.getElementById('resultTitle');
    const subtitle = document.getElementById('resultSubtitle');
    const icon = document.getElementById('resultIcon');
    const btnNext = document.getElementById('btnNextRound');
    const btnRetry = document.getElementById('btnRetryMatch');

    if (isWinner) {
      window.soundEngine.playVictory();
      window.confettiManager.fire();

      if (isGrandFinal) {
        // Champion!
        setTimeout(() => {
          this.showTrophyView();
        }, 1500);
        return;
      }

      icon.textContent = '🎉';
      title.textContent = 'TURU GEÇTİN! TEBRİKLER!';
      subtitle.textContent = `${this.activeOpponent.name} karşısında harika bir galibiyet aldın. Kupa yolculuğun devam ediyor!`;
      btnNext.style.display = 'inline-flex';
      btnRetry.style.display = 'none';
      btnNext.querySelector('span').textContent = 'BİR SONRAKİ TURA GEÇ ➔';
    } else {
      icon.textContent = '😢';
      title.textContent = 'ELENDİN! AMA PES ETMEK YOK!';
      subtitle.textContent = `${this.activeOpponent.name} karşısında şanssız bir maç oldu. Taktiklerini gözden geçirip tekrar dene!`;
      btnNext.style.display = 'none';
      btnRetry.style.display = 'inline-flex';
    }
  }

  nextRound() {
    this.currentRoundIndex++;
    this.activeOpponent = null;

    if (this.currentRoundIndex >= 4) {
      this.showTrophyView();
    } else {
      this.updateHeaderButton(true);
      this.showPreviewView();
    }
  }

  // ==========================================
  // VIEW 4: GRAND TROPHY CEREMONY
  // ==========================================
  showTrophyView() {
    this.switchView('tournamentTrophyView');
    window.soundEngine.playVictory();
    window.confettiManager.fire();

    // Determine Top Scorer
    let topScorerName = 'Kylian Mbappé';
    let maxGoals = 0;
    for (let p in this.tournamentStats.goalsByPlayer) {
      if (this.tournamentStats.goalsByPlayer[p] > maxGoals) {
        maxGoals = this.tournamentStats.goalsByPlayer[p];
        topScorerName = p;
      }
    }
    if (maxGoals === 0) maxGoals = 4;

    // MVP is captain or highest rating
    const captain = this.game.squadSlots.find(s => s.player && s.player.isCaptain)?.player;
    const mvpName = captain ? captain.name : topScorerName;

    document.getElementById('awardMvpName').textContent = mvpName;
    document.getElementById('awardGoldenBoot').textContent = `${topScorerName} (${maxGoals} Gol)`;
    document.getElementById('awardChemVal').textContent = `${this.game.calculateChemistry(this.game.squadSlots)} / 33`;

    // Continuous confetti bursts
    setTimeout(() => window.confettiManager.fire(), 800);
    setTimeout(() => window.confettiManager.fire(), 1800);
  }

  downloadChampionCard() {
    window.soundEngine.playClick();
    const canvas = document.getElementById('exportCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 1200;
    canvas.height = 700;

    // Dark stadium gold gradient
    const grad = ctx.createLinearGradient(0, 0, 1200, 700);
    grad.addColorStop(0, '#0a0e17');
    grad.addColorStop(0.5, '#1e293b');
    grad.addColorStop(1, '#050811');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 700);

    // Gold borders
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, 1160, 660);

    // Header
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

    // Render 11 players list in 2 columns
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

    // Footer Watermark
    ctx.textAlign = 'center';
    ctx.fillStyle = '#64748b';
    ctx.font = 'italic 16px Outfit, sans-serif';
    ctx.fillText('Kupa Draft 26 • Dünya Kupası Şampiyonu Hatıra Kartı', 600, 640);

    // Trigger Download
    const link = document.createElement('a');
    link.download = 'Dunya-Sampiyonu-Ruya-Takim-2026.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }
}

window.TournamentEngine = TournamentEngine;
