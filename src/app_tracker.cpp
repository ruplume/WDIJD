#include "logger.hpp"
#include <fstream>
#include <iostream>
#include <set>
#include <string>
#include <filesystem>
#include <algorithm>
void log_running_apps() {
    std::set<std::string> apps;

    for (const auto& dirEntry : std::filesystem::directory_iterator("/proc")) {
        if (!dirEntry.is_directory())
            continue;
        const auto& path = dirEntry.path().filename().string();

        if (!std::all_of(path.begin(), path.end(), ::isdigit))
            continue;

        std::string comm_path = "/proc/" + path + "/comm";
        std::ifstream comm_file(comm_path);
        if (comm_file) {
            std::string appName;
            std::getline(comm_file, appName);
            apps.insert(appName);
        }
    }

    log_event("APPS", "Running processes:");
    for (const auto& app : apps) {
        log_event("APPS", app);
    }
    log_event("APPS", "----");
}

