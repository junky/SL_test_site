class ApplicationController < ActionController::Base
  protect_from_forgery
  after_filter :add_header
  
  def set_cache_buster
    response.headers["Cache-Control"] = "no-cache, no-store, max-age=0, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "Fri, 01 Jan 1990 00:00:00 GMT"
  end
      
  def add_header
    response.headers["X-Language-Locale"] = session[:locale] if not session[:locale].nil?
  end
end
