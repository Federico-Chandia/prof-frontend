export interface Subcategoria {
  key: string;
  label: string;
}

export interface Categoria {
  key: string;
  label: string;
  icon: string;
  subcategorias: Subcategoria[];
}

const CATEGORIAS_V2: Categoria[] = [
  {
    key: 'construccion-oficios',
    label: 'Construcción y Oficios',
    icon: '🏗️',
    subcategorias: [
      { key: 'albañil', label: 'Albañil' },
      { key: 'constructor-general', label: 'Constructor general' },
      { key: 'maestro-mayor-obras', label: 'Maestro mayor de obras' },
      { key: 'arquitecto', label: 'Arquitecto' },
      { key: 'ingeniero-civil', label: 'Ingeniero civil' },
      { key: 'electricista', label: 'Electricista' },
      { key: 'instalador-electrico-matriculado', label: 'Instalador eléctrico matriculado' },
      { key: 'cerrajero', label: 'Cerrajero' },
      { key: 'plomero', label: 'Plomero' },
      { key: 'gasista', label: 'Gasista' },
      { key: 'gasista-matriculado', label: 'Gasista matriculado' },
      { key: 'carpintero', label: 'Carpintero' },
      { key: 'carpintero-obra', label: 'Carpintero de obra' },
      { key: 'carpintero-muebles', label: 'Carpintero de muebles' },
      { key: 'yesero', label: 'Yesero' },
      { key: 'pintor', label: 'Pintor' },
      { key: 'pintor-industrial', label: 'Pintor industrial' },
      { key: 'techista', label: 'Techista' },
      { key: 'herrero', label: 'Herrero' },
      { key: 'soldador', label: 'Soldador' },
      { key: 'ceramista', label: 'Ceramista' },
      { key: 'colocador-porcelanato', label: 'Colocador de porcelanato' },
      { key: 'parquetero', label: 'Parquetero' },
      { key: 'instalador-durlock', label: 'Instalador de durlock' },
      { key: 'instalador-aire-acondicionado', label: 'Instalador de aire acondicionado' },
      { key: 'refrigerista', label: 'Refrigerista' },
      { key: 'instalador-calefaccion', label: 'Instalador de calefacción' },
      { key: 'vidriero', label: 'Vidriero' },
      { key: 'colocador-ventanas', label: 'Colocador de ventanas' },
      { key: 'albañil-microcemento', label: 'Albañil para microcemento' },
      { key: 'especialista-impermeabilizacion', label: 'Especialista en impermeabilización' },
      { key: 'topografo', label: 'Topógrafo' },
      { key: 'operario-obra', label: 'Operario de obra' },
      { key: 'maestro-plomero', label: 'Maestro plomero' },
      { key: 'maestro-electricista', label: 'Maestro electricista' },
      { key: 'techista-especializado', label: 'Techista especializado' },
      { key: 'pintor-altura', label: 'Pintor en altura' },
      { key: 'montador-estructuras', label: 'Montador de estructuras' },
      { key: 'instalador-energias-renovables', label: 'Instalador de energías renovables' }
    ]
  },
  {
    key: 'servicios-hogar',
    label: 'Servicios del Hogar',
    icon: '🏠',
    subcategorias: [
      { key: 'limpieza-general', label: 'Limpieza general' },
      { key: 'limpieza-profunda', label: 'Limpieza profunda' },
      { key: 'niñera', label: 'Niñera' },
      { key: 'cuidador-adulto-mayor', label: 'Cuidador de adulto mayor' },
      { key: 'control-plagas', label: 'Control de plagas' },
      { key: 'tecnico-electrodomesticos', label: 'Técnico en electrodomésticos' },
      { key: 'reparador-lavarropas', label: 'Reparador de lavarropas' },
      { key: 'reparador-heladeras', label: 'Reparador de heladeras' },
      { key: 'reparador-cocinas', label: 'Reparador de cocinas' },
      { key: 'mudanzas', label: 'Mudanzas' },
      { key: 'fletes', label: 'Fletes' },
      { key: 'armador-muebles', label: 'Armador de muebles' },
      { key: 'instalador-tv', label: 'Instalador de TV' },
      { key: 'instalador-cortinas', label: 'Instalador de cortinas' },
      { key: 'lavado-alfombras', label: 'Lavado de alfombras' },
      { key: 'lavado-tapizados', label: 'Lavado de tapizados' },
      { key: 'servicio-emergencias-domiciliarias', label: 'Servicio de emergencias domiciliarias' }
    ]
  },
  {
    key: 'educacion-tutorias',
    label: 'Educación y Tutorías',
    icon: '📚',
    subcategorias: [
      { key: 'profesor-matematicas', label: 'Profesor de matemáticas' },
      { key: 'profesor-lengua', label: 'Profesor de lengua' },
      { key: 'profesor-ingles', label: 'Profesor de inglés' },
      { key: 'profesor-frances', label: 'Profesor de francés' },
      { key: 'profesor-italiano', label: 'Profesor de italiano' },
      { key: 'profesor-aleman', label: 'Profesor de alemán' },
      { key: 'profesor-portugues', label: 'Profesor de portugués' },
      { key: 'tutor-primario', label: 'Tutor escolar primario' },
      { key: 'tutor-secundario', label: 'Tutor escolar secundario' },
      { key: 'tutor-universitario', label: 'Tutor universitario' },
      { key: 'clases-particulares', label: 'Clases particulares' },
      { key: 'preparador-examenes', label: 'Preparador de exámenes' },
      { key: 'profesor-musica', label: 'Profesor de música' },
      { key: 'profesor-guitarra', label: 'Profesor de guitarra' },
      { key: 'profesor-piano', label: 'Profesor de piano' },
      { key: 'profesor-canto', label: 'Profesor de canto' },
      { key: 'profesor-danza', label: 'Profesor de danza' },
      { key: 'profesor-arte', label: 'Profesor de arte' },
      { key: 'profesor-educacion-fisica', label: 'Profesor de educación física' },
      { key: 'educador-especial', label: 'Educador especial' },
      { key: 'psicopedagogo', label: 'Psicopedagogo' },
      { key: 'maestra-jardinera', label: 'Maestra jardinera' },
      { key: 'bibliotecario', label: 'Bibliotecario' },
      { key: 'investigador-academico', label: 'Investigador académico' }
    ]
  },
  {
    key: 'marketing-publicidad',
    label: 'Marketing y Publicidad',
    icon: '📢',
    subcategorias: [
      { key: 'community-manager', label: 'Community manager' },
      { key: 'especialista-redes-sociales', label: 'Especialista en redes sociales' },
      { key: 'marketing-digital', label: 'Marketing digital' },
      { key: 'analista-seo', label: 'Analista SEO' },
      { key: 'analista-sem', label: 'Analista SEM' },
      { key: 'gestor-campanas', label: 'Gestor de campañas' },
      { key: 'copywriter', label: 'Copywriter' },
      { key: 'content-creator', label: 'Content creator' },
      { key: 'productor-audiovisual', label: 'Productor audiovisual' },
      { key: 'fotografo', label: 'Fotógrafo' },
      { key: 'videografo', label: 'Videógrafo' },
      { key: 'editor-video', label: 'Editor de video' },
      { key: 'brand-manager', label: 'Brand manager' },
      { key: 'publicidad-tradicional', label: 'Publicidad tradicional' },
      { key: 'growth-hacker', label: 'Growth hacker' }
    ]
  },
  {
    key: 'diseño-creatividad',
    label: 'Diseño y Creatividad',
    icon: '🎨',
    subcategorias: [
      { key: 'diseñador-grafico', label: 'Diseñador gráfico' },
      { key: 'ilustrador', label: 'Ilustrador' },
      { key: 'animador-2d', label: 'Animador 2D' },
      { key: 'animador-3d', label: 'Animador 3D' },
      { key: 'modelador-3d', label: 'Modelador 3D' },
      { key: 'diseñador-industrial', label: 'Diseñador industrial' },
      { key: 'diseñador-modas', label: 'Diseñador de modas' },
      { key: 'diseñador-interiores', label: 'Diseñador de interiores' },
      { key: 'diseñador-editorial', label: 'Diseñador editorial' },
      { key: 'director-arte', label: 'Director de arte' },
      { key: 'fotografo-artistico', label: 'Fotógrafo artístico' },
      { key: 'escultor', label: 'Escultor' }
    ]
  },
  {
    key: 'gastronomia-cocina',
    label: 'Gastronomía y Cocina',
    icon: '👨‍🍳',
    subcategorias: [
      { key: 'chef', label: 'Chef' },
      { key: 'cocinero', label: 'Cocinero' },
      { key: 'ayudante-cocina', label: 'Ayudante de cocina' },
      { key: 'pastelero', label: 'Pastelero' },
      { key: 'panadero', label: 'Panadero' },
      { key: 'repostero', label: 'Repostero' },
      { key: 'bartender', label: 'Bartender' },
      { key: 'barista', label: 'Barista' },
      { key: 'sommelier', label: 'Sommelier' },
      { key: 'catering', label: 'Catering' },
      { key: 'organizador-gastronomico', label: 'Organizador gastronómico' }
    ]
  },
  {
    key: 'deportes-fitness',
    label: 'Deportes y Fitness',
    icon: '💪',
    subcategorias: [
      { key: 'entrenador-personal', label: 'Entrenador personal' },
      { key: 'preparador-fisico', label: 'Preparador físico' },
      { key: 'profesor-gimnasia', label: 'Profesor de gimnasia' },
      { key: 'instructor-yoga', label: 'Instructor de yoga' },
      { key: 'instructor-pilates', label: 'Instructor de pilates' },
      { key: 'entrenador-funcional', label: 'Entrenador funcional' },
      { key: 'profesor-natacion', label: 'Profesor de natación' },
      { key: 'kinesiologo-deportivo', label: 'Kinesiólogo deportivo' },
      { key: 'masajista-deportivo', label: 'Masajista deportivo' }
    ]
  },
  {
    key: 'belleza-estetica',
    label: 'Belleza y Estética',
    icon: '💄',
    subcategorias: [
      { key: 'peluquero', label: 'Peluquero' },
      { key: 'estilista', label: 'Estilista' },
      { key: 'maquillador', label: 'Maquillador' },
      { key: 'manicura', label: 'Manicura' },
      { key: 'pedicura', label: 'Pedicura' },
      { key: 'cosmetologa', label: 'Cosmetóloga' },
      { key: 'depiladora', label: 'Depiladora' },
      { key: 'lashista', label: 'Lashista' },
      { key: 'barbero', label: 'Barbero' },
      { key: 'masajista', label: 'Masajista' },
      { key: 'tatuador', label: 'Tatuador' },
      { key: 'piercer', label: 'Piercer' }
    ]
  },
  {
    key: 'veterinaria-animal',
    label: 'Veterinaria y Cuidado Animal',
    icon: '🐾',
    subcategorias: [
      { key: 'veterinario', label: 'Veterinario' },
      { key: 'auxiliar-veterinario', label: 'Auxiliar veterinario' },
      { key: 'peluquero-canino', label: 'Peluquero canino' },
      { key: 'entrenador-perros', label: 'Entrenador de perros' },
      { key: 'paseador-perros', label: 'Paseador de perros' },
      { key: 'cuidador-mascotas', label: 'Cuidador de mascotas' }
    ]
  },
  {
    key: 'transporte-logistica',
    label: 'Transporte y Logística',
    icon: '🚚',
    subcategorias: [
      { key: 'chofer-particular', label: 'Chofer particular' },
      { key: 'chofer-profesional', label: 'Chofer profesional' },
      { key: 'fletero', label: 'Fletero' },
      { key: 'transportista', label: 'Transportista' },
      { key: 'motoquero', label: 'Motoquero' },
      { key: 'repartidor', label: 'Repartidor' },
      { key: 'logistica', label: 'Logística' },
      { key: 'operador-deposito', label: 'Operador de depósito' }
    ]
  },
  {
    key: 'servicios-rurales-agro',
    label: 'Servicios Rurales y Agro',
    icon: '🌾',
    subcategorias: [
      { key: 'ingeniero-agronomo', label: 'Ingeniero agrónomo' },
      { key: 'veterinario-rural', label: 'Veterinario rural' },
      { key: 'peon-rural', label: 'Peón rural' },
      { key: 'capataz', label: 'Capatáz' },
      { key: 'maquinista-agricola', label: 'Maquinista agrícola' },
      { key: 'aplicador-agroquimicos', label: 'Aplicador de agroquímicos' },
      { key: 'clasificador-granos', label: 'Clasificador de granos' },
      { key: 'esquila', label: 'Esquila' },
      { key: 'arreo', label: 'Arreo' },
      { key: 'tareas-campo', label: 'Tareas de campo' }
    ]
  },
  {
    key: 'limpieza-higiene',
    label: 'Limpieza e Higiene',
    icon: '🧹',
    subcategorias: [
      { key: 'limpieza-casas', label: 'Limpieza de casas' },
      { key: 'limpieza-oficinas', label: 'Limpieza de oficinas' },
      { key: 'limpieza-industrial', label: 'Limpieza industrial' },
      { key: 'limpieza-vidrios-altura', label: 'Limpieza de vidrios en altura' },
      { key: 'limpieza-hospitales', label: 'Limpieza de hospitales' },
      { key: 'limpieza-post-obra', label: 'Limpieza post obra' }
    ]
  },
  {
    key: 'seguridad-vigilancia',
    label: 'Seguridad y Vigilancia',
    icon: '🔐',
    subcategorias: [
      { key: 'vigilador', label: 'Vigilador' },
      { key: 'seguridad-privada', label: 'Seguridad privada' },
      { key: 'custodio', label: 'Custodio' },
      { key: 'control-accesos', label: 'Control de accesos' },
      { key: 'monitoreo-cctv', label: 'Monitoreo CCTV' },
      { key: 'prevencion-perdidas', label: 'Prevención de pérdidas' }
    ]
  },
  {
    key: 'inmobiliario-construccion-ligera',
    label: 'Inmobiliario y Construcción Ligera',
    icon: '🏢',
    subcategorias: [
      { key: 'agente-inmobiliario', label: 'Agente inmobiliario' },
      { key: 'tasador', label: 'Tasador' },
      { key: 'home-staging', label: 'Home staging' },
      { key: 'decorador', label: 'Decorador' },
      { key: 'instalador-pisos', label: 'Instalador de pisos' },
      { key: 'colocador-vinilos', label: 'Colocador de vinilos' }
    ]
  },
  {
    key: 'arte-musica-entretenimiento',
    label: 'Arte, Música y Entretenimiento',
    icon: '🎭',
    subcategorias: [
      { key: 'musico', label: 'Músico' },
      { key: 'cantante', label: 'Cantante' },
      { key: 'dj', label: 'DJ' },
      { key: 'productor-musical', label: 'Productor musical' },
      { key: 'actor', label: 'Actor' },
      { key: 'artista-plastico', label: 'Artista plástico' },
      { key: 'payaso', label: 'Payaso' },
      { key: 'mago', label: 'Mago' },
      { key: 'animador-infantil', label: 'Animador infantil' },
      { key: 'bailarin', label: 'Bailarín' }
    ]
  },
  {
    key: 'eventos-organizacion',
    label: 'Eventos y Organización',
    icon: '🎉',
    subcategorias: [
      { key: 'organizador-eventos', label: 'Organizador de eventos' },
      { key: 'wedding-planner', label: 'Wedding planner' },
      { key: 'decorador-eventos', label: 'Decorador de eventos' },
      { key: 'tecnico-sonido', label: 'Técnico de sonido' },
      { key: 'tecnico-iluminacion', label: 'Técnico de iluminación' },
      { key: 'catering-eventos', label: 'Catering' },
      { key: 'fotografia-eventos', label: 'Fotografía de eventos' },
      { key: 'video-eventos', label: 'Video de eventos' }
    ]
  },
  {
    key: 'industria-manufactura',
    label: 'Industria y Manufactura',
    icon: '⚙️',
    subcategorias: [
      { key: 'operario-industrial', label: 'Operario industrial' },
      { key: 'tornero', label: 'Tornero' },
      { key: 'fresador', label: 'Fresador' },
      { key: 'operador-cnc', label: 'Operador CNC' },
      { key: 'serralero', label: 'Serralero' },
      { key: 'soldador-industrial', label: 'Soldador industrial' }
    ]
  },
  {
    key: 'servicios-salud-comunitarios',
    label: 'Servicios de Salud, Comunitarios y Sociales',
    icon: '❤️',
    subcategorias: [
      { key: 'acompañante-terapeutico', label: 'Acompañante terapéutico' },
      { key: 'cuidador-pacientes', label: 'Cuidador de pacientes' },
      { key: 'operador-socio-terapeutico', label: 'Operador socio-terapéutico' },
      { key: 'trabajador-social', label: 'Trabajador/a social' },
      { key: 'quiropráctico', label: 'Quiropráctico' },
      { key: 'acompañante-comunitario', label: 'Acompañante comunitario' },
      { key: 'cuidador-domiciliario', label: 'Cuidador domiciliario' },
      { key: 'voluntario-profesional', label: 'Voluntario profesional' },
      { key: 'mediador-comunitario', label: 'Mediador comunitario' }
    ]
  },
  {
    key: 'traduccion-idiomas-comunicacion',
    label: 'Traducción, Idiomas y Comunicación',
    icon: '🗣️',
    subcategorias: [
      { key: 'traductor', label: 'Traductor' },
      { key: 'interprete', label: 'Intérprete' },
      { key: 'corrector-textos', label: 'Corrector de textos' },
      { key: 'redactor-profesional', label: 'Redactor profesional' },
      { key: 'periodista', label: 'Periodista' },
      { key: 'locutor', label: 'Locutor' }
    ]
  }
];

export default CATEGORIAS_V2;
