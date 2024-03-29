本リポジトリは Wordpress の WPGraphQL を利用し,ヘッドレス化している。フロントは next.js をフレームワークとして採用している。

# ディレクトリーツリー

front 配下で next.js、wp 配下で wordpress を構築する。
DocumentRoot  
├── front // next.js 配下  
│   ├── README.md  
│   ├── components  
│   │   ├── atoms  
│   │   │   ├── button  
│   │   │   ├── image  
│   │   │   │   └── CommonImage.tsx  
│   │   │   ├── label  
│   │   │   │   └── CategoryLabel.tsx  
│   │   │   └── text  
│   │   │   ├── ArticleOnListHeading.tsx  
│   │   │   ├── DateText.tsx  
│   │   │   └── PostHeading.tsx  
│   │   ├── molecules  
│   │   │   ├── Pagination.tsx  
│   │   │   └── PostBox.tsx  
│   │   ├── organisms  
│   │   │   ├── Footer.tsx  
│   │   │   └── Header.tsx  
│   │   └── templates  
│   │   └── Layout.tsx  
│   ├── constants  
│   │   ├── PaginationConst.ts  
│   │   ├── PostConst.ts  
│   │   └── WpGraphQlConst.ts  
│   ├── hooks  
│   │   └── swr  
│   │   ├── usePostListSwr.ts  
│   │   └── usePostSwr.ts  
│   ├── next-env.d.ts  
│   ├── next.config.mjs  
│   ├── node_modules  
│   ├── package-lock.json  
│   ├── package.json  
│   ├── pages  
│   │   ├── \_app.tsx  
│   │   ├── \_document.tsx  
│   │   ├── api  
│   │   │   └── hello.ts  
│   │   └── post  
│   │   ├── [slug].tsx  
│   │   └── params  
│   │   └── [...param].tsx  
│   ├── postcss.config.js  
│   ├── public  
│   │   ├── favicon.ico  
│   │   ├── next.svg  
│   │   └── vercel.svg  
│   ├── repositories  
│   │   ├── PostRepository.ts  
│   │   ├── Repository.ts  
│   │   └── RepositoryFactory.ts  
│   ├── services  
│   │   └── PostService.ts  
│   ├── styles  
│   │   └── globals.css  
│   ├── tailwind.config.ts  
│   ├── tsconfig.json  
│   └── types  
│   ├── CategoryType.ts  
│   ├── FeaturedImage.ts  
│   ├── OffsetPaginationType.ts  
│   ├── PostOnListType.ts  
│   └── PostType.ts  
├── readme.md  
└── wp // wordpress 配下
├── bp  
 │   └── localhost-20240311-013716-u7bis7.wpress  
 ├── docker-compose.yml  
 ├── php.ini  
 ├── wp-install.sh  
 └── wp-next-theme  
 ├── functions.php  
 ├── index.php  
 └── style.css

<br>

# Wordpress の環境構築手順

## 環境情報

（2024.03.24 時点）  
PHP: 8.2.12  
Wordpress: 6.4.3  
Web サーバー: Apache  
DB: mysql 8.0

## 要件

- 統合開発環境に VScode を使用
- Docker for Desktop をインストール済みであること

## 1.プラグインのインストール・有効化

プロジェクトを VScode より起動すると、推奨プラグインをインストールするサジェストが表示されるので、インストール・有効化する。  
※サジェストがない婆は左ペインの「拡張機能」より推奨プラグインをインストールする。

## 2.環境変数を設置する

.env（git 管理外） をルートディレクトリに配置する。

## 3.イメージ生成/コンテナ起動

docker for desctop が起動していることを確認後、ターミナルで docker-compose.yml が配置されているディレクトリへ移動し、下記コマンドを実行（イメージ生成、コンテナ起動）

```
cd wp
docker-compose up -d
```

上記のコマンドでコンテナが正常に起動しない or エラーが生じる等の場合は、下記の項目に該当しないかチェックする

- 環境構築に用いるファイルの改行コードが lf になっているか。（crlf だと正常に起動できない場合がある）  
  ※vscode のプラグイン「editorconfig」が入っていれば、保存時（Ctrl+s）に整形処理が働く
- 他ツールの仮想環境で使用中のポート番号と重複していないか
- 環境構築に必要なファイルに不足はないか。

※設定ファイルに変更を加えた場合は下記コマンドで再立ち上げする

```
docker-compose up -d --build
```

## 4.仮のサイト情報を設定する

docker for desctop の wordpress コンテナに指定されているポート番号へアクセスし、言語設定や任意のユーザ名、パス、サイト情報を登録し、管理画面へアクセスする。
※後述するバックアップファイルのインポートでこの設定内容は上書きされるので、仮のものと考えて良い。

## 5.プラグインのインストール

管理画面左ペインより、「プラグイン(plugin)」を選択し、「新規プラグインを追加」で「all in one wp-migration」を検索、インストール、有効化する

## 6.バックアップファイルのインポート

「All-in-one WP Migration」>> 「インポート」より、DB、メディア、プラグイン、記事情報等を含んだバックアップファイルファイル指定する。  
※このバックアップファイルにテーマファイルが含まれていると、theme 配下の.git が消えてしまうため、バックアップファイルにテーマファイルは含めないこと。

## 7.再ログイン

インポート後はブラウザを再読み込みし、.env に記載されたユーザ名、パスワードを入力する。  
各ページが問題なく表示できていれば環境構築完了
<br>
<br>

# バックアップファイルの作成

プラグイン情報やフィールドの追加など、DB まわりの修正が行われた場合は、バックアップファイルを生成し、Backlog などで更新・管理すること。

◾️ バックアップファイルの作成  
1.「All-in-one WP Migration」>> 「エクスポート」  
2.「高度なオプション」より「テーマをエクスポートしない」にチェックをいれる  
※テーマ配下のコードは Git で取得可能かつ BP ファイルのインストール先で.git を上書いて消してしまうため、エクスポート対象からテーマを外すこと。  
3.生成した BP ファイルはドキュメントルートに残しておく。

※ All in one wp-migration がファイル権限でエラーを起こす場合は所有者、所有者グループを変更する。

```
chown -R www-data:www-data /var/www/html/wp-content/plugins/*
```

<br>
<br>
<br>

# next.js

記事情報の反映には ISR×SWR を採用しており、即時反映が可能となっている。

◾️ 開発モード
fetch が失敗する場合、API のエンドポイントへアクセスできるかを確認する。
できない場合、wordpress の設定が反映されていない可能性がある。一度 wordpress の設定まわりを更新しておくとよい。（一般、パーマリンク、プラグインの設定等）

```
cd front
npm run dev
```

◾️ ビルド

```
npm run build
npm run start
```

# サイトイメージ

![screencapture-localhost-3000-2024-03-26-02_24_01 (1)](https://github.com/kashi-j/headless-wordpress/assets/69555348/6af9f316-da70-4493-a9c7-2d7a579324a7)
