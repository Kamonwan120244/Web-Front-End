import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductComponent } from './product/product.component';
import { EmployeeComponent } from './employee/employee.component';
import { OrderComponent } from './order/order.component';

export const HOME_ROUTES: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'order',
        component: OrderComponent,
      },
      {
        path: 'product',
        component: ProductComponent,
      },
      {
        path: 'employee',
        component: EmployeeComponent,
      },
    ],
  },
];
