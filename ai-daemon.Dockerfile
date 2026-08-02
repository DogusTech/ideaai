FROM node:22-bullseye

# Install Git
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# We need the GITHUB_TOKEN to clone the private/public repo with push access
# We will use an entrypoint script to clone the repo at runtime, 
# so that the daemon always has the latest code and the .git directory.

COPY scripts/start-daemon.sh /app/start-daemon.sh
RUN chmod +x /app/start-daemon.sh

# Start the script
CMD ["/app/start-daemon.sh"]
