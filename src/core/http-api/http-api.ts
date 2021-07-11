
import axios, { Method } from 'axios';
import { ILogger } from '../utility/logger';

export class HttpClient {
  private _logger: ILogger;

  constructor(logger: ILogger) {
    this._logger = logger;
  }

  public async request<T>(url: string, method: string, headers?: any, body?: any): Promise<T> {

    try {
      this._logger.info({
        type: 'http.req', url: url, method: method, body: body
      });

      const resp = await axios({
        method: <Method>method,
        url: url,
        headers: headers,
        data: body
      });

      this._logger.info({
        type: 'http.resp', url: url, method: method, 
        status: resp.status, statusText : resp.statusText,
        payload: resp.data
      });

      return <T>resp.data;
    } catch (err) {
      this._logger.error(err);
    }
  }
}