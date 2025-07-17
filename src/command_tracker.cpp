#include "logger.hpp"
#include <fstream>
#include <string>
#include <vector>
#include <algorithm>

static std::vector<std::string> last_commands;

void log_new_commands() {
    std::string history_path = std::getenv("HOME") + std::string("/.bash_history");
    std::ifstream history_file(history_path);
    if (!history_file) return;

    std::vector<std::string> commands;
    std::string line;
    while (std::getline(history_file, line)) {
        commands.push_back(line);
    }

    // Find new commands since last check
    size_t start_idx = 0;
    if (!last_commands.empty()) {
        // Try to find last command index in current history
        auto it = std::search(commands.begin(), commands.end(),
                              last_commands.begin(), last_commands.end());
        if (it != commands.end()) {
            start_idx = std::distance(commands.begin(), it) + last_commands.size();
        }
    }

    for (size_t i = start_idx; i < commands.size(); ++i) {
        if (!commands[i].empty()) {
            log_event("TERMINAL", commands[i]);
        }
    }

    last_commands = commands;
}

