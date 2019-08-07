export interface StoneLocation {
    stoneId: number;
    locationName: string;
    holdName: 'Eastmarch'|'Falkreath'|'Haafingar'|'Hjaalmarch'|'The Reach'|'The Rift'|'Whiterun'|'Winterhold';
}

export const STONE_LIST: StoneLocation[] = [
    {
        stoneId: 0,
        locationName: 'Ansilvund – Ansilvund Burial Chambers',
        holdName: 'Eastmarch',
    },
    {
        stoneId: 1,
        locationName: 'Stony Creek Cave',
        holdName: 'Eastmarch',
    },
    {
        stoneId: 2,
        locationName: 'Windhelm – House of Clan Shatter-Shield',
        holdName: 'Eastmarch',
    },
    {
        stoneId: 3,
        locationName: 'Windhelm – Palace of the Kings',
        holdName: 'Eastmarch',
    },
    {
        stoneId: 4,
        locationName: 'Dark Brotherhood Sanctuary',
        holdName: 'Falkreath',
    },
    {
        stoneId: 5,
        locationName: 'Pinewatch – Bandit\'s Sanctuary',
        holdName: 'Falkreath',
    },
    {
        stoneId: 6,
        locationName: 'Sunderstone Gorge',
        holdName: 'Falkreath',
    },
    {
        stoneId: 7,
        locationName: 'Dainty Sload',
        holdName: 'Haafingar',
    },
    {
        stoneId: 8,
        locationName: 'Reeking Cave',
        holdName: 'Haafingar',
    },
    {
        stoneId: 9,
        locationName: 'Solitude – Blue Palace',
        holdName: 'Haafingar',
    },
    {
        stoneId: 10,
        locationName: 'Solitude – Proudspire Manor',
        holdName: 'Haafingar',
    },
    {
        stoneId: 11,
        locationName: 'Rannveig\'s Fast',
        holdName: 'Hjaalmarch',
    },
    {
        stoneId: 12,
        locationName: 'Dead Crone Rock',
        holdName: 'The Reach',
    },
    {
        stoneId: 13,
        locationName: 'Markarth – Treasury House',
        holdName: 'The Reach',
    },
    {
        stoneId: 14,
        locationName: 'Understone Keep – Dwemer Museum',
        holdName: 'The Reach',
    },
    {
        stoneId: 15,
        locationName: 'Black-Briar Lodge',
        holdName: 'The Rift',
    },
    {
        stoneId: 16,
        locationName: 'Mistveil Keep – Jarl\'s Chambers',
        holdName: 'The Rift',
    },
    {
        stoneId: 17,
        locationName: 'Dragonsreach – Jarl\'s Quarters',
        holdName: 'Whiterun',
    },
    {
        stoneId: 18,
        locationName: 'Fellglow Keep',
        holdName: 'Whiterun',
    },
    {
        stoneId: 19,
        locationName: 'Jorrvaskr – Living Quarters',
        holdName: 'Whiterun',
    },
    {
        stoneId: 20,
        locationName: 'Whiterun Hall of the Dead – Whiterun Catacombs',
        holdName: 'Whiterun',
    },
    {
        stoneId: 21,
        locationName: 'College of Winterhold – Arch-Mage\'s Quarters',
        holdName: 'Winterhold',
    },
    {
        stoneId: 22,
        locationName: 'Hob\'s Fall Cave',
        holdName: 'Winterhold',
    },
    {
        stoneId: 23,
        locationName: 'Yngvild – Yngvild Throne Room',
        holdName: 'Winterhold',
    },
]