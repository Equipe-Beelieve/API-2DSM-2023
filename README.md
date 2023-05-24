<span id="topo"></span>
<h1 align="center">FATEC Prof Jessen Vidal, São José dos Campos - 2º Semestre DSM 2023</h1>
<p align="center">
    <a href="#sobre">Sobre</a> | 
    <a href="#entregas">Entregas</a> | 
    <a href="#backlogs">Backlogs</a> |
    <a href="#dorDod">DoR e DoD</a>|
    <a href="#tecnologias">Tecnologias</a> | 
    <a href="#equipe">Equipe</a> | 
</p>

<span id="sobre"></span>
<h2> Sobre o projeto </h2> 
Projeto desenvolvido por alunos do 2º semestre do curso de Desenvolviento de Software Multiplatafora, da FATEC Prof Jessen Vidal em São José dos Campos. <br> Consiste no Desenvolvimento de um sistema de inspeção de entrada pra controle de recebimento de grãos em uma agroindústria.<br>
O Back-end foi desenvolvido em TypeScript utilizando o framework express e o banco de dados foi o SQL com o SGBD MySQL.<br>
>Status do projeto: Em desenvolvimento :hourglass:

<span id="entregas"></span>
<h2>Entregas</h2>
O projeto está sendo realizado utilizando-se da metodologia ágil SCRUM, separadas em 4 entregas com sprints de 21 dias de duração cada uma.
<br /><br />
<img src="docs/imagens/linhaTempo.png" src="Linha do tempo">
<br />
Resultado das entregas de cada sprint:

* <a href="docs/sprint1/demo_sprint1.gif">Sprint 1</a>
* <a href="docs/sprint2/demo_sprint2.gif">Sprint 2</a>
* <a href="docs/sprint3/demo_sprint3.gif">Sprint 3</a>
<span id="backlogs"></span>
<h2>Backlog</h2>
<h3>Backlog do Produto</h3>

| Sprint | Funcionalidade |
| :--:   | :-----------:  |
| **01** | Cadastro de pedido |
| **01** | Cadastro de fornecedor | 
| **01** | Listagem de pedidos cadastrados |
| **01** | Listagem de fornecedores cadastrados |
| **02** | Cadastro de produto | 
| **02** | Cadastro de usuário |
| **02** | Deve haver diferentes níveis de acesso (usuário comum, gerente e administrador) | 
| **02** | Listagem de usuários cadastrados | 
| **02** | Listagem de produtos cadastrados |
| **03** | Cadastro de regras de recebimento | 
| **03** | Na fase de entrada do matérial, deve haver a inserção dos dados da nota fiscal |
| **03** | Na fase de conferência quantitativa, deve haver a inserção da quantidade do material em análise |
| **03** | Filtragem da lista de pedidos por etapa do processo |
| **03** | Sistema de buscas para as páginas de listagem | 
| **03** | Deverá ser possível voltar em fases anteriores do processo de entrada de material |
| **03** | Na fase de conferência qualitativa, o usuário deverá ter acesso há uma tela que o permite informar se há avarias, se o laudo veio anexado à nota fiscal e as informações relacionadas às regras de recebimento |
| **04** | O Sistema deve gerar um relatório final com a decisão de aceite ou recusa (feita pelo próprio sistema a partir das regras de négocio e da comparação dos dados inseridos). |
| **04** | Sistema deve guardar inforamções de entregas armazenadas (etregas que foram aceitas pelo administrador), bem como mostrar o que há no armazem |
| **04** | Alteração de dados de fornecedores cadastrados |
| **04** | Alteração de dados de usuários cadastrados |
| **04** | Alteração de dados do produtos cadastrados |

<h3>Referência das User Stories</h3>

A User Story de cada funcionalidade do projeto pode ser encontrada nesse <a href="docs/userStory.png">link</a><br />

<span id="dorDod"></span>

<h2>Definition of Ready e Definition of Done</h2>
Todos os documentos desses artefatos são encontrados na pasta docs do repositório

