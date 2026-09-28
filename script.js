let allCountriesData = JSON.parse(localStorage.getItem("allCountries"));
let currentCountriesData = allCountriesData;
let regionCountryDetails;
// let filteredCountriesFromSearchInput
let filteredCountriesAfterSearchSubmitForRendering;
let inputValue;
let paginationMaximumOutcomes;

// let paginationCurrentMaximumPossiblePageNumbers = []

const searchBar = document.querySelector(".search-bar");
const searchBarButton = document.querySelector(".search-bar__button");
const searchBarInput = document.querySelector(".search-bar__input");
const searchBarSuggestionList = document.querySelector(
  ".search-bar-suggestion__list",
);
const navThemeChangerButton = document.querySelector(".nav__theme-changer");
const navThemeChangerButtonIcon = document.querySelector(
  ".nav__theme-changer-icon",
);
const filterToggleContainer = document.querySelector(
  ".filter-toggle--container",
);
const filterToggle = document.querySelector(".filter-toggle");
const filterToggleTitle = document.querySelector(".filter-toggle>div");
const filterToggleList = document.querySelector(".filter-toggle__list");
const filterToggleCaret = document.querySelector(".filter-toggle__caret");
const filterToggleCloseButton = document.querySelector(
  ".filter-toggle__close-button",
);
const countriesContainer = document.querySelector(".countries-card--container");
const filterToggleOptions = document.querySelectorAll(
  ".filter-toggle__list>option",
);
const paginationPreviousButton = document.querySelector(
  ".pagination__prev-btn",
);
const paginationNumberButtonContainer = document.querySelector(
  ".pagination__number-btn-container",
);
let paginationNumberButton;
const paginationNextButton = document.querySelector(".pagination__next-btn");
let paginationClickedButtonNumber = 0;
/* whenever user starts to type some where it should get straight into input bar ,scroll bar is getting hidden whenever i am i search something that does not exist., arrange everything in alphabetical order */

async function fetchCountriesData() {
  const countriesData = [];
  let offset = 0;
  let isRepeat = true;
  // --
  while (isRepeat) {
    const response = await fetch(
      `https://api.restcountries.com/countries/v5?limit=100&offset=${offset}`,
      {
        headers: {
          Authorization: "Bearer rc_live_4ddc7aaf65c74a0d8b1f72f9b3973bb8",
        },
      },
    );
    const result = await response.json();
    countriesData.push(...result.data.objects);
    if (!result.data.meta.more) {
      isRepeat = false; //if no more then run no more.
    } else offset += 100; //increase it by hundread.
  }
  countriesData.forEach((country, i) => (country.id = i + 1)); //adding a unique key value for each country.
  localStorage.setItem("allCountries", JSON.stringify(countriesData));
  allCountriesData = JSON.parse(localStorage.getItem("allCountries"));
  currentCountriesData = allCountriesData;
  console.log(currentCountriesData);
  renderCountries(currentCountriesData);
  paginationMaximumOutcomes =
    renderPaginationMaximumOutcomes(currentCountriesData);
  renderPaginationBar(paginationMaximumOutcomes[0]);
}
console.log(currentCountriesData[0]);

// debugger
// onload event
// ---------------------
if (localStorage.getItem("theme")) {
  document.body.classList.add("dark-mode");
  navThemeChangerButtonIcon.classList.replace("fa-regular", "fa-solid");
}
if (allCountriesData) {
  currentCountriesData = allCountriesData; //please see why even after assigning it i have to re-assign it in order to use it.
  renderCountries(currentCountriesData);
  paginationMaximumOutcomes =
    renderPaginationMaximumOutcomes(currentCountriesData);
  console.log(paginationMaximumOutcomes);
  renderPaginationBar(paginationMaximumOutcomes[0]);
} else {
  fetchCountriesData();
}

//async function that handles fetch.

// -----------
// render Bay
function renderSlicedCountriesData(data, chunkSize = 25) {
  return Array.from({ length: Math.ceil(data.length / chunkSize) }, (_, i) =>
    data.slice(i * chunkSize, (i + 1) * chunkSize),
  );
}

