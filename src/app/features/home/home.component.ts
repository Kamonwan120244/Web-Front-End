import { Component } from '@angular/core';
import { LayoutWithNavbarComponent } from '../../shared/layouts/layout-with-navbar/layout-with-navbar.component';
import { HOME_MENU } from '../../core/data/menu.data';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, LayoutWithNavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  drawer_menus = HOME_MENU;
}