Os artefatos usados pelo nossa equipe para identificar que uma tarefa está pronta para ser iniciado (DoR) foram:
* <a href="#backlogs">BackLog do Produto:</a><br />
Lista com os requisitos do projeto priorizados, que nos auxiliam a chegar a um MVP (Mínimo Produto Viável) na sprint.
* <a href="docs/modelo_logico.jpg">Modelo Lógico do banco de dados:</a><br />
Modelo com as tabelas, colunas e os tipos de dados que serve como base para a construção física do banco de dados.
* <a href="docs/casosTeste/">Casos de Teste:</a><br />
Modelo com os testes que cada requisito precisa cumprir após sua conclusão. Isso nos ajuda a desenvolver o requisito baseado nos testes que ele precisa passar.
* <a href="docs/Sabiá-Mockup.jpg">Mockup:</a><br />
Modelo com os esboços das telas da nossa aplicação. Ajudou posteriormente no desenvolvimento do prótotipo.
* <a href="docs/criteriosAceitacao.pdf">Critérios de Aceitação:</a><br />
Lista de itens que exemplificam o funcionamento dos requisitos baseados nas suas User Stories.

Baseado nos DoR chegamos a esses critérios para considerar um requisito como entregue, podendo ser incrementado a entrega do projeto (DoD):
* <a href="backEnd/bd">O modelo físico:</a><br />
Modelo físico do banco de dados seguindo o padrão do modelo lógico.
* <a href="https://www.figma.com/proto/1BLzM65qzng5exjhuqab28/SABI%C3%81?node-id=45-100&starting-point-node-id=45%3A100&scaling=contain" target="_blank">Protótipo:</a><br />
Telas da aplicação baseada nas telas do protótipo.
* <a href="docs/casosTeste/">Os resultados dos testes de cada funcionalidade:</a><br />
Esses resultados devem seguir os resulatados propostos na tabela de casos de teste.

<span id="tecnologias"></span>

<h2> Tecnologias utilizadas </h2>
<img src="docs/imagens/tecnologias1.jpg" alt="HTML5, CSS3, Javascript, Typescript, Node.js, Express, MySQL, Miro, Jira, Figma e Discord">

<span id="equipe"></span>
<h2> Equipe </h2>

|    Função     | Foto       | Nome                                |                     GitHub                   |
| :----------:  | :-----------: | :-----------------------            | :------------------------------------------: |
|   Product Owner    | <img src="docs/imagens/fotoBruno.png" alt="Foto Bruno"> | Bruno Denardo                  | [GitHub](https://github.com/brunodenardo)    |
|   Scrum Master   | <img src="docs/imagens/fotoMatheus.png" alt="Foto Matheus"> | Matheus Fernando Vieira de Melo  | [GitHub](https://github.com/Matheusfvm)      |
| Dev Team | <img src="docs/imagens/fotoRenan.png" alt="Foto Renan"> | Renan Souza Neves                        | [Github](https://github.com/Renan-Neves)     |
| Dev Team  | <img src="docs/imagens/fotoVinicius.png" alt="Foto Vinícius"> | Vinicius de Oliveira Laranjeiro         | [GitHub](https://github.com/noo-e)           |
|   Dev Team    | <img src="docs/imagens/fotoMurilo.png" alt="Foto Murilo"> | Murilo Henrique Sangi da Silva Lima | [GitHub](https://github.com/MuriloLima03)    |
| Dev Team | <img src="docs/imagens/fotoAugusto.png" alt="Foto Augusto"> | Augusto Henrique Buin                    | [GitHub](https://github.com/AugustoBuin)     |
| Dev Team | <img src="docs/imagens/fotoPedro.png" alt="Foto Pedro"> | Pedro Henrique Silva Almeida             | [GitHub](https://github.com/PedroHSdeAlmeida) |
| Dev Team | <img src="docs/imagens/fotoAline.png" alt="Foto Aline"> | Aline C. Correa Costa                   | [GitHub](https://github.com/acorreac) |
| Dev Team | <img src="docs/imagens/fotoJose.png" alt="Foto Jose"> | José V. H. Lopes de Souza                   | [GitHub](https://github.com/HenningerJv) |
