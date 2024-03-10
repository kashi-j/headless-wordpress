#!/bin/bash

# 外観
# =======================
wp theme delete --allow-root twentytwentyone
wp theme delete --allow-root twentytwentytwo
wp theme delete --allow-root twentytwentythree
wp theme delete --allow-root twentytwentyfour

# プラグイン
# =======================
wp plugin delete --allow-root hello.php
wp plugin delete --allow-root akismet
wp plugin install --allow-root https://downloads.wordpress.org/plugin/query-monitor.3.15.0.zip
wp plugin install --allow-root https://downloads.wordpress.org/plugin/all-in-one-wp-migration.7.79.zip
chown -R www-data:www-data /var/www/html/wp-content/plugins/*