# Issue Tracking REST API Backend

A robust, production-ready backend API for managing issues with authentication, authorization, and comprehensive filtering capabilities.

**Live URL:** [https://devpluseserver.vercel.app]

---

## Features

- ✅ User Signup and Login with email verification
- ✅ JWT-based Authentication and Authorization
- ✅ Role-based Access Control (RBAC)
- ✅ Complete CRUD operations for issues
- ✅ Advanced filtering and sorting on issue lists
- ✅ Global error handling middleware
- ✅ Custom 404 handler
- ✅ Secure password hashing
- ✅ Type-safe API with TypeScript
- ✅ Database transaction support

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Language** | TypeScript |
| **Database** | PostgreSQL |
| **Database Hosting** | NeonDB / Supabase |
| **Authentication** | JWT (JSON Web Tokens) |
| **Deployment** | Render / Railway / Vercel |
| **Password Hashing** | bcryptjs |
| **Environment Manager** | dotenv |

---

## Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database (NeonDB or Supabase)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/mdabdulaziz6236/level-2-A2
   cd issue-tracker-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Configure your database**
   - Update `.env` with your database credentials

5. **Run database migrations**
   ```bash
   npm run migrate
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Build for production**
   ```bash
   npm run build
   npm start
   ```

---

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000


# Database

CONNECTION_STRING=your database string

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long

# API Configuration
API_BASE_URL=http://localhost:5000


```

---

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| POST | `/api/auth/signup` | Register a new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |


### Issue Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| POST | `/api/issues` | Create a new issue | ✅ |
| GET | `/api/issues` | Get all issues with filters & sorting | ✅ |
| GET | `/api/issues/:id` | Get a single issue | ✅ |
| PUT | `/api/issues/:id` | Update an issue | ✅ |
| DELETE | `/api/issues/:id` | Delete an issue | ✅ |

### Query Parameters for GET `/api/issues`

- `status` - Filter by status (open, closed, in-progress)
- `sort` - Sort by field (created_at, updated_at, priority)
- `order` - Sort order (asc, desc)


---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user', -- 'admin', 'moderator', 'user'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Issues Table
```sql
CREATE TABLE issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'open', -- 'open', 'in-progress', 'closed'
  priority VARCHAR(50) DEFAULT 'medium', -- 'low', 'medium', 'high'
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Indexes for Performance
```sql
CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_priority ON issues(priority);
CREATE INDEX idx_issues_created_by ON issues(created_by);
CREATE INDEX idx_issues_assigned_to ON issues(assigned_to);
```

---

## Authentication System

### How it Works

1. **User Registration**
   - User provides email and password
   - Password is hashed using bcryptjs (10 salt rounds)
   - User record is created in database

2. **User Login**
   - User provides email and password
   - Password is verified against stored hash
   - JWT token is generated with user ID and role
   - Token is returned to client

3. **Token Usage**
   - Client includes token in Authorization header: `Bearer <token>`
   - Middleware verifies token signature and expiry
   - User info is attached to request object

4. **Authorization**
   - Role-based middleware checks user permissions
   - Only authorized users can perform specific actions
   - Issue creator can only update/delete their own issues (unless admin)

---

## Error Handling

### Global Error Handler Middleware

All errors are caught and standardized with the following format:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "statusCode": 400
  }
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|------------|
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `UNAUTHORIZED` | 401 | Missing or invalid JWT |
| `FORBIDDEN` | 403 | User lacks required permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Duplicate email or resource conflict |
| `INTERNAL_ERROR` | 500 | Server error |

### Custom 404 Handler

All undefined routes return:
```json
{
  "success": false,
  "error": {
    "message": "Route not found",
    "code": "NOT_FOUND",
    "statusCode": 404
  }
}
```

---

## Deployment Instructions

### Deployment to Vercel (Serverless)

1. **Install Vercel CLI:** `npm i -g vercel`
2. **Run:** `vercel` from project root
3. **Configure environment variables**
4. **Deploy serverless functions**

### Database Setup on NeonDB

1. Sign up at [console.neon.tech](https://console.neon.tech)
2. Create a new project
3. Copy connection string to `DATABASE_URL` in `.env`
4. Run migrations

---

## Project Structure

```
issue-tracker-api/
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── models/
│   ├── services/
│   ├── utils/
│   ├── types/
│   ├── config/
│   └── app.ts
├── tests/
├── migrations/
├── .env.example
├── tsconfig.json
├── package.json
└── README.md
```

---

## Scripts

```bash
npm run dev      # Start development server with hot reload
npm run build    # Build TypeScript to JavaScript
npm start        # Start production server
npm test         # Run test suite
npm run migrate  # Run database migrations
npm run lint     # Run ESLint
```

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

MIT License - see LICENSE file for details

---

## Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the development team.