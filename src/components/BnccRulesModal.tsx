import React from 'react';
import { X, CheckCircle, BookOpen } from 'lucide-react';

interface BnccRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BnccRulesModal: React.FC<BnccRulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Padrão e Regras de Estruturação da BNCC
              </h3>
              <p className="text-xs text-slate-500">
                Diretrizes automáticas aplicadas na extração dos planejamentos
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

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto text-sm text-slate-700">
          {/* Regra Língua Portuguesa */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-blue-900 text-sm">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              1. Língua Portuguesa (Exatamente 4 Colunas)
            </div>
            <p className="text-xs text-blue-800">
              Devido à especificidade curricular dos eixos de linguagem, a tabela de Língua Portuguesa possui obrigatoriamente as seguintes 4 colunas:
            </p>
            <div className="bg-white p-2.5 rounded-lg border border-blue-200 text-xs font-mono text-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-semibold">
              <div className="bg-blue-100/60 p-1.5 rounded">CAMPOS DE ATUAÇÃO</div>
              <div className="bg-blue-100/60 p-1.5 rounded">PRÁTICAS DE LINGUAGEM</div>
              <div className="bg-blue-100/60 p-1.5 rounded">OBJETOS DE CONHECIMENTO</div>
              <div className="bg-blue-100/60 p-1.5 rounded">HABILIDADES</div>
            </div>
          </div>

          {/* Regra Outras Matérias */}
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              2. Todas as Outras Disciplinas (3 Colunas)
            </div>
            <p className="text-xs text-emerald-800">
              Para Matemática, Ciências, História, Geografia, Arte, Educação Física, omite-se a coluna &quot;Práticas de Linguagem&quot;:
            </p>
            <div className="bg-white p-2.5 rounded-lg border border-emerald-200 text-xs font-mono text-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-2 text-center font-semibold">
              <div className="bg-emerald-100/60 p-1.5 rounded">CAMPOS / UNIDADES TEMÁTICAS</div>
              <div className="bg-emerald-100/60 p-1.5 rounded">OBJETOS DE CONHECIMENTO</div>
              <div className="bg-emerald-100/60 p-1.5 rounded">HABILIDADES</div>
            </div>
          </div>

          {/* Regras adicionais */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
              Diretrizes de Consolidação e Fidelidade
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 list-disc list-inside">
              <li>
                <strong>Fidelidade aos códigos da BNCC:</strong> Transcrição rigorosa dos códigos alfanuméricos (ex: <code>EF01LP01</code>, <code>EF02MA05</code>).
              </li>
              <li>
                <strong>Consolidação Multimodal:</strong> Se uma matéria começar na Foto 1 e continuar na Foto 2, o sistema consolida todas as informações em uma única tabela contínua.
              </li>
              <li>
                <strong>Preenchimento Sem Invenção:</strong> Informações não visíveis são marcadas com <code>-</code> (traço) sem alucinações.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
