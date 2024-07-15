document.addEventListener('DOMContentLoaded', function() {
    console.log("firing");
    fetch('https://raw.githubusercontent.com/robinfilinger/BBFF/main/CompleteData/Historical/HistoricalStandings.csv')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            console.log("Raw CSV data:", data); // Log the raw CSV data
            const teams = parseCSV(data);
            console.log("Parsed teams:", teams); // Log the parsed teams

            const teamList = document.getElementById('teamList');

            teams.forEach((team, index) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <a href="team.html?id=${index + 1}">${team.name || 'Unnamed Team'}</a>
                    <span class="owner">
                        Wins: ${team.wins || 'N/A'}, 
                        Losses: ${team.losses || 'N/A'}, 
                        PF: ${team.pointsFor || 'N/A'}, 
                        PA: ${team.pointsAgainst || 'N/A'}, 
                        Avg PF: ${team.averagePf || 'N/A'}, 
                        Avg PA: ${team.averagePa || 'N/A'}
                    </span>
                `;
                teamList.appendChild(li);
            });
        })
        .catch(error => console.error('Error:', error));
});

function parseCSV(csv) {
    const lines = csv.split('\n').map(line => line.trim()).filter(line => line); // Remove empty lines
    const headers = lines[0].split(',').map(header => header.trim());
    console.log("CSV Headers:", headers); // Log the headers

    return lines.slice(1).map(line => {
        const values = line.split(',').map(value => value.trim());
        console.log("CSV values:", values); // Log each line's values
        return headers.reduce((obj, header, index) => {
            obj[header] = values[index];
            return obj;
        }, {});
    });
}