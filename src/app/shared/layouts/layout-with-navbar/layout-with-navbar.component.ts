
import { Component, inject, input, booleanAttribute} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { RouterOutlet } from '@angular/router';
import { Menu } from '../../models/menu.model';
import { DOCUMENT } from '@angular/common';
import { NavDrawerComponent } from '../../components/nav-drawer/nav-drawer.component';

@Component({
  selector: 'app-layout-with-navbar',
  templateUrl: './layout-with-navbar.component.html',
  styleUrl: './layout-with-navbar.component.scss',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    RouterOutlet,
    NavDrawerComponent,
  ]
})
export class LayoutWithNavbarComponent {
  drawer_menus = input<Menu[]>([]);
  showSideSheet = input(false, {transform: booleanAttribute});
  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
}