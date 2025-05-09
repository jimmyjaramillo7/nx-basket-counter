import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, take, tap, throwError } from 'rxjs';
import { AuthStatus } from '../interfaces/authStatus.enum';
import { IToken } from '../interfaces/token.interface';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private readonly _baseURL: string = environment.baseURL;
  private _authStatus = signal<AuthStatus>(AuthStatus.CHECKING)


  constructor() {
    this.refreshToken().pipe(take(1)).subscribe()
  }

  public authStatus = computed(() => this._authStatus())

  private setAuthentication(token: string) {
    this._authStatus.set(AuthStatus.AUTHENTICATED);
    localStorage.setItem('token-board', token);
    return true;
  }

  login(payload: { username: string | null, password: string | null }): Observable<boolean> {
    const url = `${this._baseURL}/api/v1/auth/signin`    

    return this.http.post<IToken>(url, payload)
      .pipe(
        map(({ access_token }) => this.setAuthentication(access_token)),
        catchError((err) => {
          console.log(err);
          
          return throwError(() => err.error.message ?? "Error al iniciar sesión")
        })
      )
  }


  refreshToken(): Observable<boolean> {
    
    const url = `${this._baseURL}/api/v1/auth/refresh`
    
    const token = localStorage.getItem('token-board')

    if (!token) {
      this.logout()
      return of(false);
    }
    
    return this.http.get<IToken>(url)
      .pipe(
        map(({ access_token }) => this.setAuthentication(access_token)),
        catchError((err) => {
          console.log(err.error ?? err);
          this._authStatus.set(AuthStatus.UNAUTHENTICATED)
          return of(false)
        })
      )
  }

  logout() {
    //console.log("CERRANDO SESION");
    localStorage.removeItem('token-noc');
    this._authStatus.set(AuthStatus.UNAUTHENTICATED)
  }
}