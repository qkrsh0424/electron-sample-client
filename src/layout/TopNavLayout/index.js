import { useNavigate } from 'react-router-dom';
import * as St from './index.styled';

export function TopNavLayout(props) {
    const navigate = useNavigate();

    const handleChangeRouter = (path) => {
        navigate({
            pathname: path
        });
    }

    return (
        <>
            <St.Container>
                <St.RouterButton
                    type='button'
                    onClick={() => handleChangeRouter('/')}
                >
                    홈
                </St.RouterButton>
                <St.RouterButton
                    type='button'
                    onClick={() => handleChangeRouter('/smartstore')}
                >
                    스마트스토어
                </St.RouterButton>
                <St.RouterButton
                    type='button'
                    onClick={() => handleChangeRouter('/coupang')}
                >
                    쿠팡
                </St.RouterButton>
            </St.Container>
        </>
    );
}