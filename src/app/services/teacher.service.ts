import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Teacher } from '../model/teacher';
import { environment } from '../../environments/environment.development';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private url: string = `${environment.HOST}/teachers`;
  private teacherChange: Subject<Teacher[]> = new Subject<Teacher[]>();
  private messageChange: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient) { }

  findAll() {
    return this.http.get<Teacher[]>(this.url);
  }

  findById(id: number) {
    return this.http.get<Teacher>(`${this.url}/${id}`);
  }

  save(teacher: Teacher) {
    return this.http.post(this.url, teacher);
  }

  update(id: number, teacher: Teacher) {
    return this.http.put(`${this.url}/${id}`, teacher);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  ///////////////
  setTeacherChange(data: Teacher[]) {
    this.teacherChange.next(data);
  }

  getTeacherChange() {
    return this.teacherChange.asObservable();
  }

  setMessageChange(data: string) {
    this.messageChange.next(data);
  }

  getMessageChange() {
    return this.messageChange.asObservable();
  }

  // Método adicional para buscar por nombre completo
  searchByName(fullName: string) {
    return this.http.get<Teacher[]>(`${this.url}/search?name=${fullName}`);
  }
}