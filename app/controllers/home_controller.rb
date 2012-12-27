class HomeController < ApplicationController
  def index
  end

  def settings
    session[:locale] = params[:locale] if request.post?
  end
end
