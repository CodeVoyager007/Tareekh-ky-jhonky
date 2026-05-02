# Step 1: Build the React frontend
FROM node:20-slim AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Build the Python backend
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies if needed (e.g., for some python packages)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY rag-backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code from the rag-backend subdirectory to the root of the container
COPY rag-backend/ .

# Copy the built frontend from the builder stage into a 'static' directory
COPY --from=frontend-builder /app/dist ./static

# Ensure the DB is initialized if necessary (optional depending on implementation)
# RUN python -c "from rag.database import HeritageDatabase; HeritageDatabase().ingest_all()"

# Expose port (Cloud Run uses 8080 by default)
EXPOSE 8080

# Environment variables
ENV PORT=8080
ENV NODE_ENV=production

# Start the FastAPI server using uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
