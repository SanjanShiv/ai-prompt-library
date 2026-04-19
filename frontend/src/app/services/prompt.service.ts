import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prompt } from '../models/prompt.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PromptService {
  private apiUrl = environment.apiUrl + '/prompts/';

  constructor(private http: HttpClient) { }

  getPrompts(): Observable<Prompt[]> {
    return this.http.get<Prompt[]>(this.apiUrl);
  }

  getPrompt(id: string): Observable<Prompt> {
    return this.http.get<Prompt>(`${this.apiUrl}${id}/`);
  }

  createPrompt(prompt: Partial<Prompt>): Observable<Prompt> {
    return this.http.post<Prompt>(this.apiUrl, prompt);
  }

  deletePrompt(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }
}
