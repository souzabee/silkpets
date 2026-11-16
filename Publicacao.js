import React from 'react';
import { ScrollView, View, Text, TextInput, Image, ActivityIndicator } from 'react-native';
import Botao from './Botao';
import CartaoPost from './CartaoPost';
import Chip from './Chip';
import Imagens from './Imagens';
import PetsDB from './PetsDB';
import PostsDB from './PostsDB';
import Som from './Som';
import Tutor from './Tutor';
import { estilos, cores } from './estilos';

// Tela de uma publicação: mostra o post, os comentários e permite comentar ou excluir.
export default class Publicacao extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post: null,
      pets: {},
      meusPets: [],
      tutorId: '',
      petId: '',
      texto: '',
      carregando: true,
      enviando: false,
      confirmando: false,
      removendo: false,
      erro: ''
    };
  }

  componentDidMount() {
    this.carregar();
  }

  async carregar() {
    this.setState({ carregando: true, erro: '' });

    try {
      const tutorId = await Tutor.id();
      const lista = await PetsDB.listar();
      const post = await PostsDB.buscar(this.props.route.params.postId);

      const pets = {};
      lista.forEach((pet) => {
        pets[pet.id] = pet;
      });

      const meusPets = lista.filter((pet) => Tutor.ehMeu(pet, tutorId));
      let petId = this.state.petId;
      if (!meusPets.some((pet) => pet.id === petId)) {
        petId = meusPets.length > 0 ? meusPets[0].id : '';
      }

      this.setState({
        post: post,
        pets: pets,
        meusPets: meusPets,
        tutorId: tutorId,
        petId: petId,
        carregando: false,
        erro: post === null ? 'Esta publicação não existe mais.' : ''
      });
    } catch (erro) {
      this.setState({ carregando: false, erro: PetsDB.mensagemDeErro(erro) });
    }
  }

  async comentar() {
    const texto = this.state.texto.trim();

    if (texto === '') {
      this.setState({ erro: 'Escreva o comentário antes de enviar' });
      return;
    }

    this.setState({ enviando: true, erro: '' });

    try {
      await PostsDB.comentar(this.state.post.id, {
        petId: this.state.petId,
        texto: texto,
        data: Date.now()
      });

      Som.tocar();
      this.setState({ texto: '', enviando: false });
      this.carregar();
    } catch (erro) {
      this.setState({ enviando: false, erro: PetsDB.mensagemDeErro(erro) });
    }
  }

  async remover() {
    this.setState({ removendo: true, erro: '' });

    try {
      await PostsDB.remover(this.state.post.id);
      Som.tocar();
      this.props.navigation.popTo('Feed', { aviso: 'Publicação excluída.' });
    } catch (erro) {
      this.setState({ removendo: false, erro: PetsDB.mensagemDeErro(erro) });
    }
  }

  renderComentario(comentario, indice) {
    const pet = this.state.pets[comentario.petId]
      ? this.state.pets[comentario.petId]
      : { nome: 'Pet removido', especie: 'Outro' };

    return (
      <View key={indice} style={[estilos.comentario, indice === 0 ? { borderTopWidth: 0 } : null]}>
        <Image source={Imagens[pet.especie] || Imagens.Outro} style={estilos.comentarioAvatar} />
        <View style={estilos.cartaoInfo}>
          <Text style={estilos.detalheCartao}>
            <Text style={{ fontWeight: 'bold', color: cores.texto }}>{pet.nome}</Text>
            {' · '}
            {PostsDB.tempoDesde(comentario.data)}
          </Text>
          <Text style={estilos.dadoValor}>{comentario.texto}</Text>
        </View>
      </View>
    );
  }

  renderFormulario() {
    if (this.state.meusPets.length === 0) {
      return (
        <Text style={[estilos.detalheCartao, { marginTop: 12 }]}>
          Cadastre um pet para poder comentar.
        </Text>
      );
    }

    return (
      <View>
        <Text style={estilos.rotulo}>Comentar como</Text>
        <View style={estilos.linhaChips}>
          {this.state.meusPets.map((pet) => (
            <Chip
              key={pet.id}
              texto={pet.nome}
              ativo={this.state.petId === pet.id}
              onPress={() => this.setState({ petId: pet.id })}
            />
          ))}
        </View>

        <TextInput
          style={estilos.input}
          maxLength={200}
          placeholder="Escreva um comentário"
          placeholderTextColor={cores.cinza}
          value={this.state.texto}
          onChangeText={(texto) => this.setState({ texto: texto })}
        />
        <Botao
          titulo={this.state.enviando ? 'Enviando...' : 'Comentar'}
          desabilitado={this.state.enviando}
          onPress={() => this.comentar()}
        />
      </View>
    );
  }

  renderExcluir() {
    if (this.state.confirmando) {
      return (
        <View>
          <Text style={[estilos.rotulo, { textAlign: 'center', fontSize: 16 }]}>
            Excluir esta publicação?
          </Text>
          <Botao
            titulo={this.state.removendo ? 'Excluindo...' : 'Sim, excluir'}
            cor={cores.perigo}
            desabilitado={this.state.removendo}
            onPress={() => this.remover()}
          />
          <Botao
            titulo="Cancelar"
            cor={cores.cinza}
            contorno={true}
            desabilitado={this.state.removendo}
            onPress={() => this.setState({ confirmando: false })}
          />
        </View>
      );
    }

    return (
      <Botao
        titulo="Excluir publicação"
        cor={cores.perigo}
        contorno={true}
        onPress={() => this.setState({ confirmando: true })}
      />
    );
  }

  render() {
    const post = this.state.post;

    if (post === null) {
      return (
        <ScrollView style={estilos.tela} contentContainerStyle={estilos.conteudo}>
          {this.state.carregando ? (
            <ActivityIndicator size="large" color={cores.principal} style={estilos.carregando} />
          ) : (
            <View>
              <Text style={[estilos.erro, { marginTop: 0 }]}>{this.state.erro}</Text>
              <Botao titulo="Tentar novamente" contorno={true} onPress={() => this.carregar()} />
            </View>
          )}
        </ScrollView>
      );
    }

    const pet = this.state.pets[post.petId];

    return (
      <ScrollView
        style={estilos.tela}
        contentContainerStyle={estilos.conteudo}
        keyboardShouldPersistTaps="handled"
      >
        <CartaoPost
          post={post}
          pet={pet}
          tutorId={this.state.tutorId}
          onAbrirPet={pet ? () => this.props.navigation.navigate('DetalhesPet', { pet: pet }) : null}
        />

        <Text style={estilos.secao}>Comentários</Text>

        {post.comentarios.length === 0 ? (
          <Text style={estilos.detalheCartao}>Nenhum comentário ainda.</Text>
        ) : (
          <View style={[estilos.painel, { paddingVertical: 6 }]}>
            {post.comentarios.map((comentario, indice) => this.renderComentario(comentario, indice))}
          </View>
        )}

        {this.renderFormulario()}

        {this.state.erro !== '' ? <Text style={estilos.erro}>{this.state.erro}</Text> : null}

        {post.donoId === this.state.tutorId ? this.renderExcluir() : null}
      </ScrollView>
    );
  }
}
