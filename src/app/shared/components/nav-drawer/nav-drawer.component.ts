import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import {
  MatListItem,
  MatListItemIcon,
  MatListSubheaderCssMatStyler,
  MatNavList,
} from '@angular/material/list';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Menu } from '../../models/menu.model';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-nav-drawer',
  standalone: true,
  imports: [
    MatListItem,
    MatListItemIcon,
    MatNavList,
    MatToolbar,
    MatListSubheaderCssMatStyler,
    RouterLink,
    RouterLinkActive,
    MatIcon,
    NgOptimizedImage,
    MatDividerModule,
    CommonModule,
  ],
  templateUrl: './nav-drawer.component.html',
  styleUrl: './nav-drawer.component.scss',
})
export class NavDrawerComponent {
  menus = input<Menu[]>([]);
}
