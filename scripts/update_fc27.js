const fs = require('fs');
const readline = require('readline');
const path = require('path');

function parseCSVLine(text) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '\"') {
      inQuotes = !inQuotes;
    } else if (c === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur.trim());
  return result;
}

function normalize(str) {
  if (!str) return '';
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[ıİ]/g, 'i')
    .replace(/[şŞ]/g, 's')
    .replace(/[ğĞ]/g, 'g')
    .replace(/[üÜ]/g, 'u')
    .replace(/[öÖ]/g, 'o')
    .replace(/[çÇ]/g, 'c')
    .replace(/[^a-z0-9]/g, '');
}

const NATION_MAP = {
  'Arjantin': 'Argentina', 'Fransa': 'France', 'İspanya': 'Spain', 'İngiltere': 'England',
  'Brezilya': 'Brazil', 'Portekiz': 'Portugal', 'Almanya': 'Germany', 'Hollanda': 'Netherlands',
  'İtalya': 'Italy', 'Belçika': 'Belgium', 'Türkiye': 'Turkey', 'Uruguay': 'Uruguay',
  'Hırvatistan': 'Croatia', 'Kolombiya': 'Colombia', 'Fas': 'Morocco', 'Norveç': 'Norway',
  'Danimarka': 'Denmark', 'İsviçre': 'Switzerland', 'Avusturya': 'Austria', 'Polonya': 'Poland',
  'Sırbistan': 'Serbia', 'İskoçya': 'Scotland', 'Macaristan': 'Hungary', 'İsveç': 'Sweden',
  'Ukrayna': 'Ukraine', 'Çekya': 'Czech Republic', 'ABD': 'United States', 'Meksika': 'Mexico',
  'Kanada': 'Canada', 'Japonya': 'Japan', 'Güney Kore': 'Korea Republic', 'Senegal': 'Senegal',
  'Nijerya': 'Nigeria', 'Fildişi Sahili': "Côte d'Ivoire", 'Mısır': 'Egypt', 'Cezayir': 'Algeria',
  'Kamerun': 'Cameroon', 'Gana': 'Ghana', 'Avustralya': 'Australia', 'Suudi Arabistan': 'Saudi Arabia',
  'İran': 'Iran', 'Ekvador': 'Ecuador', 'Şili': 'Chile', 'Paraguay': 'Paraguay',
  'Venezuela': 'Venezuela', 'Özbekistan': 'Uzbekistan', 'Katar': 'Qatar', 'Güney Afrika': 'South Africa'
};

const ALIASES = {
  'Vinícius Júnior': 'Vini Jr.',
  'Gabriel Magalhães': 'Gabriel',
  'Alisson Becker': 'Alisson',
  'Álvaro Morata': 'Morata',
  'Marc Cucurella': 'Cucurella',
  'Yassine Bounou (Bono)': 'Yassine Bounou',
  'Son Heung-min': 'Heung Min Son',
  'Heung-min Son': 'Heung Min Son',
  'Képler Laveran (Pepe)': 'Pepe',
  'Ró-Ró (Pedro Miguel)': 'Ró-Ró',
  'Bruno Guimarães': 'Bruno Guimarães',
  'Dani Carvajal': 'Carvajal',
  'Takehiro Tomiyasu': 'Tomiyasu',
  'Min-jae Kim': 'Min Jae Kim',
  'Kim Min-jae': 'Min Jae Kim',
  'Hwang Hee-chan': 'Hee Chan Hwang',
  'Lee Kang-in': 'Kang In Lee',
  'Alexis Mac Allister': 'Alexis Mac Allister',
  'Emiliano Martínez': 'Emiliano Martínez',
  'Lautaro Martínez': 'Lautaro Martínez',
  'Julián Álvarez': 'Julián Álvarez',
  'Rodrigo De Paul': 'Rodrigo De Paul',
  'Cristian Romero': 'Cristian Romero',
  'Nahuel Molina': 'Nahuel Molina',
  'Nicolás Otamendi': 'Nicolás Otamendi',
  'Lisandro Martínez': 'Lisandro Martínez',
  'Eduardo Camavinga': 'Eduardo Camavinga',
  'Aurélien Tchouaméni': 'Aurélien Tchouaméni',
  'Theo Hernández': 'Theo Hernández',
  'Mike Maignan': 'Mike Maignan',
  'Dayot Upamecano': 'Dayot Upamecano',
  'Jules Koundé': 'Jules Koundé'
};

