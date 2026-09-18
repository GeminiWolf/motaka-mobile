import { getCategories, getParts, mapCategory } from './api';

jest.mock('react-native-blob-util', () => ({
  fs: {
    dirs: { CacheDir: '/tmp' },
    writeFile: jest.fn(),
  },
}));

function mockJson(data: unknown, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
    headers: { get: () => null },
  } as unknown as Response);
}

describe('mapCategory', () => {
  it('maps snake_case parent_id onto the option', () => {
    expect(
      mapCategory({ id: 4, name: 'Filters', parent_id: 12 }),
    ).toEqual({
      id: '4',
      name: 'Filters',
      parent_id: 12,
    });
  });

  it('maps a missing parent_id to null', () => {
    expect(mapCategory({ id: 1, name: 'Engine' })).toEqual({
      id: '1',
      name: 'Engine',
      parent_id: null,
    });
  });
});

describe('getCategories', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('requests GET /categories for the root level', async () => {
    global.fetch = jest.fn().mockImplementation(() => mockJson([]));

    await getCategories('https://api.example.com');

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.example.com/categories',
      expect.any(Object),
    );
  });

  it('requests GET /categories?parent_id= when a parent is set', async () => {
    global.fetch = jest.fn().mockImplementation(() => mockJson([]));

    await getCategories('https://api.example.com', '12');

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.example.com/categories?parent_id=12',
      expect.any(Object),
    );
  });
});

describe('getParts', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('requests GET /api/v1/parts?category_id=', async () => {
    global.fetch = jest.fn().mockImplementation(() => mockJson([]));

    await getParts('https://api.example.com', '8');

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.example.com/api/v1/parts?category_id=8',
      expect.any(Object),
    );
  });
});
