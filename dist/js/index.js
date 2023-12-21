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
        this.currentPage = 1;
        this.beersPerPage = 10;
        this.displayedBeers = [];
        this.totalBeers = 0;
        this.setupEventListeners();
    }
    setupEventListeners() {
        var _a, _b;
        (_a = document.getElementById('search-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => this.searchBeer());
        (_b = document.getElementById('random-beer-btn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => this.getRandomBeer());
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
}
