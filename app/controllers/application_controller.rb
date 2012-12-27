class ApplicationController < ActionController::Base
  protect_from_forgery
  
  def add_header
    response.headers["X-Language-Locale"] = session[:locale] if not session[:locale].nil?
  end
end
