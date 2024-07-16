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

    const [confirmNewOrderFlag, setConfirmNewOrderFlag] = useState(false);
    const [checkedStoreNameList, setCheckedStoreNameList] = useState([]);

    const handleCheckConfirmNewOrderFlag = () => {
        setConfirmNewOrderFlag(confirmNewOrderFlag ? false : true);
    }

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
            confirmNewOrderFlag: confirmNewOrderFlag,
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
                    <St.ConfirmNewOrderCheckBox>
                        <ConfirmNewOrderFlagCheckbox
                            label={'신규 주문 발주확인'}
                            checked={confirmNewOrderFlag || false}
                            onClick={handleCheckConfirmNewOrderFlag}
                        />
                    </St.ConfirmNewOrderCheckBox>
                    <div className='flexBox'>
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
                    </div>
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

function ConfirmNewOrderFlagCheckbox({
    label,
    checked,
    onClick
}) {
    const handleChange = (e) => {
        console.log(checked)
        onClick();
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