import { useState } from 'react';
import * as St from './FdSellertoolApiKey.styled';

const { ipcRenderer } = window.require ? window.require('electron') : { ipcRenderer: null };

export function FdSellertoolApiKey(props) {
    const [formOpen, setFormOpen] = useState(false);
    const [apiKey, setApiKey] = useState(null);
    const [secretKey, setSecretKey] = useState(null);

    const toggleFormOpen = async (bool) => {
        setFormOpen(bool)

        if (bool) {
            await invokeGetApiKey();
        } else {
            setApiKey(null);
            setSecretKey(null);
        }
    }

    const handleChangeApiKey = (e) => {
        const value = e.target.value;

        setApiKey(value);
    }

    const handleChangeSecretKey = (e) => {
        const value = e.target.value;

        setSecretKey(value);
    }

    const invokeGetApiKey = async () => {
        const result = await ipcRenderer.invoke(`core/get-apiKey`);
        if (result?.message === 'success' && result?.content) {
            setApiKey(result?.content?.apiKey)
            setSecretKey(result?.content?.secretKey)
        }
    }

    const invokeSaveApiKey = async () => {
        const result = await ipcRenderer.invoke(`core/save-apiKey`, {
            apiKey: apiKey,
            secretKey: secretKey
        });

        if (result?.message === 'success') {
            toggleFormOpen(false);
            alert('API 정보가 저장되었습니다.');
        }
    }

    return (
        <>
            <St.Container>
                <St.Title>
                    <div className='title'>
                        셀러툴 API 정보
                    </div>
                    <div className='buttonBox'>
                        <button
                            type='button'
                            onClick={() => toggleFormOpen(!formOpen)}
                        >
                            보기
                        </button>
                    </div>
                </St.Title>
                {formOpen &&
                    <St.FormWrapper>
                        <div className='inputBox'>
                            <label>API 키 : </label>
                            <input
                                type='text'
                                value={apiKey || ''}
                                onChange={handleChangeApiKey}
                            ></input>
                        </div>
                        <div className='inputBox'>
                            <label>Secret 키 : </label>
                            <input
                                type='text'
                                value={secretKey || ''}
                                onChange={handleChangeSecretKey}
                            ></input>
                        </div>
                        <div className='buttonBox'>
                            <button
                                type='button'
                                onClick={() => invokeSaveApiKey()}
                            >
                                키 저장
                            </button>
                        </div>
                    </St.FormWrapper>
                }
            </St.Container>
        </>
    );
}