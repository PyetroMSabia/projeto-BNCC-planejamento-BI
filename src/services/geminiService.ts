import type { UploadedImage, ApiSettings } from '../types';

export const BNCC_SYSTEM_INSTRUCTION = `### Papel e Objetivo
Você é um assistente especialista em organização pedagógica e diretrizes curriculares da rede pública (padrão BNCC). Sua tarefa é analisar imagens ou textos de planejamentos escolares e organizar todo o conteúdo extraído em tabelas separadas por componente curricular (matéria).

### Regras de Estruturação das Tabelas
Para cada matéria identificada nas imagens enviadas, crie uma seção própria com um título claro (ex: \`## Língua Portuguesa\`, \`## Matemática\`) seguida de uma tabela em Markdown.

1. **Se a matéria for Língua Portuguesa**, a tabela DEVE conter exatamente estas 4 colunas:
   | CAMPOS DE ATUAÇÃO | PRÁTICAS DE LINGUAGEM | OBJETOS DE CONHECIMENTO | HABILIDADES |

2. **Para TODAS as outras matérias** (Matemática, Ciências, História, Geografia, Artes, etc.), omita a coluna "Práticas de Linguagem". A tabela DEVE conter estas 3 colunas (ou adaptar a primeira para "Unidades Temáticas" quando o documento original assim denominar, mantendo o padrão exigido):
   | CAMPOS DE ATUAÇÃO / UNIDADES TEMÁTICAS | OBJETOS DE CONHECIMENTO | HABILIDADES |

### Diretrizes de Extração e Formatação
- **Fidelidade ao Conteúdo:** Transcreva exatamente os textos e os códigos alfanuméricos da BNCC (ex: EF01LP01, EF02MA05) presentes nas fotos, corrigindo apenas erros óbvios de leitura óptica (OCR).
- **Alinhamento Pedagógico:** Relacione corretamente cada Habilidade ao seu respectivo Objeto de Conhecimento, Prática de Linguagem e Campo de Atuação na mesma linha da tabela.
- **Múltiplas Imagens:** Caso uma matéria esteja dividida em duas ou mais fotos, consolide todas as informações em uma única tabela contínua para aquela matéria.
- **Campos Vazios:** Se alguma informação não estiver visível ou não constar na imagem para determinada linha, preencha a célula com \`-\` (traço) sem inventar dados.
- **Saída Limpa:** Entregue diretamente as tabelas formatadas, sem textos introdutórios longos ou conclusões desnecessárias.`;

/**
 * Converte um arquivo do tipo File em string base64 pura (sem cabeçalho data:image/...)
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove o prefixo data:mime/type;base64,
      const base64Data = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64Data);
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Envia todas as imagens juntas na mesma requisição para o Google Gemini API
 */
export async function extractBnccFromImages(
  images: UploadedImage[],
  settings: ApiSettings,
  onProgress?: (message: string) => void
): Promise<string> {
  if (!images || images.length === 0) {
    throw new Error('Nenhuma imagem foi selecionada para envio.');
  }

  const apiKey = settings.apiKey?.trim();
  if (!apiKey) {
    throw new Error('Chave da API do Google Gemini não configurada. Por favor, insira sua chave nas Configurações.');
  }

  onProgress?.('Preparando e codificando imagens em base64...');

  // Garante que todas as imagens têm base64 carregado
  const preparedImages = await Promise.all(
    images.map(async (img) => {
      if (img.base64) return img;
      const b64 = await fileToBase64(img.file);
      return { ...img, base64: b64 };
    })
  );

  onProgress?.(`Enviando ${preparedImages.length} imagem(ns) simultaneamente para o Gemini multimodal...`);

  const model = (settings.model?.trim()) || 'gemini-3.0-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;


  // Monta as partes da requisição: primeiro todas as imagens, depois a instrução do usuário
  const imageParts = preparedImages.map((img) => ({
    inlineData: {
      mimeType: img.mimeType || 'image/jpeg',
      data: img.base64,
    },
  }));

  const userPromptPart = {
    text: 'Analise cuidadosamente todas as fotos do planejamento pedagógico anexadas. Identifique todos os componentes curriculares (Língua Portuguesa, Matemática, Ciências, etc.), consolide matérias que estejam divididas em várias fotos e gere as tabelas completas com as colunas padronizadas da BNCC conforme a instrução do sistema.',
  };

  const requestBody = {
    systemInstruction: {
      parts: [
        {
          text: BNCC_SYSTEM_INSTRUCTION,
        },
      ],
    },
    contents: [
      {
        role: 'user',
        parts: [...imageParts, userPromptPart],
      },
    ],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 8192,
    },
  };

  onProgress?.('A inteligência artificial está analisando imagens e estruturando tabelas...');

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
  } catch (netErr: unknown) {
    const errorMsg = netErr instanceof Error ? netErr.message : 'Falha na conexão de rede';
    throw new Error(`Erro ao conectar com a API do Gemini: ${errorMsg}. Verifique sua conexão com a internet.`);
  }

  if (!response.ok) {
    let errorDetail = '';
    try {
      const errorJson = await response.json();
      errorDetail = errorJson.error?.message || JSON.stringify(errorJson);
    } catch {
      errorDetail = await response.text();
    }

    if (response.status === 400 && errorDetail.includes('API_KEY_INVALID')) {
      throw new Error('A Chave de API do Gemini informada é inválida. Verifique o valor nas Configurações.');
    }
    if (response.status === 429) {
      throw new Error('Limite de requisições excedido (Rate Limit) na API do Gemini. Aguarde alguns instantes e tente novamente.');
    }

    throw new Error(`Erro na API (${response.status}): ${errorDetail || response.statusText}`);
  }

  const data = await response.json();
  const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textOutput) {
    if (data.candidates?.[0]?.finishReason === 'SAFETY') {
      throw new Error('A resposta foi bloqueada pelos filtros de segurança do modelo.');
    }
    throw new Error('A IA não retornou nenhum conteúdo textual para as imagens enviadas.');
  }

  return textOutput.trim();
}
