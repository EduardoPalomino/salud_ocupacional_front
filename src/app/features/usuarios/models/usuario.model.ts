import { Rol } from '../../rols/interfaces/rol.interface';
import { Empresa } from '../../empresas/interfaces/empresa.interface';
import { Usuario } from '../interfaces/usuario.interface';

export class UsuarioModel implements Usuario {
  _id = '';
  key:number = 0;
  nombre= '';
  apellido= '';
  email= '';
  user= '';
  password= '';
  archivo= '';
  rol: Rol= {} as Rol;
  empresa: Empresa= {} as Empresa;
  created_at = '';
  updated_at = '';

  constructor(data?: Partial<Usuario>) {
    Object.assign(this, data);
  }
}