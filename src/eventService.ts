import { BeerApp } from './index.js';

export function setupEventListeners(
    searchButton: HTMLButtonElement,
    randomBeerButton: HTMLButtonElement,
    nextPageButton: HTMLButtonElement,
    prevPageButton: HTMLButtonElement,
    infoBtn: HTMLButtonElement,
    beerApp: BeerApp
) {
    searchButton.addEventListener('click', () => {
        console.log('Search button clicked');
        beerApp.searchBeer();
    });

    randomBeerButton.addEventListener('click', () => {
        console.log('RandomBeer button clicked');
        beerApp.getRandomBeer();
    });

    nextPageButton.addEventListener('click', () => {
        beerApp.nextPage();
    });

    prevPageButton.addEventListener('click', () => {
        beerApp.prevPage();
    });

    infoBtn.addEventListener('click', async () => {
        await beerApp.showAdditionalInfo();
    });
}