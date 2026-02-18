import { HttpClient, HttpClientError } from './http-client';
import { paths, components } from '../models';
import { OpenAPIV3 } from 'openapi-types';

type CreateObjectRequest = components["schemas"]["CreateObjectRequest"];
type AnytypeObject = components["schemas"]["Object"];
type UpdateObjectRequest = components["schemas"]["UpdateObjectRequest"];

// Define operation objects for the batch endpoints, manually creating minimal OpenAPIV3.OperationObject structures
const createObjectBatchOperation: OpenAPIV3.OperationObject & {
  method: string;
  path: string;
} = {
  operationId: 'create_object_batch',
  method: 'post',
  path: '/v1/spaces/{space_id}/objects/batch',
  parameters: [
    {
      in: 'path',
      name: 'space_id',
      required: true,
      schema: { type: 'string' },
    },
    {
      in: 'header',
      name: 'Anytype-Version',
      required: true,
      schema: { type: 'string' },
    },
  ],
  requestBody: {
    content: {
      'application/json': {
        schema: {
          properties: {
            objects: {
              type: 'array',
              items: {
                type: 'object',
              },
            },
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Objects created successfully',
    },
  },
};

const updateObjectBatchOperation: OpenAPIV3.OperationObject & {
  method: string;
  path: string;
} = {
  operationId: 'update_object_batch',
  method: 'patch',
  path: '/v1/spaces/{space_id}/objects/batch',
  parameters: [
    {
      in: 'path',
      name: 'space_id',
      required: true,
      schema: { type: 'string' },
    },
    {
      in: 'header',
      name: 'Anytype-Version',
      required: true,
      schema: { type: 'string' },
    },
  ],
  requestBody: {
    content: {
      'application/json': {
        schema: {
          properties: {
            updates: {
              type: 'array',
              items: {
                type: 'object',
              },
            },
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Objects updated successfully',
    },
  },
};

const updateObjectsPropertyBatchOperation: OpenAPIV3.OperationObject & {
  method: string;
  path: string;
} = {
  operationId: 'update_objects_property_batch',
  method: 'patch',
  path: '/v1/spaces/{space_id}/objects/properties/batch',
  parameters: [
    {
      in: 'path',
      name: 'space_id',
      required: true,
      schema: { type: 'string' },
    },
    {
      in: 'header',
      name: 'Anytype-Version',
      required: true,
      schema: { type: 'string' },
    },
  ],
  requestBody: {
    content: {
      'application/json': {
        schema: {
          properties: {
            property_key: { type: 'string' },
            value: {
              oneOf: [
                { type: 'string' },
                { type: 'number' },
                { type: 'boolean' },
                { type: 'array', items: { type: 'string' } },
              ],
            },
            object_ids: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Object properties updated successfully',
    },
  },
};

interface UpdateObjectBatchItem extends UpdateObjectRequest {
  object_id: string;
}

interface UpdateObjectsPropertyBatchItem {
  property_key: string;
  value: string | number | boolean | string[];
  object_ids: string[];
}

export class AnytypeClient extends HttpClient {
  async createObjectBatch(
    spaceId: string,
    objects: CreateObjectRequest[],
  ): Promise<AnytypeObject[]> {
    try {
      const response = await this.executeOperation(
        createObjectBatchOperation,
        {
          space_id: spaceId,
          objects: objects,
          'Anytype-Version': '1.0.0', // Placeholder for header
        },
      );
      return response.data as AnytypeObject[];
    } catch (error) {
      if (error instanceof HttpClientError) {
        throw new Error(
          `Failed to create objects in batch: ${error.message} - ${JSON.stringify(error.data)}`,
        );
      }
      throw error;
    }
  }

  async updateObjectBatch(
    spaceId: string,
    updates: UpdateObjectBatchItem[],
  ): Promise<AnytypeObject[]> {
    try {
      const response = await this.executeOperation(
        updateObjectBatchOperation,
        {
          space_id: spaceId,
          updates: updates,
          'Anytype-Version': '1.0.0', // Placeholder for header
        },
      );
      return response.data as AnytypeObject[];
    } catch (error) {
      if (error instanceof HttpClientError) {
        throw new Error(
          `Failed to update objects in batch: ${error.message} - ${JSON.stringify(error.data)}`,
        );
      }
      throw error;
    }
  }

  async updateObjectsPropertyBatch(
    spaceId: string,
    propertyKey: string,
    value: string | number | boolean | string[],
    objectIds: string[],
  ): Promise<AnytypeObject[]> {
    try {
      const response = await this.executeOperation(
        updateObjectsPropertyBatchOperation,
        {
          space_id: spaceId,
          property_key: propertyKey,
          value: value,
          object_ids: objectIds,
          'Anytype-Version': '1.0.0', // Placeholder for header
        },
      );
      return response.data as AnytypeObject[];
    } catch (error) {
      if (error instanceof HttpClientError) {
        throw new Error(
          `Failed to update objects property in batch: ${error.message} - ${JSON.stringify(
            error.data,
          )}`,
        );
      }
      throw error;
    }
  }
}
