import re

with open('apps/web/src/app/(app)/resources/FertiliserTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

replacement = """  const handleCheckout = () => {
    if (checkoutStep === 0) setCheckoutStep(1);
    else if (checkoutStep === 1) {
      // Send email via mailto
      const orderDetails = Object.entries(cart).map(([id, qty]) => {
        const item = FERTILISERS.find(f => f.id === id);
        return `${qty}x ${item?.name} (${item?.weight}) - ₹${(item?.price || 0) * qty}`;
      }).join('\\n');
      
      const total = cartTotalAmount - Math.floor(cartTotalAmount * 0.15);
      const orderId = `KS-${Math.floor(Math.random()*1000000)}`;
      
      const mailtoLink = `mailto:luffyfocusmode@gmail.com?subject=New Fertiliser Order: ${orderId}&body=${encodeURIComponent(`Hello,\\n\\nI would like to place an order for the following fertilisers:\\n\\n${orderDetails}\\n\\nTotal Amount (after subsidy): ₹${total}\\n\\nDelivery Address:\\nFarm Plot 2A, Village Raipur, Ludhiana, Punjab 141001\\n\\nPlease confirm my order.\\n\\nThank you.`)}`;
      
      window.location.href = mailtoLink;

      setCheckoutStep(2);
      setTimeout(() => {
        setCart({});
        setIsCartOpen(false);
        setCheckoutStep(0);
      }, 3000);
    }
  };"""

content = re.sub(
    r'  const handleCheckout = \(\) => \{.*?\n  \};',
    replacement,
    content,
    flags=re.DOTALL
)

with open('apps/web/src/app/(app)/resources/FertiliserTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated handleCheckout to send email")
