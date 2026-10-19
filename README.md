# 📚 Extrator Pedagógico BNCC (Fotos para Tabelas)

Aplicação web moderna para professores e coordenadores pedagógicos converterem fotos e imagens de planejamentos escolares em tabelas padronizadas da **Base Nacional Comum Curricular (BNCC)** através de inteligência artificial multimodal (Google Gemini API).

---

## 🚀 Funcionalidades

1. **Upload Flexível de Imagens:**
   - Seleção múltipla ou arrastar e soltar (*drag-and-drop*) de imagens (`JPG`, `PNG`, `WEBP`).
   - Galeria de *thumbnails* com tamanho dos arquivos, pré-visualização ampliada, remoção individual e botão para limpar todas as fotos.
   - Consolidação automática de matérias divididas em mais de uma foto na mesma tabela curricular.

2. **Integração Multimodal com Google Gemini:**
   - Envio de **todas as imagens juntas na mesma requisição** em `base64`.
   - Instrução do sistema (*systemInstruction*) rigorosamente alinhada às normas pedagógicas da rede pública e BNCC.
   - Suporte e seleção livre de modelos: `gemini-3.0-flash` (padrão recomendado), `gemini-3.0-pro`, `gemini-2.5-pro` ou customizado.
   - Chave de API configurável diretamente na interface (armazenada de forma segura no `localStorage`) ou via `.env` (`VITE_GEMINI_API_KEY`).
   - Teste de conexão em tempo real da chave da API.

3. **Padronização Fiel das Tabelas da BNCC:**
   - **Língua Portuguesa (4 colunas):**
     `| CAMPOS DE ATUAÇÃO | PRÁTICAS DE LINGUAGEM | OBJETOS DE CONHECIMENTO | HABILIDADES |`
   - **Demais Disciplinas (3 colunas):**
     `| CAMPOS DE ATUAÇÃO / UNIDADES TEMÁTICAS | OBJETOS DE CONHECIMENTO | HABILIDADES |`
   - Destacamento visual dos códigos alfanuméricos da BNCC (ex: `EF01LP01`, `EF02MA05`).

4. **Área de Resultados e Exportação Rápida:**
   - Alternância entre **Tabela Renderizada** (visual com bordas e cores estilizadas) e **Texto Puro (Markdown)**.
   - **Copiar Texto (Markdown):** Cópia instantânea em formato textual para editores de código ou markdown.
   - **Copiar Tabela (Word / Google Docs / Excel):** Copia o HTML renderizado via `ClipboardItem` com cabeçalhos e bordas para colar já formatado diretamente em editores de texto.
   - **Baixar .DOC:** Gera e faz download de um documento compatível com Microsoft Word em formato A4 Paisagem (ideal para tabelas de 4 colunas).
   - **Baixar .MD:** Faz download do arquivo em formato Markdown puro.

5. **Modo de Demonstração / Teste Imediato:**
   - Botão **"Testar com Exemplo"** que cria cadernos simulados e carrega uma extração completa da BNCC imediatamente, permitindo testar toda a exportação mesmo sem conexão ou chave de API no momento.

---

## 🛠️ Tecnologias Utilizadas

- **Vite + React (TypeScript)**
- **Tailwind CSS v4**
- **Lucide Icons**
- **Marked** (processamento de Markdown para HTML)
- **Google Gemini API** (IA Multimodal com visão computacional)

---

## 💻 Como Executar o Projeto Localmente

1. Instalar as dependências:
   ```bash
   npm install
   ```

2. Executar o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   Acesse no navegador: `http://localhost:5173/`

3. Gerar build de produção:
   ```bash
   npm run build
   ```
