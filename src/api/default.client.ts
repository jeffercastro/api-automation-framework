/**
 * AUTO-GENERATED API CLIENT
 * Resource: default
 */
import { APIRequestContext, APIResponse } from '@playwright/test';

export class DefaultClient {
  constructor(private request: APIRequestContext) {}

  /**
   * Health
   * [GET] /health
   */
  async healthHealthGet(queryParams?: Record<string, any>): Promise<APIResponse> {
    return this.request.get(`/health`, {
      params: queryParams,
    });
  }

  /**
   * Root
   * [GET] /
   */
  async rootGet(queryParams?: Record<string, any>): Promise<APIResponse> {
    return this.request.get(`/`, {
      params: queryParams,
    });
  }

  /**
   * Dashboard
   * [GET] /dashboard
   */
  async dashboardDashboardGet(queryParams?: Record<string, any>): Promise<APIResponse> {
    return this.request.get(`/dashboard`, {
      params: queryParams,
    });
  }
}
