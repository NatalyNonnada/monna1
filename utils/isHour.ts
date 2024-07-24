function isValidTimeFormat(time: string): boolean {
    const parts = time.split(':');
    if (parts.length !== 2) {
        return false;
    }

    const hoursPart = parts[0];
    const minutesPart = parts[1];

    if (hoursPart.length !== 2 && hoursPart.length !== 1) {
        return false;
    }

    if (minutesPart.length !== 2) {
        return false;
    }

    const hours = Number(hoursPart);
    const minutes = Number(minutesPart);

    if (isNaN(hours) || isNaN(minutes)) {
        return false;
    }

    return true;
}

export const isMorningTime = (time: string): boolean => {
    if (!isValidTimeFormat(time.trim())) {
        return false;
    }

    const [hours, minutes] = time.split(':').map(Number);

    if (hours >= 7 && hours < 11.30) {
        return true;
    } else if (hours === 11 && minutes === 0) {
        return true;
    }

    return false;
}

export const isAfternoonTime = (time: string): boolean => {
    if (!isValidTimeFormat(time)) {
        return false;
    }

    const [hours, minutes] = time.split(':').map(Number);

    if (hours >= 3 && hours < 7.30) {
        return true;
    } else if (hours === 7 && minutes === 30) {
        return true;
    }

    return false;
}
