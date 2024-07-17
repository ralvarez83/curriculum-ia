FROM node:22.2.0-alpine as build

LABEL maintainer="rubenag83@gmail.com"
LABEL aaplication="curriculum-ia"

WORKDIR /app

COPY package.json .

RUN npm install

COPY tsconfig.* .
COPY vite.config.ts .
COPY tailwind.config.js .
COPY postcss.config.js .
COPY index.html .
COPY public /app/public
COPY src /app/src

# COPY nginx/ssl/rubenalvarezgonzalez.cer /etc/nginx/ssl/certificado.cer
# COPY nginx/ssl/_.rubenalvarezgonzalez.eu_private_key.key /etc/nginx/ssl/clave-privada.key
# COPY nginx/ssl/rubenalvarezgonzalez-ca-bundle.crt /etc/nginx/ssl/ca-bundle.crt

RUN npm run build

#FROM node:slim
FROM nginx:stable-bookworm-perl

#COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copia los archivos de certificado y clave privada
# COPY nginx/ssl/rubenalvarezgonzalez.cer /etc/nginx/ssl/certificado.cer
# COPY nginx/ssl/_.rubenalvarezgonzalez.eu_private_key.key /etc/nginx/ssl/clave-privada.key
# COPY nginx/ssl/rubenalvarezgonzalez-ca-bundle.crt /etc/nginx/ssl/ca-bundle.crt

COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# 217.160.0.126