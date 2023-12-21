import Beer from "./interfaces.js";
import * as EventService from './eventService.js';
import * as Apis from './api.js';

export class BeerApp {

    private searUrlApi = 'https://api.punkapi.com/v2/beers';
    private input: HTMLInputElement = document.getElementById('site-search') as HTMLInputElement;
    private searchedContent: HTMLDivElement = document.getElementById('searched-content') as HTMLDivElement;
    private imgBox: HTMLDivElement = document.getElementById('img-box') as HTMLDivElement;
    private descriptionBox: HTMLDivElement = document.getElementById('description-box') as HTMLDivElement;
    private currentPage: number = 1;
    private beersPerPage: number = 10;
    private displayedBeers: Beer[] = [];
    private totalBeers: number = 0;
    private totalPages: number = 0;
    private lastSearchWord: string = '';
    private currentPageSpan: HTMLSpanElement = document.getElementById('current-page') as HTMLSpanElement;
    private searchButton: HTMLButtonElement = document.getElementById('search-btn') as HTMLButtonElement;
    private nextPageButton: HTMLButtonElement = document.getElementById('next-page') as HTMLButtonElement;
    private prevPageButton: HTMLButtonElement = document.getElementById('prev-page') as HTMLButtonElement;
    private randomBeerButton: HTMLButtonElement = document.getElementById('random-beer-btn') as HTMLButtonElement;
    private beerImage: HTMLImageElement = document.getElementById('image') as HTMLImageElement;
    private infoBtn: HTMLButtonElement = document.getElementById('info-btn') as HTMLButtonElement;
    private beerName: HTMLParagraphElement = document.getElementById('beer-name') as HTMLParagraphElement;

    constructor() {
        this.setupEventListeners();
    }

    private setupEventListeners() {
        EventService.setupEventListeners(
            this.searchButton,
            this.randomBeerButton,
            this.nextPageButton,
            this.prevPageButton,
            this.infoBtn,
            this
        );
    }
    public async getRandomBeer() {
        console.log('Before fetch');
        this.descriptionBox.textContent = "";
        this.searchedContent.textContent = '';
        try {
            // Use getRandomBeer function from api.ts
            const beer = await Apis.getRandomBeer(this.searUrlApi);
            console.log(beer);
            this.displayBeer(beer);
        } catch (error) {
            console.log("Error fetching message :", error);
            this.displayNoResults();
        }
    }

    public async searchBeer() {
        console.log('searchBeer method called');
        this.searchedContent.textContent = '';
        const searchWord = this.input.value.trim();
        if (searchWord === '') {
            return;
        }
        let pageForTotal = 1; // Start from the next page
        let moreResults = true;
        let totalResultBeers: Beer[] = [];
        if (searchWord === '') {
          return;
        }
        try {
            const result = await Apis.searchBeers(this.searUrlApi, searchWord, this.currentPage, this.beersPerPage);
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
            
            this.lastSearchWord = searchWord;
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

        private displayBeer(beer: Beer[]) { 
            console.log('Displaying beer:', beer);
            this.searchedContent.textContent = "";
            const beerElement = document.createElement('p'); 
            beerElement.classList.add('one-beer');
            beerElement.textContent = beer[0].name;;  
            beerElement.addEventListener('click', () => {
                console.log('Beer element clicked:', beer[0].name);
                beerElement.style.backgroundColor = "yellow";
                document.querySelector(".one-beer")?.classList.add("showPil");
                this.descriptionBox.textContent = "";
                this.displayBeerDetails(beer[0]);
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

        public async nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                await this.searchBeer();
                this.updatePageDisplay();
            }
        }
    
        public async prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                await this.searchBeer();
                this.updatePageDisplay();
            }
        }

        private displayBeerDetails(beer: Beer) {

            console.log('Displaying beer details:', beer);
            this.imgBox.textContent = '';
            if (beer.image_url !== null && beer.image_url !== '') {
              console.log('Updating image:', beer.image_url);
              this.beerImage.src = beer.image_url;
              this.imgBox.appendChild(this.beerImage);
            } else {
              console.log('Displaying no image');
              this.displayNoImage();
            }
            console.log('Updating beer name:', beer.name);
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
        
          public async showAdditionalInfo() {
            const selectedBeerName = this.beerName.textContent as string;
            this.descriptionBox.textContent = "";
            try {
                const selectedBeer = await Apis.getBeerDetails(this.searUrlApi, selectedBeerName);       
                    const displayHops = selectedBeer.ingredients.hops.map((hop: { name: string }) => hop.name).join(', ');
                    const displayMalt = selectedBeer.ingredients.malt.map((malt: { name: string }) => malt.name).join(', ');
        
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
                } catch (error) {
                console.log("Error fetching additional info:", error);
            }
        }
    }
    
const beerApp = new BeerApp();
        
        
