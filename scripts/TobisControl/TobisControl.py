#!/usr/bin/python
'''
This script listens to a leap motion controller,
calculates if a left- or right-swipe has happened,
and if so simulates a keypress.
'''
import sys
import os
sys.path.append("/usr/lib/Leap")

import Leap, sys, thread, time
from Leap import CircleGesture, KeyTapGesture, ScreenTapGesture, SwipeGesture
import pygame
import numpy as np
#import keyboard

def keypress(key):
    #keyboard.press(key)
    #keyboard.release(key)
    os.system("xdotool key %s" % key)

_debug = False

class SampleListener(Leap.Listener):
    last_hand_ids = []
    last_action = 0
    myhands = {}

    def on_init(self, controller):
        print "Initialized"

    def on_connect(self, controller):
        print "Connected"

    def on_disconnect(self, controller):
        print "Disconnected"

    def on_exit(self, controller):
        print "Exited"

    def on_frame(self, controller):
        frame = controller.frame()

        if _debug:
            print "Frame id: %d, timestamp: %d, hands: %d, fingers: %d, tools: %d, gestures: %d" % (
                  frame.id, frame.timestamp, len(frame.hands), len(frame.fingers), len(frame.tools), len(frame.gestures()))

        # Get hands
        current_hand_ids = []

        for hand in frame.hands:
            current_hand_ids.append(hand.id)

            if hand.id not in self.myhands.keys():
                pygame.mixer.init()
                pygame.mixer.music.load("/home/sarah/scripts/TobisControl/info.wav")
                pygame.mixer.music.play()
                self.myhands[hand.id] = {}
                self.myhands[hand.id]["lastaction"] = 0
                self.myhands[hand.id]["coords"] = np.empty((0,3), np.float64) 

            ppos = np.array([[hand.palm_position[0], hand.palm_position[1], hand.palm_position[2]]])
            self.myhands[hand.id]["coords"] = np.append(self.myhands[hand.id]["coords"], ppos, axis=0)

            # SWIPE STUFF
            x_move = np.sum(np.diff(self.myhands[hand.id]["coords"][-20:, 0]))
            z_move = np.sum(np.diff(self.myhands[hand.id]["coords"][-20:, 1]))

            if self.myhands[hand.id]["coords"].shape[0] > 20 and time.time() - self.myhands[hand.id]["lastaction"] > 1:
                if x_move < -150.:
                    keypress("Right")
                    self.myhands[hand.id]["coords"] = np.empty((0,3), np.float64)
                    self.myhands[hand.id]["lastaction"] = time.time()
                elif x_move > 150.:
                    keypress("Left")
                    self.myhands[hand.id]["coords"] = np.empty((0,3), np.float64)
                    self.myhands[hand.id]["lastaction"] = time.time()
                else:
                    pass

        # cleanup hand-dict
        to_delete = []
        for k in self.myhands.keys():
            if k not in current_hand_ids:
                to_delete.append(k)
        for k in to_delete:
            print "Deleting hand with id: ", k
            del self.myhands[k]

def main():
    # Create a sample listener and controller
    listener = SampleListener()
    controller = Leap.Controller()

    # request optimization for headmounted device
    controller.set_policy(Leap.Controller.POLICY_OPTIMIZE_HMD)

    # Have the sample listener receive events from the controller
    controller.add_listener(listener)

    while True:
        time.sleep(1)

if __name__ == "__main__":
    main()
