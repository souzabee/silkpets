import React from 'react';
import { ScrollView, View, Text, Image, ActivityIndicator } from 'react-native';
import Botao from './Botao';
import Imagens from './Imagens';
import PetsDB from './PetsDB';
import PostsDB from './PostsDB';
import Tutor from './Tutor';
import { estilos, cores } from './estilos';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nome: '',
      numeros: null,
      erro: ''
    };
  }

  componentDidMount() {
    this.removerOuvinte = this.props.navigation.addListener('focus', () => this.carregar());
  }

  componentWillUnmount() {
    this.removerOuvinte();
  }

  async carregar() {
    // Sem ninguém logado, a Home não abre: volta para o login.
    const usuario = await Tutor.atual();

    if (usuario === null) {
      this.irParaLogin();
      return;
    }

    this.setState({ nome: usuario.nome, erro: '' });

    try {
      const tutorId = usuario.id;
      const pets = await PetsDB.listar();
      const posts = await PostsDB.listar();

      this.setState({
        numeros: {
          meusPets: pets.filter((pet) => Tutor.ehMeu(pet, tutorId)).length,
          pets: pets.length,
          posts: posts.length
        }
      });
    } catch (erro) {
      this.setState({ erro: PetsDB.mensagemDeErro(erro) });
    }
  }

  irParaLogin() {
    this.props.navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  }

  async sair() {
    await Tutor.sair();
    this.irParaLogin();
  }

  renderNumero(valor, rotulo) {
    return (
      <View style={estilos.numero}>
        <Text style={estilos.numeroValor}>{valor}</Text>
        <Text style={estilos.numeroRotulo}>{rotulo}</Text>
      </View>
    );
  }

  renderResumo() {
    if (this.state.erro !== '') {
      return (
        <View>
          <Text style={[estilos.erro, { marginTop: 0 }]}>{this.state.erro}</Text>
          <Botao titulo="Tentar novamente" contorno={true} onPress={() => this.carregar()} />
        </View>
      );
    }

    // Só mostra o indicador na primeira carga; depois mantém os números antigos na tela.
    if (this.state.numeros === null) {
      return (
        <View style={[estilos.painel, estilos.resumo]}>
          <ActivityIndicator color={cores.principal} style={{ marginRight: 14 }} />
          <Text style={estilos.resumoTexto}>Carregando a comunidade...</Text>
        </View>
      );
    }

    return (
      <View style={[estilos.painel, estilos.numeros]}>
        {this.renderNumero(this.state.numeros.meusPets, this.state.numeros.meusPets === 1 ? 'meu pet' : 'meus pets')}
        {this.renderNumero(this.state.numeros.pets, 'pets na rede')}
        {this.renderNumero(this.state.numeros.posts, this.state.numeros.posts === 1 ? 'publicação' : 'publicações')}
      </View>
    );
  }

  render() {
    return (
      <ScrollView style={estilos.tela} contentContainerStyle={estilos.conteudo}>
        <Image source={Imagens.banner} style={estilos.banner} resizeMode="cover" />

        <Text style={estilos.titulo}>
          {this.state.nome === '' ? 'SilkPets' : 'Olá, ' + this.state.nome}
        </Text>
        <Text style={estilos.subtitulo}>A rede social onde quem publica são os pets.</Text>

        {this.renderResumo()}

        <Botao titulo="Ver o feed" onPress={() => this.props.navigation.navigate('Feed')} />
        <Botao
          titulo="Nova publicação"
          contorno={true}
          onPress={() => this.props.navigation.navigate('NovaPublicacao')}
        />
        <Botao
          titulo="Pets"
          contorno={true}
          onPress={() => this.props.navigation.navigate('ListaPets')}
        />
        <Botao
          titulo="Sobre o app"
          contorno={true}
          onPress={() => this.props.navigation.navigate('Sobre')}
        />
        <Botao titulo="Sair" cor={cores.cinza} contorno={true} onPress={() => this.sair()} />
      </ScrollView>
    );
  }
}
