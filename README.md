# PsyGauge - Psychometric Assessment | IIT Roorkee  

PsyGauge is a gamified psychometric assessment platform designed to evaluate psychological and cognitive metrics through engaging, interactive games. The platform provides insights into user behavior by analyzing tasks such as visual search, risk-taking, recall, and decision-making. Built using the MERN stack, PsyGauge features a secure and scalable backend optimized with Bcrypt for data security.

---

## Features  
- **Gamified Assessment**: Engaging games for visual search, risk-taking, recall, and decision-making.  
- **Interactive UI**: User-friendly interface built with React.js.  
- **Secure Backend**: User data protection using Bcrypt for password hashing.  
- **Scalable Design**: RESTful APIs and modular architecture ensure scalability.  
- **Real-Time Feedback**: Delivers immediate insights based on performance.  

---

## Tech Stack  
- **Frontend**: React.js, Bootstrap, CSS  
- **Backend**: Node.js, Express.js, MongoDB  
- **Authentication**: Bcrypt for secure password storage  
- **Tools**: Git, Postman, Axios, dotenv  

---

## Prerequisites  
Before you start, ensure you have the following installed:  
- **Node.js** (v14 or higher)  
- **npm** (v6 or higher)  
- **MongoDB** (running locally or via a cloud service like MongoDB Atlas)  

---

## Installation and Setup  
1. Clone the repository:  
   ```bash  
   git clone https://github.com/your-username/psy-gauge.git  
   cd psy-gauge
   ```
2. Navigate to the backend folder and install dependencies:

```bash
   cd backend  
   npm install
```
3. Set up your environment variables in the backend/.env file:
   PORT=5000  
   MONGO_URI=your-mongodb-connection-string  
   Replace your-mongodb-connection-string with your actual MongoDB connection string.

4. Start the backend server:
```bash
npm start  
The backend server will start on http://localhost:5000.
```
5. Navigate to the frontend folder and install dependencies:
```bash
cd ../frontend  
npm install
``` 
6. Start the frontend application:
```bash
npm start
```

The frontend app will start on http://localhost:3000.

Ensure both backend and frontend folders are in the same directory for local development.

## Usage
Open your browser and visit http://localhost:3000.
Interact with the application to explore its features.


## Future Enhancements
AI Integration: Advanced psychometric analysis using machine learning models.
Cloud Deployment: Deploy the application on AWS or Azure for global accessibility.
New Games: Add more interactive games to diversify assessments.
Data Visualization: Enhance result insights with charts and graphs.
Contributing
Contributions are welcome! To contribute:

Fork the repository.
Create a feature branch (git checkout -b feature-name).
Commit your changes (git commit -m 'Add feature').
Push to the branch (git push origin feature-name).
Open a Pull Request.
License
This project is licensed under the MIT License. See the LICENSE file for details.

Contact
Author: Shambhoolal Narwaria
Email: snarwaria195mb@gmail.com
