// eslint-disable-next-line node/no-extraneous-import
import * as parse from 'csv-parse/lib/sync';
import fetch from 'node-fetch';

/**
 * Parse CSV string content and return an array of objects
 */
export function parseCsv(csv: string): any[] {
    return parse(csv, {
        columns: true,
        skip_empty_lines: true,
    });
}

/**
 * Download a CSV file from given URL
 */
export async function downloadCsv(url: string) {
    const res = await fetch(url);
    const buffer = await res.buffer();

    return parseCsv(buffer.toString());
}
