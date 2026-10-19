import { useState, useRef } from 'react';
import { 
  Sparkles, 
  Loader2, 
  AlertCircle, 
  ArrowRight, 
  CheckCircle2, 
  FileSpreadsheet
} from 'lucide-react';
import type { UploadedImage, ProcessingState, ApiSettings } from './types';
import { extractBnccFromImages } from './services/geminiService';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { OutputViewer } from './components/OutputViewer';
import { ApiKeyModal } from './components/ApiKeyModal';
import { BnccRulesModal } from './components/BnccRulesModal';
import { ImagePreviewModal } from './components/ImagePreviewModal';
import { ToastContainer } from './components/Toast';
import type { ToastMessage } from './components/Toast';
import { SAMPLE_MARKDOWN_RESULT, createSampleImageFiles } from './components/SampleData';


export function App() {
  // Configurações da API
  const [settings, setSettings] = useState<ApiSettings>(() => {
    const savedKey = localStorage.getItem('gemini_api_key') || '';
    const savedModel = localStorage.getItem('gemini_model');
    // Migra modelo antigo gemini-2.5-flash para gemini-3.0-flash caso ainda esteja em cache
    const initialModel = (!savedModel || savedModel === 'gemini-2.5-flash') ? 'gemini-3.0-flash' : savedModel;
    const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
    return {
      apiKey: savedKey || envKey,
      model: initialModel,
    };
  });


  // Imagens carregadas
  const [images, setImages] = useState<UploadedImage[]>([]);

  // Estado do Processamento
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isLoading: false,
    stepMessage: '',
    error: null,
  });

  // Resultado extraído
  const [extractedMarkdown, setExtractedMarkdown] = useState<string>('');

  // Modais e visualizadores
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<UploadedImage | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const resultsRef = useRef<HTMLDivElement>(null);

  const hasEnvKey = Boolean((import.meta as any).env?.VITE_GEMINI_API_KEY);
  const hasConfiguredKey = Boolean(settings.apiKey?.trim());

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const newToast: ToastMessage = {
      id: `${Date.now()}-${Math.random()}`,
      message,
      type,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSaveSettings = (newSettings: ApiSettings) => {
    setSettings(newSettings);
    localStorage.setItem('gemini_api_key', newSettings.apiKey);
    localStorage.setItem('gemini_model', newSettings.model);
    addToast('Configurações da API salvas com sucesso!', 'success');
  };

  // Carrega exemplo de demonstração para teste imediato
  const handleLoadSample = () => {
    try {
      const sampleFiles = createSampleImageFiles();
      const loadedImages: UploadedImage[] = sampleFiles.map((s, idx) => ({
        id: `sample-${idx}-${Date.now()}`,
        file: s.file,
        name: s.file.name,
        size: s.file.size,
        previewUrl: s.previewUrl,
        mimeType: s.file.type,
      }));

      setImages(loadedImages);
      setExtractedMarkdown(SAMPLE_MARKDOWN_RESULT);
      setProcessingState({ isLoading: false, stepMessage: '', error: null });
      addToast('Exemplo pedagógico completo carregado! Você já pode testar a visualização e as cópias para Word/Docs.', 'info');

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } catch (err) {
      console.error(err);
      addToast('Não foi possível carregar as imagens de exemplo.', 'error');
    }
  };

  // Executa a extração multimodal
  const handleProcessImages = async () => {
    if (images.length === 0) {
      addToast('Selecione ou arraste ao menos uma foto de planejamento.', 'error');
      return;
    }

    if (!hasConfiguredKey) {
      addToast('É necessário configurar uma chave da API do Google Gemini antes de continuar.', 'error');
      setIsSettingsOpen(true);
      return;
    }

    setProcessingState({
      isLoading: true,
      stepMessage: 'Analisando imagens e estruturando tabelas...',
      error: null,
    });

    try {
      const resultText = await extractBnccFromImages(
        images,
        settings,
        (msg) => {
          setProcessingState((prev) => ({ ...prev, stepMessage: msg }));
        }
      );

      setExtractedMarkdown(resultText);
      setProcessingState({
        isLoading: false,
        stepMessage: '',
        error: null,
      });

      addToast('Tabelas da BNCC geradas e consolidadas com sucesso!', 'success');

      // Rola suavemente até o resultado
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 250);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha desconhecida durante a extração';
      setProcessingState({
        isLoading: false,
        stepMessage: '',
        error: msg,
      });
      addToast(msg, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Cabeçalho */}
      <Header
        hasApiKey={hasConfiguredKey}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenRules={() => setIsRulesOpen(true)}
        onLoadSample={handleLoadSample}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Banner Informativo / Hero */}
        <section className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Estruturação Automatizada com Visão Computacional Multimodal</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Converta Fotos de Planejamentos em{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">
              Tabelas Padronizadas da BNCC
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Selecione ou fotografe os cadernos e fichas de planejamento pedagógico. A inteligência artificial lê os textos, consolida matérias divididas em várias fotos e estrutura as tabelas prontas para colar no Word, Docs ou Excel.
          </p>

          {/* Destaque rápido das regras BNCC */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              <strong>Língua Portuguesa:</strong> 4 colunas com Práticas de Linguagem
            </span>
            <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <strong>Outras Disciplinas:</strong> 3 colunas curriculares
            </span>
          </div>
        </section>

        {/* Alerta de chave não configurada se necessário */}
        {!hasConfiguredKey && (
          <div className="max-w-3xl mx-auto p-4 rounded-2xl bg-amber-50/90 border border-amber-200 shadow-xs flex items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-center gap-3 text-xs sm:text-sm text-amber-900">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <strong>Chave da API não configurada:</strong> Para processar novas fotos personalizadas com o Google Gemini, configure sua chave gratuita. Ou teste imediatamente com o botão de demonstração.
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleLoadSample}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
              >
                Ver Exemplo
              </button>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="px-3 py-1.5 text-xs font-semibold text-amber-950 bg-amber-200 hover:bg-amber-300 rounded-lg transition-colors"
              >
                Configurar Chave
              </button>
            </div>
          </div>
        )}

        {/* Área de Seleção e Upload de Imagens */}
        <section className="max-w-4xl mx-auto space-y-6">
          <ImageUploader
            images={images}
            onImagesChange={setImages}
            onPreviewImage={setPreviewImage}
            disabled={processingState.isLoading}
          />

          {/* Botão de Ação Principal */}
          <div className="flex flex-col items-center justify-center pt-2">
            <button
              type="button"
              onClick={handleProcessImages}
              disabled={images.length === 0 || processingState.isLoading}
              className={`w-full sm:w-auto min-w-[320px] px-8 py-4 rounded-2xl font-bold text-base transition-all duration-200 shadow-lg flex items-center justify-center gap-3 ${
                images.length === 0 || processingState.isLoading
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-blue-700 via-indigo-600 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-200/60 active:scale-[0.99]'
              }`}
            >
              {processingState.isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                  <span>Analisando imagens e estruturando tabelas...</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-5 h-5 stroke-[2.2]" />
                  <span>Extrair e Organizar Tabelas BNCC</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Mensagem de Progresso / Loading amigável */}
            {processingState.isLoading && (
              <div className="mt-4 p-4 max-w-md w-full rounded-xl bg-indigo-50 border border-indigo-200 text-center animate-pulse">
                <p className="text-xs sm:text-sm font-semibold text-indigo-900">
                  {processingState.stepMessage || 'Analisando imagens e estruturando tabelas...'}
                </p>
                <p className="text-[11px] text-indigo-700 mt-1">
                  Enviando fotos simultaneamente para consolidação curricular. Isso pode levar alguns segundos.
                </p>
              </div>
            )}

            {/* Mensagem de Erro com alerta amigável */}
            {processingState.error && !processingState.isLoading && (
              <div className="mt-4 p-4 max-w-lg w-full rounded-xl bg-rose-50 border border-rose-200 text-left flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs text-rose-900 space-y-1">
                  <p className="font-semibold">Erro ao processar as imagens:</p>
                  <p>{processingState.error}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Área de Resultado (Output) */}
        {extractedMarkdown && (
          <section ref={resultsRef} className="max-w-6xl mx-auto pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Planejamento Pedagógico Estruturado
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Conteúdo extraído das fotos e organizado nas tabelas normativas da BNCC
                </p>
              </div>
            </div>

            <OutputViewer
              markdown={extractedMarkdown}
              onShowToast={addToast}
            />
          </section>
        )}
      </main>

      {/* Rodapé institucional moderno */}
      <footer className="mt-16 bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Extrator Pedagógico BNCC • Desenvolvido para auxílio a professores e coordenação escolar
          </p>
          <div className="flex items-center gap-4 text-slate-600 font-medium">
            <button
              onClick={() => setIsRulesOpen(true)}
              className="hover:text-indigo-600 transition-colors"
            >
              Normas Curriculares
            </button>
            <span>•</span>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="hover:text-indigo-600 transition-colors"
            >
              Configuração da IA
            </button>
          </div>
        </div>
      </footer>

      {/* Modais */}
      <ApiKeyModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={handleSaveSettings}
        hasEnvKey={hasEnvKey}
      />

      <BnccRulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      <ImagePreviewModal
        image={previewImage}
        onClose={() => setPreviewImage(null)}
      />

      {/* Toasts */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default App;
