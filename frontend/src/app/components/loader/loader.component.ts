import { Component } from '@angular/core';
import { LoaderService } from '../../services/loader.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css'],
  imports: [CommonModule]
})
export class LoaderComponent {
  isLoading = false;
  private loadingSubscription: Subscription;

  constructor(private loaderService: LoaderService) {
    this.loadingSubscription = this.loaderService.loading$.subscribe(
      (loading) => {
        this.isLoading = loading;
      }
    );
  }

  ngOnDestroy() {
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }
}
