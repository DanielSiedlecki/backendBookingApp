function getDayName(date = new Date(), locale = 'en-US') {
    return date.toLocaleDateString(locale, { weekday: 'long' });
}

export { getDayName };