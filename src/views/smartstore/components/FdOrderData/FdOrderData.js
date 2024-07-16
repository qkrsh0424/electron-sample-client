import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import * as St from './FdOrderData.styled';
import { customDateUtils } from '../../../../utils/customDateUtils';
import { useStoreContentContextValueHook } from '../../contexts/StoreContentContextProvider';

const { ipcRenderer } = window.require('electron');

export function FdOrderData(props) {
    const storeContentValueContext = useStoreContentContextValueHook();

    const [orderFormatList, setOrderFormatList] = useState(null);
    const [selectedStoreName, setSelectedStoreName] = useState(null);
    const [selectedOrderStatus, setSelectedOrderStatus] = useState(null);
    const [targetOrderDataList, setTargetOrderDataList] = useState(null);

    useEffect(() => {
        invokeGetOrderFormatList();
    }, []);

    const invokeGetOrderFormatList = async () => {
        const result = await ipcRenderer.invoke('smartstore/get-orderFormatList');

        if (result?.message === 'success' && result?.content) {
            setOrderFormatList(result?.content);
        }
    }

    const handleClickOrder = async (storeName, orderStatus) => {
        setSelectedStoreName(storeName);
        setSelectedOrderStatus(orderStatus);

        const storeContent = storeContentValueContext?.valueList?.find(r => r.storeName === storeName);
        const orderDataList = storeContent?.content?.find(r => r.orderStatus === orderStatus)?.orderDataList || [];

        setTargetOrderDataList(orderDataList);
    }

    const handleClickDownloadExcel = async () => {
        const filenamePrefix = customDateUtils.dateToYYYYMMDDhhmmssFile(new Date());
        await ipcRenderer.invoke('smartstore/generate-excel', {
            data: targetOrderDataList
        })
            .then((base64Data) => {
                const link = document.createElement('a');
                link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64Data}`;
                link.download = `${filenamePrefix}_smartstore_${selectedStoreName?.replaceAll(' ', '')}.xlsx`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }).catch((error) => {
                console.error('엑셀 파일 생성 에러:', error);
            });
    }
    
    return (
        <>
            <St.Container>
                <St.StoreInfoWrapper>
                    {storeContentValueContext?.valueList?.map(storeContent => {
                        const newOrderCount = storeContent?.content?.find(r => r.orderStatus === 'NEW_ORDER')?.orderDataList?.length;
                        const orderConfirmCount = storeContent?.content?.find(r => r.orderStatus === 'ORDER_CONFIRM')?.orderDataList?.length;
                        const sendDelayCount = storeContent?.content?.find(r => r.orderStatus === 'SEND_DELAY')?.orderDataList?.length;
                        const sendCancelCount = storeContent?.content?.find(r => r.orderStatus === 'SEND_CANCEL')?.orderDataList?.length;
                        const sendAddressCount = storeContent?.content?.find(r => r.orderStatus === 'SEND_ADDRESS')?.orderDataList?.length;

                        return (
                            <St.StoreContentWrapper
                                key={storeContent?.storeName}
                            >
                                <div className='title'>{storeContent?.storeName}</div>
                                <div className='buttonGroup'>
                                    <button
                                        type='button'
                                        onClick={() => handleClickOrder(storeContent?.storeName, 'ORDER_CONFIRM')}
                                    >
                                        신규주문(발주 후) {orderConfirmCount} 건
                                    </button>
                                    <button
                                        type='button'
                                        onClick={() => handleClickOrder(storeContent?.storeName, 'SEND_DELAY')}
                                    >
                                        발송기한 초과 {sendDelayCount} 건
                                    </button>
                                    <button
                                        type='button'
                                        onClick={() => handleClickOrder(storeContent?.storeName, 'SEND_CANCEL')}
                                    >
                                       발송전 취소요청 {sendCancelCount} 건
                                    </button>
                                    <button
                                        type='button'
                                        onClick={() => handleClickOrder(storeContent?.storeName, 'SEND_ADDRESS')}
                                    >
                                        발송전 배송지 변경 {sendAddressCount} 건
                                    </button>
                                </div>
                            </St.StoreContentWrapper>
                        );
                    })}
                </St.StoreInfoWrapper>

                {(selectedStoreName && selectedOrderStatus) &&
                    <St.OrderDataTableWrapper>
                        <button
                            type='button'
                            onClick={() => handleClickDownloadExcel()}
                        >엑셀다운</button>
                        <div className='table-box'>
                            <table>
                                <thead>
                                    <tr>
                                        {orderFormatList?.map(orderFormat => {
                                            return (
                                                <th key={orderFormat.fieldName}>{orderFormat?.headerName}</th>
                                            );
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {targetOrderDataList?.map(orderData => {
                                        console.log(orderData)
                                        return (
                                            <tr key={orderData?.productOrderNo}>
                                                {orderFormatList?.map(orderFormat => {
                                                    return (
                                                        <td key={orderFormat?.fieldName}>{orderData[orderFormat?.fieldName]}</td>
                                                    );
                                                })}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </St.OrderDataTableWrapper>
                }
            </St.Container>
        </>
    );
}