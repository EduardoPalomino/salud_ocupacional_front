import { Empresa } from '../../empresas/interfaces/empresa.interface';
  export interface Rol {
  _id: string;
  key:number;
  descripcion: string;
  empresa: Empresa;
  created_at: string;
  updated_at: string;
 }