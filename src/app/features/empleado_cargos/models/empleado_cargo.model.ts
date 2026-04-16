import { Empresa } from '../../empresas/interfaces/empresa.interface';
import { Empleado_cargo } from '../interfaces/empleado_cargo.interface';

export class Empleado_cargoModel implements Empleado_cargo {
  _id = '';
  key:number = 0;
  descripcion= '';
  empresa: Empresa= {} as Empresa;
  created_at = '';
  updated_at = '';

  constructor(data?: Partial<Empleado_cargo>) {
    Object.assign(this, data);
  }
}