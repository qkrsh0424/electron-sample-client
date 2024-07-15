import { createContext, useContext, useMemo, useState } from "react";

const StoreContentValueContext = createContext();
const StoreContentActionsContext = createContext();

export function StoreContentContextProvider({ children }) {
    const [valueList, setValueList] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const actions = useMemo(
        () => {
            return {
                onSetValueList(storeContentList) {
                    setValueList(storeContentList);
                },
                onSetIsLoading(bool) {
                    setIsLoading(bool);
                },
            }
        },
        []
    )

    return (
        <>
            <StoreContentActionsContext.Provider value={{
                setValueList: setValueList,
                setIsLoading: setIsLoading,
                actions: actions
            }}>
                <StoreContentValueContext.Provider value={{
                    valueList: valueList,
                    isLoading: isLoading
                }}>
                    {children}
                </StoreContentValueContext.Provider>
            </StoreContentActionsContext.Provider>
        </>
    );
}

export function useStoreContentContextValueHook(props) {
    const context = useContext(StoreContentValueContext);

    if (context === undefined) {
        throw new Error('useStoreContentContextValueHook should be used within StoreContentValueContext');
    }

    return {
        valueList: context.valueList,
        isLoading: context.isLoading
    };
}

export function useStoreContentContextActionsHook(props) {
    const context = useContext(StoreContentActionsContext);

    if (context === undefined) {
        throw new Error('useStoreContentContextActionsHook should be used within StoreContentActionsContext');
    }

    return {
        setValueList: context.setValueList,
        setIsLoading: context.setIsLoading,
        onSetValueList: context.actions.onSetValueList,
        onSetIsLoading: context.actions.onSetIsLoading
    };
}