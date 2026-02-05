import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import CategoriaStep from './onboarding/CategoriaStep';
import TarifasStep from './onboarding/TarifasStep';
import ZonasStep from './onboarding/ZonasStep';

interface OnboardingData {
  categoria: string;
  profesion: string;
  profesionPersonalizada?: string;
  tarifas: {
    porHora: number;
    visitaTecnica: number;
    emergencia: number;
    desplazamiento: number;
    kmGratuitos: number;
  };
  radioCobertura: number;
  zonasTrabajo: string[];
}

interface ProfesionalOnboardingProps {
  onComplete: (data: OnboardingData) => void;
  onSkip?: () => void;
}

const ProfesionalOnboarding: React.FC<ProfesionalOnboardingProps> = ({
  onComplete,
  onSkip
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<Partial<OnboardingData>>({
    tarifas: {
      porHora: 0,
      visitaTecnica: 0,
      emergencia: 0,
      desplazamiento: 0,
      kmGratuitos: 5
    },
    zonasTrabajo: []
  });

  const steps = [
    { title: 'Categoría', description: 'Selecciona tu especialidad' },
    { title: 'Tarifas', description: 'Define tus precios' },
    { title: 'Zonas de Trabajo', description: 'Áreas de cobertura' }
  ];

  const handleNext = (stepData: any) => {
    setData({ ...data, ...stepData });
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(data as OnboardingData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <CategoriaStep onNext={handleNext} />;
      case 1:
        return <TarifasStep onNext={handleNext} initialData={data.tarifas} />;
      case 2:
        return <ZonasStep onNext={handleNext} initialData={data.zonasTrabajo || []} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Completa tu perfil profesional
          </h1>
          <p className="text-gray-600">
            3 pasos simples para empezar a recibir solicitudes
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-between mb-12">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                  index <= currentStep
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {index < currentStep ? (
                  <Check size={24} />
                ) : (
                  index + 1
                )}
              </div>
              <div className="mt-2 text-center">
                <p className="font-semibold text-sm text-gray-900">
                  {step.title}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`hidden sm:block absolute w-16 h-1 top-6 -translate-y-1/2 transition-all ${
                    index < currentStep ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                  style={{ left: `${index * 33.33 + 16}%` }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              currentStep === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ChevronLeft size={20} />
            Anterior
          </button>

          {onSkip && (
            <button
              onClick={onSkip}
              className="text-gray-600 hover:text-gray-900 font-semibold underline"
            >
              Omitir por ahora
            </button>
          )}

          <div className="flex gap-2 text-sm text-gray-600">
            <span className="font-semibold">{currentStep + 1}</span>
            <span>/</span>
            <span>{steps.length}</span>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
          <p className="text-sm text-blue-900">
            💡 <strong>Consejo:</strong> Completa todos los pasos para maximizar tu
            visibilidad en la plataforma y recibir más solicitudes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfesionalOnboarding;
