import { StyleSheet } from 'react-native';

export const cores = {
  principal: '#6C4AB6',
  claro: '#EDE5FF',
  fundo: '#F7F4FF',
  borda: '#E3DAF7',
  texto: '#2B2140',
  cinza: '#7A7390',
  perigo: '#C0392B',
  sucesso: '#1E6B35'
};

const sombra = '0 2px 10px rgba(43, 33, 64, 0.07)';

export const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo
  },
  // Em telas largas (navegador) o conteúdo fica centralizado em uma coluna.
  conteudo: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    padding: 20,
    paddingBottom: 32
  },
  banner: {
    width: '100%',
    height: 170,
    borderRadius: 18,
    marginBottom: 20
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: cores.principal,
    letterSpacing: -0.3,
    marginBottom: 4
  },
  subtitulo: {
    fontSize: 16,
    lineHeight: 22,
    color: cores.cinza,
    marginBottom: 16
  },
  texto: {
    fontSize: 16,
    lineHeight: 23,
    color: cores.texto,
    marginBottom: 6
  },
  rotulo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: cores.texto,
    marginTop: 14,
    marginBottom: 6
  },
  painel: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: 16,
    marginBottom: 8,
    boxShadow: sombra
  },
  resumo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  resumoNumero: {
    minWidth: 52,
    height: 52,
    borderRadius: 26,
    paddingHorizontal: 12,
    marginRight: 14,
    backgroundColor: cores.claro,
    color: cores.principal,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 52,
    overflow: 'hidden'
  },
  resumoTexto: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    color: cores.texto
  },
  linhaDado: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: cores.borda
  },
  linhaDadoPrimeira: {
    borderTopWidth: 0,
    paddingTop: 0
  },
  dadoRotulo: {
    fontSize: 13,
    fontWeight: 'bold',
    color: cores.cinza,
    marginBottom: 2
  },
  dadoValor: {
    fontSize: 16,
    lineHeight: 22,
    color: cores.texto
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D5CBEF',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 16,
    color: cores.texto
  },
  inputGrande: {
    height: 96,
    paddingTop: 12,
    textAlignVertical: 'top'
  },
  botao: {
    minHeight: 50,
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12
  },
  botaoDesabilitado: {
    opacity: 0.5
  },
  botaoTexto: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  linhaChips: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  chip: {
    borderWidth: 1,
    borderColor: '#D5CBEF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: 'white'
  },
  chipAtivo: {
    backgroundColor: cores.principal,
    borderColor: cores.principal
  },
  chipTexto: {
    color: cores.principal,
    fontWeight: 'bold'
  },
  chipTextoAtivo: {
    color: 'white'
  },
  cartao: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: sombra
  },
  avatar: {
    width: 60,
    height: 60,
    marginRight: 14
  },
  cartaoInfo: {
    flex: 1
  },
  nomeCartao: {
    fontSize: 18,
    fontWeight: 'bold',
    color: cores.texto,
    marginBottom: 2
  },
  detalheCartao: {
    fontSize: 14,
    color: cores.cinza
  },
  seta: {
    fontSize: 26,
    color: '#B9ADD9',
    marginLeft: 8
  },
  etiqueta: {
    alignSelf: 'flex-start',
    fontSize: 12,
    fontWeight: 'bold',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 6,
    overflow: 'hidden'
  },
  etiquetaOk: {
    backgroundColor: '#DFF5E3',
    color: cores.sucesso
  },
  etiquetaAlerta: {
    backgroundColor: '#FBE0DD',
    color: cores.perigo
  },
  etiquetaNeutra: {
    backgroundColor: cores.claro,
    color: cores.principal
  },
  numeros: {
    flexDirection: 'row'
  },
  numero: {
    flex: 1,
    alignItems: 'center'
  },
  numeroValor: {
    fontSize: 22,
    fontWeight: 'bold',
    color: cores.principal
  },
  numeroRotulo: {
    fontSize: 13,
    color: cores.cinza
  },
  secao: {
    fontSize: 18,
    fontWeight: 'bold',
    color: cores.texto,
    marginTop: 20,
    marginBottom: 10
  },
  post: {
    marginBottom: 12
  },
  postCabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  postAvatar: {
    width: 44,
    height: 44,
    marginRight: 12
  },
  postNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: cores.texto
  },
  postTexto: {
    fontSize: 16,
    lineHeight: 23,
    color: cores.texto
  },
  postAcoes: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: cores.borda
  },
  postAcao: {
    paddingVertical: 8,
    paddingRight: 20
  },
  postAcaoTexto: {
    fontSize: 15,
    fontWeight: 'bold',
    color: cores.cinza
  },
  postCurtido: {
    color: '#D6336C'
  },
  comentario: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: cores.borda
  },
  comentarioAvatar: {
    width: 32,
    height: 32,
    marginRight: 10
  },
  contador: {
    fontSize: 13,
    color: cores.cinza,
    textAlign: 'right',
    marginTop: 4
  },
  aviso: {
    backgroundColor: '#DFF5E3',
    color: cores.sucesso,
    fontWeight: 'bold',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden'
  },
  erro: {
    backgroundColor: '#FBE0DD',
    color: cores.perigo,
    fontWeight: 'bold',
    lineHeight: 20,
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
    overflow: 'hidden'
  },
  carregando: {
    marginVertical: 24
  },
  vazio: {
    textAlign: 'center',
    color: cores.cinza,
    fontSize: 16,
    marginVertical: 24
  }
});
