# AutoRest

AutoRest is a RESTful API built with Node.js, designed to interact with a MySQL database. The project emphasizes abstraction to streamline database operations and API interactions.

## Features

- **RESTful Endpoints:** Provides standard API endpoints for CRUD operations.
- **MySQL Integration:** Seamlessly connects to a MySQL database for data storage and retrieval.
- **Abstraction Layer:** Offers a high level of abstraction to simplify database interactions.

## Prerequisites

- **Node.js:** Ensure Node.js is installed on your system.
- **MySQL Database:** Set up a MySQL database and note the connection details.

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/pwasystem/autorest.git
   ```

2. **Navigate to the Project Directory:**

   ```bash
   cd autorest
   ```

3. **Install Dependencies:**

   ```bash
   npm install
   ```

4. **Configure Database Connection:**

   Update the database connection settings in `index.js` to match your MySQL configuration.

## Usage

1. **Start the Server:**

   You can start the server using either of the following commands:

   - Using Node.js:

     ```bash
     node index.js
     ```

   - Using npm:

     ```bash
     npm start
     ```

2. **Access the API:**

   Once the server is running, the API can be accessed at `http://localhost:3000`.

## Project Structure

```
autorest/
├── node_modules/
├── Dockerfile
├── README.md
├── autorest.js
├── favicon.ico
├── index.html
├── index.js
├── install.bat
├── package-lock.json
└── package.json
```

- **index.js:** Main entry point of the application.
- **autorest.js:** Contains the RESTful class with abstraction logic.
- **Dockerfile:** Configuration for Docker containerization.
- **package.json:** Lists project dependencies and scripts.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For questions or suggestions, please open an issue in the [GitHub repository](https://github.com/pwasystem/autorest).
