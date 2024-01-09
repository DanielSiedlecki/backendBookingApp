function convertToLocalTime(utcDate: Date) {
    const localDate = new Date(utcDate);
    const offset = localDate.getTimezoneOffset();
    const localTime = new Date(localDate.getTime() - offset * 60000);
    return localTime;
}

export default convertToLocalTime;