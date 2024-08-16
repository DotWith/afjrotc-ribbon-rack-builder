let selectedArcs = [];
let selectedBadges = [];
let selectedRanks = [];
let selectedRibbons = [];

let arcsMeta = {};
let ranksMeta = {};
let badgesMeta = {};
let ribbonsMeta = {};

document.addEventListener('DOMContentLoaded', () => {
    restoreStateFromURL();  // Restore the state when the page loads
});

// Fetching and populating arcs
fetch('arcs/_meta.json')
    .then(response => response.json())
    .then(data => {
        const arcSelection = document.getElementById('arcSelection');
        data.forEach(arc => {
            arcsMeta[arc.id] = arc.path;

            const label = document.createElement('label');
            label.classList.add('badge-checkbox');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            //checkbox.dataset.arc = arc.path;
            checkbox.dataset.arc = arc.id;

            const img = document.createElement('img');
            img.src = `arcs/${arc.path}`;
            img.alt = arc.name;

            const text = document.createTextNode(arc.name);

            label.appendChild(checkbox);
            label.appendChild(img);
            label.appendChild(text);

            arcSelection.appendChild(label);
        });

        const arcCheckboxes = document.querySelectorAll('input[data-arc]');
        arcCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                updateSelectedRibbons();
                updateURL();
            });
        });

        restoreStateFromURL(); // Restore the state after rendering
    });

// Fetching and populating badges
fetch('badges/_meta.json')
    .then(response => response.json())
    .then(data => {
        const badgeSelection = document.getElementById('badgeSelection');
        data.forEach(badge => {
            badgesMeta[badge.id] = badge.path;

            const label = document.createElement('label');
            label.classList.add('badge-checkbox');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            //checkbox.dataset.badge = badge.path;
            checkbox.dataset.badge = badge.id;

            const img = document.createElement('img');
            img.src = `badges/${badge.path}`;
            img.alt = badge.name;

            const text = document.createTextNode(badge.name);

            label.appendChild(checkbox);
            label.appendChild(img);
            label.appendChild(text);

            badgeSelection.appendChild(label);
        });

        const badgeCheckboxes = document.querySelectorAll('input[data-badge]');
        badgeCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                updateSelectedRibbons();
                updateURL();
            });
        });

        restoreStateFromURL(); // Restore the state after rendering
    });

// Fetching and populating ranks
fetch('ranks/_meta.json')
    .then(response => response.json())
    .then(data => {
        var index = 0;
        function makeRanks(data, kind, rankSelection) {
            data[kind].forEach(rank => {
                ranksMeta[index] = `${kind}/${rank.id}`;

                const label = document.createElement('label');
                label.classList.add('rank-radio');

                const radio = document.createElement('input');
                //radio.dataset.rank = `${kind}/${rank.id}`;
                radio.dataset.rank = index;
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

                index++;
            });
        }

        const rankSelection = document.getElementById('rankSelection');
        makeRanks(data, 'enlisted', rankSelection);
        makeRanks(data, 'officer', rankSelection);

        const ranksRadios = document.querySelectorAll('input[data-rank]');
        ranksRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                updateSelectedRibbons();
                updateURL();
            });
        });

        restoreStateFromURL(); // Restore the state after rendering
    });

// Fetching and populating ribbons
fetch('ribbons/_meta.json')
    .then(response => response.json())
    .then(data => {
        const ribbonSelection = document.getElementById('ribbonSelection');
        data.forEach(ribbon => {
            ribbonsMeta[ribbon.id] = ribbon.uses_stars;

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
                devices.max = 3; // none, bronze, silver, golden
                //devices.dataset.uses_stars = true;
            } else {
                devices.min = 0;
                devices.max = 25;
                //devices.dataset.uses_stars = false;
            }
            devices.dataset.ribbon = ribbon.id;

            label.appendChild(checkbox);
            label.appendChild(img);
            label.appendChild(text);
            label.appendChild(devices);

            ribbonSelection.appendChild(label);
        });

        const ribbonCheckboxes = document.querySelectorAll('input[data-ribbon]');
        ribbonCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                updateSelectedRibbons();
                updateURL();
            });
        });

        const oakNumberInputs = document.querySelectorAll('.ribbon-option-input');
        oakNumberInputs.forEach(input => {
            input.addEventListener('input', () => {
                updateSelectedRibbons();
                updateURL();
            });
        });

        restoreStateFromURL(); // Restore the state after rendering
    });

