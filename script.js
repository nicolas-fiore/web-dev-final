async function build() {
    // Fetch both files
    const [dataResponse, svgResponse] = await Promise.all([
        fetch('./data/full_data.json'),
        fetch('./data/world.svg')
    ]);

    const data = await dataResponse.json();
    const svgText = await svgResponse.text();

    // Put SVG inside the map container
    const mapContainer = document.getElementById('map-container');
    mapContainer.innerHTML = svgText;

    const svg = mapContainer.querySelector('svg');

    // Fix viewBox so SVG scales properly and remove fixed dimensions
    svg.setAttribute('viewBox', '0 0 1009.6727 665.96301');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.removeAttribute('width');
    svg.removeAttribute('height');
    svg.removeAttribute('fill');

    const infoPanel = document.getElementById('info-panel');
    const closeBtn = document.getElementById('close-btn');

    // Stat elements
    const countryName = document.getElementById('country-name');
    const miles = document.getElementById('stat-miles');
    const oneWay = document.getElementById('stat-one-way');
    const roundTrip = document.getElementById('stat-round-trip');
    const arrivals = document.getElementById('stat-arrivals');
    const spending = document.getElementById('stat-spending');
    const avgSpend = document.getElementById('stat-avg-spend');

    // Mark countries that have data with the has-data class (turns them red via CSS)
    Object.keys(data).forEach(code => {
        const country = document.getElementById(code);
        if (country) {
            country.classList.add('has-data');
        }
    });

    // Click events — attached to ALL paths but we guard inside
    svg.querySelectorAll('path').forEach(country => {
        country.addEventListener('click', () => {
            const code = country.id;
            const countryData = data[code];

            // Ignore grey countries with no data
            if (!countryData) return;

            // Remove previous selection
            document.querySelectorAll('.selected').forEach(c => c.classList.remove('selected'));

            // Highlight selected country
            country.classList.add('selected');

            // Small country preview in sidebar
const preview = document.getElementById('country-preview');

preview.innerHTML = '';

const previewSvg = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'svg'
);

previewSvg.setAttribute(
    'viewBox',
    country.getBBox().x + ' ' +
    country.getBBox().y + ' ' +
    country.getBBox().width + ' ' +
    country.getBBox().height
);

previewSvg.setAttribute('width', '100%');
previewSvg.setAttribute('height', '120');

const clone = country.cloneNode(true);

clone.classList.remove('selected');

clone.setAttribute('fill', '#7A1706');
clone.setAttribute('stroke', '#ffffff');
clone.setAttribute('stroke-width', '1');

previewSvg.appendChild(clone);

preview.appendChild(previewSvg);

            // Open sidebar
            infoPanel.classList.add('visible');

            // Fill in panel — using the correct JSON field names
            countryName.textContent = countryData.Entity || code;
            miles.textContent = countryData.Miles_From_Pitt
                ? Math.round(countryData.Miles_From_Pitt).toLocaleString() + ' mi'
                : 'N/A';
            oneWay.textContent = countryData.Single_Flight_Cost
                ? '$' + Number(countryData.Single_Flight_Cost).toFixed(2)
                : 'N/A';
            roundTrip.textContent = countryData.Round_Flight_Cost
                ? '$' + Number(countryData.Round_Flight_Cost).toFixed(2)
                : 'N/A';
            arrivals.textContent = countryData.Arrivals
                ? Number(countryData.Arrivals).toLocaleString()
                : 'N/A';
            spending.textContent = countryData.Spending
                ? '$' + (countryData.Spending / 1e9).toFixed(1) + 'B'
                : 'N/A';
            avgSpend.textContent = countryData.Average_Spending_Per
                ? '$' + Number(countryData.Average_Spending_Per).toFixed(2)
                : 'N/A';
        });
    });

    // Close sidebar
    closeBtn.addEventListener('click', () => {
        infoPanel.classList.remove('visible');
        document.querySelectorAll('.selected').forEach(c => c.classList.remove('selected'));
    });
}

build();
