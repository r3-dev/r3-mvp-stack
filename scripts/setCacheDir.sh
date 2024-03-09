# Get the git repository URL
repo_url=$(git config --get remote.origin.url)

# Get the commit hash
commit_hash=$(git rev-parse HEAD)

# Generate a unique hash based on the repository URL and commit hash
unique_hash=$(echo "$repo_url$commit_hash" | shasum | cut -d " " -f 1)

# Set up cache dir
cache_dir=".turbo/$unique_hash"

# Set the CACHE_DIR environment variable
export CACHE_DIR=$cache_dir
echo "$cache_dir"