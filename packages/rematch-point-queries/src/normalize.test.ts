import { expect } from 'chai';
import { normalize } from './normalize';

describe('normalize', () => {
    describe('normalize(any, string)', () => {
        it('normalizes an object by its key', () => {
            expect(normalize({ id: '1234' })).to.be.equal('1234');
        });

        it('normalizes an object by a custom key', () => {
            expect(normalize({ uuid: '1234' }, 'uuid')).to.be.equal('1234');
        });

        it('normalizes an object by a deeply nested key', () => {
            expect(normalize({
                person: {
                    data: {
                        id: '1234',
                    },
                },
            }, 'person.data.id')).to.be.equal('1234');
        });
    });
});
