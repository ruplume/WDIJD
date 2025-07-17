# Compiler and flags
CXX = g++
CXXFLAGS = -std=c++17 -Wall -O2

# Source files
SRCS = main.cpp logger.cpp window_tracker.cpp app_tracker.cpp command_tracker.cpp
OBJS = $(SRCS:.cpp=.o)

# Executable name
TARGET = whatdidido

# Build target
all: $(TARGET)

$(TARGET): $(OBJS)
	$(CXX) $(CXXFLAGS) -o $@ $^

log_viewer: log_viewer.cpp
	$(CXX) $(CXXFLAGS) -lncurses -o log_viewer log_viewer.cpp

# Clean up build artifacts
clean:
	rm -f $(OBJS) $(TARGET)

