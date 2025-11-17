import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarsService {

  private readonly baseUrl = 'https://vpic.nhtsa.dot.gov/api/vehicles';

  constructor(private http: HttpClient) {}

  /** Tutte le marche disponibili */
  getAllMakes(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/GetAllMakes`, {
      params: { format: 'json' }
    });
  }

  /** Modelli per una certa marca (es: tesla, bmw, audi...) */
  getModelsForMake(make: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/GetModelsForMake/${make}`, {
      params: { format: 'json' }
    });
  }
}
