/**
 * AUTO-GENERATED API CLIENT
 * Resource: assets
 */
import { APIRequestContext, APIResponse } from '@playwright/test';

export class AssetsClient {
  constructor(private request: APIRequestContext) {}

  /**
   * List Assets
   * [GET] /api/v1/assets/
   */
  async listAssets(queryParams?: Record<string, any>): Promise<APIResponse> {
    return this.request.get(`/api/v1/assets/`, {
      params: queryParams,
    });
  }

  /**
   * Asset Summary
   * [GET] /api/v1/assets/summary
   */
  async assetSummary(queryParams?: Record<string, any>): Promise<APIResponse> {
    return this.request.get(`/api/v1/assets/summary`, {
      params: queryParams,
    });
  }

  /**
   * Get Prices
   * [GET] /api/v1/assets/{ticker}/prices
   */
  async getPrices(ticker: string | number, queryParams?: Record<string, any>): Promise<APIResponse> {
    return this.request.get(`/api/v1/assets/${ticker}/prices`, {
      params: queryParams,
    });
  }

  /**
   * Get Returns
   * [GET] /api/v1/assets/{ticker}/returns
   */
  async getReturns(ticker: string | number, queryParams?: Record<string, any>): Promise<APIResponse> {
    return this.request.get(`/api/v1/assets/${ticker}/returns`, {
      params: queryParams,
    });
  }

  /**
   * Ingest Assets
   * [POST] /api/v1/assets/ingest
   */
  async ingestAssets(data: Record<string, any> | any = {}): Promise<APIResponse> {
    return this.request.post(`/api/v1/assets/ingest`, {
      data,
    });
  }

  /**
   * Get Macro
   * [GET] /api/v1/assets/macro/{series_name}
   */
  async getMacro(series_name: string | number, queryParams?: Record<string, any>): Promise<APIResponse> {
    return this.request.get(`/api/v1/assets/macro/${series_name}`, {
      params: queryParams,
    });
  }
}
