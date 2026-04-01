fetch("data/players.json")
  .then(res => res.json())
  .then(players => {

    players.forEach(p => {
      const values = Object.values(p.stats);

      const valid = values.filter(v => v !== -1);

      const avg = valid.length
        ? valid.reduce((a, b) => a + b, 0) / valid.length
        : 0;

      p.points = avg;
      p.calculatedTitle = getRank(p.points, p);
    });

    players.sort((a, b) => b.points - a.points);
    render(players);
  });

const regionIcons = {
  "north america": "na.png",
  "south america": "sa.png",
  "asia": "as.png",
  "europe": "eu.png"
};
const statNames = {
  pvp: "PvP",
  aim: "Aim",
  mlg: "MLG",
  parkour: "Parkour",
  knowledge: "Knowledge",
  pvpiq: "PvP IQ",
  reflection: "Reflection",
  speedrun: "Speedrun",
  manhunt: "Manhunt",
  traps: "Traps",
  speeding: "Speeding"
};
const titleColors = {
  "Master": "#ff4d4d",
  "Legend++": "#ffd700",
  "Legend+": "#ffb300",
  "Legend": "#ff8800",
  "Pro": "#4da6ff",
  "Advanced": "#3fbf7f",
  "Intermediate": "#bfbfbf",
  "Beginner": "#777777",
  "Rank Reset": "#ff0000"
};

const statIcons = {
  pvp: "pvp.png",
  aim: "aim.png",
  mlg: "mlg.png",
  parkour: "parkour.png",
  knowledge: "knowledge.png",
  pvpiq: "pvpiq.png",
  reflection: "reflection.png",
  speedrun: "speedrun.png",
  manhunt: "manhunt.png",
  traps: "traps.png",
  speeding: "speeding.png"
};

function getSkinPath(nick) {
  const localPath = `./skins/${nick}.png`;
  
  if (fileExists(localPath)) return localPath;

  return `https://render.crafty.gg/3d/bust/${nick}`;
}

function fileExists(path) {
  try {
    const xhr = new XMLHttpRequest();
    xhr.open('HEAD', path, false);
    xhr.send();
    return xhr.status !== 404;
  } catch (e) {
    return false;
  }
}

function render(players) {
  const ranking = document.getElementById("ranking");
  ranking.innerHTML = "";

  players.forEach((p, i) => {
    const div = document.createElement("div");
    div.className = "player";

    const pos = document.createElement("div");
    pos.className = "pos";
    pos.innerText = `#${i + 1}`;
    div.appendChild(pos);

    const skin = document.createElement("img");
    skin.className = "skin";
    skin.src = getSkinPath(p.nickname);
    skin.alt = p.nickname;

    skin.onerror = () => {
      skin.onerror = () => {
        skin.src = "./skins/default.png";
      };
      skin.src = `./skins/${p.nickname}.png`;
    };

    div.appendChild(skin);

    const info = document.createElement("div");
    info.className = "info";
    info.innerHTML = `
      <div class="nick">${p.nickname}</div>
      <div class="muted" style="color: ${titleColors[p.title] || "#aaa"}">
        ${p.title}
      </div>
    `;
    div.appendChild(info);

    const regionImg = document.createElement("img");
    regionImg.className = "region";
    const regionKey = (p.region || "").toLowerCase().trim();
    regionImg.src = `./srcs/${regionIcons[regionKey] || "default.png"}`;
    regionImg.alt = p.region;
    div.appendChild(regionImg);

    const points = document.createElement("div");
    points.className = "points";
    points.innerText = p.points.toFixed(2);
    div.appendChild(points);

    div.onclick = () => openModal(p);
    ranking.appendChild(div);
  });
}

function openModal(p) {
  modal.classList.add("active");

  mNick.innerText = p.nickname;
  mRegion.innerText = p.region;
  mPoints.innerText = `${p.points.toFixed(2)} pts`;

  mSkin.src = getSkinPath(p.nickname);

  mRankImg.src = `./titles/${p.title}.svg`;
  mRankImg.style.width = "45px";
  mRankImg.style.height = "auto";
  mRankText.innerText = p.title;
  mRankText.style.color = titleColors[p.title] || "#aaa";

  let statsHTML = "";

  for (let key in p.stats) {
    let value = p.stats[key];

    statsHTML += `
      <div>
        <div class="stat-left">
          <img src="./ranks/${statIcons[key] || "default.png"}">
          <span>${statNames[key] || key}</span>
        </div>
        <span>${value === -1 ? "Unranked" : value}</span>
      </div>
    `;
  }

  mStats.innerHTML = statsHTML;
}

function closeModal() {
  modal.classList.remove("active");
}