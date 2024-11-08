import { Icon } from './icon.model';

export interface Menu {
  name: string;
  icon?: Icon;
  path?: string;
  children?: Menu[];
}
