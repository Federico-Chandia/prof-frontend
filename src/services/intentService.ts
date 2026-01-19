import CATEGORIAS from '../data/categorias';

// Devuelve la categoria (key) y subcategoria (key) detectada a partir del texto libre
export const detectCategoriaFromText = (text: string): { categoriaKey?: string; subKey?: string } => {
  if (!text || !text.trim()) return {};
  const t = text.toLowerCase();

  // Palabras clave por categoría (simple heurístico MVP)
  const mapping: { [key: string]: string[] } = {
    plomero: ['pérdida', 'perdida', 'fuga', 'tubo', 'cañería', 'destap', 'destapación', 'termotanque', 'grifer', 'sanitario'],
    electricista: ['no hay luz', 'corte', 'cortocircuito', 'corriente', 'luz', 'tablero', 'enchufe', 'instalación eléctrica', 'bombilla', 'ilumin'],
    gasista: ['gas', 'olor a gas', 'pérdida de gas', 'fuga de gas', 'caldera', 'gasista'],
    cerrajero: ['llave', 'cerradura', 'cerrajo', 'abrir puerta', 'se trabó', 'se atascó'],
    albanil: ['huevo', 'revoque', 'revoques', 'humedad', 'pared', 'obra', 'albañil', 'reparación'],
    'aire-acondicionado': ['aire', 'split', 'capacity', 'carga de gas', 'climatización', 'calefacción'],
    pintor: ['pintura', 'pintar', 'pintor', 'barniz']
  };

  // Buscar coincidencia de categoría
  for (const [categoria, keys] of Object.entries(mapping)) {
    for (const k of keys) {
      if (t.includes(k)) {
        // intentar detectar subcategoria
        const categoriaDef = CATEGORIAS.find(c => c.key === categoria);
        if (!categoriaDef) return { categoriaKey: categoria };

        // intentar emparejar subcategoria por palabras clave simples
        for (const sub of categoriaDef.subcategorias) {
          const subLower = sub.label.toLowerCase();
          if (t.includes(subLower.split(' ')[0])) {
            return { categoriaKey: categoria, subKey: sub.key };
          }
        }

        return { categoriaKey: categoria };
      }
    }
  }

  // fallback: si no hay match, devolver null y dejar que el usuario elija
  return {};
};
