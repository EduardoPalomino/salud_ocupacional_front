
import { Empresa } from '../interfaces/empresa.interface';

export class EmpresaModel implements Empresa {
  _id = '';
  key:number = 0;
  nombre= '';
  ruc= '';
  direccion= '';
  telefono= '';
  email= '';
  estado= '';
  created_at = '';
  updated_at = '';

  constructor(data?: Partial<Empresa>) {
    Object.assign(this, data);
  }
}