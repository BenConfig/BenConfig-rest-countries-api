/* ------------------------------------------------------ */
/*                        Dark Mode                       */
/* ------------------------------------------------------ */
const LIGHT_DARK_TOGGLE = document.querySelector('.light-dark-toggle');
LIGHT_DARK_TOGGLE.addEventListener('click', function() {
    if (!document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.add('dark');
    }
    else document.documentElement.classList.remove('dark');
});

/* ------------------------------------------------------ */
/*                  Region List Animation                 */
/* ------------------------------------------------------ */
const REGION_FILTER_BTN = document.querySelector('.region-filter-btn');
const REGION_LIST = document.querySelector('.region-list');

const RESULTS = document.querySelector('.results');

REGION_FILTER_BTN.addEventListener('click', function() {
    if (REGION_LIST.classList.contains('expanded')) {
        REGION_LIST.classList.remove('expanded');
        this.setAttribute('aria-expanded', 'false');
    }
    else {
        REGION_LIST.classList.add('expanded');
        this.setAttribute('aria-expanded', 'true');
    }
})

/* ------------------------------------------------------ */
/*                      Create Cards                      */
/* ------------------------------------------------------ */
function createCards(data) {
    for (let i of data) {
        const CARD = document.createElement('a');
        CARD.setAttribute('href', '#');
        CARD.classList.add('card');

        const FLAG = document.createElement('img');
        FLAG.setAttribute('src', i.flags.svg);
        FLAG.setAttribute('alt', `The flag of ${i.name}`);

        const TEXT_CONTAINER = document.createElement('div');
        TEXT_CONTAINER.classList.add('text');

        const COUNTRY = document.createElement('h2');
        COUNTRY.classList.add('country-name');
        COUNTRY.innerText = i.name;

        const POPULATION_CONTAINER = document.createElement('p');
        const POPULATION_KEY = document.createElement('span');
        POPULATION_KEY.classList.add('key');
        POPULATION_KEY.innerText = 'Population: ';
        const POPULATION_VALUE = document.createElement('span');
        POPULATION_VALUE.innerText = i.population.toLocaleString();
        POPULATION_CONTAINER.append(POPULATION_KEY, POPULATION_VALUE);

        const REGION_CONTAINER = document.createElement('p');
        const REGION_KEY = document.createElement('span');
        REGION_KEY.classList.add('key');
        REGION_KEY.innerText = 'Region: '
        const REGION_VALUE = document.createElement('span');
        REGION_VALUE.classList.add('region-value');
        REGION_VALUE.innerText = i.region;
        REGION_CONTAINER.append(REGION_KEY, REGION_VALUE);

        const CAPITAL_CONTAINER = document.createElement('p');
        const CAPITAL_KEY = document.createElement('span');
        CAPITAL_KEY.classList.add('key');
        CAPITAL_KEY.innerText = 'Capital: ';
        const CAPITAL_VALUE = document.createElement('span');
        CAPITAL_VALUE.innerText = i.capital || 'none';
        CAPITAL_CONTAINER.append(CAPITAL_KEY, CAPITAL_VALUE);

        TEXT_CONTAINER.append(COUNTRY, POPULATION_CONTAINER, REGION_CONTAINER, CAPITAL_CONTAINER);

        CARD.append(FLAG, TEXT_CONTAINER);

        RESULTS.append(CARD);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    fetch('https://restcountries.com/v2/all')
        .then(response => response.json())
        .then(data => createCards(data));
}, false);

/* ------------------------------------------------------ */
/*                    Filter by Region                    */
/* ------------------------------------------------------ */
const RADIO_BTNS = document.querySelectorAll('.radio');

function unfilter() {
    const CARDS = document.querySelectorAll('.card');
    for (let card of CARDS) {
        card.classList.remove('region-filter');
    }
}

function filter(selectedRegion) {
    const CARD_REGIONS = document.querySelectorAll('.region-value');
    
    for (let region of CARD_REGIONS) {
        if (region.innerText !== selectedRegion) {
            region.parentElement.parentElement.parentElement.classList.add('region-filter');
        }
    }
}

RADIO_BTNS.forEach(radio => {
    radio.addEventListener('input', e => {
        unfilter();
        switch(e.target.value) {
            case 'all':
                break;
            case 'africa':
                filter('Africa');
                break;
            case 'america':
                filter('Americas');
                break;
            case 'asia':
                filter('Asia');
                break;
            case 'europe':
                filter('Europe');
                break;
            case 'oceania':
                filter('Oceania');
                break;
        }
    })
})

/* ------------------------------------------------------ */
/*                  Search for a Country                  */
/* ------------------------------------------------------ */
const COUNTRY_SEARCH = document.querySelector('.country-search');

COUNTRY_SEARCH.addEventListener('keydown', function(e) {
    if(e.keyCode == 13) {
        e.preventDefault();
      }
});

