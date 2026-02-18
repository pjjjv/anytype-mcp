import { test, expect, describe, vi, beforeEach } from 'vitest';
import { MCPProxy } from '../proxy';
import { OpenAPIV3 } from 'openapi-types';
import { readFileSync } from 'fs';
import { HttpClient } from '../../client/http-client';
import { Headers } from "node-fetch";

vi.mock("@modelcontextprotocol/sdk/server/index.js");
vi.mock("../../client/http-client");

describe('McpProxy Batch Operations', () => {
  let proxy: MCPProxy;
  let mockOpenApiSpec: OpenAPIV3.Document;

  const getHandlers = (proxy: MCPProxy) => {
    const server = (proxy as any).server;
    return server.setRequestHandler.mock.calls
      .flatMap((x: unknown[]) => x)
      .filter((x: unknown) => typeof x === "function");
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // read the modified openapi.json
    mockOpenApiSpec = JSON.parse(readFileSync('./scripts/openapi.json', 'utf-8'));
    proxy = new MCPProxy('test-proxy', mockOpenApiSpec);
  });

  test('should list the new batch operation', async () => {
    const [listToolsHandler] = getHandlers(proxy);
    const result = await listToolsHandler();

    const createBatchTool = result.tools.find((tool: any) => tool.name.includes('API-create-object-batch'));
    expect(createBatchTool).toBeDefined();
    expect(createBatchTool.description).toBe('Create objects in batch\nError Responses:\n400: Bad request\n401: Unauthorized\n429: Rate limit exceeded\n500: Internal server error');

    const updateBatchTool = result.tools.find((tool: any) => tool.name.includes('API-update-object-batch'));
    expect(updateBatchTool).toBeDefined();
    expect(updateBatchTool.description).toBe('Update objects in batch\nError Responses:\n400: Bad request\n401: Unauthorized\n404: Resource not found\n429: Rate limit exceeded\n500: Internal server error');

    const updatePropertyBatchTool = result.tools.find((tool: any) => tool.name.includes('API-update-objects-property-batch'));
    expect(updatePropertyBatchTool).toBeDefined();
    expect(updatePropertyBatchTool.description).toBe('Update objects property in batch\nError Responses:\n400: Bad request\n401: Unauthorized\n404: Resource not found\n429: Rate limit exceeded\n500: Internal server error');
  });

  test('should call executeOperation when a batch tool is called', async () => {
    const mockSuccessResponse = {
      data: [{ id: 'obj1' }, { id: 'obj2' }],
      status: 201,
      headers: new Headers({ "content-type": "application/json" }),
    };
    (HttpClient.prototype.executeOperation as any).mockResolvedValue(mockSuccessResponse);

    const [, callToolHandler] = getHandlers(proxy);
    const result = await callToolHandler({
      params: {
        name: 'API-create-object-batch',
        arguments: {
          space_id: 'space1',
          objects: [
            { name: 'Object 1', type_key: 'type1' },
            { name: 'Object 2', type_key: 'type1' }
          ]
        }
      }
    });

    expect(HttpClient.prototype.executeOperation).toHaveBeenCalledWith(
      expect.objectContaining({
        operationId: 'create_object_batch',
        method: 'post',
        path: '/v1/spaces/{space_id}/objects/batch'
      }),
      {
        space_id: 'space1',
        objects: [
          { name: 'Object 1', type_key: 'type1' },
          { name: 'Object 2', type_key: 'type1' }
        ]
      }
    );

    expect(result).toEqual({
      content: [{ type: "text", text: JSON.stringify([{ id: 'obj1' }, { id: 'obj2' }]) }],
    });
  });
});
