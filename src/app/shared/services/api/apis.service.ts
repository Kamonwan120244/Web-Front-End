import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../../models/category.model';
import { Customer } from '../../models/customer.model';
import { Employee } from '../../models/employee.model';
import { Product } from '../../models/product.model';
import { Supplier } from '../../models/supplier.model';
import { Order } from '../../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class ApisService {
  readonly #http = inject(HttpClient);

  getCategories() {
    return this.#http.get<{ data: Category[] }>('/categories');
  }

  getCustomers() {
    return this.#http.get<{ data: Customer[] }>('/customers');
  }

  getEmployees() {
    return this.#http.get<{ data: Employee[] }>('/employees');
  }

  getProducts() {
    return this.#http.get<{ data: Product[] }>('/products');
  }

  getSuppliers() {
    return this.#http.get<{ data: Supplier[] }>('/suppliers');
  }

  getOrders() {
    return this.#http.get<{ data: Order[] }>('/orders');
  }

  getOrdersByQuery(orderID: number) {
    return this.#http.get<{ data: Order }>(`/orders?OrderID=${orderID}`);
  }  
}
