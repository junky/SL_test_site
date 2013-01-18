class HomeController < ApplicationController
  def index
  end

  def settings
    session[:locale] = params[:locale] if request.post?
  end

  def autosearch
    @results = 'Nothing Found'
    @results = 'Cat found!' if params[:search] == 'cat'
  end

  def redirect
    redirect_to "http://www.somedomain.net"
  end
end
