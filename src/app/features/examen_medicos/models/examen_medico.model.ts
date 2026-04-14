import { Empleado } from '../../empleados/interfaces/empleado.interface';
import { Empresa } from '../../empresas/interfaces/empresa.interface';
import { Examen_medico } from '../interfaces/examen_medico.interface';

export class Examen_medicoModel implements Examen_medico {
  _id = '';
  key:number = 0;
  empleado: Empleado= {} as Empleado;
  tipo_examen= '';
  estado= '';
  creado_por= '';
  fecha_examen= '';
  empresa: Empresa= {} as Empresa;
  created_at = '';
  updated_at = '';

  constructor(data?: Partial<Examen_medico>) {
    Object.assign(this, data);
  }
}