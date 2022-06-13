import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  concatMap,
  debounce,
  map,
  Observable,
  of,
  take,
  timer,
} from 'rxjs';
import { CountriesService } from './countries.service';
import { DepartmentService } from './departments.service';
import { SkillService } from './skills.service';

@Injectable({
  providedIn: 'root',
})
export class UsersLibService {
  constructor(
    private http: HttpClient,
    private _skillsService: SkillService,
    private _departmentService: DepartmentService,
    private _countryService: CountriesService,
    @Inject('env') private env : any
  ) {}

  getUsers(): Observable<any> {
    const body = {
      firstname: null,
      lastname: null,
      isAlreadyConnected: null,
    };
    return this.http.post(`${this.env.API_BASE}/api/people/list`, body).pipe(take(1));
  }

  getUsersFiltered(body: FormData): Observable<any> {
    return this.http
      .post(`${this.env.API_BASE}/api/people/list`, body)
      .pipe(debounce(() => timer(1000)));
  }

  getUserInfos(id: string): Observable<any> {
    return this.http.get(`${this.env.API_BASE}/api/people/${id}`).pipe(
      concatMap((user: any) => {
        if (user.skillsId.length === 0) {
          return of(user);
        }

        return this._skillsService.getSkillsbyId(user.skillsId).pipe(
          map((skills: any) => {
            user.skillsId = skills.filter((skill: any) =>
              user.skillsId.some((userSkill: any) => skill.id == userSkill)
            );
            return user;
          })
        );
      }),
      concatMap((user: any) => {
        return this._departmentService.getDepartments().pipe(
          map((departments: any) => {
            user.department = departments.find(
              (dpt: any) => dpt.id === user.departmentId
            );
            return { user: user, departments: departments };
          })
        );
      }),
      concatMap((data: any) => {
        return this._countryService.getCountries().pipe(
          map((countries: any) => {
            data.user.country = countries.find(
              (country: any) => country.id === data.user.countryId
            );
            data['countries'] = countries;
            return data;
          })
        );
      })
    );
  }

  updateUsers(user : any){
    return this.http.post(`${this.env.API_BASE}/api/people/update`, user).pipe(take(1));
  }
}
