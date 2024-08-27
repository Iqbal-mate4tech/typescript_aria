// export const stringformat = (a: string, values: string[]): string => {
//     for (let i = 0; i < values.length; i++) {
//         a = a.replace("{" + i + "}", values[i]);
//     }
//     return a;
// };
export const stringformat = (a: string, values: string[]): string => {
    if (typeof a !== 'string') {
        throw new TypeError('Expected a string as the first argument.');
    }
    for (let i = 0; i < values.length; i++) {
        a = a.replace("{" + i + "}", values[i]);
    }
    return a;
};

export const getUtcDateTime = (): string => {
    return new Date().toUTCString();
};

export const getUserStore = (): string | number => {
    if (localStorage.getItem('userType') === 'store') {
        const store = localStorage.getItem('store');
        return store && !isNaN(Number(store)) ? parseInt(store, 10) : '';
    }
    return '';
};

export const setItemStatusColor = (value: any, status: string): string | undefined => {
    if (value && status && status.toLowerCase() === 'received' && value.received_count > 0 && value.received_variance > 0) {
        return 'variance-status';
    }
};

export const getDayDiff = (date: Date): number | undefined => {
    if (date instanceof Date && !isNaN(date.valueOf())) {
        const date1 = new Date(date);
        const date2 = new Date();
        const differenceInTime = date2.getTime() - date1.getTime();
        const differenceInDays = differenceInTime / (1000 * 3600 * 24);
        return differenceInDays;
    }
};

export const getVariance = (qty: number, rcvd: number): number | string => {
    return qty && rcvd && !isNaN(qty) && !isNaN(rcvd) ? parseInt(qty.toString()) - parseInt(rcvd.toString()) : '';
};

export const convertTZ = (date: string | Date, tzString: string): string => {
    if (!date) return date as string;

    const _tzDate = new Date(new Date(date + ' +0:00').toLocaleString("en-US", { timeZone: tzString }));

    const _year = _tzDate.getFullYear();

    let _month = _tzDate.getMonth() + 1;
    _month = _month.toString().length === 1 ? "0" + _month.toString() : _month.toString();

    let _date = _tzDate.getDate();
    _date = _date.toString().length === 1 ? "0" + _date.toString() : _date.toString();

    const _formatted = `${_date}/${_month}/${_year} ${formatAMPM(_tzDate)}`;
    return _formatted;
};

const formatAMPM = (date: Date): string => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
};

export const hasPermission = (action: string): boolean => {
    const userType = localStorage.getItem('userType');

    if (userType === 'admin') return true;

    switch (action) {
        case 'Booking':
        case 'Dispatch':
        case 'AddPallet':
        case 'UpdatePallet':
        case 'DeletePallet':
        case 'AddPalletItem':
        case 'UpdatePalletItem':
        case 'DeletePalletItem':
        case 'UpdateStatus':
        case 'PrintLabel':
        case 'Warehouse':
        case 'Distribution':
        case 'Sync':
            return userType === 'warehouse';

        case 'ReceiveItem':
            return userType === 'store';

        case 'OrderReport':
            return userType === 'manager' || userType === 'warehouse' || userType === 'buyer';

        default:
            return false;
    }
};

export const isValidStatusToChange = (statusToChange: string, currentStatus: string): boolean => {
    switch (currentStatus) {
        case "Wrapping":
            return ["Wrapping", "On Hold", "Other (See notes)", "Wrapped", "Request To Hold"].includes(statusToChange);
        case "Received":
            return ["Received", "Other (See notes)"].includes(statusToChange);
        case "OnHold":
            return ["Wrapping", "On Hold", "Other (See notes)", "Wrapped", "Booked", "Request To Dispatch"].includes(statusToChange);
        case "Dispatched":
            return ["Received", "Dispatched", "Other (See notes)", "In Depot"].includes(statusToChange);
        case "Other (See notes)":
            return ["Wrapping", "Received", "On Hold", "Dispatched", "Other (See notes)", "Wrapped", "Booked", "Request To Hold", "Request To Dispatch", "In Depot"].includes(statusToChange);
        case "Wrapped":
            return ["Wrapping", "On Hold", "Other (See notes)", "Wrapped", "Booked", "Request To Hold"].includes(statusToChange);
        case "Booked":
            return ["Dispatched", "Other (See notes)", "Wrapped", "Booked"].includes(statusToChange);
        case "Request To Hold":
            return ["On Hold", "Other (See notes)", "Request To Hold", "Request To Dispatch"].includes(statusToChange);
        case "Request To Dispatch":
            return ["Wrapping", "Other (See notes)", "Wrapped", "Request To Hold", "Request To Dispatch"].includes(statusToChange);
        case "In Depot":
            return ["Received", "Dispatched", "Other (See notes)", "In Depot"].includes(statusToChange);
        default:
            return true;
    }
};
