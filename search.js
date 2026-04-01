let allPlayers = [];

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
    });

    players.sort((a, b) => b.points - a.points);

    allPlayers = players;
    render(players);
  });

document.getElementById("search").addEventListener("input", e => {
  const value = e.target.value.toLowerCase();

  const filtered = allPlayers.filter(p =>
    p.nickname.toLowerCase().includes(value)
  );

  render(filtered);
});