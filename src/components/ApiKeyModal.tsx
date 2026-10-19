import React, { useState, useEffect } from 'react';
import { 
  Key, 
  X, 
  ExternalLink, 
  Check, 
  AlertTriangle, 
  Sparkles, 
  Lock, 
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Cpu
} from 'lucide-react';
import type { ApiSettings } from '../types';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ApiSettings;
  onSave: (newSettings: ApiSettings) => void;
  hasEnvKey?: boolean;
}

const PRESET_MODELS = [
  { id: 'gemini-3.0-flash', label: 'gemini-3.0-flash', badge: 'Padrão Recomendado', desc: 'Mais rápido e preciso para visão multimodal' },
  { id: 'gemini-3.0-pro', label: 'gemini-3.0-pro', badge: 'Alta Capacidade', desc: 'Raciocínio complexo e detalhes profundos' },
  { id: 'gemini-2.5-pro', label: 'gemini-2.5-pro', badge: 'Pro Estável', desc: 'Excelente estabilidade e contexto longo' },
  { id: 'gemini-2.0-flash', label: 'gemini-2.0-flash', badge: 'Super Rápido', desc: 'Processamento ultrarrápido' },
];

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
  hasEnvKey = false,
}) => {
  const resolveModel = (m?: string) => (!m || m === 'gemini-2.5-flash' ? 'gemini-3.0-flash' : m);

  const [apiKey, setApiKey] = useState(settings.apiKey || '');
  const [model, setModel] = useState(resolveModel(settings.model));
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setApiKey(settings.apiKey || '');
      setModel(resolveModel(settings.model));
      setTestStatus('idle');
      setTestMessage('');
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const handleTestKey = async () => {
    const keyToTest = apiKey.trim();
    if (!keyToTest) {
      setTestStatus('error');
      setTestMessage('Por favor, informe uma chave de API para testar.');
      return;
    }

    const modelToTest = model.trim() || 'gemini-3.0-flash';
    setTestStatus('testing');
    setTestMessage(`Validando chave com o modelo ${modelToTest}...`);

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelToTest}?key=${keyToTest}`;
      const res = await fetch(url);
      if (res.ok) {
        setTestStatus('success');
        setTestMessage(`Conexão confirmada com sucesso! O modelo "${modelToTest}" está disponível e apto a processar imagens.`);
      } else {
        const errorData = await res.json().catch(() => ({}));
        setTestStatus('error');
        setTestMessage(
          errorData.error?.message || `Erro de validação (${res.status}). Verifique a chave ou o identificador do modelo.`
        );
      }
    } catch (err: unknown) {
      setTestStatus('error');
      setTestMessage(
        err instanceof Error ? err.message : 'Falha ao conectar com o serviço do Google Gemini.'
      );
    }
  };

  const handleSave = () => {
    onSave({
      apiKey: apiKey.trim(),
      model: model.trim() || 'gemini-3.0-flash',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Configurações da API de IA
              </h3>
              <p className="text-xs text-slate-500">
                Google Gemini API Multimodal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {hasEnvKey && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong>Chave de ambiente detectada:</strong> Você pode usar a chave definida no arquivo <code>.env</code> ou substituí-la abaixo para esta sessão no navegador.
              </div>
            </div>
          )}

          {/* Campo Chave de API */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Chave da API do Google Gemini
            </label>
            <div className="relative">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono transition-all"
              />
              <div className="absolute right-3 top-3 text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-1.5">
              Sua chave é armazenada de forma segura apenas no seu navegador (<code className="text-indigo-600">localStorage</code>).
            </p>
          </div>

          {/* Campo de Seleção e Edição do Modelo */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                Modelo da IA
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                models/{model || 'gemini-3.0-flash'}:generateContent
              </span>
            </div>

            {/* Input Editável para digitar qualquer modelo */}
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value.trim())}
              placeholder="Ex: gemini-3.0-flash"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-slate-800 transition-all"
            />

            {/* Botões de Seleção Rápida dos Modelos */}
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {PRESET_MODELS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setModel(preset.id)}
                  className={`p-2 rounded-xl text-left border transition-all ${
                    model === preset.id
                      ? 'bg-indigo-50/80 border-indigo-400 ring-2 ring-indigo-200'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-bold font-mono text-slate-900">
                      {preset.label}
                    </span>
                    {preset.badge && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                        model === preset.id 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {preset.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    {preset.desc}
                  </p>
                </button>
              ))}
            </div>

            <p className="text-[11px] text-slate-500">
              Você pode clicar nos modelos sugeridos acima ou digitar livremente outro identificador caso a Google lance novas versões.
            </p>
          </div>

          {/* Como obter a chave */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Não possui uma chave? Obtenha gratuitamente:
            </h4>
            <p className="text-xs text-slate-600 mb-2">
              Você pode gerar uma chave gratuita no Google AI Studio em menos de 1 minuto com sua conta Google.
            </p>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              <span>Acessar Google AI Studio</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Feedback do Teste */}
          {testStatus !== 'idle' && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                testStatus === 'testing'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : testStatus === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {testStatus === 'testing' && <RefreshCw className="w-4 h-4 animate-spin shrink-0" />}
              {testStatus === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
              {testStatus === 'error' && <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />}
              <span className="flex-1">{testMessage}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={handleTestKey}
            disabled={testStatus === 'testing' || !apiKey.trim()}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-indigo-600 bg-white border border-slate-200 hover:border-indigo-300 rounded-lg transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testStatus === 'testing' ? 'animate-spin' : ''}`} />
            Testar Conexão
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm transition-all"
            >
              <Check className="w-4 h-4" />
              Salvar Configurações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
