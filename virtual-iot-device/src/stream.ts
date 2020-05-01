import {Observable, interval, timer} from 'rxjs';
import {map} from 'rxjs/operators';

interface CreateStream {
    dataset: any[];
    frequency_hz: number;
    repeat?: boolean;
    emitInRandomOrder?: boolean;
}

/**
 * Create an observable stream from an array of items and
 * emits at given frequency
 */
export function createStreamFromDataset(params: CreateStream): Observable<any> {
    return interval(1000 / params.frequency_hz).pipe(
        map(() => getRandomItemFromSet(params.dataset))
    );
}

export function emitAtFrequency(frequency_hz: number) {
    if (frequency_hz <= 0) {
        throw new Error('Frequency must be strictly positive');
    }
    return timer(0, 1000 / frequency_hz);
}

export function getRandomItemFromSet(dataset: any[]) {
    if (dataset.length === 0) {
        throw new Error('Dataset must not be empty');
    }
    return dataset[Math.floor(Math.random() * dataset.length)];
}