async function main() {
  console.log('Loading players.csv...');
  const fileStream = fs.createReadStream('players.csv');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let header = null;
  const fcPlayers = [];
  const fcByNation = {};

  for await (const line of rl) {
    if (!header) {
      header = parseCSVLine(line);
      continue;
    }
    const cols = parseCSVLine(line);
    const id = cols[0];
    const commonName = cols[1];
    const firstName = cols[2];
    const lastName = cols[3];
    const rating = parseInt(cols[4], 10);
    const pos = cols[5];
    const club = cols[7];
    const nat = cols[9];
    const gender = cols[10];
    const pac = parseInt(cols[18], 10) || 75;
    const sho = parseInt(cols[19], 10) || 75;
    const pas = parseInt(cols[20], 10) || 75;
    const dri = parseInt(cols[21], 10) || 75;
    const def = parseInt(cols[22], 10) || 75;
    const phy = parseInt(cols[23], 10) || 75;

    // Prefer Men's Football
    const isMen = (gender === "Men's Football");

    const fullName = (firstName && lastName) ? `${firstName} ${lastName}` : (lastName || commonName || '');
    const pObj = {
      id, commonName, firstName, lastName, fullName,
      rating, pos, club, nat, gender, isMen,
      pac, sho, pas, dri, def, phy,
      normCommon: normalize(commonName),
      normFull: normalize(fullName),
      normLast: normalize(lastName),
      normFirst: normalize(firstName)
    };

    fcPlayers.push(pObj);

    if (isMen && nat) {
      if (!fcByNation[nat]) fcByNation[nat] = [];
      fcByNation[nat].push(pObj);
    }
  }

  console.log(`Loaded ${fcPlayers.length} players from players.csv.`);

  // Sort players by rating within each nation
  for (const n in fcByNation) {
    fcByNation[n].sort((a, b) => b.rating - a.rating);
  }

  // Load existing teams.json
  const teamsPath = path.join(__dirname, '../data/teams.json');
  const teamsDataPath = path.join(__dirname, '../data/teams_data.js');
  const teams = JSON.parse(fs.readFileSync(teamsPath, 'utf8'));

  let totalPlayersCount = 0;
  let matchedCount = 0;
  const matchDetails = [];

  for (const team of teams) {
    const engNation = NATION_MAP[team.name] || team.name;
    const normNat = normalize(engNation);

    for (const player of team.players) {
      totalPlayersCount++;

      // NEVER modify the special Y. Bera card
      if (player.id === 'tur_y_bera') {
        matchedCount++;
        matchDetails.push({ name: player.name, oldR: 99, newR: 99, status: 'PRESERVED (Special Birthday Card)' });
        continue;
      }

      const pClean = player.name.replace(/\s*\(.*\)/, '').trim();
      const alias = ALIASES[player.name] || ALIASES[pClean] || pClean;
      const pNorm = normalize(alias);
      const pCleanNorm = normalize(pClean);
      const pLastName = normalize(pClean.split(' ').pop());

      // Search matching candidate in FC 27
      // Priority 1: Men's Football with matching nationality
      let candidate = fcPlayers.find(fc => {
        if (!fc.isMen) return false;
        if (normNat && normalize(fc.nat) !== normNat && normalize(fc.nat) !== 'holland') return false;
        if (fc.normCommon && (fc.normCommon === pNorm || fc.normCommon === pCleanNorm)) return true;
        if (fc.normFull && (fc.normFull === pNorm || fc.normFull === pCleanNorm)) return true;
        if (fc.normLast === pLastName && pLastName.length >= 4) return true;
        return false;
      });

      // Priority 2: Men's Football without nationality restriction
      if (!candidate) {
        candidate = fcPlayers.find(fc => {
          if (!fc.isMen) return false;
          if (fc.normCommon && (fc.normCommon === pNorm || fc.normCommon === pCleanNorm)) return true;
          if (fc.normFull && (fc.normFull === pNorm || fc.normFull === pCleanNorm)) return true;
          return false;
        });
      }

      // Priority 3: Any gender exact match
      if (!candidate) {
        candidate = fcPlayers.find(fc => {
          if (fc.normCommon && (fc.normCommon === pNorm || fc.normCommon === pCleanNorm)) return true;
          if (fc.normFull && (fc.normFull === pNorm || fc.normFull === pCleanNorm)) return true;
          return false;
        });
      }

      // Priority 4: Partial / substring match in same nation
      if (!candidate && normNat && pLastName.length >= 4) {
        candidate = fcPlayers.find(fc => {
          if (!fc.isMen) return false;
          if (normalize(fc.nat) !== normNat && normalize(fc.nat) !== 'holland') return false;
          if (fc.normFull.includes(pLastName) || (fc.normCommon && fc.normCommon.includes(pLastName))) return true;
          return false;
        });
      }

      if (candidate) {
        matchedCount++;
        const oldR = player.rating;
        player.rating = candidate.rating;
        if (candidate.club) player.club = candidate.club;
        if (player.name === 'Rafael Leão' || player.id === 'por_leao') player.club = 'Galatasaray';
        player.stats = {
          pac: candidate.pac,
          sho: candidate.sho,
          pas: candidate.pas,
          dri: candidate.dri,
          def: candidate.def,
          phy: candidate.phy
        };
        matchDetails.push({
          name: player.name,
          team: team.name,
          oldR,
          newR: candidate.rating,
          club: candidate.club,
          status: 'UPDATED'
        });
      } else {
        matchDetails.push({
          name: player.name,
          team: team.name,
          oldR: player.rating,
          newR: player.rating,
          status: 'KEPT UNCHANGED (Not in FC27)'
        });
      }
    }
  }

  console.log(`\n========================================`);
  console.log(`Total Players: ${totalPlayersCount}`);
  console.log(`Successfully Matched & Updated: ${matchedCount} (${((matchedCount/totalPlayersCount)*100).toFixed(1)}%)`);
  console.log(`========================================\n`);

  // Write updated teams.json
  fs.writeFileSync(teamsPath, JSON.stringify(teams, null, 2), 'utf8');
  console.log(`Saved updated teams to ${teamsPath}`);

  // Write updated teams_data.js
  const jsContent = `window.TEAMS_DATA = ${JSON.stringify(teams, null, 2)};\n`;
  fs.writeFileSync(teamsDataPath, jsContent, 'utf8');
  console.log(`Saved updated teams_data.js to ${teamsDataPath}`);

  // Print top highlights
  console.log('\n🌟 Notable FC 27 Rating Updates:');
  const highlights = matchDetails.filter(m => m.status === 'UPDATED' && (m.newR >= 88 || m.name.includes('Güler') || m.name.includes('Yıldız') || m.name.includes('Yamal')));
  highlights.forEach(h => {
    console.log(`• ${h.name} (${h.team}): ${h.oldR} ➔ ${h.newR} | ${h.club}`);
  });
}

main().catch(console.error);