function updateSelectedRibbons() {
    selectedArcs = Array.from(document.querySelectorAll('input[data-arc]'))
        .filter(checkbox => checkbox.checked)
        .map(checkbox => parseInt(checkbox.dataset.arc));

    selectedBadges = Array.from(document.querySelectorAll('input[data-badge]'))
        .filter(checkbox => checkbox.checked)
        .map(checkbox => parseInt(checkbox.dataset.badge));

    selectedRanks = Array.from(document.querySelectorAll('input[data-rank]'))
        .filter(radio => radio.checked)
        .map(radio => parseInt(radio.dataset.rank));

    selectedRibbons = Array.from(document.querySelectorAll('input[data-ribbon]'))
        .filter(checkbox => checkbox.checked)
        .map(checkbox => {
            const ribbonId = parseInt(checkbox.dataset.ribbon);
            const devicesElement = document.querySelector(`.ribbon-option-input[data-ribbon="${checkbox.dataset.ribbon}"]`);
            const devices = parseInt(devicesElement.value);
            //const usesStars = devicesElement.dataset.uses_stars === 'true';
            return [ribbonId, devices];
        });

    updateRack();
}

function updateURL() {
    const params = new URLSearchParams();

    // Add arcs, badges, ranks, and ribbons to the URL
    if (selectedArcs.length > 0) params.set('arcs', selectedArcs.join(','));
    if (selectedBadges.length > 0) params.set('badges', selectedBadges.join(','));
    if (selectedRanks.length > 0) params.set('ranks', selectedRanks.join(','));
    if (selectedRibbons.length > 0) {
        const ribbonsParam = selectedRibbons.map(ribbon => `${ribbon[0]}-${ribbon[1]}`).join(',');
        params.set('ribbons', ribbonsParam);
    }

    // Update the URL
    window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
}

