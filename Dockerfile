# Étape 1: Construire l'application React
FROM node:16 AS build

WORKDIR /app

# Copier package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers du projet
COPY . .

# Construire l'application
RUN npm run build

# Étape 2: Servir l'application avec un serveur web léger
FROM nginx:alpine

# Copier les fichiers de construction de l'étape précédente
COPY --from=build /build /usr/share/nginx/html

# Copier le fichier de configuration nginx par défaut
COPY nginx.conf /etc/nginx/nginx.conf

# Exposer le port 80
EXPOSE 80

# Commande pour démarrer nginx
CMD ["nginx", "-g", "daemon off;"]
