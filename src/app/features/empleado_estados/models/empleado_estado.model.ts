import { Empresa } from '../../empresas/interfaces/empresa.interface';
import { Empleado_estado } from '../interfaces/empleado_estado.interface';

export class Empleado_estadoModel implements Empleado_estado {
  _id = '';
  key:number = 0;
  nombre= '';
  color= '';
  empresa: Empresa= {} as Empresa;
  created_at = '';
  updated_at = '';

  constructor(data?: Partial<Empleado_estado>) {
    Object.assign(this, data);
  }
}
