# $(git config --get remote.origin.url | shasum | cut -d \" \" -f 1)/$(git rev-parse HEAD)

#!/bin/bash

# Get the git repository URL
repo_url=$(git config --get remote.origin.url)

# Get the commit hash
commit_hash=$(git rev-parse HEAD)

# Generate a unique hash based on the repository URL and commit hash
unique_hash=$(echo "$repo_url$commit_hash" | shasum | cut -d " " -f 1)


# Set the CACHE_DIR environment variable
export CACHE_DIR=".turbo/$unique_hash"
echo ".turbo/$unique_hash"

