function validFormatTime(time: string) {

    let timeRegax = /^\d{2}:\d{2}$/;

    if (timeRegax.test(time)) {
        return true
    }
    else {
        return false
    }

}

export { validFormatTime }