import { Menu } from '../../shared/models/menu.model';

export const HOME_MENU: Menu[] = [
  {
    name: '',
    children: [
      {
        name: 'Dashboard',
        path: '/dashboard',
        icon: { name: 'dashboard' },
      },
      {
        name: 'Order',
        path: '/order',
        icon: { name: 'list_alt' },
      },
      {
        name: 'Product',
        path: '/product',
        icon: { name: 'category_search' },
      },
      {
        name: 'Employee',
        path: '/employee',
        icon: { name: 'groups' },
      }
    ],
  },
];