function noCountryFound() {
  countriesContainer.innerHTML = "";
  const noCountryFound = document.createElement("div");
  noCountryFound.classList.add(
    "not-found-404",
    "--d-flex",
    "--d-flex--flex-direction--col",
    "--d-flex--align-center",
  );
  noCountryFound.innerHTML = `<h1>404</h1>
                <div class="not-found-404__text">
                    <p>So sorry,</p>
                    <p>we couldn’t find what you were looking for...</p>
                </div>
                <a class="not-found__btn --hover-focus-effect-transition btn" href="">Back to the homepage</a>`;
  countriesContainer.append(noCountryFound);
}
function renderCountries(data) {
  countriesContainer.innerHTML = "";
  function createCountryCards(country) {
    const countryCard = document.createElement("a");
    countryCard.href = `/country-detailed.html?name=${country.names.common}`;
    countryCard.classList.add("country-card");

    countryCard.innerHTML = `   
            <img src="${country.flag?.url_svg}" alt="${country.names.common + " country flag"}">
            <div class="country-card__information">
            <h1>${country.names.common}</h1>
            <p>population:&nbsp;<span>${country.population.toLocaleString("en-IN")}</span></p>
                <p>Region:&nbsp;<span>${country.region}</span></p>
                <p>Capital:&nbsp;<span>${country.capital}</span></p>
                </div>`;
    countriesContainer.append(countryCard);
  }
  if (data.length) {
    let slicedData = renderSlicedCountriesData(data);
    // console.log(slicedData)
    slicedData[paginationClickedButtonNumber].forEach((data) => {
      createCountryCards(data);
    });
  } else {
    noCountryFound();
  }

  // console.log('hey')

  // }
}
function renderRegionCountries(data, value) {
  if (data.length) {
    setTimeout((e) => {
      regionCountryDetails = data.filter((country) => {
        return country.region.includes(value);
      });
      localStorage.setItem(
        "regionCountries",
        JSON.stringify(regionCountryDetails),
      );
      currentCountriesData = JSON.parse(
        localStorage.getItem("regionCountries"),
      );
      renderCountries(currentCountriesData);
    }, 300);
  } else {
    noCountryFound();
  }
}
function filterCountriesFromSearchInput(value) {
  let filteredCountriesFromSearchInput = allCountriesData.filter((country) => {
    return country.name.common.toLowerCase().includes(value.toLowerCase()); //how the hell when nothing matches it return all.
  });
  return filteredCountriesFromSearchInput;
}
function renderSuggestions(value) {
  // debugger
  if (value && value !== " ") {
    let filteredCountriesForSuggestionList = filterCountriesFromSearchInput(
      value,
    ).slice(0, 10);
    // console.log(filteredCountriesFromSuggestionList)

    function searchBarSuggestion(data) {
      searchBarSuggestionList.innerHTML = "";
      if (data.length) {
        data.forEach((country) => {
          const countrySuggestion = document.createElement("a");
          countrySuggestion.href = `/country-detailed.html?name=${country.name.common}`;
          countrySuggestion.classList.add(
            "--hover-focus-effect-transition",
            "search-bar-suggestion__list-option",
          );
          countrySuggestion.innerText = country.name.common;
          searchBarSuggestionList.append(countrySuggestion);
        });
        searchBar.classList.add("search-bar--activated");
        searchBarSuggestionList.classList.add(
          "search-bar-suggestion__list--activated",
        );
      } else {
        searchBarSuggestionList.classList.remove(
          "search-bar-suggestion__list--activated",
        );
        searchBar.classList.remove("search-bar--activated");
      }
    }
    searchBarSuggestion(filteredCountriesForSuggestionList);
    // console.log(value)
  } else {
    searchBarSuggestionList.classList.remove(
      "search-bar-suggestion__list--activated",
    );
    searchBar.classList.remove("search-bar--activated");
    // console.log('hero')
  }
}

function renderPaginationMaximumOutcomes(data, chunkSize = 5) {
  // return setTimeout(() => {
  console.log(data);
  const paginationCurrentMaximumPossiblePageNumbers = Math.ceil(
    data.length / 25,
  );
  console.log(paginationCurrentMaximumPossiblePageNumbers);
  const paginationCurrentMaximumPossiblePageNumbersArray = Array.from(
    { length: paginationCurrentMaximumPossiblePageNumbers },
    (_, i) => i + 1,
  );

  console.log(
    paginationCurrentMaximumPossiblePageNumbers,
    paginationCurrentMaximumPossiblePageNumbersArray,
  );
  //
  return Array.from(
    { length: Math.ceil(paginationCurrentMaximumPossiblePageNumbers / 5) },
    (_, i) =>
      paginationCurrentMaximumPossiblePageNumbersArray.slice(
        i * chunkSize,
        (i + 1) * chunkSize,
      ),
  );
  // }, 1000)
}

