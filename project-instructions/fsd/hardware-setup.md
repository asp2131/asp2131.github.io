# hardware-setup

### Attach sensors and actuators to your Pi

**Table of Contents**

- [Project Setup](#project-setup)
- [BEFORE YOU BEGIN](#before-you-begin)
- [Lesson Steps](#lesson-steps)
  - [The Breadboard](#the-breadboard)
  - [The PIR Sensor](#the-pir-sensor)
  - [The DHT Sensor](#the-dht-sensor)
  - [The LEDs](#the-leds)

---

## Project Setup

1. **Navigate to the project folder**

   - Open your terminal on the Raspberry Pi, and make sure you are in the correct GitHub repo folder.
   - If you just finished setup, you should already be there. If not, use `cd` to enter the repo folder.

2. **Install dependencies**
   - Run the following commands to enter the test folder and install necessary packages:
     `bash
cd iot-projects/hardware-setup/tests
npm install onoff node-dht-sensor epoll
`
     <br><br>

## Grading

Each TODO in this project is worth **15%** of the total grade, except for the Breadboard TODO, which is worth **10%**.

---

## Lesson Steps

This project involves four rounds of hardware setup:

1. **Breadboard Setup:** Prepare a breadboard as the foundation for your circuits.
2. **PIR Sensor:** Attach an infrared motion detector.
3. **DHT Sensor:** Connect a dual temperature/humidity sensor.
4. **LEDs:** Set up a pair of LEDs for visual indicators.

After completing each round involving sensors or LEDs, you will create a small program to test the hardware setup so far.

> ### Important:
>
> All programs must be run on your Raspberry Pi. You can write the code on a different machine, but you’ll need to copy it to the Pi for testing.

<br>

> **NOTE:** For all steps, refer to the image below of your Pi’s GPIO (General-Purpose Input/Output) layout. Keeping a copy open in a separate tab may be useful to avoid excessive scrolling.

<div style="text-align: center;">
  <img src="https://raw.githubusercontent.com/OperationSpark/images/refs/heads/master/hs-curriculum/iot-projects/pi-gpio.png" alt="Raspberry Pi GPIO Layout" style="max-width: 400px;">
</div>

---

### Step-by-Step Work Flow

1. 📂 **Open the `hardware-setup` directory** to begin connecting your components.

   - 🔍 Follow each TODO carefully as you proceed through the hardware setup instructions.
   - Each TODO will guide you through connecting components or testing your setup.

2. **Test and Verify Your Setup**

   - After each hardware setup TODO, check the **Check Your Work** section to ensure everything is connected and functioning as expected.

3. 🖥️ **Use the “Check Your Work” Section for Each TODO**
   - These sections will provide test steps or verification tips, helping you troubleshoot and confirm that each component is correctly connected before moving on.

---

<table style="width: 80%; margin-left: auto; margin-right: auto; border-collapse: collapse; margin-top: 15px; background-color: #2c2c2c; border: 1px solid #444; border-radius: 8px; overflow: hidden;">
  <tr>
    <th style="text-align: left; padding: 10px; background-color: #444; color: #e2e2e2; border-bottom: 1px solid #666;">
      💡 Key Reminders
    </th>
  </tr>
  <tr>
    <td style="padding: 10px; color: #e2e2e2;">
      - ⚙️ Follow each TODO closely to ensure components are correctly connected.<br>
      - 🖥️ Test your setup regularly using the "Check Your Work" sections.
    </td>
  </tr>
</table>

---

<br>

### ✅ **Check Your Work!**

- After completing each TODO, verify that your connections and components are working as expected.
- Use the instructions in the “Check Your Work” section to confirm your setup is correct before moving on.

<!-- 4 line breaks between TODOs -->

<br><br><br><br>

### BEFORE YOU BEGIN

> There are three essential things to keep in mind before starting with the hardware setup:
>
> 1. **Follow Pin Locations Carefully:** It is extremely important to connect wires to the exact pins and locations specified in the instructions. If connections aren’t exact, the setup won’t function as intended.
>
> 2. **Don’t Worry About Mistakes:** If something doesn’t work, it’s okay! Plugging wires into the wrong pins won’t damage the hardware—it just won’t work as expected. If needed, double-check your connections and try again.
>
> 3. **Understand GPIO vs. Pin Numbers:** Keep in mind that GPIO pin numbers do not match the physical pin numbers. For example, physical pin 7 corresponds to GPIO pin 4. This mismatch occurs because some pins aren’t GPIO and the GPIO numbers aren’t sequential.

<br><br><br><br>

## The Breadboard

Your first task is to set up the breadboard, which will act as an intermediary between your sensors and the Pi. While the breadboard isn’t strictly necessary with only two sensors, this setup will make it easier to add more components in the future.

### Lesson Steps

1. **Connect the Power Row**

   - Connect a wire from **Pin 2** on the Pi to one of the **+ rows** on the breadboard.

2. **Connect the Ground Row**
   - Connect a wire from **Pin 6** on the Pi to one of the **- rows** on the breadboard.

That’s it! Your breadboard is now powered and ready to support additional hardware connections.

<br><br><br><br>

## The PIR Sensor

The first sensor to attach is the **passive infrared sensor** (PIR). After connecting the hardware, you’ll write a short program to test the sensor.

### Lesson Steps

1. **Identify the Prongs**

   - With the prongs facing up and closest to you:
     - **Right prong**: Ground
     - **Middle prong**: Signal
     - **Left prong**: VDC (power)

2. **Connect Ground to the Breadboard**

   - Connect a wire from the **ground prong** on the PIR to the **- row** on the breadboard (the same row connected to the Pi’s ground).

3. **Connect VDC to the Power Row**

   - Connect a wire from the **VDC prong** to the **powered + row** on the breadboard (the row connected to the Pi’s power).

4. **Connect Signal to the Pi**
   - Connect a wire from the **signal prong** directly to **Pin 7** on the Pi.

---

### ✅ Check Your Work

To test the PIR sensor, run your program on the Pi:

```bash
node pir.js
```

If both the hardware and program are set up correctly (and you’re running this on the Pi, not your desktop), you should see messages appear in your terminal when the sensor detects motion.

<br><br><br><br>

## The DHT Sensor

The second sensor to attach is the dual humidity temperature sensor (DHT). Specifically, we are using the DHT-22, so be sure to specify this model when writing programs that interact with it. Just as with the PIR sensor, you’ll connect the hardware and then create a test program to verify the connections.

### Lesson Steps

> **IMPORTANT:** There are two types of DHT sensors, so check your sensor to determine which instructions to follow.

#### **If your sensor has four prongs:**

With the grill of the device facing up and the prongs closest to you:

- **Prong 1 (VDC)**: Power
- **Prong 2**: Signal
- **Prong 3**: Unused
- **Prong 4**: Ground

1. Connect the **VDC prong** to the breadboard’s **+ row**.
2. Connect the **ground prong** to the **- row**.
3. Connect the **signal prong** directly to **Pin 11** on the Pi.

#### **If your sensor has wires attached:**

- **Red wire**: VDC (Power)
- **Yellow wire**: Signal
- **Black wire**: Ground

1. Connect the **red wire** to the breadboard’s **+ row**.
2. Connect the **black wire** to the **- row**.
3. Connect the **yellow wire** directly to **Pin 11** on the Pi.

---

### ✅ Check Your Work

To test your DHT sensor setup, run the following command on the Pi:

```bash
node dht.js
```

If everything is connected properly, you should see temperature and humidity readings in your console.

<br><br><br><br>

## The LEDs

The final hardware setup involves attaching two LEDs to your breadboard. You’ll need one **330-ohm resistor** for each LED, so make sure you have the correct components.

### Lesson Steps

LEDs plug directly into the breadboard. Each column on the breadboard is connected internally, so by placing wires and resistors in the same column as an LED pin, you can complete the circuit without direct wiring.

1. **Attach the First LED**

   - Insert the LED into the breadboard so both pins are in the same lettered row (e.g., row E).
   - Identify the **longer pin** as the **anode** and the **shorter pin** as the **cathode**.

2. **Connect the First LED to Power and Ground**

   - Connect a wire from **Pin 40** on the Pi to the same column as the **LED’s anode**.
   - Connect a **330-ohm resistor** between the breadboard’s **- row** and the column with the **LED’s cathode**.

3. **Attach the Second LED**

   - Insert the second LED into the breadboard in a different, unused column.
   - Again, identify the **anode** (longer pin) and **cathode** (shorter pin).

4. **Connect the Second LED to Power and Ground**
   - Connect a wire from **Pin 36** on the Pi to the same column as the **second LED’s anode**.
   - Connect a **330-ohm resistor** between the breadboard’s **- row** and the column with the **second LED’s cathode**.

---

### ✅ Check Your Work

To test the LEDs, run the following command on your Pi:

```bash
node blink.js
```

If everything is connected properly, both LEDs should blink.

<br><br><br><br>

## Bonus Challenges

### Basic Bonus

If you finish early, try programming different blinking patterns for your LEDs. Make them alternate, create unique timing patterns, or come up with something creative!

### Super Bonus

Create a program that uses sensor data to control the LEDs:

- **PIR Sensor**: Write code to toggle one LED when the PIR sensor detects motion. If the LED is off when motion is detected, turn it on—and vice versa.
- **DHT Sensor**: Use a threshold (temperature or humidity) to control the second LED. Use `parseFloat()` to convert the sensor reading to a number and turn on the LED when the reading crosses a certain level. Ensure the LED turns off when the value drops below the threshold.

> **WARNING:** Make sure your code shuts off the LEDs if the program exits.

---

## Push Reminder

Once you’ve completed and tested your setup, remember to save your progress on GitHub with the following commands:

```bash
git add -A
git commit -m "saving hardware-setup"
git push
```
