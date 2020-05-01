import {createStreamFromDataset, throttleFrequency} from '../src/stream';
import {TestScheduler} from 'rxjs/testing';
import {of, from} from 'rxjs';
import { take } from 'rxjs/operators';

const vals = {
    1: 1,
    2: 2,
    3: 3,
};

const testScheduler = () => new TestScheduler((actual, expected) => {
    expect(actual).toStrictEqual(expected);
});

describe('throttleFrequency', () => {
    it('Return error if frequency <= 0', async () => {
        const obs$ = from([1, 2, 3]);

        expect(() => obs$.pipe(throttleFrequency(-5))).toThrowError();
        expect(() => obs$.pipe(throttleFrequency(0))).toThrowError();
    });

    it('Emits a correct frequencies for n', async () => {
        testScheduler().run(({expectObservable, cold}) => {
            const obs$ = cold('1 1 1', vals);
            const freq1000hz$ = obs$.pipe(throttleFrequency(1000));
            const freq50hz$ = obs$.pipe(throttleFrequency(50));
            const freq10hz$ = obs$.pipe(throttleFrequency(10));
            const freq1hz$ = obs$.pipe(throttleFrequency(1));
            const freqVeryLow$ = obs$.pipe(throttleFrequency(0.1));

            /* eslint-disable prettier/prettier */
            expectObservable(freq1000hz$).toBe(
                '1ms   1        1         1',
                vals
            );
            expectObservable(freq50hz$).toBe(
                '20ms  1 19ms   1 19ms    1',
                vals
            );
            expectObservable(freq10hz$).toBe(
                '100ms 1 99ms   1 99ms    1',
                vals
            );
            expectObservable(freq1hz$).toBe(
                '1s    1 999ms  1 999ms   1',
                vals
            );
            expectObservable(freqVeryLow$).toBe(
                '10s   1 9999ms 1 9999ms  1',
                vals
            );
            /* eslint-enable prettier/prettier */
        });
    });
});

describe('CreateStreamFromDataset Repeat parameter', () => {
    it('Repeat = true should replay undefinitely', async () => {
        testScheduler().run(({expectObservable}) => {
            const obs$ = createStreamFromDataset({
                dataset: [1, 1, 1],
                frequency_hz: 1000,
                repeat: true,
            }).pipe(take(15));

            expectObservable(obs$).toBe('1ms 111 111 111 111 11(1|)', vals);
        });
    });

    it('Repeat = false should play data only once and complete', async () => {
        testScheduler().run(({expectObservable}) => {
            const obs$ = createStreamFromDataset({
                dataset: [1, 1, 1],
                frequency_hz: 1000,
                repeat: false,
            });

            expectObservable(obs$).toBe('1ms 11(1|)', vals);
        });
    });

    it('Dataset size = 0 should throw error', async () => {
        expect(() =>
            createStreamFromDataset({
                dataset: [],
                frequency_hz: 1000,
                repeat: false,
            })
        ).toThrowError();
    });
});
