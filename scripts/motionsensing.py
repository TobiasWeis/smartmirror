#!/usr/bin/python
'''
reads regularly from the serial input port (there should be an arduino with a PIR sensor)
and the following udev-rule: 
/etc/udev/rules.d/99-arduino.rules:
SUBSYSTEMS=="usb", ATTRS{idProduct}=="7523", ATTRS{idVendor}=="1a86", SYMLINK+="arduino_motionsensor"

reads either 0 (no move) or 1 (movement detected)
will control the monitor once the pulse-eight adapter arrives
'''
import serial
import time
import os

_keep_on_min = 10 # number of minutes 

ser = serial.Serial()
ser.baudrate = 9600
ser.port = '/dev/arduino_motionsensor'
ser.open()

last_move = 0
state = 0

while True:
    res = ser.readline()

    if state == 1 and time.time() - last_move > _keep_on_secs*60:
        os.system("echo \"standby 0\" | cec-client -s")
        print "[",time.time(),"] Turning off!"
        state = 0

    if not "0" in res:
        last_move = time.time()

    if "0" not in res and state == 0:
        # reload the website, to show tagesschau from beginning again
        os.system("export DISPLAY=:0 && xdotool key F5")

        print "[", time.time(), "] Turning on!"
        os.system("echo \"as 1\" | cec-client -s")
        last_move = time.time()


        state = 1
ser.close()
