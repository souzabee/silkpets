import React from 'react';
import { ScrollView } from 'react-native';
import FormPet from './FormPet';
import PetsDB from './PetsDB';
import Som from './Som';
import Tutor from './Tutor';
import { estilos } from './estilos';

export default class CadastroPet extends React.Component {
  async salvar(pet) {
    // O dono é o código deste aparelho: é ele que libera editar, excluir e publicar pelo pet.
    const donoId = await Tutor.id();
    await PetsDB.salvar({ ...pet, donoId: donoId });
    Som.tocar();
    this.props.navigation.popTo('ListaPets', { aviso: pet.nome + ' foi cadastrado com sucesso!' });
  }

  render() {
    return (
      <ScrollView style={estilos.tela} contentContainerStyle={estilos.conteudo}>
        <FormPet textoBotao="Cadastrar" onSalvar={(pet) => this.salvar(pet)} />
      </ScrollView>
    );
  }
}
