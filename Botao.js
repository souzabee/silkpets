import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { cores, estilos } from './estilos';

// Botão do app. Com a propriedade "contorno" vira um botão secundário (fundo branco).
export default class Botao extends React.Component {
  render() {
    const cor = this.props.cor ? this.props.cor : cores.principal;
    const contorno = this.props.contorno === true;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        accessibilityRole="button"
        style={[
          estilos.botao,
          { backgroundColor: contorno ? 'white' : cor, borderColor: cor },
          this.props.desabilitado ? estilos.botaoDesabilitado : null
        ]}
        disabled={this.props.desabilitado}
        onPress={this.props.onPress}
      >
        <Text style={[estilos.botaoTexto, contorno ? { color: cor } : null]}>{this.props.titulo}</Text>
      </TouchableOpacity>
    );
  }
}
