var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function getRandomBeer(apiUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`${apiUrl}/random`);
            if (!response.ok) {
                throw new Error(`HTTP Error!: ${response.status}`);
            }
            const beer = yield response.json();
            return beer;
        }
        catch (error) {
            console.error("Error fetching random beer:", error);
            throw error;
        }
    });
}
export function searchBeers(apiUrl, searchWord, currentPage, beersPerPage) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`${apiUrl}?beer_name=${searchWord}&page=${currentPage}&per_page=${beersPerPage}`);
            if (!response.ok) {
                throw new Error(`HTTP Error!: ${response.status}`);
            }
            const result = yield response.json();
            return result;
        }
        catch (error) {
            console.error("Error fetching beers:", error);
            throw error;
        }
    });
}
export function getBeerDetails(apiUrl, beerName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`${apiUrl}?beer_name=${beerName}`);
            if (!response.ok) {
                throw new Error(`HTTP Error!: ${response.status}`);
            }
            const beers = yield response.json();
            if (beers.length > 0) {
                return beers[0];
            }
            else {
                throw new Error(`No beer found with the name ${beerName}`);
            }
        }
        catch (error) {
            console.error("Error fetching beer details:", error);
            throw error;
        }
    });
}
