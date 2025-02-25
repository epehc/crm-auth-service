# CRM Auth Service

This is the authentication service for the CRM application. It handles user authentication, role assignment, and user management.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/crm-auth-service.git
    cd crm-auth-service
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a [.env](http://_vscodecontentref_/0) file in the root directory and add the necessary environment variables (see Environment Variables).

4. Build the project:
    ```sh
    npm run build
    ```

## Usage

1. Start the development server:
    ```sh
    npm run dev
    ```

2. Start the production server:
    ```sh
    npm start
    ```

## Scripts

The following scripts are available in the [package.json](http://_vscodecontentref_/1) file:

- `dev`: Starts the development server using `nodemon` and `ts-node`.
    ```sh
    npm run dev
    ```

- `build`: Compiles the TypeScript code to JavaScript.
    ```sh
    npm run build
    ```

- `start`: Starts the production server using the compiled JavaScript code.
    ```sh
    npm start
    ```

- `clean`: Removes the [node_modules](http://_vscodecontentref_/2), [dist](http://_vscodecontentref_/3), and `build` directories.
    ```sh
    npm run clean
    ```

- `test:unit`: Runs unit tests using Jest with coverage.
    ```sh
    npm run test:unit
    ```

- `test:integration`: Runs integration tests using Jest with coverage.
    ```sh
    npm run test:integration
    ```

- `test:all`: Runs both unit and integration tests.
    ```sh
    npm run test:all
    ```

## Environment Variables

The following environment variables are required for the project:

- `GOOGLE_CLIENT_ID`: Google OAuth client ID.
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret.
- `GOOGLE_CALLBACK_URL`: Google OAuth callback URL.
- `JWT_SECRET`: Secret key for signing JWT tokens.
- `JWT_EXPIRATION`: JWT token expiration time.
- `GITHUB_TOKEN`: GitHub access token for accessing private packages.
- `PORT`: Port on which the server will run.
- `DB_USERNAME`: Database username.
- `DB_PASSWORD`: Database password.
- `DB_NAME`: Database name.
- `DB_HOST`: Database host.
- `DB_PORT`: Database port.
- `FRONTEND_URL`: URL of the frontend application.

Example [.env](http://_vscodecontentref_/4) file:

```properties
#Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=/auth/google/callback
JWT_SECRET=your-jwt-secret
JWT_EXPIRATION=2h

#Github Access Token
GITHUB_TOKEN=your-github-token
#Server
PORT=4001

#Database
DB_USERNAME=your-db-username
DB_PASSWORD=your-db-password
DB_NAME=your-db-name
DB_HOST=your-db-host
DB_PORT=5432

FRONTEND_URL=http://localhost:3000
```

## API Documentation
The API documentation is generated using Swagger. You can access the documentation at /docs endpoint after starting the server.
