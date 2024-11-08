import { Component, inject, AfterViewInit, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DatePipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApisService } from '../../../shared/services/api/apis.service';
import { Employee } from '../../../shared/models/employee.model';

@Component({
  selector: 'app-employee',
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
  ],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
})
export class EmployeeComponent implements OnInit {
  readonly #apisService = inject(ApisService);
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  searchText: string = '';
  expandedEmployee: number | null = null;
  loading: boolean = true; 

  onSearch(): void {
    //console.log('Search Text:', this.searchText);
    if (this.searchText) {
      this.filteredEmployees = this.employees.filter((employee) => {
        return (
          employee.FirstName.toLowerCase().includes(
            this.searchText.toLowerCase()
          ) ||
          employee.LastName.toLowerCase().includes(
            this.searchText.toLowerCase()
          ) ||
          employee.Title.toLowerCase().includes(
            this.searchText.toLowerCase()
          ) ||
          employee.Address.toLowerCase().includes(
            this.searchText.toLowerCase()
          ) ||
          employee.Region.toLowerCase().includes(this.searchText.toLowerCase())
        );
      });
    } else {
      this.filteredEmployees = [...this.employees];
    }
  }

  showDetails(index: number): void {
    if (this.expandedEmployee === index) {
      this.expandedEmployee = null;
    } else {
      this.expandedEmployee = index;
    }
  }

  ngOnInit() {
    this.featEmployeeData();
  }

  featEmployeeData() {
    this.loading = true; 
    this.#apisService.getEmployees().subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          this.employees = response;
          this.filteredEmployees = [...this.employees];
          //console.log('Employees:', this.employees);
        } else {
          console.log('No employee data available');
        }
        this.loading = false; 
      },
      error: (error) => {
        console.error('Error fetching employees:', error);
        this.loading = false; 
      },
    });
  }
}
