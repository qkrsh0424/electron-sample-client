import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import * as St from './FdOrderData.styled';
import { customDateUtils } from '../../../../utils/customDateUtils';
import { useStoreContentContextValueHook } from '../../contexts/StoreContentContextProvider';

const { ipcRenderer } = window.require('electron');

export function FdOrderData({
    excelTranslatorList
}) {
    const storeContentValueContext = useStoreContentContextValueHook();

    const [orderFormatList, setOrderFormatList] = useState(null);
    const [selectedStoreName, setSelectedStoreName] = useState(null);
    const [selectedOrderStatus, setSelectedOrderStatus] = useState(null);
    const [targetOrderDataList, setTargetOrderDataList] = useState(null);

    const [selectedExcelTranslator, setSelectedExcelTranslator] = useState(null);

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

    const handleChangeSelectedExcelTranslator = (excelTranslator) => {
        if (selectedExcelTranslator?.id === excelTranslator?.id) {
            setSelectedExcelTranslator(null);
            return;
        }

        setSelectedExcelTranslator(excelTranslator);
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
                        {/* <button
                            type='button'
                            onClick={() => handleClickDownloadExcel()}
                        >엑셀다운</button> */}
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

                {targetOrderDataList &&
                    <>
                        {excelTranslatorList ?
                            <St.ExcelTranslatorListWrapper>
                                <div className='title'>
                                    엑셀 변환기
                                </div>
                                <div className='listWrapper'>
                                    {excelTranslatorList?.map(excelTranslator => {
                                        return (
                                            <button
                                                key={excelTranslator?.id}
                                                className={`excelTranslatorName ${excelTranslator?.id === selectedExcelTranslator?.id ? 'active' : ''}`}
                                                onClick={() => handleChangeSelectedExcelTranslator(excelTranslator)}
                                            >
                                                {excelTranslator?.name}
                                            </button>
                                        );
                                    })}
                                </div>
                                <TranslatedDataList
                                    orderFormatList={orderFormatList}
                                    orderDataList={targetOrderDataList}
                                    excelTranslator={selectedExcelTranslator}
                                />
                            </St.ExcelTranslatorListWrapper>
                            :
                            <St.ExcelTranslatorListWrapper>
                                <div className='title'>
                                    엑셀 변환기
                                </div>
                                셀러툴 API키를 등록해 주세요.
                            </St.ExcelTranslatorListWrapper>
                        }

                    </>
                }
            </St.Container>
        </>
    );
}

function TranslatedDataList({ orderFormatList, orderDataList, excelTranslator }) {
    const [reformDataList, setReformDataList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const formatedOrderDataList = orderDataList?.map(orderData => {
            const data = orderFormatList?.reduce((acc, curr) => {
                acc[curr?.headerName] = orderData[curr.fieldName];

                return acc;
            }, {});
            return data;
        })

        const transDataList = formatedOrderDataList?.map(orderData => {
            return excelTranslator?.excelTranslatorDownloadHeaderList?.map(downloadHeader => {
                if (downloadHeader?.valueType === 'FIXED') {
                    return {
                        id: downloadHeader?.id,
                        value: downloadHeader?.fixedValue
                    }
                } else {
                    const mappingValueList = JSON.parse(downloadHeader?.mappingValues);
                    let value = '';
                    mappingValueList?.forEach((mappingValue, index) => {
                        let targetValue = orderData[mappingValue] || '';
                        if (index === 0) {
                            value += targetValue
                        } else {
                            value = value + downloadHeader?.separator + targetValue;
                        }
                    })

                    return {
                        id: downloadHeader?.id,
                        value: value
                    }
                }
            })
        })

        setReformDataList(transDataList)
    }, [orderFormatList, orderDataList, excelTranslator]);

    const handleSave = async () => {
        setIsLoading(true);
        const refExcelTranslatorHeaderResult = await ipcRenderer.invoke('ref-excel-translator-headers/searchDefault');
        const refExcelTranslatorHeader = refExcelTranslatorHeaderResult?.content;

        const temporaryErpItemList = reformDataList?.map(reformData => {

            return reformData?.reduce((acc, curr, index) => {
                let value = curr.value;
                if (refExcelTranslatorHeader?.refExcelTranslatorHeaderDetailList[index]?.fieldName === 'channelOrderDate') {
                    value = value ? customDateUtils.dateToLocalFormatWithT(value) : '';
                }

                acc[refExcelTranslatorHeader?.refExcelTranslatorHeaderDetailList[index]?.fieldName] = value;
                return acc;
            }, {})
        })

        if (!temporaryErpItemList || temporaryErpItemList?.length <= 0) {
            return;
        }

        try {
            const result = await ipcRenderer.invoke('temporary-erp-items/createList', {
                temporaryErpItemList: temporaryErpItemList
            });
            if (result?.content) {
                alert(`${result?.content}개의 임시 주문건을 생성했습니다.`);
            }
        } catch (err) {
            alert('문제가 발생했습니다.');
        }

        setIsLoading(false);
    }

    return (
        <>
            <St.OrderDataTableWrapper>
                <div className='table-box'>
                    <table>
                        <thead>
                            <tr>
                                {excelTranslator?.excelTranslatorDownloadHeaderList?.map(downloadHeader => {
                                    return (
                                        <th key={downloadHeader.id}>{downloadHeader?.headerName}</th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {reformDataList?.map((reformData, index) => {
                                return (
                                    <tr key={index}>
                                        {reformData?.map(data => {
                                            return (
                                                <td key={data?.id}>{data?.value}</td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <button
                    type='button'
                    onClick={handleSave}
                    disabled={isLoading}
                >
                    {isLoading ? '로딩중...' : '데이터 저장'}
                </button>
            </St.OrderDataTableWrapper>
        </>
    );
}