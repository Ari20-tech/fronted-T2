import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Classroom } from '../model/classroom';
import { environment } from '../../environments/environment.development';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClassroomService {
  private url: string = `${environment.HOST}/classroom`;
  private classroomChange: Subject<Classroom[]> = new Subject<Classroom[]>();
  private messageChange: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient) { }

  findAll() {
    return this.http.get<Classroom[]>(`${this.url}?expand=course,teacher,career`);
  }

  findById(id: number) {
    return this.http.get<Classroom>(`${this.url}/${id}`);
  }

  save(classroom: Classroom) {
    return this.http.post(this.url, classroom);
  }

  update(id: number, classroom: Classroom) {
    return this.http.put(`${this.url}/${id}`, classroom);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  setClassroomChange(data: Classroom[]) {
    this.classroomChange.next(data);
  }

  getClassroomChange() {
    return this.classroomChange.asObservable();
  }

  setMessageChange(data: string) {
    this.messageChange.next(data);
  }

  getMessageChange() {
    return this.messageChange.asObservable();
  }

  findByTeacher(teacherId: number) {
    return this.http.get<Classroom[]>(`${this.url}/teacher/${teacherId}`);
  }

  findByCourse(courseId: number) {
    return this.http.get<Classroom[]>(`${this.url}/course/${courseId}`);
  }

  findByCareerAndSemester(careerId: number, semester: string) {
    return this.http.get<Classroom[]>(
      `${this.url}/career/${careerId}/semester/${semester}`
    );
  }

  findByStatus(status: boolean) {
    return this.http.get<Classroom[]>(`${this.url}/status/${status}`);
  }
}