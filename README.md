# TODO (auth)

add accounts center
where:

- users can enable/ disable 2FA (along with passwords)
- users can delete their accounts

# Hospital Job Management Platform

A comprehensive platform designed to streamline job management in hospitals. This system includes a powerful backend, a modern frontend, and a robust database to handle data efficiently.

## Features  
- **Job Posting and Management**: Post, update, and manage hospital job listings.  
- **Applicant Tracking**: Track applications with a user-friendly interface.  
- **Real-time Updates**: Receive updates instantly with GraphQL subscriptions.  
- **Role-based Access**: Secure role-based access for administrators, recruiters, and applicants.  

## Technology Stack  
- **Backend**:  
  - Python  
  - FastAPI  
  - Strawberry GraphQL  

- **Frontend**:  
  - React  
  - Next.js  
  - Relay  
  - GraphQL  

- **Database**:  
  - MongoDB  

---

## Project Structure  

```plaintext
hospital-job-management/
├── server/         # Backend API and GraphQL server
├── client/         # Frontend React and Next.js application
└── README.md       # Project documentation
```

---

## Installation  

### Prerequisites  
- **Node.js** (v16 or above)  
- **Python** (3.10 or above)
- **UV Package Manager**
- **MongoDB**  

local dev- create an S3 bucket named avatars

### Backend Setup  
1. Navigate to the `server` directory:  
   ```bash  
   cd server  
   ```  
3. Install dependencies:  
   ```bash  
   uv sync
   ```  
4. Run the server:  
   ```bash  
   uvicorn app:app --reload  
   ```  

### Frontend Setup  
1. Navigate to the `client` directory:  
   ```bash  
   cd client  
   ```  
2. Install dependencies:  
   ```bash  
   npm install  
   ```  
3. Start the development server:  
   ```bash  
   npm run dev  
   ```  

---

## Environment Variables  

### Backend (`server/.env`)  
Create a `.env` file in the `server` directory with the following variables:  
```plaintext  
MONGO_URI=<your-mongodb-connection-string>  
SECRET_KEY=<your-secret-key>  
```  

### Frontend (`client/.env.local`)  
Create a `.env.local` file in the `client` directory with the following variables:  
```plaintext  
NEXT_PUBLIC_API_URL=http://localhost:8000/graphql  
```  

---

## Usage  

1. Start the backend server.  
2. Start the frontend application.  
3. Access the platform at `http://localhost:3000`.  

---

## Development  

### Backend  
- Use FastAPI's interactive docs at `http://localhost:8000/docs`.  
- Explore GraphQL Playground at `http://localhost:8000/graphql`.  

### Frontend  
- React components are built with Relay for efficient data fetching.  

---
