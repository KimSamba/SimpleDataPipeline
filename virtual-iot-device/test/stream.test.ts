import {emitAtFrequency, getRandomItemFromSet} from '../src/stream';
import {TestScheduler} from 'rxjs/testing';
import { take } from 'rxjs/operators';

const vals = {
    0: 0,
    1: 1,
    2: 2,
};

const testScheduler = () =>
    new TestScheduler((actual, expected) => {
        expect(actual).toStrictEqual(expected);
    });

describe('emitAtFrequency', () => {
    it('Should emit data at given frequency', async () => {
        testScheduler().run(({expectObservable}) => {
            const freq1000hz$ = emitAtFrequency(1000).pipe(take(3));
            const freq50hz$ = emitAtFrequency(50).pipe(take(3));
            const freq10hz$ = emitAtFrequency(10).pipe(take(3));
            const freq1hz$ = emitAtFrequency(1).pipe(take(3));
            const freqVeryLow$ = emitAtFrequency(0.1).pipe(take(3));

            /* eslint-disable prettier/prettier */
            expectObservable(freq1000hz$).toBe(
                '0        1        (2|)',
                vals
            );
            expectObservable(freq50hz$).toBe(
                '0 19ms   1 19ms   (2|)',
                vals
            );
            expectObservable(freq10hz$).toBe(
                '0 99ms   1 99ms   (2|)',
                vals
            );
            expectObservable(freq1hz$).toBe(
                '0 999ms  1 999ms  (2|)',
                vals
            );
            expectObservable(freqVeryLow$).toBe(
                '0 9999ms 1 9999ms (2|)',
                vals
            );
        });
    });

    it('Dataset size = 0 should throw error', async () => {
        expect(() => getRandomItemFromSet([])).toThrowError();
    });

    it('Negative frequency should throw error', async () => {
        expect(() => emitAtFrequency(-213)).toThrowError();
    });
});
