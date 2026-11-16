import * as Crypto from 'expo-crypto';
import { doc, getDocFromServer, setDoc } from 'firebase/firestore';
import { db } from './firebase';

// Contas dos tutores, na coleção "usuarios" do Firestore.
// O e-mail é o id do documento, então não existem duas contas com o mesmo e-mail.
// A senha nunca é gravada: fica só o hash (SHA-256) da senha misturada com um "sal" aleatório.
export default class UsuariosDB {
  static limparEmail(email) {
    return email.trim().toLowerCase();
  }

  static emailValido(email) {
    return /^[^\s@\/]+@[^\s@\/]+\.[^\s@\/]+$/.test(email);
  }

  static async gerarHash(senha, sal) {
    return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, sal + senha);
  }

  // Devolve o usuário criado, ou null se já existir uma conta com esse e-mail.
  static async cadastrar(nome, email, senha) {
    const referencia = doc(db, 'usuarios', email);
    const existente = await getDocFromServer(referencia);

    if (existente.exists()) {
      return null;
    }

    const sal = Crypto.randomUUID();
    const senhaHash = await UsuariosDB.gerarHash(senha, sal);

    await setDoc(referencia, {
      nome: nome,
      email: email,
      sal: sal,
      senhaHash: senhaHash,
      criadoEm: Date.now()
    });

    return { id: email, nome: nome, email: email };
  }

  // Devolve o usuário, ou null se o e-mail não existir ou a senha estiver errada.
  static async entrar(email, senha) {
    const item = await getDocFromServer(doc(db, 'usuarios', email));

    if (!item.exists()) {
      return null;
    }

    const dados = item.data();
    const senhaHash = await UsuariosDB.gerarHash(senha, dados.sal);

    if (senhaHash !== dados.senhaHash) {
      return null;
    }

    return { id: email, nome: dados.nome, email: email };
  }
}
