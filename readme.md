# Backend API Documentation

This is the documentation for the backend API of our application. The API provides endpoints to manage users, including creating, updating, deleting, searching, and exporting users in CSV format.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose (for MongoDB)
- Multer (for file upload)
- Swagger (for API documentation)
- Jest (for unit testing)

## Installation

### Clone the repository:

```bash
git clone <repository-url>
cd backend-api
npm install
```

### Set up Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```plaintext
# Server Configuration
PORT=3000

# MongoDB Configuration
MONGODB_URI=mongodb://127.0.0.1:27017/task

# Logging Configuration
# LOG_FORMAT=combined # Uncomment and customize if needed
# LOG_FILE_PATH=/path/to/log/file.log # Uncomment and specify log file path if needed

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000 # Uncomment and specify allowed origins if needed
# CORS_ALLOWED_METHODS=GET,POST,PUT,DELETE # Uncomment and specify allowed methods if needed
# CORS_ALLOWED_HEADERS=Content-Type,Authorization # Uncomment and specify allowed headers if needed

# JWT Configuration
# SECRET_KEY=your_secret_key_here # Uncomment and specify secret key for JWT authentication if needed

# Other Configuration Options
# MAX_UPLOAD_SIZE=10MB # Uncomment and specify maximum file upload size if needed

# Environment Configuration
NODE_ENV=development
```

### Start the server:

```bash
npm start
```

## API Documentation

The API documentation is generated using Swagger and can be accessed at `/api-docs`.

### Endpoints

1. **Create User**

   - **URL:** `/api/users`
   - **Method:** POST
   - **Description:** Create a new user.
   - **Request Body:**
     - firstName: String (required)
     - lastName: String (required)
     - email: String (required, unique)
     - mobile: String (required, unique)
     - gender: String (required, enum: "Male" or "Female")
     - status: String (enum: "active" or "inactive")
     - profilePhotoUrl: String
     - location: String

2. **Get All Users**

   - **URL:** `/api/users`
   - **Method:** GET
   - **Description:** Get a list of all users.

3. **Update User**

   - **URL:** `/api/users/:userId`
   - **Method:** PUT
   - **Description:** Update user information.
   - **Request Parameters:**
     - userId: Number
   - **Request Body:** Same as the request body for creating a user.

4. **Delete User**

   - **URL:** `/api/users/:userId`
   - **Method:** DELETE
   - **Description:** Delete a user.
   - **Request Parameters:**
     - userId: Number

5. **Search Users**

   - **URL:** `/api/users/search`
   - **Method:** GET
   - **Description:** Search users by query string.
   - **Query Parameters:**
     - query: String (search query)

6. **Export Users to CSV**
   - **URL:** `/api/users/export/csv`
   - **Method:** GET
   - **Description:** Export all users to a CSV file.

## Testing

Unit tests are implemented using Jest. Run the following command to execute the tests:

```bash
npm test
```

## Contributing

Contributions are welcome! Please fork the repository, make your changes, and submit a pull request.

## License

This project is licensed under the MIT License.
