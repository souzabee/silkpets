# SilkPets

Rede social de pets feita em React Native: cada pet tem um perfil com seus dados de saúde e pode publicar, curtir e comentar no feed da comunidade.
Projeto da disciplina CCP150 - Desenvolvimento de Aplicativos Móveis (FEI).

## Visão Geral e Requisitos

**Tema:** rede social e cuidado com pets.

**Motivação:** tutores gostam de mostrar o dia a dia dos seus pets e, ao mesmo tempo, esquecem a situação das vacinas e o nome do veterinário. O SilkPets junta as duas coisas em um só lugar.

**Objetivo:** ser uma rede social em que quem publica são os pets. O tutor cadastra seus pets, mantém os dados de saúde deles e usa os pets para publicar, curtir e comentar.

Requisitos do projeto e como foram atendidos:

| Requisito | Como foi atendido |
|---|---|
| Mínimo de 6 telas | 11 telas: Entrar, Criar conta, Home, Feed, Nova publicação, Publicação, Pets, Cadastrar pet, Perfil do pet, Editar pet e Sobre o app |
| React Navigation | Stack Navigator (`@react-navigation/native-stack`) |
| Imagens | Banner da Home e uma imagem para cada espécie (cachorro, gato e outro), usada como avatar no feed, nos comentários e no perfil |
| Interface e UX | Layout em cartões, cores e espaçamento consistentes, mensagens de sucesso e de erro, indicador de carregamento, confirmação antes de excluir e botão "Tentar novamente" |
| Banco de dados (CRUD) | Firebase Firestore, com CRUD completo de pets (coleção `pets`) e de publicações (coleção `posts`), além das contas dos tutores (coleção `usuarios`) |
| Sensor ou atuador | Som de confirmação com `expo-audio` e vibração do celular ao curtir (`Vibration`) |

## Tecnologias Utilizadas

- **React Native com Expo**, usando componentes de classe e JavaScript.
- **React Navigation** (`@react-navigation/native` e `@react-navigation/native-stack`): o `App.js` cria um Stack Navigator com as 11 telas. As telas trocam dados pelos parâmetros de rota (por exemplo, o pet aberto no perfil e o aviso mostrado depois de salvar) e recarregam os dados no evento `focus`. Depois do login e do logout a pilha é trocada com `navigation.reset`, para o botão voltar não retornar à tela anterior.
- **Firebase Firestore** (pacote `firebase`): banco de dados na nuvem. As funções do banco ficam em `PetsDB.js`, `PostsDB.js` e `UsuariosDB.js`. As curtidas e os comentários usam `arrayUnion` e `arrayRemove`, que alteram uma lista dentro do documento sem precisar regravar a publicação inteira.
- **expo-crypto**: no cadastro, `UsuariosDB.js` gera um "sal" aleatório (`randomUUID`) e grava só o hash SHA-256 de sal + senha (`digestStringAsync`). No login, o hash é recalculado com a senha digitada e comparado com o que está no banco. A senha em si nunca é gravada.
- **AsyncStorage** (`@react-native-async-storage/async-storage`): `Tutor.js` guarda o usuário logado no aparelho, para não ser preciso entrar de novo cada vez que o app abre. O id do usuário (o e-mail) define quais pets são "meus" e quais publicações eu já curti.
- **expo-audio**: `Som.js` toca um som de confirmação.
- **Vibration** (do próprio React Native): o celular vibra ao curtir uma publicação.

## Funcionalidades

