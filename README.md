# react-rails SSR/loadable-components example


setup:
```
rails new --webpack=react --skip-turbolinks app
bundle add react-rails
bundle exec rails generate react:install
yarn add @loadable/component @loadable/server
yarn add -D @loadable/babel-plugin @loadable/webpack-plugin
```

run `./bin/webpack` at least once before running `bundle exec rails s`

(more docs TK) the general idea here is that in order to code split and use SSR at the same time, we need to take advantage of webpack's multi-compiler mode, which webpacker doesn't support out of the box
