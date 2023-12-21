var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function setupEventListeners(searchButton, randomBeerButton, nextPageButton, prevPageButton, infoBtn, beerApp) {
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
    infoBtn.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
        yield beerApp.showAdditionalInfo();
    }));
}
