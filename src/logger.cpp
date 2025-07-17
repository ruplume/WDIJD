#include "logger.hpp"
#include <fstream>
#include <ctime>
#include <filesystem>
#include <cstdlib>

void ensure_log_dir_exists() {
    std::string log_dir = std::getenv("HOME") + std::string("/whatdidido/logs/");
    std::filesystem::create_directories(log_dir);
}

void log_event(const std::string& tag, const std::string& message) {
    ensure_log_dir_exists();
    std::string path = get_log_filename();
    std::ofstream log_file(path, std::ios_base::app);
    log_file << get_current_timestamp() << " [" << tag << "] " << message << std::endl;
}

std::string get_log_filename() {
    std::string log_dir = std::getenv("HOME") + std::string("/whatdidido/logs/");
    time_t t = std::time(nullptr);
    tm* now = std::localtime(&t);

    char buffer[20];
    strftime(buffer, sizeof(buffer), "%Y-%m-%d", now);

    return log_dir + std::string(buffer) + ".log";
}

std::string get_current_timestamp() {
    time_t t = std::time(nullptr);
    tm* now = std::localtime(&t);

    char buffer[20];
    strftime(buffer, sizeof(buffer), "%F %T", now);

    return std::string(buffer);
}

