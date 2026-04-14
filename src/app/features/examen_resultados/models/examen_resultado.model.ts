import { Examen_medico } from '../../examen_medicos/interfaces/examen_medico.interface';
import { Empresa } from '../../empresas/interfaces/empresa.interface';
import { Examen_resultado } from '../interfaces/examen_resultado.interface';

export class Examen_resultadoModel implements Examen_resultado {
  _id = '';
  key:number = 0;
  examen_medico: Examen_medico= {} as Examen_medico;
  nombre= '';
  resultado= '';
  empresa: Empresa= {} as Empresa;
  created_at = '';
  updated_at = '';

  constructor(data?: Partial<Examen_resultado>) {
    Object.assign(this, data);
  }
}