COUNTRY_SEARCH.addEventListener('input', function() {

const CARD_NAMES = document.querySelectorAll('.country-name');
    if (COUNTRY_SEARCH.value) {
        let search = COUNTRY_SEARCH.value.toLowerCase().trim();
        
        const regex = new RegExp(search);

        for (let name of CARD_NAMES) {
            if (regex.test(name.innerText.toLowerCase())) {
                name.parentElement.parentElement.classList.remove('search-filter');
            }
            else {
                name.parentElement.parentElement.classList.add('search-filter')
            }
        }
    }
    else {
        for (let name of CARD_NAMES) {
            name.parentElement.parentElement.classList.remove('search-filter');
        }
    }
})

/* ------------------------------------------------------ */
/*                  Display Country Info                  */
/* ------------------------------------------------------ */
const MAIN = document.querySelector('.main');

const FEATURED = document.querySelector('.featured');

const FEATURED_FLAG = FEATURED.querySelector('.featured-flag');
const FEATURED_COUNTRY_NAME = FEATURED.querySelector('.featured-country-name');
const FEATURED_NATIVE_NAME = document.getElementById('native-name');
const FEATURED_POPULATION = document.getElementById('population');
const FEATURED_REGION = document.getElementById('region');
const FEATURED_SUB_REGION = document.getElementById('sub-region');
const FEATURED_CAPITAL = document.getElementById('capital');

const FEATURED_TOP_LEVEL_DOMAIN = document.getElementById('top-level-domain');
const FEATURED_CURRENCIES = document.getElementById('currencies');
const FEATURED_LANGUAGES = document.getElementById('languages');

const FEATURED_BORDER_COUNTRIES = document.querySelector('.featured-border-countries-btn-group');

function clearBorderCountries() {
    while (FEATURED_BORDER_COUNTRIES.firstChild) {
        FEATURED_BORDER_COUNTRIES.removeChild(FEATURED_BORDER_COUNTRIES.firstChild);
    }
}

function displayCountryInfo(country) {
    MAIN.classList.add('hide');
    FEATURED.classList.add('show');

    clearBorderCountries();

    FEATURED_FLAG.src = country.flags.svg;
    FEATURED_FLAG.alt = `Flag of ${country.name}`;

    FEATURED_COUNTRY_NAME.innerText = country.name;
    FEATURED_NATIVE_NAME.innerText = country.nativeName;
    FEATURED_POPULATION.innerText = country.population.toLocaleString();
    FEATURED_REGION.innerText = country.region;
    FEATURED_SUB_REGION.innerText = country.subregion;
    FEATURED_CAPITAL.innerText = country.capital;

    FEATURED_TOP_LEVEL_DOMAIN.innerText = country.topLevelDomain;
    

    const currencies = [];
    country.currencies.forEach(currency => currencies.push(currency.name));
    FEATURED_CURRENCIES.innerText = currencies.join(', ');
    
    const languages = [];
    country.languages.forEach(language => languages.push(language.name));
    FEATURED_LANGUAGES.innerText = languages.join(', ');

    if (country.borders) {
        country.borders.forEach(async borderCountry => {
            borderCountry = await fetch(`https://restcountries.com/v2/alpha/${borderCountry}`)
                .then(response => response.json())
                .then(data => data.name);
            
            FEATURED_BORDER_COUNTRY_BTN = document.createElement('button');
            FEATURED_BORDER_COUNTRY_BTN.classList.add('featured-border-country-btn');
            FEATURED_BORDER_COUNTRY_BTN.setAttribute('type', 'button');
            FEATURED_BORDER_COUNTRY_BTN.innerText = borderCountry;
            FEATURED_BORDER_COUNTRY_BTN.addEventListener('click', function() {
            
            clearBorderCountries();
    
            fetch(`https://restcountries.com/v2/name/${borderCountry}`)
                .then(response => response.json())
                .then(data => displayCountryInfo(data[0]));
            })
    
            FEATURED_BORDER_COUNTRIES.append(FEATURED_BORDER_COUNTRY_BTN);
        });
    }
    
    
}

MAIN.addEventListener('click', e => {
    if (e.target.classList.value === 'card') {
        e.preventDefault(); // Prevents auto-scoll to top of page
        
        const country = e.target.querySelector('.country-name').innerText;
        fetch(`https://restcountries.com/v2/name/${country}`)
        .then(response => response.json())
        .then(data => displayCountryInfo(data[0]));
    };
});

/* ------------------------------------------------------ */
/*                     Go Back to Main                    */
/* ------------------------------------------------------ */
const BACK_BTN = document.querySelector('.back-btn');

BACK_BTN.addEventListener('click', function() {
    MAIN.classList.remove('hide');
    FEATURED.classList.remove('show');
})