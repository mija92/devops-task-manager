# DevOps Task Manager API 🚀

RESTful Node.js application to manage tasks and demonstrate DevOps techniques such as containerization, inter-service communication, and securing backends.

## 🛠 Tech stack
- **Programming Language**: Node.js (Express.js)
- **Database**: PostgreSQL 15
- **Containerization**: Docker & Docker Compose
- **Authentication**: JSON Web Tokens and BCrypt hashing
- **Operating System**: Linux (Ubuntu Server)

## 🏗 Architecture Description
The app leverages multiple containers orchestrated with **Docker Compose**:
1. **Web Service** container – a Node.js application on `node:18-alpine`.
2. **Database Service** container – a PostgreSQL database leveraging persistent storage volumes.

## 🚀 How to run?
1. Clone the repository:
    ```
git clone [https://github.com/mija92/devops-task-manager.git](https://github.com/mija92/devops-task-manager.git)
