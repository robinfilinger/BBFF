document.addEventListener('DOMContentLoaded', function() {
    fetch('HistoricalStandings.csv')
        .then(response => response.text())
        .then(data => {
            const teams = parseCSV(data);
            const teamList = document.getElementById('teamList');

            teams.forEach((team, index) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <a href="team.html?id=${index + 1}">${team.name}</a>
                    <span class="owner">
                        Wins: ${team.wins}, 
                        Losses: ${team.losses}, 
                        PF: ${team.pointsFor}, 
                        PA: ${team.pointsAgainst}, 
                        Avg PF: ${team.averagePf}, 
                        Avg PA: ${team.averagePa}
                    </span>
                `;
                teamList.appendChild(li);
            });
        })
        .catch(error => console.error('Error:', error));
});

function parseCSV(csv) {
    const lines = csv.split('\n');
    const headers = lines[0].split(',');
    return lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, index) => {
            obj[header.trim()] = values[index].trim();
            return obj;
        }, {});
    });
}