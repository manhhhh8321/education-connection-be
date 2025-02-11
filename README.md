# Education Connection API

## 1. Description

The **Education Connection API** is a backend service designed to assist teachers in managing their students. Built with **NestJS**, it provides structured API endpoints for administrative tasks.

## 2. Features

- Register students under a teacher.
- Retrieve students common to multiple teachers.
- Suspend a student.
- Retrieve students eligible to receive a teacher’s notification.

## 3. Tech Stack

- **Backend Framework**: NestJS
- **Database**: MySQL with Sequelize ORM
- **Containerization**: Docker, Docker Compose
- **Testing**: Jest
- **Linting & Formatting**: ESLint, Prettier

## 4. Server Setup Guide

### 4.1. Prerequisites

Ensure you have the following installed:

- Node.js v18.19.0
- Docker
- Postman (for API testing)

### 4.2. Installation

Clone the repository and navigate to the project directory:

```bash
git clone https://github.com/manhhhh8321/education-connection-be.git
cd education-connection-be
```

### 4.3. Environment Setup

Create a `.env` file in the root directory and add the following configuration:

```plaintext
# MYSQL DATABASE
MYSQL_ROOT_PASSWORD=Root@123

SERVER_PORT=3000

MYSQL_HOST=mysql-db
MYSQL_PORT=3306
MYSQL_USERNAME=admin
MYSQL_PASSWORD=root
MYSQL_DATABASE=education-connection
```

### 4.4. Run Docker Compose

To build and start services, run:

```bash
docker-compose up -d
```

### 4.5. Run Database Seeding

After the server is running, execute the following command to seed initial data:

```bash
docker exec -it education-connection-api yarn run seed:run
```

### 4.6. Import Postman Collection

To test API endpoints, import the provided Postman collection:  
[Postman File](./education-connection.postman_collection.json)  
Follow this [guide](https://learning.postman.com/docs/getting-started/importing-and-exporting/importing-data/) for importing instructions.

## 5. Additional Commands

### 5.1. Run Database Migrations

```bash
yarn run migration:run
```

### 5.2. Run Database Seeding

```bash
yarn run seed:run
```

### 5.3. Start Application in Development Mode

```bash
yarn run start
```

### 5.4. Build Application for Production

```bash
yarn run build
```

### 5.5. Run Tests

```bash
yarn run test
```

### 5.6. Check Test Coverage

```bash
yarn run test:cov
```

## 6. Notes

- As per the requirements, APIs for registering individual teachers or students are **not** included. Please run the seeding process to generate initial data.
- Ensure the Postman file is imported correctly for testing API endpoints: [Postman File](./education-connection.postman_collection.json).
