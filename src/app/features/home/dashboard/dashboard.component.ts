import {
  Component,
  inject,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { AsyncPipe } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApisService } from '../../../shared/services/api/apis.service';
import { Order } from '../../../shared/models/order.model';
import { Chart, registerables } from 'chart.js';
import { DecimalPipe } from '@angular/common';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  standalone: true,
  imports: [
    AsyncPipe,
    MatGridListModule,
    MatFormFieldModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    CommonModule,
    CurrencyPipe,
    FormsModule,
    MatProgressSpinnerModule,
    DecimalPipe,
  ],
})
export class DashboardComponent implements AfterViewInit {
  readonly #apisService = inject(ApisService);
  @ViewChild('chartCanvas') chartRef!: ElementRef<HTMLCanvasElement>;
  orders: Order[] = [];
  filteredOrders: any[] = [];
  totalIncome = 0;
  totalPriceFiltered = 0;
  loading: boolean = true;
  chart: Chart | undefined;
  selectedDay: string | null = null;
  selectedMonth: string | null = null;
  selectedYear: string | null = null;
  orderDoughnutChart: any;
  orderDoughnutCounts: number[] = [];

  dayOptions: string[] = Array.from({ length: 31 }, (_, i) =>
    (i + 1).toString().padStart(2, '0')
  );
  monthOptions: string[] = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
  ];
  yearOptions: string[] = ['1995', '1996', '1997', '1998', '1999', '2000'];

  applyFilters() {
    if (this.selectedDay && this.selectedMonth && this.selectedYear) {
      const filterDate = `${this.selectedYear}-${this.selectedMonth}-${this.selectedDay}`;

      this.filteredOrders = this.orders.filter(
        (item) => item.OrderDate === filterDate
      );
      this.totalPriceFiltered = this.filteredOrders.reduce(
        (acc, order) => acc + order.UnitPrice * order.Quantity,
        0
      );
    } else if (this.selectedMonth && this.selectedYear) {
      const filterDate = `${this.selectedYear}-${this.selectedMonth}`;

      this.filteredOrders = this.orders.filter(
        (item) => item.OrderDate.startsWith(filterDate)
      );
      this.totalPriceFiltered = this.filteredOrders.reduce(
        (acc, order) => acc + order.UnitPrice * order.Quantity,
        0
      );
    } else if (this.selectedYear) {
      const filterDate = this.selectedYear;

      this.filteredOrders = this.orders.filter(
        (item) => item.OrderDate.startsWith(filterDate) 
      );
      this.totalPriceFiltered = this.filteredOrders.reduce(
        (acc, order) => acc + order.UnitPrice * order.Quantity,
        0
      );
    } else if (this.selectedMonth) {
      const filterDate = `${this.selectedYear}-${this.selectedMonth}-${this.selectedDay}`;
      this.filteredOrders = this.orders.filter(
        (item) => item.OrderDate === filterDate
      );
      this.totalPriceFiltered = this.filteredOrders.reduce(
        (acc, order) => acc + order.UnitPrice * order.Quantity,
        0
      );
    }

    this.orderDoughnutCounts = [this.totalPriceFiltered, this.totalIncome];
    console.log(
      '🚀 ~ DashboardComponent ~ applyFilters ~  this.orderDoughnutCounts:',
      this.orderDoughnutCounts
    );
    this.createOrderDoughnutChart(this.orderDoughnutCounts);
  }

  clearSelectedDay(): void {
    this.selectedDay = null;
    this.filteredOrders = [...this.orders];
  }

  clearSelectedMonth(): void {
    this.selectedMonth = null;
    this.filteredOrders = [...this.orders];
  }

  clearSelectedYear(): void {
    this.selectedYear = null;
    this.filteredOrders = [...this.orders];
  }

  ngAfterViewInit() {
    this.featOrderData();
  }

  featOrderData() {
    this.loading = true;
    this.#apisService.getOrders().subscribe({
      next: (orders) => {
        console.log('Received Orders:', orders);
        const totalPayment = Array.isArray(orders)
          ? orders.reduce(
              (acc, order) => acc + order.UnitPrice * order.Quantity,
              0
            )
          : 0;
        this.totalIncome = totalPayment;
        //this.totalPriceFiltered = totalPayment;

        this.orderDoughnutCounts = [this.totalPriceFiltered, this.totalIncome];
        this.createOrderDoughnutChart(this.orderDoughnutCounts);

        if (Array.isArray(orders)) {
          this.orders = orders;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching orders:', error);
        this.loading = false;
      },
    });
  }

  createOrderDoughnutChart(counts: number[]) {
    const orderDoughnutCtx = document.getElementById(
      'orderDoughnutChart'
    ) as HTMLCanvasElement;

    if (!orderDoughnutCtx) {
      console.error('Canvas element not found!');
      return;
    }

    if (this.orderDoughnutChart) {
      this.orderDoughnutChart.destroy();
    }

    try {
      this.orderDoughnutChart = new Chart(orderDoughnutCtx, {
        type: 'doughnut',
        data: {
          labels: ['Total Price (filter)', 'Total Price'],
          datasets: [
            {
              label: 'Amount ($)',
              data: counts,
              backgroundColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(153, 102, 255, 1)',
              ],
              borderColor: 'rgba(255, 255, 255, 1.0)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                font: {
                  size: 14,
                },
                padding: 16,
                boxWidth: 20,
                usePointStyle: true,
              },
            },
          },
        },
      });
    } catch (error) {
      console.error('Failed to create chart:', error);
    }
  }
}
