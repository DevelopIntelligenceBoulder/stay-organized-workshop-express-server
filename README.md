# Stay Organized Workshop Server
This is intended to be the backend for the Stay Organized workshop.

## Setup this server locally
This section will discuss how to get the Stay Organized server up and running locally

- Verify Node.js is installed by running the following command.
  
  **Command to run**
  ```bash
    node -v
  ```
  **Sample Output**
  ```bash
    v14.15.4     (or something similar)
  ```

  > **Note:** If you do not have Node.js installed, you can install the LTS (Long-term Support) version from here: https://nodejs.org/en/

- Clone this repository to your local computer.

  ```bash
    git clone https://github.com/DevelopIntelligenceBoulder/stay-organized-workshop-express-server
  ```

- Change directories (`cd`) into the newly cloned project folder.

  ```bash
    cd stay-organized-workshop-express-server
  ```

- Install the projects dependencies with NPM (Node Package Manager).
  
  ```bash
    npm install
  ```

- Start the local server

  **Command to start the server**
  ```bash
    npm start
  ```

  **Expected Output**
  ```bash
    App listening at port 8083
  ```

- Verify the server is working as expected by acessing http://localhost:8083/api/users with a broswer or a third party tool like [Postman](https://www.postman.com/)

  **Expected output from URL**
  ```js
  [{"id":1,"name":"Ian Auston","username":"gamer04"},{"id":2,"name":"Siddalee Grace","username":"cheer"},{"id":3,"name":"Pursalane Faith","username":"farmgirl"},{"id":4,"name":"Zephaniah Hughes","username":"corndog"},{"id":5,"name":"Ezra Aidden","username":"theaterkid"},{"id":6,"name":"Elisha Aslan","username":"gamer05"},{"id":7,"name":"Betty Smalltree","username":"betty812"}]
  ```
