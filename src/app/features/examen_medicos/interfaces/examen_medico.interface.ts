import { Empleado } from '../../empleados/interfaces/empleado.interface';
import { Empresa } from '../../empresas/interfaces/empresa.interface';
  export interface Examen_medico {
  _id: string;
  key:number;
  empleado: Empleado;
  tipo_examen: string;
  estado: string;
  creado_por: string;
  fecha_examen: string;
  empresa: Empresa;
  created_at: string;
  updated_at: string;
 }