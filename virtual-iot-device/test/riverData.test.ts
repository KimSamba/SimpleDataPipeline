import {replaceSpacesFromKeys} from '../src/riverData';

describe('replaceSpacesFromKeys', () => {
    it('Should replace spaces to _ characters in keys', async () => {
        const obj1 = {
            a: 1,
            b: 2,
            'c d': 34,
        };

        const obj1Expected = {
            a: 1,
            b: 2,
            c_d: 34,
        };

        const obj2 = {
            '   ': [],
            '   __12 qweq': {
                '  a c v': 0,
            },
        };

        const obj2Expected = {
            ___: [],
            _____12_qweq: {
                '  a c v': 0,
            },
        };

        expect(replaceSpacesFromKeys(obj1, '_')).toEqual(obj1Expected);
        expect(replaceSpacesFromKeys(obj2, '_')).toEqual(obj2Expected);
    });
});

// describe('CreateStreamFromDataset Repeat parameter', () => {
//     it('Repeat = true should replay undefinitely', async () => {
//         testScheduler().run(({expectObservable}) => {
//             const obs$ = createStreamFromDataset({
//                 dataset: [1, 2, 3],
//                 frequency_hz: 1000,
//                 repeat: true,
//             }).pipe(take(15));

//             expectObservable(obs$).toBe('1ms 123 123 123 123 12(3|)', vals);
//         });
//     });

//     it('Repeat = false should play data only once and complete', async () => {
//         testScheduler().run(({expectObservable}) => {
//             const obs$ = createStreamFromDataset({
//                 dataset: [1, 2, 3],
//                 frequency_hz: 1000,
//                 repeat: false,
//             });

//             expectObservable(obs$).toBe('1ms 12(3|)', vals);
//         });
//     });

//     it('Dataset size = 0 should throw error', async () => {
//         expect(() =>
//             createStreamFromDataset({
//                 dataset: [],
//                 frequency_hz: 1000,
//                 repeat: false,
//             })
//         ).toThrowError();
//     });
// });
