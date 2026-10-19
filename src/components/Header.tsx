import React from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Settings, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle,
  FileCheck2
} from 'lucide-react';


interface HeaderProps {
  hasApiKey: boolean;
  onOpenSettings: () => void;
  onOpenRules: () => void;
  onLoadSample: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  hasApiKey,
  onOpenSettings,
  onOpenRules,
  onLoadSample,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo e Título */}
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-md shadow-indigo-100 ring-4 ring-indigo-50">
              <BookOpen className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 m-0">
                  Extrator Pedagógico <span className="text-indigo-600">BNCC</span>
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <Sparkles className="w-3 h-3 mr-1 text-indigo-500" />
                  Multimodal
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Fotos de planejamentos convertidas em tabelas curriculares oficiais
              </p>
            </div>
          </div>

          {/* Ações do Topo */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Botão de Demonstração */}
            <button
              onClick={onLoadSample}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors border border-slate-200"
              title="Carregar fotos de demonstração e tabelas exemplo para teste imediato"
            >
              <FileCheck2 className="w-4 h-4 text-slate-600" />
              <span className="hidden md:inline">Testar com</span> Exemplo
            </button>

            {/* Guia de Regras BNCC */}
            <button
              onClick={onOpenRules}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/60 rounded-lg transition-colors"
              title="Ver estrutura e regras das tabelas da BNCC"
            >
              <HelpCircle className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Regras BNCC</span>
            </button>

            {/* Configurar Chave de API */}
            <button
              onClick={onOpenSettings}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all border ${
                hasApiKey
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100 animate-pulse'
              }`}
              title="Configurar Chave da API do Google Gemini"
            >
              {hasApiKey ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="hidden sm:inline">API Configurada</span>
                  <span className="sm:hidden">API</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span className="hidden sm:inline">Inserir Chave API</span>
                  <span className="sm:hidden">Configurar</span>
                </>
              )}
              <Settings className="w-3.5 h-3.5 opacity-70 ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
