import { useState } from 'react';
import { useStoreNamesContextActionsHook, useStoreNamesContextValueHook } from '../../contexts/StoreNamesContextProvider';
import * as St from './FdStoreNames.styled';
import { useStoreContentContextActionsHook, useStoreContentContextValueHook } from '../../contexts/StoreContentContextProvider';
import { useGlobalSmartstoreContextValueHook } from '../../../../contexts/GlobalSmartstoreContextProvider';

const { ipcRenderer } = window.require('electron');

export function FdStoreNames(props) {
    const globalSmartstoreContextValue = useGlobalSmartstoreContextValueHook();

    const storeNamesValueContext = useStoreNamesContextValueHook();
    const storeNamesActionsContext = useStoreNamesContextActionsHook();
    const storeContentValueContext = useStoreContentContextValueHook();
    const storeContentActionsContext = useStoreContentContextActionsHook();

    const [checkedStoreNameList, setCheckedStoreNameList] = useState([]);

    const handleCheckStoreName = (storeName) => {
        if (checkedStoreNameList?.includes(storeName)) {
            setCheckedStoreNameList(prev => {
                return prev.filter(r => r !== storeName);
            });
            return;
        }

        setCheckedStoreNameList(prev => {
            return prev.concat([storeName]);
        })
    }

    const handleSubmitSearch = async () => {
        storeContentActionsContext.onSetIsLoading(true);
        const result = await ipcRenderer.invoke('smartstore/search', {
            storeNameList: checkedStoreNameList
        });

        if (result?.message === 'success' && result?.content) {
            storeContentActionsContext.onSetValueList(result?.content);
        }
        storeContentActionsContext.onSetIsLoading(false);
    }
    return (
        <>
            <St.Container>
                <St.Title>
                    스토어 리스트
                </St.Title>
                <St.BodyWrapper>
                    <St.StoreListWrapper>
                        {globalSmartstoreContextValue?.storeNameList?.map(storeName => {
                            return (
                                <Checkbox
                                    key={storeName}
                                    label={storeName}
                                    checked={checkedStoreNameList?.includes(storeName)}
                                    onClick={handleCheckStoreName}
                                />
                            );
                        })}
                    </St.StoreListWrapper>
                    <St.SearchButton
                        type='button'
                        onClick={() => handleSubmitSearch()}
                        disabled={storeContentValueContext?.isLoading}
                    >조회</St.SearchButton>
                    {storeContentValueContext?.isLoading &&
                        <St.LoadingElement>로딩중...</St.LoadingElement>
                    }
                </St.BodyWrapper>
            </St.Container>
        </>
    );
}

function Checkbox({
    label,
    checked,
    onClick
}) {
    const handleChange = (e) => {
        onClick(label)
    }

    return (
        <St.CheckboxWrapper>
            <input
                type='checkbox'
                checked={checked}
                onChange={(e) => handleChange(e)}
            ></input>
            <label onClick={() => handleChange()}>{label}</label>
        </St.CheckboxWrapper>
    );
}