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
    const globalConnectionContextValue = useGlobalConnectionContextValueHook();
    const globalSmartstoreContextValue = useGlobalSmartstoreContextValueHook();

    const connectionContextProvider = useConnectionContextValueHook();
    const storeNamesValueContext = useStoreNamesContextValueHook();
    const storeNamesActionsContext = useStoreNamesContextActionsHook();

    if(!globalSmartstoreContextValue?.isLogin){
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
            <FdOrderData />
        </St.Container>
    );
}