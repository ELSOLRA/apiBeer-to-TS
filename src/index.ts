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
    private imgBox: HTMLElement = document.getElementById('img-box') as HTMLElement;
    private descriptionBox: HTMLElement = document.getElementById('description-box') as HTMLElement;
    private currentPage: number = 1;
    private beersPerPage: number = 10;
    private displayedBeers: Beer[] = [];
    private totalBeers: number = 0;
    private totalPages: number = 0;
    private lastSearchWord: string = '';
    private currentPageSpan: HTMLElement = document.getElementById('current-page') as HTMLElement;
    private searchButton: HTMLElement = document.getElementById('search-btn') as HTMLElement;
    private nextPageButton: HTMLElement = document.getElementById('next-page') as HTMLElement;
    private prevPageButton: HTMLElement = document.getElementById('prev-page') as HTMLElement;
    private randomBeerButton: HTMLElement = document.getElementById('random-beer-btn') as HTMLElement;
    private beerImage: HTMLImageElement = document.getElementById('image') as HTMLImageElement;
    private infoBtn: HTMLElement = document.getElementById('info-btn') as HTMLElement;
    private beerName: HTMLElement = document.getElementById('beer-name') as HTMLElement;

    constructor() {
        this.setupEventListeners();
    }

    private setupEventListeners() {
        this.searchButton.addEventListener('click', () => this.searchBeer());
        this.randomBeerButton.addEventListener('click', () => this.getRandomBeer());
        this.nextPageButton.addEventListener("click", () => this.nextPage());
        this.prevPageButton.addEventListener("click", () => this.prevPage());
        this.infoBtn.addEventListener('click', async () => this.showAdditionalInfo());
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
        
        private displayNoImage() {
            this.imgBox.textContent = ""; 
            const noImagePlaceholder = document.createElement('img');
            noImagePlaceholder.src = 'https://as2.ftcdn.net/v2/jpg/00/89/55/15/1000_F_89551596_LdHAZRwz3i4EM4J0NHNHy2hEUYDfXc0j.jpg'; // Provide the path to your default image
            noImagePlaceholder.alt = 'No Image';
            this.imgBox.appendChild(noImagePlaceholder);
        }    

        private displayBeer(beer: Beer) { 
            this.searchedContent.textContent = "";
            const beerElement = document.createElement('p'); 
            beerElement.classList.add('one-beer');
            beerElement.textContent = beer.name;  
            beerElement.addEventListener('click', () => {
                this.displayBeerDetails(beer);
                beerElement.style.backgroundColor = "yellow";
                document.querySelector(".one-beer")?.classList.add("showPil");
                this.descriptionBox.textContent = "";
            });
            this.searchedContent.appendChild(beerElement);
        }
        
        private displayBeerList() {
            this.searchedContent.textContent = "";
          
            const beerList = document.createElement('ul');
            beerList.classList.add('beer-list');
          
            this.displayedBeers.forEach(beer => {   // beers change to displayedBeers
              const beerItem = document.createElement('li');
              beerItem.textContent = beer.name;
              beerItem.addEventListener('click', () =>  {
                this.descriptionBox.textContent= "";
                this.clearSelectedLi();
                this.markSelectedLi(beerItem);
                this.displayBeerDetails(beer);
              });
              beerList.appendChild(beerItem);
          
            });
            this.searchedContent.appendChild(beerList);
          };
        
        private updatePageDisplay() {
            this.totalPages = Math.ceil(this.totalBeers / this.beersPerPage);
            this.currentPageSpan.textContent = `${this.currentPage} / ${this.totalPages}`;
        };

        private async nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                await this.searchBeer();
                this.updatePageDisplay();
            }
        }
    
        private async prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                await this.searchBeer();
                this.updatePageDisplay();
            }
        }

        private displayBeerDetails(beer: Beer) {
            this.imgBox.textContent = '';
            if (beer.image_url !== null && beer.image_url !== '') {
              this.beerImage.src = beer.image_url;
              this.imgBox.appendChild(this.beerImage);
            } else {
              this.displayNoImage();
            }
            this.beerName.textContent = beer.name;
            console.log(beer);
        }

        private clearSelectedLi() {
            const liElements = document.querySelectorAll('.beer-list li');
            liElements.forEach((li) => {
              li.classList.remove('selected');
            });
          }
        
          private markSelectedLi(beerItem: HTMLLIElement) {
            beerItem.classList.add('selected');
          }
        
          private async showAdditionalInfo() {
            const selectedBeerName = this.beerName.textContent;
            this.descriptionBox.textContent = "";
        
            try {
                const response = await fetch(`${this.searUrlApi}?beer_name=${selectedBeerName}`);
                if (!response.ok) {
                    throw new Error(`HTTP Error!: ${response.status}`);
                }
                const beers = await response.json() as Beer[];
                console.log(beers);
                if (beers.length > 0) {
                    const selectedBeer = beers[0];
        
                    // Display volume information in descriptionBox
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
            } catch (error) {
                console.log("Error fetching additional info:", error);
            }
        }
        
        

}
        
        
