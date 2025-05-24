import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Career } from '../model/career';
import { environment } from '../../environments/environment.development';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CareerService {
  private url: string = `${environment.HOST}/careers`;
  private careerChange: Subject<Career[]> = new Subject<Career[]>();
  private messageChange: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient) { }

  // CRUD Básico
  findAll() {
    return this.http.get<Career[]>(this.url);
  }

  findById(id: number) {
    return this.http.get<Career>(`${this.url}/${id}`);
  }

  save(career: Career) {
    return this.http.post(this.url, career);
  }

  update(id: number, career: Career) {
    return this.http.put(`${this.url}/${id}`, career);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }


  setCareerChange(data: Career[]) {
    this.careerChange.next(data);
  }

  getCareerChange() {
    return this.careerChange.asObservable();
  }

  setMessageChange(data: string) {
    this.messageChange.next(data);
  }

  getMessageChange() {
    return this.messageChange.asObservable();
  }

searchByNameOrCode(query: string) {
  return this.http.get<Career[]>(`${this.url}/search?query=${query}`);
}

findAllPaginated(page: number, size: number) {
  return this.http.get<Career[]>(`${this.url}/paged?page=${page}&size=${size}`);
}
}