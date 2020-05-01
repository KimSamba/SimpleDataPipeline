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
