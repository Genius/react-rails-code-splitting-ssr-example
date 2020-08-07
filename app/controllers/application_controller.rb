class ApplicationController < ActionController::Base
  helper_method :react_cache_key

  def react_cache_key
    [webpack_cache_key, request.path].join('/')
  end

  def webpack_cache_key
    server_loadable = JSON.parse Webpacker.config.public_output_path.join('server-loadable-stats.json').read
    client_loadable = JSON.parse Webpacker.config.public_output_path.join('client-loadable-stats.json').read
    ['webpack', server_loadable['hash'], client_loadable['hash']].join('/')
  end
end
