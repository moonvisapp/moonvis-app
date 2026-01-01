FROM node:20-alpine

WORKDIR /app

# Copy package definition files
COPY package.json package-lock.json ./

# Install dependencies cleanly based on lockfile
RUN npm ci

# Copy application source
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
