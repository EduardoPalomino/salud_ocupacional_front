import { Empleado } from '../../empleados/interfaces/empleado.interface';
import { Empresa } from '../../empresas/interfaces/empresa.interface';
import { Empleado_archivo } from '../interfaces/empleado_archivo.interface';

export class Empleado_archivoModel implements Empleado_archivo {
  _id = '';
  key:number = 0;
  empleado: Empleado= {} as Empleado;
  nombre_archivo= '';
  tipo_archivo= '';
  subido_por= '';
  empresa: Empresa= {} as Empresa;
  created_at = '';
  updated_at = '';

  constructor(data?: Partial<Empleado_archivo>) {
    Object.assign(this, data);
  }
}