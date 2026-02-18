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

    const createdObjects = await client.createObjectBatch(spaceId, objectsToCreate);

    expect(client.executeOperation).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'post',
        path: '/v1/spaces/{space_id}/objects/batch',
        operationId: 'create_object_batch',
      }),
      {
        space_id: spaceId,
        objects: objectsToCreate,
        'Anytype-Version': '1.0.0',
      },
    );

    expect(createdObjects).toEqual(mockResponse);
  });

  test('should update multiple objects in a batch', async () => {
    const spaceId = 'space-1';
    const objectsToUpdate = [
      {
        object_id: 'object-1',
        name: 'Updated Object 1',
      },
      {
        object_id: 'object-2',
        name: 'Updated Object 2',
      },
    ];

    const mockResponse = [
      {
        id: 'object-1',
        name: 'Updated Object 1',
      },
      {
        id: 'object-2',
        name: 'Updated Object 2',
      },
    ];

    (client.executeOperation as any).mockResolvedValue({ data: mockResponse });

    const updatedObjects = await client.updateObjectBatch(spaceId, objectsToUpdate);

    expect(client.executeOperation).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'patch',
        path: '/v1/spaces/{space_id}/objects/batch',
        operationId: 'update_object_batch',
      }),
      {
        space_id: spaceId,
        updates: objectsToUpdate,
        'Anytype-Version': '1.0.0',
      },
    );

    expect(updatedObjects).toEqual(mockResponse);
  });

  test('should update a property for multiple objects in a batch', async () => {
    const spaceId = 'space-1';
    const propertyKey = 'status';
    const value = 'completed';
    const objectIds = ['object-1', 'object-2'];

    const mockResponse = [
      {
        id: 'object-1',
        name: 'Object 1',
        properties: [{ key: 'status', value: 'completed' }],
      },
      {
        id: 'object-2',
        name: 'Object 2',
        properties: [{ key: 'status', value: 'completed' }],
      },
    ];

    (client.executeOperation as any).mockResolvedValue({ data: mockResponse });

    const updatedObjects = await client.updateObjectsPropertyBatch(
      spaceId,
      propertyKey,
      value,
      objectIds,
    );

    expect(client.executeOperation).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'patch',
        path: '/v1/spaces/{space_id}/objects/properties/batch',
        operationId: 'update_objects_property_batch',
      }),
      {
        space_id: spaceId,
        property_key: propertyKey,
        value: value,
        object_ids: objectIds,
        'Anytype-Version': '1.0.0',
      },
    );

    expect(updatedObjects).toEqual(mockResponse);
  });
});
