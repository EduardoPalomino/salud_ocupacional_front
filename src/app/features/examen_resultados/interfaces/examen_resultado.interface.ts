import { Examen_medico } from '../../examen_medicos/interfaces/examen_medico.interface';
import { Empresa } from '../../empresas/interfaces/empresa.interface';
  export interface Examen_resultado {
  _id: string;
  key:number;
  examen_medico: Examen_medico;
  nombre: string;
  resultado: string;
  empresa: Empresa;
  created_at: string;
  updated_at: string;
 }