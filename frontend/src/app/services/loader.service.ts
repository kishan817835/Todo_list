import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  private apiCount = 0;

  constructor() { }

  show() {
    this.apiCount++;
    console.log('Loader show - apiCount:', this.apiCount);
    if (this.apiCount === 1) {
      this.loadingSubject.next(true);
    }
  }

  hide() {
    this.apiCount--;
    console.log('Loader hide - apiCount:', this.apiCount);
    if (this.apiCount <= 0) {
      this.apiCount = 0; // Prevent negative values
      this.loadingSubject.next(false);
    }
  }

  forceHide() {
    this.apiCount = 0;
    this.loadingSubject.next(false);
  }

  isLoading() {
    return this.loading$;
  }
}
