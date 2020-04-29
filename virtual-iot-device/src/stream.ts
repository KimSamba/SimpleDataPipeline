import {of, Observable, from} from 'rxjs';
import * as assert from 'assert';
import {delay, concatMap, repeat} from 'rxjs/operators';

interface CreateStream<T> {
    dataset: T[];
    frequency_hz: number;
    repeat?: number;
}

/**
 * Create an observable stream from an array of items and
 * emits at given frequency
 */
export function createStreamFromDataset<T>(
    params: CreateStream<T>
): Observable<T> {
    assert.notEqual(params.repeat! <= 0, true);
    const nbRepeat = params.repeat! >= 0 ? params.repeat : undefined;
    return from(params.dataset).pipe(
        concatMap(x => of<T>(x).pipe(delay(1000 / params.frequency_hz))),
        repeat(nbRepeat)
    );
}
