# Angular 19 Project

This is an Angular 19 application developed to manage courses and lessons. It serves as a practical project to demonstrate fundamental Angular concepts, component interaction, routing, and potentially integration with a backend API (running on `http://localhost:3000`).

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

* **Courses Management:** This module allows users to view, add, edit, and delete courses. Each course can have associated lessons.
* **Lessons Management:** Within each course, users can manage individual lessons, including adding new lessons, updating their details, and removing them.
* User Interface built with Angular components for a dynamic and responsive experience.
* Integration with a local Node.js/Express.js backend for data persistence and API communication.

## Technologies Used

* **Angular 19**: Frontend framework for building single-page applications.
* **TypeScript**: Superset of JavaScript that adds static typing.
* **HTML5 & CSS3**: For structuring and styling the web pages.
* **Node.js**: JavaScript runtime environment for the backend server.
* **Express.js**: Fast, unopinionated, minimalist web framework for Node.js (used for the backend API).
* **MongoDB / Mongoose**: MongoDB as the NoSQL database, and Mongoose as an ODM (Object Data Modeling) library for Node.js, providing a straightforward, schema-based solution to model application data.
* **Git**: Distributed version control system for tracking changes.
* **GitHub**: Web-based hosting service for version control using Git.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed:

* [Node.js](https://nodejs.org/en/download/) (LTS version recommended)
* [npm](https://www.npmjs.com/get-npm) (comes with Node.js)
* [Angular CLI](https://angular.io/cli) (Install globally using `npm install -g @angular/cli`)
* [MongoDB Community Server](https://www.mongodb.com/try/download/community) (Ensure it's running in the background)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/miriam755/Angular19-project.git](https://github.com/miriam755/Angular19-project.git)
    cd Angular19-project
    ```
2.  **Install frontend dependencies:**
    ```bash
    npm install
    ```
3.  **Install backend dependencies:**
    Navigate into the `server` (or `backend`, if that's your backend folder name) directory and install its dependencies:
    ```bash
    cd server 
    npm install
    cd ..
    ```

### Running the Application

1.  **Start the MongoDB server:**
    Ensure your MongoDB instance is running. You might need to start it manually or as a service, depending on your installation.

2.  **Start the backend server:**
    Navigate to your backend directory (e.g., `server`) and start it:
    ```bash
    cd server 
    npm start # This assumes you have a "start" script in your backend's package.json
    cd ..
    ```
    The backend API should be running on `http://localhost:3000`.

3.  **Start the Angular development server:**
    In the root directory of the project (where `angular.json` is located):
    ```bash
    ng serve
    ```
    This will compile the Angular application and start a development server. You can access the application in your web browser, typically at `http://localhost:4200/`.

## Project Structure

This project follows a standard Angular application structure combined with a simple Node.js backend:

* `src/app/`: Contains the core Angular application logic and components.
    * `components/`: Reusable UI components (e.g., `courses-management`, `lessons-management`, `home`).
    * `services/`: Services for data fetching and business logic (e.g., `course.service.ts`, `lesson.service.ts`, `auth.service.ts`).
    * `app-routing.module.ts`: Defines application routes.
* `server/`: Contains the Node.js/Express.js backend API code.
    * `routes/`: Defines API endpoints.
    * `models/`: Mongoose schemas for MongoDB.
    * `db.js` (or similar): For database connection.
* `src/assets/`: Static assets like images or fonts.
* `src/environments/`: Environment-specific configurations for Angular.
* `angular.json`: Angular CLI configuration file.
* `package.json`: Project dependencies and scripts for both frontend and backend.

## Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bugfix: (`git checkout -b feature/your-feature-name` or `bugfix/issue-description`).
3.  Make your changes and ensure tests pass.
4.  Commit your changes with a clear and concise message (`git commit -m 'feat: Add new awesome feature'`).
5.  Push to your new branch: (`git push origin feature/your-feature-name`).
6.  Open a Pull Request to the `master` (or `main`) branch of this repository.

## License

This project is open-source and available under the MIT License. You can find the full license text in the [LICENSE.md](LICENSE.md) file (if applicable).
