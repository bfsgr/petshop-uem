FROM php:8.2-fpm

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

WORKDIR /var/www

COPY app /var/www/app
COPY bootstrap /var/www/bootstrap
COPY config /var/www/config
COPY database /var/www/database
COPY lang /var/www/lang
COPY public /var/www/public
COPY resources /var/www/resources
COPY routes /var/www/routes
COPY storage /var/www/storage
COPY composer.json /var/www
COPY composer.lock /var/www
COPY package.json /var/www
COPY package-lock.json /var/www
COPY vite.config.js /var/www
COPY tsconfig.json /var/www
COPY artisan /var/www

RUN useradd -u 1000 -ms /bin/bash -g www-data www
RUN chown -R www:www-data /var/www
USER www

RUN composer install

RUN touch /var/www/database/db.sqlite

RUN npm install
RUN npm run build

COPY .env.production /var/www/.env

RUN php artisan key:generate
RUN php artisan config:cache
RUN php artisan event:cache
RUN php artisan route:cache
RUN php artisan view:cache
RUN php artisan migrate:refresh --force
RUN php artisan db:seed --force

EXPOSE 9000
CMD ["php-fpm"]