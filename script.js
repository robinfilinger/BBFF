document.addEventListener('DOMContentLoaded', function() {
    fetch('https://raw.githubusercontent.com/robinfilinger/BBFF/main/CompleteData/Historical/HistoricalStandings.csv')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            console.log("Raw CSV data:", data);
            const teams = parseCSV(data);
            console.log("Parsed teams:", teams);

            const teamList = document.getElementById('teamList');
            
            // Create headers
            const headerItem = document.createElement('li');
            headerItem.className = 'team-list-header';
            Object.keys(teams[0]).forEach(key => {
                const header = document.createElement('div');
                header.textContent = key;
                headerItem.appendChild(header);
            });
            teamList.appendChild(headerItem);

            // Create team items
            teams.forEach(team => {
                const listItem = document.createElement('li');
                listItem.className = 'team-list-item';

                Object.entries(team).forEach(([key, value]) => {
                    const detail = document.createElement('div');
                    detail.textContent = value || 'N/A';
                    listItem.appendChild(detail);
                });

                teamList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        });
});

function parseCSV(csv) {
    const lines = csv.split('\n').map(line => line.trim()).filter(line => line);
    const headers = lines[0].split(',').map(header => header.trim());
    console.log("CSV Headers:", headers);

    return lines.slice(1).map(line => {
        const values = line.split(',').map(value => value.trim());
        console.log("CSV values:", values);
        return headers.reduce((obj, header, index) => {
            obj[header] = values[index];
            return obj;
        }, {});
    });
}
