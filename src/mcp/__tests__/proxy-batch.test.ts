import { test, expect, describe, vi, beforeEach } from 'vitest';
import { MCPProxy } from '../proxy';
import { OpenAPIV3 } from 'openapi-types';
import { readFileSync } from 'fs';

vi.mock("@modelcontextprotocol/sdk/server/index.js");

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

    const batchTool = result.tools.find(tool => tool.name.includes('API-create-objects-batch'));
    expect(batchTool).toBeDefined();
    expect(batchTool.description).toBe('Create objects in batch\nError Responses:\n400: Bad request\n401: Unauthorized\n429: Rate limit exceeded\n500: Internal server error');
  });
});
