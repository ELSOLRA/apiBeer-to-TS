"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class BeerApp {
    constructor() {
        this.searUrlApi = 'https://api.punkapi.com/v2/beers';
        this.input = document.getElementById('site-search');
        this.searchedContent = document.getElementById('searched-content');
        this.imgBox = document.getElementById('img-box');
        this.descriptionBox = document.getElementById('description-box');
        this.currentPage = 1;
        this.beersPerPage = 10;
        this.displayedBeers = [];
        this.totalBeers = 0;
        this.totalPages = 0;
        this.lastSearchWord = '';
        this.currentPageSpan = document.getElementById('current-page');
        this.searchButton = document.getElementById('search-btn');
        this.nextPageButton = document.getElementById('next-page');
        this.prevPageButton = document.getElementById('prev-page');
        this.randomBeerButton = document.getElementById('random-beer-btn');
        this.beerImage = document.getElementById('image');
        this.infoBtn = document.getElementById('info-btn');
        this.beerName = document.getElementById('beer-name');
        this.setupEventListeners();
    }
    setupEventListeners() {
        this.searchButton.addEventListener('click', () => this.searchBeer());
        this.randomBeerButton.addEventListener('click', () => this.getRandomBeer());
        this.nextPageButton.addEventListener("click", () => this.nextPage());
        this.prevPageButton.addEventListener("click", () => this.prevPage());
        this.infoBtn.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () { return this.showAdditionalInfo(); }));
    }
    getRandomBeer() {
        return __awaiter(this, void 0, void 0, function* () {
            this.searchedContent.textContent = '';
            try {
                const response = yield fetch(`${this.searUrlApi}/random`);
                if (!response.ok) {
                    throw new Error(`HTTP Error!: ${response.status}`);
                }
                const beer = yield response.json();
                this.displayBeer(beer);
            }
            catch (error) {
                console.log("Error fetching message :", error);
            }
        });
    }
    searchBeer() {
        return __awaiter(this, void 0, void 0, function* () {
            this.searchedContent.textContent = '';
            const searchWord = this.input.value.trim();
            let pageForTotal = 1;
            let moreResults = true;
            let totalResultBeers = [];
            if (searchWord === '') {
                return;
            }
            try {
                const response = yield fetch(`${this.searUrlApi}?beer_name=${searchWord}&page=${this.currentPage}&per_page=${this.beersPerPage}`);
                if (!response.ok) {
                    throw new Error(`HTTP Error!: ${response.status}`);
                }
                const result = yield response.json();
                console.log(result);
                this.displayedBeers = result;
                while (moreResults) {
                    const totalSearchedBeersResponse = yield fetch(`${this.searUrlApi}?beer_name=${searchWord}&page=${pageForTotal}&per_page=80`);
                    const data = yield totalSearchedBeersResponse.json();
                    if (data.length > 0) {
                        totalResultBeers = totalResultBeers.concat(data);
                        pageForTotal++;
                    }
                    else {
                        moreResults = false;
                    }
                }
                this.totalBeers = totalResultBeers.length;
                console.log(this.totalBeers);
                if (this.displayedBeers.length === 0) {
                    this.displayNoResults();
                }
                else {
                    this.displayBeerList();
                    this.updatePageDisplay();
                }
            }
            catch (error) {
                console.log("Error fetching message :", error);
            }
        });
    }
    displayNoResults() {
        this.searchedContent.innerHTML = "<p>No results found for the given search term.</p>";
    }
    displayNoImage() {
        this.imgBox.textContent = "";
        const noImagePlaceholder = document.createElement('img');
        noImagePlaceholder.src = 'https://as2.ftcdn.net/v2/jpg/00/89/55/15/1000_F_89551596_LdHAZRwz3i4EM4J0NHNHy2hEUYDfXc0j.jpg';
        noImagePlaceholder.alt = 'No Image';
        this.imgBox.appendChild(noImagePlaceholder);
    }
    displayBeer(beer) {
        this.searchedContent.textContent = "";
        const beerElement = document.createElement('p');
        beerElement.classList.add('one-beer');
        beerElement.textContent = beer.name;
        beerElement.addEventListener('click', () => {
            var _a;
            this.displayBeerDetails(beer);
            beerElement.style.backgroundColor = "yellow";
            (_a = document.querySelector(".one-beer")) === null || _a === void 0 ? void 0 : _a.classList.add("showPil");
            this.descriptionBox.textContent = "";
        });
        this.searchedContent.appendChild(beerElement);
    }
    displayBeerList() {
        this.searchedContent.textContent = "";
        const beerList = document.createElement('ul');
        beerList.classList.add('beer-list');
        this.displayedBeers.forEach(beer => {
            const beerItem = document.createElement('li');
            beerItem.textContent = beer.name;
            beerItem.addEventListener('click', () => {
                this.descriptionBox.textContent = "";
                this.clearSelectedLi();
                this.markSelectedLi(beerItem);
                this.displayBeerDetails(beer);
            });
            beerList.appendChild(beerItem);
        });
        this.searchedContent.appendChild(beerList);
    }
    ;
    updatePageDisplay() {
        this.totalPages = Math.ceil(this.totalBeers / this.beersPerPage);
        this.currentPageSpan.textContent = `${this.currentPage} / ${this.totalPages}`;
    }
    ;
    nextPage() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                yield this.searchBeer();
                this.updatePageDisplay();
            }
        });
    }
    prevPage() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.currentPage > 1) {
                this.currentPage--;
                yield this.searchBeer();
                this.updatePageDisplay();
            }
        });
    }
    displayBeerDetails(beer) {
        this.imgBox.textContent = '';
        if (beer.image_url !== null && beer.image_url !== '') {
            this.beerImage.src = beer.image_url;
            this.imgBox.appendChild(this.beerImage);
        }
        else {
            this.displayNoImage();
        }
        this.beerName.textContent = beer.name;
        console.log(beer);
    }
    clearSelectedLi() {
        const liElements = document.querySelectorAll('.beer-list li');
        liElements.forEach((li) => {
            li.classList.remove('selected');
        });
    }
    markSelectedLi(beerItem) {
        beerItem.classList.add('selected');
    }
    showAdditionalInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            const selectedBeerName = this.beerName.textContent;
            this.descriptionBox.textContent = "";
            try {
                const response = yield fetch(`${this.searUrlApi}?beer_name=${selectedBeerName}`);
                if (!response.ok) {
                    throw new Error(`HTTP Error!: ${response.status}`);
                }
                const beers = yield response.json();
                console.log(beers);
                if (beers.length > 0) {
                    const selectedBeer = beers[0];
                    const displayHops = selectedBeer.ingredients.hops.map(hop => hop.name).join(', ');
                    const displayMalt = selectedBeer.ingredients.malt.map(malt => malt.name).join(', ');
                    const volumeInfo = `
                        <p>Description: ${selectedBeer.description}</p>
                        <p>Volume: ${selectedBeer.volume.value} ${selectedBeer.volume.unit}</p>
                        <p>ABV: ${selectedBeer.abv}%</p>
                        <p>Malt: ${displayMalt}</p>
                        <p>Hops: ${displayHops}</p>
                        <p>Food paring: ${selectedBeer.food_pairing}</p>
                        <p>Brew Tips: ${selectedBeer.brewers_tips}</p>
                    `;
                    this.descriptionBox.innerHTML = volumeInfo;
                    console.log("Additional Info for", selectedBeerName, ":", selectedBeer);
                }
            }
            catch (error) {
                console.log("Error fetching additional info:", error);
            }
        });
    }
}
