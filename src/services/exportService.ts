import { marked } from 'marked';

/**
 * Converte Markdown para HTML estruturado para tabelas
 */
export function markdownToHtml(markdown: string): string {
  // Configura marked para renderizar tabelas GFM
  return marked.parse(markdown, { gfm: true, breaks: true }) as string;
}

/**
 * Cria uma versão HTML estilizada com formatação inline própria para o Microsoft Word e Google Docs
 */
export function generateWordCompatibleHtml(markdown: string): string {
  const rawHtml = markdownToHtml(markdown);

  // Envolve em container com estilos inline que o Word e Google Docs compreendem
  const styledHtml = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Planejamento Pedagógico BNCC</title>
<style>
  body {
    font-family: Calibri, 'Segoe UI', Arial, sans-serif;
    font-size: 11pt;
    color: #1a1a1a;
    line-height: 1.4;
  }
  h2 {
    color: #1e3a8a;
    font-size: 14pt;
    border-bottom: 2px solid #1e3a8a;
    padding-bottom: 4px;
    margin-top: 24px;
    margin-bottom: 12px;
  }
  h3 {
    color: #334155;
    font-size: 12pt;
    margin-top: 16px;
    margin-bottom: 8px;
  }
  table {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 24px;
    font-size: 10pt;
  }
  th {
    background-color: #1e3a8a;
    color: #ffffff;
    font-weight: bold;
    padding: 8px 10px;
    border: 1px solid #0f172a;
    text-align: left;
  }
  td {
    padding: 8px 10px;
    border: 1px solid #cbd5e1;
    vertical-align: top;
  }
  tr:nth-child(even) td {
    background-color: #f8fafc;
  }
  p {
    margin: 6px 0;
  }
</style>
</head>
<body>
  ${rawHtml}
</body>
</html>
`.trim();

  return styledHtml;
}

/**
 * Copia o texto puro em Markdown para o Clipboard
 */
export async function copyMarkdownToClipboard(markdown: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(markdown);
      return true;
    }
    // Fallback
    const textarea = document.createElement('textarea');
    textarea.value = markdown;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    return successful;
  } catch (err) {
    console.error('Erro ao copiar markdown:', err);
    return false;
  }
}

/**
 * Copia a tabela formatada em HTML para o Clipboard (compatível com Word, Google Docs e Excel)
 */
export async function copyTableToClipboard(markdown: string): Promise<boolean> {
  const htmlContent = generateWordCompatibleHtml(markdown);

  try {
    if (navigator.clipboard && window.ClipboardItem) {
      const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
      const textBlob = new Blob([markdown], { type: 'text/plain' });
      
      const item = new ClipboardItem({
        'text/html': htmlBlob,
        'text/plain': textBlob,
      });

      await navigator.clipboard.write([item]);
      return true;
    }

    // Fallback usando seleção de elemento DOM temporário
    const container = document.createElement('div');
    container.innerHTML = htmlContent;
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    document.body.appendChild(container);

    const range = document.createRange();
    range.selectNodeContents(container);
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
      const successful = document.execCommand('copy');
      selection.removeAllRanges();
      document.body.removeChild(container);
      return successful;
    }

    return false;
  } catch (err) {
    console.error('Falha ao copiar tabela HTML:', err);
    // Tenta fallback somente com texto
    return await copyMarkdownToClipboard(markdown);
  }
}

/**
 * Baixa o conteúdo como arquivo .md
 */
export function downloadMarkdownFile(markdown: string, filename = 'planejamento_bncc.md') {
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Baixa o conteúdo formatado como arquivo .doc (compatível com Microsoft Word)
 */
export function downloadDocFile(markdown: string, filename = 'planejamento_bncc.doc') {
  const rawHtml = markdownToHtml(markdown);

  // Formato HTML MHTML / Word compatível com margens A4 e estilos da tabela
  const wordDocumentHtml = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" 
      xmlns:w="urn:schemas-microsoft-com:office:word" 
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <title>Planejamento Pedagógico BNCC</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page Section1 {
      size: 841.9pt 595.3pt; /* A4 Paisagem (Landscape) ideal para tabelas da BNCC com 4 colunas */
      margin: 1.0in 1.0in 1.0in 1.0in;
      mso-header-margin: .5in;
      mso-footer-margin: .5in;
      mso-paper-source: 0;
    }
    div.Section1 {
      page: Section1;
    }
    body {
      font-family: 'Calibri', 'Arial', sans-serif;
      font-size: 11pt;
      color: #1e293b;
      line-height: 1.4;
    }
    h1 {
      font-size: 18pt;
      color: #1e3a8a;
      text-align: center;
      margin-bottom: 20px;
    }
    h2 {
      font-size: 14pt;
      color: #1e3a8a;
      border-bottom: 2pt solid #1e3a8a;
      padding-bottom: 4pt;
      margin-top: 24pt;
      margin-bottom: 12pt;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 25pt;
      font-size: 9.5pt;
    }
    th {
      background-color: #1e3a8a;
      color: #ffffff;
      font-weight: bold;
      padding: 8pt 10pt;
      border: 1pt solid #0f172a;
      text-align: left;
    }
    td {
      padding: 7pt 9pt;
      border: 1pt solid #cbd5e1;
      vertical-align: top;
    }
    tr:nth-child(even) td {
      background-color: #f8fafc;
    }
    p {
      margin: 4pt 0;
    }
    .header-info {
      font-size: 9pt;
      color: #64748b;
      margin-bottom: 20pt;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="Section1">
    <h1>Planejamento Curricular - Padrão BNCC</h1>
    <p class="header-info">Documento extraído e estruturado automaticamente via Extrator Pedagógico</p>
    ${rawHtml}
  </div>
</body>
</html>
`.trim();

  const blob = new Blob(['\ufeff' + wordDocumentHtml], {
    type: 'application/msword;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
