import { Empresa } from '../../empresas/interfaces/empresa.interface';
  export interface Page {
  _id: string;
  key:number;
  order: string;
  ruta: string;
  nombre: string;
  nombre: string;
  icon: string;
  empresa: Empresa;
  created_at: string;
  updated_at: string;
 }
