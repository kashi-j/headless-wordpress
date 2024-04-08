<?php
add_theme_support('post-thumbnails');

/*****************************
 * 投稿一覧にスラッグ追加
 *****************************/
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

/*****************************
 * 投稿時の日本語slugを防止
 * （SEO的にも、システム的にもまずいので）
 *****************************/
function auto_post_slug( $slug, $post_ID, $post_status, $post_type ) {
	if ( preg_match( '/(%[0-9a-f]{2})+/', $slug ) ) {
	$slug = utf8_uri_encode( $post_type ) . '-' . $post_ID;
	}
	return $slug;
}
add_filter( 'wp_unique_post_slug', 'auto_post_slug', 10, 4 );

/*****************************
 * theme support
 *****************************/
function my_theme_support() {
  add_theme_support( 'html5', [
    'comment-form',
    'comment-list',
    'search-form',
    'gallery',
    'caption',
    'style',
    'script'
  ] );
  add_theme_support( "post-thumbnails" );
  add_theme_support( 'title-tag' );
  add_theme_support( 'editor-styles' );
  add_theme_support( 'custom-logo' );
  add_theme_support( 'automatic-feed-links' );
  register_nav_menus( [
    'header-navigation' => 'ヘッダー',
    'footer-navigation' => 'フッター',
  ]);
}
add_action( 'after_setup_theme', 'my_theme_support' );

/***************************************
 * デフォルト投稿タイプのラベル変更
 ***************************************/ 
function change_post_labels($args, $post_type){
  if ('post' == $post_type) {
    $args['labels'] = array(
      'name' => 'お知らせ',
      'singular_name' => 'お知らせ',
    );
  }
  return $args;
}
add_filter('register_post_type_args', 'change_post_labels', 10, 2);

/***************************************
 * デフォルト投稿タイプのタクソノミーのラベル変更
 ***************************************/ 
function change_taxonomy_labels($args, $taxonomy) {
  if ('category' == $taxonomy) {
    $args['labels'] = array(
      'name' => 'お知らせカテゴリー',
      'singular_name' => 'お知らせカテゴリー',
    );
  } elseif ('post_tag' == $taxonomy) {
    $args['labels'] = array(
      'name' => 'お知らせタグ',
      'singular_name' => 'お知らせタグ',
    );
  }
  return $args;
}
add_filter('register_taxonomy_args', 'change_taxonomy_labels', 10, 2);