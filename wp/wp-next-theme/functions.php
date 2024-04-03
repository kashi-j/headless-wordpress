<?php
add_theme_support('post-thumbnails');

/* 投稿一覧にスラッグ追加 */
function add_posts_columns_slug($columns) {
    $columns['slug'] = 'スラッグ';
    return $columns;
}
function add_posts_columns_slug_row($column_name, $post_id) {
    if( $column_name == 'slug' ) {
        $slug = get_post($post_id) -> post_name;
        echo esc_attr($slug);
    }
}
add_filter( 'manage_posts_columns', 'add_posts_columns_slug' );
add_action( 'manage_posts_custom_column', 'add_posts_columns_slug_row', 10, 2 );

function add_featured_image_column_to_posts($columns) {
    $columns['featured_image'] = __('アイキャッチ');
    return $columns;
}
add_filter('manage_posts_columns', 'add_featured_image_column_to_posts');
 
function show_featured_image_column_in_posts($column_name, $post_id) {
    if ('featured_image' === $column_name) {
        $post_featured_image = get_the_post_thumbnail($post_id, 'thumbnail');
        if ($post_featured_image) {
            echo $post_featured_image;
        }
    }
}
add_action('manage_posts_custom_column', 'show_featured_image_column_in_posts', 10, 2);
