# are-you-being-served

### Build two specialized servers to deepen your skills with fetch requests and parallel processing

**Table of Contents**

- [Setup](#setup)
- [Grading](#grading)
- [Lesson Steps](#lesson-steps)
  - [Fetch Server](#fetch-server)
    - [TODO 1: Initialize Variables](#todo-1-initialize-variables)
    - [TODO 2: Basic Fetch Server](#todo-2-basic-fetch-server)
    - [TODO 3: Request Handling](#todo-3-request-handling)
    - [TODO 4: Generalize With Command Line Arguments](#todo-4-generalize-with-command-line-arguments)
    - [TODO 5: Allow for Plain Text Responses](#todo-5-allow-for-plain-text-responses)
  - [Parallel Server](#parallel-server)
    - [TODO 6: Get Start Time](#todo-6-get-start-time)
    - [TODO 7: Create Wrapper Function](#todo-7-create-wrapper-function)
    - [TODO 8: Add the Function List](#todo-8-add-the-function-list)
    - [TODO 9: Write the Async Callback](#todo-9-write-the-async-callback)
    - [TODO 10: Make it Parallel](#todo-10-make-it-parallel)

<br><br>

## Setup

- Open your terminal and navigate to your "iot-projects" directory with the command: `cd iot-projects`
- Enter this project’s directory: `cd are-you-being-served`
- Install the required libraries by running: `npm install node-fetch@2 async`

<br>
<br>

## Grading

| Requirement                                | Description                                                                         | Points |
| ------------------------------------------ | ----------------------------------------------------------------------------------- | ------ |
| **TODO 1: Initialize Variables**           | Define initial variables required for setting up the fetch server                   | 5%     |
| **TODO 2: Basic Fetch Server**             | Create and start an empty HTTP server                                               | 5%     |
| **TODO 3: Request Handling**               | Handle requests by retrieving content using the fetch library                       | 15%    |
| **TODO 4: Command Line Argument - URL**    | Use command line arguments to dynamically specify the fetched URL                   | 10%    |
| **TODO 5: Command Line Argument - Format** | Use command line arguments to determine the returned data format (e.g., plain text) | 10%    |
| **TODO 6: Start Time Initialization**      | Capture the current time to set the race start time for the parallel server         | 5%     |
| **TODO 7: Wrapper Function**               | Create a wrapper function for setTimeout to initiate the race sequence              | 10%    |
| **TODO 8: Function List Creation**         | Build an array of functions to serve as arguments for `async.series()`              | 10%    |
| **TODO 9: Async Callback**                 | Implement the main async callback function for `async.series()`                     | 25%    |
| **TODO 10: Parallel Execution**            | Configure the async function to run in parallel                                     | 5%     |

<br>
<br>

## Lesson Steps

In this project, you’ll be creating two unique servers that each perform specialized tasks. One will use the `fetch` library to duplicate content from existing web pages, and the other will run parallel processes to simulate a virtual race between "competitors."

Through building these servers, you’ll practice:

- Setting up server responses using fetch requests
- Managing asynchronous tasks with parallel processing
- Testing and refining server functionality for optimal performance

By the end, you’ll have a solid understanding of server setup and asynchronous operations that you can apply to even more complex projects. Let’s dive in and bring these servers to life! 🌐🚀

<br>
<br>

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

## Fetch Server

The fetch server uses the "fetch" library to retrieve HTML code from a specified website and display it in the browser, either as rendered HTML or as raw text. You’ll also learn to incorporate command line arguments to customize the behavior of the server.

<br>

### **TODO 1: Initialize Variables**

🎯 **Goal:** Set up your server environment by importing necessary libraries and defining your port.

---

### Step-by-Step Instructions

1. **Import the "http" and "node-fetch" libraries** using `require()`.

   - Store each in a `const` variable named `http` and `fetch`, respectively.

2. **Define a port variable.**
   - Create a variable named `port` to store the port number your server will use. A good choice is **8686**, but feel free to choose another port if you prefer.

<br><br><br><br>

### **TODO 2: Basic Fetch Server**

🎯 **Goal:** Set up a basic HTTP server that will handle requests for your fetch server.

---

### Step-by-Step Instructions

1. **Create the HTTP server.**

   - Use `http.createServer()` to create a server and specify the `port` you defined. For example:

     ```js
     http.createServer(requestListenerFunction).listen(port);
     ```

2. **Write the request listener function.**

   - To start, define an `async` function with two parameters, `req` and `res`, to handle requests. Your function might look like this:

     ```js
     http
       .createServer(async function (req, res) {
         // code goes here
       })
       .listen(port);
     ```

   > 💡 **Note:** The `async` keyword allows the function to run asynchronously, which is necessary since you’ll be using the `fetch()` function, which works asynchronously.

<br><br><br><br>

### **TODO 3: Request Handling**

🎯 **Goal:** Configure your server to fetch HTML content and handle both successful responses and errors.

---

### Step-by-Step Instructions

1. **Set the response header.**

   - Inside the request listener function, write the following line to set the response header:

     ```js
     res.writeHead(200, { "Content-Type": "text/html" });
     ```

2. **Make a fetch request.**

   - Use `fetch()` to retrieve the HTML from a website (e.g., your portfolio page, which should be `https://<your github username>.github.io`). Store the result in a variable named `fetchResponse` and remember to include `await` to wait for the fetch operation to complete.

3. **Handle the response.**

   - **Case 1:** If `fetchResponse.ok` is `true`, the request was successful:

     - Store the HTML content in a variable called `html` using `await fetchResponse.text()`.
     - Use `res.write()` to send the HTML back as the response.

   - **Case 2:** If the fetch request failed:
     - Use `res.write()` to send an error message that includes both `fetchResponse.statusText` and `fetchResponse.status`.

4. **End the response.**
   - To complete the function, call `res.end()` to signal that the response is complete.

<br>

### ✅ **Check Your Work!**

- **TODO 3:** To verify that your server is running, open your terminal and start the server by typing:

  ```bash
  node requestServer.js
  ```

  Once the server is running, open your browser and navigate to `localhost:<port>` (replace `<port>` with the port number you used in your code). You should see the HTML content from the default URL displayed in your browser. If you used your portfolio page, you should see your portfolio content.

<br><br><br><br>

### **TODO 4: Generalize With Command Line Arguments**

🎯 **Goal:** Enable command line arguments to customize the URL your server fetches.

---

### Step-by-Step Instructions

1. **Add command line support.**

   - At the beginning of your program, add the following line to store command line arguments:

     ```js
     var args = process.argv.slice(2);
     ```

   > 💡 **Tip:** This removes the first two elements (usually `"node"` and your file name) from `process.argv`, so that `args` only contains custom data you pass in.

2. **Use a custom URL for the fetch request.**

   - Update the `createServer()` function’s listener to use the following line to handle a custom URL:

     ```js
     var url = args[0] ? args[0] : "<a default url>";
     ```

   Replace `"<a default url>"` with a fallback URL of your choice (e.g., your portfolio page). Then, update your `fetch()` call to use this `url` variable.

<br>

### ✅ **Check Your Work!**

- **TODO 4:** To check that your server can handle command line arguments, restart the server with a URL argument, such as `https://wikipedia.org`. Use the following command:

  ```bash
  node requestServer.js https://wikipedia.org
  ```

  - Refresh your browser at `localhost:<port>`, and you should now see content from the Wikipedia home page.

<br><br><br><br>

### **TODO 5: Allow for Plain Text Responses**

🎯 **Goal:** Add an option to display HTML as plaintext instead of rendered HTML.

---

### Step-by-Step Instructions

1. **Add an extra command line argument** to let users choose between HTML or plaintext.

   - Add logic in your request listener function to check if a second command line argument is present, and use this argument to determine the format for `res.writeHead()`.

2. **Set the appropriate Content-Type.**
   - For HTML, continue using `"Content-Type": "text/html"`.
   - For plaintext, set `"Content-Type": "text/plain"` instead.

<br>

### ✅ **Check Your Work!**

- **TODO 5:** To test the plaintext response option, restart the server with two arguments: a URL and the desired format (e.g., `"text"`). For example:

  ```bash
  node requestServer.js https://wikipedia.org text
  ```

  - Refresh your browser again, and this time, you should see the HTML content displayed as plain text.

<br><br><br><br>

## Parallel Server

### **TODO 6: Get Start Time**

🎯 **Goal:** Set up a start time for the race using JavaScript’s `Date` object to keep track of when the race begins.

---

### Step-by-Step Instructions

1. **Create a new `Date` object.**

   - Start by creating a `Date` object with `new Date()`. This will allow you to access the current time.

   ```js
   let d = new Date();
   ```

2. **Extract the start time.**

   - Use the `getTime()` method to grab the exact start time in milliseconds, and store it in a variable called `startTime`.

   ```js
   let startTime = d.getTime();
   ```

   > **Note:** `new Date()` creates an object that represents the current date and time. You can think of it like a “factory” that generates a timestamp whenever you need it. `getTime()` then extracts this timestamp in milliseconds, giving you a precise start time for the race.

<br><br><br><br>

### **TODO 7: Create Wrapper Function**

🎯 **Goal:** Create a `wrapper` function to simulate each racer’s timing using `setTimeout()`.

---

### Step-by-Step Instructions

1. **Define the `wrapper` function.**

   - Create a function named `wrapper` that takes one parameter, `callback`.

2. **Call `setTimeout()` within `wrapper`.**

   - Inside `wrapper`, use `setTimeout()` with two arguments:
     1. **First Argument:** A function with the following steps:
        - **Create a new `Date` object** and store it in a variable named `d`.
        - **Call the `callback` function,** passing two arguments:
          - `null` as the first argument to indicate no error
          - `d.getTime()` as the second argument, which gives the exact millisecond timestamp when the function executed.
     2. **Second Argument:** `Math.random() * 1000`, which introduces a random delay for each racer.

   > **Note:** This setup ensures each racer starts at a random time, mimicking real-world conditions but ensuring fairness since all racers follow the same process.

<br><br><br><br>

### **TODO 8: Add the Function List**

🎯 **Goal:** Populate the `async.series()` function’s array with identical wrapper functions to simulate multiple racers.

---

### Step-by-Step Instructions

1. **Locate the call to `async.series()`.**

   - Find the code where `async.series()` is called. Currently, the first argument (an array) is empty.

2. **Add functions to the array.**

   - Populate this array with four functions, each representing a racer. Each function should:

     - Take a single parameter, `callback`.
     - Call `wrapper()`, passing `callback` as its argument.

     Example:

     ```js
     async.series([
       function (callback) {
         wrapper(callback);
       },
       function (callback) {
         wrapper(callback);
       },
       function (callback) {
         wrapper(callback);
       },
       function (callback) {
         wrapper(callback);
       },
     ]);
     ```

     > **Note:** Adding four functions this way sets up four racers, each of whom will use `wrapper()` to simulate their individual

<br><br><br><br>

### **TODO 9: Write the Async Callback**

🎯 **Goal:** Write the callback function for `async.series` to generate the server’s final race results.

---

### Step-by-Step Instructions

1. **Set up the initial response.**

   - Begin the callback function with the line:

     ```js
     res.write("Results:\n");
     ```

   > **Explanation:** This line adds `"Results:"` to the server response using `res.write()`. Note that `res.writeHead()` has already been called earlier in the code, so you don’t need to include it here.

<br>

2. **Sort the racer results.**

   - After the "Results" line, add this command:

     ```js
     var victoryOrder = sortTogether(racers, results);
     ```

   > **Explanation:** This command sorts the racer names based on the times recorded in the `results` array, using the `sortTogether()` function (which has been provided). Take a moment to review `sortTogether()` if you’d like, and you may want to look up `Array.sort()` to understand it more fully.

<br>

3. **Loop through sorted results.**
   - After calling `sortTogether()`, use a loop to iterate over the array `victoryOrder`. Each racer in `victoryOrder` represents the order of their finish.

<br>

4. **Add each racer’s name to the response.**

   - Inside the loop, write each racer’s name to the server response with the following format:

     ```js
     res.write(racerName + "\n");
     ```

   - Make sure to add `"\n"` after each name to move to a new line for each racer in the response.

<br>

5. **Record the race end time.**

   - After the loop, create a new `Date` object and store it in a variable named `d`. Then use `.getTime()` to record the end time of the race, like this:

     ```js
     let d = new Date();
     let endTime = d.getTime();
     ```

<br>

6. **Calculate and write the race duration.**

   - Subtract the `startTime` (from TODO 7) from `endTime` to get the total race duration, and write it into the response. For example:

     ```js
     let duration = endTime - startTime;
     res.write("Race Duration: " + duration + "ms\n");
     ```

   - This line will show the race duration in milliseconds.

7. **End the response.**
   - Use `res.end()` to finish the response and send it to the client. This is essential, as the response will not be sent without it.

> **Hints:**
>
> - Remember to retrieve `startTime` from TODO 7 to calculate the race duration.
> - Ensure you convert `duration` into a string by concatenating `"\n"` to it as shown above. This ensures it’s correctly displayed in the response.
> - Don’t forget to use `res.end()` to complete the response!

<br>

### ✅ **Check Your Work!**

- **TODO 9** To verify your callback function is working correctly, start the server by entering the following command in your terminal:

  ```bash
  node requestServer.js
  ```

- Option 1: Open your browser and go to `http://localhost:<port>` (replace <port> with your server’s port number, e.g., 8686).

- Option 2: Alternatively, you can use the curl command to test the server’s response directly in the terminal:

  ```bash
  curl http://localhost:8686
  ```

  **Expected Output:** You should see a list of racers in their finishing order, followed by the total.

<br><br><br><br>

### **TODO 10: Make it Parallel**

🎯 **Goal:** Update the race to run in parallel rather than in sequence by switching from `async.series()` to `async.parallel()`.

---

### Step-by-Step Instructions

1. **Change `async.series()` to `async.parallel()`.**

   - Locate the line where `async.series()` is called, and replace `series` with `parallel`:

     ```js
     async.parallel(
       [
         // list of functions
       ],
       callback
     );
     ```

> **Explanation:** Running in parallel allows all racers to “start” their tasks simultaneously, rather than one after the other in sequence. We’re using `setTimeout()` to demonstrate this, but in scenarios with heavy computational tasks, `async.parallel()` could result in significant time savings.

<br><br><br><br>

### ✅ **Check Your Work!**

- **TODO 10:** To test your parallel setup, start the server again and observe the effects of running tasks in parallel.

  - **Option 1:** Open your browser and go to `http://localhost:<port>` (replace `<port>` with your server’s port number, e.g., `8686`).

  - **Option 2:** Alternatively, use the `curl` command to test the server directly in your terminal:

    ```bash
    curl http://localhost:8686
    ```

- **Expected Output:** You should see that the race completes faster than when using `async.series()`. The finishing order may vary due to parallel execution.

<br><br><br><br>

### 🎉 **Bonus Challenge**

Enhance your `wrapper()` function to replace `setTimeout()` with a `for` loop that simulates a workload, making the difference between `async.series()` and `async.parallel()` even clearer.

---

### Instructions

1. **Modify the `wrapper()` function.**

   - Instead of calling `setTimeout()`, make `wrapper()` use a random workload loop. Try a double `for` loop, like this:

     ```js
     var rand = Math.random();
     for (var i = 0; i < 1000; i++) {
       for (var j = 0; j < rand * 1000000; j++) {
         // perform random math operations
       }
     }
     ```

2. **Test and compare the two async calls.**
   - Switch back and forth between `async.parallel()` and `async.series()` with this new workload, and observe the differences in completion time.

> **Note:** This bonus challenge gives you a hands-on way to see how much of a time difference parallel processing can make, especially for tasks that involve significant computation.

<br><br><br><br>

---

### Push Reminder

That's it! You've completed a server project that uses fetch requests and parallel processing. Be sure to push your changes to GitHub to save your work and make it available to your instructor. Congratulations on completing this project! 🎉
