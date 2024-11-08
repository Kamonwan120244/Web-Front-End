import { Component, inject, OnInit } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { ApisService } from '../../../shared/services/api/apis.service';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Order } from '../../models/order.model';
import { Customer } from '../../models/customer.model';
import { Product } from '../../models/product.model';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-order-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    CurrencyPipe,
    CommonModule,
    DatePipe,
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    MatDialogClose,
    MatProgressSpinnerModule,
  ],
  templateUrl: './order-dialog.component.html',
  styleUrl: './order-dialog.component.scss',
})
export class OrderDialogComponent implements OnInit {
  readonly #apisService = inject(ApisService);
  readonly dialogRef = inject(MatDialogRef<OrderDialogComponent>);
  readonly data = inject(MAT_DIALOG_DATA);
  orderData: any;
  customerData: any;
  productData: any;
  employeeData: any;
  isLoading = true;

  ngOnInit() {
    const orderID = this.data?.OrderID;
    if (orderID) {
      this.fetchOrderById(orderID);
    } else {
      console.error('OrderID not found in dialog data');
    }
  }

  checkAllDataLoaded() {
    if (this.employeeData && this.customerData && this.productData) {
      this.isLoading = false;
    }
  }

  fetchOrderById(orderID: number) {
    this.#apisService.getOrders().subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          const orders = response;
          this.orderData = orders.find((order) => order.OrderID === orderID);

          if (this.orderData) {
            console.log('Fetched Order:', this.orderData);
            // After fetching the order, fetch other data
            this.featCustomerData();
            this.featProductData();
            this.featEmployeeData();
          } else {
            console.error(`Order with ID ${orderID} not found.`);
          }
        } else {
          console.error('API response does not contain an array of orders.');
        }
      },
      error: (error) => {
        console.error('Error fetching orders:', error);
      },
    });
  }

  featCustomerData() {
    this.#apisService.getCustomers().subscribe((customers) => {
      if (Array.isArray(customers)) {
        const customersData = customers;
        this.customerData = customersData.find(
          (customer: any) => customer.CustomerID === this.orderData?.CustomerID
        );
        this.checkAllDataLoaded();
        //console.log('Customer Data:', this.customerData);
      } else {
        console.error(
          'API response does not contain a valid array of customers.'
        );
        this.checkAllDataLoaded();
      }
    });
  }

  featProductData() {
    this.#apisService.getProducts().subscribe((products) => {
      if (Array.isArray(products)) {
        const productsData = products;
        this.productData = productsData.find(
          (product: any) => product.ProductID === this.orderData?.ProductID
        );

        if (this.productData) {
          this.featCategoryData(this.productData.CategoryID);
          this.featSupplierData(this.productData.SupplierID);
        } else {
          console.error('Product with the specified ProductID not found.');
        }

        this.checkAllDataLoaded();
        //console.log('Product Data:', this.productData);
      } else {
        console.error(
          'API response does not contain a valid array of product.'
        );
        this.checkAllDataLoaded();
      }
    });
  }

  featEmployeeData() {
    this.#apisService.getEmployees().subscribe((employees) => {
      if (Array.isArray(employees)) {
        const employeesData = employees;
        this.employeeData = employeesData.find(
          (employee: any) => employee.EmployeeID === this.orderData?.EmployeeID
        );
        this.checkAllDataLoaded();
       // console.log('Employee Data:', this.employeeData);
      } else {
        console.error(
          'API response does not contain a valid array of employees.'
        );
        this.checkAllDataLoaded();
      }
    });
  }

  featSupplierData(supplierID: number) {
    this.#apisService.getSuppliers().subscribe((suppliers) => {
      if (Array.isArray(suppliers)) {
        const supplier = suppliers.find((sup: any) => sup.SupplierID === supplierID);
        if (supplier) {
          this.productData.supplier = supplier;
          //console.log('Supplier Data:', this.productData.supplier);
        } else {
          console.error('Supplier not found for SupplierID:', supplierID);
        }
      } else {
        console.error('API response does not contain a valid array of suppliers.');
      }
    });
  }

  featCategoryData(categoryID: number) {
    this.#apisService.getCategories().subscribe((categories) => {
      if (Array.isArray(categories)) {
        const category = categories.find((cat: any) => cat.CategoryID === categoryID);
        if (category) {
          this.productData.category = category;
          //console.log('Category Data:', this.productData.category);
        } else {
          console.error('Category not found for CategoryID:', categoryID);
        }
      } else {
        console.error('API response does not contain a valid array of categories.');
      }
    });
  }
  
  
}
