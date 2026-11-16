import React from 'react';
import { ScrollView } from 'react-native';
import FormPet from './FormPet';
import PetsDB from './PetsDB';
import Som from './Som';
import { estilos } from './estilos';

export default class EditarPet extends React.Component {
  async salvar(pet) {
    const id = this.props.route.params.pet.id;
    await PetsDB.atualizar(id, pet);
    Som.tocar();
    this.props.navigation.popTo('ListaPets', { aviso: pet.nome + ' foi atualizado!' });
  }

  render() {
    return (
      <ScrollView style={estilos.tela} contentContainerStyle={estilos.conteudo}>
        <FormPet
          petInicial={this.props.route.params.pet}
          textoBotao="Salvar alterações"
          onSalvar={(pet) => this.salvar(pet)}
        />
      </ScrollView>
    );
  }
}
