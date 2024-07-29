import { Link } from 'react-router-dom';
import { useGlobalConnectionContextValueHook } from '../../contexts/GlobalConnectionContextProvider';
import { useGlobalSmartstoreContextValueHook } from '../../contexts/GlobalSmartstoreContextProvider';
import { FdConnection } from './components/FdConnection/FdConnection';
import { FdOrderData } from './components/FdOrderData/FdOrderData';
import { FdStoreNames } from './components/FdStoreNames/FdStoreNames';
import { ConnectionContextProvider, useConnectionContextValueHook } from './contexts/ConnectionContextProvider';
import { StoreContentContextProvider } from './contexts/StoreContentContextProvider';
import { StoreNamesContextProvider, useStoreNamesContextActionsHook, useStoreNamesContextValueHook } from './contexts/StoreNamesContextProvider';
import * as St from './index.styled';
import { useEffect, useState } from 'react';

const { ipcRenderer } = window.require ? window.require('electron') : { ipcRenderer: null };

export function MainView(props) {
    return (
        <>
            <ConnectionContextProvider>
                <StoreNamesContextProvider>
                    <StoreContentContextProvider>
                        <MainViewCore />
                    </StoreContentContextProvider>
                </StoreNamesContextProvider>
            </ConnectionContextProvider>
        </>
    );
}

function MainViewCore() {
    const globalSmartstoreContextValue = useGlobalSmartstoreContextValueHook();

    const [excelTranslatorList, setExcelTranslatorList] = useState(null);

    useEffect(() => {
        invokeFetchExcelTranslatorList();
    }, []);
    
    const invokeFetchExcelTranslatorList = async () => {
        const result = await ipcRenderer.invoke(`excel-translators/searchList`);

        if (result?.message === 'success' && result?.content) {
            setExcelTranslatorList(result?.content);
        }else{
            alert(`엑셀 변환기 불러오기: ${result?.message}`)
        }
    }

    if (!globalSmartstoreContextValue?.isLogin) {
        return (
            <>
                <Link to={'/'}>
                    홈으로
                </Link>
            </>
        );
    }
    return (
        <St.Container>
            {(globalSmartstoreContextValue.storeNameList) &&
                <FdStoreNames />
            }
            <FdOrderData
                excelTranslatorList={excelTranslatorList}
            />
        </St.Container>
    );
}