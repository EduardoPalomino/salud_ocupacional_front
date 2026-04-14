import { Rol } from '../../rols/interfaces/rol.interface';
import { Empresa } from '../../empresas/interfaces/empresa.interface';
  export interface Usuario {
  _id: string;
  key:number;
  nombre: string;
  apellido: string;
  email: string;
  user: string;
  password: string;
  archivo: string;
  rol: Rol;
  empresa: Empresa;
  created_at: string;
  updated_at: string;
 }