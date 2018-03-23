import { expect } from 'chai';
import { querify, parse } from './queries';

describe('queries', () => {
    describe('querify(string, string)', () => {
        it('creates a queryString', () => {
            expect(querify('collection', 'my-url')).to.be.equal(
                'collection:my-url'
            );
        });

        it('creates an encoded querify string', () => {
            expect(querify('%collection', 'https://my-url.com/?a=b&b=c')).to.be.equal(
                '%25collection:https%3A%2F%2Fmy-url.com%2F%3Fa%3Db%26b%3Dc'
            );
        });

        it('gracefully handles an invalid call', () => {
            expect(querify()).to.be.equal(':');
        })
    });

    describe('parse(string)', () => {
        it('parses a query string', () => {
            expect(parse('collection:my-url')).to.be.deep.equal({
                collectionName: 'collection',
                url: 'my-url',
            });
        });

        it('parses an encoded query string', () => {
            expect(parse('%25collection:https%3A%2F%2Fmy-url.com%2F%3Fa%3Db%26b%3Dc')).to.be.deep.equal({
                collectionName: '%collection',
                url: 'https://my-url.com/?a=b&b=c',
            });
        });

        it('parses an invalid query string', () => {
            expect(parse('a')).to.be.deep.equal({
                collectionName: 'a',
                url: '',
            });
        });
    });
});
