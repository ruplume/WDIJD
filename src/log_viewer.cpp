#include <ncurses.h>
#include <fstream>
#include <vector>
#include <string>
#include <cstdlib>
#include <ctime>
#include <filesystem>

std::string get_log_file_path() {
    std::string log_dir = std::getenv("HOME") + std::string("/whatdidido/logs/");
    std::filesystem::create_directories(log_dir);

    time_t t = std::time(nullptr);
    tm* now = std::localtime(&t);

    char buffer[20];
    strftime(buffer, sizeof(buffer), "%Y-%m-%d", now);
    return log_dir + std::string(buffer) + ".log";
}

std::vector<std::string> load_log_lines(const std::string& path) {
    std::ifstream file(path);
    std::vector<std::string> lines;
    std::string line;
    while (std::getline(file, line)) {
        lines.push_back(line);
    }
    return lines;
}

void show_log_viewer(const std::vector<std::string>& lines) {
    initscr();
    noecho();
    cbreak();
    keypad(stdscr, TRUE);

    int height, width;
    getmaxyx(stdscr, height, width);

    int scroll = 0;
    int ch;

    while (true) {
        clear();
        for (int i = 0; i < height - 1; ++i) {
            int line_idx = scroll + i;
            if (line_idx >= lines.size()) break;
            mvprintw(i, 0, "%s", lines[line_idx].c_str());
        }

        mvprintw(height - 1, 0, "Press ↑ ↓ to scroll, q to quit");

        ch = getch();
        if (ch == 'q' || ch == 'Q') break;
        if (ch == KEY_DOWN && scroll + height - 1 < lines.size()) scroll++;
        if (ch == KEY_UP && scroll > 0) scroll--;
    }

    endwin();
}

int main() {
    std::string path = get_log_file_path();
    auto lines = load_log_lines(path);
    show_log_viewer(lines);
    return 0;
}

