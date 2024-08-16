let selectedRibbons = [];
let selectedRanks = [];
let selectedBadges = [];

fetch('badges/_meta.json')
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

fetch('ranks/_meta.json')
    .then(response => response.json())
    .then(data => {
        function makeRanks(data, kind, rankSelection) {
            data[kind].forEach(rank => {
                const label = document.createElement('label');
                label.classList.add('rank-radio');

                const radio = document.createElement('input');
                radio.dataset.rank = `${kind}/${rank.id}`;
                radio.type = 'radio';
                radio.name = 'rank';
                radio.value = rank.id;
                label.appendChild(radio);

                if (rank.id != 1 || kind != "enlisted") {
                    const img = document.createElement('img');
                    img.src = `ranks/${kind}/${rank.id}.svg`;
                    img.alt = rank.name;
                    label.appendChild(img);
                }

                const text = document.createTextNode(`[${kind[0].toUpperCase()}-${rank.id}] ${rank.name}`);
                label.appendChild(text);

                rankSelection.appendChild(label);
            });
        }

        const rankSelection = document.getElementById('rankSelection');
        makeRanks(data, 'enlisted', rankSelection);
        makeRanks(data, 'officer', rankSelection);

        // Update selected ranks when radios are changed
        const ranksRadios = document.querySelectorAll('input[data-rank]');
        ranksRadios.forEach(radio => {
            radio.addEventListener('change', updateSelectedRibbons);
        });
    });

fetch('ribbons/_meta.json')
    .then(response => response.json())
    .then(data => {
        const ribbonSelection = document.getElementById('ribbonSelection');
        data.forEach(ribbon => {
            const label = document.createElement('label');
            label.classList.add('ribbon-option');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.dataset.ribbon = ribbon.id;

            const img = document.createElement('img');
            img.src = `ribbons/${ribbon.id}.svg`;
            img.alt = ribbon.name;

            const text = document.createTextNode(ribbon.id + ". " + ribbon.name);

            const devices = document.createElement('input');
            devices.classList.add('ribbon-option-input');
            devices.type = 'range';
            devices.value = 0;
            if (ribbon.uses_stars) {
                devices.min = 0;
                devices.max = 20; // none, bronze, silver, golden
                devices.dataset.uses_stars = true;
            } else {
                devices.min = 0;
                devices.max = 20;
                devices.dataset.uses_stars = false;
            }
            devices.dataset.ribbon = ribbon.id;

            label.appendChild(checkbox);
            label.appendChild(img);
            label.appendChild(text);
            label.appendChild(devices);

            ribbonSelection.appendChild(label);
        });

        // Update selected ribbons when checkboxes are changed
        const ribbonCheckboxes = document.querySelectorAll('input[data-ribbon]');
        ribbonCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', updateSelectedRibbons);
        });

        const oakNumberInputs = document.querySelectorAll('.ribbon-option-input');
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
        .map(radio => radio.dataset.rank);

    selectedRibbons = Array.from(document.querySelectorAll('input[data-ribbon]'))
        .filter(checkbox => checkbox.checked)
        .map(checkbox => {
            const ribbonId = parseInt(checkbox.dataset.ribbon);
            const devicesElement = document.querySelector(`.ribbon-option-input[data-ribbon="${checkbox.dataset.ribbon}"]`);
            const devices = parseInt(devicesElement.value);
            const usesStars = devicesElement.dataset.uses_stars === 'true';
            return [ribbonId, devices, usesStars];
        });

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
        if (rank == "enlisted/1") {
            return;
        }

        const rankElement = document.createElement('img');
        rankElement.src = `ranks/${rank}.svg`;
        rankElement.className = 'rack-badge-img';
        rankElement.setAttribute('crossorigin', 'anonymous');

        badgesRow.push(rankElement);
    });

    selectedBadges.forEach(badge => {
        const badgeElement = document.createElement('img');
        badgeElement.src = `badges/${badge}`;
        badgeElement.className = 'rack-badge-img';
        badgeElement.setAttribute('crossorigin', 'anonymous');

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
            ribbonElement.setAttribute('crossorigin', 'anonymous');
            ribbonContainer.appendChild(ribbonElement);

            const oakContainer = document.createElement('div');
            oakContainer.className = 'ribbon-oak';

            if (ribbon[1] > 0) {
                if (ribbon[2] == false) {
                    const numberOfSilverOaks = Math.floor(ribbon[1] / 5);
                    const remainderBronzeOaks = ribbon[1] % 5;

                    // Create silver oak leaves
                    for (let i = 0; i < numberOfSilverOaks; i++) {
                        const ribbonOak = document.createElement('img');
                        ribbonOak.src = `ribbons/devices/silver_clasp.svg`;
                        ribbonOak.className = 'ribbon-oak-img';
                        ribbonOak.setAttribute('crossorigin', 'anonymous');
                        oakContainer.appendChild(ribbonOak);
                    }

                    // Create bronze oak leaves for the remainder
                    for (let i = 0; i < remainderBronzeOaks; i++) {
                        const ribbonOak = document.createElement('img');
                        ribbonOak.src = `ribbons/devices/bronze_clasp.svg`;
                        ribbonOak.className = 'ribbon-oak-img';
                        ribbonOak.setAttribute('crossorigin', 'anonymous');
                        oakContainer.appendChild(ribbonOak);
                    }
                } else {
                    const numberOfGoldenStar = Math.floor(ribbon[1] / 5 / 5);
                    const numberOfSilverStar = Math.floor((ribbon[1] % 25) / 5);
                    const remainderBronzeStar = ribbon[1] % 5;

                    // Create golden star
                    for (let i = 0; i < numberOfGoldenStar; i++) {
                        const ribbonOak = document.createElement('img');
                        ribbonOak.src = `ribbons/devices/golden_star.svg`;
                        ribbonOak.className = 'ribbon-oak-img';
                        ribbonOak.setAttribute('crossorigin', 'anonymous');
                        oakContainer.appendChild(ribbonOak);
                    }

                    // Create silver star
                    for (let i = 0; i < numberOfSilverStar; i++) {
                        const ribbonOak = document.createElement('img');
                        ribbonOak.src = `ribbons/devices/silver_star.svg`;
                        ribbonOak.className = 'ribbon-oak-img';
                        ribbonOak.setAttribute('crossorigin', 'anonymous');
                        oakContainer.appendChild(ribbonOak);
                    }

                    // Create bronze star for the remainder
                    for (let i = 0; i < remainderBronzeStar; i++) {
                        const ribbonOak = document.createElement('img');
                        ribbonOak.src = `ribbons/devices/bronze_star.svg`;
                        ribbonOak.className = 'ribbon-oak-img';
                        ribbonOak.setAttribute('crossorigin', 'anonymous');
                        oakContainer.appendChild(ribbonOak);
                    }
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

function saveRackPng() {
    html2canvas(document.getElementById('rack'), { backgroundColor: null, scale: 4 }).then(canvas => {
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
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.querySelectorAll('[id=tab]');
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = "bg-inactive";
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className = "bg-active";
} 
