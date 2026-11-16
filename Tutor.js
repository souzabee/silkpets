import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE = 'silkpets_usuario';

// Tutor logado no aparelho. Depois do login, o usuário fica guardado no AsyncStorage,
// então não é preciso entrar de novo cada vez que o app abre.
export default class Tutor {
  // undefined = ainda não leu o AsyncStorage; null = ninguém logado.
  static usuario = undefined;

  static async atual() {
    if (Tutor.usuario !== undefined) {
      return Tutor.usuario;
    }

    try {
      const salvo = await AsyncStorage.getItem(CHAVE);
      Tutor.usuario = salvo === null ? null : JSON.parse(salvo);
    } catch (erro) {
      Tutor.usuario = null;
    }

    return Tutor.usuario;
  }

  static async entrar(usuario) {
    Tutor.usuario = usuario;

    try {
      await AsyncStorage.setItem(CHAVE, JSON.stringify(usuario));
    } catch (erro) {
      // Sem acesso ao armazenamento, o login vale só enquanto o app estiver aberto.
    }
  }

  static async sair() {
    Tutor.usuario = null;

    try {
      await AsyncStorage.removeItem(CHAVE);
    } catch (erro) {}
  }

  // Id do tutor logado (o e-mail). É ele que marca o dono dos pets e das curtidas.
  static async id() {
    const usuario = await Tutor.atual();
    return usuario === null ? '' : usuario.id;
  }

  static ehMeu(pet, tutorId) {
    return tutorId !== '' && pet.donoId === tutorId;
  }
}
