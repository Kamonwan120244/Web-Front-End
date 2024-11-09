import {
  Component,
  inject,
  AfterViewInit,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DatePipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ApisService } from '../../../shared/services/api/apis.service';
import { Order } from '../../../shared/models/order.model';
import { MatDialog } from '@angular/material/dialog';
import { OrderDialogComponent } from '../../../shared/components/order-dialog/order-dialog.component';

@Component({
  selector: 'app-order',
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
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
})
export class OrderComponent implements OnInit {
  displayedColumns: string[] = [
    'index',
    'OrderID',
    'CustomerName',
    'Freight',
    'Summary',
    'OrderDate',
    'ShippedDate',
    'RequiredDate',
    'ShipName',
  ];
  readonly #apisService = inject(ApisService);
  readonly #dialog = inject(MatDialog); 
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  orders: Order[] = [];
  selectedFaculty: string | null = null;
  searchText: string = '';
  loading: boolean = true;
  customerMap: Map<string, string> = new Map();

  onSearch(): void {
    console.log('Search Text:', this.searchText);

    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }

  ngOnInit() {
    this.featCustomerData();
    this.featOrderData();
  }

  onRowClicked(row: any): void {
    this.openOrderDialog(row.OrderID);
  }
  
  openOrderDialog(orderID: any): void {
    const dialogRef = this.#dialog.open(OrderDialogComponent, {
      width: '500px', 
      data: { OrderID: orderID },
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog was closed', result);
    });
  }
  
  featOrderData() {
    this.loading = true;
    this.#apisService.getOrders().subscribe({
      next: (orders) => {
        if (Array.isArray(orders)) {
          this.orders = orders
          .map((order) => ({
            ...order,
            ContactName: this.customerMap.get(order.CustomerID) || 'Unknown Customer',
          }))
          .sort((a, b) => {
            const dateA = new Date(a.OrderDate);
            const dateB = new Date(b.OrderDate);
            return dateA.getTime() - dateB.getTime(); 
          });
          this.dataSource.data = this.orders;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          //console.log('Products:', this.orders);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching orders:', error);
        this.loading = false;
      },
    });
  }

  featCustomerData() {
    this.loading = true;
    this.#apisService.getCustomers().subscribe({
      next: (customers) => {
        if (Array.isArray(customers)) {
          this.customerMap = new Map(
            customers.map((customer) => [customer.CustomerID, customer.ContactName])
          );
        } else {
          console.log('No customers data available');
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching customers:', error);
        this.loading = false;
      },
    });
  }
}
