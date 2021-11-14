import React, {useState, useRef, useEffect} from 'react';
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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const cpfRef = useRef(null);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Fazer cadastro',
    });
  }, []);

  const handleRegisterButton = async () => {
    if (name && cpf && email && password && passwordConfirm) {
      let cpfUnMask = cpfRef?.current.getRawValue();
      let result = await api.register(name, email, cpfUnMask, password, passwordConfirm);
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
      alert('Campo(s) obrigatório(s) não informado(s)!');
    }
  };

  return (
    <C.Container>
      <C.Field
        placeholder="Digite seu nome completo"
        value={name}
        onChangeText={t => setName(t)}
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
        placeholder="Digite seu e-mail"
        secureTextEntry
        value={email}
        keyboardType="email-address"
        onChangeText={t => setEmail(t)}
      />
      <C.Field
        placeholder="Digite sua senha"
        secureTextEntry
        value={password}
        onChangeText={t => setPassword(t)}
      />
      <C.Field
        placeholder="Repita sua senha"
        secureTextEntry
        value={passwordConfirm}
        onChangeText={t => setPasswordConfirm(t)}
      />
      <C.ButtonArea onPress={handleRegisterButton}>
        <C.ButtonText>CADASTRAR</C.ButtonText>
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
