import { Empleado_cargo } from '../../empleado_cargos/interfaces/empleado_cargo.interface';
import { Empleado_estado } from '../../empleado_estados/interfaces/empleado_estado.interface';
import { Empresa } from '../../empresas/interfaces/empresa.interface';
import { Empleado } from '../interfaces/empleado.interface';

export class EmpleadoModel implements Empleado {
  _id = '';
  key:number = 0;
  nombre= '';
  paterno= '';
  materno= '';
  dni= '';
  genero= '';
  empleado_cargo: Empleado_cargo= {} as Empleado_cargo;
  empleado_estado: Empleado_estado= {} as Empleado_estado;
  fecha_nacimiento= '';
  empresa: Empresa= {} as Empresa;
  created_at = '';
  updated_at = '';

  constructor(data?: Partial<Empleado>) {
    Object.assign(this, data);
  }
}