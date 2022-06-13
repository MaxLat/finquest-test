import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, take} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SkillService {

  constructor(private http : HttpClient,@Inject('env') private env : any) { }

  getSkillsbyId(ids : Array<string>) : Observable<any> {
    let params ='';
    for(const [index,id] of ids.entries() ) {
      if(index === 0){
        params += `?id=${id}`;
        continue;
      }
      params += `&id=${id}`
    }
    return this.http.get(`${this.env.API_BASE}/api/reference/skills/${params}`).pipe(take(1));
  }

  getSkillsbyName(text : string) : Observable<any> {

    return this.http.get(`${this.env.API_BASE}/api/reference/skills/?name_like=${text}`).pipe(take(1));
  }
}