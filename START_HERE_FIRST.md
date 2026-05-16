# 🚀 START HERE - Build Your Portfolio NOW!

## ⏱️ Next 30 Minutes: Get Your Project Ready

### **Step 1: Run These Terminal Commands (5 minutes)**

```bash
# Navigate to where you want your project
cd your/projects/folder

# Create new Next.js project
npx create-next-app@latest portfolio --typescript --tailwind --eslint

# When asked questions, select:
# - Would you like to use ESLint? → Yes
# - Would you like to use Tailwind CSS? → Yes
# - Would you like to use `src/` directory? → No
# - Use App Router? → Yes
# - Use Turbopack? → No
# - Customize import alias? → No (use defaults)

# Navigate into project
cd portfolio

# Install additional packages
npm install framer-motion next-intl @hookform/resolvers zustand lucide-react

# Setup shadcn/ui
npx shadcn-ui@latest init

# When prompted:
# - Style: Default
# - Base color: Slate
# - CSS variables: Yes

# Add shadcn components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add badge

# Start development server
npm run dev
```

**You should see:** Website running at `http://localhost:3000`

---

## 📝 Step 2: Copy-Paste First Prompt to Claude (10 minutes)

### **Open These in Separate Tabs:**
1. **Tab 1:** Your Terminal (npm run dev is running)
2. **Tab 2:** Your VS Code (your new portfolio project)
3. **Tab 3:** claude.ai (where you'll paste prompts)

### **Go to Tab 3 (claude.ai):**

1. Click **"New Chat"**
2. Copy **EVERYTHING BELOW** (the entire prompt, starting from "You are an expert...")
3. Paste it into Claude chat
4. Click **Send**

---

## 🎯 PROMPT 1: Project Configuration

**Copy everything from here to the line with dashes:**

```
You are an expert Next.js developer. Create complete configuration files for a 
professional portfolio website with these requirements:

REQUIREMENTS:
- Next.js 14+ with App Router
- TypeScript
- Tailwind CSS with custom colors for a developer portfolio
- Dark mode support (light/dark theme toggle)
- Multi-language support (English, French, Arabic)
- Framer Motion for animations
- shadcn/ui components
- Responsive design (mobile first)

CREATE THESE FILES:

1. next.config.js
   - Configure next-intl for multi-language
   - Optimize images and fonts
   - Configure redirects for language routes

2. tailwind.config.ts
   - Custom color scheme for developer portfolio (blue, slate, emerald)
   - Dark mode configuration using class strategy
   - Custom animations for Framer Motion
   - Extended spacing and typography

3. tsconfig.json
   - Strict mode enabled
   - Path aliases configured (@/, @/components, @/lib, @/types, etc.)
   - Proper type checking

4. .env.local template
   - ANTHROPIC_API_KEY=your_api_key_here (for Claude chat later)
   - NEXT_PUBLIC_SITE_URL=http://localhost:3000

IMPORTANT INSTRUCTIONS:
- Provide COMPLETE, production-ready code for each file
- Focus on best practices and scalability
- Include detailed comments explaining important sections
- Make dark mode support using CSS variables
- Configure Tailwind for custom theme colors
- Setup path aliases for clean imports
- Make it easy to switch between languages later

CONFIGURATION GOALS:
- Next.js configured for internationalization
- Tailwind ready for professional design
- Dark mode working smoothly
- TypeScript strict mode for safety
- Clean path aliases for imports

Provide the complete code for ALL 4 files. Make it production-ready.
```

---

## ⏳ Step 3: Claude Gives You Code (Auto)

Claude will give you the code for 4 files. You'll see something like:

```
Here are the configuration files for your portfolio:

1. next.config.js
[complete code here]

2. tailwind.config.ts
[complete code here]

...etc
```

---

## 💾 Step 4: Create the Files in VS Code (10 minutes)

For **EACH file Claude gave you:**

### **File 1: next.config.js**

1. In VS Code, go to **File → New File**
2. Name it: `next.config.js` (in root folder)
3. Copy the code Claude gave for this file
4. Paste it in
5. Save (Ctrl+S / Cmd+S)

### **File 2: tailwind.config.ts**

1. In VS Code, **File → New File**
2. Name it: `tailwind.config.ts` (in root, replacing existing one)
3. Copy Claude's code for this file
4. Paste it
5. Save

### **File 3: tsconfig.json**

1. Open existing `tsconfig.json` in root folder
2. Replace its content with Claude's version
3. Save

### **File 4: .env.local**

1. **File → New File**
2. Name it: `.env.local` (in root folder)
3. Copy Claude's template
4. Paste it
5. Save

---

## ✅ Step 5: Check It Works

1. Look at Terminal (Tab 1)
2. If you see **"compiled successfully"** → You're good! ✅
3. If you see errors, copy the error message and ask Claude: "Fix this error: [paste error]"

---

## 🎉 YOU DID IT!

You've successfully set up your portfolio project with:
- ✅ Next.js 14 configured
- ✅ TypeScript ready
- ✅ Tailwind CSS setup
- ✅ Dark mode enabled
- ✅ Multi-language ready
- ✅ Framer Motion installed

---

## 🔄 Next: Prompt 2 (Tomorrow or In 1 Hour)

Once you've completed this:

1. **Go back to claude.ai**
2. **Start a NEW chat**
3. **Copy Prompt 2 from `BUILD_PORTFOLIO_PROMPTS.md`** (titled "Global Styles & Theme Configuration")
4. **Paste it**
5. **Create the files it generates**
6. **Test with `npm run dev`**

---

## 📋 Quick Checklist

- [ ] Ran all npm commands (takes ~5 min to install)
- [ ] Created `next.config.js`
- [ ] Created `tailwind.config.ts`
- [ ] Updated `tsconfig.json`
- [ ] Created `.env.local`
- [ ] `npm run dev` shows no errors
- [ ] Website loads at `http://localhost:3000`

---

## 🆘 If Something Goes Wrong

**Error: "Module not found"**
→ Run `npm install` again

**Error: "Port 3000 in use"**
→ Change to different port: `npm run dev -- -p 3001`

**Error in Claude code**
→ Go back to claude.ai and ask: "There's an error in [filename]. The error is [copy-paste error]. Can you fix it?"

**Tailwind not working**
→ Run `npm run dev` (sometimes it takes a moment to compile)

---

## 📚 What's Next After This?

You'll have 18 more prompts to continue building:

| Prompt | What You Build | Time |
|--------|---------------|------|
| 2 | Styling & theme system | 5 min |
| 3 | Multi-language (i18n) | 10 min |
| 4 | TypeScript types | 5 min |
| 5 | Portfolio data file | 10 min |
| ... and 13 more ... | Complete portfolio | 7-10 hours total |

**All prompts are in:** `BUILD_PORTFOLIO_PROMPTS.md`

---

## 💡 Pro Tips

1. **Do one prompt per session** - Don't rush through all 19 at once
2. **Test after each prompt** - Make sure `npm run dev` still works
3. **Commit to Git** - Run `git add .` → `git commit -m "Added [feature]"`
4. **Take breaks** - Building a portfolio takes time, that's okay
5. **Show it off** - Share progress with friends for feedback

---

## 🎯 Your Goal

**By the end of 19 prompts (7-10 hours), you'll have:**

✨ A professional, modern portfolio website with:
- Beautiful animations
- Dark/Light theme toggle
- English, French, AND Arabic support
- All your projects showcased beautifully
- A chat bot powered by Claude AI
- Fully responsive design
- Production-ready code
- Ready to deploy to Vercel

---

## 🚀 START RIGHT NOW!

1. **Terminal:** Have `npm run dev` running ✅
2. **VS Code:** Open your new `portfolio` folder ✅
3. **Claude.ai:** Copy PROMPT 1 from above, paste it ✅
4. **Copy code Claude gives you** ✅
5. **Create the 4 files in VS Code** ✅
6. **Done!** Next prompt tomorrow 🎉

---

**Go to claude.ai RIGHT NOW and paste Prompt 1!**

Questions? Everything is explained in detail in these files:
- `BUILD_PORTFOLIO_PROMPTS.md` - All 19 prompts
- `PROMPT_EXECUTION_GUIDE.md` - How to run prompts
- `IMPLEMENTATION_GUIDE.md` - Technical details

**You've got this! 🚀**
