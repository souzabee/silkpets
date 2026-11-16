import React from 'react';
import { ScrollView, View, Text, TextInput, Image, ActivityIndicator } from 'react-native';
import Botao from './Botao';
import Imagens from './Imagens';
import PetsDB from './PetsDB';
import Tutor from './Tutor';
import UsuariosDB from './UsuariosDB';
import { estilos, cores } from './estilos';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      senha: '',
      verificando: true,
      entrando: false,
      mensagem: ''
    };
  }

  // Quem já entrou antes neste aparelho vai direto para a Home.
  async componentDidMount() {
    const usuario = await Tutor.atual();

    if (usuario !== null) {
      this.irParaHome();
    } else {
      this.setState({ verificando: false });
    }
  }

  // reset troca a pilha inteira: depois de entrar, o botão voltar não retorna ao login.
  irParaHome() {
    this.props.navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  }

  async entrar() {
    const email = UsuariosDB.limparEmail(this.state.email);

    if (email === '' || this.state.senha === '') {
      this.setState({ mensagem: 'Informe o e-mail e a senha' });
      return;
    }

    this.setState({ entrando: true, mensagem: '' });

    try {
      const usuario = await UsuariosDB.entrar(email, this.state.senha);

      if (usuario === null) {
        this.setState({ entrando: false, mensagem: 'E-mail ou senha incorretos' });
        return;
      }

      await Tutor.entrar(usuario);
      this.irParaHome();
    } catch (erro) {
      this.setState({ entrando: false, mensagem: PetsDB.mensagemDeErro(erro) });
    }
  }

  render() {
    if (this.state.verificando) {
      return (
        <View style={estilos.tela}>
          <ActivityIndicator size="large" color={cores.principal} style={estilos.carregando} />
        </View>
      );
    }

    return (
      <ScrollView
        style={estilos.tela}
        contentContainerStyle={estilos.conteudo}
        keyboardShouldPersistTaps="handled"
      >
        <Image source={Imagens.banner} style={[estilos.banner, { height: 140 }]} resizeMode="cover" />

        <Text style={estilos.titulo}>Entrar</Text>
        <Text style={estilos.subtitulo}>Acesse sua conta para ver seus pets e o feed.</Text>

        <Text style={estilos.rotulo}>E-mail</Text>
        <TextInput
          style={estilos.input}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="voce@email.com"
          placeholderTextColor={cores.cinza}
          value={this.state.email}
          onChangeText={(texto) => this.setState({ email: texto, mensagem: '' })}
        />

        <Text style={estilos.rotulo}>Senha</Text>
        <TextInput
          style={estilos.input}
          secureTextEntry={true}
          value={this.state.senha}
          onChangeText={(texto) => this.setState({ senha: texto, mensagem: '' })}
          onSubmitEditing={() => this.entrar()}
        />

        <Botao
          titulo={this.state.entrando ? 'Entrando...' : 'Entrar'}
          desabilitado={this.state.entrando}
          onPress={() => this.entrar()}
        />
        <Botao
          titulo="Criar conta"
          contorno={true}
          desabilitado={this.state.entrando}
          onPress={() => this.props.navigation.navigate('CadastroUsuario')}
        />

        {this.state.mensagem !== '' ? <Text style={estilos.erro}>{this.state.mensagem}</Text> : null}
      </ScrollView>
    );
  }
}
