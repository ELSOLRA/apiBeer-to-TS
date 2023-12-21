interface Beer {
    name: string;
    description: string;
    image_url: string | null;
    volume: {
        value: number;
        unit: string;
    };
    abv: number;
    ingredients: {
        hops: { name: string }[];
        malt: { name: string }[];
    };
    food_pairing: string [];
    brewers_tips: string;
}

class BeerApp {

    private searUrlApi = 'https://api.punkapi.com/v2/beers';
    private input: HTMLInputElement = document.getElementById('site-search') as HTMLInputElement;
    private searchedContent: HTMLElement = document.getElementById('searched-content') as HTMLElement;
    private currentPage: number = 1;
    private beersPerPage: number = 10;
    private displayedBeers: Beer[] = [];
    private totalBeers: number = 0;

    constructor() {
        this.setupEventListeners();
    }

    private setupEventListeners() {
        document.getElementById('search-btn')?.addEventListener('click', () => this.searchBeer());
        document.getElementById('random-beer-btn')?.addEventListener('click', () => this.getRandomBeer());
    }

    private async getRandomBeer() {
        this.searchedContent.textContent = '';
        try {
          const response = await fetch(`${this.searUrlApi}/random`);
          if (!response.ok) {
            throw new Error(`HTTP Error!: ${response.status}`);
          }
          const beer = await response.json() as Beer;
          this.displayBeer(beer);
        } catch (error) {
            console.log("Error fetching message :", error);
          }
    }

    private async searchBeer() {
        this.searchedContent.textContent = '';
        const searchWord = this.input.value.trim();
        let pageForTotal = 1; // Start from the next page
        let moreResults = true;
        let totalResultBeers: Beer[] = [];
        if (searchWord === '') {
          return;
        }
        try {
            const response = await fetch(`${this.searUrlApi}?beer_name=${searchWord}&page=${this.currentPage}&per_page=${this.beersPerPage}`);
            if (!response.ok) {
              throw new Error(`HTTP Error!: ${response.status}`);
            }
            const result = await response.json() as Beer[];
            console.log(result);
            this.displayedBeers = result; 
            
            while (moreResults) {
                const totalSearchedBeersResponse = await fetch(`${this.searUrlApi}?beer_name=${searchWord}&page=${pageForTotal}&per_page=80`);
                const data = await totalSearchedBeersResponse.json();      
                
                if (data.length > 0) {
                    totalResultBeers = totalResultBeers.concat(data);   
                    pageForTotal++;
                } else {
                    moreResults = false;
                  }
            }
            
            this.totalBeers = totalResultBeers.length;
            console.log(this.totalBeers);

            if (this.displayedBeers.length === 0) {
                this.displayNoResults();
              } else {
                this.displayBeerList();
                this.updatePageDisplay();
              }
            } catch (error) {
              console.log("Error fetching message :", error);
            }
        }
        
        private displayNoResults() {
            this.searchedContent.innerHTML = "<p>No results found for the given search term.</p>";
        }
        
            

                
}