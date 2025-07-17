# Compiler and flags
CXX = g++
CXXFLAGS = -std=c++17 -Wall -O2

# Source files
SRCS = src/main.cpp src/logger.cpp src/window_tracker.cpp src/app_tracker.cpp src/command_tracker.cpp 
OBJS = $(SRCS:.cpp=.o)

# Executable name
TARGET = wdijd

# Build target
all: $(TARGET)

$(TARGET): $(OBJS)
	$(CXX) $(CXXFLAGS) -o $@ $^

# Clean up build artifacts
clean:
	rm -f $(OBJS) $(TARGET)

