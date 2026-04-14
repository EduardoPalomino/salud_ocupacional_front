import { Empleado_cargo } from '../../empleado_cargos/interfaces/empleado_cargo.interface';
import { Empleado_estado } from '../../empleado_estados/interfaces/empleado_estado.interface';
import { Empresa } from '../../empresas/interfaces/empresa.interface';
  export interface Empleado {
  _id: string;
  key:number;
  nombre: string;
  paterno: string;
  materno: string;
  dni: string;
  genero: string;
  empleado_cargo: Empleado_cargo;
  empleado_estado: Empleado_estado;
  fecha_nacimiento: string;
  empresa: Empresa;
  created_at: string;
  updated_at: string;
 }