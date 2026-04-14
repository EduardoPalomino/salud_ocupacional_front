import { Empresa } from '../../empresas/interfaces/empresa.interface';
  export interface Rol {
  _id: string;
  key:number;
  nombre: string;
  empresa: Empresa;
  created_at: string;
  updated_at: string;
 }
