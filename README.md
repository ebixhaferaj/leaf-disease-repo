# Plant Disease Classification Model

A full-stack plant disease detection system targeting fungal leaf diseases in the most cultivated crops in Albania and Europe. Built using **FastAPI** (backend), **React + TailwindCSS** (frontend), and a fine-tuned **MobileNetV2** deep learning model served via **TensorFlow Serving**.

---

##  Overview

Fungal diseases account for ~85% of all plant diseases, with devastating impacts such as the historic **Irish Potato Famine**. This project supports farmers, agricultural researchers and plant enthusiasts by providing an accessible tool to detect the most common fungal diseases across:

- Corn
- Grape
- Olive
- Potato
- Tomato
- Wheat

The model classifies 19 leaf classes including healthy leaves and 12 major fungal diseases in Europe.

---

## Machine Learning

- **Model**: Fine-tuned `MobileNetV2`
- **Framework**: TensorFlow
- **Input Size**: 224x224 RGB
- **Training Data**: Custom dataset (available in repo)
- **Augmentation**: Applied across all classes
- **Number of Classes**: 19
- **Validation Accuracy**: **94%** (Model v3)

---

## Backend (FastAPI)

### Features

- JWT Authentication
- Role-based Access: `User` & `Farmer`
- TensorFlow Serving Integration (auto-load latest model)
- Single and Batch Image Prediction
- PDF Report Generation for Farmers
- BackgroundScheduler (cleans unconfirmed predictions after 24h)
- PostgreSQL Database

### Key Entities

- `User`
- `Prediction`
- `Report`
- `Leaf_Disease`

---

## 🌐 Frontend (React + TailwindCSS)

### Tech Stack

- Vite + React
- TailwindCSS
- Axios for API calls

### Pages & Components

- Home
- Login / Register
- User Dashboard
- Farmer Dashboard
- Upload (Single or Batch)
- Reports (PDF download)
- Learning Section (disease info & treatments) ... etc.

### Role-based Access

- **User**: Can upload single images, view past predictions.
- **Farmer**: Upload multiple images, generate farm-level reports, access disease info, export PDF reports.

### Responsiveness

- Optimized for desktop usage.

---

## Features Checklist

- User & Farmer registration/login     
- Email verification                  
- Password reset                      
- Upload single image (User)          
- Upload multiple images (Farmer)      
- Batch prediction report (Farmer)     
- PDF generation (Farmer)              
- Save past predictions                
- Learning page for farmers            
- Role-based dashboard                 
- APScheduler cleanup job             
- Dockerized model & Redis container   

---

## Deployment & Local Setup

### Dockerized Components

-  Model served via TensorFlow Serving
-  Redis container for JWT token revocation

### Environment Variables

Secrets and configs are stored in `.env` files (not included in repo).

### Run Locally

```bash
# 1. Start backend
cd Plant_Disease/app
uvicorn main:app --reload

# 2. Start frontend
cd Plant_Disease/frontend
npm run dev

# 3. Start model and Redis via Docker
cd Plant_Disease
docker-compose up
