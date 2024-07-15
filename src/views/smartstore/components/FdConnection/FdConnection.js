import { useState } from 'react';
import * as St from './FdConnection.styled';
import { useStoreNamesContextActionsHook, useStoreNamesContextValueHook } from '../../contexts/StoreNamesContextProvider';
import { useConnectionContextActionsHook, useConnectionContextValueHook } from '../../contexts/ConnectionContextProvider';
import { useStoreContentContextValueHook } from '../../contexts/StoreContentContextProvider';

const { ipcRenderer } = window.require('electron');

export function FdConnection(props) {
    const connectionValueContext = useConnectionContextValueHook();
    const connectionActionsContext = useConnectionContextActionsHook();
    const storeNamesActionsContext = useStoreNamesContextActionsHook();
    const storeContentValueContext = useStoreContentContextValueHook();

    const [username, setUsername] = useState('piaar.purchasing@gmail.com');
    const [password, setPassword] = useState('Nsyna134!');

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
        connectionActionsContext.onChangeIsLoading(true);

        const result = await ipcRenderer.invoke('smartstore/connect', {
            username: username,
            password: password
        });

        connectionActionsContext.onChangeIsLoading(false);

        if (result?.message === 'failure') {
            await handleDisconnect();
        }

        if (result?.message === 'success') {
            connectionActionsContext.onChangeIsConnected(true);
            if (result?.content) {
                storeNamesActionsContext.setValue(result?.content);
            }
        }
    }

    const handleDisconnect = async (e) => {
        await ipcRenderer.invoke('smartstore/disconnect');
        connectionActionsContext.onChangeIsConnected(false);
        storeNamesActionsContext.setValue(null);
    }

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
                            disabled={connectionValueContext.isLoading || connectionValueContext.isConnected}
                        ></input>
                    </St.InputWrapper>
                    <St.InputWrapper>
                        <label>비밀번호:</label>
                        <input
                            type='password'
                            value={password || ''}
                            onChange={(e) => handleChangePassword(e)}
                            disabled={connectionValueContext.isLoading || connectionValueContext.isConnected}
                        ></input>
                    </St.InputWrapper>
                    {connectionValueContext.isConnected ?
                        <St.ConnectButton
                            type='button'
                            disabled={connectionValueContext.isLoading || storeContentValueContext.isLoading}
                            onClick={() => handleDisconnect()}
                        >
                            DISCONNECT
                        </St.ConnectButton>
                        :
                        <St.ConnectButton
                            type='submit'
                            disabled={connectionValueContext.isLoading || storeContentValueContext.isLoading}
                        >
                            CONNECT
                        </St.ConnectButton>
                    }
                    {connectionValueContext.isLoading &&
                        <div>Connecting...</div>
                    }
                    {storeContentValueContext.isLoading &&
                        <div>로딩중...</div>
                    }
                </St.LoginFormWrapper>
            </St.Container>
        </>
    );
}