import { Acceso } from '../interfaces/acceso.interface';

export class AccesoModel implements Acceso {
  _id = '';
  rol_id = '';
  page = '';
  created_at = '';
  updated_at = '';

  constructor(data?: Partial<Acceso>) {
    Object.assign(this, data);
  }
}