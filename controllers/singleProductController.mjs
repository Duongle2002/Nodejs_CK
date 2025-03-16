export const getSingleProductPage = (req, res) => {
    const cartItemCount = req.session.cart ? req.session.cart.length : 0;
    res.render('single_product', { title: 'Single Product Page', cartItemCount });
};