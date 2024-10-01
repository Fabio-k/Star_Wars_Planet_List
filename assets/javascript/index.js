const planetList = document.getElementById("planetList");
const planetInput = document.getElementById("planetInput");
const PLANETS_URL = "https://swapi.dev/api/planets?format=json";
let next_planets_url;
let previous_planets_url;
let isLoadingPlanet = false;

const planetStyle = (terrain) => {
  const green = [
    "grasslands",
    "jungle",
    "rainforests",
    "grassy hills",
    "swamp",
    "forests",
    "fungus forests",
    "grass",
    "plains",
    "jungles",
    "swamps",
  ];
  const yellow = ["desert", "deserts"];
  const blue = ["ocean", "tundra", "lakes", "oceans", "glaciers"];
  let mainTerrain = terrain;
  if (mainTerrain.includes(",")) {
    mainTerrain = terrain.split(",")[0];
  }

  if (green.includes(mainTerrain)) {
    return "planetGreen";
  } else if (yellow.includes(mainTerrain)) {
    return "planetYellow";
  } else if (blue.includes(mainTerrain)) {
    return "planetBlue";
  }

  return "planetDefault";
};

const findPlanet = async (planetName) => {
  if (isLoadingPlanet) {
    return;
  }
  isLoadingPlanet = true;
  if (planetName == null) {
    planetName = planetInput.value;
  }
  const response = await fetch(
    `https://swapi.dev/api/planets?search=${planetName}`
  );
  const planet = await response.json();
  isLoadingPlanet = false;

  if (planet.count != 1) {
    return alert("planet not found");
  }
  displayPlanetData(planet.results[0]);
};

const nextPlanets = () => {
  getPlanets(next_planets_url);
};

const previousPlanets = () => {
  getPlanets(previous_planets_url);
};

const updatePageButtonsUrl = (planets) => {
  const nextButton = document.getElementById("nextButton");
  const previousButton = document.getElementById("previousButton");
  console.log("called");
  if (planets.next) {
    next_planets_url = planets.next;
    nextButton.disabled = false;
  } else {
    nextButton.disabled = true;
  }
  if (planets.previous) {
    previous_planets_url = planets.previous;
    previousButton.disabled = false;
  } else {
    previousButton.disabled = true;
  }
};

const getPlanets = async (url) => {
  planetList.innerHTML = "";
  const response = await fetch(url);
  const planets = await response.json();

  updatePageButtonsUrl(planets);

  const limit = [3, 4, 3];
  let lastButtonIndex = 0;
  for (let i = 0; i < 3; i++) {
    let div = document.createElement("div");
    let firstButtonIndex = lastButtonIndex;
    lastButtonIndex += limit[i];

    for (let j = firstButtonIndex; j < lastButtonIndex; j++) {
      let planet = planets.results[j];
      const button = document.createElement("button");
      button.className = "planetButton";
      button.textContent = planet.name;
      button.setAttribute("onClick", `findPlanet('${planet.name}')`);
      div.appendChild(button);
    }
    planetList.appendChild(div);
  }
};

const displayPlanetData = (planet) => {
  document.getElementById("planetName").innerText = planet.name;
  document.getElementById("planetPopulation").innerText =
    "Population: " + formatNumberWithCommas(planet.population);

  document.getElementById("planetClime").innerText = planet.climate;
  document.getElementById("planetTerrain").innerText = planet.terrain;

  document.getElementById("planet").classList = planetStyle(planet.terrain);
};

const formatNumberWithCommas = (number) => {
  if (isNaN(number)) {
    return "?";
  }
  return Intl.NumberFormat("en-Us").format(number);
};

getPlanets(PLANETS_URL);

window.addEventListener("load", function () {
  const planet = document.getElementById("planet");
  const buttonPlanet = this.document.getElementById("searchButton");
  const updateHeight = () => {
    const width = planet.offsetWidth;
    const buttonWidth = buttonPlanet.offsetWidth;
    planet.style.height = width + "px";
    buttonPlanet.style.height = buttonWidth + "px";
  };

  updateHeight();

  window.addEventListener("resize", updateHeight);
});
