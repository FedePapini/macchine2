import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarsService } from './services/cars.service';
import { WikipediaService } from './services/wikipedia.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {

  brandSearch = '';
  selectedMake = '';
  makes: any[] = [];
  filteredMakes: any[] = [];
  models: any[] = [];

  loadingMakes = false;
  loadingModels = false;
  error: string | null = null;

  carImages: Record<string, string> = {};

  constructor(
    private cars: CarsService,
    private wikipedia: WikipediaService
  ) {
    this.loadMakes();
  }

  /** Carica tutte le marche */
  loadMakes() {
    this.loadingMakes = true;
    this.cars.getAllMakes().subscribe({
      next: res => {
        this.loadingMakes = false;
        this.makes = res?.Results || [];
        this.filteredMakes = this.makes.slice(0, 50);
      },
      error: () => {
        this.loadingMakes = false;
        this.error = 'Errore nel caricamento delle marche.';
      }
    });
  }

  /** Filtra le marche mentre scrivi */
  filterMakes() {
    const term = this.brandSearch.trim().toLowerCase();
    if (!term) {
      this.filteredMakes = this.makes.slice(0, 50);
      return;
    }

    this.filteredMakes = this.makes
      .filter(m => m.Make_Name.toLowerCase().includes(term))
      .slice(0, 50);
  }

  /** Seleziona una marca */
  selectMake(make: string) {
    this.selectedMake = make;
    this.models = [];
    this.loadModels();
  }

  /** Carica modelli della marca selezionata */
  loadModels() {
    this.loadingModels = true;
    this.cars.getModelsForMake(this.selectedMake).subscribe({
      next: res => {
        this.loadingModels = false;
        this.models = res?.Results || [];
        if (!this.models.length) {
          this.error = 'Nessun modello trovato.';
        }
      },
      error: () => {
        this.loadingModels = false;
        this.error = 'Errore caricamento modelli.';
      }
    });
  }

  /** Recupera l'immagine del modello */
  getCarImage(make: string, model: string): string {
    const key = `${make}-${model}`.toLowerCase();

    // usa la cache
    if (this.carImages[key]) return this.carImages[key];

    this.carImages[key] = 'assets/car-placeholder.jpg';

    this.wikipedia.getCarImage(make, model).subscribe(img => {
      this.carImages[key] = img || 'assets/car-placeholder.jpg';
    });

    return this.carImages[key];
  }
}
