function getDayName(date = new Date(), locale = 'en-US') {
    return date.toLocaleDateString(locale, { weekday: 'long' });
}

function isUTCDate(date: Date) {
    return date.getTimezoneOffset() === 0;
}


export { getDayName, isUTCDate };