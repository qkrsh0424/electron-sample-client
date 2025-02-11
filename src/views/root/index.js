import { useEffect, useState } from 'react';
import { useGlobalConnectionContextActionsHook, useGlobalConnectionContextValueHook } from '../../contexts/GlobalConnectionContextProvider';
import * as St from './index.styled';
import { FdLoginSmartstore } from './components/FdLoginSmartstore/FdLoginSmartstore';
import { useGlobalSmartstoreContextActionsHook } from '../../contexts/GlobalSmartstoreContextProvider';
import { FdSellertoolApiKey } from './components/FdSellertoolApiKey/FdSellertoolApiKey';

const { ipcRenderer } = window.require ? window.require('electron') : { ipcRenderer: null };

if (!ipcRenderer) {
    console.error('ipcRenderer is not available. Ensure that nodeIntegration is enabled.');
} else if (typeof ipcRenderer.invoke !== 'function') {
    console.error('ipcRenderer.invoke is not available. Ensure that contextIsolation is set to false and nodeIntegration is set to true.');
} else {
    console.log('ipcRenderer.invoke is available.');
    // Your code using ipcRenderer.invoke here
}

export function MainView(props) {
    const globalConnectionContextValue = useGlobalConnectionContextValueHook();

    const [testCheckFlag, setTestCheckFlag] = useState(false);

    return (
        <>
            <St.Container>
                <FdSellertoolApiKey />
                <ConnectButton
                    testCheckFlag={testCheckFlag}
                />
                {globalConnectionContextValue?.isConnected &&
                    <FdLoginSmartstore />
                }
            </St.Container>

            <St.TestCheckButtonBox>
                <input
                    type='checkbox'
                    checked={testCheckFlag || false}
                    onChange={(e) => setTestCheckFlag(!testCheckFlag)}
                ></input>
                <label onClick={(e) => setTestCheckFlag(!testCheckFlag)}>테스트모드</label>
            </St.TestCheckButtonBox>
        </>
    );
}

const DEFAULT_CONNECTION_TIME = 3600;
function ConnectButton({
    testCheckFlag
}) {
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
        console.log('===== invokeCreateBrowser Function Start')

        console.log('=== globalConnectionContextActions.onChangeIsLoading(true); Start')
        globalConnectionContextActions.onChangeIsLoading(true);
        console.log('=== globalConnectionContextActions.onChangeIsLoading(true); End')

        console.log('=== await ipcRenderer.invoke Start')
        const result = await ipcRenderer.invoke('core/create-browser', {
            testMode: testCheckFlag
        });
        console.log('=== await ipcRenderer.invoke End')

        console.log('result is : ', result);
        console.log('=== result check Start')
        if (result?.message === 'success') {
            console.log('= result is success')
            globalConnectionContextActions.onChangeIsConnected(true);
            setTime(DEFAULT_CONNECTION_TIME);
        }
        console.log('=== result check End')

        console.log('=== globalConnectionContextActions.onChangeIsLoading(false); Start')
        globalConnectionContextActions.onChangeIsLoading(false);
        console.log('=== globalConnectionContextActions.onChangeIsLoading(false); End')

        console.log('invokeCreateBrowser Function End')
    }

    const invokeCloseBrowser = async () => {
        console.log('===== invokeCloseBrowser Function Start')
        console.log('=== globalConnectionContextActions.onChangeIsLoading(true); Start')
        globalConnectionContextActions.onChangeIsLoading(true);
        console.log('=== globalConnectionContextActions.onChangeIsLoading(true); End')

        console.log('=== await ipcRenderer.invoke Start')
        const result = await ipcRenderer.invoke('core/close-browser');
        console.log('=== await ipcRenderer.invoke End')

        console.log('=== result check Start')
        if (result?.message === 'success') {
            console.log('= result is success')
            globalConnectionContextActions.onChangeIsConnected(false);
            setTime(0);
            globalSmartstoreContextActions.onInitialize();
        }
        console.log('=== result check End')

        console.log('=== globalConnectionContextActions.onChangeIsLoading(false); Start')
        globalConnectionContextActions.onChangeIsLoading(false);
        console.log('=== globalConnectionContextActions.onChangeIsLoading(false); End')

        console.log('===== invokeCloseBrowser Function End')
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