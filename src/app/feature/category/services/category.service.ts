import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Category } from '../model/category.model';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly apiUrl = environment.apiUrl;

  private readonly httpClient = inject(HttpClient);

  public categories = toSignal(     /* -- Uso de toSignal, evitando o uso de Observables  */
    this.httpClient.get<Category[]>(`${this.apiUrl}/categories`),
    { initialValue: [] as Category[] }
  );

  /*public getCategories(): Observable<Category[]>{
    return this.httpClient
      .get<Category[]>(`${this.apiUrl}/categories`)
      .pipe(tap(categories => this.categories.set(categories)));
  }*/
}
