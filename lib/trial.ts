export const TESTE_FIM = new Date("2026-11-02T00:00:00-03:00");
export const TESTE_FIM_LABEL = "02/11";

export const testeExpirado = () => Date.now() >= TESTE_FIM.getTime();

// Demonstração: com false, o login é dispensado e o botão "Sair" some.
export const LOGIN_ATIVO = false;
