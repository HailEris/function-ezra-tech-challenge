FROM node:20-bookworm
WORKDIR /app
COPY . .
RUN npm install
# Installs browsers AND their OS-level dependencies
RUN npx playwright install --with-deps 
CMD ["npx", "playwright", "test"]
