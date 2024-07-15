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

            const table = document.getElementById('teamTable');
            
            // Create table header
            const thead = table.createTHead();
            const headerRow = thead.insertRow();
            Object.keys(teams[0]).forEach(key => {
                const th = document.createElement('th');
                th.textContent = key;
                headerRow.appendChild(th);
            });

            // Create table body
            const tbody = table.createTBody();
            teams.forEach(team => {
                const row = tbody.insertRow();
                Object.values(team).forEach(value => {
                    const cell = row.insertCell();
                    cell.textContent = value || 'N/A';
                });
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