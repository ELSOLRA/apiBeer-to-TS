export default interface Beer {
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
