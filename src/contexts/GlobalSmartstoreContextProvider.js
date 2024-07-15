import { createContext, useContext, useMemo, useState } from "react";

const GlobalSmartstoreValueContext = createContext();
const GlobalSmartstoreActionsContext = createContext();

export function GlobalSmartstoreContextProvider({ children }) {
    const [isLogin, setIsLogin] = useState(false);
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const [storeNameList, setStoreNameList] = useState(null);

    const actions = useMemo(
        () => {
            return {
                onChangeIsLogin: (bool) => {
                    setIsLogin(bool);
                },
                onChangeIsLoginLoading: (bool) => {
                    setIsLoginLoading(bool);
                },
                onSetStoreNameList: (storeNameList) => {
                    setStoreNameList(storeNameList);
                },
                onInitialize: () => {
                    setIsLogin(false);
                    setIsLoginLoading(false);
                    setStoreNameList(false);
                }
            }
        },
        []
    )

    return (
        <>
            <GlobalSmartstoreActionsContext.Provider value={{
                actions: actions
            }}>
                <GlobalSmartstoreValueContext.Provider value={{
                    isLogin: isLogin,
                    isLoginLoading: isLoginLoading,
                    storeNameList: storeNameList
                }}>
                    {children}
                </GlobalSmartstoreValueContext.Provider>
            </GlobalSmartstoreActionsContext.Provider>
        </>
    );
}

export function useGlobalSmartstoreContextValueHook(props) {
    const context = useContext(GlobalSmartstoreValueContext);

    if (context === undefined) {
        throw new Error('useGlobalSmartstoreContextValueHook should be used within GlobalSmartstoreValueContext');
    }

    return {
        isLogin: context.isLogin,
        isLoginLoading: context.isLoginLoading,
        storeNameList: context.storeNameList,
    };
}

export function useGlobalSmartstoreContextActionsHook(props) {
    const context = useContext(GlobalSmartstoreActionsContext);

    if (context === undefined) {
        throw new Error('useGlobalSmartstoreContextActionsHook should be used within GlobalSmartstoreActionsContext');
    }

    return {
        onChangeIsLogin: context.actions.onChangeIsLogin,
        onChangeIsLoginLoading: context.actions.onChangeIsLoginLoading,
        onSetStoreNameList: context.actions.onSetStoreNameList,
        onInitialize: context.actions.onInitialize,
    };
}