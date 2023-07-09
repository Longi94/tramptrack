import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Availabilities } from './availabilities';
import { Site } from '../site/sites';
import { environment } from '../../environments/environment';

const BASE_URL = `${environment.apiUrl}/api`

function dateToStringParam(date: Date): string {
  return `${date.getFullYear()}${("0" + (date.getMonth() + 1)).slice(-2)}${("0" + date.getDate()).slice(-2)}`;
}

@Injectable({
  providedIn: 'root'
})
export class RollerService {
  constructor(private http: HttpClient) { }

  getAvailabilities(site: Site, date: Date): Observable<Availabilities> {
    const params: {[param: string]: string} = {
      endDateIndex: dateToStringParam(date),
      startDateIndex: dateToStringParam(date)
    }
    if (site.group) {
      params['group'] = site.group;
    }

    return this.http.get<Availabilities>(`${BASE_URL}/products/availabilities/widget`, {
      params,
      headers: {
        'X-Api-Key': site.apiKey
      },
    }).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
