/**
 * AUTO-GENERATED API CLIENT
 * Resource: monte-carlo-simulation
 */
import { APIRequestContext, APIResponse } from '@playwright/test';

export class MonteCarloSimulationClient {
  constructor(private request: APIRequestContext) {}

  /**
   * Run Monte Carlo
   * [POST] /api/v1/simulation/monte-carlo
   */
  async runMonteCarlo(data: Record<string, any> | any = {}): Promise<APIResponse> {
    return this.request.post(`/api/v1/simulation/monte-carlo`, {
      data,
    });
  }

  /**
   * Run Sensitivity
   * [POST] /api/v1/simulation/sensitivity
   */
  async runSensitivity(data: Record<string, any> | any = {}): Promise<APIResponse> {
    return this.request.post(`/api/v1/simulation/sensitivity`, {
      data,
    });
  }

  /**
   * Probability Analysis
   * [POST] /api/v1/simulation/probability
   */
  async probabilityAnalysis(data: Record<string, any> | any = {}): Promise<APIResponse> {
    return this.request.post(`/api/v1/simulation/probability`, {
      data,
    });
  }
}