function renderPaginationBar(data) {
  //add an if else condition here ye code empty array condition me break ho ja rha hai.
  paginationNumberButtonContainer.innerHTML = ``;
  // setTimeout(() => {
  data.forEach((e) => {
    const paginationNumberButton = document.createElement("a");
    paginationNumberButton.classList.add(
      "pagination__btn",
      "pagination__num-btn",
    );
    paginationNumberButton.innerText = e;
    paginationNumberButtonContainer.append(paginationNumberButton);
  });
  // }, 1000)
  paginationNumberButton = document.querySelectorAll(".pagination__num-btn");

  paginationNumberButton.forEach((numberButton) => {
    numberButton.addEventListener("click", (e) => {
      e.preventDefault();
      const buttonNumber = parseInt(e.target.innerText) - 1;
      console.log(buttonNumber);
      if (paginationClickedButtonNumber !== buttonNumber) {
        paginationClickedButtonNumber = buttonNumber;
        console.log(paginationClickedButtonNumber);
        renderCountries(currentCountriesData);
        // e.target.style.backgroundColor = "black"//i want i cannot select the current page number, after being selected it should have a different color with user select not allowed turned on.
      }
    });
  });
}
// --------------------
// document events
document.addEventListener("click", (e) => {
  if (
    !searchBarSuggestionList.contains(e.target) &&
    !searchBar.contains(e.target)
  ) {
    if (
      searchBarSuggestionList.classList.contains(
        "search-bar-suggestion__list--activated",
      )
    ) {
      //do not think non-sense even with search bar class as condition still would have been fine.
      searchBarSuggestionList.classList.remove(
        "search-bar-suggestion__list--activated",
      );
      searchBar.classList.remove("search-bar--activated");
    }
  }
  if (!filterToggleContainer.contains(e.target)) {
    if (filterToggleList.classList.contains("filter-toggle__list--activated")) {
      filterToggleCaret.classList.remove(
        "filter-toggle__caret--open",
        "filter-toggle__list--activated",
      );
    }
  }
});

// -------------------------
// nav theme changer
navThemeChangerButton.addEventListener("click", (e) => {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark-mode");
    navThemeChangerButtonIcon.classList.replace("fa-regular", "fa-solid");
  } else {
    localStorage.removeItem("theme");
    navThemeChangerButtonIcon.classList.replace("fa-solid", "fa-regular");
  }
});

// --------------------------
// search Bar stuff

searchBar.addEventListener("mouseenter", (e) => {
  searchBarButton.classList.add("search-bar__button--hover");
});
searchBar.addEventListener("mouseleave", (e) => {
  searchBarButton.classList.remove("search-bar__button--hover");
});

searchBarInput.addEventListener("focus", (e) => {
  searchBarButton.classList.add("search-bar__button--activated");
  renderSuggestions(e.target.value);
});
searchBarInput.addEventListener("blur", (e) => {
  searchBarButton.classList.remove("search-bar__button--activated");
});
searchBarInput.addEventListener("input", (e) => {
  /*  if (!filterToggleCloseButton.classList.contains('filter-toggle__close-button--activated') && currentCountriesData !== allCountriesData) {
        currentCountriesData = allCountriesData
        console.log('hello')
        } */
  /*  if (currentCountriesData !== allCountriesData) {
         currentCountriesData = allCountriesData
     } */
  renderSuggestions(e.target.value);
});

searchBar.addEventListener("submit", (e) => {
  //Q if i would have chosen key down as an even would that have been better.
  e.preventDefault();
  searchBarInput.blur();
  // console.log(typeof (searchBarInput.value))

  renderSuggestions(false);
  if (searchBarInput.value) {
    filteredCountriesAfterSearchSubmitForRendering =
      filterCountriesFromSearchInput(searchBarInput.value);
    console.log(filteredCountriesAfterSearchSubmitForRendering);
    console.log(searchBarInput.value);
    currentCountriesData = filteredCountriesAfterSearchSubmitForRendering;
  } else {
    //input return value always in string so there is cannot be a falsy value except for ''(empty string) and that is why there are only 2 case, toh use le kiye if elseif else ladder kyu bannana.
    currentCountriesData = allCountriesData;
  }

  renderCountries(currentCountriesData);
  // debugger
  paginationMaximumOutcomes =
    renderPaginationMaximumOutcomes(currentCountriesData);
  console.log(paginationMaximumOutcomes);
  renderPaginationBar(paginationMaximumOutcomes[0]);
  inputValue = searchBarInput.value;

  if (
    filterToggleCloseButton.classList.contains(
      "filter-toggle__close-button--activated",
    )
  ) {
    filterToggleTitle.innerText = `Filter by Region`;
    filterToggle.classList.remove("filter-toggle--border-left-activated");
    filterToggleCloseButton.classList.remove(
      "filter-toggle__close-button--activated",
    );
    console.log("hey");
  }
});

// ----------------------------------------------------------
// filter Toggle stuff

filterToggleCaret.addEventListener("click", (e) => {
  filterToggleCaret.classList.toggle("filter-toggle__caret--open");
  filterToggleList.classList.toggle("filter-toggle__list--activated");
});

