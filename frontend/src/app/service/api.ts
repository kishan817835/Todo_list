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
  
  login(payload: any): Observable<any> {
    return this.http.post(urlconstants.login, payload);
  }
  
  createTask(payload: any): Observable<any> {
    return this.http.post(urlconstants.createtask, payload);
  }
  
  getTasks(params?: any): Observable<any> {
    let url = urlconstants.gettasks;
    if (params) {
      const queryParams = new URLSearchParams(params).toString();
      url += queryParams ? `?${queryParams}` : '';
    }
    return this.http.get(url);
  }
  
  getrecenttasks(): Observable<any> {
    return this.http.get(urlconstants.getrecenttasks);
  }
  
  getTaskById(taskId: string): Observable<any> {
    return this.http.get(`${urlconstants.gettaskbyid}/${taskId}`);
  }
  
  getPublicTaskById(taskId: string): Observable<any> {
    return this.http.get(`${urlconstants.getpublictaskbyid}/${taskId}`);
  }
  
  updateTask(taskId: string, payload: any): Observable<any> {
    return this.http.put(`${urlconstants.updatetask}/${taskId}`, payload);
  }
  
  deleteTask(taskId: string): Observable<any> {
    return this.http.delete(`${urlconstants.deletetask}/${taskId}`);
  }
  
  reorderTasks(payload: any[]): Observable<any> {
    return this.http.put(urlconstants.reordertasks, payload);
  }
  
  getTaskDaysCount(taskId: string): Observable<any> {
    return this.http.get(`${urlconstants.taskdayscount}/${taskId}`);
  }
  
  Taskvisibility(taskId: string, payload: any): Observable<any> {
    return this.http.post(`${urlconstants.taskvisibility}`, payload);
  }
}