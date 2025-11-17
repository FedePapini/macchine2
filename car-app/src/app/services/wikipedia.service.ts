import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WikipediaService {

  private apiUrl = 'https://en.wikipedia.org/w/api.php';

  constructor(private http: HttpClient) {}

  /** 🔍 1) Cerca il titolo corretto della pagina auto */
  private searchPage(make: string, model: string): Observable<string | null> {
    const query = `${make} ${model}`.trim();

    const params = {
      action: 'query',
      format: 'json',
      origin: '*',
      list: 'search',
      srsearch: query
    };

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map(res => {
        const results = res?.query?.search;
        if (!results || results.length === 0) return null;
        return results[0].title; // primo risultato più rilevante
      })
    );
  }

  /** 🖼 2) Ottiene l'immagine dalla pagina trovata */
  private getPageImage(title: string): Observable<string | null> {
    const params = {
      action: 'query',
      format: 'json',
      origin: '*',
      prop: 'pageimages',
      piprop: 'original',
      titles: title
    };

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map(res => {
        const pages = res?.query?.pages || {};
        const page = Object.values(pages)[0] as any;
        return page?.original?.source || null;
      })
    );
  }

  /** 🚀 Metodo principale da usare */
 getCarImage(make: string, model: string): Observable<string | null> {
  return this.searchPage(make, model).pipe(
    switchMap(title => {

      if (!title) {
        return new Observable<string | null>(observer => {
          observer.next(null);
          observer.complete();
        });
      }

      return this.getPageImage(title);
    })
  );
}

}
