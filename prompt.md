# PROMPT MESTRE - Sistema de Registro de Atendimento Psicológico TEA

Crie um sistema web mobile-first utilizando:

* Nuxt 3
* Vue 3 Composition API
* TailwindCSS
* Pinia
* Supabase
* PostgreSQL
* Deploy compatível com Vercel
* PWA Ready

O sistema será utilizado por profissionais da psicologia durante atendimentos de crianças autistas (TEA), com foco em registro rápido de eventos comportamentais em tempo real durante sessões clínicas.

O principal objetivo do sistema é registrar eventos de comportamento com precisão temporal, criando um log completo do atendimento.

# Requisitos Gerais

* O sistema deve ser totalmente responsivo
* O foco principal da experiência deve ser MOBILE
* Interface otimizada para celulares e tablets
* Os botões devem ser grandes e acessíveis
* O profissional não pode precisar desviar atenção da criança durante uso
* Priorizar UX rápida, clara e com poucos cliques
* Utilizar cores sem excesso visual
* O sistema deve ser preparado para futura funcionalidade offline
* Inicialmente o sistema funcionará online-first

# Autenticação

Utilizar Supabase Auth.

Somente profissionais podem acessar o sistema.

Fluxos:

* Login
* Logout
* Recuperação de senha

# Estrutura de Usuários

Profissional:

* id
* nome
* email
* telefone
* CRP
* foto
* especialidade
* observações

Paciente:

* id
* nome
* data_nascimento
* idade calculada
* endereço
* responsável
* telefone_responsável
* nível de suporte TEA
* diagnósticos
* medicações
* observações gerais
* foto

Relacionamento:

* Um profissional pode possuir vários pacientes
* Um paciente pode possuir vários profissionais
* Criar tabela relacional profissional_paciente

# Dashboard Inicial

Após login:

* listar pacientes vinculados ao profissional
* busca por nome
* cards simples e grandes
* exibir foto, nome e idade
* botão para abrir dashboard do paciente

# Dashboard do Paciente

Exibir:

* foto
* nome
* idade
* endereço
* diagnósticos
* medicações
* observações
* profissionais vinculados

Exibir histórico de atendimentos:

* data
* duração
* quantidade de R1
* quantidade de R2
* quantidade de eventos HRE
* botão visualizar relatório
* botão exportar PDF

Botão principal:
"Iniciar Atendimento"

# Fluxo Pré-Atendimento

Antes do atendimento iniciar:

* abrir tela de pré-atendimento
* profissional registra observações do estado atual do paciente
* campo de texto grande
* botão "Iniciar Atendimento"

Ao iniciar:

* salvar timestamp exato
* iniciar cronômetro

# Tela de Atendimento

A tela deve ocupar praticamente toda a altura do celular.

Layout vertical.

Exibir:

* cronômetro total do atendimento
* contador de R1
* contador de R2
* estado atual do paciente
* botão finalizar atendimento

# Card HRE

Card grande verde no topo.

Texto:
"HRE"

Subtexto:
"Happy, Relaxed and Engaged"

Função:

* pressionar por 2 segundos
* registrar evento HRE
* salvar horário exato

Quando HRE estiver ativo:

* tema da tela em verde suave
* sensação visual de estabilidade

# Card R2

Card amarelo no centro.

Função:

* arrastar para direita
* registrar evento R2
* abrir modal "Comportamento Problema"

R2 representa comportamento agressivo leve.

Após registrar:

* retornar automaticamente para tela principal de atendimento

# Card R1

Card vermelho abaixo do R2.

Função:

* arrastar para esquerda
* registrar evento R1
* abrir modal "Comportamento Problema"

R1 representa crise severa.

Ao registrar R1:

* alterar tema da tela temporariamente para vermelho
* transmitir sensação visual de alerta
* exibir mensagem calma para o profissional:

"Respire fundo. Oriente o paciente da maneira mais segura e acolhedora possível."

Registrar:

* horário inicial
* intensidade
* comportamentos associados

O sistema deve permitir encerrar o estado de crise posteriormente para calcular duração do R1.

# Modal Comportamento Problema

Deve permitir múltiplos comportamentos por ocorrência.

Estrutura expansível.

Inicialmente incluir:

* Auto-lesivo
* Agressão
* Choro
* Fuga

Permitir:

* intensidade de 1 a 5
* observações rápidas

Modelar estrutura preparada para adicionar novos comportamentos futuramente sem alterar código principal.

# Rodapé de Observações

Na parte inferior da tela:

* campo de texto rápido
* botão de voz apenas visual neste MVP
* salvar observações com timestamp

# Finalização do Atendimento

Botão:
"Finalizar Atendimento"

Ao finalizar:

* salvar horário final
* calcular duração total
* salvar todos eventos
* retornar para dashboard do paciente

# Relatórios

Cada atendimento deve possuir relatório detalhado.

Exibir:

* duração total
* timeline completa
* horário de todos eventos
* quantidade de R1
* quantidade de R2
* duração das crises
* intensidade média
* comportamentos mais registrados
* observações realizadas
* períodos de HRE

Permitir:

* exportar PDF

# Banco de Dados

Modelar tabelas:

* professionals
* patients
* professional_patients
* appointments
* appointment_events
* event_behaviors
* behavior_types
* appointment_notes

# Eventos

Todos eventos devem possuir:

* timestamp
* tipo
* intensidade
* profissional responsável
* atendimento relacionado

Tipos:

* HRE
* R1_START
* R1_END
* R2
* NOTE

# UX e Design

Diretrizes:

* minimalista
* clean
* foco absoluto em rapidez
* evitar excesso de informação
* excelente contraste
* acessível
* animações suaves
* feedback tátil preparado para futuro

# Requisitos Técnicos

* Utilizar Supabase Row Level Security
* Estruturar projeto por módulos
* Criar composables reutilizáveis
* Utilizar TypeScript
* Utilizar validação de formulários
* Preparar arquitetura para futura sincronização offline
* Evitar código duplicado
* Componentizar corretamente

# Entregáveis Esperados

Gerar:

* arquitetura de pastas
* modelagem do banco
* SQL inicial
* telas
* componentes
* stores Pinia
* composables
* rotas
* middleware auth
* fluxo completo do sistema
* exemplos de componentes críticos
* estrutura pronta para evolução futura
