import {of, Observable, from} from 'rxjs';
import {delay, concatMap, repeat, toArray, map, tap} from 'rxjs/operators';
import * as shuffle from 'shuffle-array';

interface CreateStream {
    dataset: any[];
    frequency_hz: number;
    repeat?: boolean;
}

/**
 * Create an observable stream from an array of items and
 * emits at given frequency
 */
export function createStreamFromDataset(params: CreateStream): Observable<any> {
    if (params.frequency_hz < 0) {
        throw new Error('Frequency must be positive');
    }

    if (params.dataset.length <= 0) {
        throw new Error('Dataset must not be empty');
    }

    const obs$ = from(params.dataset).pipe(
        randomizeOrder(),
        throttleFrequency(params.frequency_hz)
    );

    return params.repeat ? obs$.pipe(repeat()) : obs$;
}

export const throttleFrequency = (frequency_hz: number) => {
    if (frequency_hz <= 0) {
        throw new Error('Frequency must be strictly positive');
    }
    return concatMap(x => of(x).pipe(delay(1000 / frequency_hz)));
};

export const randomizeOrder = () => (source$: Observable<any>) =>
    source$.pipe(
        toArray(),
        map(x => shuffle(x, {copy: true})),
        concatMap(x => x)
    );
