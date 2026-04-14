import { Empleado } from '../../empleados/interfaces/empleado.interface';
import { Empresa } from '../../empresas/interfaces/empresa.interface';
  export interface Empleado_archivo {
  _id: string;
  key:number;
  empleado: Empleado;
  nombre_archivo: string;
  tipo_archivo: string;
  subido_por: string;
  empresa: Empresa;
  created_at: string;
  updated_at: string;
 }