import { createContext, useContext, useMemo, useState } from "react";

const StoreNamesValueContext = createContext();
const StoreNamesActionsContext = createContext();

export function StoreNamesContextProvider({ children }) {
    const [value, setValue] = useState(null);

    const actions = useMemo(
        () => {
            return {
                onSetValue(storeNames) {
                    setValue(storeNames);
                },
            }
        },
        []
    )

    return (
        <>
            <StoreNamesActionsContext.Provider value={{
                setValue: setValue,
                actions: actions
            }}>
                <StoreNamesValueContext.Provider value={value}>
                    {children}
                </StoreNamesValueContext.Provider>
            </StoreNamesActionsContext.Provider>
        </>
    );
}

export function useStoreNamesContextValueHook(props) {
    const context = useContext(StoreNamesValueContext);

    if (context === undefined) {
        throw new Error('useStoreNamesContextValueHook should be used within StoreNamesValueContext');
    }

    return {
        value: context
    };
}

export function useStoreNamesContextActionsHook(props) {
    const context = useContext(StoreNamesActionsContext);

    if (context === undefined) {
        throw new Error('useStoreNamesContextActionsHook should be used within StoreNamesActionsContext');
    }

    return {
        setValue: context.setValue,
        onSetValue: context.actions.onSetValue,
    };
}