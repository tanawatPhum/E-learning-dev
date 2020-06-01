# FROM node:alpine AS builder

# WORKDIR /app

# ADD . .

# RUN npm install && \
#     npm run build

# final image
FROM nginx:alpine

ENV serverSite="http://192.168.0.220"
ENV frontendSite="http://192.168.0.220"
ENV getImage="/api/getImage/?originalPath="



RUN mkdir -p /app
WORKDIR /app
# COPY --from=builder /app/dist/E-learning/ /usr/share/nginx/html/
ADD ./dist/E-learning/ /usr/share/nginx/html/