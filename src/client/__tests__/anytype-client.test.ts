import { test, expect, describe, vi, beforeEach } from 'vitest';
import { AnytypeClient } from '../anytype-client';
import { OpenAPIV3 } from 'openapi-types';
import { readFileSync } from 'fs';

vi.mock('../http-client');

describe('AnytypeClient', () => {
  let client: AnytypeClient;
  let mockOpenApiSpec: OpenAPIV3.Document;

  beforeEach(() => {
    vi.clearAllMocks();
    mockOpenApiSpec = JSON.parse(readFileSync('./scripts/openapi.json', 'utf-8'));
    client = new AnytypeClient({
      baseUrl: 'http://localhost:65535',
      apiKey: 'test-api-key',
    }, mockOpenApiSpec);
  });

  test('should create multiple objects in a batch', async () => {
    const spaceId = 'space-1';
    const objectsToCreate = [
      {
        name: 'Object 1',
        type_key: 'page',
      },
      {
        name: 'Object 2',
        type_key: 'page',
      },
    ];

    const mockResponse = [
      {
        id: 'object-1',
        name: 'Object 1',
      },
      {
        id: 'object-2',
        name: 'Object 2',
      },
    ];

    (client.executeOperation as any).mockResolvedValue({ data: mockResponse });

    const createdObjects = await client.createObjectsBatch(spaceId, objectsToCreate);

    expect(client.executeOperation).toHaveBeenCalledWith(
      {
        method: 'post',
        path: `/v1/spaces/${spaceId}/objects/batch`,
        operationId: 'create_objects_batch',
      },
      {
        space_id: spaceId,
        objects: objectsToCreate,
      },
    );

    expect(createdObjects).toEqual(mockResponse);
  });
});
