export async function getRandomBeer(apiUrl: string) {
    try {
        const response = await fetch(`${apiUrl}/random`);
        if (!response.ok) {
            throw new Error(`HTTP Error!: ${response.status}`);
        }
        const beer = await response.json();
        return beer;
    } catch (error) {
        console.error("Error fetching random beer:", error);
        throw error;
    }
}

export async function searchBeers(apiUrl: string, searchWord: string, currentPage: number, beersPerPage: number) {
    try {
        const response = await fetch(`${apiUrl}?beer_name=${searchWord}&page=${currentPage}&per_page=${beersPerPage}`);
        if (!response.ok) {
            throw new Error(`HTTP Error!: ${response.status}`);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching beers:", error);
        throw error;
    }
}

export async function getBeerDetails(apiUrl: string, beerName: string) {
    try {
        const response = await fetch(`${apiUrl}?beer_name=${beerName}`);
        if (!response.ok) {
            throw new Error(`HTTP Error!: ${response.status}`);
        }
        const beers = await response.json();
        if (beers.length > 0) {
            return beers[0];
        } else {
            throw new Error(`No beer found with the name ${beerName}`);
        }
    } catch (error) {
        console.error("Error fetching beer details:", error);
        throw error;
    }
}