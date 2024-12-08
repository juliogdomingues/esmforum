const bd = require("../bd/bd_utils.js");
const modelo = require("../modelo.js");

beforeEach(() => {
  bd.reconfig("./bd/esmforum-teste.db");
  // limpa dados de todas as tabelas
  bd.exec("delete from perguntas", []);
  bd.exec("delete from respostas", []);
});

test("Testando banco de dados vazio", () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test("Testando cadastro de três perguntas", () => {
  modelo.cadastrar_pergunta("1 + 1 = ?");
  modelo.cadastrar_pergunta("2 + 2 = ?");
  modelo.cadastrar_pergunta("3 + 3 = ?");
  const perguntas = modelo.listar_perguntas();
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe("1 + 1 = ?");
  expect(perguntas[1].texto).toBe("2 + 2 = ?");
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta - 1);
});

test("Testando cadastro de uma resposta", () => {
  const id_pergunta = modelo.cadastrar_pergunta("Quanto é 5 + 5?");
  const id_resposta = modelo.cadastrar_resposta(id_pergunta, "10");
  const respostas = modelo.get_respostas(id_pergunta);
  expect(respostas.length).toBe(1);
  expect(respostas[0].texto).toBe("10");
  expect(respostas[0].id_resposta).toBe(id_resposta);
});

test("Testando recuperação de uma pergunta por ID", () => {
  const id_pergunta = modelo.cadastrar_pergunta("Quanto é 10 - 3?");
  const pergunta = modelo.get_pergunta(id_pergunta);
  expect(pergunta.texto).toBe("Quanto é 10 - 3?");
  expect(pergunta.id_pergunta).toBe(id_pergunta);
});

test("Testando listagem de respostas por ID da pergunta", () => {
  const id_pergunta = modelo.cadastrar_pergunta("Qual a capital do Brasil?");
  modelo.cadastrar_resposta(id_pergunta, "Brasília");
  modelo.cadastrar_resposta(id_pergunta, "São Paulo");
  const respostas = modelo.get_respostas(id_pergunta);
  expect(respostas.length).toBe(2);
  expect(respostas[0].texto).toBe("Brasília");
  expect(respostas[1].texto).toBe("São Paulo");
});

test("Testando número de respostas associadas a uma pergunta", () => {
  const id_pergunta = modelo.cadastrar_pergunta("Quanto é 20 / 4?");
  modelo.cadastrar_resposta(id_pergunta, "5");
  modelo.cadastrar_resposta(id_pergunta, "4");
  const num_respostas = modelo.get_num_respostas(id_pergunta);
  expect(num_respostas).toBe(2);
});

test("Testando busca de respostas inexistentes", () => {
  const respostas = modelo.get_respostas(9999); // ID que não existe
  expect(respostas.length).toBe(0);
});
