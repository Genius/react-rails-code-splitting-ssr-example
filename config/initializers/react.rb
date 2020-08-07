
Rails.configuration.react.server_renderer =
Class.new(React::ServerRendering::BundleRenderer) do
  def before_render(component_name, props, prerender_options)
    loadable_stats = Webpacker.config.public_output_path.join('client-loadable-stats.json').read
    <<-JS
      let manifest = #{loadable_stats};
    JS
  end

  private

  def render_from_parts(before, main, after)
    js_code = compose_js(before, main, after)
    @context.eval(js_code)
  end

  def main_render(component_name, props, prerender_options)
    render_function = prerender_options.fetch(:render_function, 'renderToString')
    "this.ReactRailsUJS.serverRender('#{render_function}', '#{component_name}', #{props}, manifest)"
  end

  def compose_js(before, main, after)
    <<-JS
      (function () {
        #{before}
        let data = #{main};
        let result = data['html'];
        #{after}
        return data;
      })()
    JS
  end
end

Rails.configuration.react.view_helper_implementation =
Class.new(React::Rails::ComponentMount) do
  def setup(*)
    super.tap { init_head_tags }
  end

  private

  def prerender_component(*)
    data = super

    case data
    when Hash
      register_head_tags(data['headTags'].html_safe)
      data['html'].html_safe
    else
      data.html_safe
    end
  end

  def init_head_tags
    @controller.instance_variable_set(:@react_head_tags, '')
  end

  def register_head_tags(tags)
    @controller.instance_variable_get(:@react_head_tags) << tags.to_s
  end
end
