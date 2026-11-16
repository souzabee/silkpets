import React from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import Botao from './Botao';
import Chip from './Chip';
import Imagens from './Imagens';
import PetsDB from './PetsDB';
import Tutor from './Tutor';
import { estilos, cores } from './estilos';

export default class ListaPets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pets: [],
      tutorId: '',
      dono: 'Meus pets',
      filtro: 'Todos',
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
      const pets = await PetsDB.listar();
      this.setState({ pets: pets, tutorId: tutorId, carregando: false });
    } catch (erro) {
      this.setState({ carregando: false, erro: PetsDB.mensagemDeErro(erro) });
    }
  }

  render() {
    // Primeiro separa os meus pets dos pets da comunidade, depois aplica o filtro de espécie.
    const doGrupo = this.state.pets.filter(
      (pet) => Tutor.ehMeu(pet, this.state.tutorId) === (this.state.dono === 'Meus pets')
    );
    const pets = doGrupo.filter(
      (pet) => this.state.filtro === 'Todos' || pet.especie === this.state.filtro
    );

    return (
      <ScrollView style={estilos.tela} contentContainerStyle={estilos.conteudo}>
        {this.state.aviso !== '' ? <Text style={estilos.aviso}>{this.state.aviso}</Text> : null}

        <View style={estilos.linhaChips}>
          {['Meus pets', 'Comunidade'].map((dono) => (
            <Chip
              key={dono}
              texto={dono}
              ativo={this.state.dono === dono}
              onPress={() => this.setState({ dono: dono })}
            />
          ))}
        </View>

        <View style={[estilos.linhaChips, { marginBottom: 8 }]}>
          {['Todos', 'Cachorro', 'Gato', 'Outro'].map((filtro) => (
            <Chip
              key={filtro}
              texto={filtro}
              ativo={this.state.filtro === filtro}
              onPress={() => this.setState({ filtro: filtro })}
            />
          ))}
        </View>

        {this.state.carregando && this.state.pets.length === 0 ? (
          <ActivityIndicator size="large" color={cores.principal} style={estilos.carregando} />
        ) : null}

        {this.state.erro !== '' ? (
          <View style={{ marginBottom: 12 }}>
            <Text style={[estilos.erro, { marginTop: 0 }]}>{this.state.erro}</Text>
            <Botao titulo="Tentar novamente" contorno={true} onPress={() => this.carregar()} />
          </View>
        ) : null}

        {!this.state.carregando && this.state.erro === '' && pets.length === 0 ? (
          <Text style={estilos.vazio}>
            {doGrupo.length > 0
              ? 'Nenhum pet encontrado neste filtro.'
              : this.state.dono === 'Meus pets'
                ? 'Você ainda não cadastrou nenhum pet.'
                : 'Nenhum pet de outros tutores por enquanto.'}
          </Text>
        ) : null}

        {pets.map((pet) => (
          <TouchableOpacity
            key={pet.id}
            activeOpacity={0.8}
            accessibilityRole="button"
            style={estilos.cartao}
            onPress={() => this.props.navigation.navigate('DetalhesPet', { pet: pet })}
          >
            <Image source={Imagens[pet.especie] || Imagens.Outro} style={estilos.avatar} />
            <View style={estilos.cartaoInfo}>
              <Text style={estilos.nomeCartao} numberOfLines={1}>{pet.nome}</Text>
              <Text style={estilos.detalheCartao}>
                {pet.especie} · {pet.idade} {pet.idade === '1' ? 'ano' : 'anos'}
              </Text>
              <Text
                style={[
                  estilos.etiqueta,
                  pet.vacinas === 'Em dia' ? estilos.etiquetaOk : estilos.etiquetaAlerta
                ]}
              >
                Vacinas: {pet.vacinas}
              </Text>
            </View>
            <Text style={estilos.seta}>›</Text>
          </TouchableOpacity>
        ))}

        <Botao titulo="Cadastrar pet" onPress={() => this.props.navigation.navigate('CadastroPet')} />
      </ScrollView>
    );
  }
}
