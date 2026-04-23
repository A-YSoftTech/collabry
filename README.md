<img width="1440" height="780" alt="collabryImage" src="https://github.com/user-attachments/assets/2069c62a-c004-440e-b3dc-ab55702eed62" />


## Collabry – AI-Powered Social Collaboration Platform

## Overview
  Collabry is a full-stack social platform built to explore how real-world applications work beyond basic CRUD operations.
  The goal of this project was to understand system design, real-time communication, AI integration, and recommendation systems.

## What I Learned
  - Building a complete MERN stack application
  - Implementing real-time systems using WebSockets
  - Understanding system-level thinking (frontend + backend + DB)
  - Integrating AI into user workflows
  - Designing a basic recommendation system (friend suggestions)
  - Handling content moderation and user interactions

## Features
  - Authentication & User Management
    - User Registration, Login, Logout
    - Profile management
    
  - Core Social Features
    - Create, Update, Delete Posts (CRUD)
    - Like, Comment, Comment Likes
    - Repost functionality
    - Share posts via chat
    
  - Real-Time System
    - WebSocket-based real-time chat
    - One-to-one (2-user) chat system
    - Online / Offline user presence
    - Chat management (clear conversations)
    - Floating, draggable chat window (chat while browsing posts)
    
  - AI Features
    - Smart reply suggestions
    - AI Bio Generator
    - Caption recommendation & scoring
    - Negative/toxic comment filtering
    
  - Recommendation System
    - Friend suggestion system
    - Scoring algorithm based on user activity and interactions
    
  - Content & Media
    - Post preview before publishing
    - Media handling
    - Text-to-image generation for status
    
  - Stories / Status
    - Create, update, delete status
    - Auto-delete after 24 hours
    
  - Moderation
    - Report posts functionality
    - AI-assisted content filtering
    
## Tech Stack

MongoDB Atlas | Express.js | Next.js | Node.js | WebSockets | REST APIs | Cloudinary |
AI features powered using the Groq API

## Project Structure
  /client      → Frontend (Next)
  
  /server      → Backend (Node.js + Express)
  
  /models      → Database schemas
  
  /routes      → API routes
  
  /controllers → Business logic
  
## Challenges Faced
  Real-time communication handling
  Designing scoring logic for recommendations
  Integrating AI features smoothly
  Managing async data flow
  Debugging complex interactions
  
## GitHub

    git clone https://github.com/A-YSoftTech/collabry.git

## Live Demo
  - Not deployed due to limitations with the Groq API used for AI features.

## Future Improvements
  - Improve recommendation algorithm
  - Better scalability
  - UI/UX enhancements
  - Deployment with alternative AI APIs
    
## Final Note
  This project helped me understand how real-world applications handle real-time systems, AI integration, and recommendation logic.
