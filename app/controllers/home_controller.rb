class HomeController < ApplicationController
  def index
    add_header()
  end

  def settings
    session[:locale] = params[:locale]
    add_header()
  end
end
