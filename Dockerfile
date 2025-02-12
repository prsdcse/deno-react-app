FROM denoland/deno:1.39.1

WORKDIR /app

# Copy dependency files first
COPY import_map.json deno.json ./

# Initialize deno.lock file
RUN deno cache --import-map=import_map.json --lock-write https://esm.sh/react@18.2.0

# Copy source files needed for caching
COPY src/ ./src/
COPY dev.ts server.ts ./

# Cache dependencies with the lock file
RUN deno cache --import-map=import_map.json --reload --lock=deno.lock dev.ts server.ts

# Copy the rest of the application
COPY . .

# Create the dist directory
RUN mkdir -p dist

# Compile the application
RUN deno task build

EXPOSE 8000

CMD ["deno", "task", "serve"]
