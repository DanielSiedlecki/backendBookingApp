function parseTime(timeString: string): Date {
    const [hours, minutes] = timeString.split(":").map(Number);
    const dateObj = new Date();
    dateObj.setHours(hours, minutes);
    return dateObj;
}

export default parseTime;