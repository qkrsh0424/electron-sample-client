import moment from "moment";

export const customDateUtils = {
    dateToYYYYMMDDhhmmssFile
}

function dateToYYYYMMDDhhmmssFile(idate) {
    var date = new Date(idate);
    return moment(date).format("YYYYMMDDHHmmss");
}