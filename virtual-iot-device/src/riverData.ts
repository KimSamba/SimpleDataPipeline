export interface RiverData {
    'Waterbody Name': string;
    'Fish Species Present at Waterbody': string;
    Comments: string;
    County: string;
    'Types of Public Access': string;
    'Publish Fishing Access Owner': string;
    'Water Information': string;
    Longitude: number;
    Latitude: number;
    Location: [number, number];
}

export interface RiverDataRaw {
    'Waterbody Name': string;
    'Fish Species Present at Waterbody': string;
    Comments: string;
    County: string;
    'Types of Public Access': string;
    'Publish Fishing Access Owner': string;
    'Water Information': string;
    Longitude: string;
    Latitude: string;
    Location: string;
}

/**
 * Preprocess the data by converting lat/long into numbers
 */
export function preprocessData(input: RiverDataRaw): RiverData {
    return {
        ...input,
        Longitude: Number(input.Longitude),
        Latitude: Number(input.Latitude),
        Location: input.Location.replace(/[()]/g, '')
            .split(',')
            .map(Number) as [number, number],
    };
}
