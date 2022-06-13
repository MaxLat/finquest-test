import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private http : HttpClient,@Inject('env') private env : any) { }

  getDepartments() : Observable<any> {
    return this.http.get(`${this.env.API_BASE}/api/reference/department`).pipe(take(1));
  }

}