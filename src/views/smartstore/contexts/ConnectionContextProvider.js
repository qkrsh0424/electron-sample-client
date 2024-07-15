import { createContext, useContext, useMemo, useState } from "react";

const ConnectionValueContext = createContext();
const ConnectionActionsContext = createContext();

export function ConnectionContextProvider({ children }) {
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
            <ConnectionActionsContext.Provider value={{
                actions: actions
            }}>
                <ConnectionValueContext.Provider value={{
                    isLoading: isLoading,
                    isConnected: isConnected
                }}>
                    {children}
                </ConnectionValueContext.Provider>
            </ConnectionActionsContext.Provider>
        </>
    );
}

export function useConnectionContextValueHook(props) {
    const context = useContext(ConnectionValueContext);

    if (context === undefined) {
        throw new Error('useConnectionContextValueHook should be used within ConnectionValueContext');
    }

    return {
        isLoading: context.isLoading,
        isConnected: context.isConnected
    };
}

export function useConnectionContextActionsHook(props) {
    const context = useContext(ConnectionActionsContext);

    if (context === undefined) {
        throw new Error('useConnectionContextActionsHook should be used within ConnectionActionsContext');
    }

    return {
        onChangeIsLoading: context.actions.onChangeIsLoading,
        onChangeIsConnected: context.actions.onChangeIsConnected,
    };
}