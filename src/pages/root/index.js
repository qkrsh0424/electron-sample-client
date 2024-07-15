import { TopNavLayout } from "../../layout/TopNavLayout";
import { MainView } from "../../views/root";

const { ipcRenderer } = window.require('electron');

export function RootPage(props) {
    const handleClickOpenPage = async () => {
        const result = await ipcRenderer.invoke('smartstore/goto');
    }

    const handleScreenshot = async () => {
        const result = await ipcRenderer.invoke('screenshot/run');
    }

    const handleClickClosePage = async () => {
        const result = await ipcRenderer.invoke('close-page', 'hello');
    }
    return (
        <>
            <TopNavLayout />
            <MainView />
        </>
    );
}