const receipt = require('receipt');

const formatRupiah = (number) => {
    return number.toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR'
    })
}

const formatReceipt = (order) => {
    receipt.config.currency = 'Rp';
    receipt.config.width = 60;
    receipt.config.ruler = '-';
    
    
    const products = order.Products.map(el => {
        return {
            item: el.name,
            qty: el.Transaction.quantity,
            cost: el.Transaction.totalPrice
        }
    })
    
    let totalCost = 0
    order.Products.forEach(el => {
        totalCost += el.Transaction.totalPrice
    })

    const output = receipt.create([
        { type: 'text', value: [
            'HACKTIVMART',
            'hacktiv@hacktiv.com',
            'www.hacktiv-mart.com'
        ], align: 'center' },
        { type: 'empty' },
        { type: 'properties', lines: [
            { name: 'Order Number', value: `${formatRupiah(order.code)}` },
            { name: 'Date', value: `${formatRupiah(order.updatedAt)}` }
        ] },
        { type: 'table', lines: products },
        { type: 'empty' },
        { type: 'properties', lines: [
            { name: 'Total amount', value: `${formatRupiah(totalCost)}` }
        ] },
        { type: 'empty' },
        { type: 'properties', lines: [
            { name: 'Amount Received', value: `${formatRupiah(totalCost)}` },
            { name: 'Amount Returned', value: `${formatRupiah(0)}` }
        ] },
        { type: 'empty' },
        { type: 'text', value: 'Thank You for Shopping in HacktivMart!', align: 'center', padding: 5 }
    ]);
    return output
}

module.exports = { formatRupiah, formatReceipt }