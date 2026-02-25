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
      ciudad: 'CABA',
      rating: 5,
      texto:
        'No tenia idea de a quién llamar cuando se me quemó el interruptor. Entré a la app, encontré un electricista en 10 minutos y listo. El chabon vino al toque y arregló todo. Muy recomendable .',
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
        'Laburo hace 20 años y con esta pagina se me hace más facil conseguir clientes',
      imagen:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80',
    },
    {
      id: 3,
      autor: 'Lucía Martínez',
      rol: 'Cliente',
      ciudad: 'Zona Norte',
      rating: 5,
      texto:
        'Se me rompío el termotanque, contacté al electricista y en media hora lo arregló. Impecable.',
      imagen:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&q=80',
    },
    {
      id: 4,
      autor: 'Pedro Fernández',
      rol: 'profesional',
      ciudad: 'Berazategui',
      rating: 5,
      texto:
        'Me registré pensando que era al pedo, pero es como tener mi propio negocio pero sin quilombo. Genial.',
      imagen:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&q=80',
    },
    {
      id: 5,
      autor: 'Sofía López',
      rol: 'Cliente',
      ciudad: 'San Isidro',
      rating: 5,
      texto:
        'Contrataba gente recomendada y no me convencia mucho. Ahora con la app veo rating, fotos de trabajos anteriores, y puedo chatear antes. Me ahorro un montón de viajes y tiempo. Una de las mejores apps que tengo instalada.',
      imagen:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80',
    },
    {
      id: 6,
      autor: 'Roberto Ruiz',
      rol: 'Cliente',
      ciudad: 'Quilmes',
      rating: 5,
      texto:
        'Soy usuario desde el primer día que salió la app. Ahora toda mi cuadra pregunta por Profesionales cuando hay algo que arreglar. Es seguro, los profesionales son de verdad y responden al toque. Eso del chat en vivo es lo mejor que existe.',
      imagen:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&q=80',
    },
  ];

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
