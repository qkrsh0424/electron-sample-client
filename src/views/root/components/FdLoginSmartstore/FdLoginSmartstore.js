import { useState } from 'react';
import * as St from './FdLoginSmartstore.styled';
import { useGlobalSmartstoreContextActionsHook, useGlobalSmartstoreContextValueHook } from '../../../../contexts/GlobalSmartstoreContextProvider';

const { ipcRenderer } = window.require('electron');

export function FdLoginSmartstore(props) {
    const globalSmartstoreContextValue = useGlobalSmartstoreContextValueHook();
    const globalSmartstoreContextActions = useGlobalSmartstoreContextActionsHook();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [loginMessage, setLoginMessage] = useState('');

    const handleChangeUsername = (e) => {
        const value = e.target.value;

        setUsername(value);
    }

    const handleChangePassword = (e) => {
        const value = e.target.value;

        setPassword(value);
    }

    const handleSubmitConnect = async (e) => {
        e.preventDefault();
        globalSmartstoreContextActions.onChangeIsLoginLoading(true);

        const result = await ipcRenderer.invoke('smartstore/login', {
            username: username,
            password: password
        });

        globalSmartstoreContextActions.onChangeIsLoginLoading(false);

        if (result?.message === 'failure') {
            globalSmartstoreContextActions.onChangeIsLogin(false);
            setLoginMessage('로그인 정보를 다시 확인해 주세요.');
        }

        if (result?.message === 'success') {
            setLoginMessage('로그인 됨')
            globalSmartstoreContextActions.onChangeIsLogin(true);
            if (result?.content) {
                globalSmartstoreContextActions.onSetStoreNameList(result?.content);
            }
        }
    }

    console.log(globalSmartstoreContextValue.storeNameList);
    return (
        <>
            <St.Container>
                <St.Title>스마트스토어 로그인</St.Title>
                <St.LoginFormWrapper onSubmit={(e) => handleSubmitConnect(e)}>
                    <St.InputWrapper>
                        <label>아이디:</label>
                        <input
                            type='text'
                            value={username || ''}
                            onChange={(e) => handleChangeUsername(e)}
                            disabled={globalSmartstoreContextValue.isLoginLoading || globalSmartstoreContextValue.isLogin}
                        ></input>
                    </St.InputWrapper>
                    <St.InputWrapper>
                        <label>비밀번호:</label>
                        <input
                            type='password'
                            value={password || ''}
                            onChange={(e) => handleChangePassword(e)}
                            disabled={globalSmartstoreContextValue.isLoginLoading || globalSmartstoreContextValue.isLogin}
                        ></input>
                    </St.InputWrapper>
                    <St.ConnectButton
                        type='submit'
                        disabled={globalSmartstoreContextValue.isLoginLoading || globalSmartstoreContextValue.isLogin}
                    >
                        로그인
                    </St.ConnectButton>
                    {globalSmartstoreContextValue.isLoginLoading &&
                        <div>Connecting...</div>
                    }
                </St.LoginFormWrapper>
                {loginMessage &&
                    <div>{loginMessage}</div>
                }
            </St.Container>
        </>
    );
}