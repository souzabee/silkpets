import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Home';
import ListaPets from './ListaPets';
import CadastroPet from './CadastroPet';
import DetalhesPet from './DetalhesPet';
import EditarPet from './EditarPet';
import Sobre from './Sobre';
import Feed from './Feed';
import NovaPublicacao from './NovaPublicacao';
import Publicacao from './Publicacao';
import Login from './Login';
import CadastroUsuario from './CadastroUsuario';
import { cores } from './estilos';

const Stack = createNativeStackNavigator();

export default class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerStyle: { backgroundColor: cores.principal },
            headerTintColor: 'white',
            headerTitleStyle: { fontWeight: 'bold' },
            headerShadowVisible: false,
            contentStyle: { backgroundColor: cores.fundo }
          }}
        >
          <Stack.Screen name="Login" component={Login} options={{ title: 'SilkPets' }} />
          <Stack.Screen name="CadastroUsuario" component={CadastroUsuario} options={{ title: 'Criar conta' }} />
          <Stack.Screen name="Home" component={Home} options={{ title: 'SilkPets' }} />
          <Stack.Screen name="Feed" component={Feed} options={{ title: 'Feed' }} />
          <Stack.Screen name="NovaPublicacao" component={NovaPublicacao} options={{ title: 'Nova publicação' }} />
          <Stack.Screen name="Publicacao" component={Publicacao} options={{ title: 'Publicação' }} />
          <Stack.Screen name="ListaPets" component={ListaPets} options={{ title: 'Pets' }} />
          <Stack.Screen name="CadastroPet" component={CadastroPet} options={{ title: 'Cadastrar pet' }} />
          <Stack.Screen name="DetalhesPet" component={DetalhesPet} options={{ title: 'Perfil do pet' }} />
          <Stack.Screen name="EditarPet" component={EditarPet} options={{ title: 'Editar pet' }} />
          <Stack.Screen name="Sobre" component={Sobre} options={{ title: 'Sobre o app' }} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
