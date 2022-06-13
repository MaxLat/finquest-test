import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { debounce, Observable, take, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  constructor(private http : HttpClient, @Inject('env') private env : any) { }

  getCountries() : Observable<any> {
    return this.http.get(`${this.env.API_BASE}/api/reference/country`).pipe(take(1));
  }

}