filterToggleCloseButton.addEventListener("click", (e) => {
  filterToggleTitle.innerText = `Filter by Region`;
  filterToggle.classList.remove("filter-toggle--border-left-activated");
  filterToggleCaret.classList.remove("filter-toggle__caret--open");
  filterToggleList.classList.remove("filter-toggle__list--activated");
  filterToggleCloseButton.classList.remove(
    "filter-toggle__close-button--activated",
  );
  setTimeout((e) => {
    if (inputValue) {
      currentCountriesData = filteredCountriesAfterSearchSubmitForRendering;
    } else {
      currentCountriesData = allCountriesData;
    }
    renderCountries(currentCountriesData);
    paginationMaximumOutcomes =
      renderPaginationMaximumOutcomes(currentCountriesData);
    renderPaginationBar(paginationMaximumOutcomes[0]);
  }, 300);
});

filterToggleOptions.forEach((region) => {
  region.addEventListener("click", (e) => {
    filterToggleTitle.innerText = region.value;
    filterToggle.classList.add("filter-toggle--border-left-activated");
    filterToggleList.classList.toggle("filter-toggle__list--activated");
    filterToggleCaret.classList.toggle("filter-toggle__caret--open");
    filterToggleCloseButton.classList.add(
      "filter-toggle__close-button--activated",
    );
    if (inputValue) {
      currentCountriesData = filteredCountriesAfterSearchSubmitForRendering;
    } else {
      currentCountriesData = allCountriesData;
    }
    // searchBarInput.value = ''

    renderRegionCountries(currentCountriesData, region.value);
    paginationMaximumOutcomes =
      renderPaginationMaximumOutcomes(currentCountriesData);
    renderPaginationBar(paginationMaximumOutcomes[0]);
  });
});

// -------------------------------------------------------
// pagination stuff

// let paginationCurrentMaximumPossiblePageNumbers = [1, 2, 3, 4, 5];
/* let paginationLastNumberFromCurrentNumbers = paginationCurrentMaximumPossiblePageNumbers[paginationCurrentMaximumPossiblePageNumbers.length - 1];
let paginationFirstNumberFromCurrentNumbers;
 */
paginationPreviousButton.addEventListener("click", (e) => {
  e.preventDefault();
  /*   if (paginationFirstNumberFromCurrentNumbers >= 6) {
        for (let i = 4; i >= 0; i--) {
            paginationCurrentMaximumPossiblePageNumbers[i] = paginationFirstNumberFromCurrentNumbers - 1
            paginationFirstNumberFromCurrentNumbers = paginationCurrentMaximumPossiblePageNumbers[i]
            paginationNumberButton[i].innerText = `${paginationFirstNumberFromCurrentNumbers}`
            }
            paginationLastNumberFromCurrentNumbers = paginationCurrentMaximumPossiblePageNumbers[paginationCurrentMaximumPossiblePageNumbers.length - 1]
            } */
  /*  if (--index >= 0) {
         renderPaginationBar(paginationMaximumOutcomes[index])
         // console.log('dev', index -= 1)
     } */
  if (index > 0) {
    // paginationPreviousButton.classList.remove('cursor--not-allowed')//figure out how you are going to do it.
    renderPaginationBar(paginationMaximumOutcomes[--index]);
    // console.log(--index)
  } else {
    // paginationPreviousButton.classList.add('cursor--not-allowed')//figure out how you are going to do it.
  }
});

/* function recreatePaginationInIncrement() {

    if (paginationLastNumberFromCurrentNumbers < currentCountriesData.length / 25) {
        for (let i = 0; i < 5; i++) {
            paginationLastNumberFromCurrentNumbers += 1
            paginationCurrentMaximumPossiblePageNumbers[i] = paginationLastNumberFromCurrentNumbers
            paginationNumberButton[i].innerText = `${paginationCurrentMaximumPossiblePageNumbers[i]}`
        }
        paginationLastNumberFromCurrentNumbers = paginationCurrentMaximumPossiblePageNumbers[4]
        paginationFirstNumberFromCurrentNumbers = paginationCurrentMaximumPossiblePageNumbers[0]
    }
} */
let index = 0;
paginationNextButton.addEventListener("click", function name(e) {
  e.preventDefault();
  if (index < paginationMaximumOutcomes.length - 1) {
    renderPaginationBar(paginationMaximumOutcomes[++index]);
    // console.log(++index)
    // paginationNextButton.classList.remove('cursor--not-allowed')//figure out how you are going to do it.
  } else {
    // paginationNextButton.classList.add('cursor--not-allowed')//figure out how you are going to do it.
  }
});
