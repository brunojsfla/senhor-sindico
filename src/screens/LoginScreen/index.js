import React, {useState, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import {StyleSheet} from 'react-native';
import {TextInputMask} from 'react-native-masked-text';
import C from './styles';

import {useStateValue} from '../../contexts/StateContext';
import api from '../../services/api';

export default () => {
  const navigation = useNavigation();
  const [context, dispatch] = useStateValue();

  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');

  const cpfRef = useRef(null);

  const handleLoginButton = async () => {
    if (cpf && password) {
      let cpfUnMask = cpfRef?.current.getRawValue();
      let result = await api.login(cpfUnMask, password);
      if (result.error === '') {
        dispatch({
          type: 'setToken',
          payload: {
            token: result.token,
          },
        });
        dispatch({
          type: 'setUser',
          payload: {
            user: result.user,
          },
        });
        navigation.reset({
          index: 1,
          routes: [{name: 'ChoosePropertyScreen'}],
        });
      } else {
        alert(result.error);
      }
    } else {
      alert('Informe seu CPF e sua senha!');
    }
  };

  const handleRegisterButton = () => {
    navigation.navigate('RegisterScreen');
  };

  return (
    <C.Container>
      <C.Logo
        source={require('../../assets/undraw_home.png')}
        resizeMode="contain"
      />
      <TextInputMask
        style={styled.inputCpf}
        placeholder="Digite seu CPF"
        type={'cpf'}
        value={cpf}
        onChangeText={t => setCpf(t)}
        ref={cpfRef}
      />
      <C.Field
        placeholder="Digite sua senha"
        secureTextEntry
        value={password}
        onChangeText={t => setPassword(t)}
      />
      <C.ButtonArea onPress={handleLoginButton}>
        <C.ButtonText>ENTRAR</C.ButtonText>
      </C.ButtonArea>
      <C.ButtonArea onPress={handleRegisterButton}>
        <C.ButtonText>CADASTRE-SE</C.ButtonText>
      </C.ButtonArea>
    </C.Container>
  );
};

const styled = StyleSheet.create({
  inputCpf: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    fontSize: 15,
    padding: 10,
    marginBottom: 15,
  },
});
