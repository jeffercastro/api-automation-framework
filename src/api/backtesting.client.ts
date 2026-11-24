/**
 * AUTO-GENERATED API CLIENT
 * Resource: backtesting
 */
import { APIRequestContext, APIResponse } from '@playwright/test';

export class BacktestingClient {
  constructor(private request: APIRequestContext) {}

  /**
   * Run Buy And Hold
   * [POST] /api/v1/backtest/buy-and-hold
   */
  async runBuyAndHold(data: Record<string, any> | any = {}): Promise<APIResponse> {
    return this.request.post(`/api/v1/backtest/buy-and-hold`, {
      data,
    });
  }

  /**
   * Run Dca
   * [POST] /api/v1/backtest/dca
   */
  async runDca(data: Record<string, any> | any = {}): Promise<APIResponse> {
    return this.request.post(`/api/v1/backtest/dca`, {
      data,
    });
  }

  /**
   * Run All Weather
   * [POST] /api/v1/backtest/all-weather
   */
  async runAllWeather(data: Record<string, any> | any = {}): Promise<APIResponse> {
    return this.request.post(`/api/v1/backtest/all-weather`, {
      data,
    });
  }

  /**
   * Run Momentum
   * [POST] /api/v1/backtest/momentum
   */
  async runMomentum(data: Record<string, any> | any = {}): Promise<APIResponse> {
    return this.request.post(`/api/v1/backtest/momentum`, {
      data,
    });
  }

  /**
   * Optimize Portfolio
   * [POST] /api/v1/backtest/optimize
   */
  async optimizePortfolio(data: Record<string, any> | any = {}): Promise<APIResponse> {
    return this.request.post(`/api/v1/backtest/optimize`, {
      data,
    });
  }

  /**
   * Compare All Strategies
   * [POST] /api/v1/backtest/compare
   */
  async compareAllStrategies(data: Record<string, any> | any = {}): Promise<APIResponse> {
    return this.request.post(`/api/v1/backtest/compare`, {
      data,
    });
  }
}
