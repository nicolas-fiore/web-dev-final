async function build() {

    const response = await fetch('./data/full_data.json');
    const data = await response.json();

    const svg = await fetch("./data/world.svg");
    const svgText = await svg.text();

    document.body.innerHTML += svgText;
    const countryCodes = Object.keys(data);

    countryCodes.forEach(code => {

        const country = document.getElementById(code);

        if (country) {
            country.style.fill = "#7A1706";
        }
    });
    document.querySelectorAll("path").forEach(country => {

        country.addEventListener("click", () => {

            const name = country.id;
            console.log("Clicked:", name);
            const cost = data[name];
            console.log(cost);
            country.style.fill = "blue";
        });
    });
}

build();