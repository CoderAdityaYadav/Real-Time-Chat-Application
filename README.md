<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <!-- <title>Realtime Chat Application</title> -->
</head>
<body>

  <h1>💬 Realtime Chat Application</h1>
  <p>
    A full-stack realtime chat application built using the <strong>MERN stack</strong>, 
    <strong>Socket.IO</strong>, <strong>JWT authentication</strong>, and 
    <strong>Zustand state management</strong>.
  </p>
  <p>
    Supports realtime messaging, online presence tracking, image sharing, 
    optimistic UI updates, and automated welcome emails using <strong>Resend</strong>.
  </p>

  <hr>

  <h2>🚀 Features</h2>
  <ul>
    <li>🔐 JWT-based authentication (Login / Signup / Logout)</li>
    <li>📩 Welcome email sent on signup (Resend integration)</li>
    <li>💬 Realtime one-to-one messaging (Socket.IO)</li>
    <li>🟢 Online/offline user presence tracking</li>
    <li>🖼️ Image message support (Cloudinary integration)</li>
    <li>⚡ Optimistic UI updates</li>
    <li>🔔 Sound notifications</li>
    <li>🧠 Global state management using Zustand</li>
    <li>🍪 Secure cookie-based authentication</li>
  </ul>

  <hr>

  <h2>🏗️ Tech Stack</h2>

  <h3>Frontend</h3>
  <ul>
    <li>React</li>
    <li><strong>Zustand</strong> (State Management)</li>
    <li>Axios</li>
    <li>TailwindCSS</li>
    <li>Socket.IO Client</li>
    <li>React Hot Toast</li>
  </ul>

  <h3>Backend</h3>
  <ul>
    <li>Node.js</li>
    <li>Express</li>
    <li>MongoDB + Mongoose</li>
    <li>Socket.IO</li>
    <li>JWT Authentication</li>
    <li>Cloudinary (Image Uploads)</li>
    <li><strong>Resend</strong> (Transactional Email Service)</li>
  </ul>

  <hr>

  <h2>📧 Email Integration</h2>
  <p>
    On successful user registration, a welcome email is automatically sent using 
    <strong>Resend</strong>. This demonstrates transactional email integration 
    similar to production-grade applications.
  </p>

  <hr>

  <h2>📁 Project Structure</h2>
  <pre>
chat-app/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── lib/
│   └── server.js
│
├── frontend/
│   ├── components/
│   ├── store/        (Zustand stores)
│   ├── pages/
│   └── main.jsx
│
└── README.html
  </pre>

  <hr>

  <h2>⚙️ Installation & Setup</h2>

  <h3>1️⃣ Clone Repository</h3>
  <pre>
git clone https://github.com/your-username/chat-app.git
cd chat-app
  </pre>

  <h3>2️⃣ Backend Setup</h3>
  <pre>
cd backend
npm install
  </pre>

  <p>Create a <code>.env</code> file:</p>
  <pre>
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET_KEY=your_secret_key
FRONTEND_URL=http://localhost:5173
RESEND_API_KEY=your_resend_key
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
  </pre>

  <p>Run backend:</p>
  <pre>npm run dev</pre>

  <h3>3️⃣ Frontend Setup</h3>
  <pre>
cd frontend
npm install
  </pre>

  <p>Create a <code>.env</code> file:</p>
  <pre>
VITE_BACKEND_URL=http://localhost:5000
  </pre>

  <p>Run frontend:</p>
  <pre>npm run dev</pre>

  <hr>

  <h2>🔐 API Endpoints</h2>

  <h3>Auth</h3>
  <pre>
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
PUT    /api/auth/update-profile
  </pre>

  <h3>Messages</h3>
  <pre>
GET    /api/messages/contacts
GET    /api/messages/chats
GET    /api/messages/:id
POST   /api/messages/send/:id
  </pre>

  <hr>

  <h2>📡 Realtime Events</h2>
  <ul>
    <li><code>onlineUsers</code></li>
    <li><code>newMessage</code></li>
  </ul>

  <hr>

  <h2>🧪 Future Improvements</h2>
  <ul>
    <li>Typing indicators</li>
    <li>Group chats</li>
    <li>Seen/delivered status</li>
    <li>Redis adapter for multi-server scaling</li>
    <li>Message pagination</li>
  </ul>

  <hr>

  <h2>👨‍💻 Author</h2>
  <p>
    Aditya Yadav <br>
    MERN Stack Developer | Realtime Systems Enthusiast | Backend Developer
  </p>

  <hr>

  <h2>📄 License</h2>
  <p>MIT License</p>

</body>
</html>
