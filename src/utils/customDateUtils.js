import moment from "moment";

export const customDateUtils = {
    dateToYYYYMMDDhhmmssFile,
    dateToLocalFormatWithT
}

function dateToYYYYMMDDhhmmssFile(idate) {
    var date = new Date(idate);
    return moment(date).format("YYYYMMDDHHmmss");
}

function dateToLocalFormatWithT(idate){
    var date = new Date(idate);
    return moment(date).format("YYYY-MM-DDTHH:mm:ss");
}