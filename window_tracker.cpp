#include "logger.hpp"
#include <cstdlib>
#include <memory>
#include <array>

std::string exec_command(const std::string& cmd) {
    std::array<char, 128> buffer;
    std::string result;
    std::unique_ptr<FILE, decltype(&pclose)> pipe(popen(cmd.c_str(), "r"), pclose);
    if (!pipe) return "";
    while (fgets(buffer.data(), buffer.size(), pipe.get()) != nullptr) {
        result += buffer.data();
    }
    return result;
}

void log_active_window() {
    std::string title = exec_command("xdotool getwindowfocus getwindowname 2>/dev/null");
    if (!title.empty()) {
        // Trim trailing newlines
        title.erase(title.find_last_not_of(" \n\r\t")+1);
        log_event("WINDOW", title);
    }
}

