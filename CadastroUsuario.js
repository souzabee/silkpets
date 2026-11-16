import React from 'react';
import { ScrollView, Text, TextInput } from 'react-native';
import Botao from './Botao';
import PetsDB from './PetsDB';
import Som from './Som';
import Tutor from './Tutor';
import UsuariosDB from './UsuariosDB';
import { estilos, cores } from './estilos';

export default class CadastroUsuario extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nome: '',
      email: '',
      senha: '',
      confirmacao: '',
      salvando: false,
      mensagem: ''
    };
  }

  // Devolve o texto do problema encontrado, ou '' quando está tudo certo.
  validar(nome, email) {
    if (nome === '') {
      return 'Informe o seu nome';
    } else if (!UsuariosDB.emailValido(email)) {
      return 'Informe um e-mail válido';
    } else if (this.state.senha.length < 6) {
      return 'A senha precisa ter pelo menos 6 caracteres';
    } else if (this.state.senha !== this.state.confirmacao) {
      return 'As senhas não são iguais';
    }
    return '';
  }

  async cadastrar() {
    const nome = this.state.nome.trim();
    const email = UsuariosDB.limparEmail(this.state.email);
    const problema = this.validar(nome, email);

    if (problema !== '') {
      this.setState({ mensagem: problema });
      return;
    }

    this.setState({ salvando: true, mensagem: '' });

    try {
      const usuario = await UsuariosDB.cadastrar(nome, email, this.state.senha);

      if (usuario === null) {
        this.setState({ salvando: false, mensagem: 'Já existe uma conta com este e-mail' });
        return;
      }

      // Quem acabou de criar a conta já entra no app.
      await Tutor.entrar(usuario);
      Som.tocar();
      this.props.navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (erro) {
      this.setState({ salvando: false, mensagem: PetsDB.mensagemDeErro(erro) });
    }
  }

  render() {
    return (
      <ScrollView
        style={estilos.tela}
        contentContainerStyle={estilos.conteudo}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={estilos.titulo}>Criar conta</Text>
        <Text style={estilos.subtitulo}>Com a conta você cadastra seus pets e publica por eles.</Text>

        <Text style={estilos.rotulo}>Nome</Text>
        <TextInput
          style={estilos.input}
          value={this.state.nome}
          onChangeText={(texto) => this.setState({ nome: texto, mensagem: '' })}
        />

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
          placeholder="Pelo menos 6 caracteres"
          placeholderTextColor={cores.cinza}
          value={this.state.senha}
          onChangeText={(texto) => this.setState({ senha: texto, mensagem: '' })}
        />

        <Text style={estilos.rotulo}>Confirmar senha</Text>
        <TextInput
          style={estilos.input}
          secureTextEntry={true}
          value={this.state.confirmacao}
          onChangeText={(texto) => this.setState({ confirmacao: texto, mensagem: '' })}
        />

        <Botao
          titulo={this.state.salvando ? 'Criando conta...' : 'Criar conta'}
          desabilitado={this.state.salvando}
          onPress={() => this.cadastrar()}
        />

        {this.state.mensagem !== '' ? <Text style={estilos.erro}>{this.state.mensagem}</Text> : null}
      </ScrollView>
    );
  }
}
