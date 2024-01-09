function convertTimeStringToTimestampUTC(timeString: string) {
    const [hours, minutes] = timeString.split(":");
    const currentDate = new Date();

    currentDate.setUTCHours(parseInt(hours, 10));
    currentDate.setUTCMinutes(parseInt(minutes, 10));
    currentDate.setUTCSeconds(0);
    currentDate.setUTCMilliseconds(0);

    const timestampUTC = currentDate.getTime();
    return timestampUTC;
}

export default convertTimeStringToTimestampUTC;
