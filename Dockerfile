FROM php:8.2-apache

# Install system dependencies
RUN apt-get update && apt-get install -y  \
    libmcrypt-dev \
    sqlite3 \
    libsqlite3-dev \
    libonig-dev \
    libzip-dev \
    zip \
    nodejs \
    npm

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /var/www/html

COPY app app
COPY bootstrap bootstrap
COPY config config
COPY database database
COPY lang lang
COPY public public
COPY resources resources
COPY routes routes
COPY storage storage
COPY composer.json .
COPY composer.lock .
COPY package.json .
COPY package-lock.json .
COPY vite.config.js .
COPY tsconfig.json .
COPY artisan .
COPY .htaccess .

RUN useradd -u 1000 -ms /bin/bash -g www-data www
RUN chown -R www:www-data /var/www/html

ENV APACHE_DOCUMENT_ROOT /var/www/html/public

RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf
RUN a2enmod rewrite

USER www
RUN composer install

RUN touch /var/www/html/database/db.sqlite

RUN npm install
RUN npm run build

RUN touch .env
RUN echo "DB_DATABASE=/var/www/html/database/db.sqlite" >> .env
RUN echo "DB_CONNECTION=sqlite" >> .env
RUN echo "DB_FOREIGN_KEYS=true" >> .env
RUN echo "APP_KEY=" >> .env

RUN php artisan key:generate
RUN php artisan event:cache
RUN php artisan route:cache
RUN php artisan view:cache
RUN php artisan migrate:refresh --force
RUN php artisan db:seed --force

EXPOSE 80
