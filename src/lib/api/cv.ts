import { CV, CVContent } from '@/types/cv';
import { handleApiError } from '@/lib/errors';

/**
 * CV API client class for handling all CV-related HTTP requests
 * Provides methods for CRUD operations on CV resources
 * Handles error responses and data transformation
 */
export class CVApi {
  private baseUrl = '/api/cv'; // Base API endpoint for CV operations

  /**
   * Creates a new CV for the authenticated user
   * @param data - Object containing CV title and optional initial content
   * @returns Promise resolving to the created CV object
   * @throws Error if creation fails or user is not authenticated
   */
  async createCV(data: { title: string; content?: Partial<CVContent> }): Promise<CV> {
    try {
      // Send POST request to create new CV
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      // Check if request was successful
      if (!response.ok) {
        throw new Error(`Failed to create CV: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Retrieves a specific CV by its ID
   * @param id - The unique identifier of the CV to fetch
   * @returns Promise resolving to the CV object
   * @throws Error if CV not found or user lacks permission
   */
  async getCV(id: string): Promise<CV> {
    try {
      // Fetch CV data from API
      const response = await fetch(`${this.baseUrl}/${id}`);

      // Verify response is successful
      if (!response.ok) {
        throw new Error(`Failed to fetch CV: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Updates an existing CV with new data
   * @param id - The unique identifier of the CV to update
   * @param data - Partial CV object containing fields to update
   * @returns Promise resolving to the updated CV object
   * @throws Error if update fails or user lacks permission
   */
  async updateCV(id: string, data: Partial<CV>): Promise<CV> {
    try {
      // Send PUT request with updated data
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      // Check if update was successful
      if (!response.ok) {
        throw new Error(`Failed to update CV: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Permanently deletes a CV
   * @param id - The unique identifier of the CV to delete
   * @returns Promise that resolves when deletion is complete
   * @throws Error if deletion fails or user lacks permission
   */
  async deleteCV(id: string): Promise<void> {
    try {
      // Send DELETE request
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });

      // Verify deletion was successful
      if (!response.ok) {
        throw new Error(`Failed to delete CV: ${response.statusText}`);
      }
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Retrieves all CVs belonging to the authenticated user
   * @returns Promise resolving to array of user's CVs
   * @throws Error if fetch fails or user is not authenticated
   */
  async getUserCVs(): Promise<CV[]> {
    try {
      // Fetch user's CV list
      const response = await fetch(this.baseUrl);

      // Verify request was successful
      if (!response.ok) {
        throw new Error(`Failed to fetch CVs: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

// Export singleton instance for use throughout the application
export const cvApi = new CVApi();
