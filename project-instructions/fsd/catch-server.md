# catchServer

### Building a Resilient Server with Error Handling and HTTP Requests

**Table of Contents**

- [Before You Start](#before-you-start)
  - [Objective](#objective)
  - [Requirements and Grading](#requirements-and-grading)
  - [Try, Catch, Finally: Error Handling Recap](#try-catch-finally-error-handling-recap)
- [Lesson Steps](#lesson-steps)
  - [TODO 1: Initialize Variables and Create Server](#todo-1-initialize-variables-and-create-server)
  - [TODO 2: Request Handling, Try Block](#todo-2-request-handling-try-block)
  - [TODO 3: Request Handling, Catch Block](#todo-3-request-handling-catch-block)
  - [TODO 4: Request Handling, Finally Block](#todo-4-request-handling-finally-block)
  - [TODO 5: Request Handling, PUT Request](#todo-5-request-handling-put-request)
  - [TODO 6: Test Your Server](#todo-6-test-your-server)
  - [CHALLENGE: Add a DELETE Request](#challenge-add-a-delete-request)
  - [CHALLENGE: Add a POST Request](#challenge-add-a-post-request)

<br><br>

# Before You Start

## **Objective**

In this project, you’ll bring a server to life that handles multiple HTTP requests, applies **error handling**, and responds to requests using both **try** and **catch** blocks to improve its stability and reliability. Working in `safeServer.js`, you’ll design your server to respond to common HTTP methods like **GET** and **PUT**—while also enhancing its resilience through error-catching mechanisms.

You’ll be learning to:

- **Initialize and configure a server** to handle HTTP requests with precise control.
- **Implement error handling** through `try` and `catch` blocks, safeguarding your server against potential issues.
- **Handle and respond** to a variety of HTTP verbs, creating pathways for both data access and modification.

By the end, you’ll have a **safer, more resilient server** that can handle requests effectively while managing errors gracefully. Let’s get started on building a server you can rely on! ⚙️

<br><br>

## **Requirements and Grading**

This project includes specific requirements that focus on both functionality and error-handling capabilities. You’ll be assessed on your ability to create a stable server that manages various requests and handles potential errors through `try`, `catch`, and `finally` blocks.

---

## **Requirements and Grading**

| Requirement                                        | Description                                                                                                            | Points |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------ |
| **TODO 1: Initialize Variables and Create Server** | Define initial variables and set up the basic structure of the fetch server.                                           | 10%    |
| **TODO 2: Request Handling, Try Block**            | Implement a `try` block to safely process incoming GET requests, ensuring basic server responses are handled securely. | 25%    |
| **TODO 3: Request Handling, Catch Block**          | Add a `catch` block to manage errors from failed requests, logging issues, and sending appropriate responses.          | 15%    |
| **TODO 4: Request Handling, Finally Block**        | Implement a `finally` block to finalize each request, even if an error occurs, improving server stability.             | 10%    |
| **TODO 5: Request Handling, PUT Request**          | Configure the server to handle PUT requests, allowing updates and changes to be sent to the server.                    | 25%    |
| **TODO 6: Test Your Server**                       | Test server functionality for all request types, using Postman to ensure each response behaves as expected.            | 15%    |

<br><br>

## **Try, Catch, Finally: Error Handling Recap**

In JavaScript, error handling allows us to manage unexpected issues in our code. The `try`, `catch`, and `finally` blocks work together to handle errors, ensuring that even if something goes wrong, the program can respond and complete necessary tasks.

- **`try`**: Contains the code that could throw an error. If everything works, this code will run as expected.
- **`catch`**: If an error occurs in the `try` block, the program moves to the `catch` block to handle the error.
- **`finally`**: This block always runs, no matter what happens in `try` or `catch`. It’s useful for clean-up tasks that need to happen regardless of success or failure.

---

### Key Terms

<div style="width: 80%; margin: auto;">

| Term                | Definition                                                                                                                       |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Error Handling**  | Techniques used to handle and respond to errors in the code.                                                                     |
| **`try` Block**     | Code that attempts an action that might fail, like reading from a file. If an error occurs, control passes to the `catch` block. |
| **`catch` Block**   | Code that responds to an error from the `try` block, preventing the program from crashing.                                       |
| **`finally` Block** | Code that runs after `try` and `catch`, regardless of whether an error occurred, often used for final actions or clean-up.       |

</div>

---

### Example

Here’s a simple example of a `try/catch/finally` block. This code tries to parse a string as JSON. If the string format is incorrect, an error will occur, and the `catch` block will handle it. Regardless of success or error, the `finally` block will run to log “Process complete.”

```javascript
try {
  // Attempt to parse JSON data
  const data = JSON.parse('{"name": "HalleBot"}');
  console.log("Data parsed successfully:", data);
} catch (error) {
  // Handle any errors that occur in the try block
  console.log("An error occurred:", error.message);
} finally {
  // Execute cleanup or final tasks regardless of success or failure
  console.log("Process complete.");
}
```

In this example:

- The try block contains code that attempts to parse JSON data. Parsing in this context means converting a JSON string into a JavaScript object.
- If an error occurs, the catch block logs the error message. An error could happen if the JSON string is invalid or not in the correct format.
- The finally block logs "Process complete" to indicate that the process has ended, regardless of the outcome.

# Lesson Steps

For this project, you’ll create a server that handles various HTTP requests and practices error management to ensure safe and effective responses. With `try` and `catch` blocks, you’ll strengthen the server’s reliability—making sure it’s safe enough to run without major issues. You’ll also learn to handle GET and PUT requests, allowing data to flow smoothly between client and server.

To test your server, you’ll use **Postman**, a powerful tool for testing HTTP requests, to confirm that each component works as expected.

<br><br>

### Step-by-Step Work Flow

1. 📂 **Open the `are-you-being-served` directory** to begin setting up your servers.

   - 🔍 In your file tree, navigate to the `iot-projects` folder.
   - Open the `are-you-being-served` folder 📂 within the projects directory.

2. **Follow each TODO carefully** as you implement server functions:

   - For each TODO, pay attention to where new code needs to go.
   - Only code within designated sections.

3. 🖥️ **Test your servers frequently** by running them and checking for expected behavior at each step.

---

<table style="width: 80%; margin-left: auto; margin-right: auto; border-collapse: collapse; margin-top: 15px; background-color: #2c2c2c; border: 1px solid #444; border-radius: 8px; overflow: hidden;">
  <tr>
    <th style="text-align: left; padding: 10px; background-color: #444; color: #e2e2e2; border-bottom: 1px solid #666;">
      💡 Key Reminders
    </th>
  </tr>
  <tr>
    <td style="padding: 10px; color: #e2e2e2;">
      - 📖 Carefully read each TODO before you start coding.<br>
      - 🖥️ Test frequently to ensure your servers function as expected at each step.
    </td>
  </tr>
</table>

---

<br>

### ✅ **Check Your Work!**

- **After each TODO**, double-check your code against the instructions.
- If you run into issues, test your server setup to debug and refine your approach.

<!-- 4 line breaks between TODOs -->

<br><br><br><br>

## **TODO 1: Initialize Variables and Create Server**

🎯 **Goal:** Set up the basic server configuration by importing necessary libraries, defining the port, and creating the initial server setup.

---

### Step-by-Step Instructions

1. **Import the `http` Library**

   - Use `require()` to import the `http` library, and store it in a `const` variable named `http`:
     ```javascript
     const http = require("http");
     ```

2. **Initialize the Port Number**

   - Create a variable called `port` to define the port number your server will listen on. For this project, we’ll use **port 3000**:
     ```javascript
     const port = 3000;
     ```

3. **Create the HTTP Server**

   - Use the `http.createServer()` method to create a server. For now, **do not include a request listener function**.
   - Chain the `.listen()` method to specify the `port` variable, so your server listens on port 3000:
     ```javascript
     const server = http.createServer().listen(port);
     ```

4. **Set Up the `serverStatus` Variable**
   - Create a variable called `serverStatus` and set it to `undefined` initially. We’ll use this variable later to store and manage the server’s status message:
     ```javascript
     let serverStatus = undefined;
     ```

---

At this point, your server is created but not yet fully functional. We’ll add request handling logic in the next steps!

<br><br><br><br>

## **TODO 2: Request Handling, Try Block**

🎯 **Goal:** Implement a `try` block in your server's request handler to manage incoming requests and respond appropriately to `GET` requests.

---

### Step-by-Step Instructions

1. **Set Up the Request Listener Function**

   - Your server will need to handle requests for multiple HTTP verbs, including **GET** and **PUT**.
   - In your code, create a **request listener function** that will handle each incoming request.

2. **Use a `try` Block to Begin Request Handling**

   - Inside the request listener function, add a **`try` block** to manage potential errors that could arise during request handling.
   - For now, we’ll only set up handling for **GET** requests. We’ll cover **PUT** requests in a later step.

3. **Check the Request Method and Handle `GET` Requests**
   - Within the `try` block, add code to check the HTTP method of each request.
     - **If the method is `GET`**, respond with the current status of the server, stored in the variable `serverStatus`.
   - When handling the `GET` request:
     - Write a response that sends the message contained in `serverStatus`.
     - Then, set the response status code to **200** and specify the **Content-Type** as `text/plain`.

> **NOTE:** You won’t be able to test this code until later in the project. Testing will be available after completing TODO 4.

<br><br><br><br>

## **TODO 3: Request Handling, Catch Block**

🎯 **Goal:** Use the `catch` block to handle errors and return an appropriate response to the client when the server has no data.

---

### Step-by-Step Instructions

1. **Catch and Respond to Errors**

   - Since the `serverStatus` variable is currently `undefined`, attempting to return its value will cause an error.
   - To handle this, use the **`catch` block** to capture the error and respond with a message indicating that the server isn’t ready yet.

2. **Send an Error Message Back to the Client**
   - Inside the `catch` block, add code to:
     - Use **`res.write()`** to send the following message to the client: `"The server has no data."`
     - Use **`res.writeHead()`** to set the status code to **500** and the content type to `text/plain`, indicating an error response.

Example of `res.writeHead()` usage:

```javascript
res.writeHead(404, { "Content-Type": "text/json" });
```

In this example:

- `404` is the status code, commonly used to indicate "Not Found."

- `'Content-Type': 'application/json'` specifies the content type, allowing the client to interpret the response as JSON.

<br><br><br><br>

## **TODO 4: Request Handling, Finally Block**

🎯 **Goal:** Use a `finally` block to close the response to the client, ensuring that all requests complete properly.

---

### Step-by-Step Instructions

1. **Set Up the `finally` Block to Finalize the Response**

   - Add a **`finally` block** after the `try` and `catch` blocks in your request handler function.
   - This block will ensure that the response is properly closed, regardless of whether an error occurred.

2. **Complete the Response with `res.write()` and `res.end()`**
   - Inside the `finally` block:
     - Use **`res.write()`** to send an additional message to the client indicating the response is complete. Use the message: `"-and the message arrived"`.
     - Call **`res.end()`** to close the response to the client. This ensures that the server doesn’t keep waiting and can handle new requests.

---

### ✅ **Check Your Work!**

1. **Test the Server with Postman**

   - Open **Postman** and send a **GET request** to `http://localhost:3000`.
   - Verify that the response includes the following message:

     `The server has no data.-and the message arrived`

2. **Confirm the Status Code**
   - Ensure that the status code in your Postman response is **500**, indicating an error was correctly handled in the `catch` block.

If the output matches, your server is correctly handling errors and completing responses as expected!

<br><br><br><br>

## **TODO 5: Request Handling, PUT Request**

🎯 **Goal:** Add `PUT` request handling to update the server status with data from the client.

---

### Step-by-Step Instructions

1. **Add an `else if` for the PUT Request**

   - Inside the **`try` block**, add an **`else if` statement** to check if the request method is `PUT`.

2. **Set Up the Request Body for the PUT Request**

   - If the request method is `PUT`:
     - Create a variable called **`body`** and set it equal to an empty string. This variable will store the request body as data is received.

3. **Listen for Incoming Data**

   - Use **`req.on()`** to listen for the `data` event on the request.
   - When the `data` event triggers, its callback function will add the incoming data to the `body` variable. Use the `+=` operator to append the data.

4. **Finalize the PUT Request Handling**
   - After listening for the `data` event, use **`req.on()`** again to listen for the `end` event.
   - In the callback function for the `end` event:
     - Set `serverStatus` to be an empty object: `{}`.
     - Parse the `body` variable with **`JSON.parse()`** and set `serverStatus.status` equal to the parsed data.
     - Use **`res.writeHead()`** to set the response status code to **200** and specify the content type as plain text.
     - Send a message back to the client using **`res.write()`** with the text `"The server has been updated."`

---

> **NOTE:** Testing for this TODO will occur in TODO 6.

<br><br><br><br>

## **TODO 6: Test Your Server**

🎯 **Goal:** Use Postman to test your server by sending `GET` and `PUT` requests, verifying that each request type receives the correct response.

---

1. **Start the Server**

   - Open your terminal and start your server by running:
     ```bash
     node safeServer.js
     ```

2. **Test the `GET` Request**

   - Open **Postman** and create a new request.
   - Set the **request type** to `GET` and the **URL** to `http://localhost:3000`.
   - **Send the request** and check the response.
     - You should see this message:
       ```
       The server has no data.-and the message arrived
       ```

3. **Test the `PUT` Request**

   - In Postman, create another new request.
   - Set the **request type** to `PUT` and the **URL** to `http://localhost:3000`.
   - In the **body** of the request, add a JSON object with the following format:
     ```json
     { "message": "Server is running" }
     ```
   - **Send the request** and check the response.
     - You should see this message:
       ```
       The server has been updated.-and the message arrived
       ```

4. **Confirm the Updated Status with a Final `GET` Request**
   - Create a new `GET` request in Postman, using the URL `http://localhost:3000`.
   - **Send the request** and check the response.
     - You should see this message:
       ```
       Server is running-and the message arrived
       ```

Each test verifies that your server correctly handles both `GET` and `PUT` requests. If the responses match the expected messages, your server is working as designed!

### CHALLENGE: Add a DELETE Request

If you want to challenge yourself, try adding a `DELETE` request to your server. The `DELETE` request should reset the `serverStatus` variable to `undefined`. You can follow a similar pattern to the `PUT` request when handling the `DELETE` request.

### CHALLENGE: Add a POST Request

Another challenge you can try is adding a `POST` request to your server. The `POST` request should add a new message to the `serverStatus` variable. As with the `PUT` request, you can use a similar structure to handle the `POST` request.

**HINT:** For the `POST` request, consider storing the messages in an array. To add a new message to the array, you can use the **`push()`** method. To support this, after completing the `PUT` request, add a new key to the `serverStatus` object called `messages` and set it equal to an empty array.

---

### Push Reminder

That's it! You've completed a server project that incorporates `try`, `catch`, and various HTTP verbs. 🎉 Don’t forget to push your changes to GitHub!
