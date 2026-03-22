FROM mcr.microsoft.com/playwright:v1.58.2-noble
WORKDIR /app
COPY . .
RUN npm install
# Installs browsers AND their OS-level dependencies
RUN npx playwright install --with-deps 
CMD ["npx", "playwright", "test"]
