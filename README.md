<span id="topo"></span>
<h1 align="center">FATEC Prof Jessen Vidal, São José dos Campos - 2º Semestre DSM 2023</h1>
<p align="center">
    <a href="#sobre">Sobre</a> | 
    <a href="#instalacao">Instalação</a> |
    <a href="#entregas">Entregas</a> | 
    <a href="#backlogs">Backlogs</a> |  
    <a href="#tecnologias">Tecnologias</a> | 
    <a href="#equipe">Equipe</a> | 
</p>

<span id="sobre"></span>
<h2> Sobre o projeto </h2> 
Projeto desenvolvido por alunos do 2º semestre do curso de Desenvolviento de Software Multiplatafora, da FATEC Prof Jessen Vidal em São José dos Campos. <br> Consiste no Desenvolvimento de um sistema de inspeção de entrada pra controle de recebimento de grãos em uma agroindústria.<br>
O Back-end foi desenvolvido em TypeScript utilizando o framework express e o banco de dados foi o SQL com o SGBD MySQL.<br>
>Status do projeto: Em desenvolvimento :hourglass:

<span id="instalcao"></span>
<h2> Instalação e utilização da aplicação </h2>

<span id="entregas"></span>
<h2>Entregas</h2>
O projeto está sendo realizado utilizando-se da metodologia ágil SCRUM, separadas em 4 entregas com sprints de 21 dias de duração cada uma. <br>

| Sprint| Período | Status |
|:-----:|:----------:|:---------:|
| 01 |   13/03/2023 - 02/04/2023 | Entregue :hourglass: | 
| 02 |   03/04/2023 - 23/04/2023 | Entregue :hourglass: |  
| 03 |   24/04/2023 - 14/05/2023 | Entregue :hourglass: | 
| 04 |   15/05/2023 - 04/06/2023 | Pendente :hourglass: | 

<span id="backlogs"></span>
<h2>Backlogs</h2>
<h3>Backlog do Produto</h3>

| Sprint | Funcionalidade | User Story |
| :--:      | :--------------:  |:--:    |
| **01** | Protótipo navegável | **--** |
| **01** | Cadastro de pedido. | **01** |
| **02** | Cadastro de produto. | **02** |
| **02** | Cadastro de regras de recebimento. | **03** |
| **02** | Cadastro de fornecedor. | **04** |
| **02** | Cadastro de usuário. | **05** |
| **02** | Deve haver diferentes níveis de acesso (usuário comum e administrador). | **06** |
| **03** | Na fase de entrada do matérial deve haver a inserção dos dados da nota fiscal. | **07** |
| **03** | O sistema deve comparar os dados da nota fiscal com o do relatório de compras. | **08** |
| **03** | O sistema deve comparar os valores da conferência quantitativa com a nota fiscal e disponibilizar o resultado para a análise do usuário. | **09** |
| **03** | Na fase de conferência qualitativa, o usuário deverá ter acesso há uma tela que o permite informar se há avarias e se o laudo veio anexado á nota fiscal. | **10** |
| **04** | O Sistema deve gerar um relatório final com a decisão de aceite ou recusa (feita pelo próprio sistema a partir das regras de négocio). | **11** |
| **04** | Sistema deve guardar inforamções de entregas armazenadas (etregas que foram aceitas), bem como mostrar o que há no armazem. | **12** |

<h3>Referência das User Stories</h3>

