import { test, expect, describe, vi, beforeEach } from 'vitest';
import { OpenAPIToMCPConverter } from '../parser';
import { OpenAPIV3 } from 'openapi-types';

describe('OpenAPI Reference Resolution', () => {
  let converter: OpenAPIToMCPConverter;
  const mockSpec: OpenAPIV3.Document = {
    openapi: '3.0.0',
    info: {
      title: 'Test API',
      version: '1.0.0',
    },
    paths: {
      '/test': {
        post: {
          operationId: 'testOp',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/TestRequest',
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'OK',
            },
          },
        },
      },
    },
    components: {
      schemas: {
        TestRequest: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
          },
        },
      },
    },
  };

  beforeEach(() => {
    converter = new OpenAPIToMCPConverter(mockSpec);
  });

  test('should resolve a simple reference', () => {
    const { tools } = converter.convertToMCPTools();
    const tool = tools['API'].methods.find(m => m.name === 'testOp');
    expect(tool).toBeDefined();
    expect(tool?.inputSchema.properties?.name).toBeDefined();
  });
});
