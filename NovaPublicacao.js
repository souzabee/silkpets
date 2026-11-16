import React from 'react';
import { ScrollView, View, Text, TextInput, Image, ActivityIndicator } from 'react-native';
import Botao from './Botao';
import Chip from './Chip';
import Imagens from './Imagens';
import PetsDB from './PetsDB';
import PostsDB from './PostsDB';
import Som from './Som';
import Tutor from './Tutor';
import { estilos, cores } from './estilos';

const LIMITE = 280;

export default class NovaPublicacao extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      meusPets: [],
      petId: '',
      humor: 'Feliz',
      texto: '',
      carregando: true,
      publicando: false,
      mensagem: ''
    };
  }

  componentDidMount() {
    this.removerOuvinte = this.props.navigation.addListener('focus', () => this.carregar());
  }

  componentWillUnmount() {
    this.removerOuvinte();
  }

  // Só os meus pets podem publicar.
  async carregar() {
    this.setState({ carregando: true, mensagem: '' });

    try {
      const tutorId = await Tutor.id();
      const pets = await PetsDB.listar();
      const meusPets = pets.filter((pet) => Tutor.ehMeu(pet, tutorId));

      // Se a tela foi aberta pelo perfil de um pet, ele já vem escolhido.
      const params = this.props.route.params;
      let petId = this.state.petId;

      if (petId === '' && params && params.petId) {
        petId = params.petId;
      }
      if (!meusPets.some((pet) => pet.id === petId)) {
        petId = meusPets.length > 0 ? meusPets[0].id : '';
      }

      this.setState({ meusPets: meusPets, petId: petId, carregando: false });
    } catch (erro) {
      this.setState({ carregando: false, mensagem: PetsDB.mensagemDeErro(erro) });
    }
  }

  async publicar() {
    const texto = this.state.texto.trim();

    if (texto === '') {
      this.setState({ mensagem: 'Escreva alguma coisa antes de publicar' });
      return;
    }

    this.setState({ publicando: true, mensagem: '' });

    try {
      await PostsDB.publicar({
        petId: this.state.petId,
        donoId: await Tutor.id(),
        texto: texto,
        humor: this.state.humor,
        data: Date.now(),
        curtidas: [],
        comentarios: []
      });

      Som.tocar();
      this.props.navigation.popTo('Feed', { aviso: 'Publicação enviada!' });
    } catch (erro) {
      this.setState({ publicando: false, mensagem: PetsDB.mensagemDeErro(erro) });
    }
  }

  render() {
    if (this.state.carregando) {
      return (
        <View style={estilos.tela}>
          <ActivityIndicator size="large" color={cores.principal} style={estilos.carregando} />
        </View>
      );
    }

    // Sem pets não há quem publique.
    if (this.state.meusPets.length === 0) {
      return (
        <ScrollView style={estilos.tela} contentContainerStyle={estilos.conteudo}>
          {this.state.mensagem !== '' ? (
            <Text style={[estilos.erro, { marginTop: 0 }]}>{this.state.mensagem}</Text>
          ) : (
            <Text style={estilos.vazio}>
              Quem publica aqui são os pets. Cadastre o seu primeiro pet para começar.
            </Text>
          )}
          <Botao titulo="Cadastrar pet" onPress={() => this.props.navigation.navigate('CadastroPet')} />
        </ScrollView>
      );
    }

    const pet = this.state.meusPets.find((item) => item.id === this.state.petId);

    return (
      <ScrollView
        style={estilos.tela}
        contentContainerStyle={estilos.conteudo}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ alignItems: 'center', marginBottom: 4 }}>
          <Image source={Imagens[pet.especie] || Imagens.Outro} style={{ width: 90, height: 90 }} />
        </View>

        <Text style={estilos.rotulo}>Quem está publicando?</Text>
        <View style={estilos.linhaChips}>
          {this.state.meusPets.map((item) => (
            <Chip
              key={item.id}
              texto={item.nome}
              ativo={this.state.petId === item.id}
              onPress={() => this.setState({ petId: item.id })}
            />
          ))}
        </View>

        <Text style={estilos.rotulo}>Como {pet.nome} está?</Text>
        <View style={estilos.linhaChips}>
          {['Feliz', 'Brincando', 'Passeando', 'Com fome', 'Com sono'].map((humor) => (
            <Chip
              key={humor}
              texto={humor}
              ativo={this.state.humor === humor}
              onPress={() => this.setState({ humor: humor })}
            />
          ))}
        </View>

        <Text style={estilos.rotulo}>O que {pet.nome} quer contar?</Text>
        <TextInput
          style={[estilos.input, estilos.inputGrande, { height: 120 }]}
          multiline={true}
          maxLength={LIMITE}
          placeholder="Ex.: Hoje fui ao parque e fiz três amigos novos!"
          placeholderTextColor={cores.cinza}
          value={this.state.texto}
          onChangeText={(texto) => this.setState({ texto: texto, mensagem: '' })}
        />
        <Text style={estilos.contador}>
          {this.state.texto.length}/{LIMITE}
        </Text>

        <Botao
          titulo={this.state.publicando ? 'Publicando...' : 'Publicar'}
          desabilitado={this.state.publicando}
          onPress={() => this.publicar()}
        />

        {this.state.mensagem !== '' ? <Text style={estilos.erro}>{this.state.mensagem}</Text> : null}
      </ScrollView>
    );
  }
}
