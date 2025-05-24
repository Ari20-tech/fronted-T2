import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course} from '../model/course';
import { environment } from '../../environments/environment.development';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private url: string=`${environment.HOST}/courses`;
  private courseChange: Subject<Course[]>= new Subject<Course[]>;
  private messageChange: Subject<string>= new Subject<string>;

  constructor(private http: HttpClient) { }

  findAll(){
    return this.http.get<Course[]>(this.url);
  }

  findById(id: number){
    return this.http.get<Course>(`${this.url}/${id}`);
  }

  save(course: Course){
    return this.http.post(this.url, course);
  }

  update(id: number, course: Course){
    return this.http.put(`${this.url}/${id}`, course);
  }

  delete(id: number){
    return this.http.delete(`${this.url}/${id}`);
  }

  setCourseChange(data: Course[]){
    this.courseChange.next(data);
  }

  getCourseChange(){
    return this.courseChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
