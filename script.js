document.addEventListener('DOMContentLoaded', function() {
    let teams = [];
    let currentSortColumn = null;
    let sortDirection = 'asc';

    fetch('https://raw.githubusercontent.com/robinfilinger/BBFF/main/CompleteData/Historical/HistoricalStandings.csv')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            console.log("Raw CSV data:", data);
            teams = parseCSV(data);
            console.log("Parsed teams:", teams);
            renderTable(teams);
        })
        .catch(error => {
            console.error('Error:', error);
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
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

    function renderTable(teams) {
        const teamList = document.getElementById('teamList');
        teamList.innerHTML = ''; // Clear existing list

        // Create headers
        const headerItem = document.createElement('li');
        headerItem.className = 'team-list-header';
        Object.keys(teams[0]).forEach(key => {
            const header = document.createElement('div');
            const sortIcon = document.createElement('span');
            sortIcon.className = 'sort-icon';

            if (currentSortColumn === key) {
                sortIcon.innerHTML = sortDirection === 'asc' ? '&#9650;' : '&#9660;'; // Up or down arrow
            }

            header.appendChild(sortIcon);
            header.appendChild(document.createTextNode(key));
            header.addEventListener('click', () => sortByColumn(key));
            header.style.cursor = 'pointer'; // Add pointer cursor to indicate it's clickable
            headerItem.appendChild(header);
        });
        teamList.appendChild(headerItem);

        // Create team items
        teams.forEach(team => {
            const listItem = document.createElement('li');
            listItem.className = 'team-list-item';

            Object.values(team).forEach(value => {
                const detail = document.createElement('div');
                detail.textContent = value || 'N/A';
                listItem.appendChild(detail);
            });

            teamList.appendChild(listItem);
        });
    }

    function sortByColumn(column) {
        if (currentSortColumn === column) {
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            currentSortColumn = column;
            sortDirection = 'asc';
        }

        const sortedTeams = [...teams].sort((a, b) => {
            const aValue = a[column] || '';
            const bValue = b[column] || '';
            
            // Check if values are numbers
            const aNum = parseFloat(aValue);
            const bNum = parseFloat(bValue);
            
            if (!isNaN(aNum) && !isNaN(bNum)) {
                return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
            } else {
                return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            }
        });

        teams = sortedTeams;
        renderTable(teams);
    }
});
