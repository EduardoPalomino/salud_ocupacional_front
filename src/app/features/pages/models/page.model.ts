import { Empresa } from '../../empresas/interfaces/empresa.interface';
import { Page } from '../interfaces/page.interface';

export class PageModel implements Page {
  _id = '';
  key:number = 0;
  order= '';
  ruta= '';
  nombre= '';
  nombre= '';
  icon= '';
  empresa: Empresa= {} as Empresa;
  created_at = '';
  updated_at = '';

  constructor(data?: Partial<Page>) {
    Object.assign(this, data);
  }
}
