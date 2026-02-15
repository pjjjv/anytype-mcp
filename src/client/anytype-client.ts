import { HttpClient, HttpClientError } from './http-client';
import { CreateObjectRequest, Object as AnytypeObject, UpdateObjectRequest } from '../models';

interface UpdateObjectBatchItem extends UpdateObjectRequest {
  object_id: string;
}

export class AnytypeClient extends HttpClient {
  async createObjectsBatch(
    spaceId: string,
    objects: CreateObjectRequest[],
  ): Promise<AnytypeObject[]> {
    try {
      const response = await this.executeOperation(
        {
          method: 'post',
          path: `/v1/spaces/${spaceId}/objects/batch`,
          operationId: 'create_objects_batch',
        },
        {
          space_id: spaceId,
          objects,
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

  async updateObjectsBatch(
    spaceId: string,
    updates: UpdateObjectBatchItem[],
  ): Promise<AnytypeObject[]> {
    try {
      const response = await this.executeOperation(
        {
          method: 'patch',
          path: `/v1/spaces/${spaceId}/objects/batch`,
          operationId: 'update_objects_batch',
        },
        {
          space_id: spaceId,
          updates,
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
}
