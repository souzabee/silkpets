import React from 'react';
import { View, Text, TextInput, Image } from 'react-native';
import Botao from './Botao';
import Chip from './Chip';
import Imagens from './Imagens';
import PetsDB from './PetsDB';
import { estilos, cores } from './estilos';

export default class FormPet extends React.Component {
  constructor(props) {
    super(props);
    const pet = props.petInicial ? props.petInicial : {};

    this.state = {
      nome: pet.nome ? pet.nome : '',
      especie: pet.especie ? pet.especie : 'Cachorro',
      idade: pet.idade ? pet.idade : '',
      veterinario: pet.veterinario ? pet.veterinario : '',
      vacinas: pet.vacinas ? pet.vacinas : 'Em dia',
      descricao: pet.descricao ? pet.descricao : '',
      mensagem: '',
      salvando: false
    };
  }

  async salvar() {
    const nome = this.state.nome.trim();
    const idade = parseInt(this.state.idade);

    if (nome === '' || isNaN(idade)) {
      this.setState({ mensagem: 'Informe o nome e a idade do pet' });
      return;
    }

    const pet = {
      nome: nome,
      especie: this.state.especie,
      idade: String(idade),
      veterinario: this.state.veterinario.trim(),
      vacinas: this.state.vacinas,
      descricao: this.state.descricao.trim()
    };

    this.setState({ salvando: true, mensagem: '' });

    try {
      await this.props.onSalvar(pet);
    } catch (erro) {
      this.setState({
        salvando: false,
        mensagem: PetsDB.mensagemDeErro(erro)
      });
    }
  }

  render() {
    return (
      <View>
        <View style={{ alignItems: 'center', marginBottom: 4 }}>
          <Image source={Imagens[this.state.especie]} style={{ width: 110, height: 110 }} />
        </View>

        <Text style={estilos.rotulo}>Nome</Text>
        <TextInput
          style={estilos.input}
          placeholder="Ex.: Thor"
          placeholderTextColor={cores.cinza}
          value={this.state.nome}
          onChangeText={(texto) => this.setState({ nome: texto })}
        />

        <Text style={estilos.rotulo}>Espécie</Text>
        <View style={estilos.linhaChips}>
          {['Cachorro', 'Gato', 'Outro'].map((especie) => (
            <Chip
              key={especie}
              texto={especie}
              ativo={this.state.especie === especie}
              onPress={() => this.setState({ especie: especie })}
            />
          ))}
        </View>

        <Text style={estilos.rotulo}>Idade (anos)</Text>
        <TextInput
          style={estilos.input}
          keyboardType="numeric"
          value={this.state.idade}
          onChangeText={(texto) => this.setState({ idade: texto })}
        />

        <Text style={estilos.rotulo}>Veterinário</Text>
        <TextInput
          style={estilos.input}
          value={this.state.veterinario}
          onChangeText={(texto) => this.setState({ veterinario: texto })}
        />

        <Text style={estilos.rotulo}>Vacinas</Text>
        <View style={estilos.linhaChips}>
          {['Em dia', 'Atrasadas'].map((situacao) => (
            <Chip
              key={situacao}
              texto={situacao}
              ativo={this.state.vacinas === situacao}
              onPress={() => this.setState({ vacinas: situacao })}
            />
          ))}
        </View>

        <Text style={estilos.rotulo}>Descrição</Text>
        <TextInput
          style={[estilos.input, estilos.inputGrande]}
          multiline={true}
          value={this.state.descricao}
          onChangeText={(texto) => this.setState({ descricao: texto })}
        />

        <Botao
          titulo={this.state.salvando ? 'Salvando...' : this.props.textoBotao}
          desabilitado={this.state.salvando}
          onPress={() => this.salvar()}
        />

        {this.state.mensagem !== '' ? <Text style={estilos.erro}>{this.state.mensagem}</Text> : null}
      </View>
    );
  }
}
