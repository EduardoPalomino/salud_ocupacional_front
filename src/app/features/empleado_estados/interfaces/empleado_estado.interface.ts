import { Empresa } from '../../empresas/interfaces/empresa.interface';
  export interface Empleado_estado {
  _id: string;
  key:number;
  nombre: string;
  color: string;
  empresa: Empresa;
  created_at: string;
  updated_at: string;
 }
