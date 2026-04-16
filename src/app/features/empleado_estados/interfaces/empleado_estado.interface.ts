import { Empresa } from '../../empresas/interfaces/empresa.interface';
  export interface Empleado_estado {
  _id: string;
  key:number;
  descripcion: string;
  color: string;
  empresa: Empresa;
  created_at: string;
  updated_at: string;
 }