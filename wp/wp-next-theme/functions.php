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

// 記事一覧にアイキャッチを追加
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

// 日本語slugを防止（SEO的にも、システム的にもまずいので）
function auto_post_slug( $slug, $post_ID, $post_status, $post_type ) {
	if ( preg_match( '/(%[0-9a-f]{2})+/', $slug ) ) {
	$slug = utf8_uri_encode( $post_type ) . '-' . $post_ID;
	}
	return $slug;
}
add_filter( 'wp_unique_post_slug', 'auto_post_slug', 10, 4 );
