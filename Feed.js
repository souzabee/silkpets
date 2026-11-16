import React from 'react';
import { ScrollView, View, Text, ActivityIndicator, RefreshControl } from 'react-native';
import Botao from './Botao';
import CartaoPost from './CartaoPost';
import PetsDB from './PetsDB';
import PostsDB from './PostsDB';
import Tutor from './Tutor';
import { estilos, cores } from './estilos';

export default class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      pets: {},
      tutorId: '',
      carregando: true,
      erro: '',
      aviso: ''
    };
  }

  componentDidMount() {
    this.removerOuvinte = this.props.navigation.addListener('focus', () => this.aoEntrar());
  }

  componentWillUnmount() {
    this.removerOuvinte();
  }

  aoEntrar() {
    const params = this.props.route.params;

    if (params && params.aviso) {
      this.setState({ aviso: params.aviso });
      this.props.navigation.setParams({ aviso: null });
    } else {
      this.setState({ aviso: '' });
    }

    this.carregar();
  }

  async carregar() {
    this.setState({ carregando: true, erro: '' });

    try {
      const tutorId = await Tutor.id();
      const lista = await PetsDB.listar();
      const posts = await PostsDB.listar();

      // Guarda os pets pelo id para achar rápido o autor de cada publicação.
      const pets = {};
      lista.forEach((pet) => {
        pets[pet.id] = pet;
      });

      this.setState({ posts: posts, pets: pets, tutorId: tutorId, carregando: false });
    } catch (erro) {
      this.setState({ carregando: false, erro: PetsDB.mensagemDeErro(erro) });
    }
  }

  render() {
    const primeiraCarga = this.state.carregando && this.state.posts.length === 0;

    return (
      <ScrollView
        style={estilos.tela}
        contentContainerStyle={estilos.conteudo}
        refreshControl={
          <RefreshControl
            refreshing={this.state.carregando && this.state.posts.length > 0}
            onRefresh={() => this.carregar()}
            colors={[cores.principal]}
            tintColor={cores.principal}
          />
        }
      >
        {this.state.aviso !== '' ? <Text style={estilos.aviso}>{this.state.aviso}</Text> : null}

        <Botao
          titulo="Nova publicação"
          onPress={() => this.props.navigation.navigate('NovaPublicacao')}
        />

        <Text style={estilos.secao}>Publicações recentes</Text>

        {primeiraCarga ? (
          <ActivityIndicator size="large" color={cores.principal} style={estilos.carregando} />
        ) : null}

        {this.state.erro !== '' ? (
          <View style={{ marginBottom: 12 }}>
            <Text style={[estilos.erro, { marginTop: 0 }]}>{this.state.erro}</Text>
            <Botao titulo="Tentar novamente" contorno={true} onPress={() => this.carregar()} />
          </View>
        ) : null}

        {!this.state.carregando && this.state.erro === '' && this.state.posts.length === 0 ? (
          <Text style={estilos.vazio}>
            Ninguém publicou ainda. Que tal o seu pet ser o primeiro?
          </Text>
        ) : null}

        {this.state.posts.map((post) => (
          <CartaoPost
            key={post.id}
            post={post}
            pet={this.state.pets[post.petId]}
            tutorId={this.state.tutorId}
            onAbrir={() => this.props.navigation.navigate('Publicacao', { postId: post.id })}
            onAbrirPet={
              this.state.pets[post.petId]
                ? () => this.props.navigation.navigate('DetalhesPet', { pet: this.state.pets[post.petId] })
                : null
            }
          />
        ))}
      </ScrollView>
    );
  }
}
