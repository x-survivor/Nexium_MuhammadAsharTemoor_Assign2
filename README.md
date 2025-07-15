# 📝 Assignment 2: Blog Summarizer

A full-stack web application that takes a blog URL, scrapes the content, summarizes it using AI, translates the summary into Urdu, and stores the data in Supabase and MongoDB.

---

## 🎯 Assignment Requirements

> - Take blog URL and scrape text
> - Simulate AI summary using static logic
> - Translate summary to Urdu using JS dictionary
> - Save summary in Supabase
> - Save full text in MongoDB
> - Use ShadCN UI
> - Deployed on Vercel

---

## ✅ My Implementation

- 🔎 Blog scraping using
- 🤖 **Used AI model (`facebook/mbart-large-cnn`) for summarization** instead of static logic
- 🌐 Urdu translation implemented using JS dictionary (⚠️ results are not accurate)
- 📤 Summary stored in **Supabase**
- 📥 Full blog text stored in **MongoDB Atlas**
- 💄 UI built with **ShadCN UI** and **Tailwind CSS**
- 🚀 Deployed on **Vercel**

---

## 🧪 How to Run Locally

1. **Clone the repository**

   ```bash
   git clone https://github.com/x-survivor/Nexium_MuhammadAsharTemoor_Assign2.git

   ```

2. **Install Dependancies**

   ```bash
   npm install

   ```

3. **Add environment variables**

   > - MONGODB_URI=your_mongodb_connection_string
   > - DIRECT_DATABASE_URL=your_supabase_url
   > - HUGGINHG_FACE_API_KEY=your_huggingface_token
   
5. **Run Development Server**
   ```bash
   pnpm dev

# Live App

    https://nexium-muhammad-ashar-temoor-assign-pied.vercel.app/

## 📌 After-Deadline Update (Submitted: July 15, 11:59 PM)

> ⏱️ These updates were made after the official deadline to resolve critical deployment issues and improve stability. All core features were implemented and submitted on time.

### ✅ 1. MongoDB Connection Error on Vercel

- **Problem:** MongoDB connection was failing on Vercel with the error:
- **Reason:** MongoDB Atlas was **blocking incoming connections** from Vercel because only public IP address of my computer had been whitelisted.
- **Fix:** Added `0.0.0.0/0` to the **Network Access IP whitelist** in MongoDB Atlas. This allowed external services (like Vercel) to connect successfully.

---

### ✅ 2. API Route Crashed on Vercel Deployment

- **Problem:** The API route that connects to MongoDB was crashing on Vercel with runtime errors.
- **Reason:** Vercel's **Edge Runtime** (default for API routes in `app/`) does **not support MongoDB Node.js driver**.
- **Fix:** Explicitly added this line at the top of the API file to force Node.js runtime:
```ts
export const runtime = "nodejs";
