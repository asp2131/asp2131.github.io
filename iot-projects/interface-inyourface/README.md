# interface-inyourface

### Design a web interface that can display data from a temperature sensor in real-time.

**Table of Contents**

- [Setup](#setup)
- [Grading](#grading)
- [Lesson Steps](#lesson-steps)
- [Simulation Server](#simulation-server)
  - [TODO 1: Temperature Simulator](#todo-1-temperature-simulator)
  - [TODO 2: Regular Polling Server](#todo-2-regular-polling-server)
- [Polling Web Page](#polling-web-page)
  - [TODO 3: Initialize Records Variables](#todo-3-initialize-records-variables)
  - [TODO 4: Update Records Functions](#todo-4-update-records-functions)
  - [TODO 5: Regular Polling](#todo-5-regular-polling)
  - [TODO 6: AJAX Polling](#todo-6-ajax-polling)
  - [TODO 7: WebSocket Server](#todo-7-websocket-server)
  - [TODO 8: WebSocket Polling](#todo-8-websocket-polling)
  - [CHALLENGE 1: More Realistic Simulation](#challenge-1-more-realistic-simulation)
  - [CHALLENGE 2: Handle Put Requests](#challenge-2-handle-put-requests)
  - [CHALLENGE 3: Make Alerts](#challenge-3-make-alerts)

<br><br>

## Setup

- Enter the command `cd iot-projects` to enter your "iot-projects" directory so that you will be ready to push your work at the end of your work session.

<br><br>

## Grading

| Requirement                              | Description                                                         | Points |
| ---------------------------------------- | ------------------------------------------------------------------- | ------ |
| **TODO 1: Temperature Simulator**        | Set up the temperature simulation function to generate random data. | 15%    |
| **TODO 2: Regular Polling Server**       | Configure a server to return data at regular polling intervals.     | 10%    |
| **TODO 3: Initialize Records Variables** | Define variables to store and display temperature records.          | 15%    |
| **TODO 4: Update Records Functions**     | Implement functions to keep temperature records up-to-date.         | 15%    |
| **TODO 5: Regular Polling**              | Set up regular polling to receive temperature data updates.         | 15%    |
| **TODO 6: AJAX Polling**                 | Configure polling using AJAX to enable dynamic updates.             | 10%    |
| **TODO 7: WebSockets Server**            | Build a server to handle WebSocket connections for real-time data.  | 10%    |
| **TODO 8: WebSockets Polling**           | Use WebSocket polling to receive live updates from the server.      | 10%    |

<br><br>

## Lesson Steps

In this project, you’ll be building a web interface that pulls in live data from a temperature simulation server. You’ll explore various polling techniques, including **AJAX** and **WebSockets**, to keep your interface dynamically updated in real-time.

Throughout this project, you’ll develop skills in:

- Creating and managing server responses with simulated data
- Implementing polling techniques to receive and display live updates
- Configuring WebSockets for efficient, real-time communication

By the end, you’ll have a responsive web interface and a robust understanding of data polling and WebSockets, skills that can be applied to more complex web applications. Let’s jump in and bring this interface to life! 🌐💻

<br>
<br>

### Step-by-Step Work Flow

1. 📂 **Open the `interface-inyourface` directory** to start building your project.

   - 🔍 In your file tree, navigate to the `iot-projects` folder.
   - Open the `interface-inyourface` folder 📂 within the projects directory.

2. **Follow each TODO carefully** as you implement interface and server functions:

   - For each TODO, pay close attention to where code additions and adjustments should go.
   - Only make changes within designated areas.

3. 🖥️ **Test your interface frequently** by running your code and verifying updates at each step.

---

<table style="width: 80%; margin-left: auto; margin-right: auto; border-collapse: collapse; margin-top: 15px; background-color: #2c2c2c; border: 1px solid #444; border-radius: 8px; overflow: hidden;">
  <tr>
    <th style="text-align: left; padding: 10px; background-color: #444; color: #e2e2e2; border-bottom: 1px solid #666;">
      💡 Key Reminders
    </th>
  </tr>
  <tr>
    <td style="padding: 10px; color: #e2e2e2;">
      - 📖 Read each TODO carefully before coding.<br>
      - 🖥️ Test regularly to ensure that both the server and the web interface function correctly as you progress.
    </td>
  </tr>
</table>

---

<br>

### ✅ **Check Your Work!**

- **After each TODO**, verify that your code matches the instructions.
- If you encounter issues, test your interface and server setup to debug and refine your code.

<!-- 4 line breaks between TODOs -->

<br><br><br><br>

## Simulation Server

**This server will simulate a temperature sensor. The file for this server is `sim-server.js`.**

This server consists of three parts:

1. A temperature simulator that generates a pseudo-random temperature.
2. A server that responds to `GET` requests with the current temperature.
3. A WebSocket server that broadcasts the current temperature to any connected clients.

### TODO 1: Temperature Simulator

🎯 **Goal:** Simulate a temperature sensor that updates every second with realistic, gradually changing values between `0` and `100`.

---

### Step-by-Step Instructions

1. **Declare Variables**

   - Create a variable called **`temperature`** and set it equal to `72`.
   - Create a variable called **`nextChange`** and set it equal to `0`. This variable will store the previous change in temperature.

2. **Create the `generateTemperature` Function**

   - Define a function named **`generateTemperature`** that updates `temperature` based on a small, random change.
   - Parameters: None.
   - Returns: None.
   - In the function:
     - Generate a random number between **-0.5 and 0.5** and store it in a variable called `changeDifference`:
       ```js
       let change = Math.random() - 0.5;
       ```
     - Update `nextChange` by adding `changeDifference`.
     - Update `temperature` by adding `nextChange`.
     - **Limit the temperature range**:
       - If `temperature` is less than `0`, set `temperature` and `nextChange` to `0`.
       - If `temperature` is greater than `100`, set `temperature` and `nextChange` to `100` and `0` respectively.

3. **Schedule Temperature Updates**
   - Use **`setInterval`** to call `generateTemperature` every second:
     ```js
     setInterval(generateTemperature, 1000);
     ```

> <details> <summary> HOW THIS SIMULATION WORKS </summary>
>
> By adjusting only the change in temperature each time, the simulation creates smoother transitions: if the temperature is rising, it will continue to rise at a gradually changing rate, and similarly for falling temperatures. This gives a realistic effect, where temperature shifts naturally over time.
>
> Example progression:
>
> - Initial `temperature`: 72, `nextChange`: 3
> - Next steps might look like:
>   - `nextChange`: 2.5, `temperature`: 74.5
>   - `nextChange`: 2.0, `temperature`: 76.5
>   - `nextChange`: 1.7, `temperature`: 78.2
> - The temperature’s rising slows gradually, emulating natural fluctuations.
>
> For even more realism, see the **Challenge** section.
>
> </details>

---

### ✅ **Check Your Work!**

1. **Test Temperature Simulation**
   - Add `console.log(temperature);` at the end of `generateTemperature` to print temperature values to the console.
   - Run your server with:
     ```bash
     node sim-server.js
     ```
   - Confirm that the temperature changes every tenth of second within the expected range of 0 to 100.

Once you've checked your work, delete the `console.log` statement to move on to the next step.

<br><br><br><br>

### TODO 2: Regular Polling Server

🎯 **Goal:** Configure the server to respond to `GET` requests with the current temperature in JSON format.

---

### Step-by-Step Instructions

1. **Handle the GET Request**
   - Locate the request listener function and update it to respond to `GET` requests.
   - Inside the function, use `res.writeHead` to set the response content type to `application/json` and the status code to `200`.
   - Use `res.end` to send the current temperature as a JSON object with a key of `value` and the temperature as the value.

> **HINT:** Use `JSON.stringify` to convert the response into JSON format.  
> Example code:
>
> ```js
> res.end(JSON.stringify({ key: value }));
> ```
>
> **Explanation:** `JSON.stringify` takes an object (in this case, `{ value: temperature }`) and converts it into a JSON-formatted string, allowing it to be sent as a response.

---

### ✅ **Check Your Work!**

1. **Test with Postman or a Browser**
   - Start your server with the command:
     ```bash
     node sim-server.js
     ```
   - Use **Postman** or a **web browser** to make a `GET` request to `http://localhost:8080/`.
     - You should see a JSON response containing the current temperature, formatted like this:
       ```json
       { "value": 72 }
       ```
   - **Verify Updates:** Send multiple requests over time to ensure the temperature changes with each request, matching the simulator updates.

Once you see temperature changes in the JSON response, you’re ready to move on!

<br><br><br><br>

## Polling Web Page

**This web page will be split into multiple functionalities. The file for this page is `polling-temp-charts.html`.**

For this page, there will be three charts displaying temperature readings, each updated using different polling methods: regular polling with `$.getJSON`, regular polling using AJAX, and WebSocket polling. Each chart will also show the highest and lowest recorded temperatures for its method.

### TODO 3: Initialize Records Variables

🎯 **Goal:** Set up variables to store the highest and lowest recorded temperatures for each polling method and display them on the web page.

---

### Step-by-Step Instructions

1. **Initialize the Record Variables**

   - Create three objects named **`json`**, **`ajax`**, and **`ws`**. Each object will track the highest and lowest recorded temperatures for its respective polling method, as well as store IDs of elements where these values will be displayed.
   - Use the code below to initialize `json`. Create similar objects for `ajax` and `ws`, updating the IDs in each for correct placement.

     ```js
     const json = {
       highest: 0,
       lowest: 100,
       highID: "#json-highest",
       lowID: "#json-lowest",
     };
     ```

     > **Note:** If you modify the simulator’s temperature range, consider adjusting the initial values here, as the initial recorded temperature could be anywhere within the range.

2. **Add Display Elements for Regular Polling (Highest and Lowest)**

   - Use jQuery to add an element displaying the highest recorded temperature for regular JSON polling. This element will be added to the `<div>` with the ID `#json-chart-container`.

     ```js
     $("#json-chart-container").append(
       `<p id=${json.highID}>Highest recorded JSON value is ${json.highest}</p>`
     );
     ```

     > **Explanation:** This jQuery code appends a `<p>` element with `id` of `json.highID` to `#json-chart-container`. The template literal `${}` inserts `json.highest` directly into the display text by using \`backticks\` instead of quotes. If you would prefer to use quotes, you can concatenate the string with `+` instead.

3. **Add Display Elements for Remaining Records**

   - Use similar code to create the other five elements:

     - `json.lowest`
     - `ajax.highest`
     - `ajax.lowest`
     - `ws.highest`
     - `ws.lowest`

   - Ensure each new element is added to the correct div:
     - Use **`#ajax-chart-container`** for AJAX polling records.
     - Use **`#ws-chart-container`** for WebSocket polling records.

---

### ✅ **Check Your Work!**

1. **Verify Initialization**

   - Check that `json`, `ajax`, and `ws` are initialized with correct highest and lowest values and corresponding `highID` and `lowID`.
   - Inspect Elements on the Page:
     - Open your web page and verify that each display element is added in the correct container.
     - Confirm that initial values (e.g., `0` and `100`) display correctly.

2. **Insect Elements on the Page**

   - Open your web page and verify that each display element is added in the correct container:
     - Highest and lowest records for `json` are in `#json-chart-container`.
     - Highest and lowest records for `ajax` are in `#ajax-chart-container`.
     - Highest and lowest records for `ws` are in `#ws-chart-container`.
   - Confirm that initial values (e.g., `0` and `100`) display correctly.

Once you see the records displayed on the page, you’re ready to move on!

<br><br><br><br>

### TODO 4: Update Records Functions

🎯 **Goal:** Create functions to update high and low temperature records for each polling method. Choose whether to write a separate function for each method or a single flexible function that can handle all three.

---

### Step-by-Step Instructions

1. **Create the `updateJSONRecords` Function**

   > **BEFORE YOU BEGIN:** Below is an example of how to create an `updateJSONRecords` function. If you would rather create a single function to handle all polling methods, you can skip this step and move on to option B in step 2. However, reviewing this example may help you understand how to structure the combined function.

   - Define a function named **`updateJSONRecords`** (or simply `updateRecords` if you’re creating a single function for all polling methods).
   - **Parameters**: `value` (the current temperature reading from the sensor).
   - **Description**: This function should:
     - Check if the current `value` is higher than the stored highest value or lower than the stored lowest value.
     - If so, update the stored highest or lowest values.
     - Update the corresponding elements on the web page with the new high or low temperature.

   **Example Code**:

   ```js
   function updateJSONRecords(value) {
     if (value > json.highest) {
       json.highest = value;
       $("#json-highest").text(`Highest recorded value is ${json.highest}`);
     }
     if (value < json.lowest) {
       json.lowest = value;
       $("#json-lowest").text(`Lowest recorded value is ${json.lowest}`);
     }
   }
   ```

2. **Create Update Functions for AJAX and WebSocket Records**

   - **Option A**: Write separate functions, `updateAJAXRecords` and `updateWSRecords`, following the same structure as `updateRegRecords`.
   - **Option B**: Create a single function, `updateRecords`, that can handle all three types of polling by:
     - Adding a second parameter, which accepts the relevant object (`json`, `ajax`, or `ws`).
     - Modifying the function to check and update high and low values in the specified object.
     - **NOTE:** If you choose this option and also completed step 1, you can simply rename `updateJSONRecords` to `updateRecords` and adjust the function to use that second parameter.

<br><br><br><br>

### TODO 5: Regular Polling

🎯 **Goal:** Set up regular polling to retrieve temperature data from the server and update the corresponding data chart and record displays on the web page.

---

### Step-by-Step Instructions

1. **Create the `doJSONPoll` Function**

   - Define a function named **`doJSONPoll`** to handle regular polling.
   - Inside this function, call `$.getJSON` with `localhost:8080/` as the URL and provide a callback function with a parameter named `result`.

   ```js
   $.getJSON("http://localhost:8080/", function (result) {
     // Callback code will go here in the next steps
   });
   ```

2. **Program the Callback Function**

   - Inside the callback function for `$.getJSON`, add the following steps:

     - **Add Data Point**: Call the `addDataPoint` function to add the temperature reading to the regular polling chart.
     - **Update Records**: Call `updateRegRecords` (or your consolidated records function) with `result.value` to update the high and low temperature records.

3. **Activate the Polling Function**

   - Use `setInterval` to call `doJSONPoll` every 5 seconds (5000 ms) to update the chart and records with new temperature data.

     > **NOTE:** You may adjust the interval to a different value if you wish, but be sure not to set it below 1000 ms.

---

### ✅ **Check Your Work!**

1. **Start the Server and Open the Web Page**

   - Run your server with:
     ```bash
     node sim-server.js
     ```
   - Open `polling-temp-charts.html` in a browser.

2. **Verify Chart Updates**

   - Observe the top chart on your page. It should update every 5 seconds (or your set interval), displaying new temperature values.
   - Confirm High and Low Records:
     - Check that the highest and lowest recorded temperatures update in real time as the chart refreshes, displaying realistic values based on the polling data.

Once you’ve confirmed that the chart updates and that high and low records display correctly, you’re ready to move on!

<br><br><br><br>

### TODO 6: AJAX Polling

🎯 **Goal:** Set up an AJAX polling function to retrieve temperature data from the server and update the corresponding chart and record displays on the web page.

---

### Step-by-Step Instructions

1. **Create the `doAJAXPoll` Function**

   - Define a function named **`doAJAXPoll`** to handle AJAX polling.
   - Inside this function, use `$.ajax` with an object containing the following properties:
     - **`url`**: `"http://localhost:8080/"`.
     - **`method`**: `"GET"`.
     - **`dataType`**: `"json"`.
     - **`success`**: A callback function with `result` as its parameter, where you’ll define how to handle a successful response.

   Example skeleton:

   ```js
   $.ajax({
     url: "http://localhost:8080/",
     method: "GET",
     dataType: "json",
     success: function (result) {
       // Fill in the body of the success function
     },
   });
   ```

2. **Program the Success Function**

   - Inside the success callback, add these three steps:

     - **Add Data Point**: Call `addDataPoint` to add the temperature reading to the AJAX polling chart.
     - **Update Records**: Call `updateAJAXRecords` (or `updateRecords`, if using a combined function) with `result.value` to update the high and low records.

3. **Activate the Polling Function**

   - Use `setInterval` to call `doAJAXPoll` every 10 seconds (10000 ms) to update the chart and records with new temperature data.

     > **NOTE:** You may adjust the interval to a different value if you wish, but be sure not to set it below 1000 ms or equal to your JSON polling interval.

---

### ✅ **Check Your Work!**

1. **Start the Server and Open the Web Page**

   - Run your server with:
     ```bash
     node sim-server.js
     ```
   - Open `polling-temp-charts.html` in your browser.

2. **Verify Chart Updates**

   - Observe the middle chart on your page. It should update every 10 seconds (or your chosen interval), displaying new temperature values.
   - Confirm High and Low Records:
     - Check that the highest and lowest recorded temperatures update in real time as the chart refreshes, displaying realistic values based on the AJAX polling data.

Once you’ve confirmed that the chart and records update as expected, you’re ready to move on!

<br><br><br><br>

### TODO 7: WebSocket Server

🎯 **Goal:** Create and configure the WebSocket server to send the current temperature to a connected client whenever the temperature updates.

---

### Step-by-Step Instructions

1. Open the `sim-server.js` file and find TODO 7. There, add the following code to set up a WebSocket server:

   - **Create a WebSocket Server**:

     - Initialize a new WebSocket server on the same port as the HTTP server (8080) using the following code:
       ```js
       const wss = new WebSocket.Server({ server });
       ```

2. **Return Temperature Data to WebSocket Clients**

   - Call `wss.on` with the event type `"connection"` and a callback function that takes `socket` as a parameter.

   - Inside the callback function, use setInterval to send the current temperature to the client every second.

   **Example code:**

   ```js
   setInterval(function () {
     /* Code to send temperature data will go here */
   }, 1000);
   ```

3. **Send Temperature Data to WebSocket Clients**

   - Inside the `setInterval` function, first compare the `socket.readyState` to `WebSocket.OPEN` to ensure the connection is open.

   - If the connection is open, send the current temperature to the client using `socket.send`:

     ```js
       socket.send(/* JSON data with temperature value */);
     }
     ```

   > **HINT:** Refer to how you sent the JSON data in TODO 2 to structure the data you send to the WebSocket client.

> **NOTE:** You will not be able to test the WebSocket connection until you have set up the client-side code in the next TODO.

<br><br><br><br>

### TODO 8: WebSocket Polling

🎯 **Goal:** Set up a WebSocket connection to receive temperature data from the server, update the data chart, and track record high and low temperatures.

---

### Step-by-Step Instructions

1. **Establish the WebSocket Connection**

   - Create a variable named **`socket`** to store the WebSocket connection.
   - Initialize a new WebSocket connection using the following code:

     ```js
     var socket = new WebSocket("ws://<ngrok-url>/pi/sensors/dht/temperature");
     ```

     > **NOTE:** Replace `<ngrok-url>` with the correct URL provided by your instructor, as the ngrok URL changes frequently.

   - Copy and paste the following code to set up functions to handle incoming messages and errors:

     ```js
     socket.onmessage = function (event) {
       // Code for handling temperature data will go here
     };

     socket.onerror = function (error) {
       // Code for handling errors will go here
     };
     ```

---

2. **Handle Incoming Messages**

   - Inside `socket.onmessage`, define the steps to process each new temperature reading:

     1. **Parse the Temperature Data**

        - Extract the temperature from the `event.data` object:
          ```js
          var result = JSON.parse(event.data);
          ```

     2. **Add Data Point to Chart**

        - Use `addDataPoint` to add the current temperature to the WebSocket polling chart:
          ```js
          addDataPoint(result, wsData, wsChart);
          ```

     3. **Update High and Low Records**
        - Call `updateWSRecords` (or your consolidated `updateRecords` function) with `result.value` to update the high and low temperature records for WebSocket polling.

---

3. **Handle WebSocket Errors**
   - Inside `socket.onerror`, add a single line to log the error to the console:
     ```js
     console.error("WebSocket error:", error);
     ```

---

### ✅ **Check Your Work!**

1. **Start the Server and Connect to the WebSocket**

   - Run your server with:
     ```bash
     node sim-server.js
     ```
   - Open `polling-temp-charts.html` in the browser.

2. **Verify Chart Updates**

   - Confirm that the WebSocket chart (the third chart on the page) updates with each new temperature reading.

3. **Confirm High and Low Records**
   - Check that the highest and lowest recorded temperatures update as new data arrives, displaying values that reflect the incoming WebSocket data.

Once you’ve confirmed that the WebSocket chart and records update correctly, you’re ready to move on!

<br><br><br><br>

### CHALLENGE 1: More Realistic Simulation

For added realism in the temperature simulator, try adding a variable called **`changeRate`** to further refine temperature changes. Modify the `generateTemperature` function to use this variable to adjust the rate at which `change` varies before each temperature update.

<br><br>

### CHALLENGE 2: Handle PUT Requests

Enhance your server by adding a `PUT` request handler to directly control the simulator’s temperature. When a `PUT` request is received, the server should update `temperature` to the value provided in the request body. This feature will create sudden shifts in temperature on your graphs while maintaining the existing change rate.

<br><br>

### CHALLENGE 3: Make Alerts

Add a temperature alert feature to your web page! Configure an alert to trigger whenever the temperature reaches a critical threshold, such as `0` or `100`. The alert should notify the user of extreme temperatures, and you might consider pausing further alerts or polling until the initial alert is acknowledged.

**TIP:** Use conditions to limit alerts to trigger only once per threshold until dismissed.

---

### Push Reminder

Congratulations on completing the **Interface-inYourFace** project, where you configured multiple polling methods and tracked data with a custom temperature simulator! 🚀 Don’t forget to save your progress by pushing your changes to GitHub:

```bash
git add -A
git commit -m "Completed Interface-inYourFace project"
git push
```
