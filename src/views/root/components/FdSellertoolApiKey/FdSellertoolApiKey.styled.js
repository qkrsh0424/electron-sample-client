import styled from 'styled-components';

export const Container = styled.div`
    margin-bottom: 20px;
`;

export const Title = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;

    .title{
        font-size: 20px;
        font-weight: 600;
    }

    .buttonBox{
        button{
            padding: 8px 15px;
            margin: 0;
            background: #efefef;
            border: none;
            font-weight: 700;
            border-radius: 10px;
            cursor: pointer;
        }
    }
`;

export const FormWrapper = styled.div`
    margin-top: 10px;
    display: flex;
    gap: 20px;
    .inputBox{

    }

    .buttonBox{
        button{
            cursor: pointer;
        }
    }
`;