- **Criar conta:** o tutor informa nome, e-mail e senha. O app valida o e-mail, exige senha de pelo menos 6 caracteres, confere a confirmação e recusa e-mail que já tem conta. A conta é gravada na coleção `usuarios` do Firestore.
- **Entrar e sair:** o login busca a conta pelo e-mail no Firestore e confere a senha. O usuário continua logado ao fechar e abrir o app, até tocar em "Sair" na Home.
- **Home:** saudação com o nome do tutor, números da rede (meus pets, pets na rede e publicações) e atalhos para as outras telas.
- **Feed:** lista as publicações de todos os pets, das mais recentes para as mais antigas, com o humor do pet e há quanto tempo foi publicada. Dá para puxar a tela para atualizar.
- **Curtir:** o coração de cada publicação liga e desliga a curtida. A tela é atualizada na hora e a curtida é gravada no Firestore em seguida; se a gravação falhar, a tela volta ao estado anterior. O celular vibra ao curtir.
- **Nova publicação (Salvar):** o tutor escolhe qual dos seus pets está publicando, o humor do pet e escreve um texto de até 280 caracteres, com contador.
- **Publicação (Recuperar, Atualizar e Remover):** mostra a publicação e os comentários. O tutor comenta em nome de um dos seus pets e pode excluir as publicações que ele mesmo fez, com confirmação.
- **Pets (Recuperar):** lista os pets separados em "Meus pets" e "Comunidade", com filtro por espécie e etiqueta colorida da situação das vacinas.
- **Cadastrar pet (Salvar):** formulário com nome, espécie, idade, veterinário, situação das vacinas e descrição. Valida o nome e a idade antes de salvar.
- **Perfil do pet:** dados do pet, quantidade de publicações e de curtidas recebidas e a lista das publicações dele. Só o dono vê os botões de publicar, editar e excluir.
- **Editar pet (Atualizar):** o mesmo formulário já preenchido com os dados do pet.
- **Excluir pet (Remover):** pede confirmação e remove o pet junto com as publicações dele.
- **Sobre o app:** motivação, objetivo e tecnologias, com um botão para testar o som.
- **Som:** toca ao cadastrar, atualizar ou remover um pet e ao publicar, comentar ou excluir uma publicação.
- **Erros:** quando o banco não responde, o app diz o motivo (sem permissão ou sem internet) e oferece "Tentar novamente".

Estrutura do código:

| Arquivo | Função |
|---|---|
| `App.js` | Stack Navigator com as 11 telas |
| `Login.js`, `CadastroUsuario.js`, `Home.js`, `Feed.js`, `NovaPublicacao.js`, `Publicacao.js`, `ListaPets.js`, `CadastroPet.js`, `DetalhesPet.js`, `EditarPet.js`, `Sobre.js` | Uma tela por arquivo |
| `firebase.js` | Configuração e conexão com o Firestore |
| `PetsDB.js` | CRUD dos pets (`salvar`, `listar`, `atualizar`, `remover`) e mensagens de erro do banco |
| `PostsDB.js` | CRUD das publicações (`publicar`, `listar`, `listarDoPet`, `buscar`, `curtir`, `comentar`, `remover`) |
| `UsuariosDB.js` | Contas dos tutores (`cadastrar`, `entrar`) e hash da senha |
| `Tutor.js` | Usuário logado, guardado no AsyncStorage (`atual`, `entrar`, `sair`) |
| `Som.js` | Reprodução do som com `expo-audio` |
| `CartaoPost.js` | Cartão de publicação reutilizado no feed, no perfil e na tela da publicação |
| `FormPet.js` | Formulário reutilizado nas telas de cadastro e edição |
| `Botao.js` e `Chip.js` | Componentes de interface reutilizáveis |
| `estilos.js` | Cores e estilos compartilhados |
| `Imagens.js` | Lista das imagens do app |

Formato dos dados no Firestore:

| Coleção | Campos |
|---|---|
| `pets` | `nome`, `especie`, `idade`, `veterinario`, `vacinas`, `descricao`, `donoId` |
| `posts` | `petId`, `donoId`, `texto`, `humor`, `data`, `curtidas` (lista de ids de tutor), `comentarios` (lista com `petId`, `texto` e `data`) |
| `usuarios` | `nome`, `email`, `sal`, `senhaHash`, `criadoEm` (o id do documento é o e-mail) |

## Demonstração

