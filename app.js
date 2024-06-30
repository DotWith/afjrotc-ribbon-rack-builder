// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();

let selectedRibbons = [];
let selectedRanks = [];
let selectedBadges = [];

fetch('badges.json')
    .then(response => response.json())
    .then(data => {
        const badgeSelection = document.getElementById('badgeSelection');
        data.forEach(badge => {
            const label = document.createElement('label');
            label.classList.add('badge-checkbox');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.dataset.badge = badge.path;

            const img = document.createElement('img');
            img.src = `badges/${badge.path}`;
            img.alt = badge.name;

            const text = document.createTextNode(badge.name);

            label.appendChild(checkbox);
            label.appendChild(img);
            label.appendChild(text);

            badgeSelection.appendChild(label);
        });

        // Update selected badges when checkboxes are changed
        const badgeCheckboxes = document.querySelectorAll('input[data-badge]');
        badgeCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', updateSelectedRibbons);
        });
    });

fetch('ranks.json')
    .then(response => response.json())
    .then(data => {
        const rankSelection = document.getElementById('rankSelection');
        data.forEach(rank => {
            const label = document.createElement('label');
            label.classList.add('rank-radio');

            const radio = document.createElement('input');
            radio.dataset.rank = rank.id;
            radio.type = 'radio';
            radio.name = 'rank';
            radio.value = rank.id;
            label.appendChild(radio);

            if (rank.id != 0) {
                const img = document.createElement('img');
                img.src = `ranks/${rank.id}.svg`;
                img.alt = rank.name;
                label.appendChild(img);
            }

            const text = document.createTextNode(rank.id + ". " + rank.name);
            label.appendChild(text);

            rankSelection.appendChild(label);
        });

        // Update selected ranks when radios are changed
        const ranksRadios = document.querySelectorAll('input[data-rank]');
        ranksRadios.forEach(radio => {
            radio.addEventListener('change', updateSelectedRibbons);
        });
    });

fetch('ribbons.json')
    .then(response => response.json())
    .then(data => {
        const ribbonSelection = document.getElementById('ribbonSelection');
        data.forEach(ribbon => {
            const label = document.createElement('label');
            label.classList.add('ribbon-checkbox');

            // const dropdown = document.createElement('select');
            // dropdown.dataset.ribbon = ribbon.id;

            // const noneOption = document.createElement('option');
            // noneOption.value = 'none';
            // noneOption.text = 'None';
            // dropdown.appendChild(noneOption);

            // for (let i = 0; i < 21; i++) {
            //     const oakOption = document.createElement('option');
            //     oakOption.value = i;
            //     oakOption.text = i + ' Oak';
            //     dropdown.appendChild(oakOption);
            // }
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.dataset.ribbon = ribbon.id;

            const img = document.createElement('img');
            img.src = `ribbons/${ribbon.id}.svg`;
            img.alt = ribbon.name;

            const text = document.createTextNode(ribbon.id + ". " + ribbon.name);

            const oakNumber = document.createElement('input');
            oakNumber.className = 'ribbon-checkbox-range';
            oakNumber.type = 'range';
            oakNumber.value = 0;
            oakNumber.min = 0;
            oakNumber.max = 20;
            oakNumber.dataset.ribbon = ribbon.id; // Store ribbon id for easy reference

            label.appendChild(checkbox);
            label.appendChild(img);
            label.appendChild(text);
            label.appendChild(oakNumber);

            ribbonSelection.appendChild(label);
        });

        // Update selected ribbons when checkboxes are changed
        const ribbonCheckboxes = document.querySelectorAll('input[data-ribbon]');
        ribbonCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', updateSelectedRibbons);
        });

        const oakNumberInputs = document.querySelectorAll('.ribbon-checkbox-range');
        oakNumberInputs.forEach(input => {
            input.addEventListener('input', updateSelectedRibbons);
        });
    });

function updateSelectedRibbons() {
    selectedBadges = Array.from(document.querySelectorAll('input[data-badge]'))
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.dataset.badge);

    selectedRanks = Array.from(document.querySelectorAll('input[data-rank]'))
        .filter(radio => radio.checked)
        .map(radio => parseInt(radio.dataset.rank));

    selectedRibbons = Array.from(document.querySelectorAll('input[data-ribbon]'))
        .filter(checkbox => checkbox.checked)
        .map(checkbox => [
                parseInt(checkbox.dataset.ribbon),
                parseInt(document.querySelector(`.ribbon-checkbox-range[data-ribbon="${checkbox.dataset.ribbon}"]`).value)
            ]
        );

    updateRack();
}

