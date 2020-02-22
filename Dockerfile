# FROM node:alpine AS builder

# WORKDIR /app

# ADD . .

# RUN npm install && \
#     npm run build

# final image
FROM nginx:alpine

ENV serverSite="https://smartdoc.alworks.io"
ENV frontendSite="https://smartdoc.alworks.io"
ENV getImage="/api/getImage/?originalPath="



RUN mkdir -p /app
WORKDIR /app
# COPY --from=builder /app/dist/E-learning/ /usr/share/nginx/html/
ADD ./dist/E-learning/ /usr/share/nginx/html/