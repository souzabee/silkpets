import {
  collection,
  doc,
  query,
  where,
  getDocsFromServer,
  getDocFromServer,
  addDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from './firebase';

// Publicações da rede social. Cada documento da coleção "posts" guarda:
// petId, donoId, texto, humor, data, curtidas (lista de tutores) e comentarios (lista).
export default class PostsDB {
  static async publicar(post) {
    await addDoc(collection(db, 'posts'), post);
  }

  static async listar() {
    const resultado = await getDocsFromServer(collection(db, 'posts'));
    return PostsDB.montarLista(resultado);
  }

  static async listarDoPet(petId) {
    const consulta = query(collection(db, 'posts'), where('petId', '==', petId));
    const resultado = await getDocsFromServer(consulta);
    return PostsDB.montarLista(resultado);
  }

  static async buscar(id) {
    const item = await getDocFromServer(doc(db, 'posts', id));

    if (!item.exists()) {
      return null;
    }
    return PostsDB.montar(item);
  }

  // curtir = true adiciona o tutor na lista de curtidas; false remove.
  static async curtir(id, tutorId, curtir) {
    await updateDoc(doc(db, 'posts', id), {
      curtidas: curtir ? arrayUnion(tutorId) : arrayRemove(tutorId)
    });
  }

  static async comentar(id, comentario) {
    await updateDoc(doc(db, 'posts', id), { comentarios: arrayUnion(comentario) });
  }

  static async remover(id) {
    await deleteDoc(doc(db, 'posts', id));
  }

  // Usado quando um pet é excluído: apaga também as publicações dele.
  static async removerDoPet(petId) {
    const posts = await PostsDB.listarDoPet(petId);

    for (const post of posts) {
      await PostsDB.remover(post.id);
    }
  }

  static montar(item) {
    const dados = item.data();

    return {
      id: item.id,
      ...dados,
      curtidas: dados.curtidas ? dados.curtidas : [],
      comentarios: dados.comentarios ? dados.comentarios : []
    };
  }

  // Mais recentes primeiro.
  static montarLista(resultado) {
    const posts = [];

    resultado.forEach((item) => {
      posts.push(PostsDB.montar(item));
    });

    posts.sort((a, b) => b.data - a.data);
    return posts;
  }

  // Texto como "há 5 min" ou "há 2 dias" a partir da data da publicação.
  static tempoDesde(data) {
    const minutos = Math.floor((Date.now() - data) / 60000);

    if (minutos < 1) {
      return 'agora';
    } else if (minutos < 60) {
      return 'há ' + minutos + ' min';
    } else if (minutos < 60 * 24) {
      return 'há ' + Math.floor(minutos / 60) + ' h';
    }

    const dias = Math.floor(minutos / (60 * 24));
    return 'há ' + dias + (dias === 1 ? ' dia' : ' dias');
  }
}