function updateRack() {
    const rack = document.getElementById('rack');
    rack.innerHTML = '';

    // Sort the selected ribbons using the sortRibbons function
    const sortedRibbons = sortRibbons(selectedRibbons.map(ribbonId => {
        return ribbonId;
    }));

    const badgesRow = [];

    selectedRanks.forEach(rank => {
        if (rank == 0) {
            return;
        }

        const rankElement = document.createElement('img');
        rankElement.src = `ranks/${rank}.svg`;
        rankElement.className = 'rack-badge-img';

        badgesRow.push(rankElement);
    });

    selectedBadges.forEach(badge => {
        const badgeElement = document.createElement('img');
        badgeElement.src = `badges/${badge}`;
        badgeElement.className = 'rack-badge-img';

        badgesRow.push(badgeElement);
    });

    // Loop through the ribbons in the current row
    badgesRow.forEach(child => {
        rack.appendChild(child);
    });

    // Loop through the sorted ribbons
    sortedRibbons.forEach((row, _rowIndex) => {
        // Create a row element
        const rowElement = document.createElement('div');
        rowElement.classList.add('row');

        // Loop through the ribbons in the current row
        row.forEach(ribbon => {
            const ribbonContainer = document.createElement('div');
            ribbonContainer.className = 'rack-ribbon';

            // Create an image element for each ribbon
            const ribbonElement = document.createElement('img');
            ribbonElement.src = `ribbons/${ribbon[0]}.svg`;
            ribbonElement.className = 'rack-ribbon-img';
            ribbonContainer.appendChild(ribbonElement);

            const oakContainer = document.createElement('div');
            oakContainer.className = 'ribbon-oak';

            if (ribbon[1] > 0) {
                const numberOfSilverOaks = Math.floor(ribbon[1] / 5);
                const remainderBronzeOaks = ribbon[1] % 5;

                // Create silver oak leaves
                for (let i = 0; i < numberOfSilverOaks; i++) {
                    const ribbonOak = document.createElement('img');
                    ribbonOak.src = `ribbons/silver_oak_leaf.svg`;
                    ribbonOak.className = 'ribbon-oak-img';
                    oakContainer.appendChild(ribbonOak);
                }

                // Create bronze oak leaves for the remainder
                for (let i = 0; i < remainderBronzeOaks; i++) {
                    const ribbonOak = document.createElement('img');
                    ribbonOak.src = `ribbons/bronze_oak_leaf.svg`;
                    ribbonOak.className = 'ribbon-oak-img';
                    oakContainer.appendChild(ribbonOak);
                }
            }

            ribbonContainer.appendChild(oakContainer);
            rowElement.appendChild(ribbonContainer);
        });

        // Append the row element to the rack
        rack.appendChild(rowElement);
    });
}

function sortRibbons(ribbons) {
    ribbons.sort((a, b) => a - b);

    const evenRows = ribbons.length % 3; // >1 = unven, 0 = even

    const rows = [];
    const ribbonsPerRow = 3;
    const numRows = Math.ceil(ribbons.length / ribbonsPerRow);

    for (let i = 0; i < numRows; i++) {
        // if it's uneven then 1 or 2 go on the top
        // and the reset of the ribbons follow the 3 per row princlpe
        const row = [];

        if (evenRows && i === 0) {
            // If it's an odd count of ribbons and it's the first row,
            // add 1 or 2 ribbons to the top row
            const ribbonsToAdd = Math.min(evenRows, ribbons.length);
            console.log(ribbonsToAdd);
            for (let j = 0; j < ribbonsToAdd; j++) {
                row.push(ribbons.shift());
            }
        } else {
            // Add ribbons following the 3 per row principle
            for (let j = 0; j < ribbonsPerRow && ribbons.length > 0; j++) {
                row.push(ribbons.shift());
            }
        }

        rows.push(row);
    }

    return rows;
}

function saveRackImage() {
    html2canvas(document.getElementById('rack'), { backgroundColor: null }).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'ribbon_rack.png';
        link.click();
    });
}

function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
} 