Vídeo do app funcionando: [assistir no YouTube](https://youtu.be/L1ZhklxGZWU)

[![Vídeo de demonstração do SilkPets](https://img.youtube.com/vi/L1ZhklxGZWU/hqdefault.jpg)](https://youtu.be/L1ZhklxGZWU)

Telas do app (pasta `docs`):

| Home | Feed | Publicação |
|---|---|---|
| ![Home](docs/tela-home.png) | ![Feed](docs/tela-feed.png) | ![Publicação](docs/tela-publicacao.png) |

| Pets | Perfil do pet | Nova publicação |
|---|---|---|
| ![Pets](docs/tela-lista.png) | ![Perfil](docs/tela-detalhes.png) | ![Nova publicação](docs/tela-nova-publicacao.png) |

## Instalação e Execução

### 1. Criar o banco no Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com) e crie um projeto.
2. Em **Build > Firestore Database**, clique em **Criar banco de dados**.
3. Em **Configurações do projeto > Seus apps**, adicione um app **Web** e copie o objeto `firebaseConfig`.
4. Cole os valores no arquivo `firebase.js`.
5. Em **Firestore Database > Regras**, publique as regras abaixo, que liberam as coleções `pets`, `posts` e `usuarios`:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /pets/{petId} {
      allow read, write: if true;
    }
    match /posts/{postId} {
      allow read, write: if true;
    }
    match /usuarios/{email} {
      allow read, write: if true;
    }
  }
}
```

Sem essas regras o app mostra "O Firestore recusou o acesso". Isso também acontece quando o banco é criado em modo de teste e o prazo de 30 dias termina.

Essas regras deixam as três coleções abertas para qualquer pessoa, o que serve para a demonstração do projeto, mas não para uso real: o login é conferido pelo próprio app, então quem acessar o banco diretamente consegue ler os e-mails e os hashes das senhas e alterar dados de outros tutores.

### 2. Executar localmente

```
git clone https://github.com/souzabee/silkpets.git
cd silkpets
npm install
npx expo start
```

Abra o app pelo Expo Go lendo o QR Code, ou pressione `w` para abrir no navegador.

Para montar o projeto do zero, as dependências são:

```
npx create-expo-app silkpets
cd silkpets
npx expo install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context expo-audio expo-asset expo-crypto @react-native-async-storage/async-storage react-dom react-native-web @expo/metro-runtime
npm install firebase
```

### 3. Executar no Expo Snack

1. Abra [snack.expo.dev](https://snack.expo.dev) e crie um projeto novo.
2. Crie um arquivo para cada `.js` deste repositório e cole o conteúdo.
3. Envie a pasta `assets` (arquivos `banner.png`, `cachorro.png`, `gato.png`, `outro.png` e `som.wav`).
4. Adicione as dependências: `@react-navigation/native`, `@react-navigation/native-stack`, `react-native-screens`, `react-native-safe-area-context`, `firebase`, `expo-audio`, `expo-crypto` e `@react-native-async-storage/async-storage`.
5. Abra o app pelo Expo Go lendo o QR Code.

## Uso de IA

A IA generativa foi usada como ferramenta de apoio, seguindo o Guia de Ética da disciplina. Todo código sugerido pela IA foi lido, testado no Expo Go e ajustado antes de entrar no projeto, e as decisões de tema, telas e funcionalidades foram do autor.

Como a IA foi usada:

- **Dúvidas e depuração:** entender mensagens de erro do Expo e do Firestore (por exemplo, o erro de permissão quando as regras do banco expiram) e consultar o uso das bibliotecas na versão atual do Expo.
- **Revisão de código:** sugestões para organizar as funções do banco em `PetsDB.js`, `PostsDB.js` e `UsuariosDB.js` e para reaproveitar componentes como `CartaoPost.js` e `FormPet.js`.
- **Segurança da senha:** discussão sobre por que não gravar a senha em texto puro, que levou ao uso de sal + hash SHA-256 com `expo-crypto`.
- **Documentação:** ajuda na redação e revisão deste README.

O que não foi delegado à IA: a escolha do tema e dos requisitos, o desenho das telas, os testes no celular e a gravação do vídeo de demonstração.

## Aprendizados e Próximos Passos

**Aprendizados:** o projeto mostrou na prática como um app móvel se divide entre telas, navegação e dados. Com o Stack Navigator, aprendi a passar dados entre telas pelos parâmetros de rota, a recarregar a tela no evento `focus` e a usar `navigation.reset` no login e no logout, para o botão voltar não levar a uma tela que não faz mais sentido. No Firestore, aprendi a modelar as coleções, a usar `arrayUnion` e `arrayRemove` nas curtidas e nos comentários e que as regras de segurança fazem parte do app: quando o modo de teste expira, o app para de funcionar, e por isso os erros do banco passaram a ter mensagens claras e o botão "Tentar novamente". A curtida otimista (atualizar a tela antes e desfazer se a gravação falhar) mostrou como pequenos detalhes de UX mudam a sensação de velocidade. Por fim, ficou claro o limite de conferir o login no próprio app: sem o Firebase Authentication, as regras do banco não conseguem proteger os dados de cada tutor, e esse é o primeiro ponto a melhorar.

**Próximos passos:**

- Trocar o login próprio pelo Firebase Authentication, para as regras do Firestore exigirem usuário autenticado e protegerem os dados de cada tutor.
- Permitir fotos nas publicações e no perfil do pet.
- Seguir pets e mostrar primeiro as publicações de quem o tutor segue.
- Registrar a data das vacinas e exames e avisar por notificação.
