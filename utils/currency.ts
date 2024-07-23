
export const format = (value: number, curr: string, form: string) => {

    const formatter = new Intl.NumberFormat(form, {
        style: 'currency',
        currency: curr,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    return formatter.format(value);
}