import styled from 'styled-components';

export const Container = styled.div`
    margin-top: 20px;
`;

export const Title = styled.h3`
    margin: 0;
`;

export const BodyWrapper = styled.div`
    position: relative;
    margin-top: 10px;
    display: flex;
    gap: 20px;
    width: fit-content;
`;

export const StoreListWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export const SearchButton = styled.button`
    width: 100px;
    background: #efefef;
    border: 1px solid #efefef;
    font-weight: 700;
    cursor: pointer;
`;

export const CheckboxWrapper = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;

    label{
        font-size: 18px;
    }
`;

export const LoadingElement = styled.div`
    position: absolute;
    background: #ffffff80;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 800;
`;