| ID | User Stories |
| :--:   | :----------------:  |
| **01** | Eu como usuário comum desejo cadastrar os dados de pedidos e vê-los listados, para armazenar e gerenciar os pedidos. |
| **02** | Eu como usuário comum desejo cadastrar produtos, para manter a integridade dos dados relacionados ao conteúdo dos pedidos. |
| **03** | Eu como usuário comum desejo cadastrar a regras de recebimento, para que elas se adquem a diferentes produtos e situações. |
| **04** | Eu como usuário comum desejo cadastrar os dados do fornecedor, para manter a integridade dos dados de cada fornecedotr. |
| **05** | Eu como administrador desejo cadastrar os trabalhadores (usuário comum), para permitir a eles o acesso ao sistema. |
| **06** | Eu como administrador desejo que o sistema tenha diferentes níveis de acesso, para que os demais usuários não tenham acesso à funcionalidades críticas e dados sensíveis. |
| **07** | Eu como usuário comum desejo marcar um pedido como recebido e inserir os dados da nota fiscal, para armazenar os dados da nota fiscal e proceguir o processo de entrada de material. |
| **08** | Eu como usuário comum desejo que o sistema faça a comparação entre os dados da nota fiscal e do relatório de compras, para identificar possíveis inconsistências. |
| **09** | Eu como usuário comum desejo que o sistema faça a comparação entre os dados da nota fiscal e o dados do conferência  quantitativa, para identificar possíveis inconsistências. |
| **10** | Eu como usuário comum desejo que o sistema informe se o produto não está avariado e de acordo com os dados do laudo, para realizar a análise qualitativa.|
| **11** | Eu como usuário comum desejo ter acesso ao relatório final e à decisão de aceite ou recusa do matérial, para conferir quais foram as inconsistências do pedido. |
| **12** | Eu como usuário comum desejo ter acesso aos dados dos produtos já recebidos para gerenciar o estoque. |

<h3>Backlog das sprints</h3>
<h4>Sprint 1</h4>

| Item | Funcionalidade |
| :--:   | :----------------  |
| **01** | Protótipo navegável. |
| **02** | Cadastro de pedido. |

<h4>Sprint 2</h4>

| Item | Funcionalidade |
| :--:   | :----------------   |
| **01** | Cadastro de produto. |
| **02** | Cadastro de regras de recebimento. |
| **03** | Cadastro de fornecedor. |
| **04** | Cadastro de usuário. |
| **05** | Deve haver diferentes níveis de acesso (usuário comum e usuário administrador). |

<h4>Sprint 3</h4>

| Item | Funcionalidade |
| :--:   | :---------------- |
| **01** | Cadastro de produto. |
| **02** | Cadastro de regras de recebimento. |
| **03** | Cadastro de fornecedor. |
| **04** | Cadastro de usuário. |
| **05** | Deve haver diferentes níveis de acesso (usuário comum e usuário administrador). |

<h4>Sprint 4</h4>

| Item | Funcionalidade |
| :--:   | :---------------- |
| **01** | O Sistema deve gerar um relatório final com a decisão de aceite ou recusa (feita pelo próprio sistema a partir das regras de négocio). |
| **02** | Sistema deve guardar inforamções de entregas armazenadas (etregas que foram aceitas), bem como mostrar o que há no armazem. |

<span id="tecnologias"></span>
<h2> Tecnologias utilizadas </h2>

<span id="equipe"></span>
<h2> Equipe </h2>

|    Função     | Nome                                |                     GitHub                   |
| :----------:  | :-----------------------            | :------------------------------------------: |
|   Product Owner    | Bruno Denardo                  | [GitHub](https://github.com/brunodenardo)    |
|   Scrum Master   | Matheus Fernando Vieira de Melo  | [GitHub](https://github.com/Matheusfvm)      |
| Dev Team | Renan Souza Neves                        | [Github](https://github.com/Renan-Neves)     |
| Dev Team  | Vinicius de Oliveira Laranjeiro         | [GitHub](https://github.com/noo-e)           |
|   Dev Team    | Murilo Henrique Sangi da Silva Lima | [GitHub](https://github.com/MuriloLima03)    |
| Dev Team | Augusto Henrique Buin                    | [GitHub](https://github.com/AugustoBuin)     |
| Dev Team | Pedro Henrique Silva Almeida             | [GitHub](https://github.com/PedroHSdeAlmeida) |
