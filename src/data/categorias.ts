export interface Subcategoria {
  key: string;
  label: string;
}

export interface Categoria {
  key: string; // slug used in query params / backend profession
  label: string;
  icon: string;
  subcategorias: Subcategoria[];
}

const CATEGORIAS: Categoria[] = [
  {
    key: 'plomero',
    label: 'Plomería',
    icon: '🔧',
    subcategorias: [
      { key: 'perdidas', label: 'Pérdidas de agua' },
      { key: 'destapaciones', label: 'Destapaciones' },
      { key: 'reparacion-cananerias', label: 'Reparación de cañerías' },
      { key: 'termo-tanques', label: 'Termotanques' },
      { key: 'griferia', label: 'Grifería' },
      { key: 'sanitarios', label: 'Sanitarios' }
    ]
  },
  {
    key: 'electricista',
    label: 'Electricidad',
    icon: '⚡',
    subcategorias: [
      { key: 'cortes', label: 'Cortes de luz' },
      { key: 'instalaciones', label: 'Instalaciones eléctricas' },
      { key: 'cortocircuitos', label: 'Cortocircuitos' },
      { key: 'tableros', label: 'Tableros eléctricos' },
      { key: 'iluminacion', label: 'Iluminación' }
    ]
  },
  {
    key: 'gasista',
    label: 'Gas',
    icon: '🔥',
    subcategorias: [
      { key: 'instalaciones', label: 'Instalaciones' },
      { key: 'reparaciones', label: 'Reparaciones' },
      { key: 'perdidas-gas', label: 'Pérdidas de gas' },
      { key: 'revision', label: 'Revisión de seguridad' },
      { key: 'calderas', label: 'Calderas' }
    ]
  },
  {
    key: 'cerrajero',
    label: 'Cerrajería',
    icon: '🔐',
    subcategorias: [
      { key: 'apertura', label: 'Apertura de puertas' },
      { key: 'cambio-cerraduras', label: 'Cambio de cerraduras' },
      { key: 'llaves-perdidas', label: 'Llaves perdidas' },
      { key: 'cerraduras-seguridad', label: 'Cerraduras de seguridad' }
    ]
  },
  {
    key: 'albanil',
    label: 'Albañilería',
    icon: '🧱',
    subcategorias: [
      { key: 'reparaciones-generales', label: 'Reparaciones generales' },
      { key: 'revoques', label: 'Revoques' },
      { key: 'humedad', label: 'Humedad' },
      { key: 'pequenas-obras', label: 'Pequeñas obras' }
    ]
  },
  {
    key: 'aire-acondicionado',
    label: 'Aire acondicionado & calefacción',
    icon: '❄️',
    subcategorias: [
      { key: 'instalacion', label: 'Instalación' },
      { key: 'reparacion', label: 'Reparación' },
      { key: 'carga-gas', label: 'Carga de gas' },
      { key: 'mantenimiento', label: 'Mantenimiento' }
    ]
  },
  {
    key: 'pintor',
    label: 'Pintura',
    icon: '🎨',
    subcategorias: [
      { key: 'pintura-interiores', label: 'Pintura interiores' },
      { key: 'pintura-exteriores', label: 'Pintura exteriores' },
      { key: 'barnizado', label: 'Barnizado' }
    ]
  }
];

export default CATEGORIAS;
