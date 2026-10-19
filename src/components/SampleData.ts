export const SAMPLE_MARKDOWN_RESULT = `## Língua Portuguesa

| CAMPOS DE ATUAÇÃO | PRÁTICAS DE LINGUAGEM | OBJETOS DE CONHECIMENTO | HABILIDADES |
| :--- | :--- | :--- | :--- |
| Todos os campos de atuação | Leitura/escuta (compartilhada e autônoma) | Decodificação/Fluência de leitura | (EF12LP01) Ler palavras novas com precisão na decodificação, no caso de palavras de uso frequente, ler globalmente, por memorização. |
| Todos os campos de atuação | Escrita (compartilhada e autônoma) | Correspondência fonema-grafema | (EF01LP02) Escrever, espontaneamente ou por ditado, palavras e frases de forma alfabética – usando letras que representem fonemas. |
| Vida cotidiana | Leitura/escuta (compartilhada e autônoma) | Compreensão em leitura | (EF12LP04) Ler e compreender, em colaboração com os colegas e com a ajuda do professor, listas, agendas, calendários, avisos, convites e receitas. |
| Artístico-literário | Leitura/escuta (compartilhada e autônoma) | Formação do leitor literário | (EF12LP18) Apreciar poemas e outros textos versificados, observando rimas, sonoridades, jogos de palavras e reconhecendo seu pertencimento ao mundo imaginário. |

## Matemática

| CAMPOS DE ATUAÇÃO / UNIDADES TEMÁTICAS | OBJETOS DE CONHECIMENTO | HABILIDADES |
| :--- | :--- | :--- |
| Números | Contagem de rotina e contagem ascendente e descendente | (EF01MA01) Utilizar números naturais como indicador de quantidade ou de ordem em diferentes situações cotidianas e reconhecer situações em que os números não indicam contagem nem ordem. |
| Números | Quantificação de elementos de uma coleção: estimativas e contagem um a um | (EF01MA02) Contar de maneira exata ou aproximada, utilizando diferentes estratégias como o pareamento e outros agrupamentos. |
| Geometria | Figuras geométricas espaciais: reconhecimento e relações com objetos familiares | (EF01MA13) Relacionar figuras geométricas espaciais (cones, cilindros, esferas e blocos retangulares) a objetos familiares do mundo físico. |
| Probabilidade e Estatística | Leitura de tabelas e de gráficos de colunas simples | (EF01MA21) Ler dados expressos em tabelas e em gráficos de colunas simples com base em informações cotidianas. |

## Ciências

| CAMPOS DE ATUAÇÃO / UNIDADES TEMÁTICAS | OBJETOS DE CONHECIMENTO | HABILIDADES |
| :--- | :--- | :--- |
| Vida e evolução | Corpo humano e respeito à diversidade | (EF01CI02) Localizar, nomear e representar graficamente partes do corpo humano e explicar suas funções. |
| Vida e evolução | Hábitos de higiene | (EF01CI03) Discutir as razões pelas quais os hábitos de higiene do corpo (lavar as mãos antes de comer, escovar os dentes, etc.) são necessários para a manutenção da saúde. |
`;

/**
 * Cria imagens simuladas em canvas para testes rápidos de upload
 */
export function createSampleImageFiles(): { file: File; previewUrl: string }[] {
  const samples = [
    {
      title: 'Planejamento Semanal - Foto 1 (Português)',
      date: '10/03/2026',
      subject: 'Língua Portuguesa - 1º Ano',
      color: '#1e3a8a',
    },
    {
      title: 'Planejamento Semanal - Foto 2 (Matemática e Ciências)',
      date: '11/03/2026',
      subject: 'Matemática e Ciências da Natureza',
      color: '#047857',
    },
  ];

  return samples.map((sample, idx) => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Fundo papel pautado
      ctx.fillStyle = '#faf8f5';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Linhas de caderno
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      for (let y = 140; y < canvas.height; y += 32) {
        ctx.beginPath();
        ctx.moveTo(40, y);
        ctx.lineTo(canvas.width - 40, y);
        ctx.stroke();
      }

      // Linha margem vermelha
      ctx.strokeStyle = '#fca5a5';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(110, 0);
      ctx.lineTo(110, canvas.height);
      ctx.stroke();

      // Cabeçalho
      ctx.fillStyle = sample.color;
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText(sample.title, 130, 80);

      ctx.fillStyle = '#475569';
      ctx.font = '18px sans-serif';
      ctx.fillText(`Data: ${sample.date} | Disciplina: ${sample.subject}`, 130, 115);

      // Conteúdo simulado
      ctx.fillStyle = '#1e293b';
      ctx.font = '20px serif';
      if (idx === 0) {
        ctx.fillText('1. Campo de Atuação: Todos os campos / Vida cotidiana', 130, 180);
        ctx.fillText('2. Práticas de Linguagem: Leitura e Escrita autônoma', 130, 244);
        ctx.fillText('3. Objetos: Correspondência fonema-grafema, fluência', 130, 308);
        ctx.fillText('4. Habilidades BNCC:', 130, 372);
        ctx.fillStyle = '#1d4ed8';
        ctx.font = 'bold 20px monospace';
        ctx.fillText('   - EF12LP01 (Fluência e leitura de palavras)', 130, 436);
        ctx.fillText('   - EF01LP02 (Escrita espontânea e fonemas)', 130, 500);
        ctx.fillText('   - EF12LP04 (Compreensão de listas e agendas)', 130, 564);
      } else {
        ctx.fillText('1. Unidade Temática: Números e Geometria Espacial', 130, 180);
        ctx.fillText('2. Objetos de Conhecimento: Contagem e figuras espaciais', 130, 244);
        ctx.fillText('3. Habilidades BNCC:', 130, 308);
        ctx.fillStyle = '#047857';
        ctx.font = 'bold 20px monospace';
        ctx.fillText('   - EF01MA01 (Contagem e números no cotidiano)', 130, 372);
        ctx.fillText('   - EF01MA02 (Estimativas e agrupamentos)', 130, 436);
        ctx.fillText('   - EF01MA13 (Figuras geométricas do mundo físico)', 130, 500);
        ctx.fillStyle = '#1e293b';
        ctx.font = '20px serif';
        ctx.fillText('4. Ciências: Corpo humano e hábitos de higiene', 130, 628);
        ctx.fillStyle = '#047857';
        ctx.font = 'bold 20px monospace';
        ctx.fillText('   - EF01CI02 / EF01CI03 (Higiene e saúde)', 130, 692);
      }

      // Carimbo pedagógico simulado
      ctx.save();
      ctx.translate(560, 820);
      ctx.rotate(-0.1);
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 3;
      ctx.strokeRect(0, 0, 190, 80);
      ctx.fillStyle = '#dc2626';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('VISTO COORDENAÇÃO', 12, 35);
      ctx.font = '14px sans-serif';
      ctx.fillText('Planejamento Aprovado', 15, 60);
      ctx.restore();
    }

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    // Converte dataUrl para File
    const arr = dataUrl.split(',');
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const file = new File([u8arr], `planejamento_foto_${idx + 1}.jpg`, { type: 'image/jpeg' });

    return {
      file,
      previewUrl: dataUrl,
    };
  });
}
