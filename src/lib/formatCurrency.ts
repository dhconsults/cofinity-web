//export a function to fomat number 
export function formatCurrency(amount: number, currency: string = 'NGN'): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(amount);
}