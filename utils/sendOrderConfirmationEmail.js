require('dotenv').config();

const ejs = require("ejs");
const path = require("path");

const mailer = require('./mailer');

async function sendOrderConfirmationEmail(data)
{
    // Hardcoded slug -> image mapping
    const slugImages = 
    {
        "orthopedic-cervical-pillow": path.join(__dirname, "../public/images/pillow.jpg"),
        "posture-corrector-belt": path.join(__dirname, "../public/images/belt.jpg"),
        "therapy-massage-tool": path.join(__dirname, "../public/images/tool.jpg"),
        "lumbar-support-cushion": path.join(__dirname, "../public/images/cushion.jpg"),
    };

    // ---------------- Parse cart ----------------
    let cartFromFrontEnd = data.cartFromFrontEnd;

    if (typeof cartFromFrontEnd === "string") {
        try {
            cartFromFrontEnd = JSON.parse(cartFromFrontEnd);
        } catch (err) {
            console.error("Invalid cart JSON:", err);
            cartFromFrontEnd = {}; // fallback empty cart
        }
    }

    // ---------------- Map cart items ----------------
    let orderCartItems = [];
    let subtotal = 0;

    for (const slug in cartFromFrontEnd) 
    {
        const cartItem = cartFromFrontEnd[slug];
        if (!cartItem) continue;

        // Use fallback image if slug not in hardcoded images
        const imgPath = slugImages[slug] || path.join(__dirname, "../public/images/default.png");

        const total = cartItem.qty * cartItem.price;
        subtotal += total;

        orderCartItems.push({
            slug,
            name: cartItem.title,
            qty: cartItem.qty,
            price: cartItem.price,
            img: imgPath,
            total
        });
    }

    // ---------------- Final orderData ----------------
    const orderData = {
        orderId: `CS-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        orderDate: new Intl.DateTimeFormat("en-US", { month:"short", day:"numeric", year:"numeric" }).format(new Date()),
        customerEmail: data.email,
        cartItems: orderCartItems,
        payment: {
            brand: data.cardBrand,
            last4: data.cardLast4,
            status: "Paid",
            subtotal,
            shippingCost: 0,
            total: subtotal
        },
        shipping: {
            name: data.name,
            address1: data.address1,
            address2: "",
            city: data.city,
            state: data.state,
            zip: data.zip,
            country: data.country
        }
    };

    // ---------------- Attachments ----------------
    let attachments = [];

    orderData.cartItems.forEach((item, index) => {
        attachments.push({
            filename: `item${index}.png`,
            path: item.img,
            cid: `item${index}@chirosnap`
        });
    });

    const brandLogos = {
        visa: path.join(__dirname, "../public/images/card_png/visa.png"),
        mastercard: path.join(__dirname, "../public/images/card_png/mastercard.png"),
        amex: path.join(__dirname, "../public/images/card_png/amex.png"),
        discover: path.join(__dirname, "../public/images/card_png/discover.png"),
        diners: path.join(__dirname, "../public/images/card_png/diners.png"),
        jcb: path.join(__dirname, "../public/images/card_png/jcb.png"),
        paypal: path.join(__dirname, "../public/images/card_png/paypal.png"),
        dc: path.join(__dirname, "../public/images/card_png/dc.png")
    };

    const brandKey = orderData.payment.brand?.toLowerCase();
    if (brandKey && brandLogos[brandKey]) {
        attachments.push({
            filename: `${brandKey}.png`,
            path: brandLogos[brandKey],
            cid: `paymentBrand@chirosnap`
        });
    }

    // ---------------- Render EJS ----------------
    const htmlTemplate = await ejs.renderFile(
        path.join(__dirname, "../views/order_confirmation.ejs"), 
        orderData
    );

    const mailOptions = {
        from: { name: `"${process.env.SITE_NAME}"`, address: process.env.SMTP_USER },
        to: orderData.customerEmail,
        subject: `${process.env.SITE_NAME} Order Confirmation - ${orderData.orderId}`,
        html: htmlTemplate,
        attachments
    };

    // Send email
    mailer(mailOptions);

    console.log("🎯 Order email fired, orderData:", orderData);
}

module.exports = sendOrderConfirmationEmail;
