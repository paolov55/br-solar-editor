// Termos de uso. Ao alterar o texto, mude TERMOS_VERSAO: todos os usuários
// precisarão aceitar novamente no próximo acesso.
// Os trechos entre colchetes [ ] devem ser preenchidos pelo titular da plataforma.
export const TERMOS_VERSAO = "2026-11-04";
export const TERMOS_DATA_LABEL = "04 de novembro de 2026";

export type SecaoTermo = { titulo: string; paragrafos: string[] };

export const TERMOS: SecaoTermo[] = [
  {
    titulo: "1. Objeto",
    paragrafos: [
      "Estes Termos de Uso regulam o acesso e a utilização da plataforma BR Solar Editor (“Plataforma”), ferramenta online para elaboração de faturas, documentação contratual e propostas comerciais, disponibilizada por [NOME E CPF/CNPJ DO TITULAR] (“Titular”) ao usuário autorizado (“Usuário”).",
      "Ao marcar a opção “Li e aceito” e continuar, o Usuário declara que leu, compreendeu e concorda com todas as regras abaixo. Sem esse aceite, a Plataforma não pode ser utilizada.",
    ],
  },
  {
    titulo: "2. Acesso e credenciais",
    paragrafos: [
      "O acesso é feito por login e senha fornecidos pelo Titular. As credenciais são pessoais e intransferíveis: o Usuário não deve compartilhá-las nem permitir o uso da conta por terceiros.",
      "O Usuário é responsável por toda atividade realizada com as suas credenciais e deve comunicar imediatamente o Titular em caso de suspeita de uso indevido, para que a senha seja substituída.",
      "A sessão permanece ativa por até 7 dias em cada dispositivo. Em computadores compartilhados, o Usuário deve encerrar a sessão no botão “Sair”.",
    ],
  },
  {
    titulo: "3. Mensalidade",
    paragrafos: [
      "O uso da Plataforma é remunerado por mensalidade de R$ 150,00 (cento e cinquenta reais), cobrada uma vez por mês, com vencimento no dia informado na tela “Pagamentos”.",
      "O Titular pode reajustar o valor da mensalidade mediante aviso prévio ao Usuário; o novo valor vale apenas para as cobranças geradas depois do aviso.",
      "O Usuário pode consultar a qualquer momento, na tela “Pagamentos”, a situação da mensalidade atual e o histórico completo de pagamentos efetuados.",
    ],
  },
  {
    titulo: "4. Forma de pagamento",
    paragrafos: [
      "Os pagamentos são processados exclusivamente pela plataforma Mercado Pago, por Pix, cartão ou boleto, conforme as opções disponíveis no checkout. A Plataforma não recebe nem armazena dados de cartão ou dados bancários do Usuário.",
      "A confirmação do pagamento depende do Mercado Pago. Pagamentos por boleto podem levar alguns dias úteis para serem compensados, e o acesso é regularizado somente após a confirmação.",
      "Valores já pagos não são reembolsáveis proporcionalmente por períodos não utilizados, salvo obrigação legal em contrário.",
    ],
  },
  {
    titulo: "5. Lembrete, atraso e bloqueio",
    paragrafos: [
      "A partir de 5 dias antes do vencimento, a Plataforma exibirá um aviso lembrando o Usuário de pagar a mensalidade.",
      "Se o pagamento não for confirmado até a data de vencimento, o acesso às funcionalidades da Plataforma será bloqueado automaticamente a partir do dia seguinte. Durante o bloqueio, o Usuário continua podendo acessar a tela “Pagamentos” para regularizar a situação.",
      "Confirmado o pagamento, o acesso é restabelecido automaticamente, sem necessidade de nova solicitação. Mensalidades em atraso devem ser quitadas para o desbloqueio.",
    ],
  },
  {
    titulo: "6. Dados e responsabilidade do Usuário",
    paragrafos: [
      "Os dados digitados nos editores (clientes, faturas, documentos e propostas) ficam armazenados no navegador do dispositivo utilizado. Eles não são copiados para os servidores da Plataforma e não são sincronizados entre dispositivos ou navegadores.",
      "Por isso, limpar os dados de navegação, trocar de navegador ou de computador, ou usar uma janela anônima pode causar a perda dessas informações. É responsabilidade do Usuário exportar e guardar cópias dos documentos que precisar conservar.",
      "O Usuário é o único responsável pelo conteúdo que insere e pelos documentos que gera (valores, cálculos, dados de clientes, cláusulas e condições comerciais), devendo conferi-los antes de emiti-los ou enviá-los a terceiros. A Plataforma é uma ferramenta de apoio e não substitui a revisão profissional, inclusive jurídica e contábil.",
      "O Usuário declara possuir autorização para tratar os dados pessoais de terceiros que inserir na Plataforma e responde por esse tratamento perante a legislação aplicável.",
    ],
  },
  {
    titulo: "7. Uso adequado",
    paragrafos: [
      "É proibido utilizar a Plataforma para fins ilícitos, tentar burlar o bloqueio de pagamento ou os mecanismos de segurança, realizar engenharia reversa, copiar ou revender a Plataforma, ou sobrecarregá-la com acessos automatizados.",
      "O descumprimento destas regras autoriza o Titular a suspender ou encerrar o acesso, sem prejuízo de outras medidas cabíveis.",
    ],
  },
  {
    titulo: "8. Propriedade intelectual",
    paragrafos: [
      "A Plataforma, seu código, layout, modelos e textos-base pertencem ao Titular ou a seus licenciantes. O pagamento da mensalidade concede ao Usuário apenas uma licença de uso pessoal, não exclusiva e não transferível, durante a vigência do acesso.",
      "Os documentos gerados pelo Usuário a partir dos seus próprios dados são de uso livre por ele.",
    ],
  },
  {
    titulo: "9. Disponibilidade e limitação de responsabilidade",
    paragrafos: [
      "O Titular empenha-se em manter a Plataforma disponível, mas não garante funcionamento ininterrupto ou livre de falhas, podendo haver indisponibilidades por manutenção ou por falhas de serviços de terceiros (hospedagem, Mercado Pago, internet).",
      "Na extensão permitida em lei, o Titular não responde por lucros cessantes, perda de dados armazenados no navegador, erros de conteúdo nos documentos gerados ou prejuízos decorrentes do uso indevido da Plataforma ou do compartilhamento de credenciais.",
    ],
  },
  {
    titulo: "10. Privacidade (LGPD)",
    paragrafos: [
      "Para operar a Plataforma, são tratados: o login do Usuário, o histórico e a situação de pagamentos, e, no aceite destes Termos, o endereço IP, o navegador utilizado e a data e hora do aceite. Esses dados são usados apenas para autenticação, cobrança, comprovação do aceite e segurança, com base na execução do contrato e no cumprimento de obrigações legais.",
      "Os dados de pagamento são tratados pelo Mercado Pago conforme a política de privacidade da própria empresa. Os dados não são vendidos nem compartilhados com terceiros, exceto quando necessário para o processamento do pagamento ou por determinação legal.",
      "O Usuário pode solicitar ao Titular, a qualquer momento, informações sobre os seus dados, correção ou exclusão, nos termos da Lei nº 13.709/2018.",
    ],
  },
  {
    titulo: "11. Alterações destes Termos",
    paragrafos: [
      "O Titular pode atualizar estes Termos a qualquer tempo. Havendo alteração, será exibida uma nova versão no próximo acesso e o Usuário precisará aceitá-la para continuar utilizando a Plataforma.",
    ],
  },
  {
    titulo: "12. Cancelamento",
    paragrafos: [
      "O Usuário pode deixar de utilizar a Plataforma a qualquer momento, bastando comunicar o Titular e quitar as mensalidades já vencidas. O Titular pode encerrar o acesso mediante aviso, ou imediatamente em caso de violação destes Termos ou de inadimplência prolongada.",
    ],
  },
  {
    titulo: "13. Foro",
    paragrafos: [
      "Estes Termos são regidos pelas leis brasileiras. Fica eleito o foro da comarca de [CIDADE/UF] para dirimir quaisquer controvérsias, com renúncia a qualquer outro, por mais privilegiado que seja.",
    ],
  },
];
