const countryName = new URLSearchParams(location.search)
  .get("name")
  .toLowerCase();
let allCountriesData = JSON.parse(localStorage.getItem("allCountries"));
const navThemeChangerButton = document.querySelector(".nav__theme-changer");
const navThemeChangerButtonIcon = document.querySelector(
  ".nav__theme-changer-icon",
);
const countryDetailsFlagImg = document.querySelector(
  ".country-details__flag>img",
);
const countryDetailsInfoName = document.querySelector(
  ".country-details__info-name",
);
const countryDetailsNativeName = document.querySelector(
  ".country-details__native-name",
);
const countryDetailsPopulation = document.querySelector(
  ".country-details__population",
);
const countryDetailsRegion = document.querySelector(".country-details__region");
const countryDetailsSubRegion = document.querySelector(
  ".country-details__sub-region",
);
const countryDetailsCapital = document.querySelector(
  ".country-details__capital",
);
const countryDetailsTopLevelDomain = document.querySelector(
  ".country-details__top-level-domain",
);
const countryDetailsCurrency = document.querySelector(
  ".country-details__currency",
);
const countryDetailsLanguages = document.querySelector(
  ".country-details__languages",
);
const borderCountryButtonList = document.querySelector(
  ".country-details__borders-buttons-list",
);
const borderCountryParagraph = document.querySelector(
  ".country-details__borders>p",
);

if (localStorage.getItem("theme")) {
  document.body.classList.add("dark-mode");
  navThemeChangerButtonIcon.classList.replace("fa-regular", "fa-solid");
}

function renderCountryDetails([country]) {
  countryDetailsInfoName.innerText = `${country.names.common}`;
  countryDetailsPopulation.innerText = `${country.population.toLocaleString("en-IN")}`;
  countryDetailsRegion.innerText = `${country.region}`;

  if (country.names.nativeName) {
    countryDetailsNativeName.innerText = `${Object.values(country.name.nativeName)[0].common}`;
  } else {
    console.log();
    countryDetailsNativeName.innerText = `${"Not Available"}`;
  }
  if (country.subregion) {
    countryDetailsSubRegion.innerText = `${country.subregion}`;
  } else {
    countryDetailsSubRegion.innerText = `${"Not Available"}`;
  }
  if (country.capital) {
    countryDetailsCapital.innerText = `${country.capital.join(", ")}`;
  } else {
    countryDetailsCapital.innerText = `${"Not Available"}`;
  }
  if (country.tld) {
    countryDetailsTopLevelDomain.innerText = `${country.tld.join(", ")}`;
  } else {
    countryDetailsTopLevelDomain.innerText = `${"Not Available"}`;
  }
  if (country.currencies) {
    countryDetailsCurrency.innerText = `${Object.values(country.currencies)
      .map((currency) => currency.name)
      .join(", ")}`;
  } else {
    countryDetailsCurrency.innerText = "Not Available";
  }
  if (country.languages) {
    countryDetailsLanguages.innerText = `${Object.values(country.languages).join(", ")}`;
  } else {
    countryDetailsLanguages.innerText = "Not Available";
  }

  if (country.borders) {
    country.borders.forEach((borderCode) => {
        
    });

    country.borders.forEach((borderCountryCode) => {
      fetch(`https://restcountries.com/v3.1/alpha/${borderCountryCode}`)
        .then((res) => res.json())
        .then(([borderCountry]) => {
          const borderCountryButton = document.createElement("a");
          borderCountryButton.classList.add("btn");
          borderCountryButton.innerText = `${borderCountry.name.common}`;
          borderCountryButton.href = `/country-detailed.html?name=${borderCountry.name.common}`;
          borderCountryButtonList.append(borderCountryButton);
        });
    });
  } else {
    borderCountryParagraph.innerHTML = `Border Countries: <span>No Bordering Countries</span>`;
  }
  countryDetailsFlagImg.alt = `${country.names.common + " country flag"}`;
  countryDetailsFlagImg.src = `${country.flags?.url_svg}`;
}

if (allCountriesData) {
  const countryDetails = allCountriesData.filter((country) => {
    return country.names.common.toLowerCase().includes(countryName);
  });
  renderCountryDetails(countryDetails);
} else {
  fetch("https://restcountries.com/v3.1/all")
    .then((res) => res.json())
    .then((data) => {
      localStorage.setItem("allCountries", JSON.stringify(data));
      allCountriesData = JSON.parse(localStorage.getItem("allCountries"));
      const countryDetails = allCountriesData.filter((country) => {
        return country.name.common.includes(countryName);
      });
      renderCountryDetails(countryDetails);
    });
}

navThemeChangerButton.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark-mode");
    navThemeChangerButtonIcon.classList.replace("fa-regular", "fa-solid");
  } else {
    localStorage.removeItem("theme");
    navThemeChangerButtonIcon.classList.replace("fa-solid", "fa-regular");
  }
});
