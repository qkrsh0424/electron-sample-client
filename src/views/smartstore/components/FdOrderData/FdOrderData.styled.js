import styled from 'styled-components';

export const Container = styled.div`
    margin-top: 20px;
`;

export const StoreInfoWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
`;

export const StoreContentWrapper = styled.div`
    border: 1px solid #f0f0f0;
    width: fit-content;
    padding: 20px;

    .title{
        font-weight: 700;
        text-align: center;
        margin-bottom: 10px;
    }

    .buttonGroup{
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
`;

export const OrderDataTableWrapper = styled.div`
    margin-top: 20px;
    .table-box{
        height: 300px;
        overflow: auto;
        border: 1px solid #77777740;
        background: #fff;
        border-radius: 10px;
    }

    table{
        position:relative;
        text-align: center;
        width: fit-content;
        table-layout: fixed;
        border: none;
        font-size: 10px;

        th{
            width: 150px;
        }
    }
`;

export const ExcelTranslatorListWrapper = styled.div`
    margin-top: 20px;
    .title{
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 10px;
    }

    .listWrapper{
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        border: 1px solid #f0f0f0;
        padding: 10px;
        height: 100px;
        overflow-y: auto;
        border-radius: 10px;
    
        .excelTranslatorName{
            border: 1px solid #e0e0e0;
            font-size: 10px;
            padding: 5px 10px;
            border-radius: 10px;
            cursor: pointer;
            background: #fff;

            &.active{
                background: #000;
                color: #fff;
                font-weight: 700;
                border-color: #000;
            }
        }
    }

`;