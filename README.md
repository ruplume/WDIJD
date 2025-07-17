# What Did I Just Do?
###### Prerequisite: This only works for Linux!
What Did I Just Do (or WDIJD for short) is for logging commands, windows, and apps.

## How to use WDIJD
###### (Tested only on X11, may or may not work for Wayland.)

Clone the repo to your machine.
  
    git clone https://github.com/ruplume/WDIJD

Enter the directory and build.

    cd WDIJD
    makefile

Run the Executable.

    ./wdijd

You just logged your commands!

## Extra information

### Where do the logs save?

  In your home directory under the name "whatdidido"

### How do I use the config file?

  Enter the file "config.hpp" with a text editor, and you can change each to your liking

    #pragma once
   
    struct TrackerConfig {
       bool trackCommands = true;
       bool trackActiveWindow = true;
       bool trackRunningApps = true;
    };
