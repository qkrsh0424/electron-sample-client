import { TopNavLayout } from "../../layout/TopNavLayout";
import { MainView } from "../../views/smartstore";

export function SmartstorePage(props) {
    return (
        <>
            <TopNavLayout />
            <MainView />
        </>
    );
}