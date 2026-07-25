import {
  buildRequestHeaders,
  mapCategory,
  mapMake,
  mapModel,
  mapModelYear,
  mapPart,
  normalizeBearerToken,
  setApiBearerToken,
} from './api';

describe('api mappers', () => {
  it('maps make ids to strings', () => {
    expect(
      mapMake({id: 1, name: 'Toyota', created_at: '2024-01-01'}),
    ).toEqual({id: '1', name: 'Toyota'});
  });

  it('maps model make_id to makeId', () => {
    expect(
      mapModel({
        id: 2,
        make_id: 1,
        name: 'Corolla',
        created_at: '2024-01-01',
      }),
    ).toEqual({id: '2', name: 'Corolla', makeId: '1'});
  });

  it('maps model year model_id to modelId', () => {
    expect(
      mapModelYear({
        id: 3,
        model_id: 2,
        year: 2018,
        created_at: '2024-01-01',
      }),
    ).toEqual({id: '3', modelId: '2', year: 2018});
  });

  it('maps category parent_id to parentId', () => {
    expect(
      mapCategory({
        id: 4,
        name: 'Brakes',
        parent_id: 10,
        created_at: '2024-01-01',
      }),
    ).toEqual({id: '4', name: 'Brakes', parentId: '10'});
  });

  it('maps null category parent_id to undefined', () => {
    expect(
      mapCategory({
        id: 4,
        name: 'Brakes',
        parent_id: null,
        created_at: '2024-01-01',
      }),
    ).toEqual({id: '4', name: 'Brakes', parentId: undefined});
  });

  it('maps part category_id to categoryId', () => {
    expect(
      mapPart({
        id: 5,
        name: 'Brake pad',
        category_id: 4,
        created_at: '2024-01-01',
      }),
    ).toEqual({id: '5', name: 'Brake pad', categoryId: '4'});
  });
});

describe('bearer auth', () => {
  afterEach(() => {
    setApiBearerToken('');
  });

  it('strips a Bearer prefix from pasted tokens', () => {
    expect(normalizeBearerToken('Bearer abc.def')).toBe('abc.def');
    expect(normalizeBearerToken('bearer abc.def')).toBe('abc.def');
  });

  it('adds Authorization when a token is set', () => {
    setApiBearerToken('tok_123');
    expect(buildRequestHeaders()).toEqual({
      Accept: 'application/json',
      Authorization: 'Bearer tok_123',
    });
  });

  it('omits Authorization when no token is set', () => {
    expect(buildRequestHeaders()).toEqual({
      Accept: 'application/json',
    });
  });
});
