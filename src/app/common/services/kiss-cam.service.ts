import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class KissCamService {
  private _baseURL: string = environment.baseURL;
  private http: HttpClient = inject(HttpClient);

  start() {
    const url: string = `${this._baseURL}/api/v1/kiss-cam/start`;
    return this.http.get<{ msg: string }>(url)
  }

  stop() {
    const url: string = `${this._baseURL}/api/v1/kiss-cam/stop`;
    return this.http.get<{ msg: string }>(url)
  }

}
