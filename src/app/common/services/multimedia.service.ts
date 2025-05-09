import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable, skip, tap } from 'rxjs';
import { IMedia, IMediaResponse } from '../interfaces/multimedia.interface';

@Injectable({
  providedIn: 'root'
})
export class MultimediaService {

  private http = inject(HttpClient);
  private readonly _baseURL: string = environment.baseURL;

  participantList = signal<string[]>([])

  listMultimedia(type:string, limit:number, skip: number): Observable<IMediaResponse> {
    const url = `${this._baseURL}/api/v1/multimedia/list/${type}/${limit}/${skip}`;

    return this.http.get<IMediaResponse>(url)
  }


  uploadMultimedia(file:File): Observable<IMedia> {
    const url = `${this._baseURL}/api/v1/multimedia/upload`;
    const formData = new FormData();
    formData.append('media', file);

    return this.http.post<IMedia>(url, formData);
  }


  getParticipants(){
    const url = `${this._baseURL}/api/v1/multimedia/get-participants`;
    return this.http.get<string[]>(url)
    .pipe(
      tap(x => this.participantList.set(x))
    )
  }
}
