import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { urlconstants } from '../utils/url';

@Injectable({
  providedIn: 'root',
})
export class Api {

  constructor(private http: HttpClient) {}

  createaccount(payload: any): Observable<any> {
    return this.http.post(urlconstants.createaccount, payload);
  }
}
