import React from 'react';
import { Star } from 'lucide-react';

interface Testimonio {
  id: number;
  autor: string;
  rol: string;
  ciudad: string;
  rating: number;
  texto: string;
  imagen?: string;
}

const Testimonios: React.FC = () => {
  const testimonios: Testimonio[] = [
    {
      id: 1,
      autor: 'María Rodríguez',
      rol: 'Cliente',
      ciudad: 'Villa Urquiza',
      rating: 5,
      texto:
        'No tenia idea de a quién llamar cuando se derritio el enchufe del calefón. Busque por acá, encontré una electricista en 5 minutos y listo. Vino y arregló todo. Muy recomendable.',
      imagen:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&q=80',
    },
    {
      id: 2,
      autor: 'Juan Carlos Gómez',
      rol: 'Electricista',
      ciudad: 'La Plata',
      rating: 5,
      texto:
        'Laburo hace años y con esta pagina es más facil conseguir nuevos clientes',
      imagen:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80',
    },
    {
      id: 3,
      autor: 'Juana Fernández',
      rol: 'profesional',
      ciudad: 'Berazategui',
      rating: 5,
      texto:
        'La recomiendo, te facilita mucho las cosas y a generar confianza con nuevos clientes. Genial ',
      imagen:
        'https://imgs.search.brave.com/qDWluaY6-B4-bQzGaSMd9hn3LdZXou9TGGT34ffalLs/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4w/LnVuY29tby5jb20v/ZXMvcG9zdHMvMi84/LzgvY29tb19kZXRl/Y3Rhcl91bl9jb3J0/b2NpcmN1aXRvX2Vu/X2Nhc2FfNDU4ODJf/NjAwLmpwZw',
      } 
  ]

  return (
    <section id="testimonios" className="py-8 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Lo que dicen nuestros usuarios
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Miles de clientes y profesionales usan Profesionales cada día. Acá están sus historias.
          </p>
        </div>

        {/* Grid de testimonios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {testimonios.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200 hover:shadow-md transition-shadow"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Texto */}
              <p className="text-xs sm:text-sm text-gray-700 mb-4 line-clamp-4 sm:line-clamp-none">
                "{testimonial.texto}"
              </p>

              {/* Autor */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <img
                  src={testimonial.imagen}
                  alt={testimonial.autor}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-xs sm:text-sm text-gray-900">
                    {testimonial.autor}
                  </p>
                  <p className="text-xs text-gray-500">
                    {testimonial.rol} • {testimonial.ciudad}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-8 sm:mt-12">
          <p className="text-xs sm:text-sm text-gray-600 mb-4">
            ¿Querés compartir tu experiencia?
          </p>
          <button className="px-6 py-2 sm:py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
            Escribi tu testimonial
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonios;
