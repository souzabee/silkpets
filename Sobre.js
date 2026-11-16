import React from 'react';
import { ScrollView, View, Text, Image } from 'react-native';
import Botao from './Botao';
import Imagens from './Imagens';
import Som from './Som';
import { estilos } from './estilos';

export default class Sobre extends React.Component {
  renderSecao(titulo, texto, primeira) {
    return (
      <View style={[estilos.linhaDado, primeira ? estilos.linhaDadoPrimeira : null]}>
        <Text style={estilos.dadoRotulo}>{titulo}</Text>
        <Text style={estilos.dadoValor}>{texto}</Text>
      </View>
    );
  }

  render() {
    return (
      <ScrollView style={estilos.tela} contentContainerStyle={estilos.conteudo}>
        <Image source={Imagens.banner} style={[estilos.banner, { height: 120 }]} resizeMode="cover" />

        <Text style={[estilos.titulo, { marginBottom: 14 }]}>Sobre o SilkPets</Text>

        <View style={[estilos.painel, { paddingBottom: 4 }]}>
          {this.renderSecao(
            'Motivação',
            'Tutores gostam de mostrar o dia a dia dos seus pets e, ao mesmo tempo, esquecem a situação ' +
              'das vacinas e o nome do veterinário. O SilkPets junta as duas coisas em um só lugar.',
            true
          )}
          {this.renderSecao(
            'Objetivo',
            'Ser uma rede social de pets: cada pet tem um perfil com seus dados de saúde e pode publicar, ' +
              'curtir e comentar no feed da comunidade.'
          )}
          {this.renderSecao(
            'Tecnologias',
            'React Native, React Navigation, Firebase Firestore (banco de dados na nuvem), expo-crypto ' +
              '(hash da senha), AsyncStorage (usuário logado), expo-audio (som) e vibração do celular.'
          )}
          {this.renderSecao(
            'Som e vibração',
            'Um som toca ao cadastrar, atualizar, remover, publicar ou comentar, e o celular vibra ao ' +
              'curtir uma publicação. Toque abaixo para testar o som.'
          )}
        </View>

        <Botao titulo="Testar som" onPress={() => Som.tocar()} />
      </ScrollView>
    );
  }
}
