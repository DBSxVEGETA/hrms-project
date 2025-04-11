Getting Started
Step 1: Install Dependencies
Run the following commands in both the frontend and backend directories:
npm install

Step 2: Set Up Environment Variables
Create a .env file in the backend directory and add the following keys:
PORT=your_port_value
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret

Note: Do not wrap values in quotes.

Step 3: Start the Frontend
Navigate to the client directory and run:
npm run dev

Step 4: Start the Backend
Navigate to the server directory and run:
npm start
or (if using nodemon):
npm run dev

✅ Both servers should be running simultaneously.
