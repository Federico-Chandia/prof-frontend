export interface User {
  id: string;
  _id?: string;
  planActual?: 'basico' | 'premium' | 'profesional';
  nombre: string;
  email: string;
  telefono?: string;
  direccion?: {
    calle: string;
    barrio: string;
    ciudad: string;
    provincia: string;
    coordenadas?: {
      lat: number;
      lng: number;
    };
  };
  rol: 'cliente' | 'profesional' | 'admin';
  avatar?: string;
  verificado: boolean;
  activo: boolean;
  tokens?: {
    disponibles: number;
    plan: 'basico' | 'premium' | 'profesional';
    renovacion?: string;
  };
  genero?: 'masculino' | 'femenino' | 'otro' | 'prefiero_no_decir';
  preferenciaCliente?: 'sin_preferencia' | 'solo_mujeres' | 'solo_hombres';
  tokenVersion?: number;
}

export interface RegisterData {
  nombre: string;
  email: string;
  password: string;
  telefono?: string;
  rol: 'cliente' | 'profesional';
  direccion?: {
    calle: string;
    barrio: string;
    ciudad: string;
    provincia: string;
  };
  genero?: 'masculino' | 'femenino' | 'otro' | 'prefiero_no_decir';
  preferenciaCliente?: 'sin_preferencia' | 'solo_mujeres' | 'solo_hombres';
}