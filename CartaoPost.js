import React from 'react';
import { View, Text, Image, TouchableOpacity, Vibration } from 'react-native';
import Imagens from './Imagens';
import PostsDB from './PostsDB';
import { estilos } from './estilos';

// Cartão de uma publicação, usado no feed, no perfil do pet e na tela da publicação.
// Propriedades: post, pet (autor), tutorId, onAbrir (opcional) e onAbrirPet (opcional).
export default class CartaoPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curtidas: props.post.curtidas
    };
  }

  // Quando a tela recarrega as publicações, o cartão passa a mostrar as curtidas novas.
  componentDidUpdate(anterior) {
    if (anterior.post !== this.props.post) {
      this.setState({ curtidas: this.props.post.curtidas });
    }
  }

  async curtir() {
    const tutorId = this.props.tutorId;
    const antes = this.state.curtidas;
    const jaCurtiu = antes.includes(tutorId);

    // Atualiza a tela na hora e só depois grava no banco. Se der erro, volta ao que era.
    this.setState({
      curtidas: jaCurtiu ? antes.filter((id) => id !== tutorId) : [...antes, tutorId]
    });

    if (!jaCurtiu) {
      Vibration.vibrate(40);
    }

    try {
      await PostsDB.curtir(this.props.post.id, tutorId, !jaCurtiu);
    } catch (erro) {
      console.error('Erro ao curtir:', erro);
      this.setState({ curtidas: antes });
    }
  }

  render() {
    const post = this.props.post;
    const pet = this.props.pet ? this.props.pet : { nome: 'Pet removido', especie: 'Outro' };
    const jaCurtiu = this.state.curtidas.includes(this.props.tutorId);
    const comentarios = post.comentarios.length;

    return (
      <View style={[estilos.painel, estilos.post]}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={estilos.postCabecalho}
          disabled={!this.props.onAbrirPet}
          onPress={this.props.onAbrirPet}
        >
          <Image source={Imagens[pet.especie] || Imagens.Outro} style={estilos.postAvatar} />
          <View style={estilos.cartaoInfo}>
            <Text style={estilos.postNome} numberOfLines={1}>{pet.nome}</Text>
            <Text style={estilos.detalheCartao}>
              {post.humor} · {PostsDB.tempoDesde(post.data)}
            </Text>
          </View>
        </TouchableOpacity>

        <Text style={estilos.postTexto}>{post.texto}</Text>

        <View style={estilos.postAcoes}>
          <TouchableOpacity
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={jaCurtiu ? 'Remover curtida' : 'Curtir'}
            style={estilos.postAcao}
            onPress={() => this.curtir()}
          >
            <Text style={[estilos.postAcaoTexto, jaCurtiu ? estilos.postCurtido : null]}>
              {jaCurtiu ? '♥' : '♡'} {this.state.curtidas.length}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            accessibilityRole="button"
            style={estilos.postAcao}
            disabled={!this.props.onAbrir}
            onPress={this.props.onAbrir}
          >
            <Text style={estilos.postAcaoTexto}>
              {comentarios} {comentarios === 1 ? 'comentário' : 'comentários'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
