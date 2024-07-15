import styled from 'styled-components';

export const Container = styled.div`

`;

export const Title = styled.h3`
    margin: 0;
`;

export const LoginFormWrapper = styled.form`
    margin-top: 20px;
    display: flex;
    gap:20px;
    align-items: center;
`;

export const InputWrapper = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
    label{
    }

    input{
        flex:1;
        padding: 10px;
    }
`;

export const ConnectButton = styled.button`
    background: #efefef;
    border: 1px solid #efefef;
    padding: 10px;
    cursor: pointer;
`;