import { Empresa } from '../../empresas/interfaces/empresa.interface';
import { Rol } from '../interfaces/rol.interface';

export class RolModel implements Rol {
  _id = '';
  key:number = 0;
  nombre= '';
  empresa: Empresa= {} as Empresa;
  created_at = '';
  updated_at = '';

  constructor(data?: Partial<Rol>) {
    Object.assign(this, data);
  }
}
