function getDayName(date = new Date(), locale = 'en-US') {
    return date.toLocaleDateString(locale, { weekday: 'long' });
}

function validDateFormat(date: string) {
    let dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (dateRegex.test(date)) {
        return true;
    }
    else {
        return false
    }

}

export { getDayName, validDateFormat };