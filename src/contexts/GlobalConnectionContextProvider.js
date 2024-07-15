import { createContext, useContext, useMemo, useState } from "react";

const GlobalConnectionValueContext = createContext();
const GlobalConnectionActionsContext = createContext();

export function GlobalConnectionContextProvider({ children }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    const actions = useMemo(
        () => {
            return {
                onChangeIsLoading: (bool) => {
                    setIsLoading(bool);
                },
                onChangeIsConnected: (bool) => {
                    setIsConnected(bool);
                }
            }
        },
        []
    )

    return (
        <>
            <GlobalConnectionActionsContext.Provider value={{
                actions: actions
            }}>
                <GlobalConnectionValueContext.Provider value={{
                    isLoading: isLoading,
                    isConnected: isConnected
                }}>
                    {children}
                </GlobalConnectionValueContext.Provider>
            </GlobalConnectionActionsContext.Provider>
        </>
    );
}

export function useGlobalConnectionContextValueHook(props) {
    const context = useContext(GlobalConnectionValueContext);

    if (context === undefined) {
        throw new Error('useGlobalConnectionContextValueHook should be used within GlobalConnectionValueContext');
    }

    return {
        isLoading: context.isLoading,
        isConnected: context.isConnected
    };
}

export function useGlobalConnectionContextActionsHook(props) {
    const context = useContext(GlobalConnectionActionsContext);

    if (context === undefined) {
        throw new Error('useGlobalConnectionContextActionsHook should be used within GlobalConnectionActionsContext');
    }

    return {
        onChangeIsLoading: context.actions.onChangeIsLoading,
        onChangeIsConnected: context.actions.onChangeIsConnected,
    };
}