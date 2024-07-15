import { useEffect, useState } from 'react';
import { useGlobalConnectionContextActionsHook, useGlobalConnectionContextValueHook } from '../../contexts/GlobalConnectionContextProvider';
import * as St from './index.styled';
import { FdLoginSmartstore } from './components/FdLoginSmartstore/FdLoginSmartstore';
import { useGlobalSmartstoreContextActionsHook } from '../../contexts/GlobalSmartstoreContextProvider';

const { ipcRenderer } = window.require('electron');

export function MainView(props) {
    const globalConnectionContextValue = useGlobalConnectionContextValueHook();

    return (
        <>
            <St.Container>
                <ConnectButton />
                {globalConnectionContextValue?.isConnected &&
                    <FdLoginSmartstore />
                }
            </St.Container>
        </>
    );
}

const DEFAULT_CONNECTION_TIME = 3600;
function ConnectButton() {
    const globalConnectionContextValue = useGlobalConnectionContextValueHook();
    const globalConnectionContextActions = useGlobalConnectionContextActionsHook();

    const globalSmartstoreContextActions = useGlobalSmartstoreContextActionsHook();

    const [time, setTime] = useState(DEFAULT_CONNECTION_TIME); // 1시간을 초로 설정 (1시간 = 3600초)

    useEffect(() => {
        let intervalId;

        if (globalConnectionContextValue?.isConnected && time > 0) {
            intervalId = setInterval(() => {
                setTime(prevTime => prevTime - 1);
            }, 1000);
        } else if (!globalConnectionContextValue?.isConnected && time !== DEFAULT_CONNECTION_TIME) {
            invokeCloseBrowser();
            clearInterval(intervalId);
        }

        if (time === 0) {
            clearInterval(intervalId);
            invokeCloseBrowser();
            console.log('타이머가 종료되었습니다.');
        }

        return () => clearInterval(intervalId);
    }, [globalConnectionContextValue?.isConnected, time]);

    const invokeCreateBrowser = async () => {
        globalConnectionContextActions.onChangeIsLoading(true);
        const result = await ipcRenderer.invoke('core/create-browser');

        if (result?.message === 'success') {
            globalConnectionContextActions.onChangeIsConnected(true);
            setTime(DEFAULT_CONNECTION_TIME);
        }
        globalConnectionContextActions.onChangeIsLoading(false);
    }

    const invokeCloseBrowser = async () => {
        globalConnectionContextActions.onChangeIsLoading(true);
        const result = await ipcRenderer.invoke('core/close-browser');

        if (result?.message === 'success') {
            globalConnectionContextActions.onChangeIsConnected(false);
            setTime(0);
            globalSmartstoreContextActions.onInitialize();
        }
        globalConnectionContextActions.onChangeIsLoading(false);
    }

    const formatTime = (time) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div>
            {globalConnectionContextValue?.isLoading ?
                <St.ConnectButton>로딩중...</St.ConnectButton>
                :
                <>
                    {globalConnectionContextValue?.isConnected ?
                        <St.ConnectButton onClick={() => invokeCloseBrowser()}>
                            <div>연결 종료</div>
                        </St.ConnectButton>
                        :
                        <St.ConnectButton onClick={() => invokeCreateBrowser()}>
                            <div>연결 생성</div>
                        </St.ConnectButton>
                    }
                </>
            }
        </div>
    );
}