#pragma once
#include <string>

void log_event(const std::string& tag, const std::string& message);
std::string get_log_filename();
std::string get_current_timestamp();
void ensure_log_dir_exists();

