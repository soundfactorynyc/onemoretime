# 💬 CLAUDE TASK: BUILD CUSTOMER SERVICE CHAT
## SIMPLE, FOCUSED MISSION

---

## 🎯 WHAT TO BUILD

**Create a customer service chat widget for Sound Factory website**

### **Basic Requirements:**
- Chat widget in bottom-right corner
- Beautiful design matching Sound Factory's black theme
- Works on mobile and desktop
- Handle common customer issues

---

## 📋 WHAT THE CHAT NEEDS TO HANDLE

### **Common Issues:**
1. **Stripe/Payment Problems** - "My card was declined"
2. **Login Issues** - "I can't get in"
3. **Password Resets** - "Forgot my password"
4. **Credit Card Problems** - "Payment not working"
5. **Basic Technical Issues** - "Site not loading"

### **Simple Responses:**
- **Payment Issues:** "Try a different card or contact your bank"
- **Login Problems:** "Use password reset or clear browser cache" 
- **Site Issues:** "Refresh page or try different browser"
- **Can't Access:** "Check internet connection"
- **Need Help:** "Contact support at support@soundfactory.com"
- **Basic troubleshooting** - simple, standard web solutions

---

## 🎨 DESIGN REQUIREMENTS

- **Black background** matching Sound Factory theme
- **Professional appearance** - not amateur
- **Always visible** chat button
- **Smooth animations** when opening/closing
- **Mobile responsive** - works perfectly on phones
- **Clean, readable text**

---

## 🔧 TECHNICAL SPECS

### **IMPORTANT: Component Already Exists!**
- `src/components/LiveChatSupport.astro` already exists but is TOO COMPLEX
- **SIMPLIFY the existing component** - strip out advanced features
- **Integrate into** `src/pages/index.astro` (currently not included)

### **What to Remove from Existing Component:**
- Voice messages
- File uploads
- Complex categorization
- Gradient styling
- Advanced features

### **What to Keep/Add:**
- Basic chat window that opens/closes
- Simple message input and send
- Black theme (no gradients)
- Basic troubleshooting responses
- Clean, minimal design

---

## ⚡ KEEP IT SIMPLE

**Don't overcomplicate this:**
- Just basic chat functionality
- Simple troubleshooting responses
- Professional design
- Mobile friendly
- That's it.

**Build it clean, build it fast, build it professional.**

**Focus on making it work and look good - we'll add AI responses later.**

---

## 📋 INTEGRATION STEPS

### **Step 1: Simplify LiveChatSupport.astro**
- Remove complex features (voice, files, gradients)
- Make it simple black theme
- Basic chat functionality only

### **Step 2: Add to index.astro**
- Import the component: `import LiveChatSupport from '../components/LiveChatSupport.astro';`
- Add to page: `<LiveChatSupport />`
- Test on mobile and desktop

- **Step 3: Verify**
- Chat button visible in bottom-right
- Opens/closes smoothly
- Looks professional on Sound Factory site
- Works on phone and desktop

---

## 📝 FUTURE ADDITIONS (EASY TO ADD LATER)

### **Subscription Integration:**
- **After basic chat works** - add subscription management
- **Simple additions:** "Upgrade to VIP", "Cancel subscription", "Billing questions"
- **Easy integration** with existing Stripe/payment system
- **Just more response options** - same chat foundation

### **Why It's Easy Later:**
- Chat foundation will be solid
- Just add more response categories
- Integrate with user account system
- Add subscription-specific troubleshooting

**Build the foundation now, add subscription features when ready!**

---

## ⏸️ TIMING NOTE

**PRIORITY ORDER:**
1. **Grid system first** - Complete the 192-button interactive grid
2. **Reaction system** - Finish all the emoji warfare features  
3. **Other core features** - Music sync, weapons, etc.
4. **THEN Chat system** - Add customer service chat last

**This chat task is ready when you need it - focus on grid completion first!**
