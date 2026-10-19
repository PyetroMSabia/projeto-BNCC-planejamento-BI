import React, { useState, useMemo } from 'react';
import { 
  Table as TableIcon, 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  Share2, 
  Layers, 
  Award
} from 'lucide-react';

import { 
  markdownToHtml, 
  copyMarkdownToClipboard, 
  copyTableToClipboard, 
  downloadMarkdownFile, 
  downloadDocFile 
} from '../services/exportService';

interface OutputViewerProps {
  markdown: string;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const OutputViewer: React.FC<OutputViewerProps> = ({
  markdown,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'table' | 'markdown'>('table');
  const [copiedMd, setCopiedMd] = useState(false);
  const [copiedTable, setCopiedTable] = useState(false);

  // Processa o HTML e aplica destaques nos códigos da BNCC e wrappers de tabela
  const processedHtml = useMemo(() => {
    if (!markdown) return '';
    let html = markdownToHtml(markdown);

    // Envolve as tabelas em wrappers com rolagem horizontal estilizada
    html = html.replace(/<table>/g, '<div class="bncc-table-wrapper"><table>');
    html = html.replace(/<\/table>/g, '</table></div>');

    // Destaca códigos da BNCC ex: (EF01LP01), EF12LP04, EF02MA05
    const bnccRegex = /\b(EF\d{2}[A-Z]{2}\d{2})\b/g;
    html = html.replace(bnccRegex, '<span class="bncc-code-tag">$1</span>');

    return html;
  }, [markdown]);

  // Estatísticas de extração
  const stats = useMemo(() => {
    if (!markdown) return { subjects: 0, skills: 0 };
    const subjectMatches = markdown.match(/^##\s+.+$/gm) || [];
    const skillMatches = markdown.match(/\bEF\d{2}[A-Z]{2}\d{2}\b/g) || [];
    const uniqueSkills = Array.from(new Set(skillMatches));

    return {
      subjects: subjectMatches.length,
      skills: uniqueSkills.length,
      skillList: uniqueSkills,
    };
  }, [markdown]);

  const handleCopyMarkdown = async () => {
    const success = await copyMarkdownToClipboard(markdown);
    if (success) {
      setCopiedMd(true);
      onShowToast('Texto Markdown copiado para a área de transferência!', 'success');
      setTimeout(() => setCopiedMd(false), 2000);
    } else {
      onShowToast('Falha ao copiar markdown.', 'error');
    }
  };

  const handleCopyTable = async () => {
    const success = await copyTableToClipboard(markdown);
    if (success) {
      setCopiedTable(true);
      onShowToast('Tabela HTML copiada com sucesso! Cole diretamente no Word, Docs ou Excel com bordas preservadas.', 'success');
      setTimeout(() => setCopiedTable(false), 2500);
    } else {
      onShowToast('Não foi possível copiar no formato de tabela.', 'error');
    }
  };

  const handleDownloadMd = () => {
    downloadMarkdownFile(markdown);
    onShowToast('Arquivo .md baixado!', 'success');
  };

  const handleDownloadDoc = () => {
    downloadDocFile(markdown);
    onShowToast('Arquivo .doc formatado para Word baixado!', 'success');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
      {/* Barra Superior de Ações e Abas */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-4 sm:p-5 bg-slate-50/80 border-b border-slate-200">
        {/* Alternador de Abas */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-xl self-start">
          <button
            type="button"
            onClick={() => setActiveTab('table')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'table'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TableIcon className="w-4 h-4 text-indigo-600" />
            <span>Tabela Renderizada</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('markdown')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'markdown'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCode className="w-4 h-4 text-slate-600" />
            <span>Texto Puro (Markdown)</span>
          </button>
        </div>

        {/* Botões de Exportação Rápida */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Copiar Markdown */}
          <button
            type="button"
            onClick={handleCopyMarkdown}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-xl transition-all shadow-xs"
            title="Copiar texto bruto em Markdown"
          >
            {copiedMd ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                <span className="text-emerald-700">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copiar Texto (Markdown)</span>
              </>
            )}
          </button>

          {/* Copiar Tabela para Word/Docs/Excel */}
          <button
            type="button"
            onClick={handleCopyTable}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all shadow-xs border ${
              copiedTable
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-indigo-600 text-white border-indigo-700 hover:bg-indigo-700'
            }`}
            title="Copia a tabela em formato HTML para colar formatada com bordas e cores no Word ou Docs"
          >
            {copiedTable ? (
              <>
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Tabela Copiada!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Copiar Tabela (Word / Docs / Excel)</span>
              </>
            )}
          </button>

          {/* Downloads */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleDownloadDoc}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors shadow-xs"
              title="Baixar arquivo compatível com Microsoft Word (.doc)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar .DOC</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadMd}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors shadow-xs"
              title="Baixar arquivo Markdown (.md)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar .MD</span>
            </button>
          </div>
        </div>
      </div>

      {/* Barra de Estatísticas / Resumo Pedagógico */}
      <div className="px-5 py-2.5 bg-slate-100/60 border-b border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-medium">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <strong>{stats.subjects}</strong> {stats.subjects === 1 ? 'matéria identificada' : 'matérias identificadas'}
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <strong>{stats.skills}</strong> {stats.skills === 1 ? 'habilidade BNCC' : 'habilidades BNCC catalogadas'}
          </span>
        </div>
        <div className="text-[11px] text-slate-500 italic">
          Formatado conforme as diretrizes oficiais da BNCC
        </div>
      </div>

      {/* Conteúdo: Tabela Renderizada vs Markdown */}
      <div className="p-5 sm:p-7">
        {activeTab === 'table' ? (
          <div
            className="bncc-rendered-content text-left"
            dangerouslySetInnerHTML={{ __html: processedHtml }}
          />
        ) : (
          <div className="relative">
            <textarea
              readOnly
              value={markdown}
              className="w-full h-[520px] p-4 text-xs sm:text-sm font-mono bg-slate-900 text-emerald-400 rounded-xl border border-slate-800 focus:outline-none resize-y selection:bg-indigo-500 selection:text-white leading-relaxed"
            />
            <div className="absolute top-3 right-3">
              <button
                type="button"
                onClick={handleCopyMarkdown}
                className="px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 rounded-md border border-slate-700 transition-colors"
              >
                Copiar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