function restoreStateFromURL() {
    const params = new URLSearchParams(window.location.search);

    // Restore arcs
    const arcs = params.get('arcs');
    if (arcs) {
        arcs.split(',').forEach(arc => {
            const checkbox = document.querySelector(`input[data-arc="${arc}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }

    // Restore badges
    const badges = params.get('badges');
    if (badges) {
        badges.split(',').forEach(badge => {
            const checkbox = document.querySelector(`input[data-badge="${badge}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }

    // Restore ranks
    const ranks = params.get('ranks');
    if (ranks) {
        ranks.split(',').forEach(rank => {
            const radio = document.querySelector(`input[data-rank="${rank}"]`);
            if (radio) radio.checked = true;
        });
    }

    // Restore ribbons
    const ribbons = params.get('ribbons');
    if (ribbons) {
        ribbons.split(',').forEach(ribbon => {
            const [ribbonId, devices, usesStars] = ribbon.split('-');
            const checkbox = document.querySelector(`input[data-ribbon="${ribbonId}"]`);
            if (checkbox) checkbox.checked = true;

            const devicesElement = document.querySelector(`.ribbon-option-input[data-ribbon="${ribbonId}"]`);
            if (devicesElement) {
                devicesElement.value = devices;
                ///devicesElement.dataset.uses_stars = usesStars === 'true';
            }
        });
    }

    // Update the selected ribbons after restoring the state
    updateSelectedRibbons();
}

function updateRack() {
    const rack = document.getElementById('rack');
    rack.innerHTML = '';

    // Sort the selected ribbons using the sortRibbons function
    const sortedRibbons = sortRibbons(selectedRibbons.map(ribbonId => {
        return ribbonId;
    }));

    const badgesRow = [];

    selectedRanks.forEach(rankId => {
        const rankElement = document.createElement('img');
        const rankPath = ranksMeta[rankId]; // Use the lookup to get the path

        if (rankPath == "enlisted/1") {
            return;
        } // TODO: Fix

        if (rankPath) {
            rankElement.src = `ranks/${rankPath}.svg`;
            rankElement.className = 'rack-badge-img';
            rankElement.setAttribute('crossorigin', 'anonymous');

            badgesRow.push(rankElement);
        } else {
            console.error(`Rank with ID ${rankId} not found in meta data.`);
        }
    });

    selectedBadges.forEach(badgeId => {
        const badgeElement = document.createElement('img');
        const badgePath = badgesMeta[badgeId]; // Use the lookup to get the path

        if (badgePath) {
            badgeElement.src = `badges/${badgePath}`;
            badgeElement.className = 'rack-badge-img';
            badgeElement.setAttribute('crossorigin', 'anonymous');

            badgesRow.push(badgeElement);
        } else {
            console.error(`Badge with ID ${badgeId} not found in meta data.`);
        }
    });

    selectedArcs.forEach(arcId => {
        const arcElement = document.createElement('img');
        const arcPath = arcsMeta[arcId]; // Use the lookup to get the path

        if (arcPath) {
            arcElement.src = `arcs/${arcPath}`;
            arcElement.className = 'rack-badge-img';
            arcElement.setAttribute('crossorigin', 'anonymous');

            badgesRow.push(arcElement);
        } else {
            console.error(`Arc with ID ${arcId} not found in meta data.`);
        }
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
            const uses_stars = ribbonsMeta[ribbon[0]]; // Use the lookup to get the path

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
                if (!uses_stars) {
                    const numberOfGoldenOaks = Math.floor(ribbon[1] / 5 / 5);
                    const numberOfSilverOaks = Math.floor((ribbon[1] % 25) / 5);
                    const remainderBronzeOaks = ribbon[1] % 5;

                    // Create golden oak leaves
                    for (let i = 0; i < numberOfGoldenOaks; i++) {
                        const ribbonOak = document.createElement('img');
                        ribbonOak.src = `ribbons/devices/golden_oak_leaf.svg`;
                        ribbonOak.className = 'ribbon-oak-img';
                        ribbonOak.setAttribute('crossorigin', 'anonymous');
                        oakContainer.appendChild(ribbonOak);
                    }

                    // Create silver oak leaves
                    for (let i = 0; i < numberOfSilverOaks; i++) {
                        const ribbonOak = document.createElement('img');
                        ribbonOak.src = `ribbons/devices/silver_oak_leaf.svg`;
                        ribbonOak.className = 'ribbon-oak-img';
                        ribbonOak.setAttribute('crossorigin', 'anonymous');
                        oakContainer.appendChild(ribbonOak);
                    }

                    // Create bronze oak leaves for the remainder
                    for (let i = 0; i < remainderBronzeOaks; i++) {
                        const ribbonOak = document.createElement('img');
                        ribbonOak.src = `ribbons/devices/bronze_oak_leaf.svg`;
                        ribbonOak.className = 'ribbon-oak-img';
                        ribbonOak.setAttribute('crossorigin', 'anonymous');
                        oakContainer.appendChild(ribbonOak);
                    }
                } else {
                    const ribbonOak = document.createElement('img');
                    ribbonOak.className = 'ribbon-oak-img';
                    ribbonOak.setAttribute('crossorigin', 'anonymous');
                    switch (ribbon[1]) {
                        case 1:
                            ribbonOak.src = `ribbons/devices/bronze_star.svg`;
                            break;
                        case 2:
                            ribbonOak.src = `ribbons/devices/silver_star.svg`;
                            break;
                        case 3:
                            ribbonOak.src = `ribbons/devices/golden_star.svg`;
                            break;
                        default:
                            break;
                    }
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

function resetSelections() {
    // Reset arcs
    const arcCheckboxes = document.querySelectorAll('input[data-arc]');
    arcCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    // Reset badges
    const badgeCheckboxes = document.querySelectorAll('input[data-badge]');
    badgeCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    // Reset ranks
    const rankRadios = document.querySelectorAll('input[data-rank]');
    rankRadios.forEach(radio => {
        radio.checked = false;
    });

    // Reset ribbons
    const ribbonCheckboxes = document.querySelectorAll('input[data-ribbon]');
    ribbonCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    // Reset ribbon device sliders
    const oakNumberInputs = document.querySelectorAll('.ribbon-option-input');
    oakNumberInputs.forEach(input => {
        input.value = 0;
    });

    // Update the selections and URL after resetting
    updateSelectedRibbons();
    updateURL();
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
