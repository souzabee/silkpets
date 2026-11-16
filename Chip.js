import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { estilos } from './estilos';

export default class Chip extends React.Component {
  render() {
    return (
      <TouchableOpacity
        style={[estilos.chip, this.props.ativo ? estilos.chipAtivo : null]}
        onPress={this.props.onPress}
      >
        <Text style={[estilos.chipTexto, this.props.ativo ? estilos.chipTextoAtivo : null]}>
          {this.props.texto}
        </Text>
      </TouchableOpacity>
    );
  }
}
