export const stringformat = (template: string, values: string[]): string => {
    let result = template;

    for (let i = 0; i < values.length; i++) {
        result = result.replace(`{${i}}`, values[i]);
    }

    
return result;
};

export const getUtcDateTime = (): string => {
    return new Date().toUTCString();
};

export const getUserStore = (): number | string => {
    const userType = localStorage.getItem('userType');

    if (userType === 'store') {
        const store = localStorage.getItem('store');

        
return isNaN(Number(store)) ? '' : parseInt(store || '0');
    }

    
return '';
};

export const setItemStatusColor = (value: any, status: string): string | undefined => {
    if (value && status && status.toLowerCase() === 'received' && value.received_count > 0 && value.received_variance > 0) {
        return 'variance-status';
    }

    
return undefined;
};

export const getDayDiff = (date: Date): number | undefined => {
    if (date instanceof Date && !isNaN(date.valueOf())) {
        const date1 = new Date(date);
        const date2 = new Date();

        const differenceInTime = date2.getTime() - date1.getTime();
        const differenceInDays = differenceInTime / (1000 * 3600 * 24);

        
return differenceInDays;
    }

    
return undefined;
};

export const getVariance = (qty: string | number, rcvd: string | number): number | string => {
    if (qty && rcvd && !isNaN(Number(qty)) && !isNaN(Number(rcvd))) {
        return parseInt(qty.toString()) - parseInt(rcvd.toString());
    }

    
return '';
};

export const convertTZ = (date: string, tzString: string): string | null => {
    if (!date) return null;

    const tzDate = new Date(new Date(date + ' +0:00').toLocaleString('en-US', { timeZone: tzString }));
    const year = tzDate.getFullYear();

    let month = tzDate.getMonth() + 1;

    month = month.toString().length === 1 ? `0${month}` : month;

    let day = tzDate.getDate();

    day = day.toString().length === 1 ? `0${day}` : day;

    const formatted = `${day}/${month}/${year} ${formatAMPM(tzDate)}`;

    
return formatted;
};

const formatAMPM = (date: Date): string => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';

    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const strTime = `${hours}:${minutes} ${ampm}`;

    
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
            return userType === 'warehouse' || userType === 'buyer';
        case 'ReceiveItem':
            return userType === 'store';
        case 'OrderReport':
            return userType === 'manager' || userType === 'warehouse' || userType === 'buyer';
        default:
            return false;
    }
};

export const isValidStatusToChange = (statusToChange: string, currentStatus: string): boolean => {
    const validTransitions: { [key: string]: string[] } = {
        Wrapping: ["Wrapping", "On Hold", "Other (See notes)", "Wrapped", "Request To Hold"],
        Received: ["Received", "Other (See notes)"],
        OnHold: ["Wrapping", "On Hold", "Other (See notes)", "Wrapped", "Booked", "Request To Dispatch"],
        Dispatched: ["Received", "Dispatched", "Other (See notes)", "In Depot"],
        "Other (See notes)": ["Wrapping", "Received", "On Hold", "Dispatched", "Other (See notes)", "Wrapped", "Booked", "Request To Hold", "Request To Dispatch", "In Depot"],
        Wrapped: ["Wrapping", "On Hold", "Other (See notes)", "Wrapped", "Booked", "Request To Hold"],
        Booked: ["Dispatched", "Other (See notes)", "Wrapped", "Booked"],
        "Request To Hold": ["On Hold", "Other (See notes)", "Request To Hold", "Request To Dispatch"],
        "Request To Dispatch": ["Wrapping", "Other (See notes)", "Wrapped", "Request To Hold", "Request To Dispatch"],
        "In Depot": ["Received", "Dispatched", "Other (See notes)", "In Depot"],
    };

    return validTransitions[currentStatus]?.includes(statusToChange) ?? false;
};
