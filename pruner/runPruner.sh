#!/bin/bash

# Get the current OS
os=$(uname -s)

# Get the current architecture
arch=$(uname -m)

# Check the OS and architecture and run the appropriate pruner binary
if [[ "$os" == "Linux" ]]; then
  if [[ "$arch" == "x86_64" ]]; then
    ./pruner/pruner-amd64-linux "$@"
  elif [[ "$arch" == "aarch64" ]]; then
    ./pruner/pruner-amd64-linux "$@"
  elif [[ "$arch" == "arm64" ]]; then
    ./pruner/pruner-amd64-linux "$@"
  elif [[ "$arch" == "386" ]]; then
    ./pruner/pruner-386-linux "$@"
  else
    echo "Unsupported architecture: $arch"
    exit 1
  fi
elif [[ "$os" == "Darwin" ]]; then
  if [[ "$arch" == "x86_64" ]]; then
    ./pruner/pruner-amd64-darwin "$@"
  elif [[ "$arch" == "aarch64" ]]; then
    ./pruner/pruner-arm64-darwin "$@"
  elif [[ "$arch" == "arm64" ]]; then
    ./pruner/pruner-arm64-darwin "$@"
  else
    echo "Unsupported architecture: $arch"
    exit 1
  fi
else
  echo "Unsupported OS: $os"
  exit 1
fi
