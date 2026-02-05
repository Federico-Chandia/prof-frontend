# Onboarding Profesional Mejorado - Guía de Integración

## 📋 Descripción General

Este módulo implementa un **wizard interactivo de 3 pasos** para profesionales + una **explicación visual completa del sistema de tokens**.

### Componentes Incluidos:

1. **ProfesionalOnboarding** - Wizard principal de 3 pasos
2. **CategoriaStep** - Paso 1: Selección de categoría y profesión
3. **TarifasStep** - Paso 2: Configuración de tarifas
4. **ZonasStep** - Paso 3: Selección de zonas de trabajo
5. **TokenExplanation** - Explicación completa del sistema de tokens
6. **TokenBalanceCard** - Card para mostrar saldo de tokens

## 🚀 Instalación Rápida

### 1. Integrar el Wizard en Registro de Profesionales

En `Register.tsx` o donde se registren nuevos profesionales:

```typescript
import ProfesionalOnboarding from '@/components/ProfesionalOnboarding';

// En el componente
const [showOnboarding, setShowOnboarding] = useState(false);

const handleCompleteOnboarding = async (data) => {
  try {
    const response = await fetch('/api/profesionales/completar-onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (result.success) {
      // Redirigir a dashboard
      navigate('/dashboard-profesional');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// En el render
{showOnboarding && (
  <ProfesionalOnboarding
    onComplete={handleCompleteOnboarding}
    onSkip={() => navigate('/dashboard-profesional')}
  />
)}
```

### 2. Mostrar Card de Tokens en Dashboard

En `MiPerfil.tsx` o dashboard de profesionales:

```typescript
import TokenBalanceCard from '@/components/TokenBalanceCard';

// En el componente
const { user } = useAuth();
const tokens = user?.tokens?.disponibles || 0;

// En el render
<TokenBalanceCard 
  tokens={tokens}
  onBuyTokens={() => navigate('/comprar-tokens')}
/>
```

### 3. Modal de Explicación de Tokens

Para mostrar un modal informativo en cualquier parte:

```typescript
import TokenExplanation from '@/components/TokenExplanation';

const [showTokenInfo, setShowTokenInfo] = useState(false);

{showTokenInfo && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div className="bg-white rounded-xl max-w-4xl w-full p-4">
      <TokenExplanation 
        userTokens={tokens}
        onClose={() => setShowTokenInfo(false)}
      />
    </div>
  </div>
)}
```

## 🛠 Backend - Endpoint para Completar Onboarding

Crea este endpoint en `backend/routes/profesionales.js`:

```javascript
// @route   POST /api/profesionales/completar-onboarding
// @desc    Guardar datos del onboarding
// @access  Private
router.post('/completar-onboarding', auth, authorize(['profesional']), async (req, res) => {
  try {
    const { categoria, profesion, profesionPersonalizada, tarifas, radioCobertura, zonasTrabajo } = req.body;

    // Validar datos
    if (!categoria || !profesion || !tarifas || !zonasTrabajo.length) {
      return res.status(400).json({ 
        success: false, 
        message: 'Faltan datos requeridos' 
      });
    }

    // Buscar o crear perfil
    let profesional = await Profesional.findOne({ usuario: req.user.id });

    if (!profesional) {
      profesional = new Profesional({ usuario: req.user.id });
    }

    // Actualizar datos
    profesional.categoria = categoria;
    profesional.profesion = profesion;
    if (profesionPersonalizada) {
      profesional.profesionPersonalizada = profesionPersonalizada;
    }
    profesional.tarifas = tarifas;
    profesional.radioCobertura = radioCobertura;
    profesional.zonasTrabajo = zonasTrabajo;

    await profesional.save();

    res.json({ 
      success: true, 
      message: 'Perfil completado exitosamente',
      profesional 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});
```

## 📊 Estructura de Datos

### Datos del Onboarding

```typescript
interface OnboardingData {
  categoria: 'servicios-hogar' | 'construccion' | 'tecnologia' | 'salud-bienestar' | 'educacion' | 'transporte';
  profesion: string;
  profesionPersonalizada?: string;
  tarifas: {
    porHora: number;        // Tarifa por hora
    visitaTecnica: number;  // Precio visita técnica
    emergencia: number;     // Recargo por emergencia
    desplazamiento: number; // Precio por km
    kmGratuitos: number;    // KM sin cargo
  };
  radioCobertura: number;   // KM máximos de cobertura
  zonasTrabajo: string[];   // Barrios/zonas
}
```

## 🎨 Personalización

### Colores

- **Principal**: Indigo (rgb(79, 70, 229))
- **Acentos**: Amber/Orange para tokens
- **Secundario**: Gris

### Modificar Categorías

Edita el array `categorias` en `CategoriaStep.tsx`:

```typescript
const categorias = [
  {
    id: 'tuCategoria',
    nombre: 'Tu Categoría',
    icono: '🎨',
    profesiones: ['prof1', 'prof2', 'prof3']
  }
];
```

### Modificar Zonas

Edita el array `zonasDisponibles` en `ZonasStep.tsx`:

```typescript
const zonasDisponibles = [
  'Tu Zona 1',
  'Tu Zona 2',
  // ...
];
```

## 🔧 Funcionalidades Adicionales

### Guardar Progreso del Wizard

Para permitir guardar y continuar más tarde:

```typescript
// Almacenar en localStorage
localStorage.setItem('onboarding-progress', JSON.stringify({
  step: currentStep,
  data: data
}));

// Recuperar
const saved = localStorage.getItem('onboarding-progress');
if (saved) {
  const { step, data } = JSON.parse(saved);
  setCurrentStep(step);
  setData(data);
}
```

### Verificación de Onboarding Completo

Añade un campo en el modelo de Profesional:

```javascript
onboardingCompleto: { 
  type: Boolean, 
  default: false 
},
onboardingCompletadoEn: Date
```

Luego valida en rutas protegidas:

```javascript
if (!profesional.onboardingCompleto) {
  return res.status(400).json({ 
    message: 'Debes completar el onboarding primero' 
  });
}
```

## 📱 Responsividad

Todos los componentes están optimizados para:
- ✅ Mobile (320px+)
- ✅ Tablet (768px+)
- ✅ Desktop (1024px+)

## 🎯 Flujo de Usuario Recomendado

1. Usuario se registra como profesional
2. Se muestra el wizard de onboarding
3. Completa los 3 pasos
4. Se guarda el perfil profesional
5. Se redirige al dashboard
6. Ve el card de tokens disponibles
7. Puede completar solicitudes usando tokens

## 🐛 Troubleshooting

### Error: "Categoría no válida"
- Verificar que la categoría en `CategoriaStep.tsx` coincida con el modelo

### Error: "No se muestran las zonas"
- Comprobar que `zonasDisponibles` no esté vacío
- Validar el filtro de búsqueda

### Tokens no se actualizan
- Verificar endpoint `/api/usuarios/me` devuelve `tokens`
- Comprobar que el token JWT sea válido

## 📚 Referencias

- [Documentación de React 18](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## 📝 Notas

- El wizard se puede resumir/continuar editar los datos en `MiPerfil.tsx`
- Los tokens se gastan al confirmar respuesta a solicitud
- Implementar sistema de renovación automática de tokens por suscripción
