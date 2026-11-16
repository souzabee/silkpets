import { collection, getDocsFromServer, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

export default class PetsDB {
  static async salvar(pet) {
    await addDoc(collection(db, 'pets'), pet);
  }

  static async listar() {
    // Busca direto no servidor: sem internet ou sem permissão vira erro,
    // em vez de devolver uma lista vazia do cache.
    const resultado = await getDocsFromServer(collection(db, 'pets'));
    const pets = [];

    resultado.forEach((item) => {
      pets.push({ id: item.id, ...item.data() });
    });

    pets.sort((a, b) => String(a.nome || '').localeCompare(String(b.nome || '')));
    return pets;
  }

  static async atualizar(id, pet) {
    await updateDoc(doc(db, 'pets', id), pet);
  }

  static async remover(id) {
    await deleteDoc(doc(db, 'pets', id));
  }

  // Transforma o erro do Firestore em uma mensagem que explica o que aconteceu.
  static mensagemDeErro(erro) {
    console.error('Erro no Firestore:', erro);
    const codigo = erro && erro.code ? erro.code : '';

    if (codigo === 'permission-denied') {
      return 'O Firestore recusou o acesso. Atualize as regras de segurança do banco no Firebase Console (Firestore Database > Regras).';
    } else if (codigo === 'unavailable') {
      return 'Sem conexão com o banco de dados. Verifique a internet e tente novamente.';
    }
    return 'Não foi possível acessar o banco de dados. Tente novamente.';
  }
}
