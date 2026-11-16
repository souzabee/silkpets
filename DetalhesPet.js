import React from 'react';
import { ScrollView, View, Text, Image, ActivityIndicator } from 'react-native';
import Botao from './Botao';
import CartaoPost from './CartaoPost';
import Imagens from './Imagens';
import PetsDB from './PetsDB';
import PostsDB from './PostsDB';
import Som from './Som';
import Tutor from './Tutor';
import { estilos, cores } from './estilos';

// Perfil do pet: dados, números na rede e publicações. Só o dono pode editar e excluir.
export default class DetalhesPet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      tutorId: '',
      carregando: true,
      confirmando: false,
      removendo: false,
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
    const pet = this.props.route.params.pet;
    this.setState({ carregando: true, erro: '' });

    try {
      const tutorId = await Tutor.id();
      const posts = await PostsDB.listarDoPet(pet.id);
      this.setState({ posts: posts, tutorId: tutorId, carregando: false });
    } catch (erro) {
      this.setState({ carregando: false, erro: PetsDB.mensagemDeErro(erro) });
    }
  }

  async remover() {
    const pet = this.props.route.params.pet;
    this.setState({ removendo: true, erro: '' });

    try {
      // As publicações do pet saem junto com ele.
      await PostsDB.removerDoPet(pet.id);
      await PetsDB.remover(pet.id);
      Som.tocar();
      this.props.navigation.popTo('ListaPets', { aviso: pet.nome + ' foi removido.' });
    } catch (erro) {
      this.setState({ removendo: false, erro: PetsDB.mensagemDeErro(erro) });
    }
  }

  renderDado(rotulo, valor, primeira) {
    return (
      <View style={[estilos.linhaDado, primeira ? estilos.linhaDadoPrimeira : null]}>
        <Text style={estilos.dadoRotulo}>{rotulo}</Text>
        <Text style={estilos.dadoValor}>{valor}</Text>
      </View>
    );
  }

  renderNumero(valor, rotulo) {
    return (
      <View style={estilos.numero}>
        <Text style={estilos.numeroValor}>{valor}</Text>
        <Text style={estilos.numeroRotulo}>{rotulo}</Text>
      </View>
    );
  }

  renderAcoes(pet) {
    if (this.state.confirmando) {
      return (
        <View>
          <Text style={[estilos.rotulo, { textAlign: 'center', fontSize: 16 }]}>
            Tem certeza que deseja excluir {pet.nome} e as publicações dele?
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
      <View>
        <Botao
          titulo={'Publicar como ' + pet.nome}
          onPress={() => this.props.navigation.navigate('NovaPublicacao', { petId: pet.id })}
        />
        <Botao
          titulo="Editar"
          contorno={true}
          onPress={() => this.props.navigation.navigate('EditarPet', { pet: pet })}
        />
        <Botao
          titulo="Excluir"
          cor={cores.perigo}
          contorno={true}
          onPress={() => this.setState({ confirmando: true })}
        />
      </View>
    );
  }

  render() {
    const pet = this.props.route.params.pet;
    const meu = this.state.tutorId !== '' && Tutor.ehMeu(pet, this.state.tutorId);

    // Soma as curtidas de todas as publicações do pet.
    let curtidas = 0;
    this.state.posts.forEach((post) => {
      curtidas = curtidas + post.curtidas.length;
    });

    return (
      <ScrollView style={estilos.tela} contentContainerStyle={estilos.conteudo}>
        <View style={{ alignItems: 'center', marginBottom: 16 }}>
          <Image source={Imagens[pet.especie] || Imagens.Outro} style={{ width: 130, height: 130 }} />
          <Text style={[estilos.titulo, { marginTop: 12, textAlign: 'center' }]}>{pet.nome}</Text>
          <Text
            style={[
              estilos.etiqueta,
              { alignSelf: 'center', marginTop: 2 },
              pet.vacinas === 'Em dia' ? estilos.etiquetaOk : estilos.etiquetaAlerta
            ]}
          >
            Vacinas: {pet.vacinas}
          </Text>
        </View>

        <View style={[estilos.painel, estilos.numeros, { marginBottom: 12 }]}>
          {this.renderNumero(this.state.posts.length, this.state.posts.length === 1 ? 'publicação' : 'publicações')}
          {this.renderNumero(curtidas, curtidas === 1 ? 'curtida' : 'curtidas')}
        </View>

        <View style={[estilos.painel, { paddingBottom: 4 }]}>
          {this.renderDado('Espécie', pet.especie, true)}
          {this.renderDado('Idade', pet.idade + (pet.idade === '1' ? ' ano' : ' anos'))}
          {this.renderDado('Veterinário', pet.veterinario ? pet.veterinario : 'Não informado')}
          {this.renderDado('Descrição', pet.descricao ? pet.descricao : 'Sem descrição')}
        </View>

        {this.state.erro !== '' ? <Text style={estilos.erro}>{this.state.erro}</Text> : null}

        {meu ? this.renderAcoes(pet) : null}

        <Text style={estilos.secao}>Publicações de {pet.nome}</Text>

        {this.state.carregando && this.state.posts.length === 0 ? (
          <ActivityIndicator color={cores.principal} style={estilos.carregando} />
        ) : null}

        {!this.state.carregando && this.state.posts.length === 0 ? (
          <Text style={estilos.detalheCartao}>{pet.nome} ainda não publicou nada.</Text>
        ) : null}

        {this.state.posts.map((post) => (
          <CartaoPost
            key={post.id}
            post={post}
            pet={pet}
            tutorId={this.state.tutorId}
            onAbrir={() => this.props.navigation.navigate('Publicacao', { postId: post.id })}
          />
        ))}
      </ScrollView>
    );
  }
}
