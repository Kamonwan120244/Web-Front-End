import { Component, inject, AfterViewInit, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DatePipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ApisService } from '../../../shared/services/api/apis.service';
import { Product } from './../../../shared/models/product.model';
import { Category } from '../../../shared/models/category.model';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIcon,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    DatePipe,
    MatProgressSpinnerModule,
    MatTabsModule,
    CommonModule,
    CurrencyPipe,
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent implements OnInit {
  readonly #apisService = inject(ApisService);
  products: Product[] = [];
  categories: Category[] = [];
  filteredProducts: Product[] = [];
  loading: boolean = true;
  lotsOfTabs: string[] = [];
  searchText: string = '';
  selectedTabIndex = 0;
  selectedCategory: Category | undefined;

  onTabChange(event: any) {
    this.selectedTabIndex = event.index;
    this.updateSelectedCategory();
  }

  onSearch(): void {
    console.log('Search Text:', this.searchText);
    if (this.searchText) {
      this.filteredProducts = this.products.filter((product) =>
        product.ProductName.toLowerCase().includes(
          this.searchText.toLowerCase()
        )
      );
    } else {
      this.filteredProducts = [...this.products];
    }
    console.log('Filtered Products:', this.filteredProducts);
  }

  updateSelectedCategory() {
    if (
      this.categories &&
      this.categories.length > 0 &&
      this.selectedTabIndex < this.categories.length
    ) {
      this.selectedCategory = this.categories[this.selectedTabIndex];
      if (this.selectedCategory) {
        this.filterProductsByCategory(this.selectedCategory.CategoryID);
      }
    } else {
      this.selectedCategory = undefined;
      console.warn(
        'Selected category is not available or selectedTabIndex is out of bounds'
      );
    }
  }

  filterProductsByCategory(categoryID: number) {
    if (categoryID) {
      this.filteredProducts = this.products.filter(
        (product) => product.CategoryID === categoryID
      );
      console.log(
        '🚀 ~ ProductComponent ~ filterProductsByCategory ~  this.filteredProducts:',
        this.filteredProducts
      );
    }
  }

  ngOnInit() {
    this.featProductData();
    this.featCategoryData();
  }

  featCategoryData() {
    this.#apisService.getCategories().subscribe({
      next: (categories) => {
        if (Array.isArray(categories)) {
          this.categories = categories;
          this.lotsOfTabs = this.categories.map(
            (category) => category.CategoryName
          );

          if (this.lotsOfTabs.length > 0) {
            this.selectedTabIndex = 0;
            this.updateSelectedCategory();
          }
          //console.log('categories:', this.categories);
        } else {
          console.log('No categories data available');
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
        this.loading = false;
      },
    });
  }

  featProductData() {
    this.loading = true;
    this.#apisService.getProducts().subscribe({
      next: (products) => {
        if (Array.isArray(products)) {
          this.products = products;
          this.filteredProducts = [...this.products];

          if (this.selectedCategory) {
            this.filterProductsByCategory(this.selectedCategory.CategoryID);
          }
          //console.log('Products:', this.products);
        } else {
          console.log('No products data available');
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching products:', error);
        this.loading = false;
      },
    });
  }
}
