#include "logger.hpp"
#include "config.hpp"

void log_active_window();
void log_running_apps();
void log_new_commands();

int main() {
    TrackerConfig config;

    log_event("SYSTEM", "WhatDidIDo Tracker started");

    if (config.trackActiveWindow) {
        log_active_window();
    }

    if (config.trackRunningApps) {
        log_running_apps();
    }

    if (config.trackCommands) {
        log_new_commands();
    }

    return 0;
}

