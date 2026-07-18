FROM golang:1.26-alpine AS builder

WORKDIR /app

# Copy go mod and sum files from the backend directory
COPY backend/go.mod backend/go.sum ./

# Download dependencies
RUN go mod download

# Copy the rest of the backend source code
COPY backend/ .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o /api ./cmd/api

# Create a minimal production image
FROM alpine:latest

WORKDIR /app

# Copy the binary from the builder stage
COPY --from=builder /api /app/api

# Railway automatically assigns and routes to the dynamic PORT variable
# EXPOSE is removed to prevent port routing conflicts

# Run the binary
CMD ["/app